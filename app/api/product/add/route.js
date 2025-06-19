import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "../../../../config/db";
import Product from "../../../../models/Products";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(file, options = {}) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
}

export async function POST(request) {
    try {
        const formData = await request.formData();

        // Extract fields from formData
        const title = formData.get('title');
        const author = formData.get('author');
        const username = formData.get('username');
        const category = formData.get('category');
        const description = formData.get('description');
        const license = formData.get('license');
        const tags = formData.get('tags')?.split(',').map(tag => tag.trim()) || [];

        const modelFile = formData.get('modelFile');
        const previewImage = formData.get('previewImage');
        const images = formData.getAll('images');

        if (!title) {
            return NextResponse.json({ success: false, message: 'Missing required field: title' });
        }

        await connectDB();

        // Upload files to Cloudinary
        let modelUrl = "";
        if (modelFile && typeof modelFile === "object") {
            modelUrl = await uploadToCloudinary(modelFile, { resource_type: "raw" });
        }

        let previewImageUrl = "";
        if (previewImage && typeof previewImage === "object") {
            previewImageUrl = await uploadToCloudinary(previewImage, { resource_type: "image" });
        }

        let imageUploadResults = [];
        if (images && images.length > 0) {
            imageUploadResults = await Promise.all(
                images.map(async (file) => {
                    if (typeof file === "object") {
                        return await uploadToCloudinary(file, { resource_type: "image" });
                    }
                    return null;
                })
            );
            imageUploadResults = imageUploadResults.filter(Boolean);
        }

        // Build the model object
        const now = new Date();
        const model = {
            id: uuidv4(),
            title,
            author: author || "",
            username: username || "",
            category: category || "",
            likes: 0,
            downloads: 0,
            shares: 0,
            status: "verification",
            createdAt: now.toISOString(),
            publishedDate: null,
            description: description || "",
            license: license || "",
            tags,
            modelUrl,
            previewImage: previewImageUrl || imageUploadResults[0] || "",
            images: imageUploadResults,
            relatedModels: [],
            rejectionReason: "",
            adminNotes: ""
        };

        // Save to MongoDB
        const savedProduct = await Product.create(model);

        return NextResponse.json({ success: true, model: savedProduct });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

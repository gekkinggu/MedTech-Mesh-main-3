import mongoose from "mongoose";

const relatedModelSchema = new mongoose.Schema({
    id: String,
    title: String,
    author: String,
    downloads: Number,
    likes: Number,
    shares: Number,
}, { _id: false });

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: String,
    username: String,
    category: String,
    likes: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'verification', 'rejected'], default: 'verification' },
    createdAt: { type: String, required: true },
    publishedDate: String,
    description: String,
    license: String,
    tags: [String],
    modelUrl: String,
    previewImage: String,
    images: [String],
    relatedModels: [relatedModelSchema],
    rejectionReason: String,
    adminNotes: String,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
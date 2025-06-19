"use client"

import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { setUploading, setUploadProgress, resetUpload } from '@/lib/features/upload/uploadSlice';

export function UploadForm() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [username, setUsername] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [license, setLicense] = useState("");
  const [tags, setTags] = useState("");
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setUploading(true));
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (author) formData.append("author", author);
      if (username) formData.append("username", username);
      if (category) formData.append("category", category);
      if (description) formData.append("description", description);
      if (license) formData.append("license", license);
      if (tags) formData.append("tags", tags);
      if (modelFile) formData.append("modelFile", modelFile);
      if (previewImage) formData.append("previewImage", previewImage);
      if (images) {
        Array.from(images).forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await fetch("/api/product/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Upload successful!");
        dispatch(resetUpload());
      } else {
        setMessage("❌ Upload failed: " + data.message);
      }
    } catch (error: any) {
      setMessage("❌ Upload failed: " + error.message);
    } finally {
      dispatch(setUploading(false));
      dispatch(setUploadProgress(0));
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handlePublish}
      className="bg-white shadow-lg rounded-xl p-8 space-y-6 border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Upload New Model</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Model Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Describe your model"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License
          </label>
          <input
            type="text"
            placeholder="License"
            value={license}
            onChange={e => setLicense(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags <span className="text-xs text-gray-400">(comma separated)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. medical, anatomy"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            3D Model File (.stl, .obj, etc)
          </label>
          <input
            type="file"
            accept=".stl,.obj"
            onChange={e => setModelFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preview Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setPreviewImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={e => setImages(e.target.files)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg shadow transition-colors duration-200 flex items-center gap-2"
          disabled={loading}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {loading ? "Uploading..." : "Publish"}
        </button>
      </div>
      {message && (
        <div
          className={`text-center mt-4 font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
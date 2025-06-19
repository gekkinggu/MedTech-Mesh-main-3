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

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setUploading(true));
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
        setMessage("Upload successful!");
        dispatch(resetUpload());
        // Optionally redirect or clear form here
      } else {
        setMessage("Upload failed: " + data.message);
      }
    } catch (error: any) {
      setMessage("Upload failed: " + error.message);
    } finally {
      dispatch(setUploading(false));
      dispatch(setUploadProgress(0));
    }
  };

  return (
    <form onSubmit={handlePublish} className="space-y-4">
      <input type="text" placeholder="Title*" value={title} onChange={e => setTitle(e.target.value)} required className="input" />
      <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className="input" />
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="input" />
      <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="input" />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="input" />
      <input type="text" placeholder="License" value={license} onChange={e => setLicense(e.target.value)} className="input" />
      <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="input" />
      <label>
        3D Model File (.stl, .obj, etc)
        <input type="file" accept=".stl,.obj" onChange={e => setModelFile(e.target.files?.[0] || null)} />
      </label>
      <label>
        Preview Image
        <input type="file" accept="image/*" onChange={e => setPreviewImage(e.target.files?.[0] || null)} />
      </label>
      <label>
        Additional Images
        <input type="file" accept="image/*" multiple onChange={e => setImages(e.target.files)} />
      </label>
      <button type="submit" className="btn btn-primary">Publish</button>
      {message && <div>{message}</div>}
    </form>
  );
}
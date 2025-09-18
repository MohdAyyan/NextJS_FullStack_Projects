"use client"
import React, { useState } from "react";
import FileUpload from "./FileUpload";

function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!title || !description || !videoUrl || !thumbnailUrl) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          thumbnailUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload video");
      }

      setSuccess(true);
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md w-full bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">Upload a Video</h2>
        <label className="block mb-1 font-semibold text-gray-700">Title</label>
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full rounded-lg text-gray-800 p-3 "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <label className="block mb-1 font-semibold text-gray-700">Description</label>
        <textarea
          placeholder="Description"
          className="p-3 textarea textarea-bordered w-full rounded-lg text-gray-800"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Video File</label>
          <FileUpload
            fileType="video"
            onSuccess={(res) => setVideoUrl(res.url || res.filePath)}
            className="block w-full text-gray-800 border-2 border-blue-500 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {videoUrl && (
            <p className="text-green-600 text-sm mt-1">Video uploaded!</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Thumbnail Image</label>
          <FileUpload
            fileType="image"
            onSuccess={(res) => setThumbnailUrl(res.url || res.filePath)}
            className=" block w-full text-gray-800 border-2 border-blue-500 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {thumbnailUrl && (
            <p className="text-green-600 text-sm mt-1">Thumbnail uploaded!</p>
          )}
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">Video uploaded successfully!</p>}
        <button
          type="submit"
          className="btn btn-primary  rounded-lg bg-blue-500 py-2 px-4 w-full font-medium  cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  "
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}

export default VideoUploadForm;
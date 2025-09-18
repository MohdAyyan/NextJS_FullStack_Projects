"use client"; // This component must be a client component

import { upload } from "@imagekit/next";
import {  useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any ) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Get the public key from the environment at build time
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

  const validation = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false; // Return false if invalid
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      return false; // Return false if invalid
    }
    setError(""); // Clear error if valid
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validation(file)) return;

    setUploading(true);
    setError("");

    try {
      const authResponse = await fetch("/api/auth/imagekit-auth");

      if (!authResponse.ok) {
        throw new Error("Failed to fetch authentication data");
      }
      const authData = await authResponse.json();

      if (!publicKey) {
        throw new Error("Missing NEXT_PUBLIC_PUBLIC_KEY");
      }

      const response = await upload({
        file,
        fileName: file.name,
        publicKey, // Use the variable
        signature: authData.signature,
        expire: authData.expire,
        token: authData.token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });

      onSuccess(response);
    } catch (error) {
      console.error("Upload failed", error);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        disabled={uploading}
        className="mb-4"
      />
      {uploading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;

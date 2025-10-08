```javascript
// src/components/GalleryUploader.jsx
import React, { useState } from "react";
import axios from "axios";

export default function GalleryUploader({ onUploaded }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = e => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append("gallery", file));

    try {
      const res = await axios.put("/business/my/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded(res.data.gallery); // Array of URLs
    } catch (err) {
      console.error(err);
      alert("Error uploading gallery");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading…" : "Upload Gallery"}
      </button>
    </div>
  );
}
```
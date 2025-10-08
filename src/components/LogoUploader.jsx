// src/components/LogoUploader.jsx
import React, { useState } from "react";
import axios from "axios";

export default function LogoUploader({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await axios.put("/business/my/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded(res.data.logo);
    } catch (err) {
      console.error(err);
      alert("שגיאה בהעלאת לוגו");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "טוען…" : "העלה לוגו"}
      </button>
    </div>
  );
}

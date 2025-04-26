import React, { useState } from "react";

const UploadBusinessImage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // פונקציה לשינוי קובץ
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // פונקציה להעלאת קובץ ל־Cloudinary
  const handleUpload = async () => {
    if (!file) {
      alert("נא לבחור קובץ להעלאה");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_business"); // preset שהגדרת ב־Cloudinary

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url); // מציג את התמונה המועלת
        alert("התמונה הועלתה בהצלחה!");
      }
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error);
      alert("הייתה שגיאה בהעלאת הקובץ");
    } finally {
      setLoading(false);
    }
  };

 

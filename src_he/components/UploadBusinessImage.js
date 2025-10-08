import React, { useState } from "react";

const UploadBusinessImage = ({ businessId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // פונקציה לשינוי קובץ (לוגו או גלריה)
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
        setImageUrl(data.secure_url); // עדכון ה-URL של התמונה
        alert("התמונה הועלתה בהצלחה!");

        // שליחה לעדכון במסד הנתונים
        await updateLogo(data.secure_url); // עדכון הלוגו ב-Backend
      } else {
        alert("שגיאה: לא התקבל URL לתמונה");
      }
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error);
      alert("הייתה שגיאה בהעלאת הקובץ");
    } finally {
      setLoading(false);
    }
  };

  // שליחה של ה-URL לעדכון הלוגו במסד הנתונים
  const updateLogo = async (url) => {
    try {
      const res = await fetch(`/business/${businessId}/logo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secure_url: url }),
      });

      const data = await res.json();
      if (data.logo) {
        alert("הלוגו עודכן בהצלחה!");
      } else {
        alert("שגיאה בעדכון הלוגו");
      }
    } catch (error) {
      console.error("שגיאה בעדכון הלוגו:", error);
      alert("הייתה שגיאה בעדכון הלוגו");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "ממתין להעלאה..." : "העלה תמונה"}
      </button>

      {imageUrl && (
        <div>
          <h3>התמונה שהועלתה:</h3>
          <img src={imageUrl} alt="Uploaded Business Image" style={{ width: "300px" }} />
        </div>
      )}
    </div>
  );
};

export default UploadBusinessImage;

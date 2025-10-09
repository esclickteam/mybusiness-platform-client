import React, { useState } from "react";

const UploadBusinessImage = ({ businessId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Function for handling file change (logo or gallery)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function for uploading a file to Cloudinary
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_business"); // preset you configured in Cloudinary

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url); // Update image URL
        alert("Image uploaded successfully!");

        // Send update to database
        await updateLogo(data.secure_url); // Update logo in backend
      } else {
        alert("Error: No image URL received");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("There was an error uploading the file");
    } finally {
      setLoading(false);
    }
  };

  // Send URL to update logo in the database
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
        alert("Logo updated successfully!");
      } else {
        alert("Error updating logo");
      }
    } catch (error) {
      console.error("Error updating logo:", error);
      alert("There was an error updating the logo");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded Business Image" style={{ width: "300px" }} />
        </div>
      )}
    </div>
  );
};

export default UploadBusinessImage;

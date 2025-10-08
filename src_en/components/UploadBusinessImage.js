```javascript
import React, { useState } from "react";

const UploadBusinessImage = ({ businessId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Function to change file (logo or gallery)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to upload file to Cloudinary
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_business"); // preset you defined in Cloudinary

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url); // Update the image URL
        alert("Image uploaded successfully!");

        // Send to update in the database
        await updateLogo(data.secure_url); // Update the logo in the Backend
      } else {
        alert("Error: No URL received for the image");
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
      alert("There was an error uploading the file");
    } finally {
      setLoading(false);
    }
  };

  // Sending the URL to update the logo in the database
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
        alert("Error updating the logo");
      }
    } catch (error) {
      console.error("Error updating the logo:", error);
      alert("There was an error updating the logo");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Waiting for upload..." : "Upload Image"}
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
```
import React from "react";
import "../build/Build.css";
import "./MainTab.css";

export default function MainTab({ businessDetails }) {
  const mainImages = businessDetails.mainImages || [];

  // Helper to extract actual URL
  const getImageUrl = (item) => {
    if (!item) return "";
    // Preview object
    if (item.preview) return item.preview;
    // Direct URL string
    if (typeof item === "string") return item;
    // Fallback
    return item.url || "";
  };

  // If no images, show placeholder text
  if (mainImages.length === 0) {
    return (
      <div className="gallery-preview no-actions">
        <p className="no-images">אין תמונות ראשיות להצגה</p>
      </div>
    );
  }

  return (
    <div className="gallery-preview no-actions">
      {mainImages.map((item, i) => (
        <div key={i} className="gallery-item-wrapper">
          <div className="gallery-item">
            <img
              src={getImageUrl(item)}
              alt={`תמונה ראשית ${i + 1}`}
              className="gallery-img"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

import React from "react";
import "../Build.css";
import "../buildTabs/MainTab.css";

const MainTab = ({ businessDetails, handleSave }) => {
  const getImageUrl = (item) => {
    if (!item) return "";
    if (item instanceof File) return URL.createObjectURL(item);
    if (typeof item === "string") return item;
    return item.url || item.preview || "";
  };

  return (
    <>
      <div className="gallery-preview no-actions">
        {businessDetails.gallery.map((file, i) => (
          <div key={i} className="gallery-item-wrapper">
            <div className="gallery-item">
              <img
                src={getImageUrl(file)}
                alt={`preview-${i}`}
                className="gallery-img"
                style={{
                  objectFit: businessDetails.galleryFits?.[file.name] || "cover",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="reviews">
        {businessDetails.reviews.slice(0, 2).map((r, i) => (
          <div key={i} className="review-card improved">
            <div className="review-header">
              <span className="review-user">{r.user}</span>
              <span className="star-text">★ {r.rating} / 5</span>
            </div>
            <p className="review-text">{r.text}</p>
          </div>
        ))}
      </div>

      <button className="save-btn" onClick={handleSave} style={{ marginTop: "1.5rem" }}>
        💾 שמור
      </button>
    </>
  );
};

export default MainTab;

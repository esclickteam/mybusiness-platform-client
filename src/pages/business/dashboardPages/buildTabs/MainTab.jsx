// src/pages/business/dashboardPages/build/buildTabs/MainTab.jsx
import React from "react";
// Build.css נמצא בתיקיית האב של buildTabs
import "../Build.css";
// MainTab.css נמצא באותה תיקייה
import "./MainTab.css";

const MainTab = ({ businessDetails, handleSave }) => {
  const getImageUrl = (item) => {
    if (!item) return "";
    if (item instanceof File) return URL.createObjectURL(item);
    if (typeof item === "string") return item;
    return item.url || item.preview || "";
  };

  const getImageFit = (file) => {
    // אם רוצים לשמור התאמות חיתוך שונות ל־mainImages,
    // אפשר להחליף כאן את המיפוי מ־galleryFits ל־mainImagesFits
    const key = file?.name || file?.url || "";
    return businessDetails.galleryFits?.[key] || "cover";
  };

  return (
    <>
      {/* תצוגת התמונות של העמוד הראשי */}
      <div className="gallery-preview no-actions">
        {businessDetails.mainImages?.map((file, i) => (
          <div key={i} className="gallery-item-wrapper">
            <div className="gallery-item">
              <img
                src={getImageUrl(file) || "/images/placeholder.jpg"}
                alt={`main-${i}`}
                className="gallery-img"
                style={{ objectFit: getImageFit(file) }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* תצוגת ביקורות אם יש */}
      {businessDetails.reviews?.length > 0 && (
        <div className="reviews">
          <h3>⭐ ביקורות אחרונות</h3>
          {businessDetails.reviews.slice(0, 2).map((r, i) => (
            <div key={i} className="review-card improved">
              <div className="review-header">
                <span className="review-user">{r.user}</span>
                <span className="star-text">★ {r.rating} / 5</span>
              </div>
              <p className="review-text">{r.comment || r.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* כפתור שמירה */}
      <button
        className="save-btn"
        onClick={handleSave}
        style={{ marginTop: "1.5rem" }}
      >
        💾 שמור
      </button>
    </>
  );
};

export default MainTab;

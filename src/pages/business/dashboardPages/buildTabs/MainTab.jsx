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

  const getImageFit = (file) => {
    const key = file?.name || file?.url || "";
    return businessDetails.galleryFits?.[key] || "cover";
  };

  const averageRating = businessDetails.reviews?.length
    ? (
        businessDetails.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
        businessDetails.reviews.length
      ).toFixed(1)
    : null;

  return (
    <>
      <div className="profile-header">
        <img
          src={getImageUrl(businessDetails.logo) || "/images/placeholder.jpg"}
          alt="לוגו עסק"
          className="profile-image"
        />
        <div className="profile-name-section">
          <h1 className="business-name">{businessDetails.name || "שם העסק"}</h1>
          {averageRating && (
            <p className="rating">⭐ {averageRating} / 5</p>
          )}
        </div>
      </div>

      <div className="about-text">
        <h3>📝 אודות העסק</h3>
        <p>{businessDetails.about || "טרם הוזן מידע"}</p>
      </div>

      <div className="gallery-preview no-actions">
        {businessDetails.gallery?.map((file, i) => (
          <div key={i} className="gallery-item-wrapper">
            <div className="gallery-item">
              <img
                src={getImageUrl(file) || "/images/placeholder.jpg"}
                alt={`preview-${i}`}
                className="gallery-img"
                style={{ objectFit: getImageFit(file) }}
              />
            </div>
          </div>
        ))}
      </div>

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

      <button className="save-btn" onClick={handleSave} style={{ marginTop: "1.5rem" }}>
        💾 שמור
      </button>
    </>
  );
};

export default MainTab;
import React from "react";
import "./Build.css";
import "./MainTab.css";

const BusinessProfileView = ({ profileData }) => {
  const getImageUrl = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    return item.url || item.preview || "";
  };

  const averageRating = profileData.reviews?.length
    ? (
        profileData.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
        profileData.reviews.length
      ).toFixed(1)
    : null;

  return (
    <div className="business-profile-view full-style">
      <div className="profile-header">
        <img
          src={getImageUrl(profileData.logo) || "/images/placeholder.jpg"}
          alt="לוגו עסק"
          className="profile-image"
        />
        <div className="profile-name-section">
          <h1 className="business-name">{profileData.name || "שם העסק"}</h1>
          <p className="category-area">
            {profileData.category || "לא מוגדר"}
            {profileData.area ? ` | ${profileData.area}` : ""}
          </p>
          {averageRating && (
            <p className="rating-badge">⭐ {averageRating} / 5</p>
          )}
        </div>
      </div>

      {profileData.about && (
        <div className="about-section">
          <p className="about-snippet">
            {profileData.about.length > 100
              ? profileData.about.slice(0, 100) + "..."
              : profileData.about}
          </p>
        </div>
      )}

      <hr className="profile-divider" />

      <div className="gallery-preview no-actions">
        {profileData.gallery?.map((file, i) => (
          <div key={i} className="gallery-item-wrapper">
            <div className="gallery-item">
              <img
                src={getImageUrl(file) || "/images/placeholder.jpg"}
                alt={`preview-${i}`}
                className="gallery-img"
              />
            </div>
          </div>
        ))}
      </div>

      {profileData.reviews?.length > 0 && (
        <div className="reviews">
          <h3>⭐ ביקורות אחרונות</h3>
          {profileData.reviews.slice(0, 2).map((r, i) => (
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
    </div>
  );
};

export default BusinessProfileView;

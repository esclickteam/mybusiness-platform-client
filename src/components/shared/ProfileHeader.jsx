import React from "react";
import "./ProfileHeader.css";

const ProfileHeader = ({ businessDetails }) => {
  if (!businessDetails) return null;

  const getImageUrl = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    return item.url || item.preview || "";
  };

  const averageRating = businessDetails.reviews?.length
    ? (
        businessDetails.reviews.reduce(
          (sum, r) => sum + Number(r.rating || 0),
          0
        ) / businessDetails.reviews.length
      ).toFixed(1)
    : null;

  const { name, logo, category, area, about } = businessDetails;

  return (
    <div className="profile-top-section">
      <div className="profile-header">
        <img
          src={getImageUrl(logo) || "/images/placeholder.jpg"}
          alt="לוגו עסק"
          className="profile-image"
        />
        <div className="profile-name-section">
          <h1 className="business-name">{name || "שם העסק"}</h1>

          {/* הצגת קטגוריה ואזור רק אם קיימים */}
          {(category || area) && (
            <p className="category-area">
              {category}
              {category && area ? ` | ${area}` : area}
            </p>
          )}

          {averageRating && (
            <p className="rating-badge">⭐ {averageRating} / 5</p>
          )}
        </div>
      </div>

      {about && (
        <div className="about-section">
          <p className="about-snippet">
            {about.length > 100 ? about.slice(0, 100) + "..." : about}
          </p>
        </div>
      )}

      <hr className="profile-divider" />
    </div>
  );
};

export default ProfileHeader;

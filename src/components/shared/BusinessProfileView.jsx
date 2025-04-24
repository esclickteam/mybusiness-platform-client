// src/pages/business/dashboardPages/buildTabs/BusinessProfileView.jsx
import React from "react";
// סגנונות ספציפיים לתצוגת הפרופיל
import "./BusinessProfileView.css";
// הכותרת המשותפת (לוגו, שם, דירוג)
import ProfileHeader from "./ProfileHeader";

const BusinessProfileView = ({ profileData }) => {
  if (!profileData) return <div>טוען...</div>;

  return (
    <div className="business-profile-view full-style">
      {/* הכותרת המשותפת */}
      <ProfileHeader businessDetails={profileData} />

      {/* אודות קצר */}
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

      {/* גלריה */}
      <div className="gallery-preview no-actions">
        {profileData.gallery?.map((file, i) => (
          <div key={i} className="gallery-item-wrapper">
            <div className="gallery-item">
              <img
                src={typeof file === "string" ? file : file.url}
                alt={`preview-${i}`}
                className="gallery-img"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ביקורות אחרונות */}
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

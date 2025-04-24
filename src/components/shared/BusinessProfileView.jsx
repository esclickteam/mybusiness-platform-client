// src/components/shared/BusinessProfileView.jsx
import React from "react";
import "./BusinessProfileView.css";

export default function BusinessProfileView({ profileData }) {
  if (!profileData) return <div>טוען...</div>;

  return (
    <div className="business-profile-view full-style">
      {/* 2. אודות העסק */}
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

      {/* 3. גלריה */}
      <div className="gallery-preview no-actions">
        {profileData.gallery?.map((file, i) => (
          <div key={i} className="gallery-item-wrapper">
            <img
              src={typeof file === "string" ? file : file.url}
              alt={`preview-${i}`}
              className="gallery-img"
            />
          </div>
        ))}
      </div>

      {/* 4. ביקורות אחרונות */}
      {profileData.reviews?.length > 0 && (
        <div className="reviews">
          <h3>⭐ ביקורות אחרונות</h3>
          {profileData.reviews.slice(0, 2).map((r, i) => (
            <div key={i} className="review-card improved">
              <div className="review-header">
                <strong className="review-user">{r.user}</strong>
                <span className="star-text">★ {r.rating} / 5</span>
              </div>
              <p className="review-text">{r.comment || r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

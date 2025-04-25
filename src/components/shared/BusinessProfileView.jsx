import React from "react";
import "./BusinessProfileView.css";

export default function BusinessProfileView({ profileData }) {
  if (!profileData) return <div>טוען...</div>;

  // קודם כל לוקחים description אם קיים, אחרת נופשים ל־about הישן
  const description =
    typeof profileData.description === "string" && profileData.description.trim() !== ""
      ? profileData.description
      : profileData.about || "";

  const phone = profileData.phone || "";

  const { gallery = [], reviews = [] } = profileData;

  return (
    <div className="business-profile-view full-style">
      {/* כפתור עריכה */}
      <button className="edit-profile-btn">ערוך פרופיל ✏️</button>

      {/* שם העסק */}
      <h1 className="business-name">{profileData.name}</h1>

      {/* תיאור העסק */}
      {description && (
        <div className="about-section">
          <p className="about-snippet">
            {description.length > 200 ? description.slice(0, 200) + "..." : description}
          </p>
        </div>
      )}

      {/* טלפון */}
      {phone && (
        <div className="phone-section">
          <strong>טלפון:</strong> {phone}
        </div>
      )}

      <hr className="profile-divider" />

      {/* גלריה */}
      {Array.isArray(gallery) && gallery.length > 0 && (
        <div className="gallery-preview no-actions">
          {gallery.map((item, i) => {
            // תומכים גם במערך URL-ים וגם במערך אובייקטים {url, preview}
            const src = typeof item === "string" ? item : item.url || item.preview;
            return (
              src && (
                <div key={i} className="gallery-item-wrapper">
                  <img src={src} alt={`gallery-${i}`} className="gallery-img" />
                </div>
              )
            );
          })}
        </div>
      )}

      {/* ביקורות אחרונות */}
      {Array.isArray(reviews) && reviews.length > 0 && (
        <div className="reviews">
          <h3>⭐ ביקורות אחרונות</h3>
          {reviews.slice(0, 2).map((r, i) => (
            <div key={i} className="review-card improved">
              <div className="review-header">
                <strong className="review-user">{r.user}</strong>
                <span className="star-text">
                  ★ {r.rating != null ? r.rating : "5"} / 5
                </span>
              </div>
              <p className="review-text">
                {r.comment || r.text || "אין תוכן לביקורת."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

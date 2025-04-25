import React from "react";
import "./BusinessProfileView.css";

export default function BusinessProfileView({ profileData }) {
  if (!profileData) return <div>טוען...</div>;

  const { about, gallery, reviews } = profileData;

  return (
    <div className="business-profile-view full-style">
      {/* אודות העסק */}
      {about && typeof about === "string" && (
        <div className="about-section">
          <p className="about-snippet">
            {about.length > 100 ? about.slice(0, 100) + "..." : about}
          </p>
        </div>
      )}

      <hr className="profile-divider" />

      {/* גלריה */}
      {Array.isArray(gallery) && gallery.length > 0 && (
        <div className="gallery-preview no-actions">
          {gallery.map((file, i) => {
            const src =
              typeof file === "string"
                ? file
                : file?.url || file?.preview || "";

            return (
              src && (
                <div key={i} className="gallery-item-wrapper">
                  <img src={src} alt={`preview-${i}`} className="gallery-img" />
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
                <span className="star-text">★ {r.rating ?? "5"} / 5</span>
              </div>
              <p className="review-text">{r.comment || r.text || "אין תוכן לביקורת."}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

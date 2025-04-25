import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "@api";
import "./BusinessProfileView.css";

export default function BusinessProfileView() {
  const { businessId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/business/${businessId}`)
      .then(res => {
        const data = res.data.business || res.data;
        setProfileData(data);
      })
      .catch(err => console.error("❌ Error loading business:", err))
      .finally(() => setLoading(false));
  }, [businessId]);

  if (loading) return <div>טוען...</div>;
  if (!profileData) return <div>העסק לא נמצא</div>;

  // מעדיף description על about
  const description =
    profileData.description?.trim()
      ? profileData.description
      : profileData.about || "";

  const phone = profileData.phone || "";
  const { gallery = [], reviews = [] } = profileData;

  return (
    <div className="business-profile-view full-style">
      <button className="edit-profile-btn">ערוך פרופיל ✏️</button>

      <h1 className="business-name">{profileData.name}</h1>

      {description && (
        <div className="about-section">
          <p className="about-snippet">
            {description.length > 200
              ? description.slice(0, 200) + "..."
              : description}
          </p>
        </div>
      )}

      {phone && (
        <div className="phone-section">
          <strong>טלפון:</strong> {phone}
        </div>
      )}

      <hr className="profile-divider" />

      {gallery.length > 0 && (
        <div className="gallery-preview no-actions">
          {gallery.map((item, i) => {
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

      {reviews.length > 0 && (
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

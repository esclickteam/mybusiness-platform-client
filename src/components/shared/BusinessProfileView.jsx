// src/components/shared/BusinessProfileView.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@api";
import "./BusinessProfileView.css";

export default function BusinessProfileView() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/business/${businessId}`)
      .then(res => {
        const data = res.data.business || res.data;
        setProfileData(data);
      })
      .catch(err => console.error("Error loading business:", err))
      .finally(() => setLoading(false));
  }, [businessId]);

  if (loading) return <div>טוען…</div>;
  if (!profileData) return <div>העסק לא נמצא</div>;

  const {
    name,
    description = "",
    phone = "",
    gallery = [],
    reviews = []
  } = profileData;

  // סינון רק ביקורות עם rating מספרי
  const realReviews = reviews.filter(r => typeof r.rating === "number");

  return (
    <div className="business-profile-view full-style">
      <div className="profile-inner">
        {/* ✏️ כפתור עריכה */}
        <button
          className="edit-profile-btn"
          onClick={() => navigate(`/business/${businessId}/edit`)}
        >
          ערוך עמוד עסקי ✏️
        </button>

        <h1 className="business-name">{name}</h1>

        {/* תיאור */}
        {description && (
          <div className="about-section">
            <p className="about-snippet">
              {description.length > 200
                ? description.slice(0, 200) + "..."
                : description}
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

        {/* ביקורות אמיתיות בלבד */}
        {realReviews.length > 0 && (
          <div className="reviews">
            <h3>⭐ ביקורות אחרונות</h3>
            {realReviews.map((r, i) => (
              <div key={i} className="review-card improved">
                <div className="review-header">
                  <strong className="review-user">{r.user}</strong>
                  <span className="star-text">★ {r.rating} / 5</span>
                </div>
                <p className="review-text">
                  {r.comment || r.text || "אין תוכן לביקורת."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

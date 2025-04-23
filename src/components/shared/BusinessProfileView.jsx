import React, { useState } from "react";
import "./BusinessProfileView.css";

export default function BusinessProfileView({
  profileData,
  profileImage,
  canChat,
  canSchedule,
}) {
  if (!profileData) return <p>לא נמצא מידע על העסק</p>;

  const getImageUrl = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    return item.url || item.preview || "";
  };

  const averageRating = profileData.reviews?.length
    ? (
        profileData.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
        profileData.reviews.length
      ).toFixed(1)
    : null;

  return (
    <div className="business-profile-view">
      {/* לוגו + שם העסק */}
      <div className="profile-header">
        <img
          src={
            profileData.logo?.preview ||
            profileData.logo ||
            profileImage ||
            "https://via.placeholder.com/150"
          }
          alt="לוגו עסק"
          className="profile-image"
        />
        <div className="profile-name-section">
          <h1 className="business-name">{profileData.name || "שם העסק"}</h1>
          <p className="category-area">
            {profileData.category}{" "}
            {profileData.area ? `| ${profileData.area}` : ""}
          </p>
          {averageRating && <p className="rating">⭐️ {averageRating} / 5</p>}
        </div>
      </div>

      {/* כפתורי פיצ’רים */}
      <div className="profile-actions">
        {canChat && (
          <button className="message-button">💬 צ'אט עם העסק</button>
        )}
        {canSchedule && (
          <button className="schedule-button">
            📅 תיאום תור / שירות
          </button>
        )}
      </div>

      {/* אודות */}
      {profileData.about && (
        <div className="profile-section">
          <h3>📝 על העסק</h3>
          <p>{profileData.about}</p>
        </div>
      )}

      {/* תמונות ראשיות */}
      {profileData.mainImages?.length > 0 && (
        <div className="profile-section">
          <h3>🖼️ תמונות ראשיות</h3>
          <div className="gallery-grid">
            {profileData.mainImages.map((item, i) => (
              <img
                key={i}
                src={getImageUrl(item)}
                alt={`תמונה ראשית ${i + 1}`}
                className="gallery-image"
              />
            ))}
          </div>
        </div>
      )}

      {/* גלריה */}
      {profileData.gallery?.length > 0 && (
        <div className="profile-section">
          <h3>📸 גלריה</h3>
          <div className="gallery-grid">
            {profileData.gallery.map((item, i) => (
              <img
                key={i}
                src={getImageUrl(item)}
                alt={`תמונה ${i + 1}`}
                className="gallery-image"
              />
            ))}
          </div>
        </div>
      )}

      {/* סטוריז */}
      {(profileData.story || profileData.stories)?.length > 0 && (
        <div className="profile-section">
          <h3>📱 סטוריז</h3>
          <div className="story-strip">
            {(profileData.story || profileData.stories).map((s, i) => (
              <img
                key={i}
                src={s.url}
                alt={`סטורי ${i + 1}`}
                className="story-thumb"
              />
            ))}
          </div>
        </div>
      )}

      {/* שירותים / מוצרים */}
      {profileData.services?.length > 0 && (
        <div className="profile-section">
          <h3>🛍️ שירותים / מוצרים</h3>
          <ul className="service-list">
            {profileData.services.map((s, i) => (
              <li key={i}>
                <strong>{s.name}</strong> — {s.description} — {s.price} ₪
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ביקורות */}
      {profileData.reviews?.length > 0 && (
        <div className="profile-section">
          <h3>⭐️ ביקורות</h3>
          {profileData.reviews.map((r, i) => (
            <div key={i} className="review-box">
              <strong>{r.user}</strong>: {r.comment || r.text}
            </div>
          ))}
        </div>
      )}

      {/* שאלות ותשובות */}
      {profileData.faqs?.length > 0 && (
        <div className="profile-section">
          <h3>❓ שאלות ותשובות</h3>
          {profileData.faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <strong>ש:</strong> {f.q}
              <br />
              <strong>ת:</strong> {f.a}
            </div>
          ))}
        </div>
      )}

      {/* פרטי קשר */}
      {(profileData.phone || profileData.email) && (
        <div className="profile-section contact-section">
          <h3>📞 פרטי קשר</h3>
          <ul>
            {profileData.phone && (
              <li>
                <strong>טלפון:</strong> {profileData.phone}
              </li>
            )}
            {profileData.email && (
              <li>
                <strong>אימייל:</strong> {profileData.email}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
);
}

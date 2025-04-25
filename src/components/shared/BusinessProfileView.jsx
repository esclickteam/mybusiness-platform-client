// src/components/shared/BusinessProfileView.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@api";
import "./BusinessProfileView.css";

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "שאלות ותשובות",
  "צ'אט עם העסק",
  "חנות / יומן",
];

export default function BusinessProfileView() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("ראשי");

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
    reviews = [],
    faqs = []
    // אפשר להוסיף כאן נתונים לצ'אט או לחנות אם תרצה בעתיד
  } = profileData;

  // סינון רק ביקורות עם rating מספרי
  const realReviews = reviews.filter(r => typeof r.rating === "number");

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">
          {/* ✏️ כפתור עריכה */}
          <button
            className="edit-profile-btn"
            onClick={() => navigate(`/business/${businessId}/edit`)}
          >
            ערוך עמוד עסקי ✏️
          </button>

          {/* שם העסק */}
          <h1 className="business-name">{name}</h1>

          {/* רק בטאב ראשי */}
          {currentTab === "ראשי" && (
            <>
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
            </>
          )}

          <hr className="profile-divider" />

          {/* פס טאבים */}
          <div className="profile-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${currentTab === tab ? "active" : ""}`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* תכולת טאב: גלריה */}
          {currentTab === "גלריה" && gallery.length > 0 && (
            <div className="gallery-preview no-actions">
              {gallery.map((item, i) => {
                const src =
                  typeof item === "string" ? item : item.url || item.preview;
                return (
                  src && (
                    <div key={i} className="gallery-item-wrapper">
                      <img
                        src={src}
                        alt={`gallery-${i}`}
                        className="gallery-img"
                      />
                    </div>
                  )
                );
              })}
            </div>
          )}

          {/* תכולת טאב: ביקורות */}
          {currentTab === "ביקורות" && realReviews.length > 0 && (
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

          {/* תכולת טאב: שאלות ותשובות */}
          {currentTab === "שאלות ותשובות" && faqs.length > 0 && (
            <div className="faqs">
              <h3>❓ שאלות ותשובות</h3>
              {faqs.map((f, i) => (
                <div key={i} className="faq-item">
                  <strong>{f.question}</strong>
                  <p>{f.answer}</p>
                </div>
              ))}
            </div>
          )}

          {/* תכולת טאב: צ'אט */}
          {currentTab === "צ'אט עם העסק" && (
            <div className="chat-tab-placeholder">
              <p>🚧 תכונה זו תיבנה בקרוב…</p>
            </div>
          )}

          {/* תכולת טאב: חנות / יומן */}
          {currentTab === "חנות / יומן" && (
            <div className="shop-tab-placeholder">
              <p>🚧 תכונה זו תיבנה בקרוב…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

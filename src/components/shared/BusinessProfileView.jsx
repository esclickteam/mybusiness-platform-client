import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
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
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [businessId, location.pathname]);

  if (loading) return <div>טוען…</div>;
  if (!profileData) return <div>העסק לא נמצא</div>;

  const {
    name,
    logo,
    description = "",
    phone = "",
    mainImages = [],
    gallery = [],
    reviews = [],
    faqs = [],
  } = profileData;

  const realReviews = reviews.filter(r => typeof r.rating === "number");

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">
          <Link
            to={`/business/${businessId}/dashboard/edit`}
            className="edit-profile-btn"
          >
            ✏️ ערוך עמוד עסקי
          </Link>

          {logo && (
            <div className="logo-wrapper">
              <img
                src={logo}
                alt={`${name} logo`}
                className="profile-logo"
              />
            </div>
          )}

          <h1 className="business-name">{name}</h1>

          {/* ====== ראשי ====== */}
          {currentTab === "ראשי" && (
            <>
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

              {/* ✨ תמונות ראשיות */}
              {mainImages.length > 0 && (
                <div className="gallery-preview no-actions">
                  {mainImages.map((item, i) => {
                    const src =
                      typeof item === "string"
                        ? item
                        : item.url || item.preview;
                    return (
                      <div key={i} className="gallery-item-wrapper">
                        <img
                          src={src}
                          alt={`main-img-${i}`}
                          className="gallery-img"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <hr className="profile-divider" />

          {/* ====== טאבים ====== */}
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

          {/* ====== גלריה ====== */}
          {currentTab === "גלריה" && gallery.length > 0 && (
            <div className="gallery-preview no-actions">
              {gallery.map((item, i) => {
                const src =
                  typeof item === "string" ? item : item.url || item.preview;
                return (
                  <div key={i} className="gallery-item-wrapper">
                    <img
                      src={src}
                      alt={`gallery-${i}`}
                      className="gallery-img"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ====== ביקורות ====== */}
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

          {/* ====== שאלות ותשובות ====== */}
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

          {/* ====== צ'אט ====== */}
          {currentTab === "צ'אט עם העסק" && (
            <div className="chat-tab">
              <h3>💬 שלח הודעה לעסק</h3>
              {/* … קלטים וכפתור שליחה … */}
            </div>
          )}

          {/* ====== חנות / יומן ====== */}
          {currentTab === "חנות / יומן" && (
            <div className="shop-tab-placeholder" />
          )}
        </div>
      </div>
    </div>
  );
}

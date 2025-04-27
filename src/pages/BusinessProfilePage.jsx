// src/pages/business/BusinessProfilePage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "@api";
import "./BusinessProfilePage.css"; // ייבוא CSS של ה-Page

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "שאלות ותשובות",
  "צ'אט עם העסק",
  "חנות / יומן",
];

export default function BusinessProfilePage() {
  const { businessId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("ראשי");

  useEffect(() => {
    setLoading(true);
    API.get(`/business/${businessId}`)
      .then(res => {
        const data = res.data.business || res.data;
        setProfileData({
          ...data,
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
          faqs:    Array.isArray(data.faqs)    ? data.faqs    : []
        });
      })
      .catch(err => console.error("❌ Fetch error:", err))
      .finally(() => setLoading(false));
  }, [businessId]);

  if (loading) return <div>טוען…</div>;
  if (!profileData) return <div>העסק לא נמצא</div>;

  const { name, logo, description = "", phone = "", gallery, reviews, faqs } = profileData;

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
              <img src={logo} alt={`${name} logo`} className="profile-logo" />
            </div>
          )}

          <h1 className="business-name">{name}</h1>
          <hr className="profile-divider" />

          {/* Tabs */}
          <div className="profile-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${currentTab === tab ? "active" : ""}`}
                onClick={() => setCurrentTab(tab)}
              >{tab}</button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">

            {/* ====== ראשי ====== */}
            {currentTab === "ראשי" && (
              <>
                {description && (
                  <div className="about-section">
                    <p className="about-snippet">
                      {description.length > 200
                        ? description.slice(0, 200) + "…"
                        : description}
                    </p>
                  </div>
                )}
                {phone && (
                  <div className="phone-section">
                    <strong>טלפון:</strong> {phone}
                  </div>
                )}
                {gallery.length > 0 && (
                  <div className="gallery-preview">
                    {gallery.slice(0, 5).map((url, i) => (
                      <div key={i} className="gallery-item-wrapper">
                        <img
                          src={url}
                          alt={`main-img-${i}`}
                          className="gallery-img"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ====== גלריה ====== */}
            {currentTab === "גלריה" && (
              gallery.length > 0 ? (
                <div className="gallery-preview">
                  {gallery.map((url, i) => (
                    <div key={i} className="gallery-item-wrapper">
                      <img
                        src={url}
                        alt={`gallery-${i}`}
                        className="gallery-img"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>אין תמונות בגלריה</p>
              )
            )}

            {/* ====== ביקורות ====== */}
            {currentTab === "ביקורות" && (
              <div className="reviews">
                {reviews.length > 0 ? (
                  reviews.map((r, i) => (
                    <div key={i} className="review-card improved">
                      <div className="review-header">
                        <strong className="review-user">{r.user}</strong>
                        <span className="star-text">★ {r.rating} / 5</span>
                      </div>
                      <p className="review-text">{r.comment || r.text || "אין תוכן"}</p>
                    </div>
                  ))
                ) : (
                  <p>אין ביקורות להצגה.</p>
                )}
              </div>
            )}

            {/* ====== שאלות ותשובות ====== */}
            {currentTab === "שאלות ותשובות" && (
              <div className="faqs">
                {faqs.length > 0 ? (
                  faqs.map((f, i) => (
                    <div key={i} className="faq-item">
                      <strong>{f.question}</strong>
                      <p>{f.answer}</p>
                    </div>
                  ))
                ) : (
                  <p>אין שאלות להצגה.</p>
                )}
              </div>
            )}

            {/* ====== צ'אט עם העסק ====== */}
            {currentTab === "צ'אט עם העסק" && (
              <div className="chat-tab">
                <h3>💬 שלח הודעה לעסק</h3>
                <form className="chat-form">
                  <input type="text" placeholder="הקלידו את שמכם" className="chat-input" />
                  <textarea placeholder="הודעתכם" className="chat-textarea"></textarea>
                  <button type="submit" className="chat-send-btn">שלח</button>
                </form>
              </div>
            )}

            {/* ====== חנות / יומן ====== */}
            {currentTab === "חנות / יומן" && (
              <div className="shop-tab">
                <h3>🛒 חנות / 📅 יומן תורים</h3>
                <p>רכיב זה יכנס בהמשך.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

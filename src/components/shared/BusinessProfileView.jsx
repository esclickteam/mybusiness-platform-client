// src/components/shared/BusinessProfileView.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "@api";
import { useAuth } from "../../context/AuthContext"; // ← חיבור ל־AuthContext
import { dedupeByPreview } from "../../utils/dedupe";
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
  const { user } = useAuth(); // ← הוספנו
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("ראשי");

  useEffect(() => {
    setLoading(true);
    API.get(`/business/${businessId}`)
      .then(res => {
        const biz = res.data.business || res.data;
        setData({
          ...biz,
          rating:     biz.rating ?? 0,
          mainImages: Array.isArray(biz.mainImages) ? biz.mainImages : [],
          gallery:    Array.isArray(biz.gallery)    ? biz.gallery    : [],
          reviews:    Array.isArray(biz.reviews)    ? biz.reviews    : [],
          faqs:       Array.isArray(biz.faqs)       ? biz.faqs       : [],
        });
      })
      .catch(err => console.error("❌ fetch business:", err))
      .finally(() => setLoading(false));
  }, [businessId]);

  if (loading) return <div className="loading">טוען…</div>;
  if (!data) return <div className="error">העסק לא נמצא</div>;

  const {
    name,
    logo,
    rating,
    description = "",
    phone = "",
    category = "",
    mainImages,
    gallery,
    reviews,
    faqs,
    owner
  } = data;

  const normalizedMain = mainImages.map(url => ({ preview: url }));
  const uniqueMain = dedupeByPreview(normalizedMain).slice(0, 5).map(obj => obj.preview);

  const isOwner = user?.role === "business" && user.businessId === businessId;

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">
          
          {/* 🔹 כפתור חזור */}
          <button className="back-btn" onClick={() => navigate(-1)}>← חזור</button>

          {/* 🔹 הצגת כפתור עריכה רק לבעל העסק */}
          {isOwner && (
            <Link to={`/business/${businessId}/dashboard/edit`} className="edit-profile-btn">
              ✏️ ערוך פרטי העסק
            </Link>
          )}

          {logo && (
            <div className="logo-wrapper">
              <img src={logo} alt="לוגו העסק" className="profile-logo" />
            </div>
          )}

          <h1 className="business-name">{name}</h1>

          {category && (
            <div className="about-phone">
              <p><strong>קטגוריה:</strong> {category}</p>
              {description && <p><strong>תיאור:</strong> {description}</p>}
              {phone && <p><strong>טלפון:</strong> {phone}</p>}
            </div>
          )}

          <div className="rating"><strong>{rating}</strong> / 5 ★</div>
          <hr className="profile-divider" />

          <div className="profile-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${tab === currentTab ? "active" : ""}`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {/* טאב תוכן */}
            {currentTab === "ראשי" && (
              <div className="public-main-images">
                {uniqueMain.length > 0 ? (
                  uniqueMain.map((url, i) => (
                    <img key={url} src={url} alt={`תמונה ראשית ${i + 1}`} />
                  ))
                ) : (
                  <p className="no-data">אין תמונות להצגה</p>
                )}
              </div>
            )}
            {currentTab === "גלריה" && (
              gallery.length > 0 ? (
                <div className="public-main-images">
                  {gallery.map((url, i) => (
                    <img key={i} src={url} alt={`גלריה ${i + 1}`} />
                  ))}
                </div>
              ) : (
                <p className="no-data">אין תמונות בגלריה</p>
              )
            )}
            {currentTab === "ביקורות" && (
              <div className="reviews">
                {reviews.length > 0 ? (
                  reviews.map((r, i) => (
                    <div key={i} className="review-card improved">
                      <div className="review-header">
                        <strong>{r.user}</strong> <span>★ {r.rating}/5</span>
                      </div>
                      <p>{r.comment || r.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-data">אין ביקורות</p>
                )}
              </div>
            )}
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
                  <p className="no-data">אין שאלות ותשובות</p>
                )}
              </div>
            )}
            {currentTab === "צ'אט עם העסק" && (
              <div className="chat-tab"><h3>שלח הודעה לעסק</h3></div>
            )}
            {currentTab === "חנות / יומן" && (
              <div className="shop-tab-placeholder"><p>פיתוח בהמשך…</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

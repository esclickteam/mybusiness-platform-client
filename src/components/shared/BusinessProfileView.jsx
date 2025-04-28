import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  if (!data)   return <div className="error">העסק לא נמצא</div>;

  const {
    name,
    logo,
    description = "",
    phone       = "",
    mainImages,
    gallery,
    reviews,
    faqs
  } = data;

  // בחירה בין mainImages ל-gallery
  const primary = mainImages.length ? mainImages : gallery;

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">

          <Link to={`/business/${businessId}/dashboard/edit`} className="edit-profile-btn">
            ✏️ ערוך פרטי העסק
          </Link>

          {logo && (
            <div className="logo-wrapper">
              <img src={logo} alt="logo" className="profile-logo" />
            </div>
          )}

          <h1 className="business-name">{name}</h1>

          {/* תיאור העסק */}
          {description && (
            <div className="about-section">
              <p>{description}</p>
            </div>
          )}

          {/* חישוב כמויות */}
          <div className="about-section">
            <p>חישוב כמויות</p>
          </div>

          {/* פרטי התקשרות */}
          {phone && (
            <div className="phone-section">
              <strong>טלפון:</strong> {phone}
            </div>
          )}

          <hr className="profile-divider" />

          {/* טאבים */}
          <div className="profile-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${tab === currentTab ? "active" : ""}`}
                onClick={() => setCurrentTab(tab)}
              >{tab}</button>
            ))}
          </div>

          {/* תוכן הטאב */}
          <div className="tab-content">
            {currentTab === "ראשי" && (
              <div className="main-images">
                {primary.map((url,i) => (
                  <div key={i} className="profile-gallery-item">
                    <img src={url} alt={`main-${i}`} className="gallery-img" />
                  </div>
                ))}
              </div>
            )}

            {currentTab === "גלריה" && (
              gallery.length ? (
                <div className="gallery-preview no-actions">
                  {gallery.map((url,i) => (
                    <div key={i} className="profile-gallery-item">
                      <img src={url} alt={`gal-${i}`} className="gallery-img" />
                    </div>
                  ))}
                </div>
              ) : <p>אין תמונות בגלריה</p>
            )}

            {currentTab === "ביקורות" && (
              <div className="reviews">
                {reviews.length ? reviews.map((r,i) => (
                  <div key={i} className="review-card improved">
                    <div className="review-header">
                      <strong>{r.user}</strong> <span>★ {r.rating}/5</span>
                    </div>
                    <p>{r.comment || r.text}</p>
                  </div>
                )) : <p>אין ביקורות</p>}
              </div>
            )}

            {currentTab === "שאלות ותשובות" && (
              <div className="faqs">
                {faqs.length ? faqs.map((f,i) => (
                  <div key={i} className="faq-item">
                    <strong>{f.question}</strong>
                    <p>{f.answer}</p>
                  </div>
                )) : <p>אין שאלות</p>}
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

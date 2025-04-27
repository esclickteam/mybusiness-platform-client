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

  /* ─── fetch once ───────────────────────────────────────────── */
  useEffect(() => {
    setLoading(true);
    API.get(`/business/${businessId}`)
      .then(res => {
        const biz = res.data.business || res.data;
        console.log("📦 נתוני העסק מהשרת:", biz);

        setData({
          ...biz,
          mainImages: Array.isArray(biz.mainImages) ? biz.mainImages : [],
          story:      Array.isArray(biz.story)      ? biz.story      : [],
          gallery:    Array.isArray(biz.gallery)    ? biz.gallery    : []
        });
      })
      .catch(err => console.error("❌ fetch business for edit:", err))
      .finally(() => setLoading(false));
  }, [businessId]);

  if (loading) return <div>טוען…</div>;
  if (!data)   return <div>העסק לא נמצא</div>;

  /* ─── destructure ──────────────────────────────────────────── */
  const {
    name,
    logo,
    description = "",
    phone       = "",
    mainImages,
    story,
    gallery,
    reviews = [],
    faqs    = []
  } = data;

  /* תמונות ראשיות: mainImages ← story ← gallery */
  const primary =
    mainImages.length ? mainImages :
    story.length      ? story      :
    gallery.length    ? gallery    : [];

  /* ─── render ───────────────────────────────────────────────── */
  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">

          <Link
            to={`/business/${businessId}/dashboard/edit`}
            className="edit-profile-btn">
            ✏️ ערוך פרטי העסק
          </Link>

          {logo && (
            <div className="logo-wrapper">
              <img src={logo} alt="logo" className="profile-logo" />
            </div>
          )}

          <h1 className="business-name">{name}</h1>
          <hr className="profile-divider" />

          {/* ─── טאבים ─────────────────────── */}
          <div className="profile-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${tab === currentTab ? "active" : ""}`}
                onClick={() => setCurrentTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {/* ─── תוכן הטאב ──────────────────── */}
          <div className="tab-content">
            {/* ראשי */}
            {currentTab === "ראשי" && (
              <>
                {description && (
                  <div className="about-section"><p>{description}</p></div>
                )}
                {phone && (
                  <div className="phone-section">
                    <strong>טלפון:</strong> {phone}
                  </div>
                )}
                {primary.length > 0 && (
                  <div className="gallery-preview no-actions">
                    {primary.map((img, i) => (
                      <div key={i} className="profile-gallery-item">
                        <img src={img} alt={`main-${i}`} className="gallery-img" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* גלריה */}
            {currentTab === "גלריה" && (
              <>
                {gallery.length ? (
                  <div className="gallery-preview no-actions">
                    {gallery.map((url, i) => (
                      <div key={i} className="profile-gallery-item">
                        <img src={url} alt={`gal-${i}`} className="gallery-img" />
                      </div>
                    ))}
                  </div>
                ) : <p>אין תמונות בגלריה</p>}
              </>
            )}

            {/* ביקורות */}
            {currentTab === "ביקורות" && (
              <div className="reviews">
                {reviews.length ? reviews.map((r, i) => (
                  <div key={i} className="review-card improved">
                    <div className="review-header">
                      <strong>{r.user}</strong>
                      <span>★ {r.rating}/5</span>
                    </div>
                    <p>{r.comment || r.text}</p>
                  </div>
                )) : <p>אין ביקורות</p>}
              </div>
            )}

            {/* שאלות ותשובות */}
            {currentTab === "שאלות ותשובות" && (
              <div className="faqs">
                {faqs.length ? faqs.map((f, i) => (
                  <div key={i} className="faq-item">
                    <strong>{f.question}</strong>
                    <p>{f.answer}</p>
                  </div>
                )) : <p>אין שאלות</p>}
              </div>
            )}

            {/* צ'אט עם העסק */}
            {currentTab === "צ'אט עם העסק" && (
              <div className="chat-tab">
                <h3>שלח הודעה לעסק</h3>
              </div>
            )}

            {/* חנות / יומן */}
            {currentTab === "חנות / יומן" && (
              <div className="shop-tab-placeholder">
                <p>פיתוח בהמשך…</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

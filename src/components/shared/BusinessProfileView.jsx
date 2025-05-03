// src/components/shared/BusinessProfileView.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@api";
import { useAuth } from "../../context/AuthContext";
import { dedupeByPreview } from "../../utils/dedupe";
import ReviewForm from "../../pages/business/dashboardPages/buildTabs/ReviewForm";
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
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState("ראשי");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [avgRating, setAvgRating] = useState(0);

  // Fetch business data on mount or when businessId changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    api.get(`/business/${businessId}`)
      .then(res => {
        const biz = res.data.business || res.data;
        const reviews = Array.isArray(biz.reviews) ? biz.reviews : [];
        setData({
          ...biz,
          reviews,
          faqs: Array.isArray(biz.faqs) ? biz.faqs : [],
        });
      })
      .catch(err => {
        console.error("❌ fetch business error:", err);
        setError("שגיאה בטעינת העסק");
      })
      .finally(() => setLoading(false));
  }, [businessId]);

  // Recompute avgRating automatically whenever reviews array changes
  useEffect(() => {
    if (!data?.reviews) return;
    const sum = data.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const avg = data.reviews.length ? sum / data.reviews.length : 0;
    console.debug("[BusinessProfileView] recalculated avgRating:", avg);
    setAvgRating(avg);
  }, [data?.reviews]);

  // Handlers
  const handleReviewClick = () => setShowReviewModal(true);
  const closeReviewModal = () => setShowReviewModal(false);

  // Submit new review and refresh data
  const handleReviewSubmit = async newReview => {
    try {
      await api.post(`/business/${businessId}/reviews`, newReview);
      const { data: refreshed } = await api.get(`/business/${businessId}`);
      const biz = refreshed.business || refreshed;
      setData({
        ...biz,
        reviews: Array.isArray(biz.reviews) ? biz.reviews : [],
        faqs: Array.isArray(biz.faqs) ? biz.faqs : [],
      });
      closeReviewModal();
    } catch (err) {
      console.error("❌ Error adding review:", err);
      alert("שגיאה בשליחת הביקורת, נסה שוב");
    }
  };

  // Delete review (admin/manager only) and refresh data
  const handleDeleteReview = async reviewId => {
    if (!window.confirm("האם למחוק ביקורת זו?")) return;
    try {
      await api.delete(`/business/${businessId}/reviews/${reviewId}`);
      const { data: refreshed } = await api.get(`/business/${businessId}`);
      const biz = refreshed.business || refreshed;
      setData({
        ...biz,
        reviews: Array.isArray(biz.reviews) ? biz.reviews : [],
        faqs: Array.isArray(biz.faqs) ? biz.faqs : [],
      });
    } catch (err) {
      console.error("❌ Error deleting review:", err);
      alert("שגיאה במחיקת הביקורת");
    }
  };

  if (loading) return <div className="loading">טוען…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="error">העסק לא נמצא</div>;

  const {
    name,
    logo,
    description = "",
    phone = "",
    category = "",
    mainImages = [],
    gallery = [],
    reviews = [],
    faqs = [],
    city = "",
  } = data;

  const uniqueMain = dedupeByPreview(mainImages.map(url => ({ preview: url })))
    .slice(0, 5)
    .map(o => o.preview);

  // Stars logic
  const roundedAvg = Math.round(avgRating * 10) / 10;
  const fullAvgStars = Math.floor(roundedAvg);
  const halfAvgStar = roundedAvg % 1 ? 1 : 0;
  const emptyAvgStars = 5 - fullAvgStars - halfAvgStar;

  const isOwner = user?.role === "business" && user.businessId === businessId;
  const canDelete = ["admin", "manager"].includes(user?.role);
  const filteredReviews = reviews.filter(r => r.user && r.comment);

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">
          {/* Edit button for owner */}
          {isOwner && (
            <Link to={`/business/${businessId}/dashboard/edit`} className="edit-profile-btn">
              ✏️ ערוך פרטי העסק
            </Link>
          )}

          {/* Business logo */}
          {logo && (
            <div className="profile-logo-wrapper">
              <img className="profile-logo" src={logo} alt="לוגו העסק" />
            </div>
          )}

          {/* Name */}
          <h1 className="business-name">{name}</h1>

          {/* About section */}
          <div className="about-phone">
            {category && <p><strong>🏷️ קטגוריה:</strong> {category}</p>}
            {description && <p><strong>📝 תיאור:</strong> {description}</p>}
            {phone && <p><strong>📞 טלפון:</strong> {phone}</p>}
            {city && <p><strong>🏙️ עיר:</strong> {city}</p>}
          </div>

          {/* Overall rating display */}
          <div className="overall-rating">
            <span className="big-score">{roundedAvg.toFixed(1)}</span>
            <span className="stars-inline">
              {'★'.repeat(fullAvgStars)}{halfAvgStar ? '⯨' : ''}{'☆'.repeat(emptyAvgStars)}
            </span>
            <span className="count">({filteredReviews.length} ביקורות)</span>
          </div>

          <hr className="profile-divider" />

          {/* Tabs */}
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

          {/* Tab content */}
          <div className="tab-content">
            {currentTab === "ראשי" && (
              <div className="public-main-images">
                {uniqueMain.length > 0 ? (
                  uniqueMain.map((url, idx) => (
                    <img key={idx} src={url} alt={`תמונה ראשית ${idx + 1}`} />
                  ))
                ) : (
                  <p className="no-data">אין תמונות להצגה</p>
                )}
              </div>
            )}

            {currentTab === "גלריה" && (
              <div className="public-main-images">
                {gallery.length > 0 ? (
                  gallery.map((url, idx) => (
                    <img key={idx} src={url} alt={`גלריה ${idx + 1}`} />
                  ))
                ) : (
                  <p className="no-data">אין תמונות בגלריה</p>
                )}
              </div>
            )}

            {currentTab === "ביקורות" && (
              <div className="reviews">
                {!isOwner && user && (
                  <div className="reviews-header">
                    <button onClick={handleReviewClick} className="add-review-btn">
                      הוסף ביקורת
                    </button>
                  </div>
                )}
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((r, i) => {
                    const dateStr = r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString("he-IL", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "";
                    const score = Number(r.rating) || 0;
                    const full = Math.floor(score);
                    const half = score % 1 ? 1 : 0;
                    const empty = 5 - full - half;

                    return (
                      <div key={i} className="review-card improved">
                        <div className="review-header simple">
                          <div className="author-info">
                            <strong className="reviewer">{r.user.name}</strong>
                            {dateStr && <small className="review-date">{dateStr}</small>}
                          </div>
                          <div className="score">
                            <span className="score-number">{score.toFixed(1)}</span>
                            <span className="stars-inline">
                              {'★'.repeat(full)}{half ? '⯨' : ''}{'☆'.repeat(empty)}
                            </span>
                          </div>
                          {canDelete && (
                            <button
                              className="delete-review-btn"
                              onClick={() => handleDeleteReview(r._id)}
                            >
                              מחק
                            </button>
                          )}
                        </div>
                        <p className="review-comment simple">{r.comment}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-data">אין ביקורות</p>
                )}
              </div>
            )}

            {currentTab === "שאלות תשובות" && (
              <div className="faqs">
                {faqs.length > 0 ? (
                  faqs.map((f, idx) => (
                    <div key={idx} className="faq-item">
                      <strong>{f.question}</strong>
                      <p>{f.answer}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-data">אין שאלות תשובות</p>
                )}
              </div>
            )}

            {currentTab === "צ'אט עם העסק" && (
              <div className="chat-tab">
                <h3>שלח הודעה לעסק</h3>
              </div>
            )}

            {currentTab === "חנות / יומן" && (
              <div className="shop-tab-placeholder">
                <p>Development coming soon…</p>
              </div>
            )}
          </div>

          {/* Review modal */}
          {showReviewModal && (
            <div className="review-modal">
              <div className="modal-content">
                <h2>הוסף ביקורת</h2>
                <ReviewForm businessId={businessId} onSubmit={handleReviewSubmit} />
                <button onClick={closeReviewModal}>סגור</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

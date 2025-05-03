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

  // Fetch business and determine avgRating
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

        // Determine avgRating, fallback if server rating is zero
        let avg = Number(biz.rating) || 0;
        if (reviews.length > 0 && avg === 0) {
          const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
          avg = sum / reviews.length;
        }
        setAvgRating(avg);
      })
      .catch(err => {
        console.error("❌ fetch business error:", err);
        setError('שגיאה בטעינת העסק');
      })
      .finally(() => setLoading(false));
  }, [businessId]);

  const handleReviewClick = () => setShowReviewModal(true);
  const closeReviewModal = () => setShowReviewModal(false);

  const handleReviewSubmit = async (newReview) => {
    try {
      await api.post(`/business/${businessId}/reviews`, newReview);
      // refresh data
      const { data: refreshed } = await api.get(`/business/${businessId}`);
      const biz = refreshed.business || refreshed;
      setData({
        ...biz,
        reviews: Array.isArray(biz.reviews) ? biz.reviews : [],
        faqs: Array.isArray(biz.faqs) ? biz.faqs : [],
      });
      setAvgRating(Number(biz.rating) || 0);
      closeReviewModal();
    } catch (err) {
      console.error("❌ Error adding review:", err);
      alert('שגיאה בשליחת הביקורת, נסה שוב');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('האם למחוק ביקורת זו?')) return;
    try {
      await api.delete(`/business/${businessId}/reviews/${reviewId}`);
      const { data: refreshed } = await api.get(`/business/${businessId}`);
      const biz = refreshed.business || refreshed;
      setData({
        ...biz,
        reviews: Array.isArray(biz.reviews) ? biz.reviews : [],
        faqs: Array.isArray(biz.faqs) ? biz.faqs : [],
      });
      setAvgRating(Number(biz.rating) || 0);
    } catch (err) {
      console.error("❌ Error deleting review:", err);
      alert('שגיאה במחיקת הביקורת');
    }
  };

  if (loading) return <div className="loading">טוען…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="error">העסק לא נמצא</div>;

  const {
    name,
    logo,
    description = '',
    phone = '',
    category = '',
    mainImages = [],
    gallery = [],
    reviews = [],
    faqs = [],
    city = '',
  } = data;

  const uniqueMain = dedupeByPreview(
    mainImages.map(url => ({ preview: url }))
  ).slice(0, 5).map(o => o.preview);

  const roundedAvg = Math.round(avgRating * 10) / 10;
  const fullAvgStars = Math.floor(roundedAvg);
  const halfAvgStar = roundedAvg % 1 ? 1 : 0;
  const emptyAvgStars = 5 - fullAvgStars - halfAvgStar;

  const isOwner = user?.role === 'business' && user.businessId === businessId;
  const canDelete = ['admin', 'manager'].includes(user?.role);
  const filteredReviews = reviews.filter(r => r.user && r.comment);

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">
          {isOwner && (
            <Link to={`/business/${businessId}/dashboard/edit`} className="edit-profile-btn">
              ✏️ ערוך פרטי העסק
            </Link>
          )}

          {logo && (
            <div className="profile-logo-wrapper">
              <img className="profile-logo" src={logo} alt="לוגו העסק" />
            </div>
          )}

          <h1 className="business-name">{name}</h1>

          <div className="about-phone">
            {category && <p><strong>🏷️ קטגוריה:</strong> {category}</p>}
            {description && <p><strong>📝 תיאור:</strong> {description}</p>}
            {phone && <p><strong>📞 טלפון:</strong> {phone}</p>}
            {city && <p><strong>🏙️ עיר:</strong> {city}</p>}
          </div>

          <div className="overall-rating">
            <span className="big-score">{roundedAvg.toFixed(1)}</span>
            <span className="stars-inline">
              {'★'.repeat(fullAvgStars)}{halfAvgStar ? '⯨' : ''}{'☆'.repeat(emptyAvgStars)}
            </span>
            <span className="count">({filteredReviews.length} ביקורות)</span>
          </div>

          <hr className="profile-divider" />

          <div className="profile-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${tab === currentTab ? 'active' : ''}`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {currentTab === 'ביקורות' && (
              <div className="reviews">
                {user && !isOwner && (
                  <div className="reviews-header">
                    <button onClick={handleReviewClick} className="add-review-btn">הוסף ביקורת</button>
                  </div>
                )}
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((r, i) => {
                    const dateStr = r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString('he-IL', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '';
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
                            <span className="stars-inline">{'★'.repeat(full)}{half ? '⯨' : ''}{'☆'.repeat(empty)}</span>
                          </div>
                          {canDelete && (
                            <button className="delete-review-btn" onClick={() => handleDeleteReview(r._id)}>
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
            {/* גלריה, ראשי ושאר הטאבים נשמרו ללא שינוי */}
          </div>

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

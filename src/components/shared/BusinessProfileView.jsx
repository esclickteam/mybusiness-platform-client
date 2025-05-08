import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "@api";
import { useAuth } from "../../context/AuthContext";
import ReviewForm from "../../pages/business/dashboardPages/buildTabs/ReviewForm";
import "./BusinessProfileView.css";

// הגדרת הטאבים
const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "שאלות תשובות",
  "צ'אט עם העסק",
  "חנות / יומן",
];

// Utility to dedupe by unique id
const dedupeReviews = reviews =>
  Array.from(
    new Map(reviews.map(r => [r._id || r.id || JSON.stringify(r), r])).values()
  );

export default function BusinessProfileView() {
  const { businessId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate(); // הוספתי את ה- useNavigate

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState("ראשי");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load business and dedupe reviews
  const fetchBusiness = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/business/${businessId}`);
      console.log(res.data); // הדפסת המידע שהתקבל
      const biz = res.data.business || res.data;
      setData(biz);
    } catch (err) {
      console.error(err);
      setError("שגיאה בטעינת העסק");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  const reviewsList = data?.reviews || [];

  // בדיקה אם המשתמש כבר הגיש ביקורת
  const hasReviewed = user
    ? reviewsList.some(r =>
        r.user?._id === user._id || r.user?.id === user._id
      )
    : false;

  // Compute average rating
  useEffect(() => {
    const sum = reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    setAvgRating(reviewsList.length ? sum / reviewsList.length : 0);
  }, [reviewsList]);

  // Handlers
  const handleReviewClick = () => setShowReviewModal(true);
  const closeReviewModal = () => setShowReviewModal(false);

  const handleReviewSubmit = async newReview => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await api.post(`/api/business/${businessId}/reviews`, newReview);
      // רק אחרי הצלחה מרעננים וסוגרים modal
      await fetchBusiness();
      closeReviewModal();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("כבר הגשת ביקורת על העסק הזה");
      } else {
        console.error(err);
        alert("שגיאה בשליחת הביקורת, נסה שוב");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async reviewId => {
    if (!window.confirm("האם למחוק ביקורת זו?")) return;
    try {
      await api.delete(`/business/${businessId}/reviews/${reviewId}`);
      await fetchBusiness();
    } catch (err) {
      console.error(err);
      alert("שגיאה במחיקת הביקורת");
    }
  };

  // פונקציה שתנווט לטאב הצ'אט עם העסק
  const handleChatClick = () => {
    console.log("Navigating to chat with business:", businessId); // לבדוק את ה-businessId
    navigate(`/business/${businessId}/chat`); // ניווט לדף הצ'אט
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
    city = ""
  } = data;

  const roundedAvg = Math.round(avgRating * 10) / 10;
  const fullAvgStars = Math.floor(roundedAvg);
  const halfAvgStar = roundedAvg % 1 ? 1 : 0;
  const emptyAvgStars = 5 - fullAvgStars - halfAvgStar;

  const isOwner = user?.role === "business" && user.businessId === businessId;
  const canDelete = ["admin", "manager"].includes(user?.role);

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
            <span className="count">({reviewsList.length} ביקורות)</span>
          </div>

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
            {currentTab === "ראשי" && (
              <div className="public-main-images">
                {mainImages.length ? (
                  mainImages.slice(0, 5).map((url, i) => (
                    <img key={i} src={url} alt={`תמונה ראשית ${i + 1}`} />
                  ))
                ) : (
                  <p className="no-data">אין תמונות להצגה</p>
                )}
              </div>
            )}
            {currentTab === "גלריה" && (
              <div className="public-main-images">
                {gallery.length ? (
                  gallery.map((url, i) => (
                    <img key={i} src={url} alt={`גלריה ${i + 1}`} />
                  ))
                ) : (
                  <p className="no-data">אין תמונות בגלריה</p>
                )}
              </div>
            )}
            {currentTab === "ביקורות" && (
              <div className="reviews">
                {!isOwner && user && !hasReviewed && (
                  <div className="reviews-header">
                    <button
                      onClick={handleReviewClick}
                      className="add-review-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'טוען…' : 'הוסף ביקורת'}
                    </button>
                  </div>
                )}
                {hasReviewed && ['client', 'business'].includes(user.role) && (
                  <p className="no-data">כבר הגשת ביקורת על העסק הזה</p>
                )}
                {reviewsList.length ? (
                  reviewsList.map((r, i) => {
                    const dateStr = r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString("he-IL", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })
                      : "";
                    const score = Number(r.rating) || 0;
                    const full = Math.floor(score);
                    const half = score % 1 ? 1 : 0;
                    const empty = 5 - full - half;
                    const reviewerName = r.user?.name || "אנונימי";

                    return (
                      <div key={r._id || i} className="review-card improved">
                        <div className="review-header simple">
                          <div className="author-info">
                            <strong className="reviewer">{reviewerName}</strong>
                            {dateStr && <small className="review-date">{dateStr}</small>}
                          </div>
                          <div className="score">
                            <span className="score-number">{score.toFixed(1)}</span>
                            <span className="stars-inline">
                              {'★'.repeat(full)}{half ? '⯨' : ''}{'☆'.repeat(empty)}
                            </span>
                          </div>
                        </div>
                        <p className="review-comment simple">{r.comment}</p>
                        {canDelete && (
                          <button
                            className="delete-review-btn"
                            onClick={() => handleDeleteReview(r._id)}
                          >
                            מחק
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="no-data">אין ביקורות</p>
                )}
              </div>
            )}

            {currentTab === "צ'אט עם העסק" && (
              <div className="chat-button-container">
                <button className="chat-button" onClick={handleChatClick}>
                  פתח צ'אט עם העסק
                </button>
              </div>
            )}
          </div>

          {showReviewModal && (
            <div className="review-modal">
              <div className="modal-content">
                <h2>הוסף ביקורת</h2>
                <ReviewForm
                  businessId={businessId}
                  onSubmit={handleReviewSubmit}
                  isSubmitting={isSubmitting}
                />
                <button onClick={closeReviewModal}>סגור</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

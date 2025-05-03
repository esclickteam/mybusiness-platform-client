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

  // Fetch business + reviews, compute initial average on load
  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log("Fetching business with ID:", businessId);
    api.get(`/business/${businessId}`)
      .then(res => {
        console.log("Response data:", res.data);
        const biz = res.data.business || res.data;
        const reviews = Array.isArray(biz.reviews) ? biz.reviews : [];
        console.log(`Found ${reviews.length} reviews`, reviews);
        const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
        const initialAvg = reviews.length > 0 ? sum / reviews.length : 0;
        setData({
          ...biz,
          city: typeof biz.address === 'string'
            ? biz.address
            : biz.address?.city || '',
          mainImages: Array.isArray(biz.mainImages) ? biz.mainImages : [],
          gallery:    Array.isArray(biz.gallery)    ? biz.gallery    : [],
          reviews,
          faqs:       Array.isArray(biz.faqs)       ? biz.faqs       : [],
        });
        setAvgRating(initialAvg);
        console.log("Initial average rating set to", initialAvg);
      })
      .catch(err => {
        console.error('❌ fetch business error:', err);
        setError('שגיאה בטעינת העסק');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [businessId]);

  // Recompute average when reviews change
  useEffect(() => {
    if (!data || !Array.isArray(data.reviews)) return;
    console.log("Recomputing average from reviews:", data.reviews);
    const sum = data.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const newAvg = data.reviews.length > 0 ? sum / data.reviews.length : 0;
    setAvgRating(newAvg);
    console.log("Recomputed average rating:", newAvg);
  }, [data && data.reviews]);

  const handleReviewClick = () => setShowReviewModal(true);
  const closeReviewModal   = () => setShowReviewModal(false);

  // Submit new review
  const handleReviewSubmit = async (newReview) => {
    try {
      console.log("Submitting new review:", newReview);
      const res = await api.post(
        `/business/${businessId}/reviews`,
        newReview
      );
      console.log("Review submission response:", res.data);
      const { review, businessRating } = res.data;
      setData(prev => ({
        ...prev,
        reviews: [...prev.reviews, review]
      }));
      setAvgRating(businessRating);
      console.log("Updated average rating to", businessRating);
      closeReviewModal();
    } catch (err) {
      console.error('❌ Error adding review:', err);
      alert('שגיאה בשליחת הביקורת, נסה שוב');
    }
  };

  if (loading) return <div className="loading">טוען…</div>;
  if (error)   return <div className="error">{error}</div>;
  if (!data)  return <div className="error">העסק לא נמצא</div>;

  const {
    name,
    logo,
    description = '',
    phone = '',
    category = '',
    mainImages,
    gallery,
    reviews,
    faqs,
    city
  } = data;

  const uniqueMain = dedupeByPreview(
    mainImages.map(url => ({ preview: url }))
  )
    .slice(0,5)
    .map(o => o.preview);

  // Stars display
  const roundedAvg    = Math.round(avgRating * 10) / 10;
  const fullAvgStars  = Math.floor(roundedAvg);
  const halfAvgStar   = roundedAvg % 1 ? 1 : 0;
  const emptyAvgStars = 5 - fullAvgStars - halfAvgStar;

  const isOwner = user?.role === 'business' && user.businessId === businessId;
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
            {category   && <p><strong>🏷️ קטגוריה:</strong> {category}</p>}
            {description&& <p><strong>📝 תיאור:</strong> {description}</p>}
            {phone      && <p><strong>📞 טלפון:</strong> {phone}</p>}
            {city       && <p><strong>🏙️ עיר:</strong> {city}</p>}
          </div>

          <div className="overall-rating">
            <span className="big-score">{roundedAvg.toFixed(1)}</span>
            <span className="stars-inline">
              {'★'.repeat(fullAvgStars)}
              {halfAvgStar ? '⯨' : ''}
              {'☆'.repeat(emptyAvgStars)}
            </span>
            <span className="count">({reviews.length} ביקורות)</span>
          </div>
          <hr className="profile-divider" />

          <div className="profile-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${tab === currentTab ? 'active' : ''}`}
                onClick={() => setCurrentTab(tab)}
              >{tab}</button>
            ))}
          </div>

          <div className="tab-content">
            {currentTab === 'ראשי' && (
              <div className="public-main-images">
                {uniqueMain.length ?
                  uniqueMain.map((url,i) => <img key={i} src={url} alt={`תמונה ראשית ${i+1}`} />)
                  : <p className="no-data">אין תמונות להצגה</p>
                }
              </div>
            )}
            {currentTab === 'גלריה' && (
              <div className="public-main-images">
                {gallery.length ?
                  gallery.map((url,i) => <img key={i} src={url} alt={`גלריה ${i+1}`} />)
                  : <p className="no-data">אין תמונות בגלריה</p>
                }
              </div>
            )}
            {currentTab === 'ביקורות' && (
              <div className="reviews">
                {user && !isOwner && (
                  <div className="reviews-header">
                    <button onClick={handleReviewClick} className="add-review-btn">הוסף ביקורת</button>
                  </div>
                )}
                {filteredReviews.length ? filteredReviews.map((r,i) => (
                  <div key={i} className="review-card improved">
                    <div className="review-header simple">
                      <div className="author-info">
                        <strong className="reviewer">{r.user.name}</strong>
                        <small className="review-date">{new Date(r.createdAt).toLocaleDateString('he-IL',{day:'2-digit',month:'short',year:'numeric'})}</small>
                      </div>
                      <div className="score">
                        <span className="score-number">{r.rating.toFixed(1)}</span>
                        <span className="stars-inline">
                          {'★'.repeat(Math.floor(r.rating))}{r.rating % 1 ? '⯨' : ''}{'☆'.repeat(5 - fullAvgStars - halfAvgStar)}
                        </span>
                      </div>
                    </div>
                    <p className="review-comment simple">{r.comment}</p>
                  </div>
                )) : <p className="no-data">אין ביקורות</p>}
              </div>
            )}
            {currentTab === 'שאלות ותשובות' && (
              <div className="faqs">
                {faqs.length ? faqs.map((f,i) => (
                  <div key={i} className="faq-item">
                    <strong>{f.question}</strong>
                    <p>{f.answer}</p>
                  </div>
                )) : <p className="no-data">אין שאלות ותשובות</p>}
              </div>
            )}
            {currentTab === "צ'אט עם העסק" && (
              <div className="chat-tab"><h3>שלח הודעה לעסק</h3></div>
            )}
            {currentTab === 'חנות / יומן' && (
              <div className="shop-tab-placeholder"><p>פיתוח בהמשך…</p></div>
            )}
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

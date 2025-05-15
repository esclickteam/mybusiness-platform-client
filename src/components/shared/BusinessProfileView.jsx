import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import ReviewForm from "../../pages/business/dashboardPages/buildTabs/ReviewForm";
import AppointmentsMain from '../../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/AppointmentsMain';
import "./BusinessProfileView.css";

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "שאלות תשובות",
  "הודעות מלקוחות",
  "יומן",
];

export default function BusinessProfileView() {
  const { businessId: paramId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const bizId = paramId || user?.businessId;

  const [data, setData] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState("ראשי");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!bizId) {
      setError("Invalid business ID");
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/business/${bizId}`);
        const business = res.data.business || res.data;
        setData(business);
        setFaqs(business.faqs || []);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת העסק");
      } finally {
        setLoading(false);
      }
    })();
  }, [bizId]);

  if (loading) return <div className="loading">טוען…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="error">העסק לא נמצא</div>;

  const {
    businessName,
    logo: logoUrl,
    description = "",
    phone = "",
    category = "",
    mainImages = [],
    gallery = [],
    reviews = [],
    address: { city = "" } = {},
    services = [],
    calendar = {}
  } = data;

  const totalRating = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
  const avgRating = reviews.length ? totalRating / reviews.length : 0;
  const roundedAvg = Math.round(avgRating * 10) / 10;
  const fullAvgStars = Math.floor(roundedAvg);
  const halfAvgStar = roundedAvg % 1 ? 1 : 0;
  const emptyAvgStars = 5 - fullAvgStars - halfAvgStar;

  const isOwner = user?.role === "business" && user.businessId === bizId;

  const handleChatClick = () => {
    navigate(`/business/messages`);
  };

  const handleReviewSubmit = async formData => {
    setIsSubmitting(true);
    try {
      await api.post(`/business/${bizId}/reviews`, formData);
      setShowReviewModal(false);
      const res = await api.get(`/business/${bizId}`);
      setData(res.data.business || res.data);
    } catch (err) {
      alert("שגיאה בשליחת ביקורת");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">
          {isOwner && (
            <Link to={`/business/${bizId}/dashboard/edit`} className="edit-profile-btn">
              ✏️ ערוך פרטי העסק
            </Link>
          )}

          {logoUrl && (
            <div className="profile-logo-wrapper">
              <img className="profile-logo" src={logoUrl} alt="לוגו העסק" />
            </div>
          )}

          <h1 className="business-name">{businessName}</h1>

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
            <span className="count">({reviews.length} ביקורות)</span>
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
                {mainImages.length
                  ? mainImages.slice(0, 5).map((url, i) => (
                      <img key={i} src={url} alt={`תמונה ראשית ${i + 1}`} />
                    ))
                  : <p className="no-data">אין תמונות להצגה</p>
                }
              </div>
            )}

            {currentTab === "גלריה" && (
              <div className="public-main-images">
                {gallery.length
                  ? gallery.map((url, i) => (
                      <img key={i} src={url} alt={`גלריה ${i + 1}`} />
                    ))
                  : <p className="no-data">אין תמונות בגלריה</p>
                }
              </div>
            )}

            {currentTab === "ביקורות" && (
              <div className="reviews">
                {!isOwner && user && (
                  <div className="reviews-header">
                    <button
                      className="add-review-btn"
                      onClick={() => setShowReviewModal(true)}
                    >
                      הוסף ביקורת
                    </button>
                  </div>
                )}
                {reviews.length
                  ? reviews.map((r, i) => {
                      const dateStr = r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("he-IL", {
                            day: "2-digit", month: "short", year: "numeric"
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
                        </div>
                      );
                    })
                  : <p className="no-data">אין ביקורות</p>
                }
                {showReviewModal && (
                  <div className="modal-bg" onClick={() => setShowReviewModal(false)}>
                    <div className="modal-inner" onClick={e => e.stopPropagation()}>
                      <ReviewForm
                        businessId={bizId}
                        onSubmit={handleReviewSubmit}
                        isSubmitting={isSubmitting}
                      />
                      <button className="modal-close" onClick={() => setShowReviewModal(false)}>
                        סגור
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentTab === "שאלות תשובות" && (
              <div className="faqs-public">
                {faqs.length === 0 ? (
                  <p className="no-data">אין עדיין שאלות ותשובות</p>
                ) : (
                  faqs.map(faq => (
                    <div key={faq.faqId || faq._id} className="faq-card">
                      <div className="faq-q"><strong>שאלה:</strong> {faq.question}</div>
                      <div className="faq-a"><strong>תשובה:</strong> {faq.answer}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {currentTab === "הודעות מלקוחות" && (
              <div className="chat-button-container">
                <button className="chat-button" onClick={handleChatClick}>
                  הודעות מלקוחות
                </button>
              </div>
            )}

            {currentTab === "יומן" && (
              <div className="public-calendar">
                <AppointmentsMain
                  isPreview={true}
                  services={services}
                  workHours={calendar}
                />
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

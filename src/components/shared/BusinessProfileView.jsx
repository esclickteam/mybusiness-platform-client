import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import ReviewForm from "../../pages/business/dashboardPages/buildTabs/ReviewForm";
import AppointmentBooking from "../../pages/AppointmentBooking";

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
  const [serviceId, setServiceId] = useState("");

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
    schedule = {},
  } = data;

  const totalRating = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
  const avgRating = reviews.length ? totalRating / reviews.length : 0;
  const roundedAvg = Math.round(avgRating * 10) / 10;
  const fullAvgStars = Math.floor(roundedAvg);
  const halfAvgStar = roundedAvg % 1 ? 1 : 0;
  const emptyAvgStars = 5 - fullAvgStars - halfAvgStar;

  const isOwner = user?.role === "business" && user.businessId === bizId;

  const handleChatClick = () => navigate(`/business/${bizId}/messages`);

  const handleReviewSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await api.post(`/business/${bizId}/reviews`, formData);
      setShowReviewModal(false);
      const res = await api.get(`/business/${bizId}`);
      setData(res.data.business || res.data);
    } catch {
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
            <Link
              to={`/business/${bizId}/dashboard/edit`}
              className="edit-profile-btn"
            >
              ✏️ ערוך פרטי העסק
            </Link>
          )}

          {logoUrl && (
            <div className="profile-logo-wrapper">
              <img
                className="profile-logo"
                src={logoUrl}
                alt="לוגו העסק"
              />
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
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`tab ${tab === currentTab ? "active" : ""}`}
                onClick={() => {
                  setCurrentTab(tab);
                  if (tab !== "יומן") setServiceId("");
                }}
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
                {reviews.length ? (
                  reviews.map((r, i) => (
                    <div key={r._id || i} className="review-card improved">
                      {/* review content */}
                    </div>
                  ))
                ) : (
                  <p className="no-data">אין ביקורות</p>
                )}
                {showReviewModal && (
                  <div className="modal-bg" onClick={() => setShowReviewModal(false)}>
                    <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
                      <ReviewForm
                        businessId={bizId}
                        onSubmit={handleReviewSubmit}
                        isSubmitting={isSubmitting}
                      />
                      <button
                        className="modal-close"
                        onClick={() => setShowReviewModal(false)}
                      >
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
                  faqs.map((faq) => (
                    <div key={faq.faqId || faq._id} className="faq-card">
                      <div className="faq-q">
                        <strong>שאלה:</strong> {faq.question}
                      </div>
                      <div className="faq-a">
                        <strong>תשובה:</strong> {faq.answer}
                      </div>
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
              <div className="booking-tab">
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="service-select"
                >
                  <option value="">– בחרי שירות –</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>

                {serviceId && (
                  <AppointmentBooking
                    businessId={bizId}
                    serviceId={serviceId}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

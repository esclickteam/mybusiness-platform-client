// src/pages/business/dashboardPages/BusinessProfileView.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import ReviewForm from "../../pages/business/dashboardPages/buildTabs/ReviewForm";
import ServicesSelector from "../ServicesSelector";
import ClientCalendar from "../../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar";

// ** הייבוא הזה מוודא שהתצוגה הבסיסית של React-Calendar תעבוד **
import "react-calendar/dist/Calendar.css";
// ** אם Override שלך ב־ClientCalendar.css, תוודא שגם אותו אתה מייבא כאן **
import "../../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar.css";

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
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentTab, setCurrentTab] = useState("ראשי");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (!bizId) {
      setError("Invalid business ID");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/business/${bizId}`);
        const biz = res.data.business || res.data;

        setData(biz);
        setFaqs(biz.faqs || []);
        setSchedule(biz.schedule || {});

        const svcs = biz.services || [];
        setServices(svcs);

        const uniqueCats = Array.from(
          new Set(svcs.map((s) => s.category).filter(Boolean))
        );
        setCategories(uniqueCats);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת הנתונים");
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
  } = data;

  const totalRating = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
  const avgRating = reviews.length ? totalRating / reviews.length : 0;
  const roundedAvg = Math.round(avgRating * 10) / 10;
  const fullStars = Math.floor(roundedAvg);
  const halfStar = roundedAvg % 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

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
              {"★".repeat(fullStars)}
              {halfStar ? "⯨" : ""}
              {"☆".repeat(emptyStars)}
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
                  setSelectedService(null);
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
                      {/* תוכן הביקורת */}
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
                      <button className="modal-close" onClick={() => setShowReviewModal(false)}>סגור</button>
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
                      <div className="faq-q"><strong>שאלה:</strong> {faq.question}</div>
                      <div className="faq-a"><strong>תשובה:</strong> {faq.answer}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {currentTab === "הודעות מלקוחות" && (
              <div className="chat-button-container">
                <button className="chat-button" onClick={handleChatClick}>הודעות מלקוחות</button>
              </div>
            )}

            {currentTab === "יומן" && (
              <div className="booking-tab">
                <ServicesSelector
                  services={services}
                  categories={categories}
                  onSelect={svc => setSelectedService(svc)}
                />

                {!selectedService && (
                  <p className="choose-prompt">אנא בחרי שירות כדי להציג את היומן</p>
                )}

                {selectedService && (
                  <>
                    <button className="back-btn" onClick={() => setSelectedService(null)}>← שנה שירות</button>
                    <div className="calendar-fullwidth">
                      <ClientCalendar
                        workHours={schedule}
                        selectedService={selectedService}
                        onBackToList={() => setSelectedService(null)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

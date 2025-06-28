import React, { useState, useEffect, Suspense, lazy } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/socketContext";
import { useQuery, useQueryClient } from '@tanstack/react-query';

import "react-calendar/dist/Calendar.css";
import "../../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar.css";
import "./BusinessProfileView.css";

const ReviewForm = lazy(() => import("../../pages/business/dashboardPages/buildTabs/ReviewForm"));
const ServicesSelector = lazy(() => import("../ServicesSelector"));
const ClientCalendar = lazy(() => import("../../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar"));

const TABS = [
  "ראשי",
  "גלריה",
  "ביקורות",
  "שאלות תשובות",
  "הודעות מלקוחות",
  "יומן",
];

// מילון תרגום שדות דירוג
const ratingLabels = {
  service: "שירות 🤝",
  professional: "מקצועיות 💼",
  timing: "עמידה בזמנים ⏰",
  availability: "זמינות 📞",
  value: "תמורה למחיר 💰",
  goal: "השגת מטרה 🎯",
  experience: "חוויה כללית 🎉",
};

const StarDisplay = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < full; i++) stars.push("★");
  if (half) stars.push("✩");
  while (stars.length < 5) stars.push("☆");
  return (
    <span style={{ color: "#f5a623", fontSize: "1.2rem", marginLeft: 4 }} aria-label={`דירוג ${rating} מתוך 5 כוכבים`}>
      {stars.join("")}
    </span>
  );
};

export default function BusinessProfileView() {
  const { businessId: paramId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const bizId = paramId || user?.businessId;
  const queryClient = useQueryClient();

  const [faqs, setFaqs] = useState([]);
  const [services, setServices] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [currentTab, setCurrentTab] = useState("ראשי");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [profileViewsCount, setProfileViewsCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});

  // בקשות נתונים
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['business', bizId],
    queryFn: () => API.get(`/business/${bizId}`).then(res => res.data.business || res.data),
    enabled: !!bizId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: workHoursData } = useQuery({
    queryKey: ['workHours', bizId],
    queryFn: () => API.get("/appointments/get-work-hours", { params: { businessId: bizId } }).then(res => res.data.workHours),
    enabled: !!bizId
  });

  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', bizId],
    queryFn: () => API.get(`/reviews/business/${bizId}`).then(res => res.data.reviews || []),
    enabled: !!bizId
  });

  // עדכון סטייטים כשנתונים נטענים
  useEffect(() => {
    if (!data) return;
    setFaqs(data.faqs || []);
    setServices(data.services || []);
    setProfileViewsCount(data.views_count || 0);
    setIsFavorite(user?.favorites?.includes(bizId) || false); // לדוגמה אם יש נתונים כאלה
  }, [data, user, bizId]);

  useEffect(() => {
    if (!workHoursData) return;
    let sched = {};
    if (Array.isArray(workHoursData)) {
      workHoursData.forEach(item => {
        sched[Number(item.day)] = item;
      });
    } else if (typeof workHoursData === "object") {
      sched = workHoursData;
    }
    setSchedule(sched);
  }, [workHoursData]);

  // שליחת אירוע צפייה בפרופיל
  useEffect(() => {
    if (!socket || !bizId) return;
    socket.emit("profileView", { businessId: bizId }, (res) => {
      if (res.ok) {
        setProfileViewsCount(res.stats.views_count || 0);
      } else {
        console.error("Failed to register profile view:", res.error);
      }
    });
  }, [socket, bizId]);

  // מיון ביקורות לפי תאריך חדש לישן
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
  );

  // הפונקציה לשינוי מצב מועדפים
  const toggleFavorite = async () => {
    if (!user) {
      alert("אנא התחבר כדי לנהל מועדפים");
      return;
    }
    try {
      if (isFavorite) {
        await API.delete(`/users/favorites/${bizId}`, { withCredentials: true });
        setIsFavorite(false);
      } else {
        await API.post(`/users/favorites/${bizId}`, null, { withCredentials: true });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("אירעה שגיאה, נסה שוב");
    }
  };

  const handleReviewSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await API.post(`/business/${bizId}/reviews`, formData);
      setShowReviewModal(false);
      await Promise.all([refetch(), refetchReviews()]);
    } catch {
      alert("שגיאה בשליחת ביקורת");
    } finally {
      setIsSubmitting(false);
    }
  };

  // הפעלת/כיבוי פירוט דירוג ביקורת
  const toggleReviewDetails = (id) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) return <div className="loading">טוען…</div>;
  if (error) return <div className="error">שגיאה בטעינת הנתונים</div>;
  if (!data) return <div className="error">העסק לא נמצא</div>;

  const {
    businessName,
    logo: logoUrl,
    description = "",
    phone = "",
    category = "",
    mainImages = [],
    gallery = [],
    address: { city = "" } = {},
  } = data;

  const totalRating = reviews.reduce((sum, r) => sum + Number(r.rating || r.averageScore || 0), 0);
  const avgRating = reviews.length ? totalRating / reviews.length : 0;
  const roundedAvg = Math.round(avgRating * 10) / 10;
  const isOwner = user?.role === "business" && user.businessId === bizId;

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setSelectedService(null);
  };

  return (
    <div className="profile-page">
      <div className="business-profile-view full-style">
        <div className="profile-inner">

          {/* כפתור עריכת העסק במידה ומנהל */}
          {isOwner && (
            <Link to={`/business/${bizId}/dashboard/edit`} className="edit-profile-btn">
              ✏️ ערוך פרטי העסק
            </Link>
          )}

          {/* לוגו העסק */}
          {logoUrl && (
            <div className="profile-logo-wrapper">
              <img className="profile-logo" src={logoUrl} alt="לוגו העסק" loading="lazy" />
            </div>
          )}

          {/* שם העסק וכפתור מועדפים */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h1 className="business-name">{businessName}</h1>
            <button
              onClick={toggleFavorite}
              className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
              aria-label={isFavorite ? "הסר מהמועדפים" : "הוסף למועדפים"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.5rem",
                color: isFavorite ? "red" : "gray",
              }}
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </div>

          {/* פרטים כלליים */}
          <div className="about-phone" style={{ marginBottom: "1rem" }}>
            {category && <p><strong>🏷️ קטגוריה:</strong> {category}</p>}
            {description && <p><strong>📝 תיאור:</strong> {description}</p>}
            {phone && <p><strong>📞 טלפון:</strong> {phone}</p>}
            {city && <p><strong>🏙️ עיר:</strong> {city}</p>}
          </div>

          {/* דירוג כללי */}
          <div className="overall-rating" aria-label={`דירוג ממוצע: ${roundedAvg.toFixed(1)} מתוך 5`}>
            <span className="big-score">{roundedAvg.toFixed(1)}</span>
            <span className="count">({reviews.length} ביקורות)</span>
          </div>

          <hr className="profile-divider" />

          {/* טאבים */}
          <div className="profile-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`tab ${tab === currentTab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
                role="tab"
                aria-selected={tab === currentTab}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* תוכן לפי טאבים */}
          <div className="tab-content" role="tabpanel">

            {/* ראשי */}
            {currentTab === "ראשי" && (
              <>
                <div className="public-main-images">
                  {mainImages.length ? (
                    mainImages.slice(0, 6).map((url, i) => (
                      <img key={i} src={url} alt={`תמונה ראשית ${i + 1}`} loading="lazy" />
                    ))
                  ) : (
                    <p className="no-data">אין תמונות להצגה</p>
                  )}
                </div>

                <div className="latest-reviews" style={{ marginTop: "2rem" }}>
                  {sortedReviews.length ? (
                    sortedReviews.slice(0, 2).map((r, i) => {
                      const avg = r.rating || r.averageScore || 0;
                      const dateStr = new Date(r.createdAt || r.date).toLocaleDateString("he-IL", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      });
                      const isExpanded = expandedReviews[r._id || i] || false;

                      return (
                        <div key={r._id || i} className="review-card improved" dir="rtl">
                          <p><strong>⭐ דירוג ממוצע:</strong> {avg.toFixed(1)}</p>
                          {r.comment && <p><strong>💬 חוות דעת:</strong> {r.comment}</p>}
                          <p><strong>🗓️ תאריך:</strong> {dateStr}</p>
                          {r.client && <p><strong>👤 מאת:</strong> {r.client.name}</p>}

                          <button
                            style={{
                              marginTop: "8px",
                              backgroundColor: "#c5a3ff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 12px",
                              cursor: "pointer",
                              fontWeight: "bold",
                              color: "#4a148c",
                            }}
                            onClick={() => toggleReviewDetails(r._id || i)}
                            aria-expanded={isExpanded}
                            aria-controls={`review-details-${r._id || i}`}
                          >
                            {isExpanded ? "הסתר פירוט דירוג 📋" : "פירוט דירוג 📋"}
                          </button>

                          {isExpanded && r.ratings && (
                            <div
                              id={`review-details-${r._id || i}`}
                              className="rating-details"
                              style={{ marginTop: "8px" }}
                            >
                              {Object.entries(r.ratings).map(([key, val]) => (
                                <div
                                  key={key}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.9rem",
                                    direction: "rtl",
                                  }}
                                >
                                  <span>{ratingLabels[key] || key}</span>
                                  <span>{val.toFixed(1)} <StarDisplay rating={val} /></span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-data">אין ביקורות להצגה</p>
                  )}
                </div>
              </>
            )}

            {/* גלריה */}
            {currentTab === "גלריה" && (
              <div className="public-main-images">
                {gallery.length ? (
                  gallery.map((url, i) => (
                    <img key={i} src={url} alt={`גלריה ${i + 1}`} loading="lazy" />
                  ))
                ) : (
                  <p className="no-data">אין תמונות בגלריה</p>
                )}
              </div>
            )}

            {/* ביקורות */}
            {currentTab === "ביקורות" && (
              <div className="reviews" dir="rtl">
                {!isOwner && user && (
                  <button className="add-review-btn" onClick={() => setShowReviewModal(true)}>
                    הוסף ביקורת
                  </button>
                )}
                {showReviewModal && (
                  <div className="modal-bg" onClick={() => setShowReviewModal(false)}>
                    <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
                      <Suspense fallback={<div>טוען טופס ביקורת...</div>}>
                        <ReviewForm
                          businessId={bizId}
                          onSubmit={handleReviewSubmit}
                          isSubmitting={isSubmitting}
                        />
                      </Suspense>
                      <button className="modal-close" onClick={() => setShowReviewModal(false)}>
                        סגור
                      </button>
                    </div>
                  </div>
                )}
                {sortedReviews.length ? (
                  sortedReviews.map((r, i) => {
                    const avg = r.rating || r.averageScore || 0;
                    const dateStr = new Date(r.createdAt || r.date).toLocaleDateString("he-IL", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    });
                    const isExpanded = expandedReviews[r._id || i] || false;

                    return (
                      <div key={r._id || i} className="review-card improved">
                        <p><strong>⭐ דירוג ממוצע:</strong> {avg.toFixed(1)}</p>
                        {r.comment && <p><strong>💬 חוות דעת:</strong> {r.comment}</p>}
                        <p><strong>🗓️ תאריך:</strong> {dateStr}</p>
                        {r.client && <p><strong>👤 מאת:</strong> {r.client.name}</p>}

                        <button
                          style={{
                            marginTop: "8px",
                            backgroundColor: "#c5a3ff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: "#4a148c",
                          }}
                          onClick={() => toggleReviewDetails(r._id || i)}
                          aria-expanded={isExpanded}
                          aria-controls={`review-details-full-${r._id || i}`}
                        >
                          {isExpanded ? "הסתר פירוט דירוג 📋" : "פירוט דירוג 📋"}
                        </button>

                        {isExpanded && r.ratings && (
                          <div
                            id={`review-details-full-${r._id || i}`}
                            className="rating-details"
                            style={{ marginTop: "8px" }}
                          >
                            {Object.entries(r.ratings).map(([key, val]) => (
                              <div
                                key={key}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  fontSize: "0.9rem",
                                  direction: "rtl",
                                }}
                              >
                                <span>{ratingLabels[key] || key}</span>
                                <span>{val.toFixed(1)} <StarDisplay rating={val} /></span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="no-data">אין ביקורות</p>
                )}
              </div>
            )}

            {/* שאלות ותשובות */}
            {currentTab === "שאלות תשובות" && (
              <div className="faqs-public" dir="rtl">
                {faqs.length === 0 ? (
                  <p className="no-data">אין עדיין שאלות ותשובות</p>
                ) : (
                  faqs.map((faq, i) => (
                    <div key={faq._id || i} className="faq-card">
                      <p><strong>שאלה:</strong> {faq.question}</p>
                      <p><strong>תשובה:</strong> {faq.answer}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* הודעות מלקוחות */}
            {currentTab === "הודעות מלקוחות" && (
              <div style={{ textAlign: "center", margin: "36px 0" }} dir="rtl">
                {user?.role === "customer" && (
                  <Link to={`/business/${bizId}/messages`} className="chat-link-btn">
                    💬 שלח הודעה לעסק
                  </Link>
                )}
                {isOwner && (
                  <Link to={`/business/${bizId}/dashboard/messages`} className="chat-link-btn">
                    ▶️ ניהול הודעות מלקוחות
                  </Link>
                )}
              </div>
            )}

            {/* יומן */}
            {currentTab === "יומן" && (
              <>
                <Suspense fallback={<div>טוען בחירת שירות...</div>}>
                  <ServicesSelector services={services} onSelect={(svc) => setSelectedService(svc)} />
                </Suspense>
                {!selectedService ? (
                  <p className="choose-prompt" dir="rtl">אנא בחרי שירות כדי להציג את היומן</p>
                ) : (
                  <>
                    <button className="back-btn" onClick={() => setSelectedService(null)} dir="rtl">
                      ← שנה שירות
                    </button>
                    <Suspense fallback={<div>טוען יומן תורים...</div>}>
                      <ClientCalendar
                        workHours={schedule}
                        selectedService={selectedService}
                        onBackToList={() => setSelectedService(null)}
                        businessId={bizId}
                      />
                    </Suspense>
                  </>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

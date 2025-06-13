import React, { useState, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import ReviewForm from "../../pages/business/dashboardPages/buildTabs/ReviewForm";
import ServicesSelector from "../ServicesSelector";
import ClientCalendar from "../../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar";
import { useDashboardStats } from "../../context/DashboardSocketContext";

import { useQuery, useQueryClient } from '@tanstack/react-query';

import "react-calendar/dist/Calendar.css";
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

const fetchBusiness = async (businessId) => {
  const res = await API.get(`/business/${businessId}`);
  return res.data.business || res.data;
};

const fetchWorkHours = async (businessId) => {
  const res = await API.get("/appointments/get-work-hours", {
    params: { businessId },
  });
  return res.data.workHours;
};

export default function BusinessProfileView() {
  const { businessId: paramId } = useParams();
  const { user } = useAuth();
  const bizId = paramId || user?.businessId;
  const queryClient = useQueryClient();

  const [faqs, setFaqs] = useState([]);
  const [services, setServices] = useState([]);
  const [currentTab, setCurrentTab] = useState("ראשי");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [profileViewsCount, setProfileViewsCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const hasIncrementedRef = useRef(false);

  // React Query: Fetch business data
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['business', bizId],
    queryFn: () => fetchBusiness(bizId),
    enabled: !!bizId,
    staleTime: 5 * 60 * 1000,
    onSuccess: (biz) => {
      setFaqs(biz.faqs || []);
      setServices(biz.services || []);
      queryClient.prefetchQuery({
        queryKey: ['workHours', bizId],
        queryFn: () => fetchWorkHours(bizId),
      });
    }
  });

  // React Query: Fetch work hours
  const { data: workHoursData } = useQuery({
    queryKey: ['workHours', bizId],
    queryFn: () => fetchWorkHours(bizId),
    enabled: !!bizId
  });

  const schedule = useMemo(() => {
    if (!workHoursData) return {};
    let sched = {};
    if (Array.isArray(workHoursData)) {
      workHoursData.forEach((item) => {
        sched[Number(item.day)] = item;
      });
    } else if (workHoursData && typeof workHoursData === "object") {
      sched = workHoursData;
    }
    return sched;
  }, [workHoursData]);

  React.useEffect(() => {
    if (!user || !bizId) return;
    (async () => {
      try {
        const favRes = await API.get("/users/me", { withCredentials: true });
        const favList = favRes.data.favorites || [];
        setIsFavorite(favList.includes(bizId));
      } catch (err) {
        console.error("Error fetching favorites", err);
      }
    })();
  }, [user, bizId]);

  React.useEffect(() => {
    if (!bizId) return;
    if (hasIncrementedRef.current) return;
    hasIncrementedRef.current = true;

    API.get(`/business/${bizId}/profile`)
      .then((res) => {
        const biz = res.data;
        if (biz.views_count !== undefined) {
          setProfileViewsCount(biz.views_count);
        }
      })
      .catch((err) => {
        console.error("Error fetching profile (increment views):", err);
      });
  }, [bizId]);

  const socketStats = useDashboardStats();
  React.useEffect(() => {
    if (socketStats?.views_count !== undefined && bizId) {
      setProfileViewsCount(socketStats.views_count);
    }
  }, [socketStats, bizId]);

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
      await refetch();
    } catch {
      alert("שגיאה בשליחת ביקורת");
    } finally {
      setIsSubmitting(false);
    }
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
    reviews = [],
    address: { city = "" } = {},
  } = data;

  const totalRating = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
  const avgRating = reviews.length ? totalRating / reviews.length : 0;
  const roundedAvg = Math.round(avgRating * 10) / 10;
  const isOwner = user?.role === "business" && user.businessId === bizId;

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setSelectedService(null);
    console.log("Switched tab to:", tab);
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
              <img className="profile-logo" src={logoUrl} alt="לוגו העסק" loading="lazy" />
            </div>
          )}

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

          <div className="about-phone">
            {category && (
              <p>
                <strong>🏷️ קטגוריה:</strong> {category}
              </p>
            )}
            {description && (
              <p>
                <strong>📝 תיאור:</strong> {description}
              </p>
            )}
            {phone && (
              <p>
                <strong>📞 טלפון:</strong> {phone}
              </p>
            )}
            {city && (
              <p>
                <strong>🏙️ עיר:</strong> {city}
              </p>
            )}
          </div>
          <div className="overall-rating">
            <span className="big-score">{roundedAvg.toFixed(1)}</span>
            <span className="count">({reviews.length} ביקורות)</span>
          </div>

          <hr className="profile-divider" />

          <div className="profile-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`tab ${tab === currentTab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
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
                    <img key={i} src={url} alt={`תמונה ראשית ${i + 1}`} loading="lazy" />
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
                    <img key={i} src={url} alt={`גלריה ${i + 1}`} loading="lazy" />
                  ))
                ) : (
                  <p className="no-data">אין תמונות בגלריה</p>
                )}
              </div>
            )}
            {currentTab === "ביקורות" && (
              <div className="reviews">
                {!isOwner && user && (
                  <button className="add-review-btn" onClick={() => setShowReviewModal(true)}>
                    הוסף ביקורת
                  </button>
                )}
                {showReviewModal && (
                  <div className="modal-bg" onClick={() => setShowReviewModal(false)}>
                    <div className="#modal-inner" onClick={(e) => e.stopPropagation()}>
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
                {reviews.length ? (
                  reviews.map((r, i) => (
                    <div key={r._id || i} className="review-card improved">
                      {/* תוכן הביקורת */}
                    </div>
                  ))
                ) : (
                  <p className="no-data">אין ביקורות</p>
                )}
              </div>
            )}
            {currentTab === "שאלות תשובות" && (
              <div className="faqs-public">
                {faqs.length === 0 ? (
                  <p className="no-data">אין עדיין שאלות ותשובות</p>
                ) : (
                  faqs.map((faq, i) => (
                    <div key={faq._id || i} className="faq-card">
                      <p>
                        <strong>שאלה:</strong> {faq.question}
                      </p>
                      <p>
                        <strong>תשובה:</strong> {faq.answer}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
            {currentTab === "הודעות מלקוחות" && (
              <div style={{ textAlign: "center", margin: "36px 0" }}>
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
            {currentTab === "יומן" && (
              <div className="booking-tab">
                <ServicesSelector
                  services={services}
                  onSelect={(svc) => {
                    console.log("Service selected:", svc);
                    setSelectedService(svc);
                  }}
                />
                {!selectedService ? (
                  <p className="choose-prompt">אנא בחרי שירות כדי להציג את היומן</p>
                ) : (
                  <>
                    <button className="back-btn" onClick={() => setSelectedService(null)}>
                      ← שנה שירות
                    </button>
                    <div className="calendar-fullwidth">
                      <ClientCalendar
                        workHours={schedule}
                        selectedService={selectedService}
                        onBackToList={() => setSelectedService(null)}
                        businessId={bizId}
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

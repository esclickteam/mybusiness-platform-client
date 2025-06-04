// src/components/BusinessProfileView.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { SocketContext } from "../../context/socketContext";
import ReviewForm from "../../pages/business/dashboardPages/buildTabs/ReviewForm";
import ServicesSelector from "../ServicesSelector";
import ClientCalendar from "../../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar";

// עיצובים
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

export default function BusinessProfileView() {
  const { businessId: paramId } = useParams();
  const { user } = useAuth();
  const socket = useContext(SocketContext);
  const bizId = paramId || user?.businessId;

  const [data, setData] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [services, setServices] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState("ראשי");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [profileViewsCount, setProfileViewsCount] = useState(0);

  // טען פרטי העסק ושעות העבודה
  useEffect(() => {
    if (!bizId) {
      setError("Invalid business ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        // קריאה ל־API לתוכן העסק
        const resBiz = await API.get(`/business/${bizId}`);
        const biz = resBiz.data.business || resBiz.data;
        setData(biz);
        setFaqs(biz.faqs || []);
        setServices(biz.services || []);

        // קריאה לשעות עבודה
        const resWH = await API.get("/appointments/get-work-hours", {
          params: { businessId: bizId },
        });
        let sched = {};
        const wh = resWH.data.workHours;
        if (Array.isArray(wh)) {
          wh.forEach(item => {
            sched[Number(item.day)] = item;
          });
        } else if (wh && typeof wh === "object") {
          sched = wh;
        }
        setSchedule(sched);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    })();
  }, [bizId]);

  // שליחת וצפייה בספריית הצפיות
  useEffect(() => {
  if (!socket || !bizId || !user?.userId) {
    console.log("[Client] Socket or bizId or userId missing:", { socket, bizId, userId: user?.userId });
    return;
  }

  const dashboardUpdateHandler = (stats) => {
    console.log("[Client] Received dashboardUpdate:", stats);
    if (stats.views_count !== undefined) {
      console.log("[Client] Received views_count:", stats.views_count);
      setProfileViewsCount(stats.views_count);
    }
  };

  socket.on("dashboardUpdate", dashboardUpdateHandler);

  const sendProfileView = () => {
    console.log("[Client] Emitting profileView event", { businessId: bizId, viewerId: user.userId });
    socket.emit("profileView", { businessId: bizId, viewerId: user.userId });
  };

  const connectHandler = () => {
    console.log("[Client] Socket connected, sending profileView");
    sendProfileView();
  };

  // אם כבר מחובר - שלח מיד, אחרת תן לאזנה להסתיים ואז שלח
  if (socket.connected) {
    sendProfileView();
  } else {
    socket.once("connect", connectHandler);
  }

  // מאזין לכל אירוע לקבלת לוגים (debug)
  socket.onAny((event, ...args) => {
    console.log(`[Client] Received event: ${event}`, args);
  });

  return () => {
    socket.off("dashboardUpdate", dashboardUpdateHandler);
    socket.off("connect", connectHandler);
    socket.offAny();
  };
}, [socket, bizId, user?.userId]);





  if (loading) return <div className="loading">טוען…</div>;
  if (error)   return <div className="error">{error}</div>;
  if (!data)  return <div className="error">העסק לא נמצא</div>;

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

  const handleReviewSubmit = async formData => {
    setIsSubmitting(true);
    try {
      await API.post(`/business/${bizId}/reviews`, formData);
      setShowReviewModal(false);
      const res = await API.get(`/business/${bizId}`);
      const biz = res.data.business || res.data;
      setData(biz);
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
            <span className="count">({reviews.length} ביקורות)</span>
          </div>
          <hr className="profile-divider" />

          <div className="profile-tabs">
            {TABS.map(tab => (
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
                {mainImages.length
                  ? mainImages.slice(0, 5).map((url, i) => (
                      <img key={i} src={url} alt={`תמונה ראשית ${i + 1}`} />
                    ))
                  : <p className="no-data">אין תמונות להצגה</p>}
              </div>
            )}
            {currentTab === "גלריה" && (
              <div className="public-main-images">
                {gallery.length
                  ? gallery.map((url, i) => (
                      <img key={i} src={url} alt={`גלריה ${i + 1}`} />
                    ))
                  : <p className="no-data">אין תמונות בגלריה</p>}
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
                    <div className="#modal-inner" onClick={e => e.stopPropagation()}>
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
                {reviews.length
                  ? reviews.map((r, i) => (
                      <div key={r._id || i} className="review-card improved">
                        {/* תוכן הביקורת */}
                      </div>
                    ))
                  : <p className="no-data">אין ביקורות</p>}
              </div>
            )}
            {currentTab === "שאלות תשובות" && (
              <div className="faqs-public">
                {faqs.length === 0
                  ? <p className="no-data">אין עדיין שאלות ותשובות</p>
                  : faqs.map((faq, i) => (
                      <div key={faq._id || i} className="faq-card">
                        <p><strong>שאלה:</strong> {faq.question}</p>
                        <p><strong>תשובה:</strong> {faq.answer}</p>
                      </div>
                    ))}
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
                <ServicesSelector services={services} onSelect={svc => setSelectedService(svc)} />
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

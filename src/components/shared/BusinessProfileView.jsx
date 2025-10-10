import React, { useState, useEffect, useRef, Suspense, lazy, useMemo } from "react";
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

const ratingLabels = {
  cleanliness: "Cleanliness",
  punctuality: "Punctuality",
  professionalism: "Professionalism",
  professional: "Professionalism",
  communication: "Communication",
  value: "Value for money",
  service: "Service",
  goal: "Goal",
  experience: "Experience",
  timing: "Timing",
  availability: "Availability",
};

function StarDisplay({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i}>⭐</span>);
  }
  if (halfStar) {
    stars.push(<span key="half">⭐</span>);
  }
  return <>{stars}</>;
}

function useOnScreen(ref) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return isVisible;
}

export default function BusinessProfileView() {
  const { user } = useAuth();
  const { businessId: paramId } = useParams();
  const socket = useSocket();
  const bizId = paramId || user?.businessId;
  const queryClient = useQueryClient();

  // The messages tab name is adjusted based on user role
  const messagesTabName = user?.role === "customer" ? "Messages with the Business" : "Messages from Clients";

  const TABS = [
    "Main",
    "Gallery",
    "Reviews",
    "FAQs",
    messagesTabName,
    "Calendar",
  ];

  // States
  const [faqs, setFaqs] = useState([]);
  const [services, setServices] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [currentTab, setCurrentTab] = useState("Main");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [profileViewsCount, setProfileViewsCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});

  // Queries
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
    queryFn: () => API.get(`/reviews/${bizId}`).then(res => res.data.reviews || []),
    enabled: !!bizId
  });

  // Sync data to state
  useEffect(() => {
    if (!data) return;
    setFaqs(data.faqs || []);
    setServices(data.services || []);
    setProfileViewsCount(data.views_count || 0);
    setIsFavorite(user?.favorites?.includes(bizId) || false);
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

  useEffect(() => {
  if (!socket || !bizId) return;

  // ✅ מצטרף לחדר העסק כדי לקבל עדכונים בזמן אמת
  socket.emit("joinBusinessRoom", bizId);

  // לא נרשום צפייה אם זה בעל העסק עצמו
  if (user?.businessId && user.businessId === bizId) return;

  // ✅ שליחת צפייה לשרת
  socket.emit("profileView", { businessId: bizId, src: "public" }, (res) => {
  if (res?.ok) {
    // נעדכן מיד לפי הנתון החדש שחוזר מהשרת
    if (res.stats?.views_count !== undefined) {
      setProfileViewsCount(res.stats.views_count);
    }
  } else {
    console.error("❌ Failed to register profile view:", res?.error);
  }
});

  // ✅ מאזין לעדכונים חיים מהשרת (Redis → Socket.IO → לקוח)
  const handleProfileViewsUpdate = ({ views_count }) => {
    console.log("📡 Real-time profileViewsUpdated:", views_count);
    setProfileViewsCount(views_count);
  };

  socket.on("profileViewsUpdated", handleProfileViewsUpdate);

  // ניקוי מאזין כשהקומפוננטה מתנתקת
  return () => {
    socket.off("profileViewsUpdated", handleProfileViewsUpdate);
  };
}, [socket, bizId, user?.businessId]);


  const sortedReviews = useMemo(() => {
    return [...reviews].sort(
      (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
    );
  }, [reviews]);

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please log in to manage favorites");
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
      alert("An error occurred, please try again");
    }
  };

  const handleReviewSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await API.post(`/business/${bizId}/reviews`, formData);
      setShowReviewModal(false);
      await Promise.all([refetch(), refetchReviews()]);
    } catch {
      alert("Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReviewDetails = (id) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Refs and onScreen hooks for lazy loading tab content
  const galleryRef = useRef(null);
  const reviewsRef = useRef(null);
  const calendarRef = useRef(null);

  const galleryVisible = useOnScreen(galleryRef);
  const reviewsVisible = useOnScreen(reviewsRef);
  const calendarVisible = useOnScreen(calendarRef);

  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [calendarLoaded, setCalendarLoaded] = useState(false);

  useEffect(() => {
    if (galleryVisible) setGalleryLoaded(true);
  }, [galleryVisible]);

  useEffect(() => {
    if (reviewsVisible) setReviewsLoaded(true);
  }, [reviewsVisible]);

  useEffect(() => {
    if (calendarVisible) setCalendarLoaded(true);
  }, [calendarVisible]);

  // Preload tab content when opened
  useEffect(() => {
    if (currentTab === "Gallery") setGalleryLoaded(true);
    if (currentTab === "Reviews") setReviewsLoaded(true);
    if (currentTab === "Calendar") setCalendarLoaded(true);
  }, [currentTab]);

  if (isLoading) return <div className="loading">Loading…</div>;
  if (error) return <div className="error">Error loading data</div>;
  if (!data) return <div className="error">Business not found</div>;

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
          {isOwner && (
            <Link to={`/business/${bizId}/dashboard/edit`} className="edit-profile-btn">
              ✏️ Edit Business Details
            </Link>
          )}

          {logoUrl && (
            <div className="profile-logo-wrapper">
              <img className="profile-logo" src={logoUrl} alt="Business Logo" loading="lazy" />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h1
              className="business-name"
              style={{ fontSize: "2rem", color: "#5c2d91", fontWeight: "bold" }}
            >
              {businessName}
            </h1>
            <button
              onClick={toggleFavorite}
              className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              style={{
                background: isFavorite ? "#FF4081" : "#EEE",
                border: "1px solid #4A148C",
                borderRadius: "24px",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: isFavorite ? "white" : "#4A148C",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.3s ease",
              }}
            >
              {isFavorite ? "❤️" : "🤍"}
              <span>{isFavorite ? "Favorite" : "Add to Favorites"}</span>
            </button>
          </div>

          <div className="about-phone" style={{ marginBottom: "1rem" }}>
            {category && <p><strong>🏷️ Category:</strong> {category}</p>}
            {description && <p><strong>📝 Description:</strong> {description}</p>}
            {phone && <p><strong>📞 Phone:</strong> {phone}</p>}
            {city && <p><strong>🏙️ City:</strong> {city}</p>}
          </div>

          <div
            className="reviews-summary"
            aria-label={`Average rating: ${roundedAvg.toFixed(1)} out of 5, based on ${reviews.length} reviews`}
          >
            <span className="reviews-average">
              {roundedAvg.toFixed(1)}
              <span className="star">⭐</span>
              <span className="reviews-count">({reviews.length} reviews)</span>
            </span>
          </div>

          <hr className="profile-divider" style={{ marginTop: "1rem", borderColor: "#4A148C" }} />

          <div className="profile-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`tab ${tab === currentTab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
                role="tab"
                aria-selected={tab === currentTab}
                style={{
                  padding: "10px 20px",
                  fontSize: "1rem",
                  background: "#5c2d91",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  margin: "0 5px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(92, 45, 145, 0.6)",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tab-content" role="tabpanel" dir="ltr">
            {/* Main */}
            {currentTab === "Main" && (
              <>
                <div className="public-main-images">
                  {mainImages.length ? (
                    mainImages.slice(0, 6).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Main Image ${i + 1}`}
                        loading="lazy"
                        style={{
                          margin: "10px",
                          width: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    ))
                  ) : (
                    <p className="no-data">No images available</p>
                  )}
                </div>

                <div className="latest-reviews" style={{ marginTop: "2rem" }}>
                  {sortedReviews.length ? (
                    sortedReviews.slice(0, 2).map((r, i) => {
                      const avg = r.rating || r.averageScore || 0;
                      const dateStr = new Date(r.createdAt || r.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      });
                      const isExpanded = expandedReviews[r._id || i] || false;

                      return (
                        <div key={r._id || i} className="review-card improved">
                          <p><strong>⭐ Average Rating:</strong> {avg.toFixed(1)}</p>
                          {r.comment && <p><strong>💬 Review:</strong> {r.comment}</p>}
                          <p><strong>🗓️ Date:</strong> {dateStr}</p>
                          {r.client && <p><strong>👤 By:</strong> {r.client.name}</p>}

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
                            {isExpanded ? "Hide Rating Details 📋" : "View Rating Details 📋"}
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
                    <p className="no-data">No reviews yet</p>
                  )}
                </div>
              </>
            )}

            {/* Gallery */}
            {currentTab === "Gallery" && (
              <div ref={galleryRef} className="public-main-images">
                {galleryLoaded ? (
                  gallery.length ? (
                    gallery.map((url, i) => (
                      <img key={i} src={url} alt={`Gallery ${i + 1}`} loading="lazy" />
                    ))
                  ) : (
                    <p className="no-data">No images in gallery</p>
                  )
                ) : (
                  <p>Loading gallery…</p>
                )}
              </div>
            )}

            {/* Reviews */}
            {currentTab === "Reviews" && (
              <div ref={reviewsRef} className="reviews">
                {reviewsLoaded ? (
                  <>
                    {!isOwner && user && (
                      <button className="add-review-btn" onClick={() => setShowReviewModal(true)}>
                        Add Review
                      </button>
                    )}
                    {showReviewModal && (
                      <div className="modal-bg" onClick={() => setShowReviewModal(false)}>
                        <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
                          <Suspense fallback={<div>Loading review form...</div>}>
                            <ReviewForm
                              businessId={bizId}
                              onSubmit={handleReviewSubmit}
                              isSubmitting={isSubmitting}
                            />
                          </Suspense>
                          <button className="modal-close" onClick={() => setShowReviewModal(false)}>
                            Close
                          </button>
                        </div>
                      </div>
                    )}

                    {sortedReviews.length ? (
                      sortedReviews.map((r, i) => {
                        const avg = r.rating || r.averageScore || 0;
                        const dateStr = new Date(r.createdAt || r.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        });
                        const isExpanded = expandedReviews[r._id || i] || false;

                        return (
                          <div key={r._id || i} className="review-card improved">
                            <p><strong>⭐ Average Rating:</strong> {avg.toFixed(1)}</p>
                            {r.comment && <p><strong>💬 Review:</strong> {r.comment}</p>}
                            <p><strong>🗓️ Date:</strong> {dateStr}</p>
                            {r.client && <p><strong>👤 By:</strong> {r.client.name}</p>}

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
                              {isExpanded ? "Hide Rating Details 📋" : "View Rating Details 📋"}
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
                      <p className="no-data">No reviews available</p>
                    )}
                  </>
                ) : (
                  <p>Loading reviews…</p>
                )}
              </div>
            )}

            {/* FAQs */}
            {currentTab === "FAQs" && (
              <div className="faqs-public">
                {faqs.length === 0 ? (
                  <p className="no-data">No FAQs yet</p>
                ) : (
                  faqs.map((faq, i) => (
                    <div key={faq._id || i} className="faq-card">
                      <p><strong>Question:</strong> {faq.question}</p>
                      <p><strong>Answer:</strong> {faq.answer}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Messages with Business / from Clients */}
            {currentTab === messagesTabName && (
              <div style={{ textAlign: "center", margin: "36px 0" }}>
                {user?.role === "customer" && (
                  <Link to={`/business/${bizId}/messages`} className="chat-link-btn">
                    💬 Send a Message to the Business
                  </Link>
                )}
                {user?.role === "business" && (
                  <Link to={`/business/${bizId}/dashboard/messages`} className="chat-link-btn">
                    ▶️ Manage Client Messages
                  </Link>
                )}
              </div>
            )}

            {/* Calendar */}
            {currentTab === "Calendar" && (
              <div ref={calendarRef}>
                {calendarLoaded ? (
                  <>
                    <Suspense fallback={<div>Loading services…</div>}>
                      <ServicesSelector services={services} onSelect={setSelectedService} />
                    </Suspense>
                    {!selectedService ? (
                      <p className="choose-prompt">Please select a service to view the calendar</p>
                    ) : (
                      <>
                        <button className="back-btn" onClick={() => setSelectedService(null)}>
                          ← Change Service
                        </button>
                        <Suspense fallback={<div>Loading appointment calendar…</div>}>
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
                ) : (
                  <p>Loading calendar…</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

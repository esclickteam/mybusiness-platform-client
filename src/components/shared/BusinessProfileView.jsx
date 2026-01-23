import React, { useState, useEffect, useRef, Suspense, lazy, useMemo } from "react";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/socketContext";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useSearchParams } from "react-router-dom";


import "react-calendar/dist/Calendar.css";
import "../../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar.css";
import "./BusinessProfileView.css";
import ReviewCard from "../../components/ReviewCard";


const ReviewForm = lazy(() => import("../../pages/business/dashboardPages/buildTabs/ReviewForm"));
const ServicesSelector = lazy(() => import("../ServicesSelector"));
const ClientCalendar = lazy(() => import("../../pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar"));




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
  const [searchParams] = useSearchParams();
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

    const TAB_MAP = {
    main: "Main",
    gallery: "Gallery",
    reviews: "Reviews",
    faqs: "FAQs",
    calendar: "Calendar",
  };

  // States
  const [faqs, setFaqs] = useState([]);
  const [services, setServices] = useState([]);
  const [schedule, setSchedule] = useState({});
  const initialTab =
    TAB_MAP[searchParams.get("tab")?.toLowerCase()] || "Main";


const [currentTab, setCurrentTab] = useState(initialTab);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [profileViewsCount, setProfileViewsCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);


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
  queryFn: () => 
    API.get(`/business/${bizId}/profile`)
      .then(res => res.data.reviews || res.data.business?.reviews || []),
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

  // הצטרפות לחדר פעם אחת בלבד
  if (!socket._joinedRooms) socket._joinedRooms = new Set();
  if (!socket._joinedRooms.has(bizId)) {
    socket.emit("joinBusinessRoom", bizId);
    socket._joinedRooms.add(bizId);
  }

  // לא נשלח צפייה אם זה בעל העסק עצמו
  if (user?.businessId === bizId) return;

  // הגנה כפולה: גם sessionStorage וגם window
  const viewedKey = `viewed_${bizId}`;
  const hasSentView =
    window.__sentProfileView ?? (window.__sentProfileView = new Set());

  if (hasSentView.has(bizId) || sessionStorage.getItem(viewedKey)) return;

  hasSentView.add(bizId);
  sessionStorage.setItem(viewedKey, "1");

  // ✅ שליחת צפייה רק פעם אחת אמיתית
  socket.emit("profileView", { businessId: bizId, src: "public" }, (res) => {
    if (res?.ok && res.stats?.views_count !== undefined) {
      setProfileViewsCount(res.stats.views_count);
    } else if (res?.error) {
      console.error("❌ Failed to register profile view:", res.error);
    }
  });
}, [socket, bizId]);

useEffect(() => {
  if (!socket || !bizId) return;

  const handleNewReview = (review) => {
    console.log("🔥 PUBLIC PROFILE RECEIVED NEW REVIEW:", review);

    // Normalize incoming review
    const normalizedReview = {
      _id: review._id,
      rating: review.rating || review.averageScore || 0,
      averageScore: review.rating || review.averageScore || 0,
      comment: review.comment || "",
      createdAt: review.date || new Date().toISOString(),
      client: {
        name: review.client?.name || "Anonymous",
      },
      ratings: review.ratings || {},
    };

    // Update in cache immediately
    queryClient.setQueryData(["reviews", bizId], (old = []) => {
      return [normalizedReview, ...old];
    });

    // Force React Query to re-run query
    queryClient.refetchQueries(["reviews", bizId], { exact: true });
  };

  socket.on("review:new", handleNewReview);

  return () => {
    socket.off("review:new", handleNewReview);
  };
}, [socket, bizId, queryClient]);


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

  const roundedAvg =
  data?.rating != null
    ? Math.round(Number(data.rating) * 10) / 10
    : 0;

const reviewsCount =
  data?.reviewsCount != null
    ? Number(data.reviewsCount)
    : reviews.length;

const hasRating = reviewsCount > 0;

const isOwner =
  user?.role === "business" && user.businessId === bizId;

  const handleTabChange = (tab) => {
  setCurrentTab(tab);
  setSelectedService(null);

  const key = tab.toLowerCase();
  window.history.replaceState(null, "", `?tab=${key}`);
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

          <div className="profile-hero">
  <div className="hero-title">
    <h1 className="business-name">{businessName}</h1>

    {hasRating && (
      <div className="hero-rating">
        ⭐ {roundedAvg.toFixed(1)} · {reviewsCount} reviews
      </div>
    )}
  </div>

  {["customer", "user", "client"].includes(user?.role) && (
    <button
      onClick={toggleFavorite}
      className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? "❤️" : "🤍"}
    </button>
  )}
</div>


          <div className="about-phone" style={{ marginBottom: "1rem" }}>
            {category && <p><strong>🏷️ Category:</strong> {category}</p>}
            {description && <p><strong>📝 Description:</strong> {description}</p>}
            {phone && <p><strong>📞 Phone:</strong> {phone}</p>}
            {city && <p><strong>🏙️ City:</strong> {city}</p>}
          </div>

          {hasRating && (
  <div
    className="reviews-summary"
    aria-label={`Average rating: ${roundedAvg.toFixed(1)} out of 5, based on ${reviewsCount} reviews`}
  >
    <span className="reviews-average">
      {roundedAvg.toFixed(1)}
      <span className="star">⭐</span>
      <span className="reviews-count">({reviewsCount} reviews)</span>
    </span>
  </div>
)}

          <hr className="profile-divider" style={{ marginTop: "1rem", borderColor: "#4A148C" }} />

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
                    sortedReviews.slice(0, 2).map((r, i) => (
  <ReviewCard
    key={r._id || i}
    review={r}
  />
))


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
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          <span>{reviewsCount} reviews</span>
        </div>

        {!isOwner && user && (
          <button
            className="add-review-btn"
            onClick={() => setShowReviewModal(true)}
          >
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
              <button
                className="modal-close"
                onClick={() => setShowReviewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {sortedReviews.length ? (
          sortedReviews.map((r, i) => (
            <ReviewCard key={r._id || i} review={r} />
          ))
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
        <div key={faq._id || i} className="faq-item">
          <button
            className="faq-question"
            onClick={() =>
              setOpenFaqIndex(openFaqIndex === i ? null : i)
            }
          >
            {faq.question}
          </button>

          {openFaqIndex === i && (
            <div className="faq-answer">
              {faq.answer}
            </div>
          )}
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
        <h2 className="section-title">
          {selectedService ? "Choose Date & Time" : "Choose a Service"}
        </h2>

        <Suspense fallback={<div>Loading services…</div>}>
          <ServicesSelector services={services} onSelect={setSelectedService} />
        </Suspense>

        {!selectedService ? (
          <p className="choose-prompt">
            Please select a service to view the calendar
          </p>
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

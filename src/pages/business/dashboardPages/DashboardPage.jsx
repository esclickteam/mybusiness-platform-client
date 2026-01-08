import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import { createSocket } from "../../../socket";
import { useParams } from "react-router-dom";
import "../../../styles/dashboard.css";

import { lazyWithPreload } from "../../../utils/lazyWithPreload";
import DashboardSkeleton from "../../../components/DashboardSkeleton";
import UpgradeOfferCard from "../../../components/UpgradeOfferCard";




/*************************
 * Lazy-loaded components
 *************************/
const DashboardCards = lazyWithPreload(() =>
  import("../../../components/DashboardCards")
);
const BarChartComponent = lazyWithPreload(() =>
  import("../../../components/dashboard/BarChart")
);
const Insights = lazyWithPreload(() =>
  import("../../../components/dashboard/Insights")
);
const NextActions = lazyWithPreload(() =>
  import("../../../components/dashboard/NextActions")
);
const WeeklySummary = lazyWithPreload(() =>
  import("../../../components/dashboard/WeeklySummary")
);
const CalendarView = lazyWithPreload(() =>
  import("../../../components/dashboard/CalendarView")
);
const DailyAgenda = lazyWithPreload(() =>
  import("../../../components/dashboard/DailyAgenda")
);
const DashboardNav = lazyWithPreload(() =>
  import("../../../components/dashboard/DashboardNav")
);

/*************************
 * Helpers
 *************************/
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function enrichAppointment(appt, business = {}) {
  let serviceName = appt.serviceName?.trim();
  if (!serviceName && business.services) {
    const service = business.services.find(
      (s) => s._id.toString() === appt.serviceId?.toString()
    );
    serviceName = service?.name;
  }
  return {
    ...appt,
    clientName: appt.clientName?.trim() || "Unknown",
    serviceName: serviceName || "Unknown",
  };
}

function countItemsInLastWeek(items, dateKey = "date") {
  if (!Array.isArray(items)) return 0;
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);
  return items.filter((item) => {
    const itemDate = new Date(item[dateKey]);
    return itemDate >= weekAgo && itemDate <= now;
  }).length;
}

async function fetchDashboardStats(businessId, refreshAccessToken) {
  const token = await refreshAccessToken();
  if (!token) throw new Error("No token");
  const res = await API.get(`/business/${businessId}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

const fetchAppointments = async (businessId, refreshAccessToken) => {
  const token = await refreshAccessToken();
  if (!token) throw new Error("No token");
  const res = await API.get(
    `/appointments/all-with-services?businessId=${businessId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/*************************
 * Pre-load all chunks on mount
 *************************/
export function preloadDashboardComponents() {
  DashboardCards.preload();
  BarChartComponent.preload();
  Insights.preload();
  NextActions.preload();
  WeeklySummary.preload();
  CalendarView.preload();
  DailyAgenda.preload();
  DashboardNav.preload();
}

const DashboardPage = () => {
  const {
    user,
    initialized,
    logout,
    refreshAccessToken,
    refreshUser,
    setUser,
  } = useAuth();
  const { businessId } = useParams();


  /* 🎨 הפעלה מיידית של ה־theme לעסקים */
  useEffect(() => {
    document.body.setAttribute("data-theme", "business");
  }, []);


  /* refs */
  const cardsRef = useRef(null);
  const insightsRef = useRef(null);
  const chartsRef = useRef(null);
  const appointmentsRef = useRef(null);
  const nextActionsRef = useRef(null);
  const weeklySummaryRef = useRef(null);

  /* sockets */
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  /* navigation helpers */
  const navigate = useNavigate();
  const location = useLocation();

  /* state */
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [alert, setAlert] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshingUser, setIsRefreshingUser] = useState(false);

  /* scroll + hash cleanup */
  useEffect(() => {
    if (location.hash) {
      window.history.replaceState(
        {},
        document.title,
        location.pathname + location.search
      );
    }
    window.scrollTo(0, 0);
  }, [location]);

  /* redirect */
  useEffect(() => {
    if (
      initialized &&
      user?.role === "business" &&
      user?.businessId &&
      location.pathname === "/dashboard"
    ) {
      navigate(`/business/${user.businessId}/dashboard`, { replace: true });
    }
  }, [initialized, user, location.pathname, navigate]);

  /* ?paid=1 polling */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("paid") === "1") {
      setIsRefreshingUser(true);
      let attempts = 0;
      const maxAttempts = 10;
      const poll = async () => {
        attempts++;
        try {
          await refreshAccessToken();
          const updatedUser = await refreshUser();
          if (updatedUser?.hasPaid) {
            setIsRefreshingUser(false);
            setUser(updatedUser);
            window.history.replaceState({}, document.title, location.pathname);
            if (updatedUser.role === "business" && updatedUser.businessId) {
              navigate(`/business/${updatedUser.businessId}/dashboard`, {
                replace: true,
              });
            } else {
              navigate("/dashboard", { replace: true });
            }
          } else if (attempts < maxAttempts) {
            setTimeout(poll, 3000);
          } else {
            setIsRefreshingUser(false);
            alert("Your subscription has not been activated yet. Try again soon.");
            window.history.replaceState({}, document.title, location.pathname);
          }
        } catch (e) {
          setIsRefreshingUser(false);
          alert("Error checking subscription status.");
          window.history.replaceState({}, document.title, location.pathname);
        }
      };
      poll();
    }
  }, [
    location.search,
    navigate,
    refreshAccessToken,
    refreshUser,
    setUser,
    location.pathname,
  ]);

  /* preload once */
  useEffect(() => {
    preloadDashboardComponents();
  }, []);

  /* debounced stats setter */
  const debouncedSetStats = useRef(
    debounce((newStats) => {
      setStats(newStats);
      localStorage.setItem("dashboardStats", JSON.stringify(newStats));
    }, 300)
  ).current;

  /* fetch stats */
  const loadStats = async () => {
    if (!businessId) return;
    setLoading(true);
    setError(null);

    const cached = localStorage.getItem("dashboardStats");
    if (cached) setStats(JSON.parse(cached));

    try {
      const data = await fetchDashboardStats(businessId, refreshAccessToken);
      setStats(data);
      localStorage.setItem("dashboardStats", JSON.stringify(data));
    } catch (err) {
      setError("❌ Error loading data from server.");
      if (err.message === "No token") logout();
    } finally {
      setLoading(false);
    }
  };

  /* refresh appointments on server notification */
  const refreshAppointmentsFromAPI = useCallback(async () => {
    if (!businessId) return;
    try {
      const appts = await fetchAppointments(businessId, refreshAccessToken);
      setStats((oldStats) => ({
        ...oldStats,
        appointments: appts,
        appointments_count: appts.length,
      }));
    } catch (err) {
      console.error("Error refreshing appointments from API:", err);
    }
  }, [businessId, refreshAccessToken]);

  /* socket lifecycle */
  useEffect(() => {
  if (!initialized || !businessId) return;

  let isMounted = true;
  let reconnectTimeout = null;

  const setupSocket = async () => {
    const token = await refreshAccessToken();
    if (!token) {
      logout();
      return;
    }

    const sock = await createSocket(refreshAccessToken, logout, businessId);
    if (!sock || !isMounted) return;

    socketRef.current = sock;
    reconnectAttempts.current = 0;

    /* ✅ Join business room */
    sock.on("connect", () => {
      sock.emit("joinBusinessRoom", businessId);
      sock.emit("subscribeToBusinessUpdates", businessId);
    });

    /* 🔁 Handle disconnect & auto-reconnect */
    sock.on("disconnect", () => {
      if (isMounted && reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
        reconnectTimeout = setTimeout(() => {
          reconnectAttempts.current += 1;
          setupSocket();
        }, delay);
      }
    });

    /* 🔐 Handle token refresh */
    sock.on("tokenExpired", async () => {
      const newToken = await refreshAccessToken();
      if (!newToken) return logout();
      sock.auth.token = newToken;
      sock.emit("authenticate", { token: newToken });
    });

    /* 🧠 Core event listeners */
    sock.on("dashboardUpdate", (newStats) => debouncedSetStats(newStats));
    
    sock.on("appointmentCreated", refreshAppointmentsFromAPI);
    sock.on("appointmentUpdated", refreshAppointmentsFromAPI);
    sock.on("appointmentDeleted", refreshAppointmentsFromAPI);

    sock.on("newRecommendation", (rec) =>
      setRecommendations((prev) => [...prev, rec])
    );

    /* ✅ Unified Real-time Listener — handles all Redis → Socket.IO events */
/* ✅ Unified Real-time Listener — handles all Redis → Socket.IO events */
sock.off("businessUpdates");
sock.on("businessUpdates", (payload) => {
  try {
    const data = typeof payload === "string" ? JSON.parse(payload) : payload;
    if (!data?.type) return;

    const { type, data: eventData } = data;
    console.log("📡 [Live Update]", type, eventData);

    switch (type) {
      // 🔹 עדכון כללי של לוח הבקרה (סטטיסטיקות)
      case "dashboardUpdate":
        debouncedSetStats(eventData);
        break;

      // 🔹 צפיות בפרופיל (עם הגנה כפולה + בדיקת שינוי אמיתי)
      case "profileViewsUpdated":
        setStats((s) => {
          if (!s) return s;

          // 🧠 מניעת עדכון כפול אם הערך זהה או קטן יותר
          if (!eventData?.views_count || s.views_count >= eventData.views_count)
            return s;

          return { ...s, views_count: eventData.views_count };
        });
        break;

      // 🔹 פגישות — כל שינוי גורם לריענון מיידי
      case "appointmentCreated":
      case "appointmentUpdated":
      case "appointmentDeleted":
        refreshAppointmentsFromAPI();
        break;

      // 🔹 ביקורות חדשות (עם בדיקת כפילות)
      case "newReview": {
        setStats((s) => {
          if (!s) return s;
          const exists = s.reviews?.some((r) => r._id === eventData._id);
          if (exists) return s; // ⛔ מניעת ספירה כפולה

          return {
            ...s,
            reviews: [...(s.reviews || []), eventData],
            reviews_count: (s.reviews_count || 0) + 1,
          };
        });
        break;
      }

      // 🔹 התראות חדשות (כולל באנדלים)
      case "newNotification":
      case "notificationBundle":
        setStats((s) =>
          s
            ? {
                ...s,
                notifications_count:
                  eventData.count || s.notifications_count || 0,
              }
            : s
        );
        break;

      // 🔹 הודעות חדשות בצ׳אט
      case "newMessage":
        setStats((s) =>
          s
            ? {
                ...s,
                messages_count: (s.messages_count || 0) + 1,
              }
            : s
        );
        break;

      default:
        console.log("📡 [Unhandled Event]", type);
    }
  } catch (err) {
    console.error("❌ Error parsing businessUpdates payload:", err);
  }
});

/* ✅ Direct socket event fallback — for servers that emit 'newReview' directly */
sock.on("newReview", (reviewData) => {
  console.log("📡 [Direct Socket] newReview", reviewData);
  setStats((s) => {
    if (!s) return s;
    const exists = s.reviews?.some((r) => r._id === reviewData._id);
    if (exists) return s;

    return {
      ...s,
      reviews: [...(s.reviews || []), reviewData],
      reviews_count: (s.reviews_count || 0) + 1,
    };
  });
});


  };

  loadStats();
  refreshAppointmentsFromAPI();
  setupSocket();

  return () => {
    isMounted = false;
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    socketRef.current?.disconnect();
    socketRef.current = null;
  };
}, [
  initialized,
  businessId,
  logout,
  refreshAccessToken,
  debouncedSetStats,
  refreshAppointmentsFromAPI,
]);


  /* mark messages read */
  useEffect(() => {
    if (!socketRef.current) return;
    if (location.pathname.includes("/messages")) {
      const conversationId = location.state?.conversationId;
      if (conversationId) {
        socketRef.current.emit("markMessagesRead", conversationId);
      }
    }
  }, [location.pathname, location.state]);



  // 🎁 Early Bird → Stripe Checkout (NO /plans)
  const handleEarlyBirdUpgrade = async () => {
    try {
      const res = await API.post("/stripe/create-checkout-session", {


        userId: user.userId,
        plan: "monthly", // Early Bird תמיד חודשי
      });

      if (res.data?.url) {
        window.location.href = res.data.url; // ⬅️ Stripe Checkout
      } else {
        alert("Checkout link not available.");
      }
    } catch (err) {
      console.error("Early Bird checkout error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  /* guards */
  if (!initialized) {
    return <p className="dp-loading">⏳ Loading data...</p>;
  }

const isAdmin = user?.role === "admin";
const isBusinessOwner =
  user?.role === "business" && user?.businessId === businessId;

if (!isAdmin && !isBusinessOwner) {
  return (
    <p className="dp-error">
      You don't have permission to access this business dashboard.
    </p>
  );
}

if (loading && !stats) {
  return <DashboardSkeleton />;
}

if (error) {
  return <p className="dp-error">{alert || error}</p>;
}

if (isRefreshingUser) {
  return <p className="dp-loading">⏳ Refreshing user info...</p>;
}

// 🎁 Early Bird upgrade banner condition
const showEarlyBird =
  user?.subscriptionPlan === "trial" &&
  !user?.hasPaid &&
  user?.earlyBirdShownAt &&
  user?.earlyBirdExpiresAt &&
  new Date(user.earlyBirdExpiresAt) > new Date() &&
  !user?.earlyBirdUsed;




  /* derived */
  const effectiveStats = stats || {};
  const enrichedAppointments = (effectiveStats.appointments || []).map((appt) =>
    enrichAppointment(appt, effectiveStats)
  );
  const getUpcomingAppointmentsCount = (appointments) => {
    const now = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(now.getDate() + 7);
    return appointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      return apptDate >= now && apptDate <= endOfWeek;
    }).length;
  };
  const syncedStats = {
    ...effectiveStats,
    messages_count: effectiveStats.messages_count || 0,
  };



  /*******************
   * Render — English UI
   *******************/
  return (
    <div className="dp-root" dir="ltr">
      {/* Topbar */}
      <header className="dp-topbar">
        <div className="dp-topbar__brand">
          
          <div className="dp-brand-titles">
            <h1>Business Dashboard</h1>
            {user?.businessName && (
              <span className="dp-subtitle">Welcome, {user.businessName}</span>
            )}
          </div>
        </div>
        
      </header>

      <div className="dp-layout">
        {/* Sidebar */}
        <aside className="dp-sidebar">
          <nav className="dp-nav">
            <Suspense fallback={<div className="dp-loading-sm">🔄 Loading navigation...</div>}>
              <DashboardNav
                refs={{
                  cardsRef,
                  insightsRef,
                  chartsRef,
                  appointmentsRef,
                  nextActionsRef,
                  weeklySummaryRef,
                }}
              />
            </Suspense>
          </nav>

          <div className="dp-tip">
            
            <p className="dp-tip__text">
              
            </p>
          </div>
        </aside>

        {/* Main */}
        <main className="dp-main">
  {alert && <p className="dp-error">{alert}</p>}

  {/* 🎁 Early Bird Upgrade Offer */}
  {showEarlyBird && (
    <div style={{ marginBottom: "16px" }}>
      <UpgradeOfferCard
        expiresAt={user.earlyBirdExpiresAt}
        onUpgrade={handleEarlyBirdUpgrade}

      />
    </div>
  )}




          {/* AI recommendations banner */}
          {recommendations.length > 0 && (
            <section className="dp-banner">
              <div className="dp-banner__head">
                <h3>AI Recommendations for Approval</h3>
                <span className="dp-pill">{recommendations.length}</span>
              </div>
              <ul className="dp-rec-list">
                {recommendations.map(({ recommendationId, message, recommendation }) => (
                  <li key={recommendationId} className="dp-rec">
                    <div className="dp-rec__msg"><b>Client:</b> {message}</div>
                    <div className="dp-rec__ai"><b>AI Suggestion:</b> {recommendation}</div>
                    <div className="dp-rec__actions">
                      <button
                        className="dp-btn dp-btn--primary"
                        onClick={() => {
                          if (!socketRef.current) return alert("Socket not connected");
                          socketRef.current.emit(
                            "approveRecommendation",
                            { recommendationId },
                            (res) => {
                              if (res?.ok) {
                                setRecommendations((prev) =>
                                  prev.filter((r) => r.recommendationId !== recommendationId)
                                );
                              } else {
                                alert("Error: " + (res?.error || ""));
                              }
                            }
                          );
                        }}
                      >
                        Approve & Send
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* KPI cards */}
          <section ref={cardsRef} className="dp-section">
            <Suspense fallback={<div className="dp-loading-sm">🔄 Loading cards...</div>}>
              <div className="dp-card dp-card--panel">
                <DashboardCards stats={syncedStats} unreadCount={syncedStats.messages_count} />
              </div>
            </Suspense>
          </section>

          {/* Insights + Chart */}
          <section className="dp-grid-2">
            <div ref={insightsRef} className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 Loading insights...</div>}>
                <Insights
                  stats={{
                    ...syncedStats,
                    upcoming_appointments: getUpcomingAppointmentsCount(enrichedAppointments),
                  }}
                />
              </Suspense>
            </div>

            <div ref={chartsRef} className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 Loading chart...</div>}>
                <BarChartComponent
                  appointments={enrichedAppointments}
                  title="Clients Who Booked Appointments by Month"
                />
              </Suspense>
            </div>
          </section>

          {/* Agenda + Calendar */}
          <section ref={appointmentsRef} className="dp-grid-2">
            <div className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 Loading agenda...</div>}>
                <DailyAgenda
                  date={selectedDate}
                  appointments={enrichedAppointments}
                  businessName={syncedStats.businessName}
                  businessId={businessId}
                />
              </Suspense>
            </div>
            <div className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 Loading calendar...</div>}>
                <CalendarView
                  appointments={enrichedAppointments}
                  onDateClick={setSelectedDate}
                  selectedDate={selectedDate}
                />
              </Suspense>
            </div>
          </section>

          {/* Next actions */}
          <section ref={nextActionsRef} className="dp-section">
            <div className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 Loading actions...</div>}>
                <NextActions
                  stats={{
                    weekly_views_count: countItemsInLastWeek(syncedStats.views, "date"),
                    weekly_appointments_count: countItemsInLastWeek(enrichedAppointments),
                    weekly_reviews_count: countItemsInLastWeek(syncedStats.reviews, "date"),
                    weekly_messages_count: countItemsInLastWeek(syncedStats.messages, "date"),
                  }}
                />
              </Suspense>
            </div>
          </section>

          {/* Weekly summary + Recent activity */}
          <section ref={weeklySummaryRef} className="dp-grid-2">
            <div className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 Loading weekly summary...</div>}>
                <WeeklySummary stats={syncedStats} />
              </Suspense>
            </div>
            <div className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 Loading recent activity...</div>}>
              
              </Suspense>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

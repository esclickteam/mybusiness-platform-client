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
import { getBusinessId } from "../../../utils/authHelpers";
import "../../../styles/dashboard.css";

import { lazyWithPreload } from "../../../utils/lazyWithPreload";
import DashboardSkeleton from "../../../components/DashboardSkeleton";

/*************************
 * Lazy-loaded components
 *************************/
const DashboardCards       = lazyWithPreload(() => import("../../../components/DashboardCards"));
const BarChartComponent    = lazyWithPreload(() => import("../../../components/dashboard/BarChart"));
const RecentActivityTable  = lazyWithPreload(() => import("../../../components/dashboard/RecentActivityTable"));
const Insights             = lazyWithPreload(() => import("../../../components/dashboard/Insights"));
const NextActions          = lazyWithPreload(() => import("../../../components/dashboard/NextActions"));
const WeeklySummary        = lazyWithPreload(() => import("../../../components/dashboard/WeeklySummary"));
const CalendarView         = lazyWithPreload(() => import("../../../components/dashboard/CalendarView"));
const DailyAgenda          = lazyWithPreload(() => import("../../../components/dashboard/DailyAgenda"));
const DashboardNav         = lazyWithPreload(() => import("../../../components/dashboard/DashboardNav"));

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
  return { ...appt, clientName: appt.clientName?.trim() || "לא ידוע", serviceName: serviceName || "לא ידוע" };
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
  RecentActivityTable.preload();
  Insights.preload();
  NextActions.preload();
  WeeklySummary.preload();
  CalendarView.preload();
  DailyAgenda.preload();
  DashboardNav.preload();
}

/*************************
 * Main component
 *************************/
const DashboardPage = () => {
  const { user, initialized, logout, refreshAccessToken, refreshUser, setUser } = useAuth();
  const businessId = getBusinessId();

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
  const navigate  = useNavigate();
  const location  = useLocation();

  /* state */
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [alert, setAlert]               = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [isRefreshingUser, setIsRefreshingUser] = useState(false);

  /* always top & remove hash */
  useEffect(() => {
    if (location.hash) {
      window.history.replaceState({}, document.title, location.pathname + location.search);
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
              navigate(`/business/${updatedUser.businessId}/dashboard`, { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          } else if (attempts < maxAttempts) {
            setTimeout(poll, 3000);
          } else {
            setIsRefreshingUser(false);
            alert("המנוי טרם הופעל. נסה לרענן שוב בעוד רגע.");
            window.history.replaceState({}, document.title, location.pathname);
          }
        } catch (e) {
          setIsRefreshingUser(false);
          alert("שגיאה בבדיקת סטטוס מנוי.");
          window.history.replaceState({}, document.title, location.pathname);
        }
      };
      poll();
    }
  }, [location.search, navigate, refreshAccessToken, refreshUser, setUser, location.pathname]);

  /* preload once */
  useEffect(() => { preloadDashboardComponents(); }, []);

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
      setError("❌ שגיאה בטעינת נתונים מהשרת");
      if (err.message === "No token") logout();
    } finally {
      setLoading(false);
    }
  };

  /* refresh appts on server notification */
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

    let isMounted        = true;
    let reconnectTimeout = null;

    const setupSocket = async () => {
      const token = await refreshAccessToken();
      if (!token) {
        logout();
        return;
      }

      const sock = await createSocket(refreshAccessToken, logout, businessId);
      if (!sock || !isMounted) return;

      socketRef.current     = sock;
      reconnectAttempts.current = 0;

      sock.on("connect", () => {
        sock.emit("joinBusinessRoom", businessId);
      });

      sock.on("disconnect", () => {
        if (isMounted && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
          reconnectTimeout = setTimeout(() => {
            reconnectAttempts.current += 1;
            setupSocket();
          }, delay);
        }
      });

      sock.on("tokenExpired", async () => {
        const newToken = await refreshAccessToken();
        if (!newToken) return logout();
        sock.auth.token = newToken;
        sock.emit("authenticate", { token: newToken });
      });

      sock.on("dashboardUpdate", (newStats) => debouncedSetStats(newStats));
      sock.on("profileViewsUpdated", ({ views_count }) => {
        setStats((s) => (s ? { ...s, views_count } : s));
      });

      sock.on("appointmentCreated", refreshAppointmentsFromAPI);
      sock.on("appointmentUpdated", refreshAppointmentsFromAPI);
      sock.on("appointmentDeleted", refreshAppointmentsFromAPI);

      sock.on("newRecommendation", (rec) =>
        setRecommendations((prev) => [...prev, rec])
      );
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
  }, [initialized, businessId, logout, refreshAccessToken, debouncedSetStats, refreshAppointmentsFromAPI]);

  /* mark messages read when route changes */
  useEffect(() => {
    if (!socketRef.current) return;
    if (location.pathname.includes("/messages")) {
      const conversationId = location.state?.conversationId;
      if (conversationId) {
        socketRef.current.emit("markMessagesRead", conversationId);
      }
    }
  }, [location.pathname, location.state]);

  /* guards */
  if (!initialized)         return <p className="dp-loading">⏳ טוען נתונים…</p>;
  if (user?.role !== "business" || !businessId)
    return <p className="dp-error">אין לך הרשאה לצפות בדשבורד העסק.</p>;
  if (loading && !stats)    return <DashboardSkeleton />;
  if (error)                return <p className="dp-error">{alert || error}</p>;
  if (isRefreshingUser)     return <p className="dp-loading">⏳ מרענן פרטי משתמש…</p>;

  /* derived */
  const effectiveStats      = stats || {};
  const enrichedAppointments = (effectiveStats.appointments || []).map((appt) =>
    enrichAppointment(appt, effectiveStats)
  );
  const getUpcomingAppointmentsCount = (appointments) => {
    const now        = new Date();
    const endOfWeek  = new Date();
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
   * Render — NEW UX
   *******************/
  return (
    <div className="dp-root" dir="rtl">
      {/* Topbar */}
      <header className="dp-topbar">
        <div className="dp-topbar__brand">
          <img src="/logo192.png" alt="עסקליק" className="dp-logo" />
          <div className="dp-brand-titles">
            <h1>דשבורד העסק</h1>
            {user?.businessName && <span className="dp-subtitle">שלום, {user.businessName}</span>}
          </div>
        </div>
        <div className="dp-topbar__actions">
          <button className="dp-btn dp-btn--ghost" onClick={()=>navigate(`/business/${businessId}/profile`)}>עמוד עסקי</button>
          <button className="dp-btn dp-btn--primary" onClick={()=>navigate(`/business/${businessId}/messages`)}>הודעות ({syncedStats.messages_count})</button>
        </div>
      </header>

      <div className="dp-layout">
        {/* Sidebar */}
        <aside className="dp-sidebar">
          <nav className="dp-nav">
            <Suspense fallback={<div className="dp-loading-sm">🔄 טוען ניווט…</div>}>
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
            <div className="dp-tip__title">תובנת AI</div>
            <p className="dp-tip__text">
              צפיות בפרופיל עלו השבוע. מומלץ לשלוח הודעת מעקב אוטומטית לפונים חדשים.
            </p>
          </div>
        </aside>

        {/* Main */}
        <main className="dp-main">
          {alert && <p className="dp-error">{alert}</p>}

          {/* AI recommendations banner */}
          {recommendations.length > 0 && (
            <section className="dp-banner">
              <div className="dp-banner__head">
                <h3>המלצות AI לאישור</h3>
                <span className="dp-pill">{recommendations.length}</span>
              </div>
              <ul className="dp-rec-list">
                {recommendations.map(({ recommendationId, message, recommendation }) => (
                  <li key={recommendationId} className="dp-rec">
                    <div className="dp-rec__msg"><b>לקוח:</b> {message}</div>
                    <div className="dp-rec__ai"><b>המלצת AI:</b> {recommendation}</div>
                    <div className="dp-rec__actions">
                      <button
                        className="dp-btn dp-btn--primary"
                        onClick={() => {
                          if (!socketRef.current) return alert("Socket לא מחובר");
                          socketRef.current.emit("approveRecommendation", { recommendationId }, (res) => {
                            if (res?.ok) {
                              setRecommendations((prev) => prev.filter((r) => r.recommendationId !== recommendationId));
                            } else {
                              alert("שגיאה: " + (res?.error || ""));
                            }
                          });
                        }}
                      >
                        אשר ושלח
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* KPI cards */}
          <section ref={cardsRef} className="dp-section">
            <Suspense fallback={<div className="dp-loading-sm">🔄 טוען כרטיסים…</div>}>
              <div className="dp-card dp-card--panel">
                <DashboardCards stats={syncedStats} unreadCount={syncedStats.messages_count} />
              </div>
            </Suspense>
          </section>

          {/* Insights + Chart */}
          <section className="dp-grid-2">
            <div ref={insightsRef} className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 טוען תובנות…</div>}>
                <Insights
                  stats={{
                    ...syncedStats,
                    upcoming_appointments: getUpcomingAppointmentsCount(enrichedAppointments),
                  }}
                />
              </Suspense>
            </div>

            <div ref={chartsRef} className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 טוען גרף…</div>}>
                <BarChartComponent
                  appointments={enrichedAppointments}
                  title="לקוחות שהזמינו פגישות לפי חודשים"
                />
              </Suspense>
            </div>
          </section>

          {/* Agenda + Calendar */}
          <section ref={appointmentsRef} className="dp-grid-2">
            <div className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 טוען יומן…</div>}>
                <DailyAgenda
                  date={selectedDate}
                  appointments={enrichedAppointments}
                  businessName={syncedStats.businessName}
                  businessId={businessId}
                />
              </Suspense>
            </div>
            <div className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 טוען לוח שנה…</div>}>
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
              <Suspense fallback={<div className="dp-loading-sm">🔄 טוען פעולות…</div>}>
                <NextActions
                  stats={{
                    weekly_views_count:       countItemsInLastWeek(syncedStats.views, "date"),
                    weekly_appointments_count: countItemsInLastWeek(enrichedAppointments),
                    weekly_reviews_count:     countItemsInLastWeek(syncedStats.reviews, "date"),
                    weekly_messages_count:    countItemsInLastWeek(syncedStats.messages, "date"),
                  }}
                />
              </Suspense>
            </div>
          </section>

          {/* Weekly summary + Recent activity */}
          <section ref={weeklySummaryRef} className="dp-grid-2">
            <div className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 טוען סיכום שבועי…</div>}>
                <WeeklySummary stats={syncedStats} />
              </Suspense>
            </div>
            <div className="dp-card dp-card--panel">
              <Suspense fallback={<div className="dp-loading-sm">🔄 טוען פעילות אחרונה…</div>}>
                <RecentActivityTable stats={syncedStats} />
              </Suspense>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

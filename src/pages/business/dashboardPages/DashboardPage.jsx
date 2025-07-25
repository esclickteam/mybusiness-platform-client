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
 * Lazy‑loaded components
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

  let clientName = appt.clientName?.trim();

  return {
    ...appt,
    clientName: clientName || "לא ידוע",
    serviceName: serviceName || "לא ידוע",
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
 * Pre‑load all chunks on mount
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

  /*******************
   * Redirect business user with businessId to personal dashboard if on "/dashboard"
   *******************/
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

  /*******************
   * Poll & refresh profile if "?paid=1" is in URL and update user state accordingly
   *******************/
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

            // Remove ?paid=1 from URL without page reload
            window.history.replaceState({}, document.title, location.pathname);

            // Redirect to proper dashboard
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

  /*******************
   * Pre‑load chunks once
   *******************/
  useEffect(() => {
    preloadDashboardComponents();
  }, []);

  /*******************
   * Debounced setter → localStorage cache
   *******************/
  const debouncedSetStats = useRef(
    debounce((newStats) => {
      setStats(newStats);
      localStorage.setItem("dashboardStats", JSON.stringify(newStats));
    }, 300)
  ).current;

  /*******************
   * Fetch stats once (and refresh on demand)
   *******************/
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

  /*******************
   * Refresh appointments whenever server notifies us
   *******************/
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

  /*******************
   * WebSocket lifecycle
   *******************/
  useEffect(() => {
    if (!initialized || !businessId) return;

    let isMounted        = true;
    let reconnectTimeout = null;

    const safeEmit = (socket, event, data, cb) => {
      if (!socket || socket.disconnected) {
        console.warn(`Socket disconnected, cannot emit ${event}`);
        cb?.({ ok: false, error: "Socket disconnected" });
        return;
      }
      socket.emit(event, data, cb);
    };

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
        console.log("Dashboard socket connected", sock.id);
        sock.emit("joinBusinessRoom", businessId);
      });

      sock.on("disconnect", (reason) => {
        console.log("Dashboard socket disconnected", reason);
        if (isMounted && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
          reconnectTimeout = setTimeout(() => {
            reconnectAttempts.current += 1;
            console.log(`Attempt #${reconnectAttempts.current} reconnecting…`);
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

  /*******************
   * mark messages read when route changes
   *******************/
  useEffect(() => {
    if (!socketRef.current) return;
    if (location.pathname.includes("/messages")) {
      const conversationId = location.state?.conversationId;
      if (conversationId) {
        socketRef.current.emit("markMessagesRead", conversationId);
      }
    }
  }, [location.pathname, location.state]);

  /*******************
   * Guard‑clauses
   *******************/
  if (!initialized)         return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (user?.role !== "business" || !businessId)
    return <p className="error-text">אין לך הרשאה לצפות בדשבורד העסק.</p>;
  if (loading && !stats)    return <DashboardSkeleton />;
  if (error)                return <p className="error-text">{alert || error}</p>;
  if (isRefreshingUser)     return <p className="loading-text">⏳ מרענן פרטי משתמש…</p>;

  /*******************
   * Derived data
   *******************/
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
   * Render
   *******************/
  return (
    <div className="dashboard-container">
      <h2 className="business-dashboard-header">
        📊 דשבורד העסק
        <span className="greeting">
          {user?.businessName ? ` | שלום, ${user.businessName}!` : ""}
        </span>
      </h2>

      {alert && <p className="alert-text">{alert}</p>}

      {/* ───────── AI recommendations banner ───────── */}
      {recommendations.length > 0 && (
        <section className="recommendations-section">
          <h3>המלצות AI חדשות לקבלת אישור</h3>
          <ul>
            {recommendations.map(({ recommendationId, message, recommendation }) => (
              <li key={recommendationId}>
                <p><b>הודעת לקוח:</b> {message}</p>
                <p><b>המלצה AI:</b> {recommendation}</p>
                <button onClick={() => {
                  if (!socketRef.current) return alert("Socket לא מחובר");
                  socketRef.current.emit("approveRecommendation", { recommendationId }, (res) => {
                    if (res?.ok) {
                      setRecommendations((prev) => prev.filter((r) => r.recommendationId !== recommendationId));
                    } else {
                      alert("שגיאה: " + (res?.error || ""));
                    }
                  });
                }}>אשר ושלח</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ───────── Navigation bar ───────── */}
      <Suspense fallback={<div className="loading-spinner">🔄 טוען ניווט…</div>}>
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

      {/* ───────── Cards ───────── */}
      <div ref={cardsRef}>
        <Suspense fallback={<div className="loading-spinner">🔄 טוען כרטיסים…</div>}>
          <DashboardCards stats={syncedStats} unreadCount={syncedStats.messages_count} />
        </Suspense>
      </div>

      {/* ───────── Insights ───────── */}
      <div ref={insightsRef}>
        <Suspense fallback={<div className="loading-spinner">🔄 טוען תובנות…</div>}>
          <Insights
            stats={{
              ...syncedStats,
              upcoming_appointments: getUpcomingAppointmentsCount(enrichedAppointments),
            }}
          />
        </Suspense>
      </div>

      {/* ───────── Bar chart ───────── */}
      <div ref={chartsRef} style={{ marginTop: 20, width: "100%", minWidth: 320 }}>
        <Suspense fallback={<div className="loading-spinner">🔄 טוען גרף…</div>}>
          <BarChartComponent
            appointments={enrichedAppointments}
            title="לקוחות שהזמינו פגישות לפי חודשים 📊"
          />
        </Suspense>
      </div>

      {/* ───────── Next actions ───────── */}
      <div ref={nextActionsRef} className="actions-container full-width">
        <Suspense fallback={<div className="loading-spinner">🔄 טוען פעולות…</div>}>
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

      {/* ───────── Calendar + Daily agenda ───────── */}
      <div ref={appointmentsRef} className="calendar-row">
        <Suspense fallback={<div className="loading-spinner">🔄 טוען יומן…</div>}>
          <div className="day-agenda-box">
            <DailyAgenda
              date={selectedDate}
              appointments={enrichedAppointments}
              businessName={syncedStats.businessName}
              businessId={businessId}
            />
          </div>
          <div className="calendar-container">
            <CalendarView
              appointments={enrichedAppointments}
              onDateClick={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>
        </Suspense>
      </div>

      {/* ───────── Weekly summary ───────── */}
      <div ref={weeklySummaryRef}>
        <Suspense fallback={<div className="loading-spinner">🔄 טוען סיכום שבועי…</div>}>
          <WeeklySummary stats={syncedStats} />
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardPage;

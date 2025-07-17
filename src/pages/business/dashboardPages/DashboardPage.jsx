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

const DashboardCards = lazyWithPreload(() =>
  import("../../../components/DashboardCards")
);
const BarChartComponent = lazyWithPreload(() =>
  import("../../../components/dashboard/BarChart")
);
const RecentActivityTable = lazyWithPreload(() =>
  import("../../../components/dashboard/RecentActivityTable")
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

// debounce helper
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function useOnScreen(ref) {
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return isVisible;
}

function enrichAppointment(appt, business = {}) {
  // קודם כל – אם יש serviceName בפגישה, זה הערך!
  let serviceName = appt.serviceName?.trim();
  if (!serviceName && business.services) {
    // fallback: נסה להשלים מהעסק
    const service = business.services.find(
      (s) => s._id.toString() === appt.serviceId?.toString()
    );
    serviceName = service?.name;
  }

  let clientName = appt.clientName?.trim();
  // תוכל להוסיף פה לוגיקה לשלוף שם מ-business.clients אם צריך

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

const MemoizedDashboardCards = React.memo(DashboardCards);
const MemoizedInsights = React.memo(Insights);
const MemoizedNextActions = React.memo(NextActions);
const MemoizedBarChartComponent = React.memo(BarChartComponent);
const MemoizedRecentActivityTable = React.memo(RecentActivityTable);
const MemoizedWeeklySummary = React.memo(WeeklySummary);
const MemoizedCalendarView = React.memo(CalendarView);
const MemoizedDailyAgenda = React.memo(DailyAgenda);
const MemoizedDashboardNav = React.memo(DashboardNav);

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

const DashboardPage = () => {
  const { user, initialized, logout, refreshAccessToken } = useAuth();
  const businessId = getBusinessId();
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [alert, setAlert] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for lazy loading with intersection observer
  const cardsRef = useRef(null);
  const insightsRef = useRef(null);
  const chartsRef = useRef(null);
  const appointmentsRef = useRef(null);
  const nextActionsRef = useRef(null);
  const weeklySummaryRef = useRef(null);

  // IntersectionObserver states
  const cardsVisible = useOnScreen(cardsRef);
  const insightsVisible = useOnScreen(insightsRef);
  const chartsVisible = useOnScreen(chartsRef);
  const appointmentsVisible = useOnScreen(appointmentsRef);
  const nextActionsVisible = useOnScreen(nextActionsRef);
  const weeklySummaryVisible = useOnScreen(weeklySummaryRef);

  // State to keep track if each section was loaded once (to avoid rerendering/remounting)
  const [cardsLoaded, setCardsLoaded] = useState(false);
  const [insightsLoaded, setInsightsLoaded] = useState(false);
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [appointmentsLoaded, setAppointmentsLoaded] = useState(false);
  const [nextActionsLoaded, setNextActionsLoaded] = useState(false);
  const [weeklySummaryLoaded, setWeeklySummaryLoaded] = useState(false);

  useEffect(() => {
    if (cardsVisible) setCardsLoaded(true);
  }, [cardsVisible]);

  useEffect(() => {
    if (insightsVisible) setInsightsLoaded(true);
  }, [insightsVisible]);

  useEffect(() => {
    if (chartsVisible) setChartsLoaded(true);
  }, [chartsVisible]);

  useEffect(() => {
    if (appointmentsVisible) setAppointmentsLoaded(true);
  }, [appointmentsVisible]);

  useEffect(() => {
    if (nextActionsVisible) setNextActionsLoaded(true);
  }, [nextActionsVisible]);

  useEffect(() => {
    if (weeklySummaryVisible) setWeeklySummaryLoaded(true);
  }, [weeklySummaryVisible]);

  const safeEmit = (socket, event, data, callback) => {
    if (!socket || socket.disconnected) {
      console.warn(`Socket disconnected, cannot emit event ${event}`);
      if (typeof callback === "function") callback({ ok: false, error: "Socket disconnected" });
      return;
    }
    socket.emit(event, data, (...args) => {
      if (typeof callback === "function") callback(...args);
    });
  };

  const handleApproveRecommendation = useCallback((recommendationId) => {
    if (!socketRef.current) {
      alert("Socket לא מחובר, נסה שוב מאוחר יותר");
      return;
    }
    if (socketRef.current.disconnected) {
      alert("Socket מנותק, נסה שוב מאוחר יותר");
      return;
    }
    safeEmit(socketRef.current, "approveRecommendation", { recommendationId }, (res) => {
      if (!res) {
        console.error("No response object received in callback");
        return;
      }
      if (res.ok) {
        alert("ההמלצה אושרה ונשלחה ללקוח");
        setRecommendations((prev) => prev.filter((r) => r.recommendationId !== recommendationId));
      } else {
        alert("שגיאה באישור המלצה: " + (res.error || "שגיאה לא ידועה"));
        console.error("שגיאה באישור המלצה:", res.error);
      }
    });
  }, []);

  // Debounced stats setter to limit rerenders on frequent WebSocket events
  const debouncedSetStats = useRef(
    debounce((newStats) => {
      setStats(newStats);
      localStorage.setItem("dashboardStats", JSON.stringify(newStats));
    }, 300)
  ).current;

  const loadStats = async () => {
    if (!businessId) return;
    setLoading(true);
    setError(null);

    // Try to load cached stats first for instant display (stale-while-revalidate)
    const cached = localStorage.getItem("dashboardStats");
    if (cached) {
      setStats(JSON.parse(cached));
    }

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

  useEffect(() => {
    if (!initialized || !businessId) return;
    loadStats();

    let isMounted = true;

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) {
        logout();
        return;
      }
      const sock = await createSocket(refreshAccessToken, logout, businessId);
      if (!sock || !isMounted) return;
      socketRef.current = sock;

      sock.on("connect", () => {
        console.log("Dashboard socket connected:", sock.id);
        sock.emit("joinBusinessRoom", businessId);
      });

      sock.on("tokenExpired", async () => {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          alert("Session expired. Please log in again.");
          logout();
          return;
        }
        sock.auth.token = newToken;
        sock.emit("authenticate", { token: newToken }, (ack) => {
          if (!ack?.ok) {
            alert("Session expired. Please log in again.");
            logout();
          }
        });
      });

      sock.on("dashboardUpdate", (newStats) => {
        debouncedSetStats(newStats);
      });

      sock.on('profileViewsUpdated', (data) => {
        if (!data || typeof data.views_count !== 'number') return;
        setStats((oldStats) =>
          oldStats
            ? { ...oldStats, views_count: data.views_count }
            : oldStats
        );
      });

      sock.on("appointmentCreated", (newAppointment) => {
        if (!newAppointment.business || newAppointment.business.toString() !== businessId.toString()) return;
        setStats((oldStats) => {
          if (!oldStats) return oldStats;
          const enriched = enrichAppointment(newAppointment, oldStats);
          const updatedAppointments = [...(oldStats.appointments || []), enriched];
          return {
            ...oldStats,
            appointments: updatedAppointments,
            appointments_count: updatedAppointments.length,
          };
        });
        if (newAppointment.date) {
          const apptDate = new Date(newAppointment.date).toISOString().split("T")[0];
          if (apptDate === selectedDate) {
            setSelectedDate(null);
            setTimeout(() => setSelectedDate(apptDate), 10);
          }
        }
      });

      sock.on("disconnect", (reason) => {
        console.log("Dashboard socket disconnected:", reason);
      });

      sock.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });
    }

    setupSocket();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, businessId, logout, refreshAccessToken, debouncedSetStats, selectedDate]);

  useEffect(() => {
    if (!socketRef.current) return;
    if (location.pathname.includes("/messages")) {
      const conversationId = location.state?.conversationId || null;
      if (conversationId) {
        socketRef.current.emit("markMessagesRead", conversationId, (response) => {
          if (!response.ok) {
            console.error("Failed to mark messages as read:", response.error);
          }
        });
      }
    }
  }, [location.pathname, location.state]);

  if (!initialized) return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (user?.role !== "business" || !businessId)
    return <p className="error-text">אין לך הרשאה לצפות בדשבורד העסק.</p>;
  if (loading && !stats) return <DashboardSkeleton />;
  if (error) return <p className="error-text">{alert || error}</p>;

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

  return (
    <div className="dashboard-container">
      <h2 className="business-dashboard-header">
        📊 דשבורד העסק
        <span className="greeting">
          {user?.businessName ? ` | שלום, ${user.businessName}!` : ""}
        </span>
      </h2>

      {alert && <p className="alert-text">{alert}</p>}

      {recommendations.length > 0 && (
        <section
          className="recommendations-section"
          style={{
            marginBottom: 20,
            padding: 15,
            border: "1px solid #ccc",
            borderRadius: 6,
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>המלצות AI חדשות לקבלת אישור</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recommendations.map(({ recommendationId, message, recommendation }) => (
              <li
                key={recommendationId}
                style={{
                  marginBottom: 15,
                  paddingBottom: 10,
                  borderBottom: "1px solid #ddd",
                }}
              >
                <p>
                  <b>הודעת לקוח:</b> {message}
                </p>
                <p>
                  <b>המלצה AI:</b> {recommendation}
                </p>
                <button
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => handleApproveRecommendation(recommendationId)}
                >
                  אשר ושלח
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Suspense fallback={<div className="loading-spinner">🔄 טוען ניווט...</div>}>
        <MemoizedDashboardNav
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

      <div ref={cardsRef}>
        {(cardsLoaded) && (
          <Suspense fallback={<div className="loading-spinner">🔄 טוען כרטיסים...</div>}>
            <MemoizedDashboardCards
              stats={syncedStats}
              unreadCount={syncedStats.messages_count}
            />
          </Suspense>
        )}
      </div>

      <div ref={insightsRef}>
        {(insightsLoaded) && (
          <Suspense fallback={<div className="loading-spinner">🔄 טוען תובנות...</div>}>
            <MemoizedInsights
              stats={{
                ...syncedStats,
                upcoming_appointments: getUpcomingAppointmentsCount(enrichedAppointments),
              }}
            />
          </Suspense>
        )}
      </div>

      <div ref={chartsRef} style={{ marginTop: 20, width: "100%", minWidth: 320 }}>
        {(chartsLoaded) && (
          <Suspense fallback={<div className="loading-spinner">🔄 טוען גרף...</div>}>
            <MemoizedBarChartComponent
              appointments={enrichedAppointments}
              title="לקוחות שהזמינו פגישות לפי חודשים 📊"
            />
          </Suspense>
        )}
      </div>

      <div ref={nextActionsRef} className="actions-container full-width">
        {(nextActionsLoaded) && (
          <Suspense fallback={<div className="loading-spinner">🔄 טוען פעולות...</div>}>
            <MemoizedNextActions
              stats={{
                weekly_views_count: countItemsInLastWeek(syncedStats.views, "date"),
                weekly_appointments_count: countItemsInLastWeek(enrichedAppointments),
                weekly_reviews_count: countItemsInLastWeek(syncedStats.reviews, "date"),
                weekly_messages_count: countItemsInLastWeek(syncedStats.messages, "date"),
              }}
            />
          </Suspense>
        )}
      </div>

      <div ref={appointmentsRef} className="calendar-row">
        {(appointmentsLoaded) && (
          <Suspense fallback={<div className="loading-spinner">🔄 טוען יומן...</div>}>
            <div className="day-agenda-box">
              <MemoizedDailyAgenda
                date={selectedDate}
                appointments={enrichedAppointments}
                businessName={syncedStats.businessName}
                businessId={businessId}
              />
            </div>
            <div className="calendar-container">
              <MemoizedCalendarView
                appointments={enrichedAppointments}
                onDateClick={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>
          </Suspense>
        )}
      </div>

      <div ref={weeklySummaryRef}>
        {(weeklySummaryLoaded) && (
          <Suspense fallback={<div className="loading-spinner">🔄 טוען סיכום שבועי...</div>}>
            <MemoizedWeeklySummary stats={syncedStats} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  Suspense,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import { createSocket } from "../../../socket";
import { getBusinessId } from "../../../utils/authHelpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUnreadMessages } from "../../../context/UnreadMessagesContext";
import "../../../styles/dashboard.css";

import { lazyWithPreload } from "../../../utils/lazyWithPreload";
import DashboardSkeleton from "../../../components/DashboardSkeleton";


// טעינת רכיבים עם אפשרות preload
const DashboardCards = lazyWithPreload(() => import("../../../components/DashboardCards"));
const BarChartComponent = lazyWithPreload(() => import("../../../components/dashboard/BarChart"));
const RecentActivityTable = lazyWithPreload(() => import("../../../components/dashboard/RecentActivityTable"));
const Insights = lazyWithPreload(() => import("../../../components/dashboard/Insights"));
const NextActions = lazyWithPreload(() => import("../../../components/dashboard/NextActions"));
const WeeklySummary = lazyWithPreload(() => import("../../../components/dashboard/WeeklySummary"));
const CalendarView = lazyWithPreload(() => import("../../../components/dashboard/CalendarView"));
const DailyAgenda = lazyWithPreload(() => import("../../../components/dashboard/DailyAgenda"));
const DashboardNav = lazyWithPreload(() => import("../../../components/dashboard/DashboardNav"));

// פונקציה לטעינת כל הרכיבים מראש (לקרוא אחרי לוגין)
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

// -- פונקציות עזר --

function enrichAppointment(appt, business) {
  const service = business.services?.find(
    (s) => s._id.toString() === appt.serviceId.toString()
  );
  return {
    ...appt,
    clientName: appt.client?.name || "לא ידוע",
    serviceName: service ? service.name : "לא ידוע",
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

// להוסיף React.memo לרכיבים שקיבלו stats - לשם הדוגמה כאן
const MemoizedDashboardCards = React.memo(DashboardCards);
const MemoizedInsights = React.memo(Insights);
const MemoizedNextActions = React.memo(NextActions);
const MemoizedBarChartComponent = React.memo(BarChartComponent);
const MemoizedRecentActivityTable = React.memo(RecentActivityTable);
const MemoizedWeeklySummary = React.memo(WeeklySummary);
const MemoizedCalendarView = React.memo(CalendarView);
const MemoizedDailyAgenda = React.memo(DailyAgenda);
const MemoizedDashboardNav = React.memo(DashboardNav);

const DashboardPage = () => {
  const { user, initialized, logout, refreshAccessToken } = useAuth();
  const businessId = getBusinessId();
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { updateMessagesCount, unreadCount } = useUnreadMessages();
  const unreadCountRef = useRef(unreadCount);
  useEffect(() => {
    unreadCountRef.current = unreadCount;
  }, [unreadCount]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [alert, setAlert] = useState(null);

  const [localData, setLocalData] = useState(() => {
    try {
      const lsData = localStorage.getItem("dashboardStats");
      return lsData ? JSON.parse(lsData) : null;
    } catch {
      return null;
    }
  });

  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboardStats", businessId],
    queryFn: () => fetchDashboardStats(businessId, refreshAccessToken),
    enabled: !!businessId && initialized,
    onSuccess: (data) => {
      if (updateMessagesCount && data.messages_count !== undefined) {
        updateMessagesCount(data.messages_count);
      }
      try {
        localStorage.setItem("dashboardStats", JSON.stringify(data));
        setLocalData(data);
      } catch {}
    },
    onError: (error) => {
      setAlert("❌ שגיאה בטעינת נתונים מהשרת");
      if (error.message === "No token") logout();
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!businessId) return;
    queryClient.prefetchQuery(
      ["dashboardStats", businessId],
      () => fetchDashboardStats(businessId, refreshAccessToken),
      { staleTime: 5 * 60 * 1000 }
    );
  }, [businessId, queryClient, refreshAccessToken]);

  // Socket.IO
  useEffect(() => {
    if (!initialized || !businessId) return;
    if (socketRef.current) return;

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) {
        logout();
        return;
      }
      const sock = await createSocket(refreshAccessToken, logout, businessId);
      if (!sock) return;
      socketRef.current = sock;

      sock.on("connect", () => {
        console.log("Dashboard socket connected:", sock.id);
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

      sock.on("dashboardUpdate", () => refetch());

      sock.on("appointmentCreated", (newAppointment) => {
        if (newAppointment.business?.toString() !== businessId.toString()) return;
        queryClient.setQueryData(["dashboardStats", businessId], (old) => {
          if (!old) return old;
          const enriched = enrichAppointment(newAppointment, old);
          const newAppointments = [...(old.appointments || []), enriched];
          return { ...old, appointments: newAppointments, appointments_count: newAppointments.length };
        });
        if (newAppointment.date) {
          const apptDate = new Date(newAppointment.date).toISOString().split("T")[0];
          if (apptDate === selectedDate) {
            setSelectedDate(null);
            setTimeout(() => setSelectedDate(apptDate), 10);
          }
        }
      });

      sock.on("appointmentUpdated", (updatedAppointment) => {
        if (updatedAppointment.business?.toString() !== businessId.toString()) return;
        queryClient.setQueryData(["dashboardStats", businessId], (old) => {
          if (!old) return old;
          const enriched = enrichAppointment(updatedAppointment, old);
          const updatedAppointments = (old.appointments || []).map((appt) =>
            appt._id === updatedAppointment._id ? enriched : appt
          );
          if (!updatedAppointments.find(a => a._id === updatedAppointment._id)) {
            updatedAppointments.push(enriched);
          }
          return { ...old, appointments: updatedAppointments, appointments_count: updatedAppointments.length };
        });
        if (updatedAppointment.date) {
          const apptDate = new Date(updatedAppointment.date).toISOString().split("T")[0];
          if (apptDate === selectedDate) {
            setSelectedDate(null);
            setTimeout(() => setSelectedDate(apptDate), 10);
          }
        }
      });

      sock.on("allAppointmentsUpdated", (allAppointments) => {
        queryClient.setQueryData(["dashboardStats", businessId], (old) => {
          if (!old) return old;
          const enriched = Array.isArray(allAppointments)
            ? allAppointments.map((appt) => enrichAppointment(appt, old))
            : [];
          return { ...old, appointments: enriched, appointments_count: enriched.length };
        });
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
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initialized, businessId, logout, refreshAccessToken, refetch, selectedDate, queryClient]);

  useEffect(() => {
    if (!socketRef.current) return;
    if (location.pathname.includes("/messages")) {
      const conversationId = location.state?.conversationId || null;
      if (conversationId) {
        socketRef.current.emit("markMessagesRead", conversationId, (response) => {
          if (response.ok) {
            updateMessagesCount(response.unreadCount);
          } else {
            console.error("Failed to mark messages as read:", response.error);
          }
        });
      }
    } else {
      setTimeout(() => {
        updateMessagesCount(0);
      }, 200);
    }
  }, [location.pathname, updateMessagesCount]);

  if (!initialized) return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (user?.role !== "business" || !businessId)
    return <p className="error-text">אין לך הרשאה לצפות בדשבורד העסק.</p>;
if (isLoading && !localData) return <DashboardSkeleton />;
  if (isError) return <p className="error-text">{alert || "שגיאה בטעינת הנתונים"}</p>;

  const effectiveStats = stats || localData || {};
  const todaysAppointments = Array.isArray(effectiveStats?.todaysAppointments) ? effectiveStats.todaysAppointments : [];
  const appointments = Array.isArray(effectiveStats?.appointments) ? effectiveStats.appointments : [];

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
    messages_count: unreadCount,
  };

  const cardsRef = createRef();
  const insightsRef = createRef();
  const chartsRef = createRef();
  const appointmentsRef = createRef();
  const nextActionsRef = createRef();
  const weeklySummaryRef = createRef();

  return (
    <div className="dashboard-container">
      <h2 className="business-dashboard-header">
        📊 דשבורד העסק
        <span className="greeting">
          {user?.businessName ? ` | שלום, ${user.businessName}!` : ""}
        </span>
      </h2>

      {alert && <p className="alert-text">{alert}</p>}

      <Suspense fallback={<div className="loading-spinner">🔄 טוען ניווט...</div>}>
        <MemoizedDashboardNav refs={{ cardsRef, insightsRef, chartsRef, appointmentsRef, nextActionsRef, weeklySummaryRef }} />
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען כרטיסים...</div>}>
        <div ref={cardsRef}>
          <MemoizedDashboardCards stats={syncedStats} unreadCount={unreadCount} />
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען תובנות...</div>}>
        <div ref={insightsRef}>
          <MemoizedInsights
            stats={{ ...syncedStats, upcoming_appointments: getUpcomingAppointmentsCount(appointments) }}
          />
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען פעולות...</div>}>
        <div ref={nextActionsRef} className="actions-container full-width">
          <MemoizedNextActions
            stats={{
              weekly_views_count: countItemsInLastWeek(syncedStats.views, "date"),
              weekly_appointments_count: countItemsInLastWeek(appointments),
              weekly_reviews_count: countItemsInLastWeek(syncedStats.reviews, "date"),
              weekly_messages_count: countItemsInLastWeek(syncedStats.messages, "date"),
            }}
          />
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען גרפים...</div>}>
        <div ref={chartsRef} className="graph-box full-width">
  <MemoizedBarChartComponent appointments={syncedStats.appointments} title="לקוחות שהזמינו פגישות לפי חודשים 📊" />
</div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען פעילות...</div>}>
        <div>
          {syncedStats.recent_activity && <MemoizedRecentActivityTable activities={syncedStats.recent_activity} />}
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען יומן...</div>}>
        <div ref={appointmentsRef} className="calendar-row">
          <div className="day-agenda-box">
            <MemoizedDailyAgenda
              date={selectedDate}
              appointments={appointments}
              businessName={syncedStats.businessName}
            />
          </div>
          <div className="calendar-container">
            <MemoizedCalendarView
              appointments={appointments}
              onDateClick={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען סיכום שבועי...</div>}>
        <div ref={weeklySummaryRef}>
          <MemoizedWeeklySummary stats={syncedStats} />
        </div>
      </Suspense>
    </div>
  );
};

export default DashboardPage;

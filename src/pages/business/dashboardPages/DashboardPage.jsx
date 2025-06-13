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
import debounce from "lodash.debounce";
import "../../../styles/dashboard.css";

import { lazyWithPreload } from "../../../utils/lazyWithPreload";

// רכיבים בדומה לקוד הקודם
const DashboardCards = lazyWithPreload(() => import("../../../components/DashboardCards"));
const BarChartComponent = lazyWithPreload(() => import("../../../components/dashboard/BarChart"));
const RecentActivityTable = lazyWithPreload(() => import("../../../components/dashboard/RecentActivityTable"));
const Insights = lazyWithPreload(() => import("../../../components/dashboard/Insights"));
const NextActions = lazyWithPreload(() => import("../../../components/dashboard/NextActions"));
const WeeklySummary = lazyWithPreload(() => import("../../../components/dashboard/WeeklySummary"));
const CalendarView = lazyWithPreload(() => import("../../../components/dashboard/CalendarView"));
const DailyAgenda = lazyWithPreload(() => import("../../../components/dashboard/DailyAgenda"));
const DashboardNav = lazyWithPreload(() => import("../../../components/dashboard/DashboardNav"));

const MemoizedDashboardCards = React.memo(DashboardCards);
const MemoizedInsights = React.memo(Insights);
const MemoizedNextActions = React.memo(NextActions);
const MemoizedBarChartComponent = React.memo(BarChartComponent);
const MemoizedRecentActivityTable = React.memo(RecentActivityTable);
const MemoizedWeeklySummary = React.memo(WeeklySummary);
const MemoizedCalendarView = React.memo(CalendarView);
const MemoizedDailyAgenda = React.memo(DailyAgenda);
const MemoizedDashboardNav = React.memo(DashboardNav);

// פונקציות עזר כמו enrichAppointment וכו'
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

// קריאת API לפגישות
async function fetchAppointments(businessId, refreshAccessToken) {
  const token = await refreshAccessToken();
  if (!token) throw new Error("No token");
  const res = await API.get(`/business/${businessId}/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// קריאת API למספר הודעות לא נקראות
async function fetchMessagesCount(businessId, refreshAccessToken) {
  const token = await refreshAccessToken();
  if (!token) throw new Error("No token");
  const res = await API.get(`/business/${businessId}/messages/count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.count;
}

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

  // Query לפגישות
  const {
    data: appointments,
    isLoading: loadingAppointments,
    isError: errorAppointments,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: ["appointments", businessId],
    queryFn: () => fetchAppointments(businessId, refreshAccessToken),
    enabled: !!businessId && initialized,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
    onError: (error) => {
      setAlert("❌ שגיאה בטעינת פגישות");
      if (error.message === "No token") logout();
    },
  });

  // Query למספר הודעות לא נקראות
  const {
    data: messagesCount,
    isLoading: loadingMessages,
    isError: errorMessages,
    refetch: refetchMessagesCount,
  } = useQuery({
    queryKey: ["messagesCount", businessId],
    queryFn: () => fetchMessagesCount(businessId, refreshAccessToken),
    enabled: !!businessId && initialized,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
    onSuccess: (count) => {
      updateMessagesCount(count);
    },
    onError: (error) => {
      setAlert("❌ שגיאה בטעינת הודעות");
      if (error.message === "No token") logout();
    },
  });

  // debounce לקריאות refetch מה-socket
  const debouncedRefetchAppointments = useRef(
    debounce(() => {
      refetchAppointments();
    }, 2000)
  ).current;

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

      sock.on("dashboardUpdate", () => {
        debouncedRefetchAppointments();
        refetchMessagesCount();
      });

      sock.on("appointmentCreated", (newAppointment) => {
        if (newAppointment.business?.toString() !== businessId.toString()) return;
        queryClient.setQueryData(["appointments", businessId], (old) => {
          if (!old) return old;
          const enriched = enrichAppointment(newAppointment, old);
          return [...old, enriched];
        });
      });

      sock.on("appointmentUpdated", (updatedAppointment) => {
        if (updatedAppointment.business?.toString() !== businessId.toString()) return;
        queryClient.setQueryData(["appointments", businessId], (old) => {
          if (!old) return old;
          const enriched = enrichAppointment(updatedAppointment, old);
          const updatedAppointments = old.map((appt) =>
            appt._id === updatedAppointment._id ? enriched : appt
          );
          if (!updatedAppointments.find((a) => a._id === updatedAppointment._id)) {
            updatedAppointments.push(enriched);
          }
          return updatedAppointments;
        });
      });

      sock.on("allAppointmentsUpdated", (allAppointments) => {
        queryClient.setQueryData(["appointments", businessId], () => {
          if (!Array.isArray(allAppointments)) return [];
          return allAppointments.map((appt) => enrichAppointment(appt, []));
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
  }, [
    initialized,
    businessId,
    logout,
    refreshAccessToken,
    queryClient,
    refetchAppointments,
    refetchMessagesCount,
  ]);

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

  if (loadingAppointments || loadingMessages)
    return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (errorAppointments || errorMessages)
    return <p className="error-text">{alert || "שגיאה בטעינת הנתונים"}</p>;

  const syncedStats = {
    appointments_count: appointments?.length ?? 0,
    messages_count: messagesCount ?? 0,
    // כאן אפשר להוסיף שדות נוספים שניתן לחשב או לקבל מ-API נוסף
  };

  const cardsRef = createRef();
  const insightsRef = createRef();
  const chartsRef = createRef();
  const appointmentsRef = createRef();
  const nextActionsRef = createRef();
  const weeklySummaryRef = createRef();

  const getUpcomingAppointmentsCount = (appointmentsList) => {
    const now = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(now.getDate() + 7);
    return (appointmentsList || []).filter((appt) => {
      const apptDate = new Date(appt.date);
      return apptDate >= now && apptDate <= endOfWeek;
    }).length;
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

      <Suspense fallback={<div className="loading-spinner">🔄 טוען כרטיסים...</div>}>
        <div ref={cardsRef}>
          <MemoizedDashboardCards stats={syncedStats} unreadCount={unreadCount} />
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען תובנות...</div>}>
        <div ref={insightsRef}>
          <MemoizedInsights
            stats={{
              ...syncedStats,
              upcoming_appointments: getUpcomingAppointmentsCount(appointments),
            }}
          />
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען פעולות...</div>}>
        <div ref={nextActionsRef}>
          <MemoizedNextActions
            stats={{
              weekly_views_count: countItemsInLastWeek(appointments, "date"),
              weekly_appointments_count: countItemsInLastWeek(appointments),
              weekly_reviews_count: 0, // אפשר להוסיף אם יש
              weekly_messages_count: 0, // אפשר להוסיף אם יש
            }}
          />
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען גרפים...</div>}>
        <div ref={chartsRef}>
          <MemoizedBarChartComponent
            appointments={appointments}
            title="לקוחות שהזמינו פגישות לפי חודשים 📊"
          />
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען פעילות...</div>}>
        <div>
          {appointments && (
            <MemoizedRecentActivityTable activities={appointments} />
          )}
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען יומן...</div>}>
        <div ref={appointmentsRef} className="calendar-row">
          <div className="day-agenda-box">
            <MemoizedDailyAgenda
              date={selectedDate}
              appointments={appointments}
              businessName={user.businessName}
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

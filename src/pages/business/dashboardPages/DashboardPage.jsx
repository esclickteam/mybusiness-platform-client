import React, {
  useEffect,
  useState,
  useRef,
  createRef,
  Suspense,
  useCallback,
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

function enrichAppointment(appt, business) {
  const service = business.services?.find(
    (s) => s._id.toString() === appt.serviceId.toString()
  );
  return {
    ...appt,
    clientName: appt.clientName?.trim() || "לא ידוע",
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

  const today = new Date().toISOString().split("T")[0];
const [selectedDate, setSelectedDate] = useState(today);
const [alert, setAlert] = useState(null);
const [recommendations, setRecommendations] = useState([]);

  const safeEmit = (socket, event, data, callback) => {
    if (!socket || socket.disconnected) {
      console.warn(`Socket disconnected, cannot emit event ${event}`);
      if (typeof callback === "function") callback({ ok: false, error: "Socket disconnected" });
      return;
    }
    socket.emit(event, data, (...args) => {
      try {
        if (typeof callback === "function") {
          callback(...args);
        } else {
          console.warn(`Callback for event ${event} is not a function.`);
        }
      } catch (err) {
        console.error(`Error in callback for event ${event}:`, err);
      }
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

  const [localData, setLocalData] = useState(() => {
    try {
      const lsData = localStorage.getItem("dashboardStats");
      return lsData ? JSON.parse(lsData) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!stats && !localData) return;
    const appointmentsToLog = (stats || localData)?.appointments || [];
    console.group("Appointments received from API:");
    appointmentsToLog.forEach((appt, idx) => {
      console.log(
        `Appointment #${idx + 1}: clientName="${appt.clientName}", serviceName="${appt.serviceName}", date="${appt.date}", time="${appt.time}"`
      );
    });
    console.groupEnd();
  }, [stats, localData]);

  useEffect(() => {
    if (!businessId) return;
    queryClient.prefetchQuery(
      ["dashboardStats", businessId],
      () => fetchDashboardStats(businessId, refreshAccessToken),
      { staleTime: 5 * 60 * 1000 }
    );
  }, [businessId, queryClient, refreshAccessToken]);

  // Socket.IO setup
  useEffect(() => {
    if (!initialized || !businessId) return;
    if (socketRef.current) return;

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
    // הצטרפות לחדר העסק והדשבורד לקבלת עדכונים בזמן אמת
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

      sock.on("dashboardUpdate", () => refetch());

      sock.on('profileViewsUpdated', (data) => {
  if (data && data.views_count !== undefined) {
    queryClient.setQueryData(['dashboardStats', businessId], (old) => {
      if (!old) return old;
      return {
        ...old,
        views_count: data.views_count,
      };
    });
  }
});

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

  sock.on('allReviewsUpdated', (allReviews) => {
      if (!businessId) return;
      queryClient.setQueryData(['dashboardStats', businessId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          reviews: allReviews,
          reviews_count: allReviews.length,
        };
      });
    });

    sock.on('reviewCreated', (reviewNotification) => {
      console.log('ביקורת חדשה התקבלה:', reviewNotification);
      queryClient.setQueryData(['dashboardStats', businessId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          reviews_count: (oldData.reviews_count || 0) + 1,
        };
      });
    });


      sock.on("disconnect", (reason) => console.log("Dashboard socket disconnected:", reason));
      sock.on("connect_error", (err) => console.error("Socket connection error:", err));
    }

    setupSocket();

    return () => {
      isMounted = false;
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

  // כאן מבצעים העשרה של הפגישות
  const enrichedAppointments = (effectiveStats.appointments || []).map(appt =>
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

      {/* המלצות AI אם יש */}
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
              upcoming_appointments: getUpcomingAppointmentsCount(enrichedAppointments),
            }}
          />
        </div>
      </Suspense>

      {/* כאן הוספתי את רכיב הגרף */}
      <Suspense fallback={<div className="loading-spinner">🔄 טוען גרף...</div>}>
        <div ref={chartsRef} style={{ marginTop: 20, width: "100%", minWidth: 320 }}>
          <MemoizedBarChartComponent
            appointments={enrichedAppointments}
            title="לקוחות שהזמינו פגישות לפי חודשים 📊"
          />
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען פעולות...</div>}>
        <div ref={nextActionsRef} className="actions-container full-width">
          <MemoizedNextActions
            stats={{
              weekly_views_count: countItemsInLastWeek(syncedStats.views, "date"),
              weekly_appointments_count: countItemsInLastWeek(enrichedAppointments),
              weekly_reviews_count: countItemsInLastWeek(syncedStats.reviews, "date"),
              weekly_messages_count: countItemsInLastWeek(syncedStats.messages, "date"),
            }}
          />
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄 טוען יומן...</div>}>
        <div ref={appointmentsRef} className="calendar-row">
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
        </div>
      </Suspense>

      <Suspense fallback={<div className="loading-spinner">🔄  טוען סיכום שבועי...</div>}>
        <div ref={weeklySummaryRef}>
          <MemoizedWeeklySummary stats={syncedStats} />
        </div>
      </Suspense>
    </div>
  );
};

export default DashboardPage;

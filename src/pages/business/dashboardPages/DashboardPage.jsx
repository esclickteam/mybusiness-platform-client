import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import { createSocket } from "../../../socket";
import { getBusinessId } from "../../../utils/authHelpers";

import DashboardCards from "../../../components/DashboardCards";
import BarChartComponent from "../../../components/dashboard/BarChart";
import RecentActivityTable from "../../../components/dashboard/RecentActivityTable";
import Insights from "../../../components/dashboard/Insights";
import NextActions from "../../../components/dashboard/NextActions";
import WeeklySummary from "../../../components/dashboard/WeeklySummary";
import CalendarView from "../../../components/dashboard/CalendarView";
import DailyAgenda from "../../../components/dashboard/DailyAgenda";
import DashboardNav from "../../../components/dashboard/DashboardNav";

import { useUnreadMessages } from "../../../context/UnreadMessagesContext";

import "../../../styles/dashboard.css";

const LOCAL_STORAGE_KEY = "dashboardStats";

function mergeStats(oldStats, newStats) {
  const isEmpty = Object.values(newStats).every(
    (val) => val === 0 || val === null || val === undefined
  );
  if (isEmpty) {
    return oldStats;
  }
  return { ...oldStats, ...newStats };
}

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

const DashboardPage = () => {
  const { user, initialized, logout, refreshAccessToken } = useAuth();

  const businessId = getBusinessId();
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { resetMessagesCount, updateMessagesCount, unreadCount } = useUnreadMessages();

  const unreadCountRef = useRef(unreadCount);
  useEffect(() => {
    unreadCountRef.current = unreadCount;
  }, [unreadCount]);

  // refs לכל קטע תוכן
  const cardsRef = useRef(null);
  const insightsRef = useRef(null);
  const chartsRef = useRef(null);
  const appointmentsRef = useRef(null);
  const nextActionsRef = useRef(null);
  const weeklySummaryRef = useRef(null);  // רפרנס לסיכום השבועי

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            views_count: 0,
            requests_count: 0,
            orders_count: 0,
            reviews_count: 0,
            messages_count: 0,
            appointments_count: 0,
            todaysAppointments: [],
            income_distribution: null,
            monthly_comparison: null,
            recent_activity: null,
            appointments: [],
            leads: [],
            businessName: "",
            services: [],
            views: [],
            reviews: [],
            messages: [],
          };
    } catch {
      return {
        views_count: 0,
        requests_count: 0,
        orders_count: 0,
        reviews_count: 0,
        messages_count: 0,
        appointments_count: 0,
        todaysAppointments: [],
        income_distribution: null,
        monthly_comparison: null,
        recent_activity: null,
        appointments: [],
        leads: [],
        businessName: "",
        services: [],
        views: [],
        reviews: [],
        messages: [],
      };
    }
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(!stats || Object.keys(stats).length === 0);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  // Ref to avoid multiple resets on unread count
  const hasResetUnreadCount = useRef(false);

  useEffect(() => {
    if (!socketRef.current) return;

    if (location.pathname.includes("/messages")) {
      // Entered messages page — reset flag to allow counting
      hasResetUnreadCount.current = false;
      const conversationId = location.state?.conversationId || null;

      if (conversationId) {
        socketRef.current.emit("markMessagesRead", conversationId, (response) => {
          if (response.ok) {
            updateMessagesCount(response.unreadCount);
            console.log("Messages marked as read, unreadCount updated:", response.unreadCount);
          } else {
            console.error("Failed to mark messages as read:", response.error);
          }
        });
      }
    } else {
      // Leaving messages page — reset unreadCount once with a slight delay
      if (!hasResetUnreadCount.current) {
        setTimeout(() => {
          if (!hasResetUnreadCount.current) {
            updateMessagesCount(0);
            hasResetUnreadCount.current = true;
            console.log("Leaving /messages tab, unreadCount reset");
          }
        }, 200);
      }
    }
  }, [location.pathname, resetMessagesCount, updateMessagesCount]);

  if (!initialized) {
    return <p className="loading-text">⏳ טוען נתונים…</p>;
  }
  if (user?.role !== "business" || !businessId) {
    return <p className="error-text">אין לך הרשאה לצפות בדשבורד העסק.</p>;
  }

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn("Failed to save dashboard stats to localStorage", e);
    }
  }, [stats]);

  useEffect(() => {
    if (!businessId) return;
    setLoading(true);

    async function fetchStats() {
      try {
        const token = await refreshAccessToken();
        if (!token) {
          logout();
          return;
        }
        const res = await API.get(`/business/${businessId}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || {};

        const enrichedAppointments = Array.isArray(data.appointments)
          ? data.appointments.map((appt) => enrichAppointment(appt, data))
          : [];

        const safeData = {
          views_count: data.views_count ?? 0,
          requests_count: data.requests_count ?? 0,
          orders_count: data.orders_count ?? 0,
          reviews_count: data.reviews_count ?? 0,
          messages_count: data.messages_count ?? 0,
          appointments_count: Array.isArray(data.appointments)
            ? data.appointments.length
            : 0,
          todaysAppointments: Array.isArray(data.todaysAppointments)
            ? data.todaysAppointments
            : [],
          monthly_comparison: data.monthly_comparison ?? null,
          recent_activity: data.recent_activity ?? null,
          appointments: enrichedAppointments,
          leads: Array.isArray(data.leads) ? data.leads : [],
          businessName: data.businessName ?? "",
          income_distribution: data.income_distribution ?? null,
          services: data.services ?? [],
          views: Array.isArray(data.views) ? data.views : [],
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
          messages: Array.isArray(data.messages) ? data.messages : [],
        };
        setStats(safeData);

        if (updateMessagesCount && safeData.messages_count !== undefined) {
          updateMessagesCount(safeData.messages_count);
        }
      } catch (err) {
        setError("❌ שגיאה בטעינת נתונים מהשרת");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [businessId, refreshAccessToken, logout, updateMessagesCount]);

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

      if (!sock) {
        return;
      }

      socketRef.current = sock;

      sock.on("connect", () => {
        console.log("Dashboard socket connected with ID:", sock.id);
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
          if (ack && ack.ok) {
            console.log("✅ Socket re-authenticated successfully");
          } else {
            alert("Session expired. Please log in again.");
            logout();
          }
        });
      });

      sock.on("dashboardUpdate", (newStats) => {
        if (newStats && typeof newStats === "object") {
          const cleanedStats = {};
          for (const key in newStats) {
            if (newStats[key] !== undefined) {
              cleanedStats[key] = newStats[key];
            }
          }

          setStats((prevStats) => {
            if (
              unreadCountRef.current === 0 &&
              cleanedStats.messages_count > 0
            ) {
              delete cleanedStats.messages_count;
            }

            const merged = mergeStats(prevStats, cleanedStats);

            if (
              updateMessagesCount &&
              cleanedStats.messages_count !== undefined &&
              cleanedStats.messages_count !== unreadCountRef.current
            ) {
              updateMessagesCount(cleanedStats.messages_count);
            }

            const isEqual = Object.keys(merged).every(
              (key) => merged[key] === prevStats[key]
            );
            if (isEqual) return prevStats;
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      });

      sock.on("appointmentUpdated", (newAppointment) => {
        const newBizId = newAppointment.business?.toString();
        const currentBizId = businessId.toString();

        if (newBizId === currentBizId) {
          setStats((prevStats) => {
            const appointments = Array.isArray(prevStats.appointments)
              ? [...prevStats.appointments]
              : [];

            const enrichedNewAppointment = enrichAppointment(newAppointment, prevStats);

            const index = appointments.findIndex(
              (a) => a._id === newAppointment._id
            );

            if (index !== -1) {
              appointments[index] = enrichedNewAppointment;
            } else {
              appointments.push(enrichedNewAppointment);
            }

            return {
              ...prevStats,
              appointments,
              appointments_count: appointments.length,
            };
          });

          if (newAppointment.date) {
            const apptDate = new Date(newAppointment.date)
              .toISOString()
              .split("T")[0];
            if (apptDate === selectedDate) {
              setSelectedDate(null);
              setTimeout(() => setSelectedDate(apptDate), 10);
            }
          }
        }
      });

      sock.on("allAppointmentsUpdated", (allAppointments) => {
        setStats((prevStats) => {
          const enrichedAppointments = Array.isArray(allAppointments)
            ? allAppointments.map((appt) => enrichAppointment(appt, prevStats))
            : [];

          return {
            ...prevStats,
            appointments: enrichedAppointments,
            appointments_count: enrichedAppointments.length,
          };
        });
      });

      sock.on("disconnect", (reason) => {
        console.log("Dashboard socket disconnected, reason:", reason);
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
    selectedDate,
    updateMessagesCount,
  ]);

  if (loading) return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (error) return <p className="error-text">{error}</p>;

  const todaysAppointments = Array.isArray(stats.todaysAppointments)
    ? stats.todaysAppointments
    : [];
  const appointments = Array.isArray(stats.appointments) ? stats.appointments : [];

  const getUpcomingAppointmentsCount = (appointments) => {
    const now = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(now.getDate() + 7);
    return appointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      return apptDate >= now && apptDate <= endOfWeek;
    }).length;
  };

  // סנכרון סטטיסטיקות להצגה: משתמשים ב-unreadCount מהקונטקסט במקום stats.messages_count
  const syncedStats = {
    ...stats,
    messages_count: unreadCount,
  };

  return (
    <div className="dashboard-container">
      <h2 className="business-dashboard-header">
        📊 דשבורד העסק
        <span className="greeting">
          {user?.businessName ? ` | שלום, ${user.businessName}!` : ""}
        </span>
      </h2>

      {alert && <DashboardAlert text={alert} type="info" />}

      <DashboardNav
        refs={{
          cardsRef,
          insightsRef,
          chartsRef,
          appointmentsRef,
          nextActionsRef,
          weeklySummaryRef, // Added ref here
        }}
      />

      {/* העברת unreadCount כ-prop ל-DashboardCards */}
      <div ref={cardsRef}>
        <DashboardCards stats={syncedStats} unreadCount={unreadCount} />
      </div>

      <div ref={insightsRef}>
        <Insights
          stats={{ ...syncedStats, upcoming_appointments: getUpcomingAppointmentsCount(appointments) }}
        />
      </div>

      <div ref={nextActionsRef}>
        <NextActions
          stats={{
            weekly_views_count: countItemsInLastWeek(syncedStats.views, "date"),
            weekly_appointments_count: countItemsInLastWeek(appointments),
            weekly_reviews_count: countItemsInLastWeek(syncedStats.reviews, "date"),
            weekly_messages_count: countItemsInLastWeek(syncedStats.messages, "date"),
          }}
        />
      </div>

      <div ref={chartsRef}>
        <BarChartComponent appointments={syncedStats.appointments} title="לקוחות שהזמינו פגישות לפי חודשים 📊" />
      </div>

      <div>
        {syncedStats.recent_activity && <RecentActivityTable activities={syncedStats.recent_activity} />}
      </div>

      <div ref={weeklySummaryRef}>
        <WeeklySummary stats={syncedStats} />
      </div>

      <div className="calendar-row">
        <div className="day-agenda-box">
          <DailyAgenda
            date={selectedDate}
            appointments={appointments}
            businessName={syncedStats.businessName}
          />
        </div>
        <div className="calendar-container">
          <CalendarView
            appointments={appointments}
            onDateClick={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

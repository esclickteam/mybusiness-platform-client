import React, { useEffect, useState, useRef, createRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import { createSocket } from "../../../socket";
import { getBusinessId } from "../../../utils/authHelpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import DashboardCards from "../../../components/DashboardCards";
import BarChartComponent from "../../../components/dashboard/BarChart";
import RecentActivityTable from "../../../components/dashboard/RecentActivityTable";
import Insights from "../../../components/dashboard/Insights";
import NextActions from "../../../components/dashboard/NextActions";
import WeeklySummary from "../../../components/dashboard/WeeklySummary";
import CalendarView from "../../../components/dashboard/CalendarView";
import DailyAgenda from "../../../components/dashboard/DailyAgenda";
import DashboardNav from "../../../components/dashboard/DashboardNav";
import DashboardAlert from "../../../components/DashboardAlert";

import { useUnreadMessages } from "../../../context/UnreadMessagesContext";

import "../../../styles/dashboard.css";

const LOCAL_STORAGE_KEY = "dashboardStats";

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

  // React Query - fetch dashboard stats
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["dashboardStats", businessId],
    () => fetchDashboardStats(businessId, refreshAccessToken),
    {
      enabled: !!businessId && initialized,
      onSuccess: (data) => {
        if (updateMessagesCount && data.messages_count !== undefined) {
          updateMessagesCount(data.messages_count);
        }
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        } catch {}
      },
      onError: (error) => {
        setAlert("❌ שגיאה בטעינת נתונים מהשרת");
        if (error.message === "No token") logout();
      },
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  );

  // Unread messages reset on messages tab change
  const hasResetUnreadCount = useRef(false);
  useEffect(() => {
    if (!socketRef.current) return;

    if (location.pathname.includes("/messages")) {
      hasResetUnreadCount.current = false;
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
      if (!hasResetUnreadCount.current) {
        setTimeout(() => {
          if (!hasResetUnreadCount.current) {
            updateMessagesCount(0);
            hasResetUnreadCount.current = true;
          }
        }, 200);
      }
    }
  }, [location.pathname, updateMessagesCount]);

  if (!initialized) {
    return <p className="loading-text">⏳ טוען נתונים…</p>;
  }
  if (user?.role !== "business" || !businessId) {
    return <p className="error-text">אין לך הרשאה לצפות בדשבורד העסק.</p>;
  }

  // Setup socket with real-time events
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
          if (ack && ack.ok) {
            console.log("Socket re-authenticated");
          } else {
            alert("Session expired. Please log in again.");
            logout();
          }
        });
      });

      sock.on("dashboardUpdate", () => {
        refetch();
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

  if (isLoading) return <p className="loading-text">⏳ טוען נתונים…</p>;
  if (isError) return <p className="error-text">{alert || "שגיאה בטעינת הנתונים"}</p>;

  const todaysAppointments = Array.isArray(stats?.todaysAppointments) ? stats.todaysAppointments : [];
  const appointments = Array.isArray(stats?.appointments) ? stats.appointments : [];

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
    ...stats,
    messages_count: unreadCount,
  };

  // Create refs for DashboardNav
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

      {alert && <DashboardAlert text={alert} type="info" />}

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

      <div ref={appointmentsRef} className="calendar-row">
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

      <div ref={weeklySummaryRef}>
        <WeeklySummary stats={syncedStats} />
      </div>
    </div>
  );
};

export default DashboardPage;

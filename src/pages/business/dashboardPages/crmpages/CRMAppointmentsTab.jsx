import React, { useState, useEffect, useMemo } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CRMAppointmentsTab = () => {
  const { user, socket } = useAuth();
  const businessId = user?.businessId || user?.business?._id || null;
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    crmClientId: "",
    clientName: "",
    clientPhone: "",
    address: "",
    email: "",
    note: "",
    serviceId: "",
    serviceName: "",
    date: "",
    time: "",
  });

  const [editId, setEditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [businessSchedule, setBusinessSchedule] = useState(null);

  // === הפיכת אובייקט של שעות עבודה למערך ===
  const scheduleArray = useMemo(() => {
    if (!businessSchedule) return [];
    if (Array.isArray(businessSchedule)) return businessSchedule;
    return Object.entries(businessSchedule).map(([day, { start, end }]) => ({
      day,
      start,
      end,
    }));
  }, [businessSchedule]);

  // === שליפת שירותים ===
  useEffect(() => {
    async function fetchServices() {
      if (!businessId) return;
      try {
        const res = await API.get("/business/my/services");
        setServices(res.data.services || []);
      } catch (e) {
        console.error("Error fetching services:", e);
      }
    }
    fetchServices();
  }, [businessId]);

  // === שליפת לקוחות CRM ===
  useEffect(() => {
    async function fetchClients() {
      if (!businessId) return;
      try {
        const res = await API.get(`/crm-clients/${businessId}`);
        setClients(res.data || []);
      } catch (e) {
        console.error("Error fetching clients:", e);
      }
    }
    fetchClients();
  }, [businessId]);

  // === שליפת שעות עבודה ===
  useEffect(() => {
    async function fetchSchedule() {
      if (!businessId) return;
      try {
        const res = await API.get("/appointments/get-work-hours", {
          params: { businessId },
        });
        setBusinessSchedule(res.data.workHours || {});
      } catch (e) {
        console.error("Error fetching schedule:", e);
      }
    }
    fetchSchedule();
  }, [businessId]);

  // === שליפת פגישות ===
  const {
    data: appointments = [],
    refetch: refetchAppointments,
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
  } = useQuery({
    queryKey: ["appointments", "all-with-services", businessId],
    queryFn: () =>
      API.get("/appointments/all-with-services").then((res) => res.data),
    enabled: !!businessId,
  });

  // === סנכרון פגישות עם socket.io ===
  useEffect(() => {
    if (!socket) return;

    const onCreated = (appt) => {
      queryClient.setQueryData(
        ["appointments", "all-with-services", businessId],
        (old = []) => {
          if (old.some((a) => a._id === appt._id)) return old;
          return [...old, appt];
        }
      );
    };

    const onUpdated = (updatedAppt) => {
      queryClient.setQueryData(
        ["appointments", "all-with-services", businessId],
        (old = []) =>
          old.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt))
      );
    };

    const onDeleted = ({ id }) => {
      queryClient.setQueryData(
        ["appointments", "all-with-services", businessId],
        (old = []) => old.filter((appt) => appt._id !== id)
      );
    };

    socket.on("appointmentCreated", onCreated);
    socket.on("appointmentUpdated", onUpdated);
    socket.on("appointmentDeleted", onDeleted);

    return () => {
      socket.off("appointmentCreated", onCreated);
      socket.off("appointmentUpdated", onUpdated);
      socket.off("appointmentDeleted", onDeleted);
    };
  }, [socket, queryClient, businessId]);

  // === שמירה של פגישה חדשה כולל crmClientId ===
  const handleConfirmAppointment = async () => {
    if (isSaving) return;

    if (
      !newAppointment.clientName.trim() ||
      !newAppointment.clientPhone.trim() ||
      !newAppointment.date ||
      !newAppointment.time ||
      !newAppointment.serviceId ||
      !newAppointment.crmClientId
    ) {
      alert("אנא מלא שם, טלפון, שירות, תאריך, שעה ולקוח CRM");
      return;
    }

    setIsSaving(true);
    try {
      await API.post("/appointments", {
        businessId,
        crmClientId: newAppointment.crmClientId,
        name: newAppointment.clientName,
        phone: newAppointment.clientPhone,
        address: newAppointment.address,
        email: newAppointment.email,
        note: newAppointment.note,
        serviceId: newAppointment.serviceId,
        date: newAppointment.date,
        time: newAppointment.time,
        serviceName: newAppointment.serviceName,
        duration: 30,
      });

      // ✅ רענון גם לפגישות וגם לתיק הלקוח
      await refetchAppointments();
      queryClient.invalidateQueries(["clients", businessId]);
      queryClient.invalidateQueries([
        "customerFile",
        newAppointment.crmClientId,
      ]);

      setShowAddForm(false);
      setNewAppointment({
        crmClientId: "",
        clientName: "",
        clientPhone: "",
        address: "",
        email: "",
        note: "",
        serviceId: "",
        serviceName: "",
        date: "",
        time: "",
      });
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message.includes("Slot already booked")
      ) {
        alert("הזמן שבחרת תפוס או מתנגש עם תיאום אחר. בחר בבקשה זמן אחר.");
      } else {
        alert("שגיאה בשמירת התיאום, נסה שנית");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // === שליחת תזכורת וואטסאפ ===
  const sendWhatsAppReminder = (phone, clientName, date, time, service) => {
    if (!phone) {
      alert("מספר טלפון של הלקוח לא זמין");
      return;
    }
    let cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone.startsWith("972")) {
      if (cleanPhone.startsWith("0")) {
        cleanPhone = "972" + cleanPhone.substring(1);
      } else {
        cleanPhone = "972" + cleanPhone;
      }
    }

    const formattedDate = new Date(date).toLocaleDateString("he-IL", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const businessName = user?.businessName || "העסק שלך";

    const message = `שלום ${clientName},\nזוהי תזכורת לפגישה שלך בתאריך ${formattedDate} בשעה ${time}\nעבור שירות: ${service}\n\nמחכים לך,\n${businessName}`;
    const encodedMessage = encodeURIComponent(message);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  // === חיפוש וסינון ===
  const filteredUniqueAppointments = useMemo(() => {
    const seen = new Set();
    const searchLower = search.toLowerCase().trim();
    const searchDigitsOnly = search.replace(/\D/g, "");

    return appointments
      .filter((appt) => {
        const clientName = appt.clientName
          ? appt.clientName.toLowerCase().trim()
          : "";
        const clientPhone = appt.clientPhone
          ? appt.clientPhone.replace(/\D/g, "")
          : "";

        if (searchDigitsOnly.length > 0) {
          return clientPhone.includes(searchDigitsOnly);
        } else if (searchLower.length > 0) {
          return clientName.includes(searchLower);
        }
        return true;
      })
      .filter((appt) => {
        if (!appt._id) return true;
        if (seen.has(appt._id)) return false;
        seen.add(appt._id);
        return true;
      });
  }, [appointments, search]);

  if (isLoadingAppointments) return <p>טוען תיאומים...</p>;
  if (isErrorAppointments) return <p>שגיאה בטעינת התיאומים</p>;

  return (
    <div className="crm-appointments-tab">
      <h2>📆 תיאומים / הזמנות</h2>

      <div className="appointments-header">
        <input
          type="text"
          placeholder="חפש לפי שם או טלפון..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button
          className="add-btn"
          onClick={() => {
            setShowAddForm((show) => !show);
            setNewAppointment({
              crmClientId: "",
              clientName: "",
              clientPhone: "",
              address: "",
              email: "",
              note: "",
              serviceId: "",
              serviceName: "",
              date: "",
              time: "",
            });
          }}
        >
          ➕ הוסף תיאום
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          {/* ✅ בחירת לקוח CRM */}
          <select
            value={newAppointment.crmClientId}
            onChange={(e) => {
              const clientId = e.target.value;
              const client = clients.find((c) => c._id === clientId);
              setNewAppointment({
                ...newAppointment,
                crmClientId: clientId,
                clientName: client?.fullName || "",
                clientPhone: client?.phone || "",
                email: client?.email || "",
                address: client?.address || "",
              });
            }}
          >
            <option value="">בחר לקוח CRM</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.fullName} ({c.phone})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="שם מלא"
            value={newAppointment.clientName}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, clientName: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="טלפון"
            value={newAppointment.clientPhone}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, clientPhone: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="כתובת"
            value={newAppointment.address}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, address: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="אימייל (לשליחת אישור)"
            value={newAppointment.email}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, email: e.target.value })
            }
          />
          <textarea
            className="full-width"
            placeholder="הערה (לא חובה)"
            value={newAppointment.note}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, note: e.target.value })
            }
          />
          <select
            value={newAppointment.serviceId}
            onChange={(e) => {
              const service = services.find((s) => s._id === e.target.value);
              setNewAppointment({
                ...newAppointment,
                serviceId: service?._id || "",
                serviceName: service?.name || "",
                time: "",
              });
            }}
          >
            <option value="">בחר שירות</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newAppointment.date}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, date: e.target.value })
            }
          />
          <SelectTimeFromSlots
            date={newAppointment.date}
            selectedTime={newAppointment.time}
            onChange={(time) =>
              setNewAppointment({ ...newAppointment, time })
            }
            businessId={businessId}
            serviceId={newAppointment.serviceId}
            schedule={scheduleArray}
          />
          <button onClick={handleConfirmAppointment} disabled={isSaving}>
            📅 קבע פגישה
          </button>
        </div>
      )}

      {/* === טבלת פגישות === */}
      <table className="appointments-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>טלפון</th>
            <th>שירות</th>
            <th>תאריך</th>
            <th>שעה</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filteredUniqueAppointments.length === 0 ? (
            <tr>
              <td colSpan="6">לא נמצאו תיאומים</td>
            </tr>
          ) : (
            filteredUniqueAppointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.clientName}</td>
                <td>{appt.clientPhone}</td>
                <td>{appt.serviceName}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>
                  {/* תזכורת */}
                  <button
                    onClick={() =>
                      sendWhatsAppReminder(
                        appt.clientPhone,
                        appt.clientName || "לקוח",
                        appt.date,
                        appt.time,
                        appt.serviceName || appt.service
                      )
                    }
                  >
                    📩 תזכורת
                  </button>

                  {/* עריכה */}
                  <button onClick={() => setEditId(appt._id)}>✏️ ערוך</button>

                  {/* מחיקה */}
                  <button
                    onClick={async () => {
                      if (window.confirm("בטוח שתרצה למחוק את התיאום?")) {
                        try {
                          await API.delete(`/appointments/${appt._id}`);
                          queryClient.invalidateQueries([
                            "appointments",
                            "all-with-services",
                            businessId,
                          ]);
                        } catch (err) {
                          console.error("שגיאה במחיקת התיאום:", err);
                          alert("❌ המחיקה נכשלה");
                        }
                      }
                    }}
                  >
                    ❌ מחק
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CRMAppointmentsTab;

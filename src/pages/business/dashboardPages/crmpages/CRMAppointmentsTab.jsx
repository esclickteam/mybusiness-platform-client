import React, { useState, useEffect, useMemo } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";
import { useQuery, useQueryClient } from '@tanstack/react-query';

const CRMAppointmentsTab = () => {
  const { user, socket } = useAuth();
  const businessId = user?.businessId || user?.business?._id || null;
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
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
  const [editData, setEditData] = useState({
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

  const [isSaving, setIsSaving] = useState(false);

  const [services, setServices] = useState([]);
  const [businessSchedule, setBusinessSchedule] = useState(null);

  const scheduleArray = useMemo(() => {
    if (!businessSchedule) return [];
    if (Array.isArray(businessSchedule)) return businessSchedule;
    return Object.entries(businessSchedule).map(([day, { start, end }]) => ({
      day,
      start,
      end,
    }));
  }, [businessSchedule]);

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

  useEffect(() => {
    async function fetchSchedule() {
      if (!businessId) return;
      try {
        const res = await API.get('/appointments/get-work-hours', { params: { businessId } });
        setBusinessSchedule(res.data.workHours || {});
      } catch (e) {
        console.error("Error fetching schedule:", e);
      }
    }
    fetchSchedule();
  }, [businessId]);

  const { data: appointments = [], refetch: refetchAppointments, isLoading: isLoadingAppointments, isError: isErrorAppointments } = useQuery({
    queryKey: ['appointments', 'all-with-services', businessId],
    queryFn: () => API.get("/appointments/all-with-services").then(res => res.data),
    enabled: !!businessId,
  });

  useEffect(() => {
    if (!socket) return;

    const onCreated = (appt) => {
      queryClient.setQueryData(['appointments', 'all-with-services', businessId], (old = []) => {
        if (old.some(a => a._id === appt._id)) return old;
        return [...old, appt];
      });
    };

    const onUpdated = (updatedAppt) => {
      queryClient.setQueryData(['appointments', 'all-with-services', businessId], (old = []) =>
        old.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt))
      );
    };

    const onDeleted = ({ id }) => {
      queryClient.setQueryData(['appointments', 'all-with-services', businessId], (old = []) =>
        old.filter((appt) => appt._id !== id)
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

  useEffect(() => {
    if (!socket) return;

    const onServiceCreated = (newService) => {
      setServices((prev) => {
        if (prev.some(s => s._id === newService._id)) return prev;
        return [...prev, newService];
      });
    };

    socket.on("serviceCreated", onServiceCreated);

    return () => {
      socket.off("serviceCreated", onServiceCreated);
    };
  }, [socket]);

  const filteredUniqueAppointments = useMemo(() => {
    const seen = new Set();
    const searchLower = search.toLowerCase().trim();
    const searchDigitsOnly = search.replace(/\D/g, "");

    return appointments
      .filter(appt => {
        const clientName = appt.clientName ? appt.clientName.toLowerCase().trim() : "";
        const clientPhone = appt.clientPhone ? appt.clientPhone.replace(/\D/g, "") : "";

        if (searchDigitsOnly.length > 0) {
          return clientPhone.includes(searchDigitsOnly);
        } else if (searchLower.length > 0) {
          return clientName.includes(searchLower);
        }
        return true;
      })
      .filter(appt => {
        if (!appt._id) return true;
        if (seen.has(appt._id)) return false;
        seen.add(appt._id);
        return true;
      });
  }, [appointments, search]);

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

  const handleServiceChange = (serviceId, isEdit = false) => {
    const service = services.find((s) => s._id === serviceId);
    if (service) {
      if (isEdit) {
        setEditData((prev) => ({
          ...prev,
          serviceId: service._id,
          serviceName: service.name,
          time: "",
        }));
      } else {
        setNewAppointment((prev) => ({
          ...prev,
          serviceId: service._id,
          serviceName: service.name,
          time: "",
        }));
      }
    } else {
      if (isEdit) {
        setEditData((prev) => ({
          ...prev,
          serviceId: "",
          serviceName: "",
          time: "",
        }));
      } else {
        setNewAppointment((prev) => ({
          ...prev,
          serviceId: "",
          serviceName: "",
          time: "",
        }));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם למחוק את התיאום?")) {
      try {
        await API.delete(`/appointments/${id}`);
        await refetchAppointments();
      } catch {
        alert("❌ שגיאה במחיקת התיאום");
      }
    }
  };

  const saveEdit = async () => {
    if (!editId) return;
    setIsSaving(true);
    try {
      await API.patch(`/appointments/${editId}`, editData);
      await refetchAppointments();
      setEditId(null);
    } catch {
      alert("❌ שגיאה בשמירת השינוי");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (appt) => {
    setEditId(appt._id);
    setEditData({
      clientName: appt.clientName || "",
      clientPhone: appt.clientPhone || "",
      address: appt.address || "",
      email: appt.email || "",
      note: appt.note || "",
      serviceId: appt.serviceId || "",
      serviceName: appt.serviceName || "",
      date: appt.date || "",
      time: appt.time || "",
    });
  };

  const handleEditInputChange = (field, value) => {
    setEditData((prev) => {
      let newState = { ...prev, [field]: value };
      if (field === "serviceId") {
        const service = services.find((s) => s._id === value);
        newState.serviceName = service ? service.name : "";
        newState.time = "";
      }
      return newState;
    });
  };

  const handleInputChange = (field, value) => {
    setNewAppointment((prev) => {
      let newState = { ...prev, [field]: value };
      if (field === "serviceId") {
        const service = services.find((s) => s._id === value);
        newState.serviceName = service ? service.name : "";
        newState.time = "";
      }
      return newState;
    });
  };

  const handleConfirmAppointment = async () => {
    if (isSaving) return;

    if (
      !newAppointment.clientName.trim() ||
      !newAppointment.clientPhone.trim() ||
      !newAppointment.date ||
      !newAppointment.time ||
      !newAppointment.serviceId
    ) {
      alert("אנא מלא שם, טלפון, שירות, תאריך ושעה");
      return;
    }

    setIsSaving(true);
    try {
      await API.post("/appointments", {
        businessId: businessId,
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
      await refetchAppointments();
      setShowAddForm(false);
      setNewAppointment({
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
          <input
            type="text"
            placeholder="שם מלא"
            value={newAppointment.clientName}
            onChange={(e) => handleInputChange("clientName", e.target.value)}
          />
          <input
            type="tel"
            placeholder="טלפון"
            value={newAppointment.clientPhone}
            onChange={(e) => handleInputChange("clientPhone", e.target.value)}
          />
          <input
            type="text"
            placeholder="כתובת"
            value={newAppointment.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
          <input
            type="email"
            placeholder="אימייל (לשליחת אישור)"
            value={newAppointment.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <textarea
            className="full-width"
            placeholder="הערה (לא חובה)"
            value={newAppointment.note}
            onChange={(e) => handleInputChange("note", e.target.value)}
          />
          <select
            value={newAppointment.serviceId}
            onChange={(e) => handleInputChange("serviceId", e.target.value)}
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
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
          <SelectTimeFromSlots
            date={newAppointment.date}
            selectedTime={newAppointment.time}
            onChange={(time) => handleInputChange("time", time)}
            businessId={businessId}
            serviceId={newAppointment.serviceId}
            schedule={scheduleArray}
          />
          <button onClick={handleConfirmAppointment} disabled={isSaving}>
            📅 קבע פגישה
          </button>
        </div>
      )}

      {/* טבלה במחשב */}
      <table className="appointments-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>טלפון</th>
            <th>כתובת</th>
            <th>אימייל</th>
            <th>הערה</th>
            <th>שירות</th>
            <th>תאריך</th>
            <th>שעה</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filteredUniqueAppointments.length === 0 ? (
            <tr>
              <td colSpan="9">לא נמצאו תיאומים</td>
            </tr>
          ) : (
            filteredUniqueAppointments.map((appt) => (
              <tr key={appt._id} className={editId === appt._id ? "editing" : ""}>
                <td>
                  {editId === appt._id ? (
                    <input
                       value={editData.clientName}
                      onChange={(e) => handleEditInputChange("clientName", e.target.value)}
                    />
                  ) : (
                    appt.clientName || 'לא ידוע'
                  )}
                </td>
                <td className="phone-cell">
                  {editId === appt._id ? (
                    <input
                      value={editData.clientPhone}
                      onChange={(e) => handleEditInputChange("clientPhone", e.target.value)}
                    />
                  ) : (
                    appt.clientPhone
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
                    <input
                      value={editData.address}
                      onChange={(e) => handleEditInputChange("address", e.target.value)}
                    />
                  ) : (
                    appt.address
                  )}
                </td>
                <td className="email-cell">
                  {editId === appt._id ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleEditInputChange("email", e.target.value)}
                    />
                  ) : (
                    appt.email
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
                    <textarea
                      value={editData.note}
                      onChange={(e) => handleEditInputChange("note", e.target.value)}
                    />
                  ) : (
                    appt.note
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
                    <select
                      value={editData.serviceId}
                      onChange={(e) => {
                        handleServiceChange(e.target.value, true);
                        handleEditInputChange("serviceId", e.target.value);
                      }}
                    >
                      <option value="">בחר שירות</option>
                      {services.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    appt.serviceName || appt.service
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => handleEditInputChange("date", e.target.value)}
                    />
                  ) : (
                    appt.date
                  )}
                </td>
                <td>
                  {editId === appt._id ? (
                    <SelectTimeFromSlots
                      date={editData.date}
                      selectedTime={editData.time}
                      onChange={(time) => handleEditInputChange("time", time)}
                      businessId={businessId}
                      serviceId={editData.serviceId}
                      schedule={scheduleArray}
                    />
                  ) : (
                    appt.time
                  )}
                </td>
                <td className="actions-cell">
                  {editId === appt._id ? (
                    <>
                      <button
                        className="action-btn action-edit"
                        onClick={saveEdit}
                        disabled={isSaving}
                      >
                        💾 שמור
                      </button>
                      <button
                        className="action-btn action-cancel"
                        onClick={() => setEditId(null)}
                        disabled={isSaving}
                      >
                        ❌ בטל
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="action-btn action-edit" onClick={() => startEdit(appt)}>
                        ✏️ ערוך
                      </button>
                      <button className="action-btn action-cancel" onClick={() => handleDelete(appt._id)}>
                        ❌ בטל
                      </button>
                      <button
                        className="action-btn action-reminder"
                        onClick={() =>
                          sendWhatsAppReminder(
                            appt.clientPhone,
                            appt.clientName || 'לקוח',
                            appt.date,
                            appt.time,
                            appt.serviceName || appt.service
                          )
                        }
                      >
                        📩 שלח תזכורת
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* תצוגת כרטיסים למובייל */}
      <div className="appointments-cards">
        {filteredUniqueAppointments.length === 0 ? (
          <p>לא נמצאו תיאומים</p>
        ) : (
          filteredUniqueAppointments.map((appt) => (
            <div key={appt._id} className="appointment-card">
              <div><strong>שם:</strong> {appt.clientName || "לא ידוע"}</div>
              <div><strong>טלפון:</strong> {appt.clientPhone}</div>
              <div><strong>כתובת:</strong> {appt.address}</div>
              <div><strong>אימייל:</strong> {appt.email}</div>
              <div><strong>הערה:</strong> {appt.note || "-"}</div>
              <div><strong>שירות:</strong> {appt.serviceName || appt.service}</div>
              <div><strong>תאריך:</strong> {appt.date}</div>
              <div><strong>שעה:</strong> {appt.time}</div>
              <div className="card-actions">
                <button onClick={() => startEdit(appt)} aria-label="ערוך">✏️ ערוך</button>
                <button onClick={() => handleDelete(appt._id)} aria-label="בטל">❌ בטל</button>
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
                  aria-label="שלח תזכורת"
                >
                  📩 שלח תזכורת
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CRMAppointmentsTab;

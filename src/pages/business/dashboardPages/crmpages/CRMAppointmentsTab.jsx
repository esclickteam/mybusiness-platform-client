import React, { useState, useEffect, useMemo } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";
import { useQuery, useQueryClient } from '@tanstack/react-query';

const CRMAppointmentsTab = () => {
  console.log('🔍 CRMAppointmentsTab rendered');
  const { user, socket } = useAuth();
  const businessId = user?.businessId || user?.business?._id || null;
  console.log('🚀 businessId:', businessId);
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

  // קבלת תיאומים
  const { data: appointments = [], refetch: refetchAppointments, isLoading: isLoadingAppointments, isError: isErrorAppointments } = useQuery({
    queryKey: ['appointments', 'all-with-services', businessId],
    queryFn: () => API.get("/appointments/all-with-services").then(res => res.data),
    enabled: !!businessId,
    onSuccess: data => console.log('✅ fetched appointments', data),
    onError: err => console.error('❌ error fetching appointments', err),
  });

  // קבלת שירותים
  const { data: services = [], isLoading: isLoadingServices, isError: isErrorServices } = useQuery({
    queryKey: ['business', 'services', businessId],
    queryFn: () => API.get("/business/my/services").then(res => res.data.services),
    enabled: !!businessId,
    onSuccess: data => console.log('✅ fetched services', data),
    onError: err => console.error('❌ error fetching services', err),
  });

  useEffect(() => {
    if (!socket) return;
    console.log('🔌 setting up socket listeners');

    const onCreated = (appt) => {
      console.log('🔔 appointmentCreated event', appt);
      queryClient.setQueryData(['appointments', 'all-with-services', businessId], (old = []) => {
        if (old.some(a => a._id === appt._id)) return old;
        return [...old, appt];
      });
    };

    const onUpdated = (updatedAppt) => {
      console.log('🔔 appointmentUpdated event', updatedAppt);
      queryClient.setQueryData(['appointments', 'all-with-services', businessId], (old = []) =>
        old.map((appt) => (appt._id === updatedAppt._id ? updatedAppt : appt))
      );
    };

    const onDeleted = ({ id }) => {
      console.log('🔔 appointmentDeleted event', id);
      queryClient.setQueryData(['appointments', 'all-with-services', businessId], (old = []) =>
        old.filter((appt) => appt._id !== id)
      );
    };

    socket.on("appointmentCreated", onCreated);
    socket.on("appointmentUpdated", onUpdated);
    socket.on("appointmentDeleted", onDeleted);

    return () => {
      console.log('🔌 cleaning up socket listeners');
      socket.off("appointmentCreated", onCreated);
      socket.off("appointmentUpdated", onUpdated);
      socket.off("appointmentDeleted", onDeleted);
    };
  }, [socket, queryClient, businessId]);

  // סינון כפילויות + חיפוש
  const filteredUniqueAppointments = useMemo(() => {
    console.log('🔎 filtering appointments with search:', search);
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

  // פונקציה לשליחת תזכורת בוואטסאפ
  const sendWhatsAppReminder = (phone, clientName, date, time, service) => {
    console.log('📩 sendWhatsAppReminder', { phone, clientName, date, time, service });
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

    console.log('🌐 opening URL', url);
    window.open(url, "_blank");
  };

  // שאר הפונקציות שלך לעריכה, מחיקה, הוספה
  const handleServiceChange = (serviceId, isEdit = false) => {
    console.log('🔄 handleServiceChange', serviceId, isEdit);
    const service = services.find((s) => s._id === serviceId);
    if (service) {
      const targetState = isEdit ? setEditData : setNewAppointment;
      targetState((prev) => ({
        ...prev,
        serviceId: service._id,
        serviceName: service.name,
        time: "",
      }));
    } else {
      const targetState = isEdit ? setEditData : setNewAppointment;
      targetState((prev) => ({
        ...prev,
        serviceId: "",
        serviceName: "",
        time: "",
      }));
    }
  };

  const handleDelete = async (id) => {
    console.log('🗑️ handleDelete', id);
    if (window.confirm("האם למחוק את התיאום?")) {
      try {
        await API.delete(`/appointments/${id}`);
        console.log('✅ deleted appointment', id);
        await refetchAppointments();
      } catch (err) {
        console.error('❌ error deleting appointment', err);
        alert("❌ שגיאה במחיקת התיאום");
      }
    }
  };

  const saveEdit = async () => {
    if (!editId) return;
    console.log('💾 saveEdit', editId, editData);
    setIsSaving(true);
    try {
      await API.patch(`/appointments/${editId}`, editData);
      console.log('✅ saved edit', editId);
      await refetchAppointments();
      setEditId(null);
    } catch (err) {
      console.error('❌ error saving edit', err);
      alert("❌ שגיאה בשמירת השינוי");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (appt) => {
    console.log('✏️ startEdit', appt);
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
    console.log('📝 handleEditInputChange', field, value);
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
    console.log('✍️ handleInputChange', field, value);
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
    console.log('📅 handleConfirmAppointment', newAppointment);
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
      const response = await API.post("/appointments", {
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
      console.log('✅ appointment confirmed', response);
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
      console.error('❌ error confirming appointment', error);      
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

  if (isLoadingAppointments || isLoadingServices) return <p>טוען...</p>;
  if (isErrorAppointments || isErrorServices) return <p>שגיאה בטעינת הנתונים</p>;

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
            console.log('➕ toggle add form');
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
          />
          <button onClick={handleConfirmAppointment} disabled={isSaving}>
            📅 קבע פגישה
          </button>
        </div>
      )}

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
                    appt.clientName
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
                            appt.clientName,
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
    </div>
  );
};

export default CRMAppointmentsTab;

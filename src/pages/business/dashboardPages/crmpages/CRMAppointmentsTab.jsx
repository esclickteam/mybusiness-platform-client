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

  // React Query - appointments
  const { data: appointments = [], refetch: refetchAppointments, isLoading: isLoadingAppointments, isError: isErrorAppointments } = useQuery(
    ['appointments', 'all-with-services', businessId],
    () => API.get("/appointments/all-with-services").then(res => res.data),
    { enabled: !!businessId }
  );

  // React Query - services
  const { data: services = [], isLoading: isLoadingServices, isError: isErrorServices } = useQuery(
    ['business', 'services', businessId],
    () => API.get("/business/my/services").then(res => res.data.services),
    { enabled: !!businessId }
  );

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

  // סינון כפילויות + חיפוש עם useMemo
  const filteredUniqueAppointments = useMemo(() => {
    const seen = new Set();
    return appointments
      .filter(appt => {
        const searchLower = search.toLowerCase();
        return (
          appt.clientName?.toLowerCase().includes(searchLower) ||
          appt.clientPhone?.toLowerCase().includes(searchLower)
        );
      })
      .filter(appt => {
        if (!appt._id) return true;
        if (seen.has(appt._id)) return false;
        seen.add(appt._id);
        return true;
      });
  }, [appointments, search]);

  // שינוי שירות - מעדכן את state העריכה או היצירה
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

  // שמירת עריכה רק בלחיצה על שמירה
  const saveEdit = async () => {
    if (!editId) return;
    setIsSaving(true);
    try {
      const res = await API.patch(`/appointments/${editId}`, editData);
      await refetchAppointments();
      setEditId(null);
    } catch (err) {
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
        duration: 30, // ברירת מחדל 30 דק'
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

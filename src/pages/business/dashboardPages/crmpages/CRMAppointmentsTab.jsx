import React, { useState, useEffect, useMemo } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const DURATION_STEP = 15;     
const MAX_DURATION = 12 * 60;


const CRMAppointmentsTab = () => {
  const { user, socket } = useAuth();
  const businessId = user?.businessId || user?.business?._id;
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [emailMenuOpenId, setEmailMenuOpenId] = useState(null);
  

  



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

  // 💰 Payment
  price: "",
  paid: false,

  // ⏱ Duration (חדש)
  duration: 30,

});

  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [businessSchedule, setBusinessSchedule] = useState(null);

 
 const openEmail = ({ provider, email, subject, body }) => {
    console.log("🔥 openEmail called", { provider, email });

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  if (provider === "gmail") {
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`,
      "_blank"
    );
  }

  if (provider === "outlook") {
    window.open(
      `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${encodedSubject}&body=${encodedBody}`,
      "_blank"
    );
  }

  if (provider === "default") {
    window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  }
};


const handleEditAppointment = (appt) => {
  setEditId(appt._id);
  setShowAddForm(true);

  setNewAppointment({
    crmClientId: appt.crmClientId || "",
    clientName: appt.clientSnapshot?.name || "",
    clientPhone: appt.clientSnapshot?.phone || "",
    address: appt.clientSnapshot?.address || "",
    email: appt.clientSnapshot?.email || "",
    note: appt.note || "",
    serviceId: appt.serviceId || "",
    serviceName: appt.serviceName || "",
    date: appt.date,
    time: appt.time,

    // ⏱️ חובה!
    duration: appt.duration || 30,

    price: appt.price || "",
    paid: appt.paid || false,
  });
};

const handleDeleteAppointment = async (id) => {
  if (!window.confirm("Delete this appointment?")) return;

  try {
    await API.delete(`/appointments/${id}`);
    queryClient.invalidateQueries(["appointments", businessId]);
  } catch (e) {
    console.error(e);
  }
};


  /* =========================
     Schedule → Array
  ========================= */
  const scheduleArray = useMemo(() => {
    if (!businessSchedule) return [];
    return Object.entries(businessSchedule).map(([day, value]) => {
      if (!value || !value.start || !value.end) {
        return { day: Number(day), closed: true };
      }
      return {
        day: Number(day),
        start: value.start,
        end: value.end,
        closed: false,
      };
    });
  }, [businessSchedule]);

  /* =========================
     Data Fetching
  ========================= */
  useEffect(() => {
    if (!businessId) return;

    API.get("/business/my/services").then(r =>
      setServices(r.data.services || [])
    );

    API.get(`/crm-clients/${businessId}`).then(r =>
      setClients(r.data || [])
    );

    API.get("/appointments/get-work-hours", {
      params: { businessId },
    }).then(r => setBusinessSchedule(r.data.workHours || {}));
  }, [businessId]);

  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["appointments", businessId],
    queryFn: () =>
      API.get("/appointments/all-with-services").then(r => r.data),
    enabled: !!businessId,
  });

  /* =========================
     Socket Sync
  ========================= */
  useEffect(() => {
    if (!socket) return;

    socket.on("appointmentCreated", appt => {
      queryClient.setQueryData(["appointments", businessId], (old = []) =>
        old.some(a => a._id === appt._id) ? old : [...old, appt]
      );
    });

    socket.on("appointmentUpdated", updated => {
      queryClient.setQueryData(["appointments", businessId], (old = []) =>
        old.map(a => (a._id === updated._id ? updated : a))
      );
    });

    socket.on("appointmentDeleted", ({ id }) => {
      queryClient.setQueryData(["appointments", businessId], (old = []) =>
        old.filter(a => a._id !== id)
      );
    });

    return () => socket.removeAllListeners();
  }, [socket, queryClient, businessId]);

  /* =========================
     Search
  ========================= */
  const filteredAppointments = useMemo(() => {
    const q = search.toLowerCase();
    return appointments.filter(a =>
      a.clientSnapshot?.name?.toLowerCase().includes(q) ||
      a.clientSnapshot?.phone?.includes(q)
    );
  }, [appointments, search]);

  /* =========================
   Duration logic (sync with service)
========================= */
const minDuration = useMemo(() => {
  const service = services.find(s => s._id === newAppointment.serviceId);
  return service?.duration || 30;
}, [services, newAppointment.serviceId]);

useEffect(() => {
  if (newAppointment.duration < minDuration) {
    setNewAppointment(prev => ({
      ...prev,
      duration: minDuration,
    }));
  }
}, [minDuration]);



  /* =========================
     Create Appointment
  ========================= */
  const saveAppointment = async () => {
  if (isSaving) return;

  if (
    !newAppointment.clientName ||
    !newAppointment.clientPhone ||
    !newAppointment.serviceId ||
    !newAppointment.date ||
    !newAppointment.time
  ) {
    alert("Missing required fields");
    return;
  }

  const payload = {
    businessId,
    name: newAppointment.clientName,        // ✅ חובה לשרת
    phone: newAppointment.clientPhone,      // ✅ חובה לשרת
    email: newAppointment.email,
    address: newAppointment.address,
    price: Number(newAppointment.price) || 0,
    paid: newAppointment.paid,
    note: newAppointment.note,
    serviceId: newAppointment.serviceId,
    serviceName:
  newAppointment.serviceName ||
  services.find(s => s._id === newAppointment.serviceId)?.name ||
  "",

    date: newAppointment.date,
    time: newAppointment.time,
    duration: newAppointment.duration,
    crmClientId: newAppointment.crmClientId || null,
  };

  setIsSaving(true);
  try {
    if (editId) {
      // ✅ UPDATE
      await API.patch(`/appointments/${editId}`, payload);
    } else {
      // ✅ CREATE
      await API.post("/appointments", payload);
    }

    setShowAddForm(false);
    setEditId(null);
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

  duration: 30,   // ⏱️ חובה

  price: "",
  paid: false,
});

  } catch (err) {
    console.error("Save appointment error:", err);
    alert("Failed to save appointment");
  } finally {
    setIsSaving(false);
  }
};



  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Error loading appointments</p>;

  return (
    <div className="crm-appointments-tab">
      <div className="appointments-top">
        <h2>📆 Appointments</h2>

        <div className="appointments-actions">
          <input
            placeholder="Search by name or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <button
  type="button"
  className="primary-btn"
  onClick={() => {
    setEditId(null);      // יציאה ממצב עריכה
    setShowAddForm(true);

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

  duration: 30,   // ⏱️ חובה כאן

  price: "",
  paid: false,
});
  }}
>
  + Add Appointment
</button>

        </div>
      </div>

      {showAddForm && (
        <div className="appointment-form">
          <h3>{editId ? "Edit Appointment" : "New Appointment"}</h3>


          <select
            value={newAppointment.crmClientId}
            onChange={e => {
              const c = clients.find(x => x._id === e.target.value);
              setNewAppointment({
                ...newAppointment,
                crmClientId: c?._id || "",
                clientName: c?.fullName || "",
                clientPhone: c?.phone ? c.phone.replace(/\D/g, "") : "",
                email: c?.email || "",
                address: c?.address || "",
              });
            }}
          >
            <option value="">Select CRM Client</option>
            {clients.map(c => (
              <option key={c._id} value={c._id}>
                {c.fullName}
              </option>
            ))}
          </select>

          <input
            placeholder="Full name"
            value={newAppointment.clientName}
            onChange={e =>
              setNewAppointment({ ...newAppointment, clientName: e.target.value })
            }
          />

          <label>Phone:</label>
<PhoneInput
  country="us"
  value={newAppointment.clientPhone}
  onChange={phone =>
    setNewAppointment({ ...newAppointment, clientPhone: phone })
  }
/>

{/* 📧 EMAIL – מוצג רק אם נבחר CRM Client */}
{newAppointment.crmClientId && (
  <input
    type="email"
    placeholder="Email"
    value={newAppointment.email}
    readOnly
    style={{ background: "#f7f7f7" }}
  />
)}

{/* ⬇️ בחירת שירות מגיעה אחרי זה */}
<select
  value={newAppointment.serviceId}
  onChange={e => {
    const s = services.find(x => x._id === e.target.value);

    setNewAppointment(prev => ({
      ...prev,
      serviceId: s?._id || "",
      serviceName: s?.name || "",
      time: "",
      duration: s?.duration || 30,

      // 💰 סנכרון מחיר מהשירות
      price: s?.price ?? "",
    }));
  }}
>

  <option value="">Select Service</option>
  {services.map(s => (
    <option key={s._id} value={s._id}>
      {s.name}
    </option>
  ))}
</select>


          <input
            type="date"
            value={newAppointment.date}
            onChange={e =>
              setNewAppointment({ ...newAppointment, date: e.target.value })
            }
          />

          <SelectTimeFromSlots
            date={newAppointment.date}
            selectedTime={newAppointment.time}
            onChange={time =>
              setNewAppointment({ ...newAppointment, time })
            }
            businessId={businessId}
            serviceId={newAppointment.serviceId}
            schedule={scheduleArray}
            duration={newAppointment.duration} 
          />

          {/* ⏱ DURATION */}
<div className="duration-field">
  <label>Duration</label>


  <select
  value={newAppointment.duration}
  onChange={e =>
    setNewAppointment({
      ...newAppointment,
      duration: Number(e.target.value),
    })
  }
>
  {Array.from(
  {
    length: Math.floor((MAX_DURATION - minDuration) / DURATION_STEP) + 1,
  },
  (_, i) => {
    const minutes = minDuration + i * DURATION_STEP;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const label =
      hours > 0
        ? `${hours}h${mins ? ` ${mins}m` : ""}`
        : `${minutes}m`;

    return (
      <option key={minutes} value={minutes}>
        {label}
      </option>
    );
  }
)}

</select>

</div>


          {/* 💰 PAYMENT */}
<div className="payment-section">

  <div className="price-input-wrapper">
  <span className="price-prefix">$</span>

  <input
    type="number"
    placeholder="Price"
    value={newAppointment.price}
    onChange={e =>
      setNewAppointment({ ...newAppointment, price: e.target.value })
    }
  />
</div>

  <label className="paid-checkbox">
    <input
      type="checkbox"
      checked={newAppointment.paid}
      onChange={e =>
        setNewAppointment({ ...newAppointment, paid: e.target.checked })
      }
    />
    Paid
  </label>

</div>


          <div className="form-actions">
            <button
              className="secondary-btn"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>

            <button
  type="button"          // ❗ חשוב – מונע submit אוטומטי
  className="primary-btn"
  onClick={saveAppointment}
  disabled={isSaving}
>
  {isSaving ? "Saving…" : "Schedule"}
</button>

          </div>
        </div>
      )}

      <div className="appointments-grid">
        {filteredAppointments.map(appt => (
  <div key={appt._id} className="appointment-card">

    {/* 👤 Client info */}
    <div>
      <strong>{appt.clientSnapshot?.name}</strong>

      <div className="muted">
        {appt.clientSnapshot?.phone}
      </div>

      {appt.clientSnapshot?.email && (
        <div className="muted">
          📧 {appt.clientSnapshot.email}
        </div>
      )}
    </div>

    {/* 📅 Service + date */}
    <div className="meta">
      <span>{appt.serviceName}</span>
      <span>
        {appt.date} · {appt.time}
      </span>
    </div>

    {appt.duration && (
  <div className="duration-badge">
    ⏱️ {appt.duration < 60
      ? `${appt.duration}m`
      : `${Math.floor(appt.duration / 60)}h${appt.duration % 60 ? ` ${appt.duration % 60}m` : ""}`
    }
  </div>
)}


    {/* 💰 Payment info */}
    {appt.price > 0 && (
      <div className="payment-info">
        <span>💰 ${appt.price}</span>
        <span className={appt.paid ? "paid" : "unpaid"}>
          {appt.paid ? "Paid" : "Unpaid"}
        </span>
      </div>
    )}

    {/* ⚙️ Actions */}
    <div className="card-actions">

      {/* ✉️ EMAIL */}
      <div className="email-action-wrapper">
        <button
          type="button"
          title="Send email"
          onClick={() => {
            if (!appt.clientSnapshot?.email) {
              alert("This client does not have an email address.");
              return;
            }
            setEmailMenuOpenId(
              emailMenuOpenId === appt._id ? null : appt._id
            );
          }}
        >
          ✉️
        </button>

        {emailMenuOpenId === appt._id && (
          <div className="email-menu">
            <button
              onClick={() =>
                openEmail({
                  provider: "gmail",
                  email: appt.clientSnapshot.email,
                  subject: "Appointment reminder",
                  body: `Hi ${appt.clientSnapshot.name},\n\nThis is a reminder for your appointment on ${appt.date} at ${appt.time}.`,
                })
              }
            >
              Gmail
            </button>

            <button
              onClick={() =>
                openEmail({
                  provider: "outlook",
                  email: appt.clientSnapshot.email,
                  subject: "Appointment reminder",
                  body: `Hi ${appt.clientSnapshot.name},\n\nThis is a reminder for your appointment on ${appt.date} at ${appt.time}.`,
                })
              }
            >
              Outlook
            </button>

            <button
              onClick={() =>
                openEmail({
                  provider: "default",
                  email: appt.clientSnapshot.email,
                  subject: "Appointment reminder",
                  body: `Hi ${appt.clientSnapshot.name},\n\nThis is a reminder for your appointment on ${appt.date} at ${appt.time}.`,
                })
              }
            >
              Default
            </button>
          </div>
        )}
      </div>

      {/* ✏️ EDIT */}
      <button
        title="Edit appointment"
        onClick={() => handleEditAppointment(appt)}
      >
        ✏️
      </button>

      {/* 🗑️ DELETE */}
      <button
        title="Delete appointment"
        onClick={() => handleDeleteAppointment(appt._id)}
      >
        🗑️
      </button>

    </div>
  </div>
))}


        {filteredAppointments.length === 0 && (
          <div className="empty-state">No appointments yet</div>
        )}
      </div>
    </div>
  );
};

export default CRMAppointmentsTab;

import React, { useState, useEffect, useMemo } from "react";
import "./CRMAppointmentsTab.css";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CRMAppointmentsTab = () => {
  const { user, socket } = useAuth();
  const businessId = user?.businessId || user?.business?._id;
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [businessSchedule, setBusinessSchedule] = useState(null);

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
    )
      return;

    setIsSaving(true);
    try {
      await API.post("/appointments", {
        businessId,
        ...newAppointment,
        duration: 30,
      });

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
            className="primary-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add Appointment
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="appointment-form">
          <h3>New Appointment</h3>

          <select
            value={newAppointment.crmClientId}
            onChange={e => {
              const c = clients.find(x => x._id === e.target.value);
              setNewAppointment({
                ...newAppointment,
                crmClientId: c?._id || "",
                clientName: c?.fullName || "",
                clientPhone: c?.phone || "",
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

          <input
            placeholder="Phone"
            value={newAppointment.clientPhone}
            onChange={e =>
              setNewAppointment({ ...newAppointment, clientPhone: e.target.value })
            }
          />

          <select
            value={newAppointment.serviceId}
            onChange={e => {
              const s = services.find(x => x._id === e.target.value);
              setNewAppointment({
                ...newAppointment,
                serviceId: s?._id || "",
                serviceName: s?.name || "",
                time: "",
              });
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
          />

          <div className="form-actions">
            <button
              className="secondary-btn"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button
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
            <div>
              <strong>{appt.clientSnapshot?.name}</strong>
              <div className="muted">{appt.clientSnapshot?.phone}</div>
            </div>

            <div className="meta">
              <span>{appt.serviceName}</span>
              <span>
                {appt.date} · {appt.time}
              </span>
            </div>

            <div className="card-actions">
              <button title="Email">✉️</button>
              <button title="Edit">✏️</button>
              <button title="Delete">🗑️</button>
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

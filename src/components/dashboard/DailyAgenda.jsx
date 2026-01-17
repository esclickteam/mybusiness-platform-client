import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  User,
  Briefcase,
  Mail,
  Settings,
} from "lucide-react";
import "./DailyAgenda.css";

/* =====================================================
   Utils – Single Source of Truth
===================================================== */

/**
 * 🔒 Client Name
 * Order of truth:
 * 1. populated client.name
 * 2. stored snapshot clientName
 * 3. fallback "Client"
 */
function getClientName(appointment) {
  return (
    appointment?.client?.name ||
    appointment?.clientName ||
    "Client"
  );
}

/**
 * 🔒 Client Email
 * Order of truth:
 * 1. populated client.email
 * 2. stored clientEmail
 * 3. stored email
 */
function getClientEmail(appointment) {
  return (
    appointment?.client?.email ||
    appointment?.clientEmail ||
    appointment?.email ||
    ""
  );
}

/* =====================================================
   Component
===================================================== */

const DailyAgenda = ({
  date,
  appointments = [],
  businessName = "Your Business",
  businessId,
}) => {
  const navigate = useNavigate();

  /* =========================
     Date helpers
  ========================= */

  const selectedDate = useMemo(() => {
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return null;
    }
  }, [date]);

  const displayDate = useMemo(() => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unavailable";
    }
  }, [date]);

  /* =========================
     Filter appointments by day
  ========================= */

  const dayAppointments = useMemo(() => {
    if (!selectedDate) return [];

    return appointments
      .filter((a) => {
        if (!a?.date) return false;
        const apptDate = new Date(a.date)
          .toISOString()
          .split("T")[0];
        return apptDate === selectedDate;
      })
      .sort((a, b) =>
        (a?.time || "00:00").localeCompare(b?.time || "00:00")
      );
  }, [appointments, selectedDate]);

  /* =========================
     Actions
  ========================= */

  const sendEmailReminder = (
    email,
    clientName,
    date,
    time,
    service
  ) => {
    if (!email) {
      alert("Client email is not available");
      return;
    }

    const formattedDate = new Date(date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

    const subject = `Appointment Reminder – ${businessName}`;

    const body = `
Hi ${clientName},

This is a friendly reminder about your upcoming appointment.

Date: ${formattedDate}
Time: ${time}
Service: ${service}

Best regards,
${businessName}
    `.trim();

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const editAppointment = () => {
    if (!businessId) return;
    navigate(`/business/${businessId}/dashboard/crm/appointments`);
  };

  /* =========================
     Render
  ========================= */

  return (
    <div
      className={`daily-agenda ${
        dayAppointments.length === 0 ? "empty" : ""
      }`}
      dir="ltr"
    >
      {/* Header */}
      <div className="agenda-header">
        <h3>Schedule</h3>
        <div className="agenda-date">{displayDate}</div>
      </div>

      {/* Empty State */}
      {dayAppointments.length === 0 ? (
        <div className="agenda-empty">
          No appointments on this date.
        </div>
      ) : (
        <ul className="agenda-list">
          {dayAppointments.map((a) => {
            if (!a?._id) return null; // ⛔ Never render unstable items

            const time = a.time || "--:--";
            const clientName = getClientName(a);
            const serviceName = a.serviceName || "Service";
            const email = getClientEmail(a);

            return (
              <li key={a._id} className="agenda-item">
                {/* Left side */}
                <div className="agenda-main">
                  <div className="agenda-time">
                    <Clock size={16} />
                    {time}
                  </div>

                  <div className="agenda-info">
                    <strong>
                      <User size={14} /> {clientName}
                    </strong>

                    <div className="agenda-service">
                      <Briefcase size={14} /> {serviceName}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="agenda-actions">
                  <button
                    className="agenda-btn primary"
                    onClick={() =>
                      sendEmailReminder(
                        email,
                        clientName,
                        a.date,
                        time,
                        serviceName
                      )
                    }
                  >
                    <Mail size={14} />
                    Email
                  </button>

                  <button
                    className="agenda-btn ghost"
                    onClick={editAppointment}
                  >
                    <Settings size={14} />
                    Manage
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DailyAgenda;

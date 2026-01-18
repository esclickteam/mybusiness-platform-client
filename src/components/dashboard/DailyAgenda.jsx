import React, { useMemo, useState } from "react";
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
 * Priority:
 * 1. snapshot.name
 * 2. populated client.name
 * 3. legacy clientName
 * 4. fallback
 */
function getClientName(appointment) {
  return (
    appointment?.clientSnapshot?.name ||
    appointment?.client?.name ||
    appointment?.clientName ||
    "Client"
  );
}

/**
 * 🔒 Client Email
 * Priority:
 * 1. snapshot.email
 * 2. populated client.email
 * 3. legacy fields
 */
function getClientEmail(appointment) {
  return (
    appointment?.clientSnapshot?.email ||
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
  date, // expected YYYY-MM-DD
  appointments = [],
  businessName = "Your Business",
  businessId,
}) => {
  const navigate = useNavigate();

  const [emailMenuOpenId, setEmailMenuOpenId] = useState(null);

  /* =========================
     Date helpers (NO Date parsing)
  ========================= */

  const selectedDate = useMemo(() => {
    if (typeof date === "string" && date.length === 10) {
      return date;
    }
    return null;
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
      .filter((a) => a?.date === selectedDate)
      .sort((a, b) =>
        (a?.time || "00:00").localeCompare(b?.time || "00:00")
      );
  }, [appointments, selectedDate]);

  /* =========================
     Email Action (Provider aware)
  ========================= */

  const sendEmailReminder = ({
    provider,
    email,
    clientName,
    date,
    time,
    service,
  }) => {
    if (!email) {
      alert("Client email is not available");
      return;
    }

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const subject = `Appointment Reminder – ${businessName}`;
    const body = `Hi ${clientName},

This is a friendly reminder about your upcoming appointment.

Date: ${formattedDate}
Time: ${time}
Service: ${service}

Best regards,
${businessName}`;

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

    setEmailMenuOpenId(null);
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
            if (!a?._id) return null;

            const time = a.time || "--:--";
            const clientName = getClientName(a);
            const serviceName = a.serviceName || "Service";
            const email = getClientEmail(a);

            return (
              <li key={a._id} className="agenda-item">
                {/* Left */}
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
                  <div className="email-action-wrapper">
                    <button
                      className="agenda-btn primary"
                      onClick={() =>
                        setEmailMenuOpenId(
                          emailMenuOpenId === a._id ? null : a._id
                        )
                      }
                    >
                      <Mail size={14} />
                      Email
                    </button>

                    {emailMenuOpenId === a._id && (
                      <div className="email-menu">
                        <button
                          onClick={() =>
                            sendEmailReminder({
                              provider: "gmail",
                              email,
                              clientName,
                              date: a.date,
                              time,
                              service: serviceName,
                            })
                          }
                        >
                          Gmail
                        </button>

                        <button
                          onClick={() =>
                            sendEmailReminder({
                              provider: "outlook",
                              email,
                              clientName,
                              date: a.date,
                              time,
                              service: serviceName,
                            })
                          }
                        >
                          Outlook
                        </button>

                        <button
                          onClick={() =>
                            sendEmailReminder({
                              provider: "default",
                              email,
                              clientName,
                              date: a.date,
                              time,
                              service: serviceName,
                            })
                          }
                        >
                          Default
                        </button>
                      </div>
                    )}
                  </div>

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

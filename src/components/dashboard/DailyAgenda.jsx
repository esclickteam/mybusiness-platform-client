import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./DailyAgenda.css";

/* =========================
   Utils
========================= */
function getClientEmail(appointment) {
  return (
    appointment?.client?.email ||
    appointment?.clientEmail ||
    appointment?.email ||
    ""
  );
}

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
     Filter appointments
  ========================= */
  const dayAppointments = useMemo(() => {
    if (!selectedDate) return [];

    return appointments
      .filter((a) => {
        if (!a.date) return false;
        const apptDate = new Date(a.date).toISOString().split("T")[0];
        return apptDate === selectedDate;
      })
      .sort((a, b) =>
        (a.time || "00:00").localeCompare(b.time || "00:00")
      );
  }, [appointments, selectedDate]);

  /* =========================
     Email Reminder
  ========================= */
  const sendEmailReminder = (email, clientName, date, time, service) => {
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

    const body = `
Hi ${clientName},

This is a friendly reminder about your upcoming appointment.

📅 Date: ${formattedDate}
⏰ Time: ${time}
💼 Service: ${service}

If you need to reschedule, just reply to this email.

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
      {/* ===== Header ===== */}
      <div className="agenda-header">
        <h3>Schedule</h3>
        <div className="agenda-date">{displayDate}</div>
      </div>

      {/* ===== Empty ===== */}
      {dayAppointments.length === 0 ? (
        <div className="agenda-empty">
          No appointments on this date.
        </div>
      ) : (
        <ul className="agenda-list">
          {dayAppointments.map((a) => {
            const time = a.time || "--:--";
            const clientName = a.clientName || "Client";
            const serviceName = a.serviceName || "Service";
            const email = getClientEmail(a);

            return (
              <li
                key={a._id || `${time}-${clientName}`}
                className="agenda-item"
              >
                {/* Left */}
                <div className="agenda-main">
                  <div className="agenda-time">{time}</div>

                  <div className="agenda-info">
                    <strong>{clientName}</strong>
                    <div className="agenda-service">
                      {serviceName}
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
                    Email Reminder
                  </button>

                  <button
                    className="agenda-btn ghost"
                    onClick={editAppointment}
                  >
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

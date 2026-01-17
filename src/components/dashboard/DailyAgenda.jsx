import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./DailyAgenda.css";

function getClientEmail(appointment) {
  return (
    appointment?.client?.email ||   // אם יש client אובייקט (מומלץ)
    appointment?.clientEmail ||     // אם נשמר כשדה ישיר
    appointment?.email ||           // fallback
    ""
  );
}


const DailyAgenda = ({
  date,
  appointments,
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

  if (!date) {
    return (
      <p className="agenda-empty">
        Select a date to view your agenda.
      </p>
    );
  }

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

If you have any questions or need to reschedule, feel free to reply to this email.

Best regards,
${businessName}
    `.trim();

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  };

  /* =========================
     Navigate to CRM
  ========================= */
  const editAppointment = () => {
    if (!businessId) {
      alert("Business ID is not available");
      return;
    }
    navigate(`/business/${businessId}/dashboard/crm/appointments`);
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="daily-agenda-container" dir="ltr">
      <h4 className="agenda-title">
        Schedule for {displayDate}
      </h4>

      {dayAppointments.length === 0 ? (
        <p className="agenda-empty">
          No appointments on this date.
        </p>
      ) : (
        <div className="agenda-list">
          {dayAppointments.map((a) => {
            const time = a.time || "--:--";
            const clientName = a.clientName || "Client";
            const serviceName = a.serviceName || "Service";
            const clientEmail = getClientEmail(a);


            return (
              <div
                key={a._id || `${time}-${clientName}`}
                className="agenda-item"
              >
                <div className="agenda-row">
                  <span>🕒 {time}</span>
                  <span>💼 {serviceName}</span>
                </div>

                <div className="agenda-client">
                  👤 {clientName}
                </div>

                <div className="agenda-actions">
                  <button
                    className="agenda-btn primary"
                    onClick={() =>
                      sendEmailReminder(
                        clientEmail,
                        clientName,
                        a.date,
                        time,
                        serviceName
                      )
                    }
                  >
                    Send Email Reminder
                  </button>

                  <button
                    className="agenda-btn outline"
                    onClick={editAppointment}
                  >
                    Manage Appointment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DailyAgenda;

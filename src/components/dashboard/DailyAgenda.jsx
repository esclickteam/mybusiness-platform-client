import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./DailyAgenda.css";

const DailyAgenda = ({ date, appointments, businessName = "Your Business", businessId }) => {
  const navigate = useNavigate();

  // Format selected date to "YYYY-MM-DD"
  const selectedDate = useMemo(() => {
    try {
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    } catch {
      return null;
    }
  }, [date]);

  // Format date for display
  const displayDate = useMemo(() => {
    try {
      return new Date(date).toLocaleDateString("en-US");
    } catch {
      return "Unavailable";
    }
  }, [date]);

  // Filter appointments for selected day
  const dayAppointments = useMemo(() => {
    if (!selectedDate) return [];

    const filtered = appointments.filter((a) => {
      if (!a.date) return false;
      const apptDate = new Date(a.date).toISOString().split("T")[0];
      return apptDate === selectedDate;
    });

    const sorted = filtered.sort((a, b) => {
      const timeA = a.time || "00:00";
      const timeB = b.time || "00:00";
      return timeA.localeCompare(timeB);
    });

    return sorted;
  }, [appointments, selectedDate]);

  // No date selected
  if (!date) {
    return (
      <p style={{ fontStyle: "italic", textAlign: "center" }}>
        Select a date to view your agenda.
      </p>
    );
  }

  // WhatsApp reminder function
  const sendWhatsAppReminder = (phone, clientName, date, time, service) => {
    if (!phone) {
      alert("Client phone number is not available");
      return;
    }

    let cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone.startsWith("1") && !cleanPhone.startsWith("972")) {
      if (cleanPhone.startsWith("0")) {
        cleanPhone = "972" + cleanPhone.substring(1);
      } else {
        cleanPhone = "972" + cleanPhone;
      }
    }

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const message = `Hi ${clientName},\nThis is a reminder for your appointment on ${formattedDate} at ${time}.\nService: ${service}\n\nLooking forward to seeing you,\n${businessName}`;
    const encodedMessage = encodeURIComponent(message);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  // Navigate to appointment management
  const editAppointment = (appt) => {
    if (!businessId) {
      alert("Business ID is not available");
      return;
    }
    navigate(`/business/${businessId}/dashboard/crm/appointments`);
  };

  return (
    <div className="daily-agenda-container" dir="ltr">
      <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
        Schedule for {displayDate}
      </h4>

      {dayAppointments.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          No appointments on this date.
        </p>
      ) : (
        <div className="agenda-list">
          {dayAppointments.map((a) => {
            const time = a.time || "";
            const clientName = a.clientName?.trim() || "Unknown";
            const serviceName = a.serviceName || "Unknown";
            const clientPhone = a.clientPhone || "";

            console.log(`Displaying appointment for clientName: ${clientName}`);

            return (
              <div
                key={a._id || a.id || `${time}-${clientName}-${serviceName}`}
                className="agenda-item"
              >
                <div className="agenda-time">🕒 {time}</div>
                <div className="agenda-service">💼 Service: {serviceName}</div>
                <div className="agenda-client">👤 Client: {clientName}</div>
                <div className="agenda-actions">
                  <button
                    className="agenda-btn"
                    aria-label={`Send WhatsApp reminder to ${clientName} at ${time}`}
                    onClick={() =>
                      sendWhatsAppReminder(
                        clientPhone,
                        clientName,
                        a.date,
                        time,
                        serviceName
                      )
                    }
                  >
                    Send Reminder
                  </button>
                  <button
                    className="agenda-btn outline"
                    aria-label={`Edit appointment for ${clientName} at ${time}`}
                    onClick={() => editAppointment(a)}
                  >
                    Edit Appointment
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

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./DailyAgenda.css";

const DailyAgenda = ({ date, appointments, businessName = "העסק שלך", businessId }) => {
  const navigate = useNavigate();

  // פורמט תאריך לתבנית "YYYY-MM-DD"
  const selectedDate = useMemo(() => {
    try {
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    } catch {
      return null;
    }
  }, [date]);

  // טיפול בתאריך לתצוגה בטקסט הכותרת, עם fallback
  const displayDate = useMemo(() => {
    try {
      return new Date(date).toLocaleDateString("he-IL");
    } catch {
      return "לא זמין";
    }
  }, [date]);

  // סינון וסידור הפגישות ליום הנבחר
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

  // אם לא נבחר תאריך, נחזיר טקסט מתאים
  if (!date) {
    return (
      <p style={{ fontStyle: "italic", textAlign: "center" }}>
        בחר/י תאריך כדי לראות לו״ז
      </p>
    );
  }

  // פונקציית שליחת תזכורת בוואטסאפ
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

    const message = `שלום ${clientName},\nזוהי תזכורת לפגישה שלך בתאריך ${formattedDate} בשעה ${time}\nעבור שירות: ${service}\n\nמחכים לך,\n${businessName}`;
    const encodedMessage = encodeURIComponent(message);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  // ניתוב לעמוד תיאומים/הזמנות
  const editAppointment = (appt) => {
    if (!businessId) {
      alert("מזהה העסק לא זמין");
      return;
    }
    navigate(`/business/${businessId}/dashboard/crm/appointments`);
  };

  return (
    <div className="daily-agenda-container">
      <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
        לו״ז ליום {displayDate}
      </h4>

      {dayAppointments.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          אין פגישות בתאריך זה.
        </p>
      ) : (
        <div className="agenda-list">
          {dayAppointments.map((a) => {
            const time = a.time || "";
            const clientName = a.clientName?.trim() || a.client?.name?.trim() || "לא ידוע";


            const serviceName = a.serviceName || "לא ידוע";
            const clientPhone = a.clientPhone || "";

            return (
              <div
                key={a._id || a.id || `${time}-${clientName}-${serviceName}`}
                className="agenda-item"
              >
                <div className="agenda-time">🕒 {time}</div>
                <div className="agenda-service">💼 שירות: {serviceName}</div>
                <div className="agenda-client">👤 לקוח: {clientName}</div>
                <div className="agenda-actions">
                  <button
                    className="agenda-btn"
                    aria-label={`שלח תזכורת לווטסאפ ללקוח ${clientName} לשעה ${time}`}
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
                    שלח תזכורת
                  </button>
                  <button
                    className="agenda-btn outline"
                    aria-label={`ערוך פגישה של לקוח ${clientName} לשעה ${time}`}
                    onClick={() => editAppointment(a)}
                  >
                    ערוך פגישה
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

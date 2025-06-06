import React, { useMemo } from "react";

const DailyAgenda = ({ date, appointments, businessName = "העסק שלך" }) => {
  if (!date)
    return (
      <p style={{ fontStyle: "italic", textAlign: "center" }}>
        בחר/י תאריך כדי לראות לו״ז
      </p>
    );

  // פורמט תאריך בתבנית "YYYY-MM-DD" להשוואה
  const selectedDate = useMemo(() => {
    try {
      // אם זה כבר ISO (YYYY-MM-DD), תחזיר אותו כפי שהוא
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    } catch {
      return null;
    }
  }, [date]);

  // סינון ומיון הפגישות ליום שנבחר - עם לוגים
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

  const sendWhatsAppReminder = (clientName, time, service) => {
    const message = `שלום ${clientName},\nזוהי תזכורת לפגישה שלך היום בשעה ${time}\nעבור שירות: ${service}\n\nמחכים לך,\n${businessName}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const editAppointment = (appt) => {
    console.log("עריכת פגישה:", appt);
    alert("עריכת פגישה תתווסף בהמשך ליומן/CRM");
  };

  return (
    <div className="graph-box">
      <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
        לו״ז ליום {new Date(date).toLocaleDateString("he-IL")}
      </h4>

      {dayAppointments.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          אין פגישות בתאריך זה.
        </p>
      ) : (
        <div className="agenda-list">
          {dayAppointments.map((a) => {
            const time = a.time || "";
            const clientName = a.clientName || "לא ידוע";
            const serviceName = a.serviceName || "לא ידוע";

            return (
              <div key={a._id} className="agenda-item">
                <div className="agenda-time">🕒 {time}</div>
                <div className="agenda-service">💼 שירות: {serviceName}</div>
                <div className="agenda-client">👤 לקוח: {clientName}</div>
                <div className="agenda-actions">
                  <button
                    className="agenda-btn"
                    aria-label={`שלח תזכורת בוואטסאפ ללקוח ${clientName} בשעה ${time}`}
                    onClick={() =>
                      sendWhatsAppReminder(clientName, time, serviceName)
                    }
                  >
                    שלח תזכורת
                  </button>
                  <button
                    className="agenda-btn outline"
                    aria-label={`ערוך פגישה עם ${clientName} בשעה ${time}`}
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

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
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return null;
    }
  }, [date]);

  // סינון ומיון הפגישות ליום שנבחר
  const dayAppointments = useMemo(() => {
    if (!selectedDate) return [];

    return appointments
      .filter((a) => a.date && a.date.startsWith(selectedDate))
      .sort((a, b) => {
        // השוואת זמן לפי שדה time
        const timeA = a.time || "00:00";
        const timeB = b.time || "00:00";
        return timeA.localeCompare(timeB);
      });
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
          {dayAppointments.map((a, i) => {
            const time = a.time || "";

            // שימוש בשמות אם קיימים, אחרת מציגים מזהים
            const clientName = a.client?.name || a.client || "לא ידוע";
            // כאן העדכון העיקרי:
            const serviceName = a.serviceId?.title || a.service?.name || a.service || "לא ידוע";

            return (
              <div key={i} className="agenda-item">
                <div className="agenda-time">🕒 {time}</div>
                <div className="agenda-service">💼 שירות: {serviceName}</div>
                <div className="agenda-client">👤 לקוח: {clientName}</div>
                <div className="agenda-actions">
                  <button
                    className="agenda-btn"
                    onClick={() =>
                      sendWhatsAppReminder(clientName, time, serviceName)
                    }
                  >
                    שלח תזכורת
                  </button>
                  <button
                    className="agenda-btn outline"
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

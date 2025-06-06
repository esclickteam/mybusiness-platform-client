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
      .sort((a, b) => new Date(a.date) - new Date(b.date));
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
            const time = new Date(a.date).toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={i} className="agenda-item">
                <div className="agenda-time">🕒 {time}</div>
                <div className="agenda-service">💼 שירות: {a.service}</div>
                <div className="agenda-client">👤 לקוח: {a.client}</div>
                <div className="agenda-actions">
                  <button
                    className="agenda-btn"
                    onClick={() =>
                      sendWhatsAppReminder(a.client, time, a.service)
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

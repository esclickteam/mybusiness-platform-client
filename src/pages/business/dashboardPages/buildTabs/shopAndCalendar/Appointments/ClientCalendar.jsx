import React, { useState, useEffect } from "react";
import API from "../../../../../../api"; // תקן בהתאם לפרויקט שלך
import "./ClientCalendar.css";
import MonthCalendar from "../../../../../../components/MonthCalendar";

export default function ClientCalendar({
  workHours = {},
  selectedService,
  onBackToList,
  businessId,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  // כל הזמנים המקוריים
  const [availableSlots, setAvailableSlots] = useState([]);
  // שעות שכבר הוזמנו בפנים (משרת ה-API)
  const [bookedSlots, setBookedSlots] = useState([]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mode, setMode] = useState("slots");

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientNote, setClientNote] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const [bookingSuccess, setBookingSuccess] = useState(false);

  // 1) עדכון חודש ושנה בהתייחס לתאריך נבחר
  useEffect(() => {
    setMonth(selectedDate.getMonth());
    setYear(selectedDate.getFullYear());
  }, [selectedDate]);

  const dayIdx = selectedDate.getDay();
  const config = workHours[dayIdx];
  const serviceDuration = selectedService?.duration || 30;

  // 2) שליפת bookedSlots מהשרת עבור התאריך הנבחר
  useEffect(() => {
    if (!businessId) return;
    const dateStr = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD
    setBookedSlots([]); // אישור רענון
    API.get("/appointments/by-date", {
      params: { businessId, date: dateStr }
    })
      .then(res => {
        // מייחסים מערך מחרוזות זמנים
        const times = res.data.map(a => a.time);
        setBookedSlots(times);
      })
      .catch(err => {
        console.error("Error fetching booked slots:", err);
      });
  }, [selectedDate, businessId]);

  // 3) בונה את availableSlots מסוננים גם ע"פ bookedSlots
  useEffect(() => {
    if (config?.start && config?.end) {
      const all = generateTimeSlots(config.start, config.end, config.breaks);
      setAvailableSlots(all.filter(s => !bookedSlots.includes(s)));
    } else {
      setAvailableSlots([]);
    }
    setSelectedSlot(null);
    setMode("slots");
  }, [selectedDate, config, bookedSlots]);

  const generateTimeSlots = (startTime, endTime, breaks = "") => {
    const toMin = t => {
      const [h, m = "00"] = t.trim().split(":");
      return +h * 60 + +m;
    };
    const fromMin = m => {
      const h = Math.floor(m / 60),
        mm = m % 60;
      return `${h.toString().padStart(2, "0")}:${mm
        .toString()
        .padStart(2, "0")}`;
    };

    const start = toMin(startTime),
      end = toMin(endTime);
    const breaksArr = breaks
      ? breaks
          .split(/[\n,]/)
          .map(s => s.trim())
          .filter(Boolean)
          .map(b => {
            const [f, t] = b.replace(/\s/g, "").split("-");
            return f && t ? [toMin(f), toMin(t)] : null;
          })
          .filter(Boolean)
      : [];

    const slots = [];
    for (let t = start; t + serviceDuration <= end; t += serviceDuration) {
      const inBreak = breaksArr.some(
        ([f, to]) => t < to && t + serviceDuration > f
      );
      if (!inBreak) slots.push(fromMin(t));
    }
    return slots;
  };

  const handleSelectSlot = time => {
    setSelectedSlot({
      time,
      date: selectedDate.toLocaleDateString("he-IL"),
      rawDate: selectedDate,
      duration: selectedService.duration,
      price: selectedService.price,
      name: selectedService.name,
      serviceId: selectedService._id,
    });
    setMode("summary");
  };

  const handleSubmitBooking = async () => {
    if (!clientName || !clientPhone || !clientAddress) {
      alert("אנא מלא את כל הפרטים הנדרשים");
      return;
    }
    if (!selectedSlot) {
      alert("לא נבחרה שעה");
      return;
    }
    if (!businessId) {
      alert("אין מזהה עסק. נא לרענן את הדף ולנסות שוב.");
      return;
    }

    try {
      await API.post("/appointments", {
        businessId,
        serviceId: selectedSlot.serviceId,
        date: selectedSlot.rawDate.toISOString().slice(0, 10), // YYYY-MM-DD
        time: selectedSlot.time,
        name: clientName,
        phone: clientPhone,
        address: clientAddress,
        note: clientNote,
        email: clientEmail,
        price: selectedSlot.price,
        duration: selectedSlot.duration,
      });

      // אחרי הצלחה: הוסף את השעה ל-bookedSlots כדי שתסונן מיד
      setBookedSlots(prev => [...prev, selectedSlot.time]);
      setBookingSuccess(true);
    } catch (err) {
      alert(
        "שגיאה בשליחת תיאום: " +
          (err?.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="client-calendar-wrapper">
      {mode === "slots" && (
        <>
          <h3>📅 בחר תאריך</h3>
          {selectedService && (
            <div className="month-overview">
              <div className="calendar-nav">
                <button
                  onClick={() => {
                    if (month === 0) {
                      setMonth(11);
                      setYear((y) => y - 1);
                    } else {
                      setMonth((m) => m - 1);
                    }
                  }}
                  className="month-nav-btn"
                  type="button"
                >
                  ← חודש קודם
                </button>
                <button
                  onClick={() => {
                    if (month === 11) {
                      setMonth(0);
                      setYear((y) => y + 1);
                    } else {
                      setMonth((m) => m + 1);
                    }
                  }}
                  className="month-nav-btn"
                  type="button"
                >
                  חודש הבא →
                </button>
              </div>
              <MonthCalendar
                year={year}
                month={month}
                selectedDate={selectedDate}
                onDateClick={(date) => {
                  setSelectedDate(date);
                  setMode("slots");
                }}
              />
            </div>
          )}

          <div className="selected-date-info">
            <h4>📆 {selectedDate.toLocaleDateString("he-IL")}</h4>
            {config ? (
              <>
                <p>
                  🕓 שעות פעילות: {config.start} - {config.end}
                </p>
                {config.breaks && <p>⏸️ הפסקות: {config.breaks}</p>}
                <h5>🕒 שעות פנויות:</h5>
                {availableSlots.length ? (
                  <div className="slot-list">
                    {availableSlots.map((t, i) => (
                      <div key={i} className="slot-item">
                        <button onClick={() => handleSelectSlot(t)}>{t}</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>אין שעות פנויות ליום זה</p>
                )}
              </>
            ) : (
              <p>⚠️ לא הוגדרו שעות ליום זה</p>
            )}
          </div>
        </>
      )}

      {mode === "summary" && selectedSlot && (
        <div className="summary-box">
          {!bookingSuccess ? (
            <>
              <h4 className="success-message">📋 סיכום תיאום</h4>
              <p>🧾 שירות: {selectedSlot.name}</p>
              <p>📅 תאריך: {selectedSlot.date}</p>
              <p>🕓 שעה: {selectedSlot.time}</p>
              <p>
                ⏱️ משך:{" "}
                {Math.floor(selectedSlot.duration / 60)}:
                {(selectedSlot.duration % 60)
                  .toString()
                  .padStart(2, "0")}
              </p>
              <p>💰 עלות: {selectedSlot.price} ₪</p>

              <div className="booking-form">
                <label>שם מלא:</label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <label>טלפון:</label>
                <input
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
                <label>כתובת:</label>
                <input
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                />
                <label>אימייל (לשליחת אישור):</label>
                <input
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  type="email"
                />
                <label>הערה (לא חובה):</label>
                <textarea
                  value={clientNote}
                  onChange={(e) => setClientNote(e.target.value)}
                />
              </div>

              <button
                className="confirm-slot-btn"
                onClick={handleSubmitBooking}
              >
                📅 תיאום תור
              </button>
              <button className="back-button" onClick={() => setMode("slots")}>
                🔙 חזרה לשעות
              </button>
            </>
          ) : (
            <div>
              <h4 className="success-message">🎉 התיאום נשלח בהצלחה!</h4>
              <p>
                {clientEmail
                  ? "נשלח אישור למייל"
                  : "לא נשלח אישור כי לא הוזן אימייל"}
              </p>
              <button className="back-button" onClick={onBackToList}>
                🔙 חזרה לרשימה
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

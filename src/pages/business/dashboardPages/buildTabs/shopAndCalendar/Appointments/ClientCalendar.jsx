// src/pages/business/dashboardPages/buildTabs/shopAndCalendar/Appointments/ClientCalendar.jsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import "react-calendar/dist/Calendar.css";
import "./ClientCalendar.css";
import AppointmentPayment from "./AppointmentPayment";

const ClientCalendar = ({ workHours = {}, selectedService, onBackToList }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mode, setMode] = useState("slots");

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientNote, setClientNote] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [paymentStep, setPaymentStep] = useState("summary");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [availablePayments, setAvailablePayments] = useState([]);
  const [slikaDetails, setSlikaDetails] = useState({});

  const dateKey = selectedDate.toDateString();
  const config = workHours[dateKey];
  const serviceDuration = selectedService?.duration || 30;

  useEffect(() => {
    const allCalendar = JSON.parse(localStorage.getItem("demoPaymentMethods_calendar") || "[]");
    const allShop = JSON.parse(localStorage.getItem("demoPaymentMethods_shop") || "[]");
    const slikaCal = JSON.parse(localStorage.getItem("demoSlikaDetails_calendar") || "{}");
    const slikaShop = JSON.parse(localStorage.getItem("demoSlikaDetails_shop") || "{}");

    const union = [...new Set([...allCalendar, ...allShop])];
    setAvailablePayments(union);
    setSlikaDetails(slikaCal.link ? slikaCal : slikaShop);
  }, []);

  useEffect(() => {
    if (config?.start && config?.end) {
      const slots = generateTimeSlots(config.start, config.end, config.breaks);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
    setSelectedSlot(null);
    setMode("slots");
  }, [selectedDate, config]);

  const generateTimeSlots = (startTime, endTime, breaks = "") => {
    const parseTime = (timeStr) => {
      const clean = timeStr.trim();
      const [h, m = "00"] = clean.split(":");
      return parseInt(h, 10) * 60 + parseInt(m, 10);
    };
    const formatTime = (minutes) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const slots = [];

    const breaksArray = breaks
      .split(/[\,\n]/)
      .map((b) => b.trim())
      .filter(Boolean)
      .map((b) => {
        const [from, to] = b.replace(/\s/g, "").split("-");
        if (!from || !to) return null;
        return [parseTime(from), parseTime(to)];
      })
      .filter(Boolean);

    for (let time = start; time + serviceDuration <= end; time += serviceDuration) {
      const isInBreak = breaksArray.some(
        ([from, to]) => time < to && time + serviceDuration > from
      );
      if (!isInBreak) {
        slots.push(formatTime(time));
      }
    }
    return slots;
  };

  const handleSelectSlot = (time) => {
    setSelectedSlot({
      time,
      date: selectedDate.toLocaleDateString("he-IL"),
      duration: selectedService.duration,
      price: selectedService.price,
      name: selectedService.name,
    });
    setMode("summary");
  };

  const handleSubmitBooking = () => {
    if (!clientName || !clientPhone || !clientAddress) {
      alert("אנא מלא את כל הפרטים הנדרשים");
      return;
    }
    const booking = {
      id: Date.now(),
      name: clientName,
      phone: clientPhone,
      address: clientAddress,
      note: clientNote,
      paymentMethod: selectedPayment,
      status: "חדש",
      ...selectedSlot,
    };
    const existing = JSON.parse(localStorage.getItem("demoAppointments") || "[]");
    const updated = [...existing, booking];
    localStorage.setItem("demoAppointments", JSON.stringify(updated));
    console.log("📩 תיאום נשמר:", booking);
    setBookingSuccess(true);
  };

  return (
    <div className="client-calendar-wrapper" dir="ltr">
      {mode === "slots" && (
        <>
          <h3>📅 בחר תאריך</h3>
          <div className="calendar-fullwidth">
            <Calendar
              locale="he-IL"
              value={selectedDate}
              onChange={setSelectedDate}
              formatShortWeekday={(locale, date) =>
                format(date, "EEEEE", { locale: he })
              }
            />
          </div>
          <div className="selected-date-info">
            <h4>📆 {selectedDate.toLocaleDateString("he-IL")}</h4>
            {config ? (
              <>
                <p>🕓 שעות פעילות: {config.start} - {config.end}</p>
                {config.breaks && <p>⏸️ הפסקות: {config.breaks}</p>}
                <h5>🕒 שעות פנויות:</h5>
                {availableSlots.length > 0 ? (
                  <div className="slot-list">
                    {availableSlots.map((time, idx) => (
                      <div key={idx} className="slot-item">
                        <button onClick={() => handleSelectSlot(time)}>{time}</button>
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
          {paymentStep === "summary" && !bookingSuccess ? (
            <>
              <h4 className="success-message">📋 סיכום תיאום</h4>
              <p>🧾 שירות: {selectedSlot.name}</p>
              <p>📅 תאריך: {selectedSlot.date}</p>
              <p>🕓 שעה: {selectedSlot.time}</p>
              <p>
                ⏱️ משך:{" "}
                {Math.floor(selectedSlot.duration / 60)}:
                {(selectedSlot.duration % 60).toString().padStart(2, "0")} שעות
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
                <label>הערה (לא חובה):</label>
                <textarea
                  value={clientNote}
                  onChange={(e) => setClientNote(e.target.value)}
                />
              </div>

              <button
                className="confirm-slot-btn"
                onClick={() => setPaymentStep("payment")}
              >
                💳 המשך לתשלום
              </button>
              <button className="back-button" onClick={() => setMode("slots")}>
                🔙 חזרה לשעות
              </button>
            </>
          ) : paymentStep === "payment" && !bookingSuccess ? (
            <AppointmentPayment
              onBack={() => setPaymentStep("summary")}
              onSubmit={(data) => {
                setSelectedPayment(data.method);
                handleSubmitBooking();
                setPaymentStep("done");
              }}
            />
          ) : (
            <div>
              <h4 className="success-message">🎉 התיאום נשלח בהצלחה!</h4>
              <p>נציג יחזור אליך לאישור</p>
              <button className="back-button" onClick={onBackToList}>
                🔙 חזרה לרשימה
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientCalendar;

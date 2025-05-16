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

    setAvailablePayments([...new Set([...allCalendar, ...allShop])]);
    setSlikaDetails(slikaCal.link ? slikaCal : slikaShop);
  }, []);

  useEffect(() => {
    if (config?.start && config?.end) {
      setAvailableSlots(generateTimeSlots(config.start, config.end, config.breaks));
    } else {
      setAvailableSlots([]);
    }
    setSelectedSlot(null);
    setMode("slots");
  }, [selectedDate, config]);

  const generateTimeSlots = (startTime, endTime, breaks = "") => {
    const toMin = t => {
      const [h, m="00"] = t.trim().split(":");
      return +h * 60 + +m;
    };
    const fromMin = m => {
      const h = Math.floor(m/60), mm = m%60;
      return `${h.toString().padStart(2,"0")}:${mm.toString().padStart(2,"0")}`;
    };

    const start = toMin(startTime), end = toMin(endTime);
    const breaksArr = breaks
      .split(/[\n,]/).map(s=>s.trim()).filter(Boolean)
      .map(b=>{
        const [f,t] = b.replace(/\s/g,"").split("-");
        return f && t ? [toMin(f), toMin(t)] : null;
      }).filter(Boolean);

    const slots = [];
    for (let t = start; t + serviceDuration <= end; t += serviceDuration) {
      const inBreak = breaksArr.some(([f,to]) => t < to && t + serviceDuration > f);
      if (!inBreak) slots.push(fromMin(t));
    }
    return slots;
  };

  const handleSelectSlot = time => {
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
    localStorage.setItem("demoAppointments", JSON.stringify([...existing, booking]));
    setBookingSuccess(true);
  };

  return (
    <div className="client-calendar-wrapper">
      {mode === "slots" && (
        <>
          <h3>📅 בחר תאריך</h3>
          <div className="calendar-fullwidth">
            <Calendar
              locale="he-IL"
              value={selectedDate}
              onChange={setSelectedDate}
              formatShortWeekday={(loc, d) => format(d, "EEEEE", { locale: he })}
              showNeighboringMonth={true}
            />
          </div>
          <div className="selected-date-info">
            <h4>📆 {selectedDate.toLocaleDateString("he-IL")}</h4>
            {config ? (
              <>
                <p>🕓 שעות פעילות: {config.start} - {config.end}</p>
                {config.breaks && <p>⏸️ הפסקות: {config.breaks}</p>}
                <h5>🕒 שעות פנויות:</h5>
                {availableSlots.length ? (
                  <div className="slot-list">
                    {availableSlots.map((t,i) => (
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
          {paymentStep === "summary" && !bookingSuccess ? (
            <>
              <h4 className="success-message">📋 סיכום תיאום</h4>
              <p>🧾 שירות: {selectedSlot.name}</p>
              <p>📅 תאריך: {selectedSlot.date}</p>
              <p>🕓 שעה: {selectedSlot.time}</p>
              <p>
                ⏱️ משך: {Math.floor(selectedSlot.duration/60)}:
                {(selectedSlot.duration%60).toString().padStart(2,"0")}
              </p>
              <p>💰 עלות: {selectedSlot.price} ₪</p>

              <div className="booking-form">
                <label>שם מלא:</label>
                <input value={clientName} onChange={e => setClientName(e.target.value)} />
                <label>טלפון:</label>
                <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
                <label>כתובת:</label>
                <input value={clientAddress} onChange={e => setClientAddress(e.target.value)} />
                <label>הערה (לא חובה):</label>
                <textarea value={clientNote} onChange={e => setClientNote(e.target.value)} />
              </div>

              <button className="confirm-slot-btn" onClick={() => setPaymentStep("payment")}>
                💳 המשך לתשלום
              </button>
              <button className="back-button" onClick={() => setMode("slots")}>
                🔙 חזרה לשעות
              </button>
            </>
          ) : paymentStep === "payment" && !bookingSuccess ? (
            <AppointmentPayment
              onBack={() => setPaymentStep("summary")}
              onSubmit={data => {
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

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarSetup.css";

const CalendarSetup = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customHours, setCustomHours] = useState({});
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [breaks, setBreaks] = useState("");

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [slikaDetails, setSlikaDetails] = useState({
    merchantId: "",
    apiKey: "",
    link: ""
  });

  const dateKey = selectedDate.toDateString();

  const saveDateHours = () => {
    if (!start || !end) return;

    setCustomHours((prev) => ({
      ...prev,
      [dateKey]: { start, end, breaks },
    }));

    setStart("");
    setEnd("");
    setBreaks("");
  };

  const handleTogglePayment = (method) => {
    setPaymentMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleSaveAll = () => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail === "newuser@example.com") {
      localStorage.setItem("demoWorkHours", JSON.stringify(customHours));
      localStorage.setItem("demoPaymentMethods", JSON.stringify(paymentMethods));

      if (paymentMethods.includes("סליקה")) {
        localStorage.setItem("demoSlikaDetails", JSON.stringify(slikaDetails));
      }

      console.log("📦 שמירה:", {
        שעות: customHours,
        תשלום: paymentMethods,
        סליקה: slikaDetails,
      });
    }
  };

  return (
    <div className="calendar-setup-container">
      <h2>📅 הגדרת שעות פעילות לפי תאריך</h2>

      <Calendar
        locale="he-IL"
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          const saved = customHours[date.toDateString()];
          setStart(saved?.start || "");
          setEnd(saved?.end || "");
          setBreaks(saved?.breaks || "");
        }}
      />

      <div className="inputs" style={{ marginTop: "20px" }}>
        <h4>⏰ שעות פעילות ל־{selectedDate.toLocaleDateString("he-IL")}:</h4>

        <label>שעת התחלה:</label>
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label>שעת סיום:</label>
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <label>הפסקות (לא חובה):</label>
        <input
          type="text"
          placeholder="לדוגמה: 12:00–12:30"
          value={breaks}
          onChange={(e) => setBreaks(e.target.value)}
        />

        <button onClick={saveDateHours} className="edit-date-btn">
          ✏️ שמור שעות לתאריך זה
        </button>
      </div>

      {/* ✅ אפשרויות תשלום */}
      <div className="inputs" style={{ marginTop: "30px" }}>
        <h4>💳 אפשרויות תשלום:</h4>
        <div className="payment-options">
          {["מזומן", "סליקה", "טלפוני", "Bit", "PayBox"].map((method) => (
            <button
              key={method}
              type="button"
              className={paymentMethods.includes(method) ? "active" : ""}
              onClick={() => handleTogglePayment(method)}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ הגדרת פרטי סליקה */}
      {paymentMethods.includes("סליקה") && (
        <div className="inputs slika-details">
          <h4>🔐 הגדרות סליקה:</h4>

          <label>מזהה סוחר:</label>
          <input
            type="text"
            value={slikaDetails.merchantId}
            onChange={(e) =>
              setSlikaDetails({ ...slikaDetails, merchantId: e.target.value })
            }
          />

          <label>API Key:</label>
          <input
            type="text"
            value={slikaDetails.apiKey}
            onChange={(e) =>
              setSlikaDetails({ ...slikaDetails, apiKey: e.target.value })
            }
          />

          <label>קישור לעמוד סליקה:</label>
          <input
            type="text"
            value={slikaDetails.link}
            onChange={(e) =>
              setSlikaDetails({ ...slikaDetails, link: e.target.value })
            }
          />
        </div>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button className="save-all-btn styled" onClick={handleSaveAll}>
          💾 שמור את כל הגדרות היומן
        </button>
      </div>
    </div>
  );
};

export default CalendarSetup;

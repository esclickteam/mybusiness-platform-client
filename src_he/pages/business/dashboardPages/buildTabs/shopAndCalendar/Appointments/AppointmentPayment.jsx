import React, { useState } from "react";
import "./AppointmentPayment.css";
import emailjs from "emailjs-com";

const AppointmentPayment = ({ onBack, onSubmit }) => {
  const [method, setMethod] = useState(null);
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  const [phoneName, setPhoneName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneEmail, setPhoneEmail] = useState("");

  return (
    <div className="appointment-payment">
      <h4>תשלום 💳</h4>

      {!showCreditForm && !showPhoneForm && (
        <div className="payment-methods">
          <p>בחר את שיטת התשלום המועדפת:</p>

          <button
            className={`base-button ${method === "card" ? "selected" : ""}`}
            onClick={() => {
              setMethod("card");
              setShowCreditForm(true);
            }}
          >
            תשלום בכרטיס אשראי 💳
          </button>

          <button
            className={`base-button ${method === "phone" ? "selected" : ""}`}
            onClick={() => {
              setMethod("phone");
              setShowPhoneForm(true);
            }}
          >
            תשלום טלפוני 📞
          </button>

          <div className="action-buttons">
            <button onClick={onBack}>⬅ חזרה</button>
          </div>
        </div>
      )}

      {method === "card" && showCreditForm && (
        <div className="credit-card-form">
          <h5>תשלום אונליין 🔒</h5>

          <label>שם מלא</label>
          <input type="text" />

          <label>טלפון</label>
          <input type="tel" />

          <label>אימייל</label>
          <input type="email" />

          <label>מספר כרטיס</label>
          <input type="text" placeholder="1234 5678 9012 3456" />

          <label>תוקף</label>
          <input type="text" placeholder="MM/YY" />

          <label>CVV</label>
          <input type="text" placeholder="123" />

          <button className="pay-btn">💳 בצע תשלום</button>

          <div className="action-buttons">
            <button onClick={() => setShowCreditForm(false)}>⬅ חזרה</button>
          </div>
        </div>
      )}

      {method === "phone" && showPhoneForm && (
        <div className="credit-card-form">
          <h5>📞 נא מלא את פרטיך ונחזור אליך</h5>

          <label>שם מלא</label>
          <input
            type="text"
            value={phoneName}
            onChange={(e) => setPhoneName(e.target.value)}
          />

          <label>טלפון</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <label>אימייל</label>
          <input
            type="email"
            value={phoneEmail}
            onChange={(e) => setPhoneEmail(e.target.value)}
          />

          <button
            className="pay-btn"
            onClick={() => {
              const data = {
                name: phoneName,
                phone: phoneNumber,
                email: phoneEmail,
                date: new Date().toLocaleDateString("he-IL"),
                time: "טלפוני",
                service: "שירות ייעוץ",
                duration: 30,
                total: "200 ₪",
                status: "חדש",
                id: Date.now(),
              };

              const existing = JSON.parse(localStorage.getItem("demoAppointments") || "[]");
              const updated = [...existing, data];
              localStorage.setItem("demoAppointments", JSON.stringify(updated));

              const services = JSON.parse(localStorage.getItem("demoServices_calendar") || "[]");
              const exists = services.find((s) => s.name === data.service);
              if (!exists) {
                const updatedServices = [...services, {
                  name: data.service,
                  duration: data.duration,
                  price: data.total
                }];
                localStorage.setItem("demoServices_calendar", JSON.stringify(updatedServices));
              }

              emailjs
                .send(
                  "service_zi1ktm8",
                  "template_ncz077b",
                  {
                    to_name: data.name,
                    to_email: data.email,
                    phone: data.phone,
                    date: data.date,
                    order_items: data.service,
                    total: data.total,
                  },
                  "6r3WLmK-pksdHm7kU"
                )
                .then((res) => {
                  console.log("✅ אימייל נשלח:", res.text);
                  alert("אישור נשלח למייל 🎉");
                  if (onSubmit) onSubmit(data);
                })
                .catch((err) => {
                  console.error("❌ שגיאה בשליחת מייל:", err);
                  alert("אירעה שגיאה בשליחת המייל. בדוק את הקונסולה.");
                });
            }}
          >
            שלח ונחזור אליך
          </button>

          <div className="action-buttons">
            <button onClick={() => setShowPhoneForm(false)}>⬅ חזרה</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPayment;

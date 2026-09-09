import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./AppointmentPayment.css";
import emailjs from "emailjs-com";

const AppointmentPayment = ({ onBack, onSubmit }) => {
  const { t } = useTranslation();
  const [method, setMethod] = useState(null);
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  const [phoneName, setPhoneName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneEmail, setPhoneEmail] = useState("");

  return (
    <div className="appointment-payment">
      <h4>Payment 💳</h4>

      {!showCreditForm && !showPhoneForm && (
        <div className="payment-methods">
          <p>Select your preferred payment method:</p>

          <button
            className={`base-button ${method === "card" ? "selected" : ""}`}
            onClick={() => {
              setMethod("card");
              setShowCreditForm(true);
            }}
          >
            Credit Card Payment 💳
          </button>

          <button
            className={`base-button ${method === "phone" ? "selected" : ""}`}
            onClick={() => {
              setMethod("phone");
              setShowPhoneForm(true);
            }}
          >
            Phone Payment 📞
          </button>

          <div className="action-buttons">
            <button onClick={onBack}>⬅ Back</button>
          </div>
        </div>
      )}

      {method === "card" && showCreditForm && (
        <div className="credit-card-form">
          <h5>Online Payment 🔒</h5>

          <label>Full Name</label>
          <input type="text" />

          <label>Phone</label>
          <input type="tel" />

          <label>Email</label>
          <input type="email" />

          <label>Card Number</label>
          <input type="text" placeholder="1234 5678 9012 3456" />

          <label>Expiry Date</label>
          <input type="text" placeholder="MM/YY" />

          <label>CVV</label>
          <input type="text" placeholder="123" />

          <button className="pay-btn">💳 Make Payment</button>

          <div className="action-buttons">
            <button onClick={() => setShowCreditForm(false)}>⬅ Back</button>
          </div>
        </div>
      )}

      {method === "phone" && showPhoneForm && (
        <div className="credit-card-form">
          <h5>📞 Fill in your details and we will call you</h5>

          <label>Full Name</label>
          <input
            type="text"
            value={phoneName}
            onChange={(e) => setPhoneName(e.target.value)}
          />

          <label>Phone</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <label>Email</label>
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
                date: new Date().toLocaleDateString("en-CA"),
                time: "Phone",
                service: "Consultation Service",
                duration: 30,
                total: "$200",
                status: "New",
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
                  console.log("✅ Email sent:", res.text);
                  alert(t("leftover.payment.confirmSent"));
                  if (onSubmit) onSubmit(data);
                })
                .catch((err) => {
                  console.error("❌ Email sending error:", err);
                  alert(t("leftover.payment.emailSendError"));
                });
            }}
          >
            Send and We Will Call You
          </button>

          <div className="action-buttons">
            <button onClick={() => setShowPhoneForm(false)}>⬅ Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPayment;

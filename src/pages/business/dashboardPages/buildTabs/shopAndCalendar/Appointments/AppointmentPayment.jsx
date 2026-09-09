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
      <h4>{t("leftover.paymentFormChrome.paymentTitle")} 💳</h4>

      {!showCreditForm && !showPhoneForm && (
        <div className="payment-methods">
          <p>{t("leftover.paymentFormChrome.selectMethod")}</p>

          <button
            className={`base-button ${method === "card" ? "selected" : ""}`}
            onClick={() => {
              setMethod("card");
              setShowCreditForm(true);
            }}
          >
            {t("leftover.paymentFormChrome.creditCardPayment")} 💳
          </button>

          <button
            className={`base-button ${method === "phone" ? "selected" : ""}`}
            onClick={() => {
              setMethod("phone");
              setShowPhoneForm(true);
            }}
          >
            {t("leftover.paymentFormChrome.phonePayment")} 📞
          </button>

          <div className="action-buttons">
            <button onClick={onBack}>⬅ {t("leftover.paymentFormChrome.back")}</button>
          </div>
        </div>
      )}

      {method === "card" && showCreditForm && (
        <div className="credit-card-form">
          <h5>{t("leftover.paymentFormChrome.onlinePayment")} 🔒</h5>

          <label>{t("leftover.paymentFormChrome.fullName")}</label>
          <input type="text" />

          <label>{t("leftover.paymentFormChrome.phone")}</label>
          <input type="tel" />

          <label>{t("leftover.paymentFormChrome.email")}</label>
          <input type="email" />

          <label>{t("leftover.paymentFormChrome.cardNumber")}</label>
          <input type="text" placeholder="1234 5678 9012 3456" />

          <label>{t("leftover.paymentFormChrome.expiryDate")}</label>
          <input type="text" placeholder="MM/YY" />

          <label>{t("leftover.paymentFormChrome.cvv")}</label>
          <input type="text" placeholder="123" />

          <button className="pay-btn">💳 {t("leftover.paymentFormChrome.makePayment")}</button>

          <div className="action-buttons">
            <button onClick={() => setShowCreditForm(false)}>⬅ {t("leftover.paymentFormChrome.back")}</button>
          </div>
        </div>
      )}

      {method === "phone" && showPhoneForm && (
        <div className="credit-card-form">
          <h5>📞 {t("leftover.paymentFormChrome.phonePayTitle")}</h5>

          <label>{t("leftover.paymentFormChrome.fullName")}</label>
          <input
            type="text"
            value={phoneName}
            onChange={(e) => setPhoneName(e.target.value)}
          />

          <label>{t("leftover.paymentFormChrome.phone")}</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <label>{t("leftover.paymentFormChrome.email")}</label>
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
                time: t("leftover.paymentFormChrome.phoneTimeLabel"),
                service: t("leftover.paymentFormChrome.consultationService"),
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
            {t("leftover.paymentFormChrome.sendAndCall")}
          </button>

          <div className="action-buttons">
            <button onClick={() => setShowPhoneForm(false)}>⬅ {t("leftover.paymentFormChrome.back")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPayment;

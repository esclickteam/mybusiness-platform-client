import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import './PaymentSection.css';

const PaymentSection = ({ paymentMethod, onBack, cart = [], business }) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod !== 'both' ? paymentMethod : null);
  const [submitted, setSubmitted] = useState(false);
  const [customer, setCustomer] = useState({
    name: '', phone: '', email: '', address: '', cardNumber: '', expDate: '', cvv: ''
  });

  const handleBack = () => {
    if (submitted) {
      setSubmitted(false);
      setCustomer({ name: '', phone: '', email: '', address: '', cardNumber: '', expDate: '', cvv: '' });
    } else if (paymentMethod === 'both' && selectedMethod) {
      setSelectedMethod(null);
    } else {
      onBack();
    }
  };

  const generateOrderItemsHtml = () => {
    return cart.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$ ${item.price * item.quantity}</td>
      </tr>
    `).join('');
  };

  const calculateTotal = () => {
    const base = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = business?.shippingType === 'paid' ? Number(business.shippingCost || 0) : 0;
    return base + shippingCost;
  };

  const handleSendEmail = async () => {
    if (!customer.name || !customer.phone || !customer.email) {
      alert(t('leftover.payment.fillRequired'));
      return;
    }

    const total = calculateTotal();

    const templateParams = {
      to_name: customer.name,
      to_email: customer.email,
      phone: customer.phone,
      total: `${total.toFixed(2)} $`,
      date: new Date().toLocaleString('en-IL'),
      payment_note: selectedMethod === 'phone'
        ? t("leftover.paymentFormChrome.phoneContactNote")
        : t("leftover.paymentFormChrome.paymentReceivedNote"),
      order_items: generateOrderItemsHtml(),
      business_name: business?.name || t("leftover.paymentFormChrome.yourBusiness"),
      address: customer.address || t("leftover.paymentFormChrome.notProvided")
    };

    try {
      await emailjs.send(
        'service_zi1ktm8',
        'template_ncz077b',
        templateParams,
        '6r3WLMk-pksdHm7kU'
      );
      console.log("📧 Email sent to customer!");
    } catch (error) {
      console.error("Error sending email:", error);
    }

    setSubmitted(true);
  };

  const sharedFields = (
    <>
      <div className="form-row">
        <label>{t("leftover.paymentFormChrome.fullName")}</label>
        <input
          type="text"
          className="form-input"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        />
      </div>
      <div className="form-row">
        <label>{t("leftover.paymentFormChrome.phone")}</label>
        <input
          type="tel"
          className="form-input"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        />
      </div>
      <div className="form-row">
        <label>{t("leftover.paymentFormChrome.email")}</label>
        <input
          type="email"
          className="form-input"
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
        />
      </div>
      <div className="form-row">
        <label>{t("leftover.paymentFormChrome.shippingAddress")}</label>
        <input
          type="text"
          className="form-input"
          value={customer.address}
          onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
        />
      </div>
    </>
  );

  const renderContent = () => {
    if (submitted) {
      return (
        <div className="payment-box">
          <h3>✅ {t("leftover.paymentFormChrome.thankYou", { name: customer.name })}</h3>
          <p>{t("leftover.paymentFormChrome.business")} <strong>{business?.name || t("leftover.paymentFormChrome.yourBusiness")}</strong></p>
          <p>{t("leftover.paymentFormChrome.confirmationSent")} <strong>{customer.email}</strong></p>
          <p>{t("leftover.paymentFormChrome.phone")}: <strong>{customer.phone}</strong></p>
          <p>{t("leftover.paymentFormChrome.address")} <strong>{customer.address}</strong></p>
          <p>{t("leftover.paymentFormChrome.totalAmount")} <strong>{calculateTotal().toFixed(2)} $</strong></p>
        </div>
      );
    }

    if (selectedMethod === 'online') {
      return (
        <div className="payment-box">
          <p>🔐 {t("leftover.paymentFormChrome.onlinePayment")}</p>
          {sharedFields}
          <div className="form-row">
            <label>{t("leftover.paymentFormChrome.cardNumber")}</label>
            <input
              type="text"
              className="form-input"
              value={customer.cardNumber}
              onChange={(e) => setCustomer({ ...customer, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="form-row">
            <label>{t("leftover.paymentFormChrome.expiryDate")}</label>
            <input
              type="text"
              className="form-input"
              value={customer.expDate}
              onChange={(e) => setCustomer({ ...customer, expDate: e.target.value })}
              placeholder="MM/YY"
            />
          </div>
          <div className="form-row">
            <label>{t("leftover.paymentFormChrome.cvv")}</label>
            <input
              type="text"
              className="form-input"
              value={customer.cvv}
              onChange={(e) => setCustomer({ ...customer, cvv: e.target.value })}
              placeholder="123"
            />
          </div>
          <button className="pay-btn" onClick={handleSendEmail}>{t("leftover.paymentFormChrome.payNow")} 💳</button>
        </div>
      );
    }

    if (selectedMethod === 'phone') {
      return (
        <div className="payment-box">
          <p className="phone-label">📞 Please fill in your details and we will get back to you</p>
          {sharedFields}
          <button className="pay-btn" onClick={handleSendEmail}>Send & We’ll Call You</button>
        </div>
      );
    }

    return (
      <div className="payment-box both-options">
        <p><strong>Select your preferred payment method:</strong> 💳</p>
        <button className="pay-btn" onClick={() => setSelectedMethod('online')}>💳 Online Payment</button>
        <button className="pay-btn" onClick={() => setSelectedMethod('phone')}>📞 Phone Payment</button>
      </div>
    );
  };

  return (
    <div className="payment-section">
      <h2>💳 Payment</h2>
      {renderContent()}
      <button className="back-btn" onClick={handleBack}>⬅️ Back</button>
    </div>
  );
};

export default PaymentSection;

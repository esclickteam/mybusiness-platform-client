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
        ? "We will contact you to complete your payment by phone."
        : "Your payment has been received, and we are processing your order.",
      order_items: generateOrderItemsHtml(),
      business_name: business?.name || "Your Business",
      address: customer.address || "Not provided"
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
        <label>Full Name</label>
        <input
          type="text"
          className="form-input"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        />
      </div>
      <div className="form-row">
        <label>Phone</label>
        <input
          type="tel"
          className="form-input"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        />
      </div>
      <div className="form-row">
        <label>Email</label>
        <input
          type="email"
          className="form-input"
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
        />
      </div>
      <div className="form-row">
        <label>Shipping Address</label>
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
          <h3>✅ Thank you, {customer.name}!</h3>
          <p>Business: <strong>{business?.name || 'Your Business'}</strong></p>
          <p>Confirmation sent to: <strong>{customer.email}</strong></p>
          <p>Phone: <strong>{customer.phone}</strong></p>
          <p>Address: <strong>{customer.address}</strong></p>
          <p>Total Amount: <strong>{calculateTotal().toFixed(2)} $</strong></p>
        </div>
      );
    }

    if (selectedMethod === 'online') {
      return (
        <div className="payment-box">
          <p>🔐 Online Payment</p>
          {sharedFields}
          <div className="form-row">
            <label>Card Number</label>
            <input
              type="text"
              className="form-input"
              value={customer.cardNumber}
              onChange={(e) => setCustomer({ ...customer, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="form-row">
            <label>Expiry Date</label>
            <input
              type="text"
              className="form-input"
              value={customer.expDate}
              onChange={(e) => setCustomer({ ...customer, expDate: e.target.value })}
              placeholder="MM/YY"
            />
          </div>
          <div className="form-row">
            <label>CVV</label>
            <input
              type="text"
              className="form-input"
              value={customer.cvv}
              onChange={(e) => setCustomer({ ...customer, cvv: e.target.value })}
              placeholder="123"
            />
          </div>
          <button className="pay-btn" onClick={handleSendEmail}>Pay Now 💳</button>
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

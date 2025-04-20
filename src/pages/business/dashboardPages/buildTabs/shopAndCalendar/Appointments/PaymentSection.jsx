import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './PaymentSection.css';

const PaymentSection = ({ paymentMethod, onBack, cart = [], business }) => {
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
        <td>₪ ${item.price * item.quantity}</td>
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
      alert('נא למלא את כל הפרטים כולל אימייל');
      return;
    }

    const total = calculateTotal();

    const templateParams = {
      to_name: customer.name,
      to_email: customer.email,
      phone: customer.phone,
      total: `${total.toFixed(2)} ₪`,
      date: new Date().toLocaleString('he-IL'),
      payment_note: selectedMethod === 'phone'
        ? "ניצור איתך קשר להשלמת התשלום בטלפון"
        : "התשלום נקלט ואנו מטפלים בהזמנה שלך",
      order_items: generateOrderItemsHtml(),
      business_name: business?.name || "העסק שלך",
      address: customer.address || "לא נמסרה"
    };

    try {
      await emailjs.send(
        'service_zi1ktm8',
        'template_ncz077b',
        templateParams,
        '6r3WLMk-pksdHm7kU'
      );
      console.log("📧 מייל נשלח ללקוח!");
    } catch (error) {
      console.error("שגיאה בשליחת מייל:", error);
    }

    setSubmitted(true);
  };

  const sharedFields = (
    <>
      <div className="form-row">
        <label>שם מלא</label>
        <input type="text" className="form-input" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
      </div>
      <div className="form-row">
        <label>טלפון</label>
        <input type="tel" className="form-input" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
      </div>
      <div className="form-row">
        <label>אימייל</label>
        <input type="email" className="form-input" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
      </div>
      <div className="form-row">
        <label>כתובת למשלוח</label>
        <input type="text" className="form-input" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
      </div>
    </>
  );

  const renderContent = () => {
    if (submitted) {
      return (
        <div className="payment-box">
          <h3>✅ תודה {customer.name}!</h3>
          <p>העסק: <strong>{business?.name || 'העסק שלך'}</strong></p>
          <p>אישור נשלח ל: <strong>{customer.email}</strong></p>
          <p>טלפון: <strong>{customer.phone}</strong></p>
          <p>כתובת: <strong>{customer.address}</strong></p>
          <p>סה״כ לתשלום: <strong>{calculateTotal().toFixed(2)} ₪</strong></p>
        </div>
      );
    }

    if (selectedMethod === 'online') {
      return (
        <div className="payment-box">
          <p>🔐 תשלום אונליין</p>
          {sharedFields}
          <div className="form-row">
            <label>מספר כרטיס</label>
            <input type="text" className="form-input" value={customer.cardNumber} onChange={(e) => setCustomer({ ...customer, cardNumber: e.target.value })} placeholder="1234 5678 9012 3456" />
          </div>
          <div className="form-row">
            <label>תוקף</label>
            <input type="text" className="form-input" value={customer.expDate} onChange={(e) => setCustomer({ ...customer, expDate: e.target.value })} placeholder="MM/YY" />
          </div>
          <div className="form-row">
            <label>CVV</label>
            <input type="text" className="form-input" value={customer.cvv} onChange={(e) => setCustomer({ ...customer, cvv: e.target.value })} placeholder="123" />
          </div>
          <button className="pay-btn" onClick={handleSendEmail}>בצע תשלום 💳</button>
        </div>
      );
    }

    if (selectedMethod === 'phone') {
      return (
        <div className="payment-box">
          <p className="phone-label">📞 נא מלא את פרטיך ונחזור אליך</p>
          {sharedFields}
          <button className="pay-btn" onClick={handleSendEmail}>שלח ונחזור אליך</button>
        </div>
      );
    }

    return (
      <div className="payment-box both-options">
        <p><strong>בחר את שיטת התשלום המועדפת:</strong> 💳</p>
        <button className="pay-btn" onClick={() => setSelectedMethod('online')}>💳 תשלום אונליין</button>
        <button className="pay-btn" onClick={() => setSelectedMethod('phone')}>📞 תשלום טלפוני</button>
      </div>
    );
  };

  return (
    <div className="payment-section">
      <h2>💳 תשלום</h2>
      {renderContent()}
      <button className="back-btn" onClick={handleBack}>⬅️ חזרה</button>
    </div>
  );
};

export default PaymentSection;

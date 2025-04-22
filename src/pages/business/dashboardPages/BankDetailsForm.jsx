// src/pages/business/dashboardPages/components/BankDetailsForm.jsx
import React, { useState } from "react";
import "./BankDetailsForm.css";

const BankDetailsForm = () => {
  const [form, setForm] = useState({
    bankName: "",
    branchNumber: "",
    accountNumber: "",
    fullName: "",
    idNumber: "",
    receipt: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📤 נתוני חשבון בנק נשלחו:", form);
    alert("הפרטים נשמרו בהצלחה!");
    // כאן תכתבי בעתיד שליחה לשרת
  };

  return (
    <section className="bank-details-form">
      <h2>🏦 פרטי חשבון בנק לקבלת תשלום</h2>
      <p className="disclaimer">
        באחריותך לעדכן את הפרטים במקרה של שינוי. לאחר התשלום, יש לצרף קבלה.
      </p>

      <form onSubmit={handleSubmit}>
        <label>שם הבנק:</label>
        <input
          type="text"
          name="bankName"
          placeholder="בנק הפועלים"
          required
          onChange={handleChange}
        />

        <label>מספר סניף:</label>
        <input
          type="text"
          name="branchNumber"
          placeholder="123"
          required
          onChange={handleChange}
        />

        <label>מספר חשבון:</label>
        <input
          type="text"
          name="accountNumber"
          placeholder="12345678"
          required
          onChange={handleChange}
        />

        <label>שם מלא:</label>
        <input
          type="text"
          name="fullName"
          placeholder="השם כפי שמופיע בבנק"
          required
          onChange={handleChange}
        />

        <label>תעודת זהות / ח.פ:</label>
        <input
          type="text"
          name="idNumber"
          placeholder="302114567"
          required
          onChange={handleChange}
        />

        <label>📎 העלאת קבלה על תשלום:</label>
        <input
          type="file"
          name="receipt"
          accept=".pdf,image/*"
          onChange={handleChange}
        />

        <button type="submit">💾 שמור פרטים</button>
      </form>
    </section>
  );
};

export default BankDetailsForm;
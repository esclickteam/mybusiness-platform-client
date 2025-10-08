import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "@api"; // נניח שה-API מוגדר עם axios
import "./BankDetailsForm.css";

const BankDetailsForm = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    bankName: "",
    branchNumber: "",
    accountNumber: "",
    fullName: "",
    idNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        bankName: user.bankName || "",
        branchNumber: user.branch || "",
        accountNumber: user.account || "",
        fullName: user.fullName || "",
        idNumber: user.idNumber || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("פרטי העסק אינם זמינים. יש להתחבר מחדש.");
      }

      const formData = new FormData();
      formData.append("bankName", form.bankName);
      formData.append("branch", form.branchNumber);
      formData.append("account", form.accountNumber);
      formData.append("fullName", form.fullName);
      formData.append("idNumber", form.idNumber);

      const response = await API.put("/business/my/bank-details", formData);

      if (response.status !== 200) {
        throw new Error("שגיאה בשמירת הפרטים");
      }

      alert("הפרטים נשמרו בהצלחה!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bank-details-form">
      <h2>🏦 פרטי חשבון בנק לקבלת תשלום</h2>
      <p className="disclaimer">
        באחריותך לעדכן את הפרטים במקרה של שינוי.
      </p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="bankName">שם הבנק:</label>
        <input
          type="text"
          id="bankName"
          name="bankName"
          placeholder="בנק הפועלים"
          required
          value={form.bankName}
          onChange={handleChange}
        />

        <label htmlFor="branchNumber">מספר סניף:</label>
        <input
          type="text"
          id="branchNumber"
          name="branchNumber"
          placeholder="123"
          required
          value={form.branchNumber}
          onChange={handleChange}
        />

        <label htmlFor="accountNumber">מספר חשבון:</label>
        <input
          type="text"
          id="accountNumber"
          name="accountNumber"
          placeholder="12345678"
          required
          value={form.accountNumber}
          onChange={handleChange}
        />

        <label htmlFor="fullName">שם מלא:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="השם כפי שמופיע בבנק"
          required
          value={form.fullName}
          onChange={handleChange}
        />

        <label htmlFor="idNumber">תעודת זהות / ח.פ:</label>
        <input
          type="text"
          id="idNumber"
          name="idNumber"
          placeholder="302114567"
          required
          value={form.idNumber}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "שומר..." : "💾 שמור פרטים"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  );
};

export default BankDetailsForm;

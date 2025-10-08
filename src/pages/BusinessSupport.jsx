import React, { useState } from "react";
import { useForm } from "@formspree/react";

import "../styles/business-support.css";

export default function BusinessSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",              // הוסף שדה טלפון כאן
    issueDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [state, handleSubmit] = useForm("mwpoojlv");

  if (state.succeeded) {
    return <p className="status-msg success">הפנייה נשלחה בהצלחה!</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { name, email, phone, issueDescription } = formData;

    if (!name || !email || !phone || !issueDescription) {
      setStatus({ type: "error", message: "אנא מלא את כל השדות כולל טלפון" });
      return;
    }

    setLoading(true);

    try {
      await handleSubmit(e);
      setStatus({ type: "success", message: "הפנייה נשלחה בהצלחה" });
      setFormData({ name: "", email: "", phone: "", issueDescription: "" });
    } catch (err) {
      console.error("שגיאה:", err);
      setStatus({ type: "error", message: "שגיאה בשליחה" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page">
      <h1>תמיכה לעסקים</h1>

      <form onSubmit={handleFormSubmit}>
        <label>שמך:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="הכנס את שמך"
        />

        <label>אימייל ליצירת קשר:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="הכנס את המייל שלך"
        />

        <label>טלפון ליצירת קשר:</label>  {/* שדה הטלפון */}
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="הכנס את הטלפון שלך"
        />

        <label>תיאור הבעיה:</label>
        <textarea
          name="issueDescription"
          value={formData.issueDescription}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="תאר את הבעיה"
        />

        <button type="submit" disabled={loading}>
          {loading ? "שולח..." : "שלח פנייה"}
        </button>
      </form>

      {status && (
        <div
          className={`status-msg ${status.type}`}
          data-icon={status.type === "success" ? "✅" : "❌"}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}

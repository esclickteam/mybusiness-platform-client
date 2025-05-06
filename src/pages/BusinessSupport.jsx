import React, { useState } from "react";
import { useForm, ValidationError } from "@formspree/react"; // יבוא של Formspree

import "../styles/business-support.css";

export default function BusinessSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // חיבור ל-Formspree עם המזהה שלך "mwpoojlv"
  const [state, handleSubmit] = useForm("mwpoojlv"); // השתמש במזהה Formspree שלך

  // במידה והטופס נשלח בהצלחה
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

    const { name, email, issueDescription } = formData;
    if (!name || !email || !issueDescription) {
      setStatus({ type: "error", message: "אנא מלא את כל השדות" });
      return;
    }

    setLoading(true);

    try {
      // שליחה ל-Formspree
      await handleSubmit(e); // Formspree כבר מטפל בשליחה

      setStatus({ type: "success", message: "הפנייה נשלחה בהצלחה" });
      setFormData({ name: "", email: "", issueDescription: "" });
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
          placeholder="הכנס את אימיילך"
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

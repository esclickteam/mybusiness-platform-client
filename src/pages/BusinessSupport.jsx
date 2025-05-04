import React, { useState } from "react";
import "../styles/business-support.css";

export default function BusinessSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { name, email, issueDescription } = formData;
    if (!name || !email || !issueDescription) {
      setStatus({ type: "error", message: "אנא מלא את כל השדות" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, issueDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "שגיאה כללית");
      }

      setStatus({ type: "success", message: data.message || "הפנייה נשלחה בהצלחה" });
      setFormData({ name: "", email: "", issueDescription: "" });
    } catch (err) {
      console.error("שגיאה:", err);
      setStatus({ type: "error", message: err.message || "שגיאה בשליחה" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page">
      <h1>תמיכה לעסקים</h1>

      <form onSubmit={handleSubmit}>
        <label>שמך:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          disabled={loading}
        />

        <label>אימייל ליצירת קשר:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
        />

        <label>תיאור הבעיה:</label>
        <textarea
          name="issueDescription"
          value={formData.issueDescription}
          onChange={handleInputChange}
          disabled={loading}
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

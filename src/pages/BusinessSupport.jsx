import React, { useState } from "react";
import "../styles/business-support.css";

export default function BusinessSupport() {
  const [formData, setFormData] = useState({
    name: '',
    issueDescription: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.issueDescription) {
      alert("אנא מלא את כל השדות");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("השרת החזיר תגובה לא תקינה (לא JSON)");
      }

      if (!res.ok) {
        throw new Error(data.message || "שגיאה כללית");
      }

      alert(data.message || "✅ הפנייה נשלחה בהצלחה");
      setFormData({ name: '', issueDescription: '' });

    } catch (err) {
      console.error("שגיאה:", err);
      alert("❌ שגיאה: " + err.message);
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
          required
          disabled={loading}
        />

        <label>תיאור הבעיה:</label>
        <textarea
          name="issueDescription"
          value={formData.issueDescription}
          onChange={handleInputChange}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "שולח..." : "שלח פנייה"}
        </button>
      </form>
    </div>
  );
}

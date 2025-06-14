import React, { useState, useEffect } from "react";
import API from "../../../../api";

export default function ProposalForm({ fromBusinessId, toBusiness, onClose, onSent }) {
  const [formData, setFormData] = useState({
    fromBusinessId: fromBusinessId || "",
    toBusinessId: toBusiness?._id || "",
    title: "",
    description: "",
    amount: "",
    validUntil: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (toBusiness?._id) {
      setFormData((prev) => ({ ...prev, toBusinessId: toBusiness._id }));
    }
  }, [toBusiness]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const res = await API.post("/proposals", formData);
      if (res.status === 200 || res.status === 201) {
        setSuccessMessage("ההצעה נשלחה בהצלחה!");
        setFormData(prev => ({
          ...prev,
          title: "",
          description: "",
          amount: "",
          validUntil: "",
        }));
        onSent();
        onClose();
      } else {
        setError("שליחה נכשלה, נסה שוב.");
      }
    } catch (err) {
      setError("שגיאה בשליחה: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "auto" }}>
      <h2>טופס הצעה בין עסק לעסק</h2>

      <label>
        עסק שולח (מאת):
        <input
          type="text"
          name="fromBusinessId"
          value={formData.fromBusinessId}
          disabled
          readOnly
        />
      </label>

      <label>
        עסק מקבל (אל):
        <input
          type="text"
          name="toBusinessId"
          value={formData.toBusinessId}
          disabled
          readOnly
        />
      </label>

      <label>
        כותרת הצעה:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="לדוגמה: שיתוף פעולה לקידום משותף"
          required
        />
      </label>

      <label>
        תיאור הצעה:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="פרט את ההצעה בצורה מפורטת"
          rows={5}
          required
        />
      </label>

      <label>
        סכום (אם רלוונטי):
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="סכום הצעה (בחר אם יש)"
          min="0"
          step="0.01"
        />
      </label>

      <label>
        תאריך תוקף:
        <input
          type="date"
          name="validUntil"
          value={formData.validUntil}
          onChange={handleChange}
          required
        />
      </label>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "שולח..." : "שלח הצעה"}
      </button>
    </form>
  );
}

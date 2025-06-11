import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "@api";

export default function CreateAgreementForm({ onCreated }) {
  const [formData, setFormData] = useState({
    partnerBusinessName: "", // שם העסק השותף במקום מזהה
    title: "",
    description: "",
    terms: "",
    paymentDetails: "",
    startDate: "",
    endDate: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const sigPadRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearSignature = () => sigPadRef.current?.clear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.partnerBusinessName.trim()) {
      setError("יש להזין שם עסק שותף.");
      return;
    }

    setSending(true);

    try {
      const signatureDataUrl = sigPadRef.current.isEmpty()
        ? ""
        : sigPadRef.current.getTrimmedCanvas().toDataURL();

      const res = await API.post("/partnershipAgreements", {
        ...formData,
        signatureDataUrl,
      });

      alert("ההסכם נוצר ונשלח לחתימה של הצד השני!");
      if (onCreated) onCreated(res.data);
    } catch (err) {
      setError("שגיאה ביצירת ההסכם: " + (err.response?.data?.message || err.message));
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 600, margin: "auto", direction: "rtl", fontFamily: "Arial, sans-serif" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>צור הסכם שיתוף פעולה חדש</h2>

      <label>
        שם העסק השותף:
        <input
          type="text"
          name="partnerBusinessName"
          value={formData.partnerBusinessName}
          onChange={handleChange}
          required
          style={inputStyle}
          placeholder="הזן שם עסק שותף"
        />
      </label>

      <label>
        כותרת ההסכם:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={inputStyle}
          placeholder="כותרת ההסכם"
        />
      </label>

      <label>
        תיאור ההסכם:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          style={textareaStyle}
          placeholder="תיאור ההסכם"
          rows={4}
        />
      </label>

      <label>
        תנאים:
        <textarea
          name="terms"
          value={formData.terms}
          onChange={handleChange}
          style={textareaStyle}
          placeholder="תנאי ההסכם (אופציונלי)"
          rows={3}
        />
      </label>

      <label>
        פרטי תשלום:
        <input
          type="text"
          name="paymentDetails"
          value={formData.paymentDetails}
          onChange={handleChange}
          style={inputStyle}
          placeholder="פרטי תשלום (אופציונלי)"
        />
      </label>

      <label>
        תאריך התחלה:
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label>
        תאריך סיום:
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <div style={{ marginTop: 20 }}>
        <label>חתימה ראשונית (אופציונלי):</label>
        <SignatureCanvas
          ref={sigPadRef}
          penColor="black"
          canvasProps={{
            width: 400,
            height: 150,
            style: { border: "1px solid #ccc", borderRadius: 4, backgroundColor: "#fff" },
          }}
        />
        <button type="button" onClick={clearSignature} style={{ marginTop: 6 }}>
          נקה חתימה
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      <button
        type="submit"
        disabled={sending}
        style={{
          marginTop: 20,
          backgroundColor: "#5a59d6",
          color: "white",
          border: "none",
          borderRadius: 6,
          padding: "10px 20px",
          fontWeight: "bold",
          cursor: sending ? "not-allowed" : "pointer",
          opacity: sending ? 0.7 : 1,
        }}
      >
        {sending ? "שולח..." : "צור הסכם"}
      </button>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "6px",
  marginBottom: "16px",
  borderRadius: "6px",
  border: "1.5px solid #ccc",
  fontSize: "16px",
  fontFamily: "'Arial', sans-serif",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "60px",
};

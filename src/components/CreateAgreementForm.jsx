import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "@api";

export default function CreateAgreementForm({ onCreated }) {
  const [formData, setFormData] = useState({
    partnerBusinessName: "", // שם העסק השותף במקום מזהה
    title: "",
    description: "",
    giving: "",
    receiving: "",
    type: "",
    payment: "",
    startDate: "",
    endDate: "",
    cancelAnytime: false,
    confidentiality: false,
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const sigPadRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      // אם מסמנים ביטול בכל שלב - נקה תאריכים
      if (name === "cancelAnytime" && checked) {
        setFormData((prev) => ({ ...prev, startDate: "", endDate: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const clearSignature = () => sigPadRef.current?.clear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.partnerBusinessName.trim()) {
      setError("יש להזין שם עסק שותף.");
      return;
    }
    if (!formData.title.trim()) {
      setError("יש להזין כותרת הסכם.");
      return;
    }
    if (!formData.description.trim()) {
      setError("נא למלא תיאור הסכם.");
      return;
    }
    if (!formData.giving.trim()) {
      setError("נא למלא מה תספק במסגרת ההסכם.");
      return;
    }
    if (!formData.receiving.trim()) {
      setError("נא למלא מה תקבל במסגרת ההסכם.");
      return;
    }
    if (!formData.type) {
      setError("נא לבחור סוג שיתוף פעולה.");
      return;
    }
    if (!formData.cancelAnytime && (!formData.startDate || !formData.endDate)) {
      setError("נא למלא תאריכי התחלה וסיום או לבחור 'ניתן לבטל בכל שלב'.");
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
        מה תספק במסגרת ההסכם:
        <textarea
          name="giving"
          value={formData.giving}
          onChange={handleChange}
          required
          style={textareaStyle}
          rows={2}
          placeholder="מה תספק במסגרת ההסכם"
        />
      </label>

      <label>
        מה תקבל במסגרת ההסכם:
        <textarea
          name="receiving"
          value={formData.receiving}
          onChange={handleChange}
          required
          style={textareaStyle}
          rows={2}
          placeholder="מה תקבל במסגרת ההסכם"
        />
      </label>

      <label>
        סוג שיתוף פעולה:
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">בחר סוג</option>
          <option value="חד צדדי">חד צדדי</option>
          <option value="דו צדדי">דו צדדי</option>
          <option value="עם עמלות">עם עמלות</option>
        </select>
      </label>

      <label>
        עמלות / תשלום (אם יש):
        <input
          type="text"
          name="payment"
          value={formData.payment}
          onChange={handleChange}
          style={inputStyle}
          placeholder="עמלות / תשלום"
        />
      </label>

      <label>תוקף ההסכם:</label>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          disabled={formData.cancelAnytime}
          style={inputStyle}
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          disabled={formData.cancelAnytime}
          style={inputStyle}
        />
      </div>

      <label style={{ display: "block", marginBottom: 16 }}>
        <input
          type="checkbox"
          name="cancelAnytime"
          checked={formData.cancelAnytime}
          onChange={handleChange}
        />
        ניתן לבטל את ההסכם בכל שלב
      </label>

      <label style={{ display: "block", marginBottom: 20 }}>
        <input
          type="checkbox"
          name="confidentiality"
          checked={formData.confidentiality}
          onChange={handleChange}
        />
        סעיף סודיות
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

import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "@api";
import "./CreateAgreementForm.css"; // <-- הוספת ייבוא CSS

export default function CreateAgreementForm({ onCreated }) {
  const [formData, setFormData] = useState({
    partnerBusinessName: "",
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
      className="create-agreement-form"
      dir="rtl"
    >
      <h2 className="form-title">צור הסכם שיתוף פעולה חדש</h2>

      <label>
        שם העסק השותף:
        <input
          type="text"
          name="partnerBusinessName"
          value={formData.partnerBusinessName}
          onChange={handleChange}
          required
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
          rows={4}
          placeholder="תיאור ההסכם"
        />
      </label>

      <label>
        מה תספק במסגרת ההסכם:
        <textarea
          name="giving"
          value={formData.giving}
          onChange={handleChange}
          required
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
          placeholder="עמלות / תשלום"
        />
      </label>

      <label>תוקף ההסכם:</label>
      <div className="date-inputs">
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          disabled={formData.cancelAnytime}
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          disabled={formData.cancelAnytime}
        />
      </div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="cancelAnytime"
          checked={formData.cancelAnytime}
          onChange={handleChange}
        />
        ניתן לבטל את ההסכם בכל שלב
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="confidentiality"
          checked={formData.confidentiality}
          onChange={handleChange}
        />
        סעיף סודיות
      </label>

      <div className="signature-container">
        <label>חתימה ראשונית (אופציונלי):</label>
        <SignatureCanvas
          ref={sigPadRef}
          penColor="black"
          canvasProps={{
            className: "sigCanvas",
            width: 400,
            height: 150,
          }}
        />
        <button type="button" onClick={clearSignature} className="clear-signature-btn">
          נקה חתימה
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" disabled={sending} className="submit-btn">
        {sending ? "שולח..." : "צור הסכם"}
      </button>
    </form>
  );
}

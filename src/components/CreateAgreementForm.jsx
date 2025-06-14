import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "@api";
import "./CreateAgreementForm.css";

export default function CreateAgreementForm({ onCreated, fromBusinessId, fromBusinessName, partnerBusiness }) {
  const [formData, setFormData] = useState({
    fromBusinessName: fromBusinessName || "",
    partnerBusinessName: partnerBusiness?.businessName || "",
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

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fromBusinessName: fromBusinessName || "",
      partnerBusinessName: partnerBusiness?.businessName || "",
    }));
  }, [fromBusinessName, partnerBusiness]);

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
    if (!fromBusinessId) {
      setError("מזהה העסק השולח אינו תקין.");
      return;
    }
    if (!partnerBusiness?._id) {
      setError("מזהה העסק השותף אינו תקין.");
      return;
    }

    setSending(true);

    try {
      const signatureDataUrl = sigPadRef.current.isEmpty()
        ? ""
        : sigPadRef.current.getTrimmedCanvas().toDataURL();

      const payload = {
        ...formData,
        fromBusinessId,
        partnerBusinessId: partnerBusiness._id,
        signatureDataUrl,
      };

      console.log("Sending partnership agreement payload:", payload);

      const res = await API.post("/partnershipAgreements", payload);

      alert("ההסכם נוצר ונשלח לחתימה של הצד השני!");
      if (onCreated) onCreated(res.data);
    } catch (err) {
      setError("שגיאה ביצירת ההסכם: " + (err.response?.data?.message || err.message));
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-agreement-form" dir="rtl">
      <h2 className="form-title">הסכם שיתוף פעולה</h2>

      <label>
        שם העסק השולח:
        <input type="text" name="fromBusinessName" value={formData.fromBusinessName} disabled className="form-input" />
      </label>

      <label>
        שם העסק השותף:
        <input type="text" name="partnerBusinessName" value={formData.partnerBusinessName} disabled className="form-input" />
      </label>

      <label>
        כותרת ההסכם:
        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="כותרת ההסכם" className="form-input" />
      </label>

      <label>
        תיאור ההסכם:
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="תיאור ההסכם" className="form-textarea" />
      </label>

      <label>
        מה תספק במסגרת ההסכם:
        <textarea name="giving" value={formData.giving} onChange={handleChange} required rows={2} placeholder="מה תספק במסגרת ההסכם" className="form-textarea" />
      </label>

      <label>
        מה תקבל במסגרת ההסכם:
        <textarea name="receiving" value={formData.receiving} onChange={handleChange} required rows={2} placeholder="מה תקבל במסגרת ההסכם" className="form-textarea" />
      </label>

      <label>
        סוג שיתוף פעולה:
        <select name="type" value={formData.type} onChange={handleChange} required className="form-input">
          <option value="">בחר סוג</option>
          <option value="חד צדדי">חד צדדי</option>
          <option value="דו צדדי">דו צדדי</option>
          <option value="עם עמלות">עם עמלות</option>
        </select>
      </label>

      <label>
        עמלות / תשלום (אם יש):
        <input type="text" name="payment" value={formData.payment} onChange={handleChange} placeholder="עמלות / תשלום" className="form-input" />
      </label>

      <label>תוקף ההסכם:</label>
      <div className="date-inputs">
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} disabled={formData.cancelAnytime} className="form-input" />
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} disabled={formData.cancelAnytime} className="form-input" />
      </div>

      <label className="checkbox-label">
        <input type="checkbox" name="cancelAnytime" checked={formData.cancelAnytime} onChange={handleChange} />
        ניתן לבטל את ההסכם בכל שלב
      </label>

      <label className="checkbox-label">
        <input type="checkbox" name="confidentiality" checked={formData.confidentiality} onChange={handleChange} />
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

import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

const partnershipAgreementFormInitial = {
  yourBusinessName: "",
  partnerBusinessName: "",
  agreementTitle: "",
  partnershipDescription: "",
  agreementSupplies: "",
  agreementBenefits: "",
  partnershipType: "",
  commissionOrPayment: "",
  agreementStartDate: "",
  agreementEndDate: "",
  cancellableAtAnyStage: false,
  confidentialityClause: false,
  senderSignature: "",
  receiverSignature: "",
};

export default function PartnershipAgreementForm({ isSender = true, onSubmit }) {
  const [formData, setFormData] = useState(partnershipAgreementFormInitial);

  const senderSigPadRef = useRef(null);
  const receiverSigPadRef = useRef(null);

  useEffect(() => {
    if (formData.senderSignature && senderSigPadRef.current) {
      senderSigPadRef.current.fromDataURL(formData.senderSignature);
    }
    if (formData.receiverSignature && receiverSigPadRef.current) {
      receiverSigPadRef.current.fromDataURL(formData.receiverSignature);
    }
  }, [formData.senderSignature, formData.receiverSignature]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveSenderSignature = () => {
    if (senderSigPadRef.current) {
      const dataURL = senderSigPadRef.current.toDataURL();
      setFormData((prev) => ({ ...prev, senderSignature: dataURL }));
    }
  };

  const saveReceiverSignature = () => {
    if (receiverSigPadRef.current) {
      const dataURL = receiverSigPadRef.current.toDataURL();
      setFormData((prev) => ({ ...prev, receiverSignature: dataURL }));
    }
  };

  const clearSenderSignature = () => {
    if (senderSigPadRef.current) {
      senderSigPadRef.current.clear();
      setFormData((prev) => ({ ...prev, senderSignature: "" }));
    }
  };

  const clearReceiverSignature = () => {
    if (receiverSigPadRef.current) {
      receiverSigPadRef.current.clear();
      setFormData((prev) => ({ ...prev, receiverSignature: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // אם זה השולח, נשלח את ההסכם רק עם החתימה שלו
    if (isSender) {
      if (!formData.senderSignature) {
        alert("השולח חייב לחתום!");
        return;
      }
      alert("ההסכם נשלח למקבל לחתימה!");
      onSubmit(formData, "pending"); // שליחה למקבל, סטטוס ממתין לחתימה
    } else {
      if (!formData.receiverSignature) {
        alert("המקבל חייב לחתום על ההסכם!");
        return;
      }
      alert("ההסכם הושלם!");
      onSubmit(formData, "approved"); // שליחה שמירה עם סטטוס הושלם
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 700,
        margin: "auto",
        padding: 16,
        fontFamily: "'Arial', sans-serif",
        direction: "rtl",
        textAlign: "right",
        color: "#4a4a9e",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#5a59d6" }}>
        הסכם שיתוף פעולה 🤝
      </h2>

      {/* כל השדות שלך כפי שהיו */}
      <label>
        שם העסק שלך:
        <input
          type="text"
          name="yourBusinessName"
          value={formData.yourBusinessName}
          onChange={handleChange}
          placeholder="הזן שם העסק שלך"
          style={inputStyle}
          required
        />
      </label>

      <label>
        שם העסק השותף:
        <input
          type="text"
          name="partnerBusinessName"
          value={formData.partnerBusinessName}
          onChange={handleChange}
          placeholder="הזן שם העסק השותף"
          style={inputStyle}
          required
        />
      </label>

      <label>
        כותרת ההסכם:
        <input
          type="text"
          name="agreementTitle"
          value={formData.agreementTitle}
          onChange={handleChange}
          placeholder="כותרת ההסכם (למשל: קמפיין קיץ)"
          style={inputStyle}
          required
        />
      </label>

      <label>
        תיאור שיתוף הפעולה:
        <textarea
          name="partnershipDescription"
          value={formData.partnershipDescription}
          onChange={handleChange}
          placeholder="תאר בקצרה את שיתוף הפעולה"
          style={textareaStyle}
          rows={4}
          required
        />
      </label>

      <label>
        מה תספק במסגרת ההסכם:
        <textarea
          name="agreementSupplies"
          value={formData.agreementSupplies}
          onChange={handleChange}
          placeholder="מה תספק במסגרת ההסכם"
          style={textareaStyle}
          rows={3}
        />
      </label>

      <label>
        מה תקבל במסגרת ההסכם:
        <textarea
          name="agreementBenefits"
          value={formData.agreementBenefits}
          onChange={handleChange}
          placeholder="מה תקבל במסגרת ההסכם"
          style={textareaStyle}
          rows={3}
        />
      </label>

      <label>
        סוג שיתוף פעולה:
        <select
          name="partnershipType"
          value={formData.partnershipType}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">בחר סוג</option>
          <option value="jointCampaign">קמפיין משותף</option>
          <option value="referral">הפניות</option>
          <option value="resale">מכירה מחדש</option>
          <option value="other">אחר</option>
        </select>
      </label>

      <label>
        עמלה / תשלום (אם יש):
        <input
          type="text"
          name="commissionOrPayment"
          value={formData.commissionOrPayment}
          onChange={handleChange}
          placeholder="למשל: 10% עמלה"
          style={inputStyle}
        />
      </label>

      <label>
        תוקף ההסכם - תאריך התחלה:
        <input
          type="date"
          name="agreementStartDate"
          value={formData.agreementStartDate}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </label>

      <label>
        תוקף ההסכם - תאריך סיום:
        <input
          type="date"
          name="agreementEndDate"
          value={formData.agreementEndDate}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </label>

      <div style={{ margin: "12px 0" }}>
        <label>
          <input
            type="checkbox"
            name="cancellableAtAnyStage"
            checked={formData.cancellableAtAnyStage}
            onChange={handleChange}
          />
          ניתן לבטל את ההסכם בכל שלב
        </label>
      </div>

      <div style={{ margin: "12px 0" }}>
        <label>
          <input
            type="checkbox"
            name="confidentialityClause"
            checked={formData.confidentialityClause}
            onChange={handleChange}
          />
          סעיף סודיות
        </label>
      </div>

      {/* שדה חתימה של החותם הראשון */}
      <div style={{ marginTop: 20 }}>
        <label>חתימה (של החותם הראשון):</label>
        {isSender ? (
          <>
            <SignatureCanvas
              ref={senderSigPadRef}
              penColor="black"
              canvasProps={{
                width: 400,
                height: 150,
                className: "sigCanvas",
                style: { border: "1px solid #ccc", borderRadius: 5 },
              }}
              onEnd={saveSenderSignature}
            />
            <button type="button" onClick={clearSenderSignature} style={{ marginTop: 5 }}>
              נקה חתימה
            </button>
          </>
        ) : (
          formData.senderSignature ? (
            <img
              src={formData.senderSignature}
              alt="חתימת השולח"
              style={{ border: "1px solid #ccc", borderRadius: 5, width: 400, height: 150 }}
            />
          ) : (
            <p>החותם הראשון עדיין לא חתם</p>
          )
        )}
      </div>

      {/* שדה חתימה של החותם השני */}
      <div style={{ marginTop: 20 }}>
        <label>חתימה (של החותם השני):</label>
        {!isSender ? (
          <>
            <SignatureCanvas
              ref={receiverSigPadRef}
              penColor="black"
              canvasProps={{
                width: 400,
                height: 150,
                className: "sigCanvas",
                style: { border: "1px solid #ccc", borderRadius: 5 },
              }}
              onEnd={saveReceiverSignature}
            />
            <button type="button" onClick={clearReceiverSignature} style={{ marginTop: 5 }}>
              נקה חתימה
            </button>
          </>
        ) : (
          formData.receiverSignature ? (
            <img
              src={formData.receiverSignature}
              alt="חתימת המקבל"
              style={{ border: "1px solid #ccc", borderRadius: 5, width: 400, height: 150 }}
            />
          ) : (
            <p>החותם השני עדיין לא חתם</p>
          )
        )}
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: "#7c5abb",
          color: "white",
          fontWeight: "bold",
          borderRadius: 20,
          border: "none",
          padding: "10px 24px",
          cursor: "pointer",
          marginTop: 16,
        }}
      >
        שלח את ההסכם 📩
      </button>
    </form>
  );
}

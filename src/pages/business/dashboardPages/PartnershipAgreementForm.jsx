import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../../../api";

const partnershipAgreementFormInitial = {
  yourBusinessName: "",
  partnerBusinessName: "",
  toBusinessId: "", // חשוב! מזהה העסק השותף לשליחה
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

export default function PartnershipAgreementForm({ isSender = true, onSubmit, agreementId, token }) {
  const [formData, setFormData] = useState(partnershipAgreementFormInitial);
  const [sending, setSending] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSender && !formData.senderSignature) {
      alert("השולח חייב לחתום!");
      return;
    }
    if (!isSender && !formData.receiverSignature) {
      alert("המקבל חייב לחתום על ההסכם!");
      return;
    }
    if (!formData.toBusinessId) {
      alert("יש לבחור עסק שותף עם מזהה תקין");
      return;
    }

    try {
      setSending(true);
      const tokenToUse = token || localStorage.getItem("token");

      await API.post(
        "/collab-contracts/contract/send",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenToUse}`,
          },
          withCredentials: true,
        }
      );
      alert(isSender ? "ההסכם נשלח למקבל לחתימה!" : "ההסכם הושלם!");
      if (typeof onSubmit === "function") onSubmit(formData, isSender ? "pending" : "approved");
    } catch (err) {
      alert("שגיאה בשליחת ההסכם: " + (err?.response?.data?.error || err.message));
    } finally {
      setSending(false);
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
      <h2 style={{ textAlign: "center", color: "#5a59d6" }}>הסכם שיתוף פעולה 🤝</h2>

      {/* שדות טופס */}
      <label>
        מזהה עסק שותף (toBusinessId):
        <input
          type="text"
          name="toBusinessId"
          value={formData.toBusinessId}
          onChange={handleChange}
          placeholder="הזן מזהה עסק שותף"
          style={inputStyle}
          required
        />
      </label>

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

      {/* חתימות */}
      <div style={{ marginTop: 20 }}>
        <label>חתימה (של החותם הראשון):</label>
        {isSender ? (
          <>
            {formData.senderSignature ? (
              <img
                src={formData.senderSignature}
                alt="חתימת השולח"
                style={{ border: "1px solid #ccc", borderRadius: 5, width: 400, height: 150 }}
              />
            ) : (
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
            )}
          </>
        ) : formData.senderSignature ? (
          <img
            src={formData.senderSignature}
            alt="חתימת השולח"
            style={{ border: "1px solid #ccc", borderRadius: 5, width: 400, height: 150 }}
          />
        ) : (
          <p>החותם הראשון עדיין לא חתם</p>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <label>חתימה (של החותם השני):</label>
        {!isSender ? (
          <>
            {formData.receiverSignature ? (
              <img
                src={formData.receiverSignature}
                alt="חתימת המקבל"
                style={{ border: "1px solid #ccc", borderRadius: 5, width: 400, height: 150 }}
              />
            ) : (
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
            )}
          </>
        ) : formData.receiverSignature ? (
          <img
            src={formData.receiverSignature}
            alt="חתימת המקבל"
            style={{ border: "1px solid #ccc", borderRadius: 5, width: 400, height: 150 }}
          />
        ) : (
          <p>החותם השני עדיין לא חתם</p>
        )}
      </div>

      <button
        type="submit"
        disabled={sending}
        style={{
          backgroundColor: "#7c5abb",
          color: "white",
          fontWeight: "bold",
          borderRadius: 20,
          border: "none",
          padding: "10px 24px",
          cursor: sending ? "not-allowed" : "pointer",
          marginTop: 16,
          opacity: sending ? 0.7 : 1,
        }}
      >
        {sending ? "שולח..." : "שלח את ההסכם 📩"}
      </button>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: 8,
  marginTop: 4,
  marginBottom: 16,
  borderRadius: 10,
  border: "1.5px solid #cec8ff",
  fontSize: 16,
  fontFamily: "'Arial', sans-serif",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 70,
};

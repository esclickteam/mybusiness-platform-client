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

export default function PartnershipAgreementForm({ isSender = true }) {
  const [formData, setFormData] = useState(partnershipAgreementFormInitial);

  // רפרנסים ל־SignatureCanvas
  const senderSigPadRef = useRef(null);
  const receiverSigPadRef = useRef(null);

  // טוען חתימות אם יש (כאן אפשר להרחיב בעת טעינת הנתונים)
  useEffect(() => {
    if (formData.senderSignature && senderSigPadRef.current) {
      senderSigPadRef.current.fromDataURL(formData.senderSignature);
    }
    if (formData.receiverSignature && receiverSigPadRef.current) {
      receiverSigPadRef.current.fromDataURL(formData.receiverSignature);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // שמירת חתימה של השולח
  const saveSenderSignature = () => {
    if (senderSigPadRef.current) {
      const dataURL = senderSigPadRef.current.toDataURL();
      setFormData((prev) => ({ ...prev, senderSignature: dataURL }));
    }
  };

  // שמירת חתימה של המקבל
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
    // כאן תוכל להוסיף קריאה ל-API לשמירת ההסכם
    alert("הסכם שיתוף הפעולה נשמר בהצלחה!");
    console.log("Form Data:", formData);
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

      {/* שדות הטקסט הרגילים */}
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

      {/* ... שדות נוספים כמו קודם ... */}

      {/* חתימה של החותם הראשון */}
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

      {/* חתימה של החותם השני */}
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

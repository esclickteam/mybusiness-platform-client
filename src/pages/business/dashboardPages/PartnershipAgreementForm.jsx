import React, { useState } from "react";

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

export default function PartnershipAgreementForm() {
  const [formData, setFormData] = useState(partnershipAgreementFormInitial);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

      <label>
        חתימה (של החותם הראשון):
        <textarea
          name="senderSignature"
          value={formData.senderSignature}
          onChange={handleChange}
          placeholder="כתוב כאן את חתימתך"
          style={textareaStyle}
          rows={3}
          required
        />
      </label>

      <label>
        חתימה (של החותם השני):
        <textarea
          name="receiverSignature"
          value={formData.receiverSignature}
          onChange={handleChange}
          placeholder="חתימה של השותף"
          style={textareaStyle}
          rows={3}
          required
        />
      </label>

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

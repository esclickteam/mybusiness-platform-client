```javascript
import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../../../api";

const partnershipAgreementFormInitial = {
  yourBusinessName: "",
  partnerBusinessName: "",
  toBusinessId: "", // Important! The partner business ID for sending
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
      alert("The sender must sign!");
      return;
    }
    if (!isSender && !formData.receiverSignature) {
      alert("The receiver must sign the agreement!");
      return;
    }
    if (!formData.toBusinessId) {
      alert("Please select a partner business with a valid ID");
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
      alert(isSender ? "The agreement has been sent to the receiver for signature!" : "The agreement is complete!");
      if (typeof onSubmit === "function") onSubmit(formData, isSender ? "pending" : "approved");
    } catch (err) {
      alert("Error sending the agreement: " + (err?.response?.data?.error || err.message));
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
      <h2 style={{ textAlign: "center", color: "#5a59d6" }}>Partnership Agreement 🤝</h2>

      {/* Form Fields */}
      <label>
        Partner Business ID (toBusinessId):
        <input
          type="text"
          name="toBusinessId"
          value={formData.toBusinessId}
          onChange={handleChange}
          placeholder="Enter partner business ID"
          style={inputStyle}
          required
        />
      </label>

      <label>
        Your Business Name:
        <input
          type="text"
          name="yourBusinessName"
          value={formData.yourBusinessName}
          onChange={handleChange}
          placeholder="Enter your business name"
          style={inputStyle}
          required
        />
      </label>

      <label>
        Partner Business Name:
        <input
          type="text"
          name="partnerBusinessName"
          value={formData.partnerBusinessName}
          onChange={handleChange}
          placeholder="Enter partner business name"
          style={inputStyle}
          required
        />
      </label>

      <label>
        Agreement Title:
        <input
          type="text"
          name="agreementTitle"
          value={formData.agreementTitle}
          onChange={handleChange}
          placeholder="Agreement title (e.g., Summer Campaign)"
          style={inputStyle}
          required
        />
      </label>

      <label>
        Partnership Description:
        <textarea
          name="partnershipDescription"
          value={formData.partnershipDescription}
          onChange={handleChange}
          placeholder="Briefly describe the partnership"
          style={textareaStyle}
          rows={4}
          required
        />
      </label>

      <label>
        What will you provide under the agreement:
        <textarea
          name="agreementSupplies"
          value={formData.agreementSupplies}
          onChange={handleChange}
          placeholder="What will you provide under the agreement"
          style={textareaStyle}
          rows={3}
        />
      </label>

      <label>
        What will you receive under the agreement:
        <textarea
          name="agreementBenefits"
          value={formData.agreementBenefits}
          onChange={handleChange}
          placeholder="What will you receive under the agreement"
          style={textareaStyle}
          rows={3}
        />
      </label>

      <label>
        Type of Partnership:
        <select
          name="partnershipType"
          value={formData.partnershipType}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">Select type</option>
          <option value="jointCampaign">Joint Campaign</option>
          <option value="referral">Referrals</option>
          <option value="resale">Resale</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label>
        Commission / Payment (if any):
        <input
          type="text"
          name="commissionOrPayment"
          value={formData.commissionOrPayment}
          onChange={handleChange}
          placeholder="For example: 10% commission"
          style={inputStyle}
        />
      </label>

      <label>
        Agreement Validity - Start Date:
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
        Agreement Validity - End Date:
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
          The agreement can be canceled at any stage
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
          Confidentiality Clause
        </label>
      </div>

      {/* Signatures */}
      <div style={{ marginTop: 20 }}>
        <label>Signature (of the first signer):</label>
        {isSender ? (
          <>
            {formData.senderSignature ? (
              <img
                src={formData.senderSignature}
                alt="Sender's signature"
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
                  Clear Signature
                </button>
              </>
            )}
          </>
        ) : formData.senderSignature ? (
          <img
            src={formData.senderSignature}
            alt="Sender's signature"
            style={{ border: "1px solid #ccc", borderRadius: 5, width: 400, height: 150 }}
          />
        ) : (
          <p>The first signer has not signed yet</p>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Signature (of the second signer):</label>
        {!isSender ? (
          <>
            {formData.receiverSignature ? (
              <img
                src={formData.receiverSignature}
                alt="Receiver's signature"
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
                  Clear Signature
                </button>
              </>
            )}
          </>
        ) : formData.receiverSignature ? (
          <img
            src={formData.receiverSignature}
            alt="Receiver's signature"
            style={{ border: "1px solid #ccc", borderRadius: 5, width: 400, height: 150 }}
          />
        ) : (
          <p>The second signer has not signed yet</p>
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
        {sending ? "Sending..." : "Send the Agreement 📩"}
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
```
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SignatureCanvas from "react-signature-canvas";
import API from "../../../api";

const partnershipAgreementFormInitial = {
  yourBusinessName: "",
  partnerBusinessName: "",
  toBusinessId: "", // Important! ID of the partner business for sending
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
  const { t } = useTranslation();
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
      alert(t("leftover.collab.agreementForm.senderMustSign"));
      return;
    }
    if (!isSender && !formData.receiverSignature) {
      alert(t("leftover.collab.agreementForm.receiverMustSign"));
      return;
    }
    if (!formData.toBusinessId) {
      alert(t("leftover.collab.agreementForm.needPartnerId"));
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
      alert(isSender ? t("leftover.collab.agreementForm.sentForSignature") : t("leftover.collab.agreementForm.complete"));
      if (typeof onSubmit === "function") onSubmit(formData, isSender ? "pending" : "approved");
    } catch (err) {
      alert(t("leftover.collab.agreementForm.sendError", { message: err?.response?.data?.error || err.message }));
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
      <h2 style={{ textAlign: "center", color: "#5a59d6" }}>{t("leftover.collab.agreementForm.title")} 🤝</h2>

      {/* Form fields */}
      <label>
        {t("leftover.collab.agreementForm.partnerId")}
        <input
          type="text"
          name="toBusinessId"
          value={formData.toBusinessId}
          onChange={handleChange}
          placeholder={t("leftover.collab.agreementForm.partnerIdPh")}
          style={inputStyle}
          required
        />
      </label>

      <label>
        {t("leftover.collab.agreementForm.yourName")}
        <input
          type="text"
          name="yourBusinessName"
          value={formData.yourBusinessName}
          onChange={handleChange}
          placeholder={t("leftover.collab.agreementForm.yourNamePh")}
          style={inputStyle}
          required
        />
      </label>

      <label>
        {t("leftover.collab.agreementForm.partnerName")}
        <input
          type="text"
          name="partnerBusinessName"
          value={formData.partnerBusinessName}
          onChange={handleChange}
          placeholder={t("leftover.collab.agreementForm.partnerNamePh")}
          style={inputStyle}
          required
        />
      </label>

      <label>
        {t("leftover.collab.agreementForm.agreementTitle")}
        <input
          type="text"
          name="agreementTitle"
          value={formData.agreementTitle}
          onChange={handleChange}
          placeholder={t("leftover.collab.agreementForm.agreementTitlePh")}
          style={inputStyle}
          required
        />
      </label>

      <label>
        {t("leftover.collab.agreementForm.description")}
        <textarea
          name="partnershipDescription"
          value={formData.partnershipDescription}
          onChange={handleChange}
          placeholder={t("leftover.collab.agreementForm.descriptionPh")}
          style={textareaStyle}
          rows={4}
          required
        />
      </label>

      <label>
        {t("leftover.collab.agreementForm.provide")}
        <textarea
          name="agreementSupplies"
          value={formData.agreementSupplies}
          onChange={handleChange}
          placeholder={t("leftover.collab.agreementForm.providePh")}
          style={textareaStyle}
          rows={3}
        />
      </label>

      <label>
        {t("leftover.collab.agreementForm.receive")}
        <textarea
          name="agreementBenefits"
          value={formData.agreementBenefits}
          onChange={handleChange}
          placeholder={t("leftover.collab.agreementForm.receivePh")}
          style={textareaStyle}
          rows={3}
        />
      </label>

      <label>
        {t("leftover.collab.agreementForm.type")}
        <select
          name="partnershipType"
          value={formData.partnershipType}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">{t("leftover.collab.agreementForm.typeSelect")}</option>
          <option value="jointCampaign">{t("leftover.collab.agreementForm.typeJoint")}</option>
          <option value="referral">{t("leftover.collab.agreementForm.typeReferral")}</option>
          <option value="resale">{t("leftover.collab.agreementForm.typeResale")}</option>
          <option value="other">{t("leftover.collab.agreementForm.typeOther")}</option>
        </select>
      </label>

      <label>
        {t("leftover.collab.agreementForm.commission")}
        <input
          type="text"
          name="commissionOrPayment"
          value={formData.commissionOrPayment}
          onChange={handleChange}
          placeholder={t("leftover.collab.agreementForm.commissionPh")}
          style={inputStyle}
        />
      </label>

      <label>
        {t("leftover.collab.agreementForm.startDate")}
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
        {t("leftover.collab.agreementForm.endDate")}
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
          {t("leftover.collab.agreementForm.cancelAnytime")}
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
          {t("leftover.collab.agreementForm.confidentiality")}
        </label>
      </div>

      {/* Signatures */}
      <div style={{ marginTop: 20 }}>
        <label>{t("leftover.collab.agreementForm.sigFirst")}</label>
        {isSender ? (
          <>
            {formData.senderSignature ? (
              <img
                src={formData.senderSignature}
                alt={t("leftover.collab.agreementForm.senderAlt")}
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
                  {t("leftover.collab.agreementForm.clearSig")}
                </button>
              </>
            )}
          </>
        ) : formData.senderSignature ? (
          <img
            src={formData.senderSignature}
            alt={t("leftover.collab.agreementForm.senderAlt")}
            style={{ border: "1px solid #ccc", borderRadius: 5, width: 400, height: 150 }}
          />
        ) : (
          <p>{t("leftover.collab.agreementForm.firstNotSigned")}</p>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <label>{t("leftover.collab.agreementForm.sigSecond")}</label>
        {!isSender ? (
          <>
            {formData.receiverSignature ? (
              <img
                src={formData.receiverSignature}
                alt={t("leftover.collab.agreementForm.receiverAlt")}
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
                  {t("leftover.collab.agreementForm.clearSig")}
                </button>
              </>
            )}
          </>
        ) : formData.receiverSignature ? (
          <img
            src={formData.receiverSignature}
            alt={t("leftover.collab.agreementForm.receiverAlt")}
            style={{ border: "1px solid #ccc", borderRadius: 5, width: 400, height: 150 }}
          />
        ) : (
          <p>{t("leftover.collab.agreementForm.secondNotSigned")}</p>
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
        {sending ? t("leftover.collab.agreementForm.sending") : `${t("leftover.collab.agreementForm.submit")} 📩`}
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

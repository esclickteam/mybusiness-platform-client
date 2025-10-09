import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../api"; 
import html2pdf from "html2pdf.js";  // added library
import "./PartnershipAgreementView.css";

export default function PartnershipAgreementView({ agreementId, currentBusinessId }) {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSign, setShowSign] = useState(false);
  const [saving, setSaving] = useState(false);
  const sigPadRef = useRef(null);

  const userSide = agreement
    ? (String(agreement.createdByBusinessId) === String(currentBusinessId) ? "createdBy" : "invitedBusiness")
    : null;

  useEffect(() => {
    async function fetchAgreement() {
      setLoading(true);
      try {
        const idStr = typeof agreementId === "string" ? agreementId : agreementId.toString();
        const res = await API.get(`/partnershipAgreements/${idStr}`);
        setAgreement(res.data);
      } catch (err) {
        console.error("Error loading agreement:", err);
        alert("Error loading the agreement");
      }
      setLoading(false);
    }
    fetchAgreement();
  }, [agreementId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US");
  };

  async function handleSaveSignature() {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      alert("Please sign first");
      return;
    }
    const signatureDataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL();
    setSaving(true);
    try {
      const idStr = typeof agreementId === "string" ? agreementId : agreementId.toString();
      if (userSide === "invitedBusiness") {
        await API.post(`/partnershipAgreements/${idStr}/sign`, { signatureDataUrl });
      } else if (userSide === "createdBy") {
        await API.patch(`/partnershipAgreements/${idStr}`, { signatureDataUrl });
      }
      setShowSign(false);
      const res = await API.get(`/partnershipAgreements/${idStr}`);
      setAgreement(res.data);
    } catch (err) {
      console.error("Error saving signature:", err);
      alert("Error saving signature");
    }
    setSaving(false);
  }

  const downloadPdf = () => {
    const element = document.getElementById("agreement-content");
    if (!element) {
      alert("The agreement is not loaded yet");
      return;
    }

    const options = {
      margin: 0.5,
      filename: `agreement_${agreementId.toString()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  if (loading) return <div>Loading agreement...</div>;
  if (!agreement) return <div>Agreement not found</div>;

  const userSigned = agreement.signatures?.[userSide]?.signed;

  return (
    <div className="agreement-view-container">
      <div id="agreement-content" style={{ direction: "ltr" }}>
        <h2 className="agreement-title">Partnership Agreement: {agreement.title}</h2>

        <p><strong>Sender Business:</strong> {agreement.sender?.businessName || "-"}</p>
        <p><strong>Receiver Business:</strong> {agreement.receiver?.businessName || "-"}</p>
        <p><strong>Description:</strong> {agreement.description}</p>
        <p><strong>What You Will Provide:</strong> {agreement.giving}</p>
        <p><strong>What You Will Receive:</strong> {agreement.receiving}</p>
        <p><strong>Collaboration Type:</strong> {agreement.type}</p>
        <p><strong>Commissions / Payment:</strong> {agreement.paymentDetails || "-"}</p>
        <p><strong>Agreement Period:</strong> {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}</p>
        <p><strong>Cancelable Anytime:</strong> {agreement.cancelAnytime ? "Yes" : "No"}</p>
        <p><strong>Confidentiality Clause:</strong> {agreement.confidentiality ? "Yes" : "No"}</p>
        <p><strong>Status:</strong> <span className={`status status-${agreement.status}`}>{agreement.status}</span></p>

        <hr />

        <h3>Signatures:</h3>
        <div className="signatures-container">
          <div>
            <strong>Creator’s Signature:</strong><br />
            {agreement.signatures?.createdBy?.signed ? (
              <img
                src={agreement.signatures.createdBy.signatureDataUrl}
                alt="Creator's Signature"
                className="signature-image"
              />
            ) : (
              "Not signed"
            )}
          </div>

          <div>
            <strong>Partner’s Signature:</strong><br />
            {agreement.signatures?.invitedBusiness?.signed ? (
              <img
                src={agreement.signatures.invitedBusiness.signatureDataUrl}
                alt="Partner's Signature"
                className="signature-image"
              />
            ) : (
              "Not signed"
            )}
          </div>
        </div>
      </div>

      <hr />

      <button onClick={downloadPdf} style={{ marginBottom: 20, padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>
        Download PDF
      </button>

      {/* Signature buttons */}
      {userSide === "createdBy" && !userSigned && !showSign && (
        <button className="sign-button" onClick={() => setShowSign(true)}>
          Sign Now
        </button>
      )}

      {userSide === "invitedBusiness" && !userSigned && !showSign && (
        <button className="sign-button" onClick={() => setShowSign(true)}>
          Sign Now
        </button>
      )}

      {showSign && (
        <div className="signature-pad-container">
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
            ref={sigPadRef}
          />
          <div className="signature-buttons">
            <button onClick={() => sigPadRef.current.clear()} disabled={saving}>Clear</button>
            <button onClick={handleSaveSignature} disabled={saving}>
              {saving ? "Saving..." : "Save Signature"}
            </button>
            <button onClick={() => setShowSign(false)} disabled={saving}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

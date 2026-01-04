import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../api";
import html2pdf from "html2pdf.js";
import "./PartnershipAgreementView.css";

export default function PartnershipAgreementView({
  agreementId,
  currentBusinessId,
}) {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSign, setShowSign] = useState(false);
  const [saving, setSaving] = useState(false);
  const sigPadRef = useRef(null);

  /* =========================
     Load agreement (with proposal)
  ========================= */
  useEffect(() => {
    async function fetchAgreement() {
      setLoading(true);
      try {
        const idStr =
          typeof agreementId === "string"
            ? agreementId
            : agreementId?._id;

        const res = await API.get(`/partnershipAgreements/${idStr}`);
        setAgreement(res.data);
      } catch (err) {
        console.error("Error loading agreement:", err);
        alert("Error loading the agreement");
      } finally {
        setLoading(false);
      }
    }

    fetchAgreement();
  }, [agreementId]);

  if (loading) return <div>Loading agreement...</div>;
  if (!agreement) return <div>Agreement not found</div>;

  /* =========================
     Normalize proposal
  ========================= */
  const proposal = agreement.proposal || agreement.proposalId;

  if (!proposal) {
    return <div>Proposal data is missing</div>;
  }

  /* =========================
     User side
  ========================= */
  const userSide =
    String(agreement.createdByBusinessId) === String(currentBusinessId)
      ? "createdBy"
      : "invitedBusiness";

  const userSigned = agreement.signatures?.[userSide]?.signed;

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-US") : "—";

  /* =========================
     Signature handling
  ========================= */
  async function handleSaveSignature() {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      alert("Please sign first");
      return;
    }

    const signatureDataUrl =
      sigPadRef.current.getTrimmedCanvas().toDataURL();

    setSaving(true);
    try {
      const idStr =
        typeof agreementId === "string"
          ? agreementId
          : agreementId?._id;

      await API.post(`/partnershipAgreements/${idStr}/sign`, {
        signatureDataUrl,
      });

      setShowSign(false);

      const res = await API.get(`/partnershipAgreements/${idStr}`);
      setAgreement(res.data);
    } catch (err) {
      console.error("Error saving signature:", err);
      alert("Error saving signature");
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     PDF
  ========================= */
  const downloadPdf = () => {
    const element = document.getElementById("agreement-content");
    if (!element) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: `agreement_${agreementId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="agreement-view-container">
      <div id="agreement-content" style={{ direction: "ltr" }}>
        <h2 className="agreement-title">
          Partnership Agreement
        </h2>

        <p>
          <strong>From Business:</strong>{" "}
          {proposal.fromBusinessName || "—"}
        </p>
        <p>
          <strong>To Business:</strong>{" "}
          {proposal.toBusinessName || "—"}
        </p>

        <hr />

        <p>
  <strong>Contact Person:</strong>{" "}
  {proposal.contactName || "—"}
</p>
<p>
  <strong>Phone:</strong>{" "}
  {proposal.phone || "—"}
</p>

<hr />


        <p>
          <strong>Description:</strong> {proposal.description}
        </p>
        <p>
          <strong>What You Will Provide:</strong>{" "}
          {proposal.giving?.join(", ") || "—"}
        </p>
        <p>
          <strong>What You Will Receive:</strong>{" "}
          {proposal.receiving?.join(", ") || "—"}
        </p>
        <p>
          <strong>Collaboration Type:</strong> {proposal.type}
        </p>
        <p>
          <strong>Payment / Commission:</strong>{" "}
          {proposal.payment || "—"}
        </p>
        <p>
          <strong>Agreement Period:</strong>{" "}
          {formatDate(proposal.startDate)} –{" "}
          {formatDate(proposal.endDate)}
        </p>
        <p>
          <strong>Cancelable Anytime:</strong>{" "}
          {proposal.cancelAnytime ? "Yes" : "No"}
        </p>
        <p>
          <strong>Confidentiality Clause:</strong>{" "}
          {proposal.confidentiality ? "Yes" : "No"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {agreement.status}
        </p>

        <hr />

        <h3>Signatures</h3>
        <div className="signatures-container">
          <div>
            <strong>Sender:</strong>
            <br />
            {agreement.signatures?.createdBy?.signed ? (
              <img
                src={
                  agreement.signatures.createdBy.signatureDataUrl
                }
                alt="Sender Signature"
                className="signature-image"
              />
            ) : (
              "Not signed"
            )}
          </div>

          <div>
            <strong>Receiver:</strong>
            <br />
            {agreement.signatures?.invitedBusiness?.signed ? (
              <img
                src={
                  agreement.signatures.invitedBusiness.signatureDataUrl
                }
                alt="Receiver Signature"
                className="signature-image"
              />
            ) : (
              "Not signed"
            )}
          </div>
        </div>
      </div>

      <hr />

      <button onClick={downloadPdf} className="pdf-button">
        Download PDF
      </button>

      {!userSigned && !showSign && (
        <button
          className="sign-button"
          onClick={() => setShowSign(true)}
        >
          Sign Agreement
        </button>
      )}

      {showSign && (
        <div className="signature-pad-container">
          <SignatureCanvas
            penColor="black"
            canvasProps={{
              width: 400,
              height: 150,
              className: "sigCanvas",
            }}
            ref={sigPadRef}
          />
          <div className="signature-buttons">
            <button
              onClick={() => sigPadRef.current.clear()}
              disabled={saving}
            >
              Clear
            </button>
            <button
              onClick={handleSaveSignature}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Signature"}
            </button>
            <button
              onClick={() => setShowSign(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

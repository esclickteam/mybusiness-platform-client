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

  const getAgreementId = () => {
    if (typeof agreementId === "string") return agreementId;
    return agreementId?._id || "";
  };

  const normalizeAgreementResponse = (res) => {
    return res?.data?.agreement || res?.data || null;
  };

  const normalizeId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value?._id) return String(value._id);
    return String(value);
  };

  /* =========================
     Load agreement with proposal
  ========================= */
  useEffect(() => {
    async function fetchAgreement() {
      const idStr = getAgreementId();

      if (!idStr) {
        setLoading(false);
        setAgreement(null);
        return;
      }

      setLoading(true);

      try {
        const res = await API.get(`/partnershipAgreements/${idStr}`);
        const data = normalizeAgreementResponse(res);

        console.log("✅ Loaded agreement:", data);

        setAgreement(data);
      } catch (err) {
        console.error("❌ Error loading agreement:", err);
        alert(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Error loading the agreement"
        );
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
  const createdByBusinessId = normalizeId(agreement.createdByBusinessId);
  const invitedBusinessId = normalizeId(agreement.invitedBusinessId);
  const userBusinessId = normalizeId(currentBusinessId);

  const isCreator = createdByBusinessId === userBusinessId;
  const isInvited = invitedBusinessId === userBusinessId;

  const userSide = isCreator
    ? "createdBy"
    : isInvited
    ? "invitedBusiness"
    : null;

  const userSigned = userSide
    ? Boolean(agreement.signatures?.[userSide]?.signed)
    : false;

  const canSign = Boolean(userSide) && !userSigned;

  console.log("🔐 Agreement frontend permission:", {
    createdByBusinessId,
    invitedBusinessId,
    currentBusinessId,
    userBusinessId,
    isCreator,
    isInvited,
    userSide,
    userSigned,
    canSign,
  });

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-US") : "—";

  /* =========================
     Signature handling
  ========================= */
  async function handleSaveSignature() {
    if (saving) return;

    if (!userSide) {
      alert("You are not authorized to sign this agreement");
      return;
    }

    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      alert("Please sign first");
      return;
    }

    const signatureDataUrl = sigPadRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    setSaving(true);

    try {
      const idStr = getAgreementId();

      const signRes = await API.post(`/partnershipAgreements/${idStr}/sign`, {
        signatureDataUrl,
      });

      const signedAgreement = normalizeAgreementResponse(signRes);

      if (signedAgreement) {
        setAgreement(signedAgreement);
      } else {
        const res = await API.get(`/partnershipAgreements/${idStr}`);
        setAgreement(normalizeAgreementResponse(res));
      }

      setShowSign(false);
    } catch (err) {
      console.error("❌ Error saving signature:", err);

      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error saving signature"
      );
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
        filename: `agreement_${getAgreementId()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
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
        <h2 className="agreement-title">Partnership Agreement</h2>

        <p>
          <strong>From Business:</strong>{" "}
          {proposal.fromBusinessName ||
            agreement.sender?.businessName ||
            "—"}
        </p>

        <p>
          <strong>To Business:</strong>{" "}
          {proposal.toBusinessName ||
            agreement.receiver?.businessName ||
            "—"}
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
          <strong>Description:</strong>{" "}
          {proposal.description || agreement.description || "—"}
        </p>

        <p>
          <strong>What You Will Provide:</strong>{" "}
          {Array.isArray(proposal.giving)
            ? proposal.giving.join(", ")
            : proposal.giving || "—"}
        </p>

        <p>
          <strong>What You Will Receive:</strong>{" "}
          {Array.isArray(proposal.receiving)
            ? proposal.receiving.join(", ")
            : proposal.receiving || "—"}
        </p>

        <p>
          <strong>Collaboration Type:</strong>{" "}
          {proposal.type || agreement.type || "—"}
        </p>

        <p>
          <strong>Payment / Commission:</strong>{" "}
          {proposal.payment || agreement.payment || "—"}
        </p>

        <p>
          <strong>Amount:</strong>{" "}
          {proposal.amount || agreement.amount || "—"}
        </p>

        <p>
          <strong>Agreement Period:</strong>{" "}
          {formatDate(proposal.startDate || agreement.startDate)} –{" "}
          {formatDate(proposal.endDate || agreement.endDate)}
        </p>

        <p>
          <strong>Cancelable Anytime:</strong>{" "}
          {proposal.cancelAnytime || agreement.cancelAnytime ? "Yes" : "No"}
        </p>

        <p>
          <strong>Confidentiality Clause:</strong>{" "}
          {proposal.confidentiality || agreement.confidentiality
            ? "Yes"
            : "No"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {agreement.status || "—"}
        </p>

        <hr />

        <h3>Signatures</h3>

        <div className="signatures-container">
          <div>
            <strong>Sender:</strong>
            <br />

            {agreement.signatures?.createdBy?.signed &&
            agreement.signatures?.createdBy?.signatureDataUrl ? (
              <img
                src={agreement.signatures.createdBy.signatureDataUrl}
                alt="Sender Signature"
                className="signature-image"
              />
            ) : (
              "Not signed"
            )}

            {agreement.signatures?.createdBy?.signedAt && (
              <p>
                Signed at:{" "}
                {formatDate(agreement.signatures.createdBy.signedAt)}
              </p>
            )}
          </div>

          <div>
            <strong>Receiver:</strong>
            <br />

            {agreement.signatures?.invitedBusiness?.signed &&
            agreement.signatures?.invitedBusiness?.signatureDataUrl ? (
              <img
                src={agreement.signatures.invitedBusiness.signatureDataUrl}
                alt="Receiver Signature"
                className="signature-image"
              />
            ) : (
              "Not signed"
            )}

            {agreement.signatures?.invitedBusiness?.signedAt && (
              <p>
                Signed at:{" "}
                {formatDate(agreement.signatures.invitedBusiness.signedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      <hr />

      <button onClick={downloadPdf} className="pdf-button">
        Download PDF
      </button>

      {!userSide && (
        <div style={{ color: "red", marginTop: 12 }}>
          You are not authorized to sign this agreement.
        </div>
      )}

      {canSign && !showSign && (
        <button
          className="sign-button"
          onClick={() => setShowSign(true)}
          disabled={saving}
        >
          Sign Agreement
        </button>
      )}

      {userSigned && (
        <div style={{ color: "green", marginTop: 12 }}>
          You already signed this agreement.
        </div>
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
              onClick={() => sigPadRef.current?.clear()}
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
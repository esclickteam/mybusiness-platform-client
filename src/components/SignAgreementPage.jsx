import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import API from "@api";
import BizuplyLoader from "../components/ui/BizuplyLoader";

export default function SignAgreementPage({ currentUserBusinessId }) {
  const { t } = useTranslation();
  const { agreementId } = useParams();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const sigPadRef = useRef(null);

  useEffect(() => {
    async function fetchAgreement() {
      try {
        const res = await API.get(`/partnershipAgreements/${agreementId}`);
        setAgreement(res.data);
      } catch (err) {
        setError("Error loading agreement");
      } finally {
        setLoading(false);
      }
    }
    fetchAgreement();
  }, [agreementId]);

  if (loading) return <BizuplyLoader fullScreen label="Loading..." />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!agreement) return <p>Agreement not found</p>;

  // Check if the user is the invited party (the one who needs to sign)
  const isInvited = agreement.invitedBusinessId === currentUserBusinessId;
  const hasSigned = agreement.signatures?.invitedBusiness?.signed;

  const handleSign = async () => {
    if (sigPadRef.current.isEmpty()) {
      alert(t("leftover.agreements.signBeforeSubmit"));
      return;
    }
    setSending(true);
    try {
      const signatureDataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL();
      const res = await API.post(`/partnershipAgreements/${agreementId}/sign`, { signatureDataUrl });
      alert(t("leftover.agreements.signedOk"));
      setAgreement(res.data); // Update agreement after signing
    } catch (err) {
      alert(t("leftover.agreements.signError", { detail: err.response?.data?.message || err.message }));
    } finally {
      setSending(false);
    }
  };

  return (
    <div dir="ltr">
      <h2>Agreement: {agreement.title}</h2>
      <p><strong>Description:</strong> {agreement.description}</p>
      <p><strong>Sender:</strong> {agreement.sender.businessName}</p>
      <p><strong>Partner:</strong> {agreement.receiver.businessName}</p>

      <p><strong>Sender Signature:</strong></p>
      {agreement.signatures.createdBy.signatureDataUrl ? (
        <img src={agreement.signatures.createdBy.signatureDataUrl} alt="Sender Signature" style={{ border: "1px solid #ccc", width: 200, height: 100 }} />
      ) : (
        <p>No signature</p>
      )}

      <p><strong>Partner Signature:</strong></p>
      {hasSigned ? (
        <img src={agreement.signatures.invitedBusiness.signatureDataUrl} alt="Partner Signature" style={{ border: "1px solid #ccc", width: 200, height: 100 }} />
      ) : isInvited ? (
        <>
          <SignatureCanvas
            ref={sigPadRef}
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
          />
          <button onClick={handleSign} disabled={sending}>
            {sending ? "Sending..." : "Sign the agreement"}
          </button>
        </>
      ) : (
        <p>Not signed yet</p>
      )}
    </div>
  );
}
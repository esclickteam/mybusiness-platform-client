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
        setError(t("leftover.collab.signPage.loadError"));
      } finally {
        setLoading(false);
      }
    }
    fetchAgreement();
  }, [agreementId]);

  if (loading) return <BizuplyLoader fullScreen label={t("leftover.collab.signPage.loading")} />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!agreement) return <p>{t("leftover.collab.signPage.notFound")}</p>;

  // Check if the user is the invited party (the one who needs to sign)
  const isInvited = agreement.invitedBusinessId === currentUserBusinessId;
  const hasSigned = agreement.signatures?.invitedBusiness?.signed;

  const handleSign = async () => {
    if (sigPadRef.current.isEmpty()) {
      alert(t("leftover.collab.signPage.signBeforeSubmit"));
      return;
    }
    setSending(true);
    try {
      const signatureDataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL();
      const res = await API.post(`/partnershipAgreements/${agreementId}/sign`, { signatureDataUrl });
      alert(t("leftover.collab.signPage.signedOk"));
      setAgreement(res.data); // Update agreement after signing
    } catch (err) {
      alert(t("leftover.collab.signPage.signError", { message: err.response?.data?.message || err.message }));
    } finally {
      setSending(false);
    }
  };

  return (
    <div dir="ltr">
      <h2>{t("leftover.collab.signPage.agreementHeading", { title: agreement.title })}</h2>
      <p><strong>{t("leftover.collab.signPage.description")}</strong> {agreement.description}</p>
      <p><strong>{t("leftover.collab.signPage.sender")}</strong> {agreement.sender.businessName}</p>
      <p><strong>{t("leftover.collab.signPage.partner")}</strong> {agreement.receiver.businessName}</p>

      <p><strong>{t("leftover.collab.signPage.senderSig")}</strong></p>
      {agreement.signatures.createdBy.signatureDataUrl ? (
        <img src={agreement.signatures.createdBy.signatureDataUrl} alt={t("leftover.collab.agreementForm.senderAlt")} style={{ border: "1px solid #ccc", width: 200, height: 100 }} />
      ) : (
        <p>{t("leftover.collab.signPage.noSignature")}</p>
      )}

      <p><strong>{t("leftover.collab.signPage.partnerSig")}</strong></p>
      {hasSigned ? (
        <img src={agreement.signatures.invitedBusiness.signatureDataUrl} alt={t("leftover.collab.agreementForm.receiverAlt")} style={{ border: "1px solid #ccc", width: 200, height: 100 }} />
      ) : isInvited ? (
        <>
          <SignatureCanvas
            ref={sigPadRef}
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
          />
          <button onClick={handleSign} disabled={sending}>
            {sending ? t("leftover.collab.signPage.sending") : t("leftover.collab.signPage.signCta")}
          </button>
        </>
      ) : (
        <p>{t("leftover.collab.signPage.notSignedYet")}</p>
      )}
    </div>
  );
}
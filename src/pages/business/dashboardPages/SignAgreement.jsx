import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import SignatureCanvas from "react-signature-canvas";
import API from "../../../api";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";

export default function PartnershipAgreement({ agreementId, userBusinessId, onSigned }) {
  const { t } = useTranslation();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const sigPadRef = useRef(null);

  // Identify which side the current user is
  const side = (() => {
    if (!agreement) return null;
    if (agreement.createdByBusinessId === userBusinessId) return "createdBy";
    if (agreement.invitedBusinessId === userBusinessId) return "invitedBusiness";
    return null;
  })();

  useEffect(() => {
    async function fetchAgreement() {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/partnershipAgreements/${agreementId}`);
        setAgreement(res.data);
      } catch {
        setError(t("leftover.collab.signPage.loadError"));
      } finally {
        setLoading(false);
      }
    }
    if (agreementId) fetchAgreement();
  }, [agreementId]);

  const hasSigned = agreement?.signatures?.[side]?.signed;

  const clearSignature = () => {
    sigPadRef.current?.clear();
  };

  const saveSignature = async () => {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      alert(t("leftover.collab.signPage.signFirst"));
      return;
    }
    setSaving(true);
    const signatureDataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL();

    try {
      await API.post(`/partnershipAgreements/${agreementId}/sign`, { signatureDataUrl, side });

      alert(t("leftover.collab.signPage.signedSuccess"));
      setAgreement(prev => ({
        ...prev,
        signatures: {
          ...prev.signatures,
          [side]: {
            signed: true,
            signatureDataUrl,
            signedAt: new Date().toISOString(),
          },
        },
        status:
          prev.signatures.createdBy.signed && prev.signatures.invitedBusiness.signed
            ? "fully_signed"
            : "partially_signed",
      }));
      clearSignature();
      if (typeof onSigned === "function") onSigned();
    } catch {
      alert(t("leftover.collab.signPage.saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <BizuplyLoader fullScreen label={t("leftover.collab.signPage.loading")} />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!agreement) return <p>{t("leftover.collab.signPage.notFound")}</p>;
  if (!side) return <p>{t("leftover.collab.signPage.noPermission")}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", direction: "rtl", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>{agreement.title}</h2>
      <p><strong>{t("leftover.collab.signPage.description")}</strong> {agreement.description || "-"}</p>
      <p><strong>{t("leftover.collab.signPage.terms")}</strong></p>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          border: "1px solid #ccc",
          padding: 10,
          minHeight: 120,
          backgroundColor: "#f9f9f9",
        }}
      >
        {agreement.terms || "-"}
      </pre>
      <p><strong>{t("leftover.collab.signPage.payment")}</strong> {agreement.paymentDetails || "-"}</p>
      <p><strong>{t("leftover.collab.signPage.status")}</strong> {agreement.status}</p>

      <hr />

      <h3>{side === "createdBy" ? t("leftover.collab.signPage.yourSigCreator") : t("leftover.collab.signPage.yourSigInvited")}</h3>

      {hasSigned ? (
        <div>
          <p>{t("leftover.collab.signPage.alreadySignedOn", { date: new Date(agreement.signatures[side].signedAt).toLocaleDateString() })}</p>
          <img
            src={agreement.signatures[side].signatureDataUrl}
            alt={t("leftover.collab.signPage.signatureAlt")}
            style={{ border: "1px solid black", width: "100%", maxHeight: 150, objectFit: "contain" }}
          />
        </div>
      ) : (
        <>
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 500, height: 150, className: "sigCanvas" }}
            ref={sigPadRef}
          />
          <div style={{ marginTop: 10 }}>
            <button onClick={clearSignature} disabled={saving} style={{ marginRight: 10 }}>
              {t("leftover.collab.signPage.clearSig")}
            </button>
            <button onClick={saveSignature} disabled={saving}>
              {saving ? t("leftover.collab.signPage.saving") : t("leftover.collab.signPage.signSubmit")}
            </button>
          </div>
        </>
      )}

      <hr />

      <h3>{t("leftover.collab.signPage.otherSig")}</h3>
      {(() => {
        const otherSide = side === "createdBy" ? "invitedBusiness" : "createdBy";
        if (agreement.signatures?.[otherSide]?.signed) {
          return (
            <div>
              <p>
                {t("leftover.collab.signPage.otherSignedOn", {
                  date: new Date(
                    agreement.signatures[otherSide].signedAt
                  ).toLocaleDateString(),
                })}
              </p>
              <img
                src={agreement.signatures[otherSide].signatureDataUrl}
                alt={t("leftover.collab.signPage.otherAlt")}
                style={{ border: "1px solid black", width: "100%", maxHeight: 150, objectFit: "contain" }}
              />
            </div>
          );
        }
        return <p>{t("leftover.collab.signPage.otherNotSigned")}</p>;
      })()}
    </div>
  );
}
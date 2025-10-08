```javascript
import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../../../api";

export default function PartnershipAgreement({ agreementId, userBusinessId, onSigned }) {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const sigPadRef = useRef(null);

  // Identify the signing side of the current user
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
        setError("Error loading the agreement");
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
      alert("Please sign first");
      return;
    }
    setSaving(true);
    const signatureDataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL();

    try {
      await API.post(`/partnershipAgreements/${agreementId}/sign`, { signatureDataUrl, side });

      alert("Agreement signed successfully!");
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
      alert("Error saving the signature");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading agreement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!agreement) return <p>The agreement was not found.</p>;
  if (!side) return <p>You do not have permission to view or sign this agreement.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", direction: "rtl", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>{agreement.title}</h2>
      <p><strong>Description:</strong> {agreement.description || "-"}</p>
      <p><strong>Agreement Terms:</strong></p>
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
      <p><strong>Payment Details:</strong> {agreement.paymentDetails || "-"}</p>
      <p><strong>Agreement Status:</strong> {agreement.status}</p>

      <hr />

      <h3>Your Signature ({side === "createdBy" ? "Agreement Creator" : "Invited Business"})</h3>

      {hasSigned ? (
        <div>
          <p>You have already signed the agreement on {new Date(agreement.signatures[side].signedAt).toLocaleDateString()}</p>
          <img
            src={agreement.signatures[side].signatureDataUrl}
            alt="Signature"
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
              Clear Signature
            </button>
            <button onClick={saveSignature} disabled={saving}>
              {saving ? "Saving..." : "Sign and Submit"}
            </button>
          </div>
        </>
      )}

      <hr />

      <h3>Signature of the Other Party</h3>
      {(() => {
        const otherSide = side === "createdBy" ? "invitedBusiness" : "createdBy";
        if (agreement.signatures?.[otherSide]?.signed) {
          return (
            <div>
              <p>
                The other party signed on{" "}
                {new Date(agreement.signatures[otherSide].signedAt).toLocaleDateString()}
              </p>
              <img
                src={agreement.signatures[otherSide].signatureDataUrl}
                alt="Other Party's Signature"
                style={{ border: "1px solid black", width: "100%", maxHeight: 150, objectFit: "contain" }}
              />
            </div>
          );
        }
        return <p>The other party has not signed yet.</p>;
      })()}
    </div>
  );
}
```
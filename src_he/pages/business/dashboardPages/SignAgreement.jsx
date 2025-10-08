import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../../../api";

export default function PartnershipAgreement({ agreementId, userBusinessId, onSigned }) {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const sigPadRef = useRef(null);

  // זיהוי צד החתימה של המשתמש הנוכחי
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
        setError("שגיאה בטעינת ההסכם");
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
      alert("אנא חתום קודם");
      return;
    }
    setSaving(true);
    const signatureDataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL();

    try {
      await API.post(`/partnershipAgreements/${agreementId}/sign`, { signatureDataUrl, side });

      alert("הסכם נחתם בהצלחה!");
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
      alert("שגיאה בשמירת החתימה");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>טוען הסכם...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!agreement) return <p>ההסכם לא נמצא.</p>;
  if (!side) return <p>אין לך הרשאה לצפות או לחתום על ההסכם הזה.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", direction: "rtl", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>{agreement.title}</h2>
      <p><strong>תיאור:</strong> {agreement.description || "-"}</p>
      <p><strong>תנאי ההסכם:</strong></p>
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
      <p><strong>פרטי תשלום:</strong> {agreement.paymentDetails || "-"}</p>
      <p><strong>סטטוס ההסכם:</strong> {agreement.status}</p>

      <hr />

      <h3>חתימתך ({side === "createdBy" ? "יוצר ההסכם" : "עסק מוזמן"})</h3>

      {hasSigned ? (
        <div>
          <p>כבר חתמת על ההסכם בתאריך {new Date(agreement.signatures[side].signedAt).toLocaleDateString()}</p>
          <img
            src={agreement.signatures[side].signatureDataUrl}
            alt="חתימה"
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
              נקה חתימה
            </button>
            <button onClick={saveSignature} disabled={saving}>
              {saving ? "שומר..." : "חתום והגש"}
            </button>
          </div>
        </>
      )}

      <hr />

      <h3>חתימת הצד השני</h3>
      {(() => {
        const otherSide = side === "createdBy" ? "invitedBusiness" : "createdBy";
        if (agreement.signatures?.[otherSide]?.signed) {
          return (
            <div>
              <p>
                הצד השני חתום בתאריך{" "}
                {new Date(agreement.signatures[otherSide].signedAt).toLocaleDateString()}
              </p>
              <img
                src={agreement.signatures[otherSide].signatureDataUrl}
                alt="חתימת הצד השני"
                style={{ border: "1px solid black", width: "100%", maxHeight: 150, objectFit: "contain" }}
              />
            </div>
          );
        }
        return <p>הצד השני עדיין לא חתם.</p>;
      })()}
    </div>
  );
}

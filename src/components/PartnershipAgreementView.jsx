import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../api"; // axios עם טוקן

export default function PartnershipAgreementView({ agreementId, currentBusinessId }) {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSign, setShowSign] = useState(false);
  const [saving, setSaving] = useState(false);
  const sigPadRef = useRef(null);

  // צד המשתמש הנוכחי בהסכם
  const userSide = agreement
    ? (agreement.createdByBusinessId === currentBusinessId ? "createdBy" : "invitedBusiness")
    : null;

  useEffect(() => {
    async function fetchAgreement() {
      setLoading(true);
      try {
        const res = await API.get(`/agreements/${agreementId}`);
        setAgreement(res.data);
      } catch (error) {
        alert("שגיאה בטעינת ההסכם");
      }
      setLoading(false);
    }
    fetchAgreement();
  }, [agreementId]);

  const userSigned = agreement?.signatures?.[userSide]?.signed;

  async function handleSaveSignature() {
    if (!sigPadRef.current) return alert("אנא חתום תחילה");

    const signatureDataUrl = sigPadRef.current.toDataURL();
    setSaving(true);
    try {
      await API.post(`/agreements/${agreementId}/sign`, {
        signatureDataUrl,
      });
      setShowSign(false);
      // רענון ההסכם עם החתימה החדשה
      const res = await API.get(`/agreements/${agreementId}`);
      setAgreement(res.data);
    } catch (error) {
      alert("שגיאה בשמירת החתימה");
    }
    setSaving(false);
  }

  if (loading) return <div>טוען הסכם...</div>;
  if (!agreement) return <div>הסכם לא נמצא</div>;

  return (
    <div>
      <h2>הסכם שיתוף פעולה: {agreement.title}</h2>
      <p><strong>תיאור:</strong> {agreement.description}</p>
      <p><strong>תנאים:</strong> {agreement.terms}</p>
      <p><strong>תשלום:</strong> {agreement.paymentDetails}</p>
      <p><strong>תקופת ההסכם:</strong> {agreement.startDate} - {agreement.endDate}</p>
      <p><strong>סטטוס:</strong> {agreement.status}</p>

      <hr />

      <h3>חתימות:</h3>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <strong>צד שיצר:</strong><br />
          {agreement.signatures?.createdBy?.signed ? (
            <img
              src={agreement.signatures.createdBy.signatureDataUrl}
              alt="חתימת יוצר"
              style={{ width: 200, border: "1px solid #ccc" }}
            />
          ) : (
            "לא חתום"
          )}
        </div>

        <div>
          <strong>צד מוזמן:</strong><br />
          {agreement.signatures?.invitedBusiness?.signed ? (
            <img
              src={agreement.signatures.invitedBusiness.signatureDataUrl}
              alt="חתימת מוזמן"
              style={{ width: 200, border: "1px solid #ccc" }}
            />
          ) : (
            "לא חתום"
          )}
        </div>
      </div>

      <hr />

      {!userSigned && !showSign && (
        <button onClick={() => setShowSign(true)}>חתום עכשיו</button>
      )}

      {showSign && (
        <div style={{ marginTop: 20 }}>
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: "sigCanvas", style: {border: "1px solid #000"} }}
            ref={sigPadRef}
          />
          <div style={{ marginTop: 10 }}>
            <button onClick={() => sigPadRef.current.clear()}>נקה</button>
            <button onClick={handleSaveSignature} disabled={saving} style={{ marginLeft: 10 }}>
              {saving ? "שומר..." : "שמור חתימה"}
            </button>
            <button onClick={() => setShowSign(false)} disabled={saving} style={{ marginLeft: 10 }}>
              בטל
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

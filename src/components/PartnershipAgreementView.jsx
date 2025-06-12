import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../api"; // axios עם טוקן
import "./PartnershipAgreementView.css"; // תוסיף קובץ CSS לעיצוב מקצועי

export default function PartnershipAgreementView({ agreementId, currentBusinessId }) {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSign, setShowSign] = useState(false);
  const [saving, setSaving] = useState(false);
  const sigPadRef = useRef(null);

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
      const res = await API.get(`/agreements/${agreementId}`);
      setAgreement(res.data);
    } catch (error) {
      alert("שגיאה בשמירת החתימה");
    }
    setSaving(false);
  }

  if (loading) return <div>טוען הסכם...</div>;
  if (!agreement) return <div>הסכם לא נמצא</div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("he-IL");
  };

  return (
    <div className="agreement-view-container">
      <h2 className="agreement-title">הסכם שיתוף פעולה: {agreement.title}</h2>
      <p><strong>תיאור:</strong> {agreement.description}</p>
      <p><strong>תנאים:</strong> {agreement.terms || "-"}</p>
      <p><strong>תשלום:</strong> {agreement.paymentDetails || "-"}</p>
      <p><strong>תקופת ההסכם:</strong> {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}</p>
      <p><strong>סטטוס:</strong> <span className={`status status-${agreement.status}`}>{agreement.status}</span></p>

      <hr />

      <h3>חתימות:</h3>
      <div className="signatures-container">
        <div>
          <strong>צד שיצר:</strong><br />
          {agreement.signatures?.createdBy?.signed ? (
            <img
              src={agreement.signatures.createdBy.signatureDataUrl}
              alt="חתימת יוצר"
              className="signature-image"
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
              className="signature-image"
            />
          ) : (
            "לא חתום"
          )}
        </div>
      </div>

      <hr />

      {!userSigned && !showSign && (
        <button className="sign-button" onClick={() => setShowSign(true)}>חתום עכשיו</button>
      )}

      {showSign && (
        <div className="signature-pad-container">
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: "sigCanvas", style: {border: "1px solid #000"} }}
            ref={sigPadRef}
          />
          <div className="signature-buttons">
            <button onClick={() => sigPadRef.current.clear()}>נקה</button>
            <button onClick={handleSaveSignature} disabled={saving}>
              {saving ? "שומר..." : "שמור חתימה"}
            </button>
            <button onClick={() => setShowSign(false)} disabled={saving}>
              בטל
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

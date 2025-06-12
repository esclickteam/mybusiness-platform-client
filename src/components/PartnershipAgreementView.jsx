import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../api"; 
import "./PartnershipAgreementView.css";

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
        const res = await API.get(`/partnershipAgreements/${agreementId}`);  // <-- שים לב לנתיב
        setAgreement(res.data);
      } catch {
        alert("שגיאה בטעינת ההסכם");
      }
      setLoading(false);
    }
    fetchAgreement();
  }, [agreementId]);

  if (loading) return <div>טוען הסכם...</div>;
  if (!agreement) return <div>הסכם לא נמצא</div>;

  const userSigned = agreement.signatures?.[userSide]?.signed;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("he-IL");
  };

  async function handleSaveSignature() {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) return alert("אנא חתום תחילה");
    const signatureDataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL();
    setSaving(true);
    try {
      await API.post(`/partnershipAgreements/${agreementId}/sign`, { signatureDataUrl });
      setShowSign(false);
      const res = await API.get(`/partnershipAgreements/${agreementId}`);
      setAgreement(res.data);
    } catch {
      alert("שגיאה בשמירת החתימה");
    }
    setSaving(false);
  }

  return (
    <div className="agreement-view-container">
      <h2 className="agreement-title">הסכם שיתוף פעולה: {agreement.title}</h2>
      
      <p><strong>תיאור:</strong> {agreement.description}</p>
      <p><strong>מה תספק במסגרת ההסכם:</strong> {agreement.giving}</p>
      <p><strong>מה תקבל במסגרת ההסכם:</strong> {agreement.receiving}</p>
      <p><strong>סוג שיתוף פעולה:</strong> {agreement.type}</p>
      <p><strong>עמלות / תשלום:</strong> {agreement.paymentDetails || "-"}</p>
      <p><strong>תקופת ההסכם:</strong> {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}</p>
      <p><strong>ניתן לבטל בכל שלב:</strong> {agreement.cancelAnytime ? "כן" : "לא"}</p>
      <p><strong>סעיף סודיות:</strong> {agreement.confidentiality ? "כן" : "לא"}</p>
      <p><strong>סטטוס:</strong> <span className={`status status-${agreement.status}`}>{agreement.status}</span></p>

      <hr />

      <h3>חתימות:</h3>
      <div className="signatures-container">
        <div>
          <strong>חתימת היוצר:</strong><br />
          {agreement.signatures?.createdBy?.signed ? (
            <img
              src={agreement.signatures.createdBy.signatureDataUrl}
              alt="חתימת היוצר"
              className="signature-image"
            />
          ) : (
            "לא חתום"
          )}
        </div>

        <div>
          <strong>חתימת הצד השני:</strong><br />
          {agreement.signatures?.invitedBusiness?.signed ? (
            <img
              src={agreement.signatures.invitedBusiness.signatureDataUrl}
              alt="חתימת הצד השני"
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
            canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
            ref={sigPadRef}
          />
          <div className="signature-buttons">
            <button onClick={() => sigPadRef.current.clear()}>נקה</button>
            <button onClick={handleSaveSignature} disabled={saving}>
              {saving ? "שומר..." : "שמור חתימה"}
            </button>
            <button onClick={() => setShowSign(false)} disabled={saving}>בטל</button>
          </div>
        </div>
      )}
    </div>
  );
}

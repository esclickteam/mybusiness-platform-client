import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import API from "@api";

export default function SignAgreementPage({ currentUserBusinessId }) {
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
        setError("שגיאה בטעינת ההסכם");
      } finally {
        setLoading(false);
      }
    }
    fetchAgreement();
  }, [agreementId]);

  if (loading) return <p>טוען הסכם...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!agreement) return <p>ההסכם לא נמצא</p>;

  // בדיקה אם המשתמש הוא הצד השני (המשתמש שצריך לחתום)
  const isInvited = agreement.invitedBusinessId === currentUserBusinessId;
  const hasSigned = agreement.signatures?.invitedBusiness?.signed;

  const handleSign = async () => {
    if (sigPadRef.current.isEmpty()) {
      alert("אנא חתום לפני השליחה");
      return;
    }
    setSending(true);
    try {
      const signatureDataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL();
      const res = await API.post(`/partnershipAgreements/${agreementId}/sign`, { signatureDataUrl });
      alert("חתמת בהצלחה!");
      setAgreement(res.data); // עדכון ההסכם לאחר החתימה
    } catch (err) {
      alert("שגיאה בחתימה: " + (err.response?.data?.message || err.message));
    } finally {
      setSending(false);
    }
  };

  return (
    <div dir="rtl">
      <h2>הסכם: {agreement.title}</h2>
      <p><strong>תיאור:</strong> {agreement.description}</p>
      <p><strong>שולח:</strong> {agreement.sender.businessName}</p>
      <p><strong>שותף:</strong> {agreement.receiver.businessName}</p>

      <p><strong>חתימת השולח:</strong></p>
      {agreement.signatures.createdBy.signatureDataUrl ? (
        <img src={agreement.signatures.createdBy.signatureDataUrl} alt="חתימת שולח" style={{ border: "1px solid #ccc", width: 200, height: 100 }} />
      ) : (
        <p>אין חתימה</p>
      )}

      <p><strong>חתימת השותף:</strong></p>
      {hasSigned ? (
        <img src={agreement.signatures.invitedBusiness.signatureDataUrl} alt="חתימת שותף" style={{ border: "1px solid #ccc", width: 200, height: 100 }} />
      ) : isInvited ? (
        <>
          <SignatureCanvas
            ref={sigPadRef}
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
          />
          <button onClick={handleSign} disabled={sending}>
            {sending ? "שולח..." : "חתום על ההסכם"}
          </button>
        </>
      ) : (
        <p>עדיין לא נחתם</p>
      )}
    </div>
  );
}

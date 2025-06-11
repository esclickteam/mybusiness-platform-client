import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

export default function PartnershipAgreement({ agreementId, token, onSigned }) {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const sigPadRef = useRef();

  useEffect(() => {
    async function fetchAgreement() {
      try {
        const res = await axios.get(`/api/partnershipAgreements/${agreementId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgreement(res.data);
      } catch (error) {
        alert('שגיאה בטעינת ההסכם');
      } finally {
        setLoading(false);
      }
    }
    fetchAgreement();
  }, [agreementId, token]);

  const clearSignature = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
      setSigned(false);
    }
  };

  const saveSignature = async () => {
    if (sigPadRef.current.isEmpty()) {
      alert('אנא חתום קודם');
      return;
    }

    const signatureDataUrl = sigPadRef.current.toDataURL();

    try {
      await axios.post(
        `/api/partnershipAgreements/${agreementId}/sign`,
        { signatureDataUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('הסכם נחתם בהצלחה!');
      setSigned(true);
      setAgreement((prev) => ({ ...prev, status: 'fully_signed' }));

      if (typeof onSigned === 'function') {
        onSigned();
      }
    } catch (error) {
      alert('שגיאה בחתימה');
    }
  };

  if (loading) return <div>טוען הסכם...</div>;
  if (!agreement) return <div>ההסכם לא נמצא</div>;

  return (
    <div>
      <h2>{agreement.title}</h2>
      <p>{agreement.description}</p>
      <p>תנאים: {agreement.terms}</p>
      <p>פרטי תשלום: {agreement.paymentDetails}</p>
      <p>סטטוס: {agreement.status}</p>

      {!signed && agreement.status === 'partially_signed' && (
        <>
          <SignatureCanvas
            ref={sigPadRef}
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: 'sigCanvas' }}
          />
          <button onClick={clearSignature}>נקה חתימה</button>
          <button onClick={saveSignature}>חתום והגש</button>
        </>
      )}

      {signed && <p>חתמת על ההסכם בהצלחה.</p>}
      {agreement.status === 'fully_signed' && <p>ההסכם נחתם על ידי שני הצדדים.</p>}
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../api"; 
import html2pdf from "html2pdf.js";  // הוספת הספרייה
import "./PartnershipAgreementView.css";

export default function PartnershipAgreementView({ agreementId, currentBusinessId }) {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSign, setShowSign] = useState(false);
  const [saving, setSaving] = useState(false);
  const sigPadRef = useRef(null);

  const userSide = agreement
    ? (String(agreement.createdByBusinessId) === String(currentBusinessId) ? "createdBy" : "invitedBusiness")
    : null;

  useEffect(() => {
    async function fetchAgreement() {
      setLoading(true);
      try {
        const idStr = typeof agreementId === "string" ? agreementId : agreementId.toString();
        const res = await API.get(`/partnershipAgreements/${idStr}`);
        setAgreement(res.data);
      } catch (err) {
        console.error("Error loading agreement:", err);
        alert("שגיאה בטעינת ההסכם");
      }
      setLoading(false);
    }
    fetchAgreement();
  }, [agreementId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("he-IL");
  };

  async function handleSaveSignature() {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      alert("אנא חתום תחילה");
      return;
    }
    const signatureDataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL();
    setSaving(true);
    try {
      const idStr = typeof agreementId === "string" ? agreementId : agreementId.toString();
      if (userSide === "invitedBusiness") {
        await API.post(`/partnershipAgreements/${idStr}/sign`, { signatureDataUrl });
      } else if (userSide === "createdBy") {
        await API.patch(`/partnershipAgreements/${idStr}`, { signatureDataUrl });
      }
      setShowSign(false);
      const res = await API.get(`/partnershipAgreements/${idStr}`);
      setAgreement(res.data);
    } catch (err) {
      console.error("Error saving signature:", err);
      alert("שגיאה בשמירת החתימה");
    }
    setSaving(false);
  }

  const downloadPdf = () => {
    const element = document.getElementById("agreement-content");
    if (!element) {
      alert("ההסכם לא נטען עדיין");
      return;
    }

    const options = {
      margin: 0.5,
      filename: `agreement_${agreementId.toString()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  if (loading) return <div>טוען הסכם...</div>;
  if (!agreement) return <div>הסכם לא נמצא</div>;

  const userSigned = agreement.signatures?.[userSide]?.signed;

  return (
    <div className="agreement-view-container">
      <div id="agreement-content" style={{ direction: "rtl" }}>
        <h2 className="agreement-title">הסכם שיתוף פעולה: {agreement.title}</h2>

        <p><strong>עסק שולח:</strong> {agreement.sender?.businessName || "-"}</p>
        <p><strong>עסק מקבל:</strong> {agreement.receiver?.businessName || "-"}</p>
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
      </div>

      <hr />

      <button onClick={downloadPdf} style={{ marginBottom: 20, padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>
        הורד חוזה כ-PDF
      </button>

      {/* כפתורי חתימה */}
      {userSide === "createdBy" && !userSigned && !showSign && (
        <button className="sign-button" onClick={() => setShowSign(true)}>
          חתום עכשיו
        </button>
      )}

      {userSide === "invitedBusiness" && !userSigned && !showSign && (
        <button className="sign-button" onClick={() => setShowSign(true)}>
          חתום עכשיו
        </button>
      )}

      {showSign && (
        <div className="signature-pad-container">
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
            ref={sigPadRef}
          />
          <div className="signature-buttons">
            <button onClick={() => sigPadRef.current.clear()} disabled={saving}>נקה</button>
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

import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "@api";

export default function UpdateAgreement({ agreementId, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sigPadRef = useRef(null);

  const clearSignature = () => {
    sigPadRef.current.clear();
    setError("");
  };

  const handleSign = async () => {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      setError("יש לספק חתימה לפני השליחה");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const signatureDataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL();

      const payload = {
        signatureDataUrl,
      };

      const idStr = typeof agreementId === "string" ? agreementId : agreementId.toString();

      const res = await API.patch(`/partnershipAgreements/${idStr}`, payload);

      alert("ההסכם עודכן בהצלחה!");
      if (onUpdated) onUpdated(res.data);
      clearSignature();
    } catch (err) {
      setError("שגיאה בעדכון ההסכם: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ direction: "rtl" }}>
      <label style={{ display: "block", marginBottom: 6 }}>חתימה:</label>
      <SignatureCanvas
        ref={sigPadRef}
        penColor="black"
        canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
      />
      <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
        <button type="button" onClick={clearSignature} disabled={loading}>
          נקה חתימה
        </button>
        <button type="button" onClick={handleSign} disabled={loading}>
          {loading ? "מעבד..." : "עדכן חתימה"}
        </button>
      </div>
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}

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
      setError("A signature must be provided before submission");
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

      alert("The agreement has been successfully updated!");
      if (onUpdated) onUpdated(res.data);
      clearSignature();
    } catch (err) {
      setError("Error updating the agreement: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ direction: "rtl" }}>
      <label style={{ display: "block", marginBottom: 6 }}>Signature:</label>
      <SignatureCanvas
        ref={sigPadRef}
        penColor="black"
        canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
      />
      <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
        <button type="button" onClick={clearSignature} disabled={loading}>
          Clear Signature
        </button>
        <button type="button" onClick={handleSign} disabled={loading}>
          {loading ? "Processing..." : "Update Signature"}
        </button>
      </div>
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}

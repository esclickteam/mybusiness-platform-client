```javascript
import React, { useEffect, useState } from "react";
import API from "@api";

export default function AgreementsList() {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAgreements() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/partnershipAgreements");
        setAgreements(res.data);
      } catch (err) {
        setError("Error loading agreements");
      } finally {
        setLoading(false);
      }
    }
    fetchAgreements();
  }, []);

  const openAgreement = async (agreementId) => {
    try {
      // Convert to a valid string before using in URL
      const idStr = typeof agreementId === "string" ? agreementId : agreementId.toString();
      const res = await API.get(`/partnershipAgreements/${idStr}`);
      setSelectedAgreement(res.data);
      setModalOpen(true);
    } catch {
      alert("You do not have permission to view this agreement or the agreement was not found");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAgreement(null);
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
        padding: 20,
      }}
    >
      <h2>Agreements List</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && agreements.length === 0 && <p>No agreements to display.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {agreements.map((agreement) => (
          <li
            key={agreement._id}
            style={{
              padding: 12,
              marginBottom: 12,
              border: "1px solid #ccc",
              borderRadius: 8,
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
              transition: "background-color 0.3s",
            }}
            onClick={() => openAgreement(agreement._id)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e6e6ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
          >
            <strong>{agreement.title}</strong> — {agreement.status}
            <br />
            <small>Sent by: {agreement.sender?.businessName || "-"}</small>
            <br />
            <small>Received by: {agreement.receiver?.businessName || "-"}</small>
          </li>
        ))}
      </ul>

      {modalOpen && selectedAgreement && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              maxWidth: 600,
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              direction: "rtl",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <h3>{selectedAgreement.title}</h3>
            <p>
              <strong>Description:</strong> {selectedAgreement.description || "-"}
            </p>
            <p>
              <strong>Status:</strong> {selectedAgreement.status}
            </p>
            <p>
              <strong>Business that sent:</strong> {selectedAgreement.sender?.businessName || "-"}
            </p>
            <p>
              <strong>Receiving business:</strong> {selectedAgreement.receiver?.businessName || "-"}
            </p>
            <p>
              <strong>Starts on:</strong>{" "}
              {selectedAgreement.startDate
                ? new Date(selectedAgreement.startDate).toLocaleDateString("he-IL")
                : "-"}
            </p>
            <p>
              <strong>Ends on:</strong>{" "}
              {selectedAgreement.endDate
                ? new Date(selectedAgreement.endDate).toLocaleDateString("he-IL")
                : "-"}
            </p>

            <hr style={{ margin: "20px 0" }} />

            <h4>Signatures</h4>

            <div style={{ marginBottom: 16 }}>
              <strong>Signature of the sending business:</strong>{" "}
              {selectedAgreement.signatures?.createdBy?.signed ? (
                <>
                  ✔️ Signed on
                  {selectedAgreement.signatures.createdBy.signedAt
                    ? new Date(selectedAgreement.signatures.createdBy.signedAt).toLocaleDateString("he-IL")
                    : "-"}
                </>
              ) : (
                "❌ Not signed"
              )}
            </div>

            <div>
              <strong>Signature of the receiving business:</strong>{" "}
              {selectedAgreement.signatures?.invitedBusiness?.signed ? (
                <>
                  ✔️ Signed on
                  {selectedAgreement.signatures.invitedBusiness.signedAt
                    ? new Date(selectedAgreement.signatures.invitedBusiness.signedAt).toLocaleDateString("he-IL")
                    : "-"}
                </>
              ) : (
                "❌ Not signed"
              )}
            </div>

            <button
              onClick={closeModal}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#6b46c1",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```
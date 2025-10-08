```javascript
import React, { useState } from "react";

export default function ProposalList({ proposals, currentBusinessId }) {
  const [openAgreementId, setOpenAgreementId] = useState(null);

  // Function to safely convert an ID to a string
  function safeId(id) {
    if (!id) return "";
    if (typeof id === "string") return id;
    if (id._id) return id._id.toString();
    if (typeof id.toString === "function") return id.toString();
    return String(id);
  }

  function openModal(agreementId) {
    const idStr = safeId(agreementId);
    setOpenAgreementId(idStr);
  }

  function closeModal() {
    setOpenAgreementId(null);
  }

  return (
    <div>
      {proposals.map((proposal) => (
        <div
          key={proposal._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            margin: 10,
            padding: 15,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <div>
            <b>Proposal Title:</b> {proposal.title}
          </div>
          <div>
            <b>Sending Business:</b> {proposal.fromBusinessName || proposal.sender?.businessName}
          </div>
          <div>
            <b>Receiving Business:</b> {proposal.toBusinessName || proposal.receiver?.businessName}
          </div>
          <div>
            <b>Status:</b> {proposal.status}
          </div>

          {proposal.agreementId ? (
            <>
              <button
                style={{
                  marginTop: 10,
                  padding: "8px 15px",
                  backgroundColor: "#6200ee",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={() => openModal(proposal.agreementId)}
              >
                View Agreement
              </button>

              {openAgreementId === safeId(proposal.agreementId) && (
                <div
                  style={{
                    marginTop: 15,
                    padding: 15,
                    background: "#f9f9f9",
                    borderRadius: 6,
                    boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <b>Open Agreement Model (here you can add details or a real modal component)</b>
                  <button
                    style={{
                      marginTop: 10,
                      padding: "6px 12px",
                      backgroundColor: "#e53935",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ marginTop: 10, fontStyle: "italic", color: "#777" }}>
              No agreement to display
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```
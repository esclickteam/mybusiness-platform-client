import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../../../api"; // Make sure this is the correct path based on file location
import "./CollabContractView.css";

const CollabContractView = ({ contract, onApprove, currentUser }) => {
  if (!contract) return <p>No contract to display</p>;

  const {
    title,
    description,
    giving,
    receiving,
    type,
    payment,
    startDate,
    endDate,
    cancelAnytime,
    confidentiality,
    status,
    sender,
    receiver,
    createdAt,
    senderSignature,
    receiverSignature,
    _id,
    messageMetadata,
  } = contract;

  // Check who the current user is — sender or receiver
  const isSender = currentUser.businessName === sender?.businessName;
  const isReceiver = currentUser.businessName === receiver?.businessName;

  const receiverSigRef = useRef();
  const [localReceiverSig, setLocalReceiverSig] = useState(receiverSignature || "");
  const [hasSigned, setHasSigned] = useState(!!receiverSignature);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    if (receiverSignature) setLocalReceiverSig(receiverSignature);
  }, [receiverSignature]);

  const handleReceiverSign = () => {
    if (receiverSigRef.current) {
      const dataURL = receiverSigRef.current.getCanvas().toDataURL("image/png");
      setLocalReceiverSig(dataURL);
      setHasSigned(true);
    }
  };

  const handleApprove = async () => {
    if (!localReceiverSig) {
      alert("Please sign first.");
      return;
    }

    if (status === "approved") {
      alert("The agreement has already been approved and cannot be changed.");
      return;
    }

    setIsApproving(true);

    const updatedContract = {
      ...contract,
      receiverSignature: localReceiverSig,
      status: "approved",
      updatedAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await API.put(`/collab-contracts/${_id}`, updatedContract, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data) {
        alert("Error updating the agreement, please try again.");
        setIsApproving(false);
        return;
      }

      await API.post("/chat/send", {
        ...messageMetadata,
        type: "contract",
        contractData: updatedContract,
        time: new Date().toISOString(),
      });

      onApprove(updatedContract);
    } catch (err) {
      console.error("❌ Error sending contract approval to server:", err);
      alert("Error sending the agreement approval, please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="contract-view-container">
      <h2 className="contract-title">📄 Collaboration Agreement</h2>

      <div className="static-field"><strong>Sender Business Name:</strong> {sender?.businessName}</div>
      <div className="static-field"><strong>Receiver Business Name:</strong> {receiver?.businessName}</div>

      <div className="static-field"><strong>Title:</strong> {title}</div>
      <div className="static-field"><strong>Description:</strong> {description}</div>
      <div className="static-field"><strong>What the sender provides:</strong> {giving}</div>
      <div className="static-field"><strong>What is expected in return:</strong> {receiving}</div>
      <div className="static-field"><strong>Collaboration Type:</strong> {type}</div>
      <div className="static-field"><strong>Commission / Payment:</strong> {payment || "None"}</div>
      <div className="static-field"><strong>Validity:</strong> {startDate || "Not set"} to {endDate || "Not set"}</div>
      <div className="static-field">
        <strong>Terms:</strong> {cancelAnytime ? "❎ Cancel anytime" : ""} {confidentiality ? "| 🔒 Confidentiality" : ""}
      </div>
      <div className="static-field"><strong>Created at:</strong> {new Date(createdAt).toLocaleDateString("en-US")}</div>
      <div className="static-field"><strong>Status:</strong> {status}</div>

      {/* Sender signature */}
      <div>
        <strong>✍️ Signature of {sender?.businessName}:</strong>
        {senderSignature ? (
          <img src={senderSignature} alt="Sender signature" className="view-signature-image" />
        ) : (
          <span>Not signed yet</span>
        )}
      </div>

      {/* Receiver signature */}
      <div className="mt-4">
        <strong>✍️ Signature of {receiver?.businessName}:</strong>
        {localReceiverSig ? (
          <img src={localReceiverSig} alt="Receiver signature" className="view-signature-image" />
        ) : isReceiver && status !== "approved" ? (
          <>
            <SignatureCanvas
              penColor="#000"
              canvasProps={{
                width: 300,
                height: 100,
                className: "view-sigCanvas",
              }}
              ref={receiverSigRef}
            />
            <div className="signature-actions">
              <button
                className="collab-form-button"
                onClick={handleReceiverSign}
                disabled={isApproving}
              >
                ✍️ Save signature
              </button>
              {hasSigned && (
                <button
                  className="collab-form-button"
                  onClick={handleApprove}
                  disabled={isApproving}
                >
                  {isApproving ? "Sending approval..." : "✅ I approve the agreement"}
                </button>
              )}
            </div>
          </>
        ) : (
          <span>{status === "approved" ? "Agreement approved" : "Not signed yet"}</span>
        )}
      </div>
    </div>
  );
};

export default CollabContractView;

import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SignatureCanvas from "react-signature-canvas";
import API from "../../../api"; // Make sure this is the correct path based on file location
import "./CollabContractView.css";

const CollabContractView = ({ contract, onApprove, currentUser }) => {
  const { t, i18n } = useTranslation();
  // Hooks must run unconditionally on every render, so they are declared
  // before the "no contract" early return below.
  const receiverSigRef = useRef();
  const [localReceiverSig, setLocalReceiverSig] = useState(
    contract?.receiverSignature || ""
  );
  const [hasSigned, setHasSigned] = useState(!!contract?.receiverSignature);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    if (contract?.receiverSignature) {
      setLocalReceiverSig(contract.receiverSignature);
    }
  }, [contract?.receiverSignature]);

  if (!contract) return <p>{t("leftover.contractChrome.noContract")}</p>;

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

  const handleReceiverSign = () => {
    if (receiverSigRef.current) {
      const dataURL = receiverSigRef.current.getCanvas().toDataURL("image/png");
      setLocalReceiverSig(dataURL);
      setHasSigned(true);
    }
  };

  const handleApprove = async () => {
    if (!localReceiverSig) {
      alert(t("leftover.agreements.signFirst"));
      return;
    }

    if (status === "approved") {
      alert(t("leftover.agreements.alreadyApproved"));
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
        alert(t("leftover.agreements.updateError"));
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
      alert(t("leftover.agreements.approvalSendError"));
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="contract-view-container">
      <h2 className="contract-title">📄 {t("leftover.contractChrome.viewTitle")}</h2>

      <div className="static-field"><strong>{t("leftover.contractChrome.senderBusiness")}</strong> {sender?.businessName}</div>
      <div className="static-field"><strong>{t("leftover.contractChrome.receiverBusiness")}</strong> {receiver?.businessName}</div>

      <div className="static-field"><strong>{t("leftover.contractChrome.titleLabel")}</strong> {title}</div>
      <div className="static-field"><strong>{t("leftover.contractChrome.descriptionLabel")}</strong> {description}</div>
      <div className="static-field"><strong>{t("leftover.contractChrome.senderProvides")}</strong> {giving}</div>
      <div className="static-field"><strong>{t("leftover.contractChrome.expectedReturn")}</strong> {receiving}</div>
      <div className="static-field"><strong>{t("leftover.contractChrome.collabType")}</strong> {type}</div>
      <div className="static-field"><strong>{t("leftover.contractChrome.commissionPayment")}</strong> {payment || t("leftover.contractChrome.none")}</div>
      <div className="static-field"><strong>{t("leftover.contractChrome.validityLabel")}</strong> {startDate || t("leftover.contractChrome.notSet")} {t("leftover.contractChrome.to")} {endDate || t("leftover.contractChrome.notSet")}</div>
      <div className="static-field">
        <strong>{t("leftover.contractChrome.terms")}</strong> {cancelAnytime ? "❎ {t("leftover.contractChrome.cancelAnytimeShort")}" : ""} {confidentiality ? "| 🔒 {t("leftover.contractChrome.confidentialityShort")}" : ""}
      </div>
      <div className="static-field"><strong>{t("leftover.contractChrome.createdAt")}</strong> {new Date(createdAt).toLocaleDateString(i18n.language || undefined)}</div>
      <div className="static-field"><strong>{t("leftover.contractChrome.status")}</strong> {status}</div>

      {/* Sender signature */}
      <div>
        <strong>✍️ {t("leftover.contractChrome.signatureOf", { name: sender?.businessName })}</strong>
        {senderSignature ? (
          <img src={senderSignature} alt={t("leftover.contractChrome.senderSigAlt")} className="view-signature-image" />
        ) : (
          <span>{t("leftover.contractChrome.notSignedYet")}</span>
        )}
      </div>

      {/* Receiver signature */}
      <div className="mt-4">
        <strong>✍️ {t("leftover.contractChrome.signatureOf", { name: receiver?.businessName })}</strong>
        {localReceiverSig ? (
          <img src={localReceiverSig} alt={t("leftover.contractChrome.receiverSigAlt")} className="view-signature-image" />
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
                ✍️ {t("leftover.contractChrome.saveSignature")}
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

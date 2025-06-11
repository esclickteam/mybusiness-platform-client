import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import "./CollabContractView.css";

const CollabContractView = ({ contract, onApprove, currentUser }) => {
  if (!contract) return <p>אין חוזה להצגה</p>;

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
  } = contract;

  const isSender = currentUser.businessName === sender?.businessName;
  const isReceiver = currentUser.businessName === receiver?.businessName;

  const receiverSigRef = useRef();
  const [localReceiverSig, setLocalReceiverSig] = useState(receiverSignature || "");

  useEffect(() => {
    if (receiverSignature) setLocalReceiverSig(receiverSignature);
  }, [receiverSignature]);

  const handleReceiverSign = () => {
    if (receiverSigRef.current) {
      const dataURL = receiverSigRef.current.getCanvas().toDataURL("image/png");
      setLocalReceiverSig(dataURL);
    }
  };

  const handleApprove = () => {
    if (localReceiverSig) {
      onApprove({
        receiverSignature: localReceiverSig,
        status: "מאושר",
      });
    }
  };

  return (
    <div className="contract-view-container">
      <h2 className="contract-title">📄 הסכם שיתוף פעולה</h2>

      <div className="static-field"><strong>שם העסק השולח:</strong> {sender?.businessName}</div>
      <div className="static-field"><strong>שם העסק המקבל:</strong> {receiver?.businessName}</div>

      <div className="static-field"><strong>כותרת:</strong> {title}</div>
      <div className="static-field"><strong>תיאור:</strong> {description}</div>
      <div className="static-field"><strong>מה הצד השולח נותן:</strong> {giving}</div>
      <div className="static-field"><strong>מה הוא מצפה לקבל:</strong> {receiving}</div>
      <div className="static-field"><strong>סוג שיתוף:</strong> {type}</div>
      <div className="static-field"><strong>עמלה / תשלום:</strong> {payment || "ללא"}</div>
      <div className="static-field"><strong>תוקף:</strong> {startDate} עד {endDate}</div>
      <div className="static-field">
        <strong>תנאים:</strong> {cancelAnytime ? "❎ ביטול בכל שלב" : ""} {confidentiality ? "| 🔒 סודיות" : ""}
      </div>
      <div className="static-field"><strong>תאריך יצירה:</strong> {new Date(createdAt).toLocaleDateString("he-IL")}</div>
      <div className="static-field"><strong>סטטוס:</strong> {status}</div>

      {/* חתימת שולח */}
      <div>
        <strong>✍️ חתימת {sender?.businessName}:</strong>
        {senderSignature ? (
          <img src={senderSignature} alt="חתימת שולח" className="view-signature-image" />
        ) : (
          <span>טרם נחתם</span>
        )}
      </div>

      {/* חתימת מקבל */}
      <div className="mt-4">
        <strong>✍️ חתימת {receiver?.businessName}:</strong>
        {localReceiverSig ? (
          <img src={localReceiverSig} alt="חתימת מקבל" className="view-signature-image" />
        ) : isReceiver ? (
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
            <button
              className="collab-form-button mt-2"
              onClick={handleReceiverSign}
            >
              ✍️ שמור חתימה
            </button>
          </>
        ) : (
          <span>טרם נחתם</span>
        )}
      </div>

      {/* אישור סופי */}
      {isReceiver && status === "ממתין לאישור" && localReceiverSig && (
        <button
          className="collab-form-button w-full mt-4"
          onClick={handleApprove}
        >
          ✅ אני מאשר/ת את ההסכם
        </button>
      )}
    </div>
  );
};

export default CollabContractView;
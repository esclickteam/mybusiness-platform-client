import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import "./CollabContractForm.css";

const CollabContractForm = ({
  currentUser,
  partnerBusiness,
  existingContract = null,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    giving: "",
    receiving: "",
    type: "",
    payment: "",
    startDate: "",
    endDate: "",
    cancelAnytime: false,
    confidentiality: false,
    senderSignature: "",
    receiverSignature: "",
    status: "Pending Approval",
    receiver: { businessName: partnerBusiness.name || "" },
    sender: { businessName: currentUser.businessName || "" },
  });

  const senderSigRef = useRef();
  const receiverSigRef = useRef();

  useEffect(() => {
    if (existingContract) {
      setForm(existingContract);
    }
  }, [existingContract]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "cancelAnytime" && checked) {
      setForm((prev) => ({
        ...prev,
        cancelAnytime: true,
        startDate: "",
        endDate: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const saveSenderSignature = () => {
    if (!senderSigRef.current) return;
    const dataURL = senderSigRef.current.getCanvas().toDataURL("image/png");
    setForm((prev) => ({
      ...prev,
      senderSignature: dataURL,
      status: prev.receiverSignature ? "Pending Approval" : "Waiting for Partner Signature",
    }));
  };

  const saveReceiverSignature = () => {
    if (!receiverSigRef.current) return;
    const dataURL = receiverSigRef.current.getCanvas().toDataURL("image/png");
    setForm((prev) => ({
      ...prev,
      receiverSignature: dataURL,
      status: "Pending Approval",
    }));
  };

  const handleSend = () => {
    if (
      !form.title ||
      !form.description ||
      !form.giving ||
      !form.receiving ||
      !form.type
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!form.cancelAnytime && (!form.startDate || !form.endDate)) {
      alert("Please provide start and end dates or select 'Can be canceled at any time'.");
      return;
    }

    if (!form.senderSignature) {
      alert("Please add the sender's signature.");
      return;
    }

    if (!form.receiverSignature && currentUser.businessName === form.receiver.businessName) {
      alert("The agreement is waiting for the partner business's signature.");
      return;
    }

    const newStatus = form.senderSignature && form.receiverSignature ? "Approved" : form.status;

    onSubmit({
      ...form,
      status: newStatus,
    });
  };

  const isSender = currentUser.businessName === (form.sender?.businessName || currentUser.businessName);
  const isReceiver = currentUser.businessName === (form.receiver?.businessName || partnerBusiness.name);
  const isReadOnly = form.status === "Approved";

  return (
    <div className="contract-form-container">
      <h2 className="contract-title">🤝 Collaboration Agreement</h2>

      <form className="contract-form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Your Business Name:</label>
          <div className="static-field">{currentUser.businessName}</div>
        </div>

        <div>
          <label>Partner Business Name:</label>
          <input
            type="text"
            name="partnerName"
            value={form.receiver?.businessName || partnerBusiness.name || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                receiver: { businessName: e.target.value },
              }))
            }
            placeholder="Enter the partner business name"
            required
            disabled={!isSender || isReadOnly}
          />
        </div>

        <div>
          <label>Agreement Title:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Agreement title (e.g., Summer Campaign)"
            required
            disabled={isReadOnly}
          />
        </div>

        <div>
          <label>Collaboration Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            required
            disabled={isReadOnly}
          />
        </div>

        <div>
          <label>What you will provide under the agreement:</label>
          <textarea
            name="giving"
            value={form.giving}
            onChange={handleChange}
            rows="2"
            required
            disabled={isReadOnly}
          />
        </div>

        <div>
          <label>What you will receive under the agreement:</label>
          <textarea
            name="receiving"
            value={form.receiving}
            onChange={handleChange}
            rows="2"
            required
            disabled={isReadOnly}
          />
        </div>

        <div>
          <label>Collaboration Type:</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            disabled={isReadOnly}
          >
            <option value="">Select type</option>
            <option value="חד צדדי">One-sided</option>
            <option value="דו צדדי">Two-sided</option>
            <option value="עם עמלות">With commissions</option>
          </select>
        </div>

        <div>
          <label>Commission / Payment (if any):</label>
          <input
            type="text"
            name="payment"
            value={form.payment}
            onChange={handleChange}
            disabled={isReadOnly}
          />
        </div>

        <label>Agreement Validity:</label>
        <div className="flex">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required={!form.cancelAnytime}
            disabled={form.cancelAnytime || isReadOnly}
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required={!form.cancelAnytime}
            disabled={form.cancelAnytime || isReadOnly}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>
            <input
              type="checkbox"
              name="cancelAnytime"
              checked={form.cancelAnytime}
              onChange={handleChange}
              disabled={isReadOnly}
            />
            The agreement can be canceled at any time
          </label>

          <label>
            <input
              type="checkbox"
              name="confidentiality"
              checked={form.confidentiality}
              onChange={handleChange}
              disabled={isReadOnly}
            />
            Confidentiality clause
          </label>
        </div>

        {/* Sender signature */}
        <div>
          <label>Signature of {currentUser.businessName}:</label>
          {form.senderSignature ? (
            <div>
              <img
                src={form.senderSignature}
                alt="Signature"
                className="form-signature-image"
              />
              {!isReadOnly && isSender && (
                <button
                  type="button"
                  className="collab-form-button mt-2"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      senderSignature: "",
                      status: "Waiting for Partner Signature",
                    }))
                  }
                >
                  🗑️ Re-sign
                </button>
              )}
            </div>
          ) : (
            !isReadOnly && isSender && (
              <>
                <SignatureCanvas
                  penColor="#000"
                  canvasProps={{
                    width: 300,
                    height: 100,
                    className: "form-sigCanvas",
                  }}
                  ref={senderSigRef}
                />
                <button
                  type="button"
                  className="collab-form-button mt-2"
                  onClick={saveSenderSignature}
                >
                  ✍️ Save signature
                </button>
              </>
            )
          )}
        </div>

        {/* Receiver signature */}
        <div>
          <label>Signature of {form.receiver?.businessName || partnerBusiness.name}:</label>
          {form.receiverSignature ? (
            <div>
              <img
                src={form.receiverSignature}
                alt="Signature"
                className="form-signature-image"
              />
              {!isReadOnly && isReceiver && (
                <button
                  type="button"
                  className="collab-form-button mt-2"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      receiverSignature: "",
                      status: "Pending Approval",
                    }))
                  }
                >
                  🗑️ Re-sign
                </button>
              )}
            </div>
          ) : (
            !isReadOnly && isReceiver && (
              <>
                <SignatureCanvas
                  penColor="#000"
                  canvasProps={{
                    width: 300,
                    height: 100,
                    className: "form-sigCanvas",
                  }}
                  ref={receiverSigRef}
                />
                <button
                  type="button"
                  className="collab-form-button mt-2"
                  onClick={saveReceiverSignature}
                >
                  ✍️ Save signature
                </button>
              </>
            )
          )}
        </div>

        {(isSender || isReceiver) && !isReadOnly && (
          <button type="button" className="collab-form-button" onClick={handleSend}>
            📩 Send Agreement
          </button>
        )}
      </form>
    </div>
  );
};

export default CollabContractForm;

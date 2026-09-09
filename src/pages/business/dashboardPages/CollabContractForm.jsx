import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SignatureCanvas from "react-signature-canvas";
import "./CollabContractForm.css";

const CollabContractForm = ({
  currentUser,
  partnerBusiness,
  existingContract = null,
  onSubmit,
}) => {
  const { t } = useTranslation();
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
      alert(t("leftover.agreements.fillRequired"));
      return;
    }

    if (!form.cancelAnytime && (!form.startDate || !form.endDate)) {
      alert(t("leftover.agreements.needDatesOrCancelable"));
      return;
    }

    if (!form.senderSignature) {
      alert(t("leftover.agreements.addSenderSignature"));
      return;
    }

    if (!form.receiverSignature && currentUser.businessName === form.receiver.businessName) {
      alert(t("leftover.agreements.waitingPartnerSignature"));
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
      <h2 className="contract-title">🤝 {t("leftover.contractChrome.formTitle")}</h2>

      <form className="contract-form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>{t("leftover.contractChrome.yourBusiness")}</label>
          <div className="static-field">{currentUser.businessName}</div>
        </div>

        <div>
          <label>{t("leftover.contractChrome.partnerBusiness")}</label>
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
            placeholder={t("leftover.contractChrome.partnerPh")}
            required
            disabled={!isSender || isReadOnly}
          />
        </div>

        <div>
          <label>{t("leftover.contractChrome.agreementTitle")}</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={t("leftover.contractChrome.agreementTitlePh")}
            required
            disabled={isReadOnly}
          />
        </div>

        <div>
          <label>{t("leftover.contractChrome.description")}</label>
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
          <label>{t("leftover.contractChrome.giving")}</label>
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
          <label>{t("leftover.contractChrome.receiving")}</label>
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
          <label>{t("leftover.contractChrome.type")}</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            disabled={isReadOnly}
          >
            <option value="">{t("leftover.contractChrome.selectType")}</option>
            <option value="חד צדדי">{t("leftover.contractChrome.typeOneSided")}</option>
            <option value="דו צדדי">{t("leftover.contractChrome.typeTwoSided")}</option>
            <option value="עם עמלות">{t("leftover.contractChrome.typeCommissions")}</option>
          </select>
        </div>

        <div>
          <label>{t("leftover.contractChrome.payment")}</label>
          <input
            type="text"
            name="payment"
            value={form.payment}
            onChange={handleChange}
            disabled={isReadOnly}
          />
        </div>

        <label>{t("leftover.contractChrome.validity")}</label>
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
            {t("leftover.contractChrome.cancelAnytime")}
          </label>

          <label>
            <input
              type="checkbox"
              name="confidentiality"
              checked={form.confidentiality}
              onChange={handleChange}
              disabled={isReadOnly}
            />
            {t("leftover.contractChrome.confidentiality")}
          </label>
        </div>

        {/* Sender signature */}
        <div>
          <label>{t("leftover.contractChrome.signatureOf", { name: currentUser.businessName })}</label>
          {form.senderSignature ? (
            <div>
              <img
                src={form.senderSignature}
                alt={t("leftover.contractChrome.signatureAlt")}
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
                  🗑️ {t("leftover.contractChrome.resign")}
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
                  ✍️ {t("leftover.contractChrome.saveSignature")}
                </button>
              </>
            )
          )}
        </div>

        {/* Receiver signature */}
        <div>
          <label>{t("leftover.contractChrome.signatureOf", { name: form.receiver?.businessName || partnerBusiness.name })}</label>
          {form.receiverSignature ? (
            <div>
              <img
                src={form.receiverSignature}
                alt={t("leftover.contractChrome.signatureAlt")}
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
                  🗑️ {t("leftover.contractChrome.resign")}
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
                  ✍️ {t("leftover.contractChrome.saveSignature")}
                </button>
              </>
            )
          )}
        </div>

        {(isSender || isReceiver) && !isReadOnly && (
          <button type="button" className="collab-form-button" onClick={handleSend}>
            📩 {t("leftover.contractChrome.send")}
          </button>
        )}
      </form>
    </div>
  );
};

export default CollabContractForm;

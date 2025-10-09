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
    status: "ממתין לאישור",
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
      status: prev.receiverSignature ? "ממתין לאישור" : "ממתין לחתימת שותף",
    }));
  };

  const saveReceiverSignature = () => {
    if (!receiverSigRef.current) return;
    const dataURL = receiverSigRef.current.getCanvas().toDataURL("image/png");
    setForm((prev) => ({
      ...prev,
      receiverSignature: dataURL,
      status: "ממתין לאישור",
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
      alert("נא למלא את כל השדות החיוניים.");
      return;
    }

    if (!form.cancelAnytime && (!form.startDate || !form.endDate)) {
      alert("נא למלא תאריכי התחלה וסיום או לבחור 'ניתן לבטל בכל שלב'.");
      return;
    }

    if (!form.senderSignature) {
      alert("נא לחתום חתימת שולח.");
      return;
    }

    if (!form.receiverSignature && currentUser.businessName === form.receiver.businessName) {
      alert("ההסכם ממתין לחתימת העסק השותף.");
      return;
    }

    const newStatus = form.senderSignature && form.receiverSignature ? "מאושר" : form.status;

    onSubmit({
      ...form,
      status: newStatus,
    });
  };

  const isSender = currentUser.businessName === (form.sender?.businessName || currentUser.businessName);
  const isReceiver = currentUser.businessName === (form.receiver?.businessName || partnerBusiness.name);
  const isReadOnly = form.status === "מאושר";

  return (
    <div className="contract-form-container">
      <h2 className="contract-title">🤝 הסכם שיתוף פעולה</h2>

      <form className="contract-form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>שם העסק שלך:</label>
          <div className="static-field">{currentUser.businessName}</div>
        </div>

        <div>
          <label>שם העסק השותף:</label>
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
            placeholder="הזן שם העסק השותף"
            required
            disabled={!isSender || isReadOnly}
          />
        </div>

        <div>
          <label>כותרת ההסכם:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="כותרת ההסכם (למשל: קמפיין קיץ)"
            required
            disabled={isReadOnly}
          />
        </div>

        <div>
          <label>תיאור שיתוף הפעולה:</label>
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
          <label>מה תספק במסגרת ההסכם:</label>
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
          <label>מה תקבל במסגרת ההסכם:</label>
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
          <label>סוג שיתוף פעולה:</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            disabled={isReadOnly}
          >
            <option value="">בחר סוג</option>
            <option value="חד צדדי">חד צדדי</option>
            <option value="דו צדדי">דו צדדי</option>
            <option value="עם עמלות">עם עמלות</option>
          </select>
        </div>

        <div>
          <label>עמלה / תשלום (אם יש):</label>
          <input
            type="text"
            name="payment"
            value={form.payment}
            onChange={handleChange}
            disabled={isReadOnly}
          />
        </div>

        <label>תוקף ההסכם:</label>
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
            ניתן לבטל את ההסכם בכל שלב
          </label>

          <label>
            <input
              type="checkbox"
              name="confidentiality"
              checked={form.confidentiality}
              onChange={handleChange}
              disabled={isReadOnly}
            />
            סעיף סודיות
          </label>
        </div>

        {/* חתימת השולח */}
        <div>
          <label>חתימת {currentUser.businessName}:</label>
          {form.senderSignature ? (
            <div>
              <img
                src={form.senderSignature}
                alt="חתימה"
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
                      status: "ממתין לחתימת שותף",
                    }))
                  }
                >
                  🗑️ חתום מחדש
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
                  ✍️ שמור חתימה
                </button>
              </>
            )
          )}
        </div>

        {/* חתימת המקבל */}
        <div>
          <label>חתימת {form.receiver?.businessName || partnerBusiness.name}:</label>
          {form.receiverSignature ? (
            <div>
              <img
                src={form.receiverSignature}
                alt="חתימה"
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
                      status: "ממתין לאישור",
                    }))
                  }
                >
                  🗑️ חתום מחדש
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
                  ✍️ שמור חתימה
                </button>
              </>
            )
          )}
        </div>

        {(isSender || isReceiver) && !isReadOnly && (
          <button type="button" className="collab-form-button" onClick={handleSend}>
            📩 שלח את ההסכם
          </button>
        )}
      </form>
    </div>
  );
};

export default CollabContractForm;

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
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveSenderSignature = () => {
    if (!senderSigRef.current) return;
    const dataURL = senderSigRef.current.getCanvas().toDataURL("image/png");
    setForm((prev) => ({
      ...prev,
      senderSignature: dataURL,
    }));
  };

  const saveReceiverSignature = () => {
    if (!receiverSigRef.current) return;
    const dataURL = receiverSigRef.current.getCanvas().toDataURL("image/png");
    setForm((prev) => ({
      ...prev,
      receiverSignature: dataURL,
    }));
  };

  const handleSend = () => {
    // דרישה שכל השדות מלאים, וחתימות קיימות
    if (
      !form.title ||
      !form.description ||
      !form.giving ||
      !form.receiving ||
      !form.type ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("נא למלא את כל השדות החיוניים.");
      return;
    }

    if (!form.senderSignature) {
      alert("נא לחתום חתימת שולח.");
      return;
    }

    if (!form.receiverSignature) {
      alert("ההסכם ממתין לחתימת העסק השותף.");
      return;
    }

    onSubmit(form);
  };

  // האם המשתמש הוא השולח או המקבל
  const isSender = currentUser.businessName === (form.sender?.businessName || currentUser.businessName);
  const isReceiver = currentUser.businessName === (form.receiver?.businessName || partnerBusiness.name);

  return (
    <div className="contract-form-container">
      <h2 className="contract-title">🤝 הסכם שיתוף פעולה</h2>

      <form className="contract-form">
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
            disabled={!isSender} // רק השולח יכול לערוך שם שותף
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
          />
        </div>

        <div>
          <label>סוג שיתוף פעולה:</label>
          <select name="type" value={form.type} onChange={handleChange} required>
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
          />
        </div>

        <label>תוקף ההסכם:</label>
        <div className="flex">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>
            <input
              type="checkbox"
              name="cancelAnytime"
              checked={form.cancelAnytime}
              onChange={handleChange}
            />
            ניתן לבטל את ההסכם בכל שלב
          </label>

          <label>
            <input
              type="checkbox"
              name="confidentiality"
              checked={form.confidentiality}
              onChange={handleChange}
            />
            סעיף סודיות
          </label>
        </div>

        {/* חתימה של השולח */}
        <div>
          <label>חתימת {currentUser.businessName}:</label>
          {isSender ? (
            form.senderSignature ? (
              <div>
                <img
                  src={form.senderSignature}
                  alt="חתימה"
                  className="form-signature-image"
                />
                <button
                  type="button"
                  className="collab-form-button mt-2"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      senderSignature: "",
                    }))
                  }
                >
                  🗑️ חתום מחדש
                </button>
              </div>
            ) : (
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
          ) : (
            form.senderSignature ? (
              <img
                src={form.senderSignature}
                alt="חתימה"
                className="form-signature-image"
              />
            ) : (
              <span>טרם נחתם</span>
            )
          )}
        </div>

        {/* חתימה של המקבל */}
        <div>
          <label>חתימת {form.receiver?.businessName || partnerBusiness.name}:</label>
          {isReceiver ? (
            form.receiverSignature ? (
              <div>
                <img
                  src={form.receiverSignature}
                  alt="חתימה"
                  className="form-signature-image"
                />
                <button
                  type="button"
                  className="collab-form-button mt-2"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      receiverSignature: "",
                    }))
                  }
                >
                  🗑️ חתום מחדש
                </button>
              </div>
            ) : (
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
          ) : (
            form.receiverSignature ? (
              <img
                src={form.receiverSignature}
                alt="חתימה"
                className="form-signature-image"
              />
            ) : (
              <span>טרם נחתם</span>
            )
          )}
        </div>

        {/* כפתור שליחה */}
        {(isSender || isReceiver) && (
          <button type="button" className="collab-form-button" onClick={handleSend}>
            📩 שלח את ההסכם
          </button>
        )}
      </form>
    </div>
  );
};

export default CollabContractForm;

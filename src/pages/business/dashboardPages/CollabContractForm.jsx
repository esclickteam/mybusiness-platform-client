import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import "./CollabContractForm.css";

const CollabContractForm = ({ currentUser, partnerBusiness, onSubmit }) => {
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
  });

  const sigRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignatureSave = () => {
    if (!sigRef.current) return;
    const dataURL = sigRef.current.getCanvas().toDataURL("image/png");

    const fullForm = {
      ...form,
      senderSignature: dataURL,
      sender: { businessName: currentUser.businessName },
      receiver: { businessName: partnerBusiness.name },
      createdAt: new Date().toISOString(),
      status: "ממתין לאישור",
    };

    setForm(fullForm);
    onSubmit(fullForm);
  };

  return (
    <div className="contract-form-container form-mode">
      <h2 className="contract-title">🤝 הסכם שיתוף פעולה</h2>

      <form className="contract-form space-y-4">
        <div>
          <label>שם העסק שלך:</label>
          <div className="static-field">{currentUser.businessName}</div>
        </div>

        <div>
          <label>שם העסק השותף:</label>
          <div className="static-field">{partnerBusiness.name}</div>
        </div>

        <input
          type="text"
          name="title"
          placeholder="כותרת ההסכם (למשל: קמפיין קיץ)"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="תיאור כללי של שיתוף הפעולה"
          value={form.description}
          onChange={handleChange}
          rows="3"
          required
        />

        <textarea
          name="giving"
          placeholder="מה אתה מספק במסגרת ההסכם"
          value={form.giving}
          onChange={handleChange}
          rows="2"
        />

        <textarea
          name="receiving"
          placeholder="מה אתה מצפה לקבל במסגרת ההסכם"
          value={form.receiving}
          onChange={handleChange}
          rows="2"
        />

        <label>סוג שיתוף פעולה:</label>
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="">בחר סוג</option>
          <option value="חד צדדי">חד צדדי</option>
          <option value="דו צדדי">דו צדדי</option>
          <option value="עם עמלות">עם עמלות</option>
        </select>

        <input
          type="text"
          name="payment"
          placeholder="עמלה / תשלום (אם יש)"
          value={form.payment}
          onChange={handleChange}
        />

        <label>תוקף ההסכם:</label>
        <div className="flex gap-2">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
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

        {/* ✍️ חתימה */}
        <div>
          <label>חתימת {currentUser.businessName}:</label>
          {form.senderSignature ? (
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
                ref={sigRef}
              />
              <button
                type="button"
                className="collab-form-button mt-2"
                onClick={handleSignatureSave}
              >
                ✍️ שמור חתימה
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default CollabContractForm;
// CollabContractForm.jsx – טופס הסכם שיתוף פעולה עם חתימה דיגיטלית ושידור אוטומטי

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
  };

  const handleSend = () => {
    if (!form.senderSignature) {
      alert("נא לחתום לפני השליחה.");
      return;
    }
    onSubmit(form);
  };

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
          <div className="static-field">{partnerBusiness.name}</div>
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
          />
        </div>

        <div>
          <label>מה תקבל במסגרת ההסכם:</label>
          <textarea
            name="receiving"
            value={form.receiving}
            onChange={handleChange}
            rows="2"
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

        {form.senderSignature && (
          <button
            type="button"
            className="collab-form-button"
            onClick={handleSend}
          >
            📩 שלח את ההסכם
          </button>
        )}
      </form>
    </div>
  );
};

export default CollabContractForm;

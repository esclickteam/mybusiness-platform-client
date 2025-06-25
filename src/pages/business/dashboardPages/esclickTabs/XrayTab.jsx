import React, { useState } from "react";
import "./XrayTab.css";

const generalQuestions = [
  "עד כמה ברור לך מי קהל היעד של העסק?",
  "כמה העסק מרוויח ביחס להוצאות?",
  "עד כמה יש לך שליטה על תהליכים יומיומיים בעסק?",
  "האם יש לך תוכנית שיווקית מוגדרת?",
  "באיזו תדירות את/ה בודק/ת שביעות רצון לקוחות?"
];

const businessTypes = {
  "שירותים": [
    "איך את/ה משיג לקוחות חדשים?",
    "מה את/ה עושה כדי לשמור על לקוחות קיימים?"
  ],
  "מסחר": [
    "כמה תנועה מגיעה לאתר או לחנות שלך?",
    "מה האתגרים הכי גדולים שלך בתחום המכירות?"
  ],
  "מסעדה / קפה": [
    "איך את/ה מושך לקוחות חדשים?",
    "האם יש תוכנית לשימור לקוחות קבועים?"
  ],
  "סטודיו / קליניקה": [
    "איך לקוחות שומעים עליך בפעם הראשונה?",
    "מה את/ה עושה כדי לשפר את השירות שלך?"
  ]
};

const XrayTab = ({ onSubmit, loading, businessId, conversationId }) => {
  const [answers, setAnswers] = useState({});
  const [businessType, setBusinessType] = useState("");

  const handleInputChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const handleSubmit = () => {
    if (!businessType || Object.keys(answers).length < 5) {
      alert("יש למלא את כל השאלות ולבחור סוג עסק.");
      return;
    }
    // שולחים גם את businessId ו conversationId יחד עם התשובות
    onSubmit({ answers, businessType, businessId, conversationId });
  };

  return (
    <div className="xray-tab-container">
      <h2>רנטגן עסקי</h2>
      <p>מלא שאלון קצר ונעזור לך להבין את מצב העסק שלך מבחינת תזרים, מכירות, שיווק וניהול.</p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="xray-form">
        <h3>שאלות כלליות:</h3>
        {generalQuestions.map((q, idx) => (
          <div key={idx} className="form-group">
            <label>{q}</label>
            <select
              onChange={(e) => handleInputChange(q, e.target.value)}
              defaultValue=""
              required
            >
              <option value="" disabled>בחר דירוג</option>
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        ))}

        <h3>מה סוג העסק שלך?</h3>
        <div className="form-group">
          <select
            onChange={(e) => setBusinessType(e.target.value)}
            defaultValue=""
            required
          >
            <option value="" disabled>בחר סוג עסק</option>
            {Object.keys(businessTypes).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {businessType && (
          <>
            <h4>שאלות פתוחות לפי סוג עסק:</h4>
            {businessTypes[businessType].map((q, idx) => (
              <div key={idx} className="form-group">
                <label>{q}</label>
                <textarea
                  rows={3}
                  onChange={(e) => handleInputChange(q, e.target.value)}
                ></textarea>
              </div>
            ))}
          </>
        )}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "שולח..." : "שליחה"}
        </button>
      </form>
    </div>
  );
};

export default XrayTab;

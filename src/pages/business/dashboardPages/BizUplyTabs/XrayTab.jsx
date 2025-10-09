import React, { useState } from "react";
import "./XrayTab.css";

const generalQuestions = [
  "How clear are you about who your target audience is?",
  "How profitable is your business compared to its expenses?",
  "How much control do you have over your business’s daily operations?",
  "Do you have a defined marketing plan?",
  "How often do you check customer satisfaction?"
];

const businessTypes = {
  "Services": [
    "How do you acquire new clients?",
    "What do you do to retain existing clients?"
  ],
  "Commerce": [
    "How much traffic does your website or store receive?",
    "What are your biggest challenges in sales?"
  ],
  "Restaurant / Café": [
    "How do you attract new customers?",
    "Do you have a plan for retaining regular customers?"
  ],
  "Studio / Clinic": [
    "How do clients hear about you for the first time?",
    "What do you do to improve your service?"
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
      alert("Please fill in all questions and select a business type.");
      return;
    }
    // Sends businessId and conversationId along with the answers
    onSubmit({ answers, businessType, businessId, conversationId });
  };

  return (
    <div className="xray-tab-container">
      <h2>Business X-Ray</h2>
      <p>
        Fill out a short questionnaire and we’ll help you understand your
        business situation in terms of cash flow, sales, marketing, and management.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="xray-form"
      >
        <h3>General Questions:</h3>
        {generalQuestions.map((q, idx) => (
          <div key={idx} className="form-group">
            <label>{q}</label>
            <select
              onChange={(e) => handleInputChange(q, e.target.value)}
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select Rating
              </option>
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ))}

        <h3>What is your business type?</h3>
        <div className="form-group">
          <select
            onChange={(e) => setBusinessType(e.target.value)}
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select Business Type
            </option>
            {Object.keys(businessTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {businessType && (
          <>
            <h4>Open Questions by Business Type:</h4>
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
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default XrayTab;

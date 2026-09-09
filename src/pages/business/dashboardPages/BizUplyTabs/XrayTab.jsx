import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [businessType, setBusinessType] = useState("");

  const handleInputChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const handleSubmit = () => {
    if (!businessType || Object.keys(answers).length < 5) {
      alert(t("leftover.xray.fillAll"));
      return;
    }
    // Sends businessId and conversationId along with the answers
    onSubmit({ answers, businessType, businessId, conversationId });
  };

  return (
    <div className="xray-tab-container">
      <h2>{t("leftover.xrayChrome.title")}</h2>
      <p>{t("leftover.xrayChrome.intro")}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="xray-form"
      >
        <h3>{t("leftover.xrayChrome.generalQuestions")}</h3>
        {generalQuestions.map((q, idx) => (
          <div key={idx} className="form-group">
            <label>{q}</label>
            <select
              onChange={(e) => handleInputChange(q, e.target.value)}
              defaultValue=""
              required
            >
              <option value="" disabled>
                {t("leftover.xrayChrome.selectRating")}
              </option>
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ))}

        <h3>{t("leftover.xrayChrome.businessTypeQ")}</h3>
        <div className="form-group">
          <select
            onChange={(e) => setBusinessType(e.target.value)}
            defaultValue=""
            required
          >
            <option value="" disabled>
              {t("leftover.xrayChrome.selectType")}
            </option>
            {Object.keys(businessTypes).map((type) => (
              <option key={type} value={type}>
                {t(`leftover.xrayChrome.type${type === "Services" ? "Services" : type === "Commerce" ? "Commerce" : type === "Restaurant / Café" ? "Restaurant" : "Studio"}`)}
              </option>
            ))}
          </select>
        </div>

        {businessType && (
          <>
            <h4>{t("leftover.xrayChrome.openByType")}</h4>
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
          {loading ? t("leftover.xrayChrome.sending") : t("leftover.xrayChrome.submit")}
        </button>
      </form>
    </div>
  );
};

export default XrayTab;

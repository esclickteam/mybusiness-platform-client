import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./XrayTab.css";

const GENERAL_QUESTION_IDS = [
  "general.q1",
  "general.q2",
  "general.q3",
  "general.q4",
  "general.q5",
];

const BUSINESS_TYPES = [
  {
    id: "services",
    typeLabelKey: "leftover.xrayChrome.typeServices",
    questionIds: ["types.services.q1", "types.services.q2"],
  },
  {
    id: "commerce",
    typeLabelKey: "leftover.xrayChrome.typeCommerce",
    questionIds: ["types.commerce.q1", "types.commerce.q2"],
  },
  {
    id: "restaurant",
    typeLabelKey: "leftover.xrayChrome.typeRestaurant",
    questionIds: ["types.restaurant.q1", "types.restaurant.q2"],
  },
  {
    id: "studio",
    typeLabelKey: "leftover.xrayChrome.typeStudio",
    questionIds: ["types.studio.q1", "types.studio.q2"],
  },
];

const questionTKey = (questionId) => {
  // general.q1 -> leftover.xrayChrome.questions.general.q1
  // types.services.q1 -> leftover.xrayChrome.questions.types.services.q1
  return `leftover.xrayChrome.questions.${questionId}`;
};

const XrayTab = ({ onSubmit, loading, businessId, conversationId }) => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [businessType, setBusinessType] = useState("");

  const selectedType = BUSINESS_TYPES.find((type) => type.id === businessType);

  const handleInputChange = (questionKey, value) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  };

  const handleBusinessTypeChange = (nextType) => {
    setBusinessType(nextType);
    setAnswers((prev) => {
      const next = { ...prev };
      BUSINESS_TYPES.forEach((type) => {
        type.questionIds.forEach((qid) => {
          delete next[qid];
        });
      });
      return next;
    });
  };

  const handleSubmit = () => {
    const generalFilled = GENERAL_QUESTION_IDS.every(
      (qid) => answers[qid] !== undefined && answers[qid] !== ""
    );
    if (!businessType || !generalFilled) {
      alert(t("leftover.xray.fillAll"));
      return;
    }

    const payloadAnswers = {};
    GENERAL_QUESTION_IDS.forEach((questionKey) => {
      payloadAnswers[questionKey] = {
        questionKey,
        value: answers[questionKey],
      };
    });
    selectedType?.questionIds.forEach((questionKey) => {
      const value = answers[questionKey];
      if (value !== undefined && String(value).trim() !== "") {
        payloadAnswers[questionKey] = {
          questionKey,
          value,
        };
      }
    });

    onSubmit({
      answers: payloadAnswers,
      businessType,
      businessId,
      conversationId,
    });
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
        {GENERAL_QUESTION_IDS.map((questionKey) => (
          <div key={questionKey} className="form-group">
            <label htmlFor={questionKey}>{t(questionTKey(questionKey))}</label>
            <select
              id={questionKey}
              value={answers[questionKey] ?? ""}
              onChange={(e) => handleInputChange(questionKey, e.target.value)}
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
            value={businessType}
            onChange={(e) => handleBusinessTypeChange(e.target.value)}
            required
          >
            <option value="" disabled>
              {t("leftover.xrayChrome.selectType")}
            </option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {t(type.typeLabelKey)}
              </option>
            ))}
          </select>
        </div>

        {selectedType && (
          <>
            <h4>{t("leftover.xrayChrome.openByType")}</h4>
            {selectedType.questionIds.map((questionKey) => (
              <div key={questionKey} className="form-group">
                <label htmlFor={questionKey}>{t(questionTKey(questionKey))}</label>
                <textarea
                  id={questionKey}
                  rows={3}
                  value={answers[questionKey] ?? ""}
                  placeholder={t("leftover.xrayChrome.openAnswerPh")}
                  onChange={(e) => handleInputChange(questionKey, e.target.value)}
                />
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

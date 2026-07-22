import React from "react";
import { useTranslation } from "react-i18next";
import HelpArticleLayout from "./HelpArticleLayout";

export default function AppointmentCRMGuidePage() {
  const { t } = useTranslation();
  const g = "helpGuides.appointmentCrm";

  return (
    <HelpArticleLayout>
      <h1>{t(`${g}.title`)}</h1>

      <h2>{t(`${g}.whyBothTitle`)}</h2>
      <p>{t(`${g}.whyBothP1`)}</p>
      <p>{t(`${g}.whyBothP2`)}</p>
      <p>{t(`${g}.whyBothP3`)}</p>

      <h2>{t(`${g}.whyNotOutsideTitle`)}</h2>
      <p>{t(`${g}.whyNotOutsideP1`)}</p>
      <ul>
        {t(`${g}.whyNotOutsideItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.howTogetherTitle`)}</h2>
      <p>{t(`${g}.howTogetherP1`)}</p>
      <p>{t(`${g}.howTogetherP2`)}</p>

      <h2>{t(`${g}.benefitsTitle`)}</h2>
      <ul>
        {t(`${g}.benefits`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.durationsTitle`)}</h2>
      <p>{t(`${g}.durationsP1`)}</p>
      <ul>
        <li>
          <strong>{t(`${g}.durationAssessTitle`)}</strong>{" "}
          {t(`${g}.durationAssessBody`)}
        </li>
        <li>
          <strong>{t(`${g}.durationSetTitle`)}</strong>{" "}
          {t(`${g}.durationSetBody`)}
        </li>
        <li>
          <strong>{t(`${g}.durationLoadTitle`)}</strong>{" "}
          {t(`${g}.durationLoadBody`)}
        </li>
        <li>
          <strong>{t(`${g}.durationTransparentTitle`)}</strong>{" "}
          {t(`${g}.durationTransparentBody`)}
        </li>
        <li>
          <strong>{t(`${g}.durationProactiveTitle`)}</strong>{" "}
          {t(`${g}.durationProactiveBody`)}
        </li>
        <li>
          <strong>{t(`${g}.durationDataTitle`)}</strong>{" "}
          {t(`${g}.durationDataBody`)}
        </li>
      </ul>

      <h2>{t(`${g}.bestPracticesTitle`)}</h2>
      <ul>
        {t(`${g}.bestPractices`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.summaryTitle`)}</h2>
      <p>{t(`${g}.summaryP1`)}</p>
      <p>{t(`${g}.summaryP2`)}</p>
    </HelpArticleLayout>
  );
}

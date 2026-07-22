import React from "react";
import { useTranslation } from "react-i18next";
import HelpArticleLayout from "./HelpArticleLayout";

export default function AICompanionGuidePage() {
  const { t } = useTranslation();
  const g = "helpGuides.aiCompanion";

  return (
    <HelpArticleLayout>
      <h1>{t(`${g}.title`)}</h1>

      <h2>{t(`${g}.whyAiTitle`)}</h2>
      <p>{t(`${g}.whyAiP1`)}</p>
      <p>{t(`${g}.whyAiP2`)}</p>

      <h2>{t(`${g}.whatIsTitle`)}</h2>
      <p>{t(`${g}.whatIsP1`)}</p>

      <h2>{t(`${g}.includesTitle`)}</h2>
      <ul>
        {t(`${g}.includesItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>{t(`${g}.includesNote`)}</p>

      <h2>{t(`${g}.strategicTitle`)}</h2>
      <ol>
        <li>
          <strong>{t(`${g}.strategic1Title`)}</strong>
          <br />
          {t(`${g}.strategic1Body`)}
        </li>
        <li>
          <strong>{t(`${g}.strategic2Title`)}</strong>
          <br />
          {t(`${g}.strategic2Body`)}
        </li>
        <li>
          <strong>{t(`${g}.strategic3Title`)}</strong>
          <br />
          {t(`${g}.strategic3Body`)}
        </li>
        <li>
          <strong>{t(`${g}.strategic4Title`)}</strong>
          <br />
          {t(`${g}.strategic4Body`)}
        </li>
      </ol>

      <h2>{t(`${g}.getMostTitle`)}</h2>
      <ol>
        <li>
          <strong>{t(`${g}.getMost1Title`)}</strong>
          <br />
          {t(`${g}.getMost1Body`)}
        </li>
        <li>
          <strong>{t(`${g}.getMost2Title`)}</strong>
          <br />
          {t(`${g}.getMost2Body`)}
        </li>
        <li>
          <strong>{t(`${g}.getMost3Title`)}</strong>
          <br />
          {t(`${g}.getMost3Body`)}
        </li>
        <li>
          <strong>{t(`${g}.getMost4Title`)}</strong>
          <br />
          {t(`${g}.getMost4Body`)}
        </li>
        <li>
          <strong>{t(`${g}.getMost5Title`)}</strong>
          <br />
          {t(`${g}.getMost5Body`)}
        </li>
      </ol>

      <h2>{t(`${g}.areasTitle`)}</h2>
      <ul>
        {t(`${g}.areasItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.summaryTitle`)}</h2>
      <p>{t(`${g}.summaryP1`)}</p>
      <p>{t(`${g}.summaryP2`)}</p>
    </HelpArticleLayout>
  );
}

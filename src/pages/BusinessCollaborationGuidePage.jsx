import React from "react";
import { useTranslation } from "react-i18next";
import HelpArticleLayout from "./HelpArticleLayout";

export default function BusinessCollaborationGuidePage() {
  const { t } = useTranslation();
  const g = "helpGuides.businessCollaboration";

  return (
    <HelpArticleLayout>
      <h1>{t(`${g}.title`)}</h1>

      <h2>{t(`${g}.whyTitle`)}</h2>
      <p>{t(`${g}.whyP1`)}</p>
      <p>{t(`${g}.whyP2`)}</p>
      <ul>
        {t(`${g}.whyItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>{t(`${g}.whyP3`)}</p>

      <h2>{t(`${g}.sectionTitle`)}</h2>
      <p>{t(`${g}.sectionP1`)}</p>
      <ul>
        <li>
          <strong>{t(`${g}.sectionFindTitle`)}</strong>{" "}
          {t(`${g}.sectionFindBody`)}
        </li>
        <li>
          <strong>{t(`${g}.sectionMarketTitle`)}</strong>{" "}
          {t(`${g}.sectionMarketBody`)}
        </li>
        <li>
          <strong>{t(`${g}.sectionAlignTitle`)}</strong>{" "}
          {t(`${g}.sectionAlignBody`)}
        </li>
        <li>
          <strong>{t(`${g}.sectionAgreementsTitle`)}</strong>{" "}
          {t(`${g}.sectionAgreementsBody`)}
        </li>
        <li>
          <strong>{t(`${g}.sectionActiveTitle`)}</strong>{" "}
          {t(`${g}.sectionActiveBody`)}
        </li>
      </ul>

      <h2>{t(`${g}.bestPracticesTitle`)}</h2>
      <ol>
        <li>
          <strong>{t(`${g}.bp1Title`)}</strong>
          <br />
          {t(`${g}.bp1Body`)}
        </li>
        <li>
          <strong>{t(`${g}.bp2Title`)}</strong>
          <br />
          {t(`${g}.bp2Body`)}
        </li>
        <li>
          <strong>{t(`${g}.bp3Title`)}</strong>
          <br />
          {t(`${g}.bp3Body`)}
        </li>
        <li>
          <strong>{t(`${g}.bp4Title`)}</strong>
          <br />
          {t(`${g}.bp4Body`)}
        </li>
        <li>
          <strong>{t(`${g}.bp5Title`)}</strong>
          <br />
          {t(`${g}.bp5Body`)}
        </li>
      </ol>

      <h2>{t(`${g}.evenWhenTitle`)}</h2>
      <ul>
        {t(`${g}.evenWhenItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.summaryTitle`)}</h2>
      <p>{t(`${g}.summaryP1`)}</p>
      <p>{t(`${g}.summaryP2`)}</p>
    </HelpArticleLayout>
  );
}

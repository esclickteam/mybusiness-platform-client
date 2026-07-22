import React from "react";
import { useTranslation } from "react-i18next";
import HelpArticleLayout from "./HelpArticleLayout";

export default function WebsiteBuildingGuidePage() {
  const { t } = useTranslation();
  const g = "helpGuides.websiteBuilding";

  return (
    <HelpArticleLayout>
      <h1>{t(`${g}.title`)}</h1>

      <h2>{t(`${g}.whyTitle`)}</h2>
      <p>{t(`${g}.whyP1`)}</p>
      <p>{t(`${g}.whyP2`)}</p>

      <h2>{t(`${g}.howToStartTitle`)}</h2>
      <p>
        {t(`${g}.howToStartBefore`)}
        <strong>{t(`${g}.howToStartBold`)}</strong>
        {t(`${g}.howToStartAfter`)}
      </p>

      <h3>{t(`${g}.twoWaysTitle`)}</h3>
      <table>
        <thead>
          <tr>
            <th>{t(`${g}.table.method`)}</th>
            <th>{t(`${g}.table.bestFor`)}</th>
            <th>{t(`${g}.table.next`)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t(`${g}.table.templateMethod`)}</td>
            <td>{t(`${g}.table.templateBestFor`)}</td>
            <td>{t(`${g}.table.templateNext`)}</td>
          </tr>
          <tr>
            <td>{t(`${g}.table.aiMethod`)}</td>
            <td>{t(`${g}.table.aiBestFor`)}</td>
            <td>{t(`${g}.table.aiNext`)}</td>
          </tr>
        </tbody>
      </table>

      <h2>{t(`${g}.studioTitle`)}</h2>
      <p>{t(`${g}.studioP1`)}</p>

      <h3>{t(`${g}.canEditTitle`)}</h3>
      <ul>
        {t(`${g}.canEditItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h3>{t(`${g}.editorTipsTitle`)}</h3>
      <ol>
        <li>
          <strong>{t(`${g}.tipSaveTitle`)}</strong>
          {t(`${g}.tipSaveBody`)}
        </li>
        <li>
          <strong>{t(`${g}.tipPreviewTitle`)}</strong>
          {t(`${g}.tipPreviewBody`)}
        </li>
        <li>
          <strong>{t(`${g}.tipTemplateTitle`)}</strong>
          {t(`${g}.tipTemplateBody`)}
        </li>
        <li>
          <strong>{t(`${g}.tipCtaTitle`)}</strong>
          {t(`${g}.tipCtaBody`)}
        </li>
      </ol>

      <h2>{t(`${g}.manageTitle`)}</h2>
      <p>{t(`${g}.manageIntro`)}</p>
      <ul>
        {t(`${g}.manageItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.publishTitle`)}</h2>
      <p>
        {t(`${g}.publishBefore`)}
        <strong>{t(`${g}.publishBold`)}</strong>
        {t(`${g}.publishAfter`)}{" "}
        <code>yourbusiness.bizuply.com</code>
      </p>
      <p>{t(`${g}.publishChecklistIntro`)}</p>
      <ul>
        {t(`${g}.publishItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.seoTitle`)}</h2>
      <p>{t(`${g}.seoIntro`)}</p>
      <ul>
        <li>
          <strong>{t(`${g}.seoTitleLabel`)}</strong>
          {t(`${g}.seoTitleBody`)}
        </li>
        <li>
          <strong>{t(`${g}.seoDescLabel`)}</strong>
          {t(`${g}.seoDescBody`)}
        </li>
        <li>
          <strong>{t(`${g}.seoKeywordsLabel`)}</strong>
          {t(`${g}.seoKeywordsBody`)}
        </li>
      </ul>

      <h2>{t(`${g}.aiBuildTitle`)}</h2>
      <ol>
        {t(`${g}.aiBuildSteps`, { returnObjects: true }).map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <h2>{t(`${g}.summaryTitle`)}</h2>
      <ul>
        {t(`${g}.summaryItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </HelpArticleLayout>
  );
}

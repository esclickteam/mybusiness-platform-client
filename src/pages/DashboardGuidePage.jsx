import React from "react";
import { useTranslation } from "react-i18next";
import HelpArticleLayout from "./HelpArticleLayout";

export default function DashboardGuidePage() {
  const { t } = useTranslation();
  const g = "helpGuides.dashboard";

  return (
    <HelpArticleLayout>
      <h1>{t(`${g}.title`)}</h1>

      <h2>{t(`${g}.whatTitle`)}</h2>
      <p>{t(`${g}.whatP1`)}</p>
      <p>{t(`${g}.whatP2`)}</p>

      <h2>{t(`${g}.whyCoreTitle`)}</h2>
      <ul>
        {t(`${g}.whyCoreItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.includesTitle`)}</h2>

      <h3>{t(`${g}.reviewsTitle`)}</h3>
      <p>{t(`${g}.reviewsP1`)}</p>
      <p>
        <strong>{t(`${g}.howToUseLabel`)}</strong>
      </p>
      <ul>
        {t(`${g}.reviewsItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>
        <strong>{t(`${g}.exampleLabel`)}</strong> {t(`${g}.reviewsExample`)}
      </p>

      <h3>{t(`${g}.appointmentsTitle`)}</h3>
      <p>{t(`${g}.appointmentsP1`)}</p>
      <p>
        <strong>{t(`${g}.whyImportantLabel`)}</strong>
      </p>
      <ul>
        {t(`${g}.appointmentsItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>
        <strong>{t(`${g}.exampleLabel`)}</strong> {t(`${g}.appointmentsExample`)}
      </p>

      <h3>{t(`${g}.byMonthTitle`)}</h3>
      <p>{t(`${g}.byMonthP1`)}</p>
      <p>
        <strong>{t(`${g}.howHelpsLabel`)}</strong>
      </p>
      <ul>
        {t(`${g}.byMonthItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>
        <strong>{t(`${g}.insightLabel`)}</strong> {t(`${g}.byMonthInsight`)}
      </p>

      <h3>{t(`${g}.insightsTitle`)}</h3>
      <p>{t(`${g}.insightsP1`)}</p>
      <p>{t(`${g}.insightsP2`)}</p>
      <ul>
        {t(`${g}.insightsItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>
        <strong>{t(`${g}.exampleLabel`)}</strong> {t(`${g}.insightsExample`)}
      </p>

      <h3>{t(`${g}.scheduleTitle`)}</h3>
      <p>{t(`${g}.scheduleP1`)}</p>
      <ul>
        {t(`${g}.scheduleItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h3>{t(`${g}.weeklyTitle`)}</h3>
      <p>{t(`${g}.weeklyP1`)}</p>
      <ul>
        {t(`${g}.weeklyItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>
        <strong>{t(`${g}.howToUseThisLabel`)}</strong>
      </p>
      <ul>
        {t(`${g}.weeklyUseItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.whyTrackTitle`)}</h2>
      <table>
        <thead>
          <tr>
            <th>{t(`${g}.table.reason`)}</th>
            <th>{t(`${g}.table.impact`)}</th>
          </tr>
        </thead>
        <tbody>
          {t(`${g}.table.rows`, { returnObjects: true }).map((row, i) => (
            <tr key={i}>
              <td>{row.reason}</td>
              <td>{row.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{t(`${g}.bestPracticesTitle`)}</h2>
      <ul>
        {t(`${g}.bestPractices`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.summaryTitle`)}</h2>
      <p>{t(`${g}.summaryP1`)}</p>
    </HelpArticleLayout>
  );
}

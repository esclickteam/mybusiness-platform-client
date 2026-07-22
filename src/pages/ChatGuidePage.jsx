import React from "react";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../hooks/useLocaleDir";
import "./ChatGuidePage.css";

export default function ChatGuidePage() {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const lang = (i18n.language || "en").split("-")[0];
  const g = "helpGuides.chat";

  return (
    <div className="chat-guide-container" dir={dir} lang={lang}>
      <h1>{t(`${g}.title`)}</h1>

      <h2>{t(`${g}.howWorksTitle`)}</h2>
      <p>{t(`${g}.howWorksP1`)}</p>
      <p>{t(`${g}.howWorksP2`)}</p>
      <p>{t(`${g}.howWorksP3`)}</p>
      <ul>
        {t(`${g}.howWorksItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.whyEfficientTitle`)}</h2>
      <ul>
        {t(`${g}.whyEfficientItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2>{t(`${g}.whyNotOtherTitle`)}</h2>
      <table>
        <thead>
          <tr>
            <th>{t(`${g}.channels.channel`)}</th>
            <th>{t(`${g}.channels.limitations`)}</th>
            <th>{t(`${g}.channels.advantage`)}</th>
          </tr>
        </thead>
        <tbody>
          {t(`${g}.channels.rows`, { returnObjects: true }).map((row, i) => (
            <tr key={i}>
              <td>{row.channel}</td>
              <td>{row.limitations}</td>
              <td>{row.advantage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{t(`${g}.advantagesTitle`)}</h2>
      <table>
        <thead>
          <tr>
            <th>{t(`${g}.advantages.advantage`)}</th>
            <th>{t(`${g}.advantages.impact`)}</th>
          </tr>
        </thead>
        <tbody>
          {t(`${g}.advantages.rows`, { returnObjects: true }).map((row, i) => (
            <tr key={i}>
              <td>{row.advantage}</td>
              <td>{row.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{t(`${g}.guidelinesTitle`)}</h2>
      <ol>
        <li>
          <strong>{t(`${g}.g1Title`)}</strong>
          <br />
          {t(`${g}.g1Line1`)}
          <br />
          {t(`${g}.g1Line2`)}
          <br />
          {t(`${g}.g1Line3`)}
        </li>
        <li>
          <strong>{t(`${g}.g2Title`)}</strong>
          <br />
          {t(`${g}.g2Line1`)}
          <br />
          <em>{t(`${g}.g2Quote1`)}</em>
          <br />
          {t(`${g}.g2Line2`)}
          <br />
          <em>{t(`${g}.g2Quote2`)}</em>
          <br />
          {t(`${g}.g2Line3`)}
          <br />
          <em>{t(`${g}.g2Quote3`)}</em>
        </li>
        <li>
          <strong>{t(`${g}.g3Title`)}</strong>
          <br />
          {t(`${g}.g3Line1`)}
          <br />
          {t(`${g}.g3Line2`)}
        </li>
      </ol>

      <h2>{t(`${g}.examplesTitle`)}</h2>

      <p>
        <strong>{t(`${g}.ex1Title`)}</strong>
      </p>
      <p>
        {t(`${g}.ex1Customer`)}
        <br />
        {t(`${g}.ex1YouLabel`)}
        <br />
        {t(`${g}.ex1You`)}
      </p>

      <p>
        <strong>{t(`${g}.ex2Title`)}</strong>
      </p>
      <p>
        {t(`${g}.ex2Customer`)}
        <br />
        {t(`${g}.ex2YouLabel`)}
        <br />
        {t(`${g}.ex2You`)}
      </p>

      <p>
        <strong>{t(`${g}.ex3Title`)}</strong>
      </p>
      <p>
        {t(`${g}.ex3Customer`)}
        <br />
        {t(`${g}.ex3YouLabel`)}
        <br />
        {t(`${g}.ex3You`)}
      </p>

      <p>
        <strong>{t(`${g}.ex4Title`)}</strong>
      </p>
      <p>
        {t(`${g}.ex4Customer`)}
        <br />
        {t(`${g}.ex4YouLabel`)}
        <br />
        {t(`${g}.ex4You`)}
      </p>

      <p>
        <strong>{t(`${g}.ex5Title`)}</strong>
      </p>
      <p>
        {t(`${g}.ex5Customer`)}
        <br />
        {t(`${g}.ex5YouLabel`)}
        <br />
        {t(`${g}.ex5You`)}
      </p>

      <h2>{t(`${g}.advancedTitle`)}</h2>
      <table>
        <thead>
          <tr>
            <th>{t(`${g}.advanced.recommendation`)}</th>
            <th>{t(`${g}.advanced.why`)}</th>
          </tr>
        </thead>
        <tbody>
          {t(`${g}.advanced.rows`, { returnObjects: true }).map((row, i) => (
            <tr key={i}>
              <td>{row.recommendation}</td>
              <td>{row.why}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{t(`${g}.summaryTitle`)}</h2>
      <ul>
        {t(`${g}.summaryItems`, { returnObjects: true }).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

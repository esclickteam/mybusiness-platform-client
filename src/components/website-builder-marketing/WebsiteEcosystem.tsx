import React from "react";
import { useTranslation } from "react-i18next";
import { Puzzle } from "lucide-react";
import { Marquee, Reveal, SectionHeading } from "../product-marketing";
import {
  getLivePlugins,
  paymentProviders,
  getPluginChips,
} from "./websiteMarketingData";
import "./websiteSections.css";

export default function WebsiteEcosystem() {
  const { t } = useTranslation();
  const pluginChips = getPluginChips(t);
  const livePlugins = getLivePlugins(t);
  const half = Math.ceil(pluginChips.length / 2);
  const rows = [pluginChips.slice(0, half), pluginChips.slice(half)];

  return (
    <section className="pm-section wbx">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Puzzle size={14} aria-hidden="true" />
              {t("websitePage.ecosystem.eyebrow")}
            </>
          }
          title={
            <>
              {t("websitePage.ecosystem.titleLead")}{" "}
              <span className="pm-grad">{t("websitePage.ecosystem.titleHighlight")}</span>
            </>
          }
          lead={t("websitePage.ecosystem.lead")}
        />

        <div className="wbx-plugins">
          {rows.map((row, index) => (
            <Marquee
              key={index}
              duration={index === 0 ? 46 : 54}
              reverse={index === 1}
            >
              {row.map((plugin) => (
                <span
                  key={plugin.name}
                  className="pm-chip"
                  style={
                    { "--pm-chip-accent": plugin.accent } as React.CSSProperties
                  }
                >
                  <span className="pm-chip__icon" aria-hidden="true">
                    <Puzzle size={12} />
                  </span>
                  {plugin.name}
                  <em className="pm-chip__meta">{plugin.category}</em>
                </span>
              ))}
            </Marquee>
          ))}
        </div>

        <Reveal from="up" delay={0.1}>
          <ul className="wbx-live">
            {livePlugins.map((plugin) => (
              <li key={plugin.name}>
                <span className="pm-badge">
                  <span className="pm-badge__dot" />
                  {t("websitePage.ecosystem.liveBadge")}
                </span>
                <b>{plugin.name}</b>
                <i>{plugin.text}</i>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal from="up" delay={0.16}>
          <p className="pm-eyebrow wbx-providers__title">
            {t("websitePage.ecosystem.providersTitle")}
          </p>
          <ul className="wbx-providers">
            {paymentProviders.map((provider) => (
              <li key={provider}>{provider}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

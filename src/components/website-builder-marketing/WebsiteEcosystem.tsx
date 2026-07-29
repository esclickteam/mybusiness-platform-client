import React from "react";
import { Puzzle } from "lucide-react";
import { Marquee, Reveal, SectionHeading } from "../product-marketing";
import {
  livePlugins,
  paymentProviders,
  pluginChips,
} from "./websiteMarketingData";
import "./websiteSections.css";

export default function WebsiteEcosystem() {
  const half = Math.ceil(pluginChips.length / 2);
  const rows = [pluginChips.slice(0, half), pluginChips.slice(half)];

  return (
    <section className="pm-section wbx">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Puzzle size={14} aria-hidden="true" />
              חנות התוספים
            </>
          }
          title={
            <>
              האתר מתחיל בעיצוב — וממשיך <span className="pm-grad">בתוספים</span>
            </>
          }
          lead="חנות התוספים מוסיפה לאתר יכולות שלמות: חנות ומכירה, יומן ותורים, טפסים, ביקורות, מועדון לקוחות, חשבוניות וכלי אנליטיקה. מתקינים בלחיצה ומנהלים מפאנל האתר."
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
                  רץ באתר החי
                </span>
                <b>{plugin.name}</b>
                <i>{plugin.text}</i>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal from="up" delay={0.16}>
          <p className="pm-eyebrow wbx-providers__title">
            ספקי תשלום לחיבור בחנות
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

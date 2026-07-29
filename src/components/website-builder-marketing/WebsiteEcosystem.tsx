import React from "react";
import { Puzzle } from "lucide-react";
import { Marquee, Reveal, SectionHeading } from "../product-marketing";
import { paymentProviders, pluginChips } from "./websiteMarketingData";
import "./websiteSections.css";

const LIVE_PLUGINS = [
  {
    name: "כלי נגישות BizUply",
    text: "ווידג׳ט נגישות שמופיע באתר שפורסם — התאמות ניגודיות, גופן ועוד.",
  },
  {
    name: "ספירה לאחור",
    text: "טיימר מבצע חי שמוטמע בסקשן ורץ מול המבקרים באתר.",
  },
  {
    name: "גלגל הטבות",
    text: "גלגל הטבות אינטראקטיבי לאיסוף פניות ולעידוד המרות.",
  },
  {
    name: "חיפוש חכם",
    text: "חיפוש פנימי באתר שמוצג כשכבה מעל התוכן שפורסם.",
  },
];

export default function WebsiteEcosystem() {
  const half = Math.ceil(pluginChips.length / 2);
  const rowOne = pluginChips.slice(0, half);
  const rowTwo = pluginChips.slice(half);

  return (
    <section
      className="pm-section pm-section--dark wbx"
      style={
        {
          "--pm-seam-top": "#f7f8fc",
          "--pm-seam-bottom": "#f7f8fc",
        } as React.CSSProperties
      }
    >
      <div className="pm-shell">
        <SectionHeading
          center
          accent="#c4b5fd"
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
          lead="חנות התוספים מוסיפה לאתר יכולות שלמות: חנות ומכירה, יומן ותורים, טפסים, ביקורות, מועדון לקוחות, חשבוניות, כלי אנליטיקה וכלי AI. מתקינים בלחיצה ומנהלים מפאנל האתר."
        />

        <div className="wbx-plugins">
          <Marquee duration={44}>
            {rowOne.map((plugin) => (
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
                <em style={{ fontStyle: "normal", opacity: 0.55 }}>
                  {plugin.category}
                </em>
              </span>
            ))}
          </Marquee>

          <Marquee duration={52} reverse>
            {rowTwo.map((plugin) => (
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
                <em style={{ fontStyle: "normal", opacity: 0.55 }}>
                  {plugin.category}
                </em>
              </span>
            ))}
          </Marquee>
        </div>

        <Reveal from="up" delay={0.1}>
          <ul className="wbx-live">
            {LIVE_PLUGINS.map((plugin) => (
              <li key={plugin.name}>
                <span className="pm-badge pm-badge--dark">
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
          <p
            className="pm-eyebrow"
            style={{ marginTop: "2.25rem", color: "#a5b4fc" }}
          >
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

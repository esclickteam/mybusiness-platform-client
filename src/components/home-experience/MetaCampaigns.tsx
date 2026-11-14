import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { campaignComparison } from "./campaignSwitch";
import { homeText } from "./homeCopy";
import "./metaCampaigns.css";

const CAMPAIGNS = [
  {
    id: "winter" as const,
    nameHe: "מבצע חורף",
    nameEn: "Winter offer",
    leads: 86,
    cost: 21.9,
    series: [8, 12, 15, 13, 18, 20, 22],
  },
  {
    id: "site" as const,
    nameHe: "לידים באתר",
    nameEn: "Website leads",
    leads: 120,
    cost: 16.4,
    series: [7, 12, 16, 15, 21, 27, 34],
  },
];

const DAYS = {
  he: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
};

function chart(values: number[]) {
  const width = 320;
  const height = 112;
  const max = 40;
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - (value / max) * (height - 10) - 4;
    return [x, y] as const;
  });
  const line = points.map((point) => point.join(",")).join(" ");
  const area = `M0,${height} L${points.map((point) => point.join(",")).join(" L")} L${width},${height} Z`;
  return { line, area };
}

export default function MetaCampaigns() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const [selectedId, setSelectedId] = useState<(typeof CAMPAIGNS)[number]["id"]>("site");
  const current = CAMPAIGNS.find((item) => item.id === selectedId) || CAMPAIGNS[1];
  const other = CAMPAIGNS.find((item) => item.id !== current.id) || CAMPAIGNS[0];
  const gap = campaignComparison(current, other);
  const shape = chart(current.series);
  const days = language.startsWith("he") || language.startsWith("iw") ? DAYS.he : DAYS.en;
  const money = (value: number) => `₪${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <section className="cs-section" id="meta" dir={dir} aria-labelledby="cs-title">
      <div className="cs-split">
        <div className="cs-copy">
          <p className="cs-kicker">Campaign Switch</p>
          <h2 id="cs-title">{text("עוברים בין קמפיינים ורואים את ההשפעה", "Switch campaigns and see the effect")}</h2>
          <p>{text("השוו שני קמפיינים לדוגמה וראו מה מביא יותר לידים בעלות נמוכה יותר. אין כאן חיבור למטה.", "Compare two sample campaigns and see which one brings more leads at a lower cost. Nothing here connects to Meta.")}</p>
        </div>
        <div className="cs-demo">
          <p className="cs-demo-tag">{text("נתוני הדגמה", "Demo data")}</p>
          <div className="cs-cards" role="tablist" aria-label={text("בחירת קמפיין", "Choose a campaign")}>
            {CAMPAIGNS.map((item) => (
              <button key={item.id} type="button" role="tab" aria-selected={item.id === current.id} className={item.id === current.id ? "is-on" : undefined} onClick={() => setSelectedId(item.id)}>
                <strong>{text(item.nameHe, item.nameEn)}</strong>
                <small>{item.leads} {text("לידים", "leads")} · {money(item.cost)} {text("לליד", "per lead")}</small>
              </button>
            ))}
          </div>
          <div className="cs-chart" dir="ltr" key={current.id}>
            <div className="cs-chart-top">
              <h3>{text("לידים לאורך זמן", "Leads over time")}</h3>
              <b>{current.leads}</b>
            </div>
            <svg viewBox="0 0 320 112" role="img" aria-label={text(current.nameHe, current.nameEn)}>
              <path d={shape.area} />
              <polyline points={shape.line} />
            </svg>
            <div className="cs-days">{days.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
          </div>
          <div className="cs-stats">
            <p><span>{text("סה״כ לידים", "Total leads")}</span><strong>{current.leads}</strong></p>
            <p><span>{text("עלות לליד", "Cost per lead")}</span><strong>{money(current.cost)}</strong></p>
          </div>
          <p className="cs-insight" role="status">
            {gap.leadGap > 0
              ? text(`תובנה: ${text(current.nameHe, current.nameEn)} מביא ${gap.leadGap}% יותר לידים, בעלות נמוכה ב־${gap.costGap}%.`, `Insight: ${text(current.nameHe, current.nameEn)} — ${gap.leadGap}% more leads, at a ${gap.costGap}% lower cost.`)
              : text(`תובנה: ${text(current.nameHe, current.nameEn)} מביא פחות לידים, ועלות הליד גבוהה יותר.`, `Insight: ${text(current.nameHe, current.nameEn)} — fewer leads, and a higher cost per lead.`)}
          </p>
        </div>
      </div>
    </section>
  );
}

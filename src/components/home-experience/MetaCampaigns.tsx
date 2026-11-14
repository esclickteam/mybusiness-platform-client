import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { campaignComparison } from "./campaignSwitch";
import { homeText } from "./homeCopy";
import "./metaCampaigns.css";

const CAMPAIGNS = [
  {
    id: "site" as const,
    nameHe: "לידים באתר",
    nameEn: "Website leads",
    leads: 120,
    cost: 16.4,
    series: [8, 12, 15, 18, 22, 27, 34],
    icon: "cursor" as const,
  },
  {
    id: "winter" as const,
    nameHe: "מבצע חורף",
    nameEn: "Winter offer",
    leads: 86,
    cost: 21.9,
    series: [8, 12, 15, 13, 18, 20, 22],
    icon: "snow" as const,
  },
];

const DAYS = {
  he: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
};

function smoothLine(points: Array<readonly [number, number]>) {
  let path = `M${points[0][0]},${points[0][1]}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] || points[index];
    const current = points[index];
    const next = points[index + 1];
    const after = points[index + 2] || next;
    const controlA: [number, number] = [current[0] + (next[0] - previous[0]) / 6, current[1] + (next[1] - previous[1]) / 6];
    const controlB: [number, number] = [next[0] - (after[0] - current[0]) / 6, next[1] - (after[1] - current[1]) / 6];
    path += ` C${controlA[0]},${controlA[1]} ${controlB[0]},${controlB[1]} ${next[0]},${next[1]}`;
  }
  return path;
}

function chart(values: number[]) {
  const width = 380;
  const height = 228;
  const padLeft = 32;
  const padRight = 14;
  const padTop = 14;
  const padBottom = 8;
  const max = 40;
  const innerWidth = width - padLeft - padRight;
  const innerHeight = height - padTop - padBottom;
  const points = values.map((value, index) => {
    const x = padLeft + (index / (values.length - 1)) * innerWidth;
    const y = padTop + innerHeight - (value / max) * innerHeight;
    return [x, y] as const;
  });
  const line = smoothLine(points);
  const area = `${line} L${points[points.length - 1][0]},${height - padBottom} L${points[0][0]},${height - padBottom} Z`;
  const grid = [0, 10, 20, 30, 40].map((mark) => {
    const y = padTop + innerHeight - (mark / max) * innerHeight;
    return { mark, y };
  });
  return { line, area, points, grid, width, height, padLeft };
}

function Snowflake() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M4 12h16M7 4.5l5 4 5-4M7 19.5l5-4 5 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3.5l6.2 16.2 2.2-6.1 6.1-2.2L5 3.5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5S14 16 14.5 19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="16.5" cy="8.5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 14.6c2.2.3 3.8 1.6 4.4 4.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.4l1.7 6.2 6.4.5-5 4.1 1.6 6.4L12 15.2 7.3 18.6l1.6-6.4-5-4.1 6.4-.5L12 1.4z" fill="currentColor" />
    </svg>
  );
}

export default function MetaCampaigns() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const [selectedId, setSelectedId] = useState<(typeof CAMPAIGNS)[number]["id"]>("site");
  const current = CAMPAIGNS.find((item) => item.id === selectedId) || CAMPAIGNS[0];
  const other = CAMPAIGNS.find((item) => item.id !== current.id) || CAMPAIGNS[1];
  const gap = campaignComparison(current, other);
  const shape = chart(current.series);
  const days = language.startsWith("he") || language.startsWith("iw") ? DAYS.he : DAYS.en;
  const money = (value: number) => `₪${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const name = text(current.nameHe, current.nameEn);
  const insight = gap.leadGap > 0
    ? text(`תובנה: ${name} מביא ${gap.leadGap}% יותר לידים, בעלות נמוכה ב־${gap.costGap}%.`, `Insight: ${name} — ${gap.leadGap}% more leads, at a ${gap.costGap}% lower cost.`)
    : text(`תובנה: ${name} מביא פחות לידים, ועלות הליד גבוהה יותר.`, `Insight: ${name} — fewer leads, and a higher cost per lead.`);

  return (
    <section className="cs-section" id="meta" dir={dir} aria-labelledby="cs-title">
      <div className="cs-split">
        <div className="cs-copy">
          <p className="cs-kicker">Campaign Switch</p>
          <h2 id="cs-title">
            {text("עוברים בין קמפיינים", "Switch campaigns")}
            <span>{text("ורואים את ההשפעה", "and see the effect")}</span>
          </h2>
          <p>{text("השוו שני קמפיינים לדוגמה וראו מה מביא יותר לידים בעלות נמוכה יותר. אין כאן חיבור למטה.", "Compare two sample campaigns and see which one brings more leads at a lower cost. Nothing here connects to Meta.")}</p>
        </div>
        <div className="cs-demo">
          <p className="cs-demo-tag">{text("נתוני הדגמה", "Demo data")}</p>
          <div className="cs-switch" role="tablist" aria-label={text("בחירת קמפיין", "Choose a campaign")}>
            {CAMPAIGNS.map((item, index) => (
              <span key={item.id} className="cs-switch-slot" style={{ order: index === 0 ? 1 : 3 }}>
                <button type="button" role="tab" aria-selected={item.id === current.id} className={item.id === current.id ? "cs-card is-on" : "cs-card"} onClick={() => setSelectedId(item.id)}>
                  <span className="cs-card-top">
                    <strong>{text(item.nameHe, item.nameEn)}</strong>
                    <span className="cs-ico">{item.icon === "snow" ? <Snowflake /> : <CursorIcon />}</span>
                  </span>
                  <small>
                    <span>{item.leads} {text("לידים", "leads")}</span>
                    <span>{money(item.cost)} {text("לליד", "per lead")}</span>
                  </small>
                  {item.id === current.id ? <span className="cs-badge" aria-hidden="true">✓</span> : null}
                </button>
              </span>
            ))}
            <button type="button" className={`cs-toggle ${current.id === "site" ? "is-site" : "is-winter"}`} onClick={() => setSelectedId(current.id === "site" ? "winter" : "site")} aria-label={text("מעבר בין הקמפיינים", "Switch campaign")}>
              <span aria-hidden="true">‹‹‹</span>
              <i />
              <span aria-hidden="true">›››</span>
            </button>
          </div>
          <div className={`cs-arrow ${current.id === "winter" ? "is-winter" : "is-site"}`} aria-hidden="true">
            <svg viewBox="0 0 46 28"><path d="M8 4c8 16 18 18 30 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /><path d="M31 14l8 6-8 2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="cs-body" key={current.id}>
            <aside className="cs-metrics">
              <p>
                <span>{text("סה״כ לידים", "Total leads")}</span>
                <strong>{current.leads}</strong>
                <i className="cs-people"><PeopleIcon /></i>
              </p>
              <p>
                <span>{text("עלות לליד", "Cost per lead")}</span>
                <strong>{money(current.cost)}</strong>
              </p>
            </aside>
            <div className="cs-chart" dir="ltr">
              <div className="cs-chart-top">
                <p><i />{name}</p>
                <h3>{text("לידים לאורך זמן", "Leads over time")}</h3>
              </div>
              <svg viewBox={`0 0 ${shape.width} ${shape.height}`} role="img" aria-label={name}>
                <defs>
                  <linearGradient id="cs-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
                  </linearGradient>
                </defs>
                {shape.grid.map((line) => (
                  <g key={line.mark}>
                    <line x1={shape.padLeft} x2={shape.width - 8} y1={line.y} y2={line.y} />
                    <text x="2" y={line.y + 4}>{line.mark}</text>
                  </g>
                ))}
                <path className="cs-area" d={shape.area} fill="url(#cs-area)" />
                <path className="cs-line" d={shape.line} />
                <circle cx={shape.points[shape.points.length - 1][0]} cy={shape.points[shape.points.length - 1][1]} r="5" />
              </svg>
              <div className="cs-days">{days.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
            </div>
          </div>
          <p className="cs-insight" role="status">
            <Spark />
            <span>{insight}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

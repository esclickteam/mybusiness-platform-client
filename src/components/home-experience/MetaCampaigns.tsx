import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "./homeCopy";
import "./metaCampaigns.css";

type Metric = "leads" | "cost" | "rate";
type CampaignId = "a" | "b" | "c";

type Campaign = {
  id: CampaignId;
  nameHe: string;
  nameEn: string;
  leads: number;
  cost: number;
  rate: number;
  spend: number;
  statusHe: string;
  statusEn: string;
  active: boolean;
  series: Record<Metric, number[]>;
  insightHe: string;
  insightEn: string;
};

const DAYS = ["1", "5", "9", "13", "17", "21", "25", "29"];

const CAMPAIGNS: Campaign[] = [
  {
    id: "a",
    nameHe: "קמפיין A — השקת מוצר",
    nameEn: "Campaign A — Product launch",
    leads: 182,
    cost: 34.2,
    rate: 11.4,
    spend: 6224,
    statusHe: "פעיל",
    statusEn: "Active",
    active: true,
    series: {
      leads: [6, 9, 12, 15, 18, 22, 28, 34],
      cost: [46, 43, 40, 38, 36, 35, 34, 34],
      rate: [6.2, 7.4, 8.1, 9, 9.8, 10.4, 11, 11.4],
    },
    insightHe: "קמפיין A מביא יותר לידים בעלות נמוכה יותר. עלות הליד נמוכה ב־23% מקמפיין B בתקופה הזו.",
    insightEn: "Campaign A brings more leads at a lower cost. Cost per lead is 23% below Campaign B in this period.",
  },
  {
    id: "b",
    nameHe: "קמפיין B — לידים כלליים",
    nameEn: "Campaign B — General leads",
    leads: 102,
    cost: 43.9,
    rate: 7.9,
    spend: 4478,
    statusHe: "פעיל",
    statusEn: "Active",
    active: true,
    series: {
      leads: [4, 6, 8, 10, 12, 14, 16, 18],
      cost: [52, 50, 48, 47, 46, 45, 44, 44],
      rate: [4.1, 4.8, 5.4, 6, 6.6, 7.1, 7.6, 7.9],
    },
    insightHe: "קמפיין B יציב, אבל עלות הליד גבוהה יותר. בהדגמה הוא נשאר פעיל בלי שינוי במטה.",
    insightEn: "Campaign B is steady, but the cost per lead is higher. In the demo it stays active with no change in Meta.",
  },
  {
    id: "c",
    nameHe: "קמפיין C — רימרקטינג",
    nameEn: "Campaign C — Remarketing",
    leads: 56,
    cost: 51.8,
    rate: 6.2,
    spend: 2901,
    statusHe: "מושהה",
    statusEn: "Paused",
    active: false,
    series: {
      leads: [3, 4, 5, 6, 7, 8, 8, 9],
      cost: [58, 56, 55, 54, 53, 52, 52, 52],
      rate: [3.2, 3.8, 4.4, 5, 5.4, 5.8, 6, 6.2],
    },
    insightHe: "קמפיין C מושהה בהדגמה. העלות גבוהה והנפח נמוך, בלי פעולה אמיתית בקמפיין.",
    insightEn: "Campaign C is paused in the demo. The cost is high and the volume is low, with no live campaign change.",
  },
];

function line(values: number[], max: number) {
  const width = 540;
  const height = 168;
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - (value / max) * (height - 16) - 8;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export default function MetaCampaigns() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const [metric, setMetric] = useState<Metric>("leads");
  const [selectedId, setSelectedId] = useState<CampaignId>("a");
  const selected = CAMPAIGNS.find((item) => item.id === selectedId) || CAMPAIGNS[0];
  const compared = CAMPAIGNS.filter((item) => item.id !== "c");
  const max = Math.max(...compared.flatMap((item) => item.series[metric])) * 1.18;
  const totals = { leads: 284, spend: 10650 };
  const metricLabel = (id: Metric) => text(id === "leads" ? "לידים" : id === "cost" ? "עלות לליד" : "שיעור המרה", id === "leads" ? "Leads" : id === "cost" ? "Cost per lead" : "Conversion");
  const money = (value: number) => `₪${value.toLocaleString("en-US", { minimumFractionDigits: value < 100 ? 2 : 0, maximumFractionDigits: value < 100 ? 2 : 0 })}`;

  return (
    <section className="mc-section" id="meta" dir={dir} aria-labelledby="mc-title">
      <div className="mc-wrap">
        <header className="mc-head">
          <p className="mc-kicker">Meta Campaigns</p>
          <h2 id="mc-title">{text("מטא וקמפיינים", "Meta and campaigns")}</h2>
          <p>{text("השוואת קמפיינים, לידים ותובנה אחת. הכול בנתוני הדגמה, בלי חיבור למטה.", "A campaign comparison, leads and one insight. All of it uses demo figures, with no Meta connection.")}</p>
        </header>

        <div className="mc-app">
          <div className="mc-bar">
            <span className="mc-demo">{text("נתוני הדגמה", "Demo data")}</span>
            <label>
              <span>{text("קמפיין", "Campaign")}</span>
              <select value={selectedId} aria-label={text("בחירת קמפיין", "Choose a campaign")} onChange={(event) => setSelectedId(event.target.value as CampaignId)}>
                {CAMPAIGNS.map((item) => <option key={item.id} value={item.id}>{text(item.nameHe, item.nameEn)}</option>)}
              </select>
            </label>
            <bdi className="mc-range" dir="ltr">1–31 Jan 2025</bdi>
          </div>

          <ul className="mc-metrics">
            <li><span>{text("לידים", "Leads")}</span><strong>{totals.leads}</strong></li>
            <li><span>{text("עלות לליד", "Cost per lead")}</span><strong>{money(37.5)}</strong></li>
            <li><span>{text("שיעור המרה", "Conversion")}</span><strong>9.8%</strong></li>
            <li><span>{text("הוצאה", "Spend")}</span><strong>{money(totals.spend)}</strong></li>
          </ul>

          <div className="mc-stage">
            <aside className="mc-insight">
              <p>{text("תובנה מרכזית", "Key insight")}</p>
              <h3>{text(selected.nameHe, selected.nameEn)}</h3>
              <strong>{text(selected.insightHe, selected.insightEn)}</strong>
            </aside>
            <div className="mc-chart">
              <div className="mc-chart-top">
                <h3>{text("השוואת ביצועים", "Performance comparison")}</h3>
                <div role="tablist" aria-label={text("מדד בגרף", "Chart metric")}>
                  {(["leads", "cost", "rate"] as Metric[]).map((id) => (
                    <button key={id} type="button" role="tab" aria-selected={metric === id} className={metric === id ? "is-on" : undefined} onClick={() => setMetric(id)}>
                      {metricLabel(id)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mc-plot" dir="ltr">
              <svg viewBox="0 0 560 200" role="img" aria-label={text("גרף השוואה בין קמפיין A לקמפיין B", "Comparison chart for Campaign A and Campaign B")}>
                {[0, 1, 2, 3].map((row) => <line key={row} x1="0" x2="560" y1={20 + row * 48} y2={20 + row * 48} />)}
                {compared.map((item) => (
                  <polyline key={item.id} className={item.id === "a" ? "is-a" : "is-b"} points={line(item.series[metric], max)} data-on={item.id === selectedId ? "true" : "false"} />
                ))}
                {compared.map((item) => {
                  const last = item.series[metric][item.series[metric].length - 1];
                  const y = 168 - (last / max) * 152 - 8;
                  return <circle key={item.id} className={item.id === "a" ? "is-a" : "is-b"} cx="540" cy={y} r={item.id === selectedId ? 5.5 : 4} />;
                })}
              </svg>
              <div className="mc-axis">
                {DAYS.map((day) => <span key={day}>{day}</span>)}
              </div>
              </div>
              <p className="mc-legend">
                <i className="is-a" />{text("קמפיין A", "Campaign A")}
                <i className="is-b" />{text("קמפיין B", "Campaign B")}
                <b>{metricLabel(metric)} · {text(selected.nameHe, selected.nameEn)}</b>
              </p>
            </div>
          </div>

          <div className="mc-bottom">
            <div className="mc-table">
              <h3>{text("רשימת קמפיינים", "Campaign list")}</h3>
              <ul>
                {CAMPAIGNS.map((item) => (
                  <li key={item.id}>
                    <button type="button" className={item.id === selectedId ? "is-on" : undefined} aria-pressed={item.id === selectedId} onClick={() => setSelectedId(item.id)}>
                      <strong>{text(item.nameHe, item.nameEn)}</strong>
                      <span>{item.leads} {text("לידים", "leads")}</span>
                      <span>{money(item.cost)}</span>
                      <span>{item.rate}%</span>
                      <em className={item.active ? "is-live" : undefined}>{text(item.statusHe, item.statusEn)}</em>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mc-path">
              <h3>{text("מסלול ליד ל־CRM", "Lead path into the CRM")}</h3>
              <p>{text("המחשה בלבד. לא נוצר ליד ולא נכתב למסד.", "Illustration only. No lead was created and nothing was written to the database.")}</p>
              <div>
                <article>
                  <b>Meta</b>
                  <strong>{text("דנה לוי", "Dana Miller")}</strong>
                  <small><bdi dir="ltr">dana.miller@example.com</bdi></small>
                </article>
                <span>{text("העברה בהדגמה", "Demo handoff")}</span>
                <article className="is-crm">
                  <b>Bizuply CRM</b>
                  <strong>{text("דנה לוי", "Dana Miller")}</strong>
                  <small>{text("הליד מוצג בהדגמה", "The lead is shown in the demo")}</small>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

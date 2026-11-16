import { useEffect, useState } from "react";
import API from "../../../api";

type Named = { name: string; count: number };
type Summary = {
  enabled: boolean;
  retentionDays: number;
  rangeDays: number;
  separateFromSearchConsole: boolean;
  gsc: { connected: boolean; reason: string };
  totals: null | {
    contentViews: number;
    uniqueConsentedVisitors: number;
    returningConsentedVisitors: number;
    templateDownloads: number;
    calculatorUses: number;
    productClicks: number;
    pricingClicks: number;
    contentSignups: number;
    conversionDenominator: string;
    conversionRate: number | null;
  };
  topPages?: Named[];
  downloads?: Named[];
  calculators?: Named[];
  byLocale?: Named[];
  byContentType?: Named[];
  byCountry?: Named[];
  byEvent?: Named[];
};

const EVENT_LABELS: Record<string, string> = {
  resource_view: "צפייה במשאב",
  guide_view: "צפייה במדריך",
  guide_product_click: "לחיצה למוצר ממדריך",
  template_download: "הורדת תבנית",
  calculator_use: "שימוש במחשבון",
  pricing_click: "לחיצה למחירון",
  content_signup: "הרשמה מתוכן",
};

const RANGES = [7, 30, 90];

function layoutPreview(): "off" | "empty" | "sample" | "" {
  if (!import.meta.env.DEV || typeof window === "undefined") return "";
  const value = new URLSearchParams(window.location.search).get("preview");
  return value === "off" || value === "empty" || value === "sample" ? value : "";
}

function previewSummary(kind: "off" | "empty" | "sample", days: number): Summary {
  if (kind === "off") {
    return {
      enabled: false,
      retentionDays: 180,
      rangeDays: days,
      separateFromSearchConsole: true,
      gsc: { connected: false, reason: "no_search_console_session" },
      totals: null,
    };
  }
  const zero = kind === "empty";
  const count = (value: number) => (zero ? 0 : value);
  return {
    enabled: true,
    retentionDays: 180,
    rangeDays: days,
    separateFromSearchConsole: true,
    gsc: { connected: false, reason: "no_search_console_session" },
    totals: {
      contentViews: count(12),
      uniqueConsentedVisitors: count(5),
      returningConsentedVisitors: count(2),
      templateDownloads: count(3),
      calculatorUses: count(4),
      productClicks: count(2),
      pricingClicks: count(1),
      contentSignups: count(1),
      conversionDenominator: "unique consented visitors who viewed a content page in the range",
      conversionRate: zero ? null : 0.2,
    },
    topPages: zero ? [] : [{ name: "/guides/what-is-a-crm", count: 7 }, { name: "/he/resources", count: 5 }],
    downloads: zero ? [] : [{ name: "bizuply-lead-tracker.xlsx", count: 3 }],
    calculators: zero ? [] : [{ name: "conversion", count: 4 }],
    byLocale: zero ? [] : [{ name: "he", count: 8 }, { name: "en", count: 4 }],
    byContentType: zero ? [] : [{ name: "guide", count: 7 }, { name: "resource", count: 5 }],
    byCountry: zero ? [] : [{ name: "IL", count: 9 }],
    byEvent: [
      "resource_view",
      "guide_view",
      "guide_product_click",
      "template_download",
      "calculator_use",
      "pricing_click",
      "content_signup",
    ].map((name, index) => ({ name, count: zero ? 0 : [5, 7, 2, 3, 4, 1, 1][index] })),
  };
}

function List({ title, rows }: { title: string; rows: Named[] }) {
  return (
    <section className="content-analytics__card">
      <h2>{title}</h2>
      {rows.length ? (
        <ul>
          {rows.map((row) => (
            <li key={row.name}><span>{row.name}</span><strong>{row.count}</strong></li>
          ))}
        </ul>
      ) : <p>אין רשומות בטווח הזה.</p>}
    </section>
  );
}

export default function ContentAnalyticsPage() {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const preview = layoutPreview();

  useEffect(() => {
    if (preview) {
      setSummary(previewSummary(preview, days));
      setError("");
      return undefined;
    }
    let cancelled = false;
    setError("");
    API.get<Summary>("/admin/public-analytics/summary", { params: { days } })
      .then((response) => {
        if (!cancelled) setSummary(response.data);
      })
      .catch(() => {
        if (!cancelled) setError("לא ניתן לטעון את דוח התוכן.");
      });
    return () => {
      cancelled = true;
    };
  }, [days, preview]);

  const totals = summary?.totals;
  const rate = totals?.conversionRate == null ? "—" : `${Math.round(totals.conversionRate * 1000) / 10}%`;

  return (
    <main className="content-analytics" dir="rtl">
      <header>
        <h1>ביצועי התוכן</h1>
        <p>הנתונים כאן הם אירועים פנימיים של האתר הציבורי, רק ממבקרים שאישרו מדידה. הם אינם מספרי <bdi>Search Console</bdi>.</p>
        {preview ? <p className="content-analytics__off">תצוגת מבנה לבדיקה. אלה אינם נתוני bizuply.com.</p> : null}
      </header>
      <div className="content-analytics__ranges">
        {RANGES.map((range) => (
          <button key={range} type="button" aria-pressed={days === range} onClick={() => setDays(range)}>
            {range} ימים
          </button>
        ))}
      </div>
      {error ? <p className="content-analytics__error">{error}</p> : null}
      {summary && !summary.enabled ? (
        <p className="content-analytics__off">המדידה כבויה. לא נאספים אירועים ולא מוצגים מספרי מבקרים.</p>
      ) : null}
      {totals ? (
        <section className="content-analytics__events" aria-label="שבעת האירועים">
          {(summary?.byEvent || []).map((row) => (
            <article key={row.name}>
              <span>{EVENT_LABELS[row.name] || row.name}</span>
              <strong>{row.count}</strong>
            </article>
          ))}
        </section>
      ) : null}
      {totals ? (
        <section className="content-analytics__stats">
          <article><span>צפיות בתוכן</span><strong>{totals.contentViews}</strong></article>
          <article><span>מבקרים שאישרו מדידה</span><strong>{totals.uniqueConsentedVisitors}</strong></article>
          <article><span>מבקרים חוזרים</span><strong>{totals.returningConsentedVisitors}</strong></article>
          <article><span>הורדות תבניות</span><strong>{totals.templateDownloads}</strong></article>
          <article><span>שימוש במחשבונים</span><strong>{totals.calculatorUses}</strong></article>
          <article><span>לחיצות למוצרים</span><strong>{totals.productClicks}</strong></article>
          <article><span>לחיצות למחירון</span><strong>{totals.pricingClicks}</strong></article>
          <article><span>הרשמות מתוכן</span><strong>{totals.contentSignups}</strong></article>
          <article><span>שיעור המרה</span><strong>{rate}</strong><small>מכנה: מבקרים ייחודיים שאישרו מדידה וצפו בעמוד תוכן בטווח</small></article>
        </section>
      ) : null}
      {totals ? (
        <div className="content-analytics__grid">
          <List title="עמודים מובילים" rows={summary.topPages || []} />
          <List title="הורדות" rows={summary.downloads || []} />
          <List title="מחשבונים" rows={summary.calculators || []} />
          <List title="לפי שפה" rows={summary.byLocale || []} />
          <List title="לפי סוג תוכן" rows={summary.byContentType || []} />
          <List title="לפי מדינה של אירועים פנימיים" rows={summary.byCountry || []} />
        </div>
      ) : null}
      <section className="content-analytics__gsc">
        <h2>Search Console</h2>
        <p>החיבור לא נפתח מהשרת הזה. אין כאן חשיפות, קליקים, <bdi>CTR</bdi> או עמודים מאונדקסים.</p>
        <p>המספרים למעלה, כשהמדידה פעילה, נשארים בנפרד מהדוח של <bdi>Google</bdi>.</p>
      </section>
      <style>{`
        .content-analytics { max-width: 1080px; margin: 0 auto; padding: 28px 16px 64px; color: #1e1b4b; }
        .content-analytics h1 { margin: 0 0 8px; font-size: 32px; }
        .content-analytics__ranges { display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0; }
        .content-analytics button { border: 1px solid #6d28d9; background: #fff; color: #6d28d9; border-radius: 2px; min-height: 44px; padding: 8px 14px; }
        .content-analytics button[aria-pressed="true"] { background: #6d28d9; color: #fff; }
        .content-analytics__off, .content-analytics__error, .content-analytics__gsc { background: #f5f3ff; padding: 16px; border: 1px solid #ddd6fe; }
        .content-analytics__events, .content-analytics__stats, .content-analytics__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 16px 0; }
        .content-analytics__events article, .content-analytics__stats article, .content-analytics__card { border: 1px solid #e9e5ff; padding: 14px; background: #fff; overflow-wrap: anywhere; }
        .content-analytics__events strong, .content-analytics__stats strong { display: block; font-size: 28px; color: #6d28d9; }
        .content-analytics__card ul { list-style: none; padding: 0; margin: 0; }
        .content-analytics__card li { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; border-bottom: 1px solid #f3f0ff; }
        .content-analytics__gsc { margin-top: 20px; }
        @media (max-width: 640px) {
          .content-analytics h1 { font-size: 26px; }
          .content-analytics__events strong, .content-analytics__stats strong { font-size: 22px; }
        }
      `}</style>
    </main>
  );
}

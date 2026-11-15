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
};

const RANGES = [7, 30, 90];

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

  useEffect(() => {
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
  }, [days]);

  const totals = summary?.totals;
  const rate = totals?.conversionRate == null ? "—" : `${Math.round(totals.conversionRate * 1000) / 10}%`;

  return (
    <main className="content-analytics" dir="rtl">
      <header>
        <h1>ביצועי התוכן</h1>
        <p>הנתונים כאן הם אירועים פנימיים של האתר הציבורי, רק ממבקרים שאישרו מדידה. הם אינם מספרי Search Console.</p>
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
        <p>החיבור לא נפתח מהשרת הזה. אין כאן חשיפות, קליקים, CTR או עמודים מאונדקסים.</p>
        <p>המספרים למעלה, כשהמדידה פעילה, נשארים בנפרד מהדוח של Google.</p>
      </section>
      <style>{`
        .content-analytics { max-width: 1080px; margin: 0 auto; padding: 28px 20px 64px; color: #1e1b4b; }
        .content-analytics h1 { margin: 0 0 8px; font-size: 32px; }
        .content-analytics__ranges { display: flex; gap: 8px; margin: 20px 0; }
        .content-analytics button { border: 1px solid #6d28d9; background: #fff; color: #6d28d9; border-radius: 2px; padding: 8px 14px; }
        .content-analytics button[aria-pressed="true"] { background: #6d28d9; color: #fff; }
        .content-analytics__off, .content-analytics__error, .content-analytics__gsc { background: #f5f3ff; padding: 16px; border: 1px solid #ddd6fe; }
        .content-analytics__stats, .content-analytics__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 16px 0; }
        .content-analytics__stats article, .content-analytics__card { border: 1px solid #e9e5ff; padding: 14px; background: #fff; }
        .content-analytics__stats strong { display: block; font-size: 28px; color: #6d28d9; }
        .content-analytics__card ul { list-style: none; padding: 0; margin: 0; }
        .content-analytics__card li { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; border-bottom: 1px solid #f3f0ff; }
        .content-analytics__gsc { margin-top: 20px; }
      `}</style>
    </main>
  );
}

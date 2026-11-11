import React from "react";

type Metrics = {
  impressions: number | null;
  clicks: number | null;
  ctr: number | null;
  averagePosition: number | null;
};

type Checkpoint = Metrics & {
  day: number;
  dateLabel: string;
  verdict: string;
  rankingUrl: string | null;
};

export type SeoChangeTracking = {
  title: string;
  noteHe: string;
  phrases: Array<{
    id: string;
    query: string;
    targetUrl: string;
    changeDateLabel: string;
    baseline: Metrics;
    baselineRankingUrl: string | null;
    cannibalization: string;
    checkpoints: Checkpoint[];
  }>;
};

function metric(value: number | null | undefined) {
  return value == null ? "—" : String(value);
}

function ctr(value: number | null | undefined) {
  if (value == null) return "—";
  return `${(value * 100).toFixed(2)}%`;
}

function position(value: number | null | undefined) {
  return value == null ? "—" : value.toFixed(1);
}

export default function SeoChangeTrackingPanel({
  data,
}: {
  data: SeoChangeTracking | null;
}) {
  return (
    <section>
      <h2>מעקב שינויי SEO — 7 / 14 / 28 ימים</h2>
      <p className="geo-note">
        {data?.noteHe ||
          "ה-baseline קפוא. כל עוד אין שורות Search Console מתאריך אחרי 11.11.2026, הבדיקה נשארת «עדיין מוקדם למדוד». המדידה לא משנה את האתר."}
      </p>
      <div className="geo-table-wrap">
        <table className="geo-table geo-seo-tracking">
          <thead>
            <tr>
              <th>מילת המפתח</th>
              <th>URL יעד</th>
              <th>תאריך השינוי</th>
              <th>baseline — חשיפות</th>
              <th>baseline — קליקים</th>
              <th>baseline — CTR</th>
              <th>baseline — מיקום</th>
              <th>URL ש־Google הציג ב־baseline</th>
              <th>קניבליזציה</th>
              <th>בדיקת 7 ימים — 18.11.2026</th>
              <th>בדיקת 14 ימים — 25.11.2026</th>
              <th>בדיקת 28 ימים — 09.12.2026</th>
            </tr>
          </thead>
          <tbody>
            {(data?.phrases || []).map((phrase) => (
              <tr key={phrase.id}>
                <td>{phrase.query}</td>
                <td dir="ltr">{phrase.targetUrl}</td>
                <td>11.11.2026</td>
                <td>{metric(phrase.baseline.impressions)}</td>
                <td>{metric(phrase.baseline.clicks)}</td>
                <td>{ctr(phrase.baseline.ctr)}</td>
                <td>{position(phrase.baseline.averagePosition)}</td>
                <td dir="ltr">{phrase.baselineRankingUrl || "—"}</td>
                <td>{phrase.cannibalization}</td>
                {phrase.checkpoints.map((point) => (
                  <td key={point.day}>
                    <strong>{point.verdict}</strong>
                    {point.verdict === "עדיין מוקדם למדוד" ? null : (
                      <div className="geo-kpi-sub">
                        חשיפות {metric(point.impressions)} · קליקים {metric(point.clicks)}
                        <br />
                        CTR {ctr(point.ctr)} · מיקום {position(point.averagePosition)}
                        <br />
                        <span dir="ltr">{point.rankingUrl || "—"}</span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

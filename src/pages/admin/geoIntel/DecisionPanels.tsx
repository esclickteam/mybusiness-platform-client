import React, { useState } from "react";
import { geoGet, geoPost } from "./geoApi";
import { computeDisplayPct, formatUnmeasured } from "./decisionFormat";

function AwaitBox({ message }: { message?: string | null }) {
  return (
    <div className="geo-intel-banner" role="status">
      {message || "ממתין לנתונים שנמדדו — אין נתונים מומצאים."}
    </div>
  );
}

const fmtPct = computeDisplayPct;
const fmtNum = formatUnmeasured;

export function DecisionBrief({ weekly }: { weekly: any }) {
  if (!weekly) return <AwaitBox message="טוען סיכום החלטות…" />;
  return (
    <div className="geo-decision-brief" aria-label="סיכום החלטות">
      <div>
        <span className="geo-decision-q">מה השתנה?</span>
        <strong>{weekly.whatChangedHe || "לא נמדד"}</strong>
      </div>
      <div>
        <span className="geo-decision-q">מה הבעיה?</span>
        <strong>{weekly.problemHe || "לא נמדד"}</strong>
      </div>
      <div>
        <span className="geo-decision-q">מה כדאי לעשות עכשיו?</span>
        <strong>{weekly.doNowHe || "—"}</strong>
      </div>
      <div>
        <span className="geo-decision-q">האם מה שעשינו קודם עזר?</span>
        <strong>{weekly.helpedHe || "לא נמדד"}</strong>
      </div>
    </div>
  );
}

export function WeeklyActionsPanel({ data }: { data: any }) {
  if (!data) return <AwaitBox />;
  if (data.awaitingData) return <AwaitBox message={data.messageHe} />;
  return (
    <section className="geo-decision-panel">
      <header className="geo-decision-head">
        <h2>{data.titleHe || "מה כדאי לעשות השבוע"}</h2>
        <p className="geo-note">{data.disclaimerHe}</p>
      </header>
      <div className="geo-decision-list">
        {(data.actions || []).map((a: any) => (
          <article key={a.id} className="geo-decision-item">
            <div className="geo-decision-item-top">
              <span className="geo-pill-rect">{a.brand?.name}</span>
              <span className="geo-pill-rect muted">{a.kindHe}</span>
              <span className="geo-pill-rect">{a.statusHe}</span>
              <span className="geo-pill-rect muted">מאמץ: {a.effortHe}</span>
            </div>
            <h3>{a.queryOrQuestion}</h3>
            <p>
              <strong>עמוד:</strong> {a.pagePath || "לא נמדד"}
            </p>
            <p>
              <strong>למה עכשיו:</strong> {a.whyNowHe}
            </p>
            <p>
              <strong>השפעה צפויה:</strong> {a.expectedImpactHe} ·{" "}
              <strong>ביטחון:</strong> {a.confidenceHe}
            </p>
            <div className="geo-evidence-block">
              <div>
                <em>מה נמדד:</em> {a.evidence?.measuredHe || "לא נמדד"}
              </div>
              <div>
                <em>השערה:</em> {a.evidence?.hypothesisHe || "—"}
              </div>
              <div>
                <em>המלצה:</em> {a.evidence?.recommendationHe || "—"}
              </div>
            </div>
            {a.internalPriority ? (
              <details className="geo-score-details">
                <summary>
                  {a.internalPriority.labelHe}: {a.internalPriority.score}{" "}
                  (פנימי בלבד)
                </summary>
                <p className="geo-note">{a.internalPriority.disclaimerHe}</p>
                <ul>
                  {(a.internalPriority.factors || []).map((f: any) => (
                    <li key={f.id}>
                      {f.labelHe}: {f.points} — {f.detailHe}
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

const GSC_FILTERS: Array<{ id: string; label: string }> = [
  { id: "all", label: "הכל" },
  { id: "pos_1_5", label: "מיקום 1–5" },
  { id: "pos_5_10", label: "מיקום 5–10" },
  { id: "pos_10_20", label: "מיקום 10–20" },
  { id: "pos_20_50", label: "מיקום 20–50" },
  { id: "high_imp_weak_ctr", label: "הרבה חשיפות + CTR חלש" },
  { id: "zero_clicks", label: "ללא קליקים" },
  { id: "cannibalization", label: "קניבליזציה" },
  { id: "service_vs_guide", label: "עמודי שירות מול מדריכים" },
  { id: "quick_wins", label: "הזדמנויות מהירות" },
];

export function GscOpportunitiesPanel({
  brandId,
  data,
  onFilter,
  filter,
}: {
  brandId: string;
  data: any;
  filter: string;
  onFilter: (f: string) => void;
}) {
  if (!data) return <AwaitBox />;
  if (data.awaitingData) return <AwaitBox message={data.messageHe} />;
  return (
    <section className="geo-decision-panel">
      <header className="geo-decision-head">
        <h2>הזדמנויות בחיפוש</h2>
        <p className="geo-note">{data.disclaimerHe}</p>
      </header>
      <div className="geo-filter-row">
        {GSC_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`geo-filter-btn${filter === f.id ? " active" : ""}`}
            onClick={() => onFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {filter !== "quick_wins" && (data.quickWins || []).length ? (
        <div className="geo-quick-wins">
          <h3>הזדמנויות מהירות</h3>
          <p className="geo-note">
            שאילתות במיקום 5–20 עם חשיפות יחסיות גבוהות — עדיפות פנימית, לא
            «פוטנציאל» עובדתי.
          </p>
          <ul>
            {(data.quickWins || []).slice(0, 5).map((o: any) => (
              <li key={o.query}>
                {o.query} · חשיפות {fmtNum(o.impressions)} · מיקום{" "}
                {fmtNum(o.position)} · עדיפות פנימית{" "}
                {o.internalPriority?.score ?? "—"}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="geo-table-wrap">
        <table className="geo-table">
          <thead>
            <tr>
              <th>שאילתה</th>
              <th>חשיפות</th>
              <th>קליקים</th>
              <th>CTR</th>
              <th>מיקום</th>
              <th>עמודים</th>
              <th>עמוד יעד</th>
              <th>קניבליזציה</th>
              <th>שינוי</th>
              <th>עדיפות פנימית</th>
            </tr>
          </thead>
          <tbody>
            {(data.opportunities || []).length === 0 ? (
              <tr>
                <td colSpan={10}>אין שורות</td>
              </tr>
            ) : (
              (data.opportunities || []).map((o: any) => (
                <tr key={`${brandId}-${o.query}`}>
                  <td>{o.query}</td>
                  <td>{fmtNum(o.impressions)}</td>
                  <td>{fmtNum(o.clicks)}</td>
                  <td>{fmtPct(o.ctr)}</td>
                  <td>{fmtNum(o.position)}</td>
                  <td>
                    {(o.pages || [])
                      .slice(0, 3)
                      .map((p: any) => p.page)
                      .join(", ") || "לא נמדד"}
                  </td>
                  <td>
                    {o.targetPage || "לא נמדד"}
                    <div className="geo-cell-note">{o.targetReasonHe}</div>
                  </td>
                  <td>{o.cannibalization ? "כן" : "לא"}</td>
                  <td>
                    {o.periodChange
                      ? `חשיפות ${fmtNum(o.periodChange.impressionsDelta)} / מיקום ${fmtNum(o.periodChange.positionDelta)}`
                      : o.previousPeriodNoteHe || "לא נמדד"}
                  </td>
                  <td>
                    {o.internalPriority?.score ?? "—"}
                    <div className="geo-cell-note">פנימי · לא Google</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AiRadarPanel({ data }: { data: any }) {
  if (!data) return <AwaitBox />;
  if (data.awaitingData) return <AwaitBox message={data.messageHe} />;
  return (
    <section className="geo-decision-panel">
      <header className="geo-decision-head">
        <h2>מכ״ם AI</h2>
        <p className="geo-note">
          {data.disclaimerHe ||
            "מציג מדידות קיימות בלבד — לא מריץ מדידות AI חדשות."}
        </p>
      </header>
      <div className="geo-decision-list">
        {(data.rows || []).map((row: any) => (
          <article key={`${row.promptId}-${row.engine}`} className="geo-decision-item">
            <h3>{row.promptText || row.seedKey || row.promptId}</h3>
            <p>
              מנוע: {row.engine} · סטטוס משימה:{" "}
              {row.taskStatusHe || row.taskStatus || "לא נוצרה"}
            </p>
            <ol className="geo-timeline">
              {(row.timeline || []).map((m: any, i: number) => (
                <li key={m.checkId || i}>
                  <strong>
                    מדידה {i + 1}
                    {m.checkedAt
                      ? ` · ${new Date(m.checkedAt).toLocaleString("he-IL")}`
                      : ""}
                  </strong>
                  <div>
                    הופיע:{" "}
                    {m.appeared == null
                      ? "לא נמדד"
                      : m.appeared
                        ? "כן"
                        : "לא"}{" "}
                    ·{" "}
                    {m.recommended
                      ? "הומלץ"
                      : m.appeared
                        ? "אזכור בלבד"
                        : "לא הופיע"}
                  </div>
                  <div>
                    מתחרים:{" "}
                    {(m.competitors || [])
                      .map((c: any) => (typeof c === "string" ? c : c.name || c))
                      .join(", ") || "לא נמדד"}
                  </div>
                  <div>
                    מקורות:{" "}
                    {(m.sources || [])
                      .slice(0, 3)
                      .map((s: any) =>
                        typeof s === "string" ? s : s.domain || s.url || ""
                      )
                      .filter(Boolean)
                      .join(", ") || "לא נמדד"}
                  </div>
                  <div>{m.changeVsPreviousHe || m.changeHe}</div>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BeforeAfterPanel({ data }: { data: any }) {
  if (!data) return <AwaitBox />;
  if (data.awaitingData) return <AwaitBox message={data.messageHe} />;
  return (
    <section className="geo-decision-panel">
      <header className="geo-decision-head">
        <h2>לפני / אחרי</h2>
        <p className="geo-note">{data.disclaimerHe}</p>
      </header>
      <div className="geo-decision-list">
        {(data.events || []).map((ev: any) => (
          <article key={ev.id} className="geo-decision-item">
            <h3>{ev.titleHe}</h3>
            <p>
              {ev.pagePath} ·{" "}
              {ev.prNumber ? (
                <a href={ev.prUrl || "#"} target="_blank" rel="noreferrer">
                  PR #{ev.prNumber}
                </a>
              ) : (
                "ללא PR"
              )}{" "}
              · {ev.changedAt ? new Date(ev.changedAt).toLocaleString("he-IL") : ""}
            </p>
            <p>שאילתות: {(ev.queries || []).join(" · ") || "לא נמדד"}</p>
            <div className="geo-ba-grid">
              <div>
                <strong>לפני</strong>
                <ul>
                  <li>חשיפות: {fmtNum(ev.baseline?.impressions)}</li>
                  <li>קליקים: {fmtNum(ev.baseline?.clicks)}</li>
                  <li>CTR: {fmtPct(ev.baseline?.ctr)}</li>
                  <li>מיקום: {fmtNum(ev.baseline?.position)}</li>
                  <li>
                    GEO:{" "}
                    {ev.baseline?.appeared == null
                      ? "לא נמדד"
                      : ev.baseline.appeared
                        ? "הופיע"
                        : "לא הופיע"}
                  </li>
                </ul>
                <p className="geo-note">{ev.baseline?.noteHe}</p>
              </div>
              <div>
                <strong>אחרי</strong>
                {ev.awaitingRemeasure ? (
                  <p>ממתין למדידה מחדש</p>
                ) : (
                  <ul>
                    <li>חשיפות: {fmtNum(ev.after?.impressions)}</li>
                    <li>קליקים: {fmtNum(ev.after?.clicks)}</li>
                    <li>CTR: {fmtPct(ev.after?.ctr)}</li>
                    <li>מיקום: {fmtNum(ev.after?.position)}</li>
                  </ul>
                )}
              </div>
              <div>
                <strong>שינוי</strong>
                {ev.comparison ? (
                  <ul>
                    <li>חשיפות: {fmtNum(ev.comparison.impressions)}</li>
                    <li>קליקים: {fmtNum(ev.comparison.clicks)}</li>
                    <li>CTR: {fmtNum(ev.comparison.ctr)}</li>
                    <li>מיקום: {fmtNum(ev.comparison.position)}</li>
                  </ul>
                ) : (
                  <p>ממתין למדידה מחדש</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BrandProfilePanel({ data }: { data: any }) {
  if (!data) return <AwaitBox />;
  const brand = data.brand || data;
  const p = data.profile || {};
  return (
    <section className="geo-decision-panel">
      <header className="geo-decision-head">
        <h2>פרופיל מותג פנימי</h2>
        <p className="geo-note">
          {data.internalOnlyHe ||
            "לשימוש מנועי ניתוח בלבד — לא מוצג בעמודים ציבוריים."}
        </p>
      </header>
      <dl className="geo-profile-dl">
        <dt>שם</dt>
        <dd>{brand.name}</dd>
        <dt>דומיין</dt>
        <dd>{(brand.domains || []).join(", ")}</dd>
        <dt>תיאור</dt>
        <dd>{p.shortDescriptionHe || "לא נמדד"}</dd>
        <dt>שירותים</dt>
        <dd>{(p.coreServices || []).join(" · ") || "—"}</dd>
        <dt>קהל יעד</dt>
        <dd>{p.audienceHe || "—"}</dd>
        <dt>אזור שירות</dt>
        <dd>{p.serviceAreaHe || "—"}</dd>
        <dt>עמודים מרכזיים</dt>
        <dd>
          {(p.keyPages || [])
            .map((k: any) => `${k.path} (${k.roleHe})`)
            .join(" · ") || "—"}
        </dd>
        <dt>מתחרים</dt>
        <dd>
          {(brand.competitors || []).map((c: any) => c.name).join(" · ") || "—"}
        </dd>
        <dt>שאילתות מעקב</dt>
        <dd>{(p.trackingQueries || []).join(" · ") || "—"}</dd>
        <dt>שאלות AI</dt>
        <dd>{(p.aiTrackingQuestions || []).join(" · ") || "—"}</dd>
      </dl>
    </section>
  );
}

export function SeoGeoMatrixPanel({ data }: { data: any }) {
  if (!data) return <AwaitBox />;
  if (data.awaitingData) return <AwaitBox message={data.messageHe} />;
  return (
    <section className="geo-decision-panel">
      <header className="geo-decision-head">
        <h2>SEO + GEO ביחד</h2>
        <p className="geo-note">{data.disclaimerHe}</p>
      </header>
      <div className="geo-table-wrap">
        <table className="geo-table">
          <thead>
            <tr>
              <th>מקרה</th>
              <th>שאלה / שאילתה</th>
              <th>המלצה מאוחדת</th>
            </tr>
          </thead>
          <tbody>
            {(data.cases || []).map((c: any, i: number) => (
              <tr key={i}>
                <td>{c.caseHe || c.caseId}</td>
                <td>{c.promptText || c.query || "—"}</td>
                <td>{c.recommendationHe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function MonthlyReportPanel({
  brandId,
  data,
}: {
  brandId: string;
  data: any;
}) {
  if (!data) return <AwaitBox />;
  return (
    <section className="geo-decision-panel">
      <header className="geo-decision-head">
        <h2>{data.titleHe || "דוח חודשי פנימי"}</h2>
        <p className="geo-note">דוח פנימי בעברית · CSV דרך אותו API</p>
        <a
          className="geo-link-btn"
          href={`/api/geo-intel/monthly-report?brandId=${encodeURIComponent(brandId)}&format=csv`}
        >
          הורדת CSV
        </a>
      </header>
      <div className="geo-decision-list">
        {Object.entries(data.sections || {}).map(([key, sec]: any) => (
          <article key={key} className="geo-decision-item">
            <h3>{sec.titleHe || key}</h3>
            <pre className="geo-json-pre">{JSON.stringify(sec, null, 2)}</pre>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PageAuditPanel({ brandId }: { brandId: string }) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await geoPost(
        "/page-audit",
        { url, brandId },
        { brandId }
      );
      setResult(data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || "בדיקה נכשלה");
      setResult(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="geo-decision-panel">
      <header className="geo-decision-head">
        <h2>בדיקת עמוד</h2>
        <p className="geo-note">
          כלי פנימי בלבד · דומיינים מאושרים של המותג · ללא Lead Magnet ציבורי
        </p>
      </header>
      <div className="geo-audit-form">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          aria-label="כתובת עמוד"
        />
        <button type="button" disabled={busy || !url} onClick={run}>
          {busy ? "בודק…" : "בדוק"}
        </button>
      </div>
      {error ? <div className="geo-intel-banner warn">{error}</div> : null}
      {result ? (
        <div className="geo-ba-grid">
          <div>
            <strong>עובדות</strong>
            <pre className="geo-json-pre">
              {JSON.stringify(result.facts || result.signals || {}, null, 2)}
            </pre>
          </div>
          <div>
            <strong>בעיות</strong>
            <ul>
              {(result.problems || []).map((i: any, idx: number) => (
                <li key={idx}>{typeof i === "string" ? i : i.he || i.messageHe}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>המלצות</strong>
            <ul>
              {(result.recommendations || []).map((i: any, idx: number) => (
                <li key={idx}>
                  {typeof i === "string" ? i : i.he || i.messageHe}
                  {i.kind ? ` · ${i.kind}` : ""}
                </li>
              ))}
            </ul>
            {result.noInventedScoreHe ? (
              <p className="geo-note">{result.noInventedScoreHe}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export async function loadDecisionBundle(
  brandId: string,
  opts: { engine?: string; gscFilter?: string } = {}
) {
  const params = { brandId, engine: opts.engine || undefined };
  const [weekly, gsc, radar, beforeAfter, profile, matrix, monthly] =
    await Promise.all([
      geoGet("/weekly-actions", params),
      geoGet("/gsc-opportunities", {
        ...params,
        filter: opts.gscFilter || "all",
      }),
      geoGet("/ai-radar", params),
      geoGet("/before-after", params),
      geoGet("/brand-profile", params),
      geoGet("/seo-geo-matrix", params),
      geoGet("/monthly-report", params),
    ]);
  return { weekly, gsc, radar, beforeAfter, profile, matrix, monthly };
}

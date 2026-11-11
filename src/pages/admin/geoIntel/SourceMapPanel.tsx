import React, { useEffect, useMemo, useState } from "react";

type EngineChip = { id: string; labelHe: string };
type QuestionRef = { promptId: string; text: string };
type SourceUrl = { url: string; title: string };
type Occurrence = {
  checkId: string;
  promptId: string;
  question: string;
  engine: string;
  engineLabelHe: string;
  checkedAt: string | null;
  competitors: string[];
  brandAppeared: boolean;
  brandLinked: boolean;
  urls: SourceUrl[];
};
type ScoreParts = {
  citations: number;
  engines: number;
  questions: number;
  competitorGap: number;
  absence: number;
  localField: number;
};
export type SourceRow = {
  domain: string;
  citations: number;
  answerCount: number;
  engines: EngineChip[];
  questions: QuestionRef[];
  questionCount: number;
  competitors: string[];
  brandMentioned: boolean;
  brandAnswerCount: number;
  brandLinkAnswerCount: number;
  brandMentionedInAnswer: boolean;
  brandInSourceText: boolean;
  brandLinked: boolean;
  ownDomain: boolean;
  israeli: boolean;
  fieldRelevant: boolean;
  importanceScore: number;
  scoreCapped: boolean;
  scoreBreakdown?: ScoreParts;
  priority: string;
  priorityLabelHe: string;
  action: string;
  actionLabelHe: string;
  actionHeadlineHe: string;
  reasonHe: string;
  urls: SourceUrl[];
  occurrences: Occurrence[];
};
export type SourceMapData = {
  awaitingData?: boolean;
  messageHe?: string;
  analysisOnlyHe?: string;
  denominatorNoteHe?: string;
  scoreFormulaHe?: string;
  sampleSize?: number;
  summary?: {
    uniqueSources: number;
    sourcesMentioningUs: number;
    sourcesCompetitorsNotUs: number;
    highPriorityOutreach: number;
  };
  topCited?: SourceRow[];
  topOutreach?: SourceRow[];
  sources?: SourceRow[];
};

function yesNo(value: boolean) {
  return value ? "כן" : "לא";
}

function ratio(part: number | undefined, whole: number) {
  return `${part || 0}/${whole}`;
}

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function engineText(source: SourceRow) {
  if (!source.engines?.length) return "—";
  return source.engines.map((engine) => engine.labelHe).join(" · ");
}

function competitorText(source: SourceRow) {
  if (!source.competitors?.length) return "—";
  return source.competitors.join(" · ");
}

function SourceFacts({ source }: { source: SourceRow }) {
  return (
    <dl className="geo-source-facts">
      <div>
        <dt>ציטוטים</dt>
        <dd>{source.citations}</dd>
      </div>
      <div>
        <dt>חזרות בתשובות</dt>
        <dd>{source.answerCount}</dd>
      </div>
      <div>
        <dt>מנועים</dt>
        <dd>{engineText(source)}</dd>
      </div>
      <div>
        <dt>שאלות</dt>
        <dd>{source.questionCount}</dd>
      </div>
      <div>
        <dt>מתחרים</dt>
        <dd>{competitorText(source)}</dd>
      </div>
      <div>
        <dt>המותג בתשובות</dt>
        <dd>{ratio(source.brandAnswerCount, source.answerCount)}</dd>
      </div>
      <div>
        <dt>קישור אלינו</dt>
        <dd>{ratio(source.brandLinkAnswerCount, source.answerCount)}</dd>
      </div>
      <div>
        <dt>ציון</dt>
        <dd>{source.importanceScore}</dd>
      </div>
    </dl>
  );
}

function SourceCard({
  source,
  onOpen,
}: {
  source: SourceRow;
  onOpen: (source: SourceRow) => void;
}) {
  return (
    <article className={`geo-source-card priority-${source.priority || "none"}`}>
      <button type="button" onClick={() => onOpen(source)}>
        <div className="geo-source-card-top">
          <strong>{source.domain}</strong>
          <span className="geo-source-score">{source.importanceScore}</span>
        </div>
        <p className="geo-source-headline">{source.actionHeadlineHe}</p>
        <p className="geo-source-meta">
          {source.citations} ציטוטים · {engineText(source)}
        </p>
        <p className="geo-source-meta">מתחרים: {competitorText(source)}</p>
        <p className="geo-source-meta">
          הופעה בתשובות: {ratio(source.brandAnswerCount, source.answerCount)} · קישור:{" "}
          {ratio(source.brandLinkAnswerCount, source.answerCount)}
        </p>
      </button>
    </article>
  );
}

export default function SourceMapPanel({
  brandId,
  brandName,
  params,
  initialData = null,
}: {
  brandId: string;
  brandName: string;
  params: Record<string, string>;
  initialData?: SourceMapData | null;
}) {
  const [data, setData] = useState<SourceMapData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SourceRow | null>(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      setError("");
      return;
    }
    if (!brandId) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    setSelected(null);
    import("./geoApi")
      .then(({ geoGet }) => geoGet("/source-map", params))
      .then((next) => {
        if (!cancelled) setData(next);
      })
      .catch((err: any) => {
        if (!cancelled) {
          setData(null);
          setError(err?.response?.data?.error || err.message || "טעינת מפת המקורות נכשלה");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [brandId, params, initialData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = data?.sources || [];
    if (!q) return rows;
    return rows.filter((source) => {
      const blob = [
        source.domain,
        source.actionLabelHe,
        source.actionHeadlineHe,
        ...(source.competitors || []),
        ...(source.questions || []).map((item) => item.text),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [data, query]);

  const summary = data?.summary;

  return (
    <section className="geo-source-map" dir="rtl" lang="he">
      <div className="geo-plan-hero">
        <h2>מפת מקורות AI</h2>
        <p>
          מאילו אתרים {brandName || "המותג"} מקבל את ההמלצות במנועי המענה, ואיפה כדאי להשיג אזכור.
          הנתונים נפרדים למותג הזה בלבד.
        </p>
        {data?.analysisOnlyHe ? <p className="geo-plan-disclaimer">{data.analysisOnlyHe}</p> : null}
        {data?.denominatorNoteHe ? <p className="geo-note">{data.denominatorNoteHe}</p> : null}
      </div>

      {loading ? <p className="geo-note">טוען מפת מקורות…</p> : null}
      {error ? (
        <div className="geo-error" role="alert">
          {error}
        </div>
      ) : null}

      {data?.awaitingData ? (
        <div className="geo-intel-banner" role="status">
          {data.messageHe}
        </div>
      ) : null}

      {data && !data.awaitingData ? (
        <>
          <div className="geo-kpi-grid geo-source-kpis">
            <div className="geo-kpi">
              <div className="geo-kpi-label">מקורות ייחודיים</div>
              <div className="geo-kpi-value">{summary?.uniqueSources ?? 0}</div>
            </div>
            <div className="geo-kpi">
              <div className="geo-kpi-label">מקורות שמזכירים אותנו</div>
              <div className="geo-kpi-value">{summary?.sourcesMentioningUs ?? 0}</div>
            </div>
            <div className="geo-kpi">
              <div className="geo-kpi-label">מתחרים בלי אזכור שלנו</div>
              <div className="geo-kpi-value">{summary?.sourcesCompetitorsNotUs ?? 0}</div>
            </div>
            <div className="geo-kpi">
              <div className="geo-kpi-label">עדיפות גבוהה לפנייה</div>
              <div className="geo-kpi-value">{summary?.highPriorityOutreach ?? 0}</div>
            </div>
          </div>

          <details className="geo-formula">
            <summary>איך מחושב ציון החשיבות</summary>
            <p>{data.scoreFormulaHe}</p>
          </details>

          <div className="geo-source-block">
            <h3>Top 10 מקורות שכדאי להשיג בהם אזכור</h3>
            {data.topOutreach?.length ? (
              <div className="geo-source-grid">
                {data.topOutreach.map((source) => (
                  <SourceCard key={`out-${source.domain}`} source={source} onOpen={setSelected} />
                ))}
              </div>
            ) : (
              <p className="geo-note">
                אין עדיין מקור שחזר ביותר מתשובה אחת ועבר את סף העדיפות לפנייה.
              </p>
            )}
          </div>

          <div className="geo-source-block">
            <h3>10 המקורות המצוטטים ביותר</h3>
            <div className="geo-source-grid">
              {(data.topCited || []).map((source) => (
                <SourceCard key={`cited-${source.domain}`} source={source} onOpen={setSelected} />
              ))}
            </div>
          </div>

          <div className="geo-source-block">
            <div className="geo-source-list-head">
              <h3>כל המקורות</h3>
              <input
                className="geo-source-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="חיפוש דומיין, מתחרה או פעולה…"
                aria-label="חיפוש מקור"
              />
            </div>

            <div className="geo-source-table">
              <div className="geo-table-wrap">
                <table className="geo-table">
                  <thead>
                    <tr>
                      <th>דומיין</th>
                      <th>ציטוטים</th>
                      <th>מנועים</th>
                      <th>שאלות</th>
                      <th>מתחרים</th>
                      <th>המותג</th>
                      <th>קישור</th>
                      <th>חזרות</th>
                      <th>ציון</th>
                      <th>פעולה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={10}>אין מקורות להצגה</td>
                      </tr>
                    ) : (
                      filtered.map((source) => (
                        <tr key={source.domain}>
                          <td>
                            <button
                              type="button"
                              className="geo-link-btn"
                              onClick={() => setSelected(source)}
                            >
                              {source.domain}
                            </button>
                          </td>
                          <td>{source.citations}</td>
                          <td>{engineText(source)}</td>
                          <td>{source.questionCount}</td>
                          <td>{competitorText(source)}</td>
                          <td>{ratio(source.brandAnswerCount, source.answerCount)}</td>
                          <td>{ratio(source.brandLinkAnswerCount, source.answerCount)}</td>
                          <td>{source.answerCount}</td>
                          <td>{source.importanceScore}</td>
                          <td>{source.actionHeadlineHe}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="geo-source-cards">
              {filtered.map((source) => (
                <SourceCard key={`card-${source.domain}`} source={source} onOpen={setSelected} />
              ))}
            </div>
          </div>
        </>
      ) : null}

      {selected ? (
        <div className="geo-drawer-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <aside
            className="geo-drawer geo-source-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={selected.domain}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="geo-drawer-head">
              <strong>{selected.domain}</strong>
              <button type="button" className="geo-btn geo-btn-ghost" onClick={() => setSelected(null)}>
                סגור
              </button>
            </div>
            <div className="geo-drawer-body">
              <p className="geo-source-headline">{selected.actionHeadlineHe}</p>
              <p className="geo-note">{selected.reasonHe}</p>
              <SourceFacts source={selected} />
              {selected.scoreCapped ? (
                <p className="geo-note">הציון נחתך כי המקור הופיע רק בתשובה אחת.</p>
              ) : null}
              {selected.scoreBreakdown ? (
                <p className="geo-note">
                  פירוט ציון: ציטוטים {selected.scoreBreakdown.citations}, מנועים{" "}
                  {selected.scoreBreakdown.engines}, שאלות {selected.scoreBreakdown.questions}, מתחרים{" "}
                  {selected.scoreBreakdown.competitorGap}, היעדרות {selected.scoreBreakdown.absence}, מקור
                  מקומי {selected.scoreBreakdown.localField}.
                </p>
              ) : null}
              <h3>כתובות שצוטטו</h3>
              <ul className="geo-source-urls">
                {selected.urls.length === 0 ? (
                  <li>אין כתובת שמורה</li>
                ) : (
                  selected.urls.map((page) => (
                    <li key={page.url || page.title}>
                      <span>{page.title || page.url}</span>
                      {page.url ? <code>{page.url}</code> : null}
                    </li>
                  ))
                )}
              </ul>
              <h3>שאלות שבהן המקור צוטט</h3>
              {selected.occurrences.map((item, index) => (
                <article
                  key={`${item.checkId}-${index}`}
                  className="geo-source-occurrence"
                >
                  <p>{item.question || "שאלה לא שמורה"}</p>
                  <p className="geo-source-meta">
                    {item.engineLabelHe} · {formatWhen(item.checkedAt)}
                  </p>
                  <p className="geo-source-meta">
                    מתחרים: {item.competitors.length ? item.competitors.join(" · ") : "—"}
                  </p>
                  <p className="geo-source-meta">
                    {brandName || "המותג"} הופיע: {yesNo(item.brandAppeared)} · קישור:{" "}
                    {yesNo(item.brandLinked)}
                  </p>
                  <ul className="geo-source-urls">
                    {item.urls.map((page) => (
                      <li key={`${item.checkId}-${page.url}`}>
                        <code>{page.url || page.title}</code>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}

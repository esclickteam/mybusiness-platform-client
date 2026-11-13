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
  inconsistent?: boolean;
  reliability?: string;
  seedKey?: string;
  urls: SourceUrl[];
};
type ScoreParts = {
  citations: number;
  engines: number;
  questions: number;
  competitorGap: number;
  absence: number;
  localField: number;
  realistic?: number;
};
type MentionedBrand = {
  name: string;
  answers: number;
  domains: string[];
  hasSource: boolean;
};
export type SourceRow = {
  domain: string;
  reliability?: "verified_citation" | "unverified_source" | "fixture_or_synthetic";
  reliabilityLabelHe?: string;
  roles?: string[];
  citations: number;
  storedRecords?: number;
  verifiedCitations?: number;
  citationVerified?: boolean;
  verificationNoteHe?: string;
  inconsistent?: boolean;
  inconsistentLabelHe?: string;
  inconsistentDetailHe?: string;
  storedEngines?: EngineChip[];
  answerCount: number;
  engines: EngineChip[];
  questions: QuestionRef[];
  questionCount: number;
  competitors: string[];
  competitorsInAnswers?: string[];
  competitorsAsSources?: string[];
  competitorSite?: boolean;
  competitorName?: string;
  mentionedInAnswer?: boolean;
  brandMentioned: boolean;
  appearanceBand?: string;
  appearanceLabelHe?: string;
  appearancePct?: number;
  appearanceText?: string;
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
    verifiedCitations?: number;
    verifiedSources?: number;
    unverifiedSources?: number;
    fixtureSources?: number;
    sourcesMentioningUs: number;
    sourcesPartial?: number;
    sourcesCompetitorsNotUs: number;
    highPriorityOutreach: number;
  };
  topCited?: SourceRow[];
  topOutreach?: SourceRow[];
  verifiedSources?: SourceRow[];
  unverifiedSources?: SourceRow[];
  fixtureSources?: SourceRow[];
  mentionedBrands?: MentionedBrand[];
  inconsistencies?: { checkId: string; seedKey: string; labelHe: string; detailHe: string }[];
  sources?: SourceRow[];
};

function yesNo(value: boolean) {
  return value ? "כן" : "לא";
}

function ratio(part: number | undefined, whole: number) {
  return `${part || 0}/${whole}`;
}

function appearanceLine(source: SourceRow) {
  if (source.appearanceLabelHe && source.appearanceText) {
    return `${source.appearanceLabelHe} · ${source.appearanceText}`;
  }
  return ratio(source.brandAnswerCount, source.answerCount);
}

function roleLine(source: SourceRow) {
  if (!source.competitorSite) return "";
  const name = source.competitorName || source.domain;
  if (source.mentionedInAnswer) {
    return `${name} הוא גם הדומיין שצוטט וגם מותג שמוזכר בתשובה.`;
  }
  return `${name} צוטט כמקור, והדומיין עצמו הוא אתר מתחרה. השם לא נמצא בטקסט התשובה.`;
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
  if (source.reliability === "verified_citation" && source.engines?.length) {
    return source.engines.map((engine) => engine.labelHe).join(" · ");
  }
  if (source.storedEngines?.length) {
    return `נשמר תחת ${source.storedEngines.map((engine) => engine.labelHe).join(" · ")} · לא ציטוט מאומת`;
  }
  return "—";
}

function recordLine(source: SourceRow) {
  if (source.reliability === "fixture_or_synthetic") {
    return `${source.storedRecords || 0} רשומות שמורות · 0 ציטוטים מאומתים`;
  }
  if (source.reliability === "unverified_source") {
    return `${source.storedRecords || 0} רשומות · לא אומת`;
  }
  const count = source.verifiedCitations ?? source.citations;
  return count === 1 ? "ציטוט מאומת אחד" : `${count} ציטוטים מאומתים`;
}

function competitorText(source: SourceRow) {
  const inAnswers = source.competitorsInAnswers || [];
  const asSources = source.competitorsAsSources || [];
  if (!inAnswers.length && !asSources.length) {
    return source.competitors?.length ? source.competitors.join(" · ") : "—";
  }
  const parts = [];
  if (inAnswers.length) parts.push(`בתשובה: ${inAnswers.join(" · ")}`);
  if (asSources.length) parts.push(`כדומיין: ${asSources.join(" · ")}`);
  return parts.join(" · ");
}

function SourceFacts({ source }: { source: SourceRow }) {
  return (
    <dl className="geo-source-facts">
      <div>
        <dt>ציטוטים מאומתים</dt>
        <dd>{source.reliability === "verified_citation" ? source.verifiedCitations ?? source.citations : 0}</dd>
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
        <dd className={`geo-appearance geo-appearance-${source.appearanceBand || "absent"}`}>
          {appearanceLine(source)}
        </dd>
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
        {source.roles?.includes("platform_source") ? (
          <p className="geo-source-meta">פלטפורמה כללית</p>
        ) : null}
        <p className="geo-source-meta">
          {recordLine(source)} · {engineText(source)}
        </p>
        {source.inconsistent ? <p className="geo-source-warn">נתון לא עקבי</p> : null}
        <p className="geo-source-meta">מתחרים: {competitorText(source)}</p>
        <p className={`geo-source-meta geo-appearance geo-appearance-${source.appearanceBand || "absent"}`}>
          {appearanceLine(source)}
        </p>
        {source.citationVerified === false ? (
          <p className="geo-source-warn">{source.verificationNoteHe || "הציטוט לא אומת בכל תשובה."}</p>
        ) : null}
        {roleLine(source) ? <p className="geo-source-role">{roleLine(source)}</p> : null}
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
    const rows = data?.verifiedSources || [];
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
          {data.inconsistencies?.length ? (
            <div className="geo-intel-banner" role="status">
              <strong>נתון לא עקבי. </strong>
              {data.inconsistencies.map((item) => (
                <span key={item.checkId}>
                  {item.seedKey || item.checkId}: {item.detailHe}{" "}
                </span>
              ))}
            </div>
          ) : null}

          <div className="geo-kpi-grid geo-source-kpis">
            <div className="geo-kpi">
              <div className="geo-kpi-label">ציטוטים מאומתים</div>
              <div className="geo-kpi-value">{summary?.verifiedCitations ?? 0}</div>
            </div>
            <div className="geo-kpi">
              <div className="geo-kpi-label">מקורות מאומתים</div>
              <div className="geo-kpi-value">{summary?.verifiedSources ?? 0}</div>
            </div>
            <div className="geo-kpi">
              <div className="geo-kpi-label">מקורות לא מאומתים</div>
              <div className="geo-kpi-value">{summary?.unverifiedSources ?? 0}</div>
            </div>
            <div className="geo-kpi">
              <div className="geo-kpi-label">נתוני בדיקה</div>
              <div className="geo-kpi-value">{summary?.fixtureSources ?? 0}</div>
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
            <h3>יעדי פנייה מאומתים</h3>
            {data.topOutreach?.length ? (
              <div className="geo-source-grid">
                {data.topOutreach.map((source) => (
                  <SourceCard key={`out-${source.domain}`} source={source} onOpen={setSelected} />
                ))}
              </div>
            ) : (
              <p className="geo-note">
                אין יעד פנייה. רק ציטוט מאומת, שחזר לפחות פעמיים ואינו אתר מתחרה, יכול להיכנס לכאן.
              </p>
            )}
          </div>

          <div className="geo-source-block">
            <h3>מקורות מאומתים</h3>
            <p className="geo-note">יש הוכחה שהכתובת נשמרה על תשובה אמיתית, לא על רשימת fixture.</p>
            {(data.verifiedSources || data.topCited || []).length ? (
              <div className="geo-source-grid">
                {(data.verifiedSources || data.topCited || []).map((source) => (
                  <SourceCard key={`ver-${source.domain}`} source={source} onOpen={setSelected} />
                ))}
              </div>
            ) : (
              <p className="geo-note">אין עדיין ציטוט מאומת.</p>
            )}
          </div>

          {data.mentionedBrands?.length ? (
            <div className="geo-source-block">
              <h3>מותגים בטקסט של תשובה מאומתת</h3>
              <ul className="geo-source-urls">
                {data.mentionedBrands.map((brand) => (
                  <li key={brand.name}>
                    <span>
                      {brand.name}
                      {brand.hasSource ? " — גם מקור וגם אזכור בתשובה" : " — הוזכר בתשובה, בלי דומיין מקור"}
                    </span>
                    <code>
                      {brand.answers} תשובות
                      {brand.domains.length ? ` · ${brand.domains.join(", ")}` : ""}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="geo-source-block">
            <h3>מקורות לא מאומתים</h3>
            <p className="geo-note">נשמרו בלי הוכחת citation מלאה. הם לא נספרים כציטוט ולא נכנסים ל־Top Sources.</p>
            {(data.unverifiedSources || []).length ? (
              <div className="geo-source-grid">
                {data.unverifiedSources.map((source) => (
                  <SourceCard key={`unv-${source.domain}`} source={source} onOpen={setSelected} />
                ))}
              </div>
            ) : (
              <p className="geo-note">אין מקור לא מאומת מחוץ לנתוני הבדיקה.</p>
            )}
          </div>

          <div className="geo-source-block geo-source-fixture">
            <h3>נתוני בדיקה / fixture</h3>
            <p className="geo-note">
              wave fixture או תקציר קטלוג. לא ציטוט של ChatGPT, Perplexity או Gemini, ולא בסיס להחלטת פנייה.
            </p>
            <div className="geo-source-grid">
              {(data.fixtureSources || []).map((source) => (
                <SourceCard key={`fix-${source.domain}`} source={source} onOpen={setSelected} />
              ))}
            </div>
          </div>

          <div className="geo-source-block">
            <div className="geo-source-list-head">
              <h3>פירוט המקורות המאומתים</h3>
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
                          <td>{source.appearanceText || ratio(source.brandAnswerCount, source.answerCount)}</td>
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
              {selected.inconsistent ? (
                <p className="geo-source-warn">
                  נתון לא עקבי. {selected.inconsistentDetailHe}
                </p>
              ) : null}
              {roleLine(selected) ? <p className="geo-source-role">{roleLine(selected)}</p> : null}
              {selected.citationVerified === false ? (
                <p className="geo-source-warn">{selected.verificationNoteHe}</p>
              ) : selected.scoreCapped ? (
                <p className="geo-note">הציון נחתך כי המקור הופיע רק בתשובה אחת.</p>
              ) : null}
              {selected.scoreBreakdown ? (
                <p className="geo-note">
                  פירוט ציון: ציטוטים {selected.scoreBreakdown.citations}, מנועים{" "}
                  {selected.scoreBreakdown.engines}, שאלות {selected.scoreBreakdown.questions}, מתחרים{" "}
                  {selected.scoreBreakdown.competitorGap}, היעדרות {selected.scoreBreakdown.absence}, מקור
                  מקומי {selected.scoreBreakdown.localField}, יעד ריאלי {selected.scoreBreakdown.realistic || 0}.
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
              <h3>מדידות שבהן הדומיין נשמר</h3>
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
                    מותגים שסווגו במדידה: {item.competitors.length ? item.competitors.join(" · ") : "—"}
                  </p>
                  <p className="geo-source-meta">
                    {item.inconsistent ? "נתון לא עקבי" : `${brandName || "המותג"} הופיע: ${yesNo(item.brandAppeared)}`}
                    {" · "}קישור: {yesNo(item.brandLinked)}
                    {item.reliability ? ` · ${item.reliability}` : ""}
                    {item.seedKey ? ` · ${item.seedKey}` : ""}
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

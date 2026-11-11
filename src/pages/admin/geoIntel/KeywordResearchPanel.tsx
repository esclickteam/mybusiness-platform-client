import React, { useMemo, useState } from "react";

type BrandOption = { _id: string; slug: string; name: string };

type Props = {
  brands: BrandOption[];
  brandId: string;
  onBrand: (id: string) => void;
  data: any;
  loading: boolean;
  error: string;
  canRefresh: boolean;
  refreshing: boolean;
  onRefresh: () => void;
};

const SORTS = [
  ["volume", "נפח חיפוש — מהגבוה לנמוך"],
  ["opportunity", "הזדמנות"],
  ["position", "מיקום Google"],
  ["impressions", "חשיפות"],
  ["ctr", "CTR"],
  ["competition", "תחרות"],
  ["bid", "Bid"],
];

function fmtDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function fmtPct(ratio: number | null | undefined) {
  if (ratio == null || !Number.isFinite(Number(ratio))) return "—";
  return `${(Number(ratio) * 100).toFixed(2)}%`;
}

function bidLabel(row: any) {
  if (row.lowTopOfPageBid == null && row.highTopOfPageBid == null) {
    return "Google לא החזיר";
  }
  const low = row.lowTopOfPageBid == null ? "—" : row.lowTopOfPageBid.toFixed(2);
  const high = row.highTopOfPageBid == null ? "—" : row.highTopOfPageBid.toFixed(2);
  return `₪${low}–${high}`;
}

function matches(row: any, filters: Record<string, string>, topIds: Set<string>, top20Ids: Set<string>) {
  const volume = row.avgMonthlySearches;
  if (filters.volume === "1000" && !(volume >= 1000)) return false;
  if (filters.volume === "100" && !(volume >= 100 && volume < 1000)) return false;
  if (filters.volume === "under" && !(row.volumeVerified && volume < 100)) return false;
  if (filters.volume === "unverified" && row.volumeVerified) return false;
  if (filters.competition !== "all" && row.competition !== filters.competition) return false;
  if (filters.intent !== "all" && row.intent !== filters.intent) return false;
  if (filters.action !== "all" && row.action !== filters.action) return false;
  if (filters.pageKind === "service" && row.pageKind !== "service") return false;
  if (filters.pageKind === "guide" && row.pageKind !== "guide") return false;
  if (filters.appears === "yes" && !row.appearsInGoogle) return false;
  if (filters.fresh === "yes" && (row.appearsInGoogle || !row.volumeVerified || row.action === "competitor_skip")) {
    return false;
  }
  if (filters.cannibal === "yes" && !row.cannibalization) return false;
  if (filters.rank === "top10" && !topIds.has(row.rawKeyword)) return false;
  if (filters.rank === "top20" && !top20Ids.has(row.rawKeyword)) return false;
  return true;
}

function sortRows(rows: any[], sort: string) {
  const list = [...rows];
  const num = (value: any) => (value == null || !Number.isFinite(Number(value)) ? null : Number(value));
  list.sort((a, b) => {
    if (sort === "opportunity") return b.opportunity.score - a.opportunity.score;
    if (sort === "position") return (num(a.gsc?.position) ?? 999) - (num(b.gsc?.position) ?? 999);
    if (sort === "impressions") return (num(b.gsc?.impressions) ?? -1) - (num(a.gsc?.impressions) ?? -1);
    if (sort === "ctr") return (num(b.gsc?.ctr) ?? -1) - (num(a.gsc?.ctr) ?? -1);
    if (sort === "competition") return (num(b.competitionIndex) ?? -1) - (num(a.competitionIndex) ?? -1);
    if (sort === "bid") return (num(b.highTopOfPageBid) ?? -1) - (num(a.highTopOfPageBid) ?? -1);
    const av = a.volumeVerified ? a.avgMonthlySearches : -1;
    const bv = b.volumeVerified ? b.avgMonthlySearches : -1;
    return bv - av;
  });
  return list;
}

export default function KeywordResearchPanel({
  brands,
  brandId,
  onBrand,
  data,
  loading,
  error,
  canRefresh,
  refreshing,
  onRefresh,
}: Props) {
  const [filters, setFilters] = useState({
    volume: "all",
    competition: "all",
    intent: "all",
    action: "all",
    pageKind: "all",
    appears: "all",
    fresh: "all",
    cannibal: "all",
    rank: "all",
    sort: "volume",
  });
  const [plan, setPlan] = useState<any>(null);

  const topIds = useMemo(
    () => new Set<string>((data?.top10 || []).map((row: any) => row.rawKeyword)),
    [data]
  );
  const top20Ids = useMemo(
    () => new Set<string>((data?.top20 || []).map((row: any) => row.rawKeyword)),
    [data]
  );
  const visible = useMemo(() => {
    const rows = (data?.rows || []).filter((row: any) => matches(row, filters, topIds, top20Ids));
    return sortRows(rows, filters.sort);
  }, [data, filters, topIds, top20Ids]);

  const set = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));
  const planner = data?.sources?.keywordPlanner;
  const gsc = data?.sources?.searchConsole;

  return (
    <section className="geo-keyword-research" aria-label="מחקר מילות מפתח">
      <div className="geo-keyword-head">
        <div>
          <h2>מחקר מילות מפתח</h2>
          <p className="geo-note">
            נפח השוק מגיע מ־Google Keyword Planner לישראל. החשיפות והמיקום מגיעים מ־Search Console בנפרד. אין כאן נפח משוער.
          </p>
        </div>
        <button
          type="button"
          className="geo-btn geo-btn-primary"
          disabled={!canRefresh || refreshing || !brandId}
          onClick={onRefresh}
        >
          {refreshing ? "מרענן מול Google Ads…" : "רענן מחקר מילות מפתח"}
        </button>
      </div>
      <p className="geo-note">הרענון ידני. כניסה למסך לא מפעילה Keyword Planner.</p>
      {error ? <div className="geo-intel-banner warn">{error}</div> : null}
      {loading ? <div className="geo-intel-banner">טוען את המחקר השמור…</div> : null}
      {data?.awaitingData ? <div className="geo-intel-banner">{data.messageHe}</div> : null}

      <div className="geo-keyword-sources">
        <span>
          Keyword Planner: {planner?.sourceHe || "אין מדידה"} · {fmtDate(planner?.syncedAt)}
          {planner?.customerSuffix ? ` · חשבון ${planner.customerSuffix}` : ""}
        </span>
        <span>
          Search Console: {gsc?.sourceHe || "אין סנכרון"} · {fmtDate(gsc?.syncedAt)}
          {gsc?.startDate ? ` · ${gsc.startDate} עד ${gsc.endDate}` : ""}
        </span>
      </div>

      <div className="geo-kpi-grid">
        <div className="geo-kpi">
          <div className="geo-kpi-label">מילות מפתח שנמדדו</div>
          <div className="geo-kpi-value">{data?.summary?.measuredCount ?? "—"}</div>
        </div>
        <div className="geo-kpi">
          <div className="geo-kpi-label">סכום נפח חודשי</div>
          <div className="geo-kpi-value">
            {data?.summary?.totalMonthlySearches == null
              ? "—"
              : data.summary.totalMonthlySearches.toLocaleString("en-US")}
          </div>
          <div className="geo-kpi-sub">{data?.summary?.totalMonthlySearchesNoteHe}</div>
        </div>
        <div className="geo-kpi">
          <div className="geo-kpi-label">הזדמנויות בעדיפות גבוהה</div>
          <div className="geo-kpi-value">{data?.summary?.highPriorityCount ?? "—"}</div>
        </div>
        <div className="geo-kpi">
          <div className="geo-kpi-label">נושאים לתוכן חדש</div>
          <div className="geo-kpi-value">{data?.summary?.newContentCount ?? "—"}</div>
        </div>
      </div>

      <div className="geo-keyword-legend">
        <p>
          <strong>נפח חיפוש</strong>
          כמה פעמים הביטוי מחופש בישראל לפי Google Keyword Planner.
        </p>
        <p>
          <strong>הזדמנות</strong>
          כמה כדאי ל{data?.brand?.name || "מותג"} להשקיע בביטוי, לפי נפח, מיקום, התאמה וכוונה. רשימת הנפח אינה רשימת הביצוע.
        </p>
      </div>

      <div className="geo-keyword-highlights">
        <section className="geo-card geo-keyword-panel">
          <h3>10 מילות המפתח המבוקשות ביותר</h3>
          <p className="geo-keyword-caption">לפי נפח Keyword Planner. לא לפי הזדמנות.</p>
          {data?.top10?.length ? (
            <div className="geo-table-wrap geo-keyword-compact-wrap">
              <table className="geo-table geo-keyword-compact">
                <thead>
                  <tr>
                    <th>מיקום</th>
                    <th>מילת מפתח</th>
                    <th>נפח חודשי</th>
                    <th>תחרות</th>
                    <th>מגמה</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.top10 || []).map((row: any, index: number) => (
                    <tr key={row.rawKeyword} className={row.action === "competitor_skip" ? "is-competitor" : ""}>
                      <td className="geo-num">{index + 1}</td>
                      <td>
                        {row.keyword}
                        {row.action === "competitor_skip" ? (
                          <span className="geo-badge geo-badge-competitor_skip">מותג מתחרה</span>
                        ) : null}
                      </td>
                      <td className="geo-num geo-volume">{row.volumeLabelHe}</td>
                      <td>{row.competitionHe || "—"}</td>
                      <td>{row.action === "competitor_skip" ? "מותג מתחרה" : row.trend?.wordHe || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : loading ? null : (
            <p className="geo-note">אין עדיין נפח מאומת.</p>
          )}
        </section>

        <section className="geo-card geo-keyword-panel">
          <h3>Top 10 הזדמנויות למותג</h3>
          <p className="geo-keyword-caption">לפי ציון הזדמנות, לא לפי נפח.</p>
          {data?.opportunities?.length ? (
            <div className="geo-table-wrap geo-keyword-compact-wrap">
              <table className="geo-table geo-keyword-compact geo-keyword-opps">
                <thead>
                  <tr>
                    <th>מילת מפתח</th>
                    <th>נפח</th>
                    <th>מצב נוכחי</th>
                    <th>URL יעד</th>
                    <th>פעולה</th>
                    <th>ציון</th>
                  </tr>
                </thead>
                {(data.opportunities || []).map((row: any) => (
                  <tbody key={row.rawKeyword}>
                    <tr>
                      <td>{row.keyword}</td>
                      <td className="geo-num geo-volume">{row.volumeLabelHe}</td>
                      <td>{row.currentStateHe}</td>
                      <td className="geo-url">{row.targetUrl || "—"}</td>
                      <td><span className={`geo-badge geo-badge-${row.action}`}>{row.actionHe}</span></td>
                      <td className="geo-num geo-score">{row.opportunity?.score}</td>
                    </tr>
                    <tr className="geo-keyword-why-row">
                      <td colSpan={6}>
                        <details>
                          <summary>למה זה מומלץ?</summary>
                          <ul>
                            {(row.opportunity?.whyHe || []).map((line: string) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </details>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          ) : loading ? null : (
            <p className="geo-note">אין עדיין הזדמנויות עם נפח מאומת.</p>
          )}
        </section>
      </div>

      <div className="geo-keyword-filters">
        <label>
          מותג
          <select value={brandId} onChange={(event) => onBrand(event.target.value)}>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          נפח
          <select value={filters.volume} onChange={(event) => set("volume", event.target.value)}>
            <option value="all">הכל</option>
            <option value="1000">1,000+</option>
            <option value="100">100–999</option>
            <option value="under">מתחת ל־100</option>
            <option value="unverified">נפח לא אומת</option>
          </select>
        </label>
        <label>
          תחרות
          <select value={filters.competition} onChange={(event) => set("competition", event.target.value)}>
            <option value="all">הכל</option>
            <option value="LOW">נמוכה</option>
            <option value="MEDIUM">בינונית</option>
            <option value="HIGH">גבוהה</option>
          </select>
        </label>
        <label>
          כוונה
          <select value={filters.intent} onChange={(event) => set("intent", event.target.value)}>
            <option value="all">הכל</option>
            <option value="info">מידע</option>
            <option value="commercial">מסחרי</option>
            <option value="price">מחיר</option>
            <option value="compare">השוואה</option>
            <option value="purchase">רכישה</option>
            <option value="competitor">מותג מתחרה</option>
          </select>
        </label>
        <label>
          פעולה
          <select value={filters.action} onChange={(event) => set("action", event.target.value)}>
            <option value="all">הכל</option>
            <option value="strengthen">לחזק עמוד קיים</option>
            <option value="update_guide">לעדכן מדריך</option>
            <option value="create_guide">ליצור מדריך חדש</option>
            <option value="skip">לא לבצע כרגע</option>
            <option value="competitor_skip">ביטוי מתחרה</option>
          </select>
        </label>
        <label>
          סוג עמוד
          <select value={filters.pageKind} onChange={(event) => set("pageKind", event.target.value)}>
            <option value="all">הכל</option>
            <option value="service">עמוד שירות</option>
            <option value="guide">מדריך</option>
          </select>
        </label>
        <label>
          מיון
          <select value={filters.sort} onChange={(event) => set("sort", event.target.value)}>
            {SORTS.map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </label>
        <label className="geo-keyword-check">
          <input type="checkbox" checked={filters.appears === "yes"} onChange={(event) => set("appears", event.target.checked ? "yes" : "all")} />
          רק איפה שכבר מופיעים
        </label>
        <label className="geo-keyword-check">
          <input type="checkbox" checked={filters.fresh === "yes"} onChange={(event) => set("fresh", event.target.checked ? "yes" : "all")} />
          רק הזדמנויות חדשות
        </label>
        <label className="geo-keyword-check">
          <input type="checkbox" checked={filters.cannibal === "yes"} onChange={(event) => set("cannibal", event.target.checked ? "yes" : "all")} />
          רק קניבליזציה
        </label>
        <label className="geo-keyword-check">
          <input type="checkbox" checked={filters.rank === "top10"} onChange={(event) => set("rank", event.target.checked ? "top10" : "all")} />
          רק Top 10
        </label>
        <label className="geo-keyword-check">
          <input type="checkbox" checked={filters.rank === "top20"} onChange={(event) => set("rank", event.target.checked ? "top20" : "all")} />
          רק Top 20
        </label>
      </div>

      <div className="geo-table-wrap geo-keyword-table-desktop">
        <table className="geo-table geo-keyword-table">
          <thead>
            <tr>
              <th>מילת מפתח</th>
              <th>נפח חודשי</th>
              <th>תחרות</th>
              <th>אינדקס</th>
              <th>מגמה</th>
              <th>Bid</th>
              <th>כוונה</th>
              <th>מופיעים</th>
              <th>חשיפות</th>
              <th>קליקים</th>
              <th>CTR</th>
              <th>מיקום</th>
              <th>URL נוכחי</th>
              <th>URL יעד</th>
              <th>קניבליזציה</th>
              <th>פעולה</th>
              <th>תוכן</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row: any) => (
              <tr key={row.rawKeyword} className={row.action === "competitor_skip" ? "is-competitor" : ""}>
                <td>{row.keyword}</td>
                <td className="geo-num geo-volume">{row.volumeLabelHe}</td>
                <td>{row.competitionHe || "—"}</td>
                <td className="geo-num">{row.competitionIndex ?? "—"}</td>
                <td>{row.trend?.wordHe || "—"}</td>
                <td className="geo-num geo-bid">{bidLabel(row)}</td>
                <td>{row.intentHe}</td>
                <td>{row.appearsInGoogle ? "כן" : "לא"}</td>
                <td className="geo-num">{row.gsc?.impressions ?? "—"}</td>
                <td className="geo-num">{row.gsc?.clicks ?? "—"}</td>
                <td className="geo-num">{fmtPct(row.gsc?.ctr)}</td>
                <td className="geo-num">{row.gsc?.position ?? "—"}</td>
                <td className="geo-url">{row.currentUrl || "—"}</td>
                <td className="geo-url">{row.targetUrl || "—"}</td>
                <td>
                  <span className={`geo-badge ${row.cannibalization ? "geo-badge-yes" : "geo-badge-no"}`}>
                    {row.cannibalization ? "כן" : "לא"}
                  </span>
                </td>
                <td><span className={`geo-badge geo-badge-${row.action}`}>{row.actionHe}</span></td>
                <td>
                  <button type="button" className="geo-btn geo-btn-ghost" onClick={() => setPlan(row)} disabled={!row.contentPlan}>
                    תוכנית תוכן
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="geo-keyword-cards">
        {visible.map((row: any) => (
          <article key={row.rawKeyword} className="geo-keyword-card">
            <header>
              <strong>{row.keyword}</strong>
              <span className="geo-volume">{row.volumeLabelHe}</span>
            </header>
            <p>{row.competitionHe || "תחרות לא נמדדה"} · {row.trend?.wordHe || "מגמה לא נמדדה"}</p>
            <p>מיקום {row.gsc?.position ?? "—"} · CTR {fmtPct(row.gsc?.ctr)} · חשיפות {row.gsc?.impressions ?? "—"}</p>
            <p className="geo-url">נוכחי {row.currentUrl || "—"}</p>
            <p className="geo-url">יעד {row.targetUrl || "—"}</p>
            <p>
              <span className={`geo-badge ${row.cannibalization ? "geo-badge-yes" : "geo-badge-no"}`}>
                קניבליזציה: {row.cannibalization ? "כן" : "לא"}
              </span>
              <span className={`geo-badge geo-badge-${row.action}`}>{row.actionHe}</span>
            </p>
          </article>
        ))}
      </div>
      {!visible.length && !loading ? <p className="geo-note">אין שורות לסינון הזה.</p> : null}

      {plan?.contentPlan ? (
        <div className="geo-card geo-keyword-plan" role="region" aria-label="תוכנית תוכן">
          <h3>תוכנית תוכן · {plan.keyword}</h3>
          <p>{plan.contentPlan.createNew ? "מומלץ ליצור מדריך חדש. שום דבר לא מתפרסם אוטומטית." : "לא ליצור עמוד חדש. לחזק או לעדכן את העמוד הקיים."}</p>
          <p><strong>Title:</strong> {plan.contentPlan.title}</p>
          <p><strong>H1:</strong> {plan.contentPlan.h1}</p>
          <p><strong>URL:</strong> {plan.contentPlan.url}</p>
          <p><strong>H2:</strong> {(plan.contentPlan.headings || []).join(" · ")}</p>
          <p><strong>FAQ:</strong> {(plan.contentPlan.faqs || []).join(" · ")}</p>
          <p>
            <strong>קישורים פנימיים:</strong>{" "}
            {(plan.contentPlan.internalLinks || []).map((link: any) => `${link.anchor} → ${link.href}`).join(" · ") || "—"}
          </p>
          <p>
            <strong>עמוד שירות:</strong>{" "}
            {plan.contentPlan.supportsService
              ? `${plan.contentPlan.supportsService.anchor} → ${plan.contentPlan.supportsService.path}`
              : "—"}
          </p>
          <button type="button" className="geo-btn geo-btn-outline" onClick={() => setPlan(null)}>סגירה</button>
        </div>
      ) : null}
    </section>
  );
}

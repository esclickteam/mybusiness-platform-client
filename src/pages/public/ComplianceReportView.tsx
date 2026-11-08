import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Locale = "he" | "en" | "es" | "pt-BR" | "ar";
type Finding = {
  title?: string;
  description?: string;
  explanation?: string;
  evidence?: string;
  evidenceLabel?: string;
  evidenceNote?: string;
  evidenceComplete?: boolean;
  recommendation?: string;
  severity?: string;
  outcome?: string;
  url?: string;
  pageTitle?: string;
  place?: string;
  selector?: string;
  pages?: string[];
  locationVerified?: boolean;
  checkId?: string;
  source?: { name?: string; url?: string } | null;
  obligationLevel?: string;
};

const COPY: Record<Locale, Record<string, string>> = {
  he: {
    newScan: "סריקה חדשה", pdf: "הורדת PDF", site: "האתר שנבדק", address: "כתובת", date: "תאריך", status: "סטטוס",
    score: "ציון הבדיקות", scoreHelp: "הציון מסכם רק בדיקות שהושלמו. הוא אינו אישור עמידה בחוק.",
    coverage: "כיסוי", coverageHelp: "אחוז הבדיקות שהסתיימו מתוך מה שהסריקה ניסתה לבדוק.",
    ok: "מה נמצא תקין", todo: "מה דורש טיפול", missing: "מה חסר לפי הראיות", unknown: "מה לא ניתן לבדוק", first: "מה מומלץ לתקן קודם",
    all: "הכול", action: "דורש טיפול", pass: "תקין", unverified: "לא ניתן לאימות", other: "לא רלוונטי",
    checked: "מה נבדק", found: "מה נמצא", why: "למה זה חשוב", fix: "מה מומלץ לעשות", where: "איפה זה נמצא",
    open: "פתחו את העמוד", technical: "פרטים טכניים", quote: "ציטוט מהמקור", more: "הציגו את הציטוט המלא", less: "הציגו פחות",
    severity: "חומרה", certainty: "רמת ודאות", kind: "סוג הממצא", gap: "מה חסר או אינו תקין", law: "מקור", noLaw: "לא צורף מקור מוסמך לממצא זה",
    section: "סעיף", noSection: "כותרת הסעיף לא זוהתה", draft: "נוסח מוצע", verify: "איך לוודא שהתיקון בוצע",
    plan: "תוכנית הפעולה לתיקון האתר", unfinished: "בדיקות שלא ניתן היה להשלים", owner: "בדיקות שדורשות מידע מבעל האתר", tools: "כלי מדידה שזוהו", noTools: "לא זוהה כלי מדידה מוכר בדפים שנקראו. מצבי ההסכמה לא נבדקו.",
    purpose: "המטרה באתר זה לא אומתה", consent: "לפני הסכמה ואחריה: לא נבדק",
    okStatus: "תקין", missingStatus: "חסר", fixStatus: "דורש תיקון", unverifiedStatus: "לא ניתן לאימות", otherStatus: "לא רלוונטי",
    high: "גבוהה", medium: "בינונית", low: "נמוכה", info: "לידיעה",
    highC: "גבוהה", mediumC: "בינונית", lowC: "נמוכה",
    incomplete: "הבדיקה לא הושלמה כי לא נמצא ציטוט שלם.", unknownPlace: "המיקום המדויק לא אומת",
    kindLegal: "דרישה שמופיעה במקור שאומת", kindTechnical: "סיכון טכני", kindAdvice: "המלצה",
    completed: "הושלמה", failed: "לא הושלמה", running: "בתהליך",
    http: "כותרת HTTP", document: "מסמך", form: "טופס", image: "תמונה", page: "תוכן העמוד",
    empty: "אין ממצאים בקבוצה הזו.",
    provenTitle: "ליקויים עם ראיה מהסריקה",
    gapTitle: "חיפושי ניסוח — לא נקבעה הפרה",
    gapNote: "הנושא לא אותר בניסוח שנבדק. זו אינה קביעה שהאתר מפר חוק.",
    missingTitle: "מסמכים שלא אותרו אחרי חיפוש",
    sourceMissing: "לא צורף קישור למקור רשמי, ולכן אין כאן אסמכתה מאומתת.",
  },
  en: {
    newScan: "New scan", pdf: "Download PDF", site: "Site checked", address: "Address", date: "Date", status: "Status",
    score: "Check score", scoreHelp: "The score sums finished checks only. It is not legal approval.",
    coverage: "Coverage", coverageHelp: "The share of checks that finished out of those the scan attempted.",
    ok: "What looked sound", todo: "What needs attention", missing: "What the evidence did not show", unknown: "What could not be checked", first: "What to fix first",
    all: "All", action: "Needs attention", pass: "Sound", unverified: "Could not verify", other: "Not applicable",
    checked: "What was checked", found: "What was found", why: "Why it matters", fix: "What to do", where: "Where it is",
    open: "Open the page", technical: "Technical details", quote: "Source quote", more: "Show the full quote", less: "Show less",
    severity: "Severity", certainty: "Certainty", kind: "Type", gap: "What is missing or wrong", law: "Source", noLaw: "No verified source was attached to this finding",
    section: "Section", noSection: "No section heading was identified", draft: "Suggested wording", verify: "How to confirm the fix",
    plan: "What to fix on the site", unfinished: "Checks that could not be completed", owner: "Checks that need information from the site owner", tools: "Measurement tools seen", noTools: "No known measurement tool was seen. Consent states were not checked.",
    purpose: "The purpose on this site was not verified", consent: "Before and after consent: not checked",
    okStatus: "Sound", missingStatus: "Missing", fixStatus: "Needs a fix", unverifiedStatus: "Could not verify", otherStatus: "Not applicable",
    high: "High", medium: "Medium", low: "Low", info: "Note",
    highC: "High", mediumC: "Medium", lowC: "Low",
    incomplete: "The check was not finished because a complete quote was not found.", unknownPlace: "The exact location was not verified",
    kindLegal: "A requirement from a verified source", kindTechnical: "Technical risk", kindAdvice: "Recommendation",
    completed: "Completed", failed: "Not completed", running: "Running",
    http: "HTTP header", document: "Document", form: "Form", image: "Image", page: "Page content",
    empty: "No findings in this group.",
    provenTitle: "Findings with evidence from the scan",
    gapTitle: "Wording searches — not a legal finding",
    gapNote: "The topic was not found in the wording that was checked. This is not a finding that the site breaks the law.",
    missingTitle: "Documents the search did not find",
    sourceMissing: "No official source link was attached, so this is not a verified citation.",
  },
  es: {
    newScan: "Nuevo análisis", pdf: "Descargar PDF", site: "Sitio revisado", address: "Dirección", date: "Fecha", status: "Estado",
    score: "Puntuación de las pruebas", scoreHelp: "La puntuación resume solo las pruebas terminadas. No es una aprobación legal.",
    coverage: "Cobertura", coverageHelp: "Porcentaje de pruebas terminadas entre las que el análisis intentó.",
    ok: "Lo que se vio correcto", todo: "Lo que requiere atención", missing: "Lo que las pruebas no mostraron", unknown: "Lo que no se pudo comprobar", first: "Qué corregir primero",
    all: "Todo", action: "Requiere atención", pass: "Correcto", unverified: "No verificable", other: "No aplica",
    checked: "Qué se revisó", found: "Qué se encontró", why: "Por qué importa", fix: "Qué hacer", where: "Dónde está",
    open: "Abrir la página", technical: "Detalles técnicos", quote: "Cita de la fuente", more: "Ver la cita completa", less: "Ver menos",
    incomplete: "La prueba no terminó porque no hubo una cita completa.", unknownPlace: "La ubicación exacta no se verificó",
    owner: "Comprobaciones que requieren datos del titular del sitio", unfinished: "Comprobaciones que no se pudieron completar",
    kindLegal: "Requisito de una fuente verificada", kindTechnical: "Riesgo técnico", kindAdvice: "Recomendación",
    completed: "Completado", failed: "No completado", running: "En curso",
    http: "Cabecera HTTP", document: "Documento", form: "Formulario", image: "Imagen", page: "Contenido",
    empty: "No hay hallazgos en este grupo.",
  },
  "pt-BR": {
    newScan: "Nova varredura", pdf: "Baixar PDF", site: "Site verificado", address: "Endereço", date: "Data", status: "Status",
    score: "Pontuação das verificações", scoreHelp: "A pontuação resume só as verificações concluídas. Não é aprovação jurídica.",
    coverage: "Cobertura", coverageHelp: "A parte das verificações concluídas entre as que a varredura tentou.",
    ok: "O que pareceu adequado", todo: "O que precisa de atenção", missing: "O que as evidências não mostraram", unknown: "O que não foi possível verificar", first: "O que corrigir primeiro",
    all: "Tudo", action: "Precisa de atenção", pass: "Adequado", unverified: "Não verificável", other: "Não se aplica",
    checked: "O que foi verificado", found: "O que foi encontrado", why: "Por que importa", fix: "O que fazer", where: "Onde está",
    open: "Abrir a página", technical: "Detalhes técnicos", quote: "Citação da fonte", more: "Mostrar a citação completa", less: "Mostrar menos",
    incomplete: "A verificação não terminou porque não havia uma citação completa.", unknownPlace: "O local exato não foi verificado",
    owner: "Verificações que exigem informação do dono do site", unfinished: "Verificações que não puderam ser concluídas",
    kindLegal: "Exigência de uma fonte verificada", kindTechnical: "Risco técnico", kindAdvice: "Recomendação",
    completed: "Concluída", failed: "Não concluída", running: "Em andamento",
    http: "Cabeçalho HTTP", document: "Documento", form: "Formulário", image: "Imagem", page: "Conteúdo",
    empty: "Não há achados neste grupo.",
  },
  ar: {
    newScan: "فحص جديد", pdf: "تنزيل PDF", site: "الموقع الذي فُحص", address: "العنوان", date: "التاريخ", status: "الحالة",
    score: "درجة الفحوصات", scoreHelp: "تلخص الدرجة الفحوصات المكتملة فقط. ليست موافقة قانونية.",
    coverage: "التغطية", coverageHelp: "نسبة الفحوصات التي اكتملت من تلك التي حاول الفحص إجراءها.",
    ok: "ما بدا سليمًا", todo: "ما يحتاج معالجة", missing: "ما لم تظهره الأدلة", unknown: "ما تعذر فحصه", first: "ما يُفضَّل إصلاحه أولًا",
    all: "الكل", action: "يحتاج معالجة", pass: "سليم", unverified: "غير قابل للتحقق", other: "غير منطبق",
    checked: "ما تم فحصه", found: "ما وُجد", why: "لماذا هذا مهم", fix: "ماذا يُنصح بفعله", where: "أين وُجد",
    open: "افتحوا الصفحة", technical: "تفاصيل تقنية", quote: "اقتباس من المصدر", more: "اعرضوا الاقتباس كاملًا", less: "اعرضوا أقل",
    incomplete: "لم يكتمل الفحص لأنه لم يُعثر على اقتباس كامل.", unknownPlace: "لم يُتحقق من الموقع الدقيق",
    owner: "فحوصات تتطلب معلومات من صاحب الموقع", unfinished: "فحوصات تعذر إكمالها",
    kindLegal: "متطلب من مصدر تم التحقق منه", kindTechnical: "خطر تقني", kindAdvice: "توصية",
    completed: "اكتمل", failed: "لم يكتمل", running: "قيد التنفيذ",
    http: "ترويسة HTTP", document: "مستند", form: "نموذج", image: "صورة", page: "محتوى الصفحة",
    empty: "لا توجد نتائج في هذه المجموعة.",
  },
};

function hostName(url?: string) {
  try { return new URL(String(url || "")).hostname.replace(/^www\./, ""); } catch { return ""; }
}

function wholeQuote(item: Finding) {
  const raw = String(item.evidence || "").replace(/\s+/g, " ").trim();
  if (!raw) return "";
  if (item.evidenceComplete === false) return "";
  const sentences = raw.match(/[^.!?؟。]+[.!?؟。]+/g) || [];
  const kept = sentences.map((part) => part.trim()).filter((part) => part.length >= 16);
  if (kept.length) return kept.join(" ");
  if (item.evidenceComplete === true && raw.length <= 180 && raw.length >= 8) return raw;
  if (/[.!?؟。:"]$/.test(raw) && raw.length >= 16 && raw.length <= 180) return raw;
  return "";
}

function detailOf(item: Finding, copy: Record<string, string>) {
  const server = (item as Finding & { detail?: Record<string, unknown> }).detail;
  if (server) return server as Record<string, unknown>;
  const status = item.outcome === "pass" ? "ok" : item.outcome === "incomplete" || item.outcome === "uncertain" ? "unverified" : item.outcome === "finding" ? "fix" : "other";
  return {
    status,
    certainty: item.confidence || "medium",
    found: item.description || "",
    gap: status === "ok" ? "" : (item.description || ""),
    why: item.explanation || item.description || "",
    change: item.recommendation || "",
    proposedText: "",
    verify: item.url ? copy.verify : copy.unknownPlace,
    lawName: item.source?.name || "",
    lawUrl: item.source?.url || "",
    sectionVerified: false,
    needsLegalReview: false,
  };
}

function statusLabel(status: string, copy: Record<string, string>) {
  if (status === "ok") return copy.okStatus;
  if (status === "missing") return copy.missingStatus;
  if (status === "fix") return copy.fixStatus;
  if (status === "unverified") return copy.unverifiedStatus;
  return copy.otherStatus;
}

function kindOf(item: Finding, copy: Record<string, string>) {
  if (String(item.checkId || "").startsWith("security.")) return copy.kindTechnical;
  if (item.obligationLevel === "possible_legal" && item.source?.url) return copy.kindLegal;
  return copy.kindAdvice;
}

const WCAG_URLS: Record<string, string> = {
  "1.1.1": "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
  "1.3.1": "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
  "1.4.3": "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
  "2.1.1": "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
  "3.1.1": "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html",
  "3.3.2": "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
};

function officialSource(name: unknown, url: unknown) {
  const stored = String(url || "");
  if (stored) return stored;
  const match = String(name || "").match(/(\d+\.\d+\.\d+)/);
  return match ? WCAG_URLS[match[1]] || "" : "";
}

function bandOf(item: Finding) {
  if (item.outcome === "owner") return "owner";
  if (item.outcome === "gap") return "gap";
  if (item.outcome === "incomplete" || item.outcome === "uncertain") return "unverified";
  if (item.outcome === "pass") return "pass";
  const evidence = String(item.evidence || "");
  if (/לא נמצא ניסוח שמזוהה/.test(evidence)) return "gap";
  if ((item.obligationLevel === "possible_legal" || (item as Finding & { level?: string }).level === "possible_legal") && !item.source?.url) return "gap";
  if (/החיפוש אחרי/.test(evidence) || /לא אותר/.test(String(item.title || ""))) return "missing";
  if (item.outcome === "finding") return "proven";
  return "unverified";
}

export function ComplianceReportView({
  locale,
  payload,
  onPdf,
}: {
  locale: Locale;
  payload: any;
  onPdf: () => void;
}) {
  const copy = { ...COPY.en, ...(COPY[locale] || {}) };
  const report = payload?.report || {};
  const [filter, setFilter] = useState("action");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const findings: Finding[] = report.findings || [];
  const unfinished = findings.filter((item) => bandOf(item) === "unverified");
  const ownerChecks = findings.filter((item) => bandOf(item) === "owner");
  const gaps = findings.filter((item) => bandOf(item) === "gap");
  const missingDocs = findings.filter((item) => bandOf(item) === "missing");
  const visible = useMemo(() => findings.filter((item) => {
    const band = bandOf(item);
    if (filter === "all") return band === "proven" || band === "pass" || band === "missing";
    if (filter === "action") return band === "proven" || band === "missing";
    if (filter === "pass") return band === "pass";
    if (filter === "unverified") return band === "unverified" || band === "gap";
    if (filter === "other") return band === "owner";
    return true;
  }), [findings, filter]);
  const counts = {
    pass: findings.filter((item) => bandOf(item) === "pass").length,
    action: findings.filter((item) => bandOf(item) === "proven" || bandOf(item) === "missing").length,
    unknown: unfinished.length + gaps.length,
  };
  const actions = findings.filter((item) => (bandOf(item) === "proven" || bandOf(item) === "missing") && item.recommendation).slice(0, 8);
  const status = payload?.status === "completed" ? copy.completed : payload?.status === "failed" ? copy.failed : copy.running;
  const placeLabel = (place?: string) => copy[place === "http-header" ? "http" : place || ""] || place || "";

  return (
    <section className="scan-report">
      <header className="scan-mast">
        <div>
          <p className="scan-kicker">{copy.site}</p>
          <h2>{hostName(report.url) || report.url}</h2>
          <p dir="ltr">{report.url}</p>
          <p>{copy.date}: {report.scannedAt || "—"} · {copy.status}: {status}</p>
        </div>
        <div className="scan-mast__actions">
          <button type="button" className="scan-start" onClick={onPdf}>{copy.pdf}</button>
          <Link className="scan-ghost" to="/compliance">{copy.newScan}</Link>
        </div>
      </header>
      <div className="scan-scores">
        <article>
          <b>{(report.scores?.overall?.withheld ? report.scores?.technical?.value : report.scores?.overall?.value) ?? "—"}<small>/100</small></b>
          <span>{copy.score}</span>
          <small>{copy.scoreHelp}</small>
        </article>
        <article>
          <b>{report.scores?.coverage?.value ?? "—"}%</b>
          <span>{copy.coverage}</span>
          <small>{copy.coverageHelp}</small>
        </article>
      </div>
      <div className="scan-summary-grid">
        <article><b>{counts.pass}</b><span>{copy.ok}</span></article>
        <article><b>{counts.action}</b><span>{copy.todo}</span></article>
        <article><b>{report.documents?.filter((item: { state?: string }) => item.state === "not_found_after_scan").length || 0}</b><span>{copy.missing}</span></article>
        <article><b>{counts.unknown}</b><span>{copy.unknown}</span></article>
      </div>
      {filter === "action" && (
        <p className="audit-note">{copy.provenTitle}: {counts.action - missingDocs.length}. {copy.missingTitle}: {missingDocs.length}. {copy.gapTitle}: {gaps.length}.</p>
      )}
      <div className="scan-filters">
        {(["all", "action", "pass", "unverified", "other"] as const).map((item) => (
          <button key={item} type="button" className={filter === item ? "is-on" : ""} onClick={() => setFilter(item)}>{copy[item]}</button>
        ))}
      </div>
      <div className="scan-cards">
        {visible.length === 0 && <p>{copy.empty}</p>}
        {visible.map((item, index) => {
          const quote = wholeQuote(item);
          const key = `${item.checkId}-${index}`;
          const expanded = open[key] === true;
          const preview = quote.length > 180 && !expanded ? `${quote.slice(0, quote.lastIndexOf(" ", 180) > 40 ? quote.lastIndexOf(" ", 180) : 180)}.` : quote;
          const pages = (item.pages || []).filter(Boolean);
          const located = item.locationVerified === false ? false : Boolean(item.url);
          const detail = detailOf(item, copy);
          const level = copy[item.severity || "info"] || item.severity;
          const band = bandOf(item);
          const sourceUrl = officialSource(detail.lawName, detail.lawUrl);
          return (
            <article key={key} className={`sev-${item.severity || "info"} audit-card`}>
              <h3>{item.title}</h3>
              <p className="scan-pills"><span>{band === "gap" ? copy.gapTitle : statusLabel(String(detail.status || ""), copy)}</span><span>{copy.severity}: {level}</span><span>{kindOf(item, copy)}</span></p>
              {band === "gap" ? <p className="audit-note">{copy.gapNote}</p> : null}
              <p><strong>{copy.checked}. </strong>{item.description || item.title}</p>
              <p><strong>{copy.found}. </strong>{item.evidence || item.description || copy.incomplete}</p>
              {band !== "pass" && detail.gap ? <p><strong>{copy.gap}. </strong>{String(detail.gap)}</p> : null}
              <p><strong>{copy.why}. </strong>{String(detail.why || item.explanation || item.description || "")}</p>
              {(detail.change || item.recommendation) && <p><strong>{copy.fix}. </strong>{String(detail.change || item.recommendation)}</p>}
              {detail.proposedText && band !== "gap" ? <p><strong>{copy.draft}. </strong>{String(detail.proposedText)}</p> : null}
              <p><strong>{copy.verify}. </strong>{String(detail.verify || "")}</p>
              <p><strong>{copy.where}. </strong>{located ? <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a> : copy.unknownPlace}{located && item.pageTitle ? ` · ${item.pageTitle}` : ""}{placeLabel(item.place) ? ` · ${placeLabel(item.place)}` : ""}</p>
              {detail.sectionVerified ? <p><strong>{copy.section}. </strong>{String(detail.sectionTitle || "")}</p> : null}
              <p><strong>{copy.law}. </strong>{sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{String(detail.lawName || sourceUrl)}</a> : <>{detail.lawName ? `${String(detail.lawName)}. ` : ""}{copy.sourceMissing}</>}</p>
              {pages.length > 1 && <ul>{pages.map((url) => <li key={url} dir="ltr"><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul>}
              {quote && (
                <blockquote>
                  <span>{item.evidenceLabel || copy.quote}</span>
                  <p dir="auto">{expanded ? quote : preview}</p>
                  {quote.length > 180 && <button type="button" onClick={() => setOpen({ ...open, [key]: !expanded })}>{expanded ? copy.less : copy.more}</button>}
                  {item.evidenceNote && <small>{item.evidenceNote}</small>}
                </blockquote>
              )}
            </article>
          );
        })}
      </div>
      {filter === "all" && (
        <section className="scan-actions">
          <h2>{copy.unfinished}</h2>
          {unfinished.length === 0 ? <p>{copy.empty}</p> : (
            <ul>
              {unfinished.map((item, index) => (
                <li key={`${item.checkId}-${index}`}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <p dir="ltr">{item.url || copy.unknownPlace}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      {filter === "all" && (
        <section className="scan-actions">
          <h2>{copy.owner}</h2>
          {ownerChecks.length === 0 ? <p>{copy.empty}</p> : (
            <ul>
              {ownerChecks.map((item, index) => (
                <li key={`${item.checkId}-owner-${index}`}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <p>{item.recommendation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      <section className="scan-actions">
        <h2>{copy.tools}</h2>
        {(report.trackers || []).length === 0 ? <p>{copy.noTools}</p> : (
          <ul>
            {(report.trackers || []).map((tool: { name?: string; pageUrl?: string; beforeConsent?: string }) => (
              <li key={`${tool.name}-${tool.pageUrl}`}><strong>{tool.name}</strong><p dir="ltr">{tool.pageUrl}</p><p>{copy.purpose}. {tool.beforeConsent || copy.consent}</p></li>
            ))}
          </ul>
        )}
      </section>
      <section className="scan-actions">
        <h2>{copy.plan}</h2>
        <ol>
          {actions.map((item) => {
            const detail = detailOf(item, copy);
            const located = item.locationVerified === false ? false : Boolean(item.url);
            return (
              <li key={item.checkId}>
                <strong>{item.title}</strong>
                <p>{located ? item.url : copy.unknownPlace}</p>
                <p>{String(detail.change || item.recommendation || "")}</p>
                {detail.proposedText ? <p>{String(detail.proposedText)}</p> : null}
                <p>{String(detail.verify || "")}</p>
              </li>
            );
          })}
        </ol>
      </section>
    </section>
  );
}

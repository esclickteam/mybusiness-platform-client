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
    incomplete: "הבדיקה לא הושלמה כי לא נמצא ציטוט שלם.", unknownPlace: "המיקום המדויק לא אומת",
    kindLegal: "דרישה שמופיעה במקור שאומת", kindTechnical: "סיכון טכני", kindAdvice: "המלצה",
    completed: "הושלמה", failed: "לא הושלמה", running: "בתהליך",
    http: "כותרת HTTP", document: "מסמך", form: "טופס", image: "תמונה", page: "תוכן העמוד",
    empty: "אין ממצאים בקבוצה הזו.",
  },
  en: {
    newScan: "New scan", pdf: "Download PDF", site: "Site checked", address: "Address", date: "Date", status: "Status",
    score: "Check score", scoreHelp: "The score sums finished checks only. It is not legal approval.",
    coverage: "Coverage", coverageHelp: "The share of checks that finished out of those the scan attempted.",
    ok: "What looked sound", todo: "What needs attention", missing: "What the evidence did not show", unknown: "What could not be checked", first: "What to fix first",
    all: "All", action: "Needs attention", pass: "Sound", unverified: "Could not verify", other: "Not applicable",
    checked: "What was checked", found: "What was found", why: "Why it matters", fix: "What to do", where: "Where it is",
    open: "Open the page", technical: "Technical details", quote: "Source quote", more: "Show the full quote", less: "Show less",
    incomplete: "The check was not finished because a complete quote was not found.", unknownPlace: "The exact location was not verified",
    kindLegal: "A requirement from a verified source", kindTechnical: "Technical risk", kindAdvice: "Recommendation",
    completed: "Completed", failed: "Not completed", running: "Running",
    http: "HTTP header", document: "Document", form: "Form", image: "Image", page: "Page content",
    empty: "No findings in this group.",
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

function kindOf(item: Finding, copy: Record<string, string>) {
  if (String(item.checkId || "").startsWith("security.")) return copy.kindTechnical;
  if (item.obligationLevel === "possible_legal") return copy.kindLegal;
  return copy.kindAdvice;
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
  const copy = COPY[locale] || COPY.en;
  const report = payload?.report || {};
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const findings: Finding[] = report.findings || [];
  const visible = useMemo(() => findings.filter((item) => {
    if (filter === "action") return item.outcome === "finding";
    if (filter === "pass") return item.outcome === "pass";
    if (filter === "unverified") return item.outcome === "incomplete" || item.outcome === "uncertain";
    if (filter === "other") return item.outcome !== "finding" && item.outcome !== "pass" && item.outcome !== "incomplete";
    return true;
  }), [findings, filter]);
  const counts = {
    pass: findings.filter((item) => item.outcome === "pass").length,
    action: findings.filter((item) => item.outcome === "finding").length,
    unknown: findings.filter((item) => item.outcome === "incomplete" || item.outcome === "uncertain").length,
  };
  const actions = [...findings].filter((item) => item.outcome === "finding" && item.recommendation).slice(0, 6);
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
          <b>{report.scores?.overall?.withheld ? "—" : (report.scores?.technical?.value ?? "—")}<small>/100</small></b>
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
          return (
            <article key={key} className={`sev-${item.severity || "info"}`}>
              <h3>{item.title}</h3>
              <p className="scan-pills"><span>{item.outcome}</span><span>{item.severity}</span><span>{kindOf(item, copy)}</span></p>
              <p><strong>{copy.checked}. </strong>{item.title}</p>
              <p><strong>{copy.found}. </strong>{quote ? item.description : copy.incomplete}</p>
              <p><strong>{copy.why}. </strong>{item.explanation || item.description}</p>
              {item.recommendation && <p><strong>{copy.fix}. </strong>{item.recommendation}</p>}
              <p><strong>{copy.where}. </strong>{located ? `${item.pageTitle || hostName(item.url) || ""} · ${placeLabel(item.place)}` : copy.unknownPlace}</p>
              {located && item.url && <p><a href={item.url} target="_blank" rel="noopener noreferrer">{copy.open}</a></p>}
              {pages.length > 1 && <ul>{pages.map((url) => <li key={url} dir="ltr"><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul>}
              {quote && (
                <blockquote>
                  <span>{item.evidenceLabel || copy.quote}</span>
                  <p dir="auto">{expanded ? quote : preview}</p>
                  {quote.length > 180 && <button type="button" onClick={() => setOpen({ ...open, [key]: !expanded })}>{expanded ? copy.less : copy.more}</button>}
                  {item.evidenceNote && <small>{item.evidenceNote}</small>}
                </blockquote>
              )}
              {(item.selector || item.checkId) && (
                <details>
                  <summary>{copy.technical}</summary>
                  <p dir="ltr">{item.checkId}{item.selector ? ` · ${item.selector}` : ""}{item.place === "http-header" && item.url ? ` · ${item.url}` : ""}</p>
                </details>
              )}
            </article>
          );
        })}
      </div>
      <section className="scan-actions">
        <h2>{copy.first}</h2>
        <ol>
          {actions.map((item) => <li key={item.checkId}><strong>{item.title}</strong><p>{item.recommendation}</p></li>)}
        </ol>
      </section>
    </section>
  );
}

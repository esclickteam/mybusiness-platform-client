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
    score: "ציון הבדיקות", scoreHelp: "הציון מבוסס על הבדיקות שהוכרעו. הוא אינו אישור שהאתר עומד בדרישות הדין.",
    coverage: "היקף הבדיקות שהוכרעו", coverageHelp: "אחוז הבדיקות שהתקבלה עבורן תוצאה, מתוך הבדיקות שאפשר היה להכריע.",
    process: "השלמת תהליך הסריקה", processHelp: "100% כאשר כל בדיקה הגיעה למצב סופי, גם אם חלקן לא הוכרעו.",
    ok: "מה נמצא תקין", todo: "מה דורש טיפול", missing: "מה חסר לפי הראיות", unknown: "מה לא ניתן לבדוק", first: "מה מומלץ לתקן קודם",
    all: "הכול", action: "דורש טיפול", pass: "תקין", unverified: "לא ניתן לאימות", other: "לא רלוונטי",
    checked: "מה נבדק", found: "מה נמצא", why: "למה זה חשוב", fix: "מה מומלץ לעשות", where: "איפה זה נמצא",
    open: "פתחו את העמוד", technical: "פרטים טכניים", quote: "ציטוט מהמקור", more: "הציגו את הציטוט המלא", less: "הציגו פחות",
    severity: "חומרה", certainty: "רמת ודאות", kind: "סוג הממצא", gap: "מה חסר או אינו תקין", law: "מקור", noLaw: "",
    section: "סעיף", noSection: "כותרת הסעיף לא זוהתה", draft: "נוסח מוצע", verify: "איך לוודא שהתיקון בוצע",
    plan: "תוכנית הפעולה לתיקון האתר", unfinished: "בדיקות שלא ניתן היה להשלים", owner: "מסמכים שאינם פתוחים לציבור", tools: "כלי מדידה שזוהו", noTools: "לא זוהה כלי מדידה מוכר בדפים שנקראו. מצבי ההסכמה לא נבדקו.",
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
    sourceMissing: "",
    technicalNote: "זהו ממצא טכני. אין כאן קביעת הפרה.",
    linkedSource: "מקור מקצועי. הקישור אינו קביעה שהאתר מפר חוק.",
    navAccess: "נגישות", navSecurity: "אבטחה", navPrivacy: "פרטיות", navDocs: "מסמכים", navPlan: "תוכנית פעולה", navOpen: "לא הוכרע",
    blockedTitle: "מסמכים שאינם פתוחים לציבור",
    notFoundTitle: "לא אותר מידע בנושא",
    undecidedTitle: "לא ניתן לקבוע אוטומטית",
    technicalTitle: "בדיקה שלא הושלמה",
  },
  en: {
    newScan: "New scan", pdf: "Download PDF", site: "Site checked", address: "Address", date: "Date", status: "Status",
    score: "Check score", scoreHelp: "The score uses the checks that were decided. It is not confirmation that the site meets the law.",
    coverage: "Checks that were decided", coverageHelp: "The share of checks that received a result, out of the checks that could be decided.",
    process: "Scan process complete", processHelp: "100% when every check reached a final state, including checks that were not decided.",
    ok: "What looked sound", todo: "What needs attention", missing: "What the evidence did not show", unknown: "What could not be checked", first: "What to fix first",
    all: "All", action: "Needs attention", pass: "Sound", unverified: "Could not verify", other: "Not applicable",
    checked: "What was checked", found: "What was found", why: "Why it matters", fix: "What to do", where: "Where it is",
    open: "Open the page", technical: "Technical details", quote: "Source quote", more: "Show the full quote", less: "Show less",
    severity: "Severity", certainty: "Certainty", kind: "Type", gap: "What is missing or wrong", law: "Source", noLaw: "",
    section: "Section", noSection: "No section heading was identified", draft: "Suggested wording", verify: "How to confirm the fix",
    plan: "What to fix on the site", unfinished: "Checks that could not be completed", owner: "Documents that are not public", tools: "Measurement tools seen", noTools: "No known measurement tool was seen. Consent states were not checked.",
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
    sourceMissing: "",
    technicalNote: "This is a technical finding. It is not a legal breach.",
    linkedSource: "Professional source. The link is not a finding that the site breaks the law.",
    navAccess: "Accessibility", navSecurity: "Security", navPrivacy: "Privacy", navDocs: "Documents", navPlan: "Action plan", navOpen: "Not decided",
    blockedTitle: "Documents that are not public",
    notFoundTitle: "No information found on this topic",
    undecidedTitle: "Could not be decided automatically",
    technicalTitle: "Check that did not finish",
  },
  es: {
    newScan: "Nuevo análisis", pdf: "Descargar PDF", site: "Sitio revisado", address: "Dirección", date: "Fecha", status: "Estado",
    score: "Puntuación de las pruebas", scoreHelp: "La puntuación usa las pruebas completadas. Las que no se pudieron completar no son fallos, pero limitan el alcance.",
    coverage: "Pruebas decididas", coverageHelp: "Porcentaje de pruebas con resultado, entre las que se podían decidir.",
    process: "Proceso de análisis completo", processHelp: "100% cuando cada prueba llegó a un estado final, aunque algunas no se decidieron.",
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
    blockedTitle: "Documentos que no son públicos", notFoundTitle: "No se encontró información sobre el tema", undecidedTitle: "No se pudo decidir automáticamente", technicalTitle: "Comprobación que no terminó",
  },
  "pt-BR": {
    newScan: "Nova varredura", pdf: "Baixar PDF", site: "Site verificado", address: "Endereço", date: "Data", status: "Status",
    score: "Pontuação das verificações", scoreHelp: "A pontuação usa as verificações concluídas. As que não puderam ser concluídas não são falhas, mas limitam o escopo.",
    coverage: "Verificações decididas", coverageHelp: "A parte das verificações com resultado, entre as que podiam ser decididas.",
    process: "Processo de varredura concluído", processHelp: "100% quando cada verificação chegou a um estado final, mesmo que algumas não tenham sido decididas.",
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
    blockedTitle: "Documentos que não são públicos", notFoundTitle: "Não foi encontrada informação sobre o tema", undecidedTitle: "Não foi possível decidir automaticamente", technicalTitle: "Verificação que não terminou",
  },
  ar: {
    newScan: "فحص جديد", pdf: "تنزيل PDF", site: "الموقع الذي فُحص", address: "العنوان", date: "التاريخ", status: "الحالة",
    score: "درجة الفحوصات", scoreHelp: "الدرجة مبنية على الفحوصات المكتملة. الفحوصات التي تعذر إكمالها ليست إخفاقًا، لكنها تحد من النطاق.",
    coverage: "فحوصات تم حسمها", coverageHelp: "نسبة الفحوصات التي صدرت لها نتيجة، من الفحوصات التي أمكن حسمها.",
    process: "اكتمال عملية الفحص", processHelp: "100% عندما وصل كل فحص إلى حالة نهائية، حتى إذا لم يُحسم بعضها.",
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
    blockedTitle: "مستندات غير متاحة للعموم", notFoundTitle: "لم يُعثر على معلومات في هذا الموضوع", undecidedTitle: "تعذر الحسم تلقائيًا", technicalTitle: "فحص لم يكتمل",
  },
};

function hostName(url?: string) {
  try { return new URL(String(url || "")).hostname.replace(/^www\./, ""); } catch { return ""; }
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

function formatWhen(value: unknown, locale: Locale) {
  const date = new Date(String(value || ""));
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

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
  const findings: Finding[] = report.findings || [];
  const unfinished = findings.filter((item) => ["unverified", "gap", "owner"].includes(bandOf(item)));
  const proven = findings.filter((item) => bandOf(item) === "proven" || bandOf(item) === "missing");
  const counts = {
    pass: findings.filter((item) => bandOf(item) === "pass").length,
    action: findings.filter((item) => bandOf(item) === "proven").length,
    unknown: unfinished.length,
  };
  const actions = (report.priorities || []).slice(0, 12);
  const status = payload?.status === "completed" ? copy.completed : payload?.status === "failed" ? copy.failed : copy.running;
  const groupOf = (item: Finding) => {
    const id = String(item.checkId || "");
    if (id.startsWith("a11y") || id.startsWith("accessibility")) return "access";
    if (id.startsWith("security")) return "security";
    if (id.startsWith("document") || bandOf(item) === "missing") return "docs";
    return "privacy";
  };
  const sections = [
    ["access", copy.navAccess],
    ["security", copy.navSecurity],
    ["privacy", copy.navPrivacy],
    ["docs", copy.navDocs],
  ] as const;

  const shownScore = (report.scores?.overall?.withheld ? report.scores?.technical?.value : report.scores?.overall?.value) ?? "—";
  const shownCoverage = report.scores?.coverage?.value ?? "—";
  const shownProcess = report.scores?.coverage?.process ?? "—";
  const blocked = findings.filter((item) => bandOf(item) === "owner");
  const notFound = findings.filter((item) => bandOf(item) === "gap");
  const technical = findings.filter((item) => item.checkId === "content.not_performed" || item.checkId === "a11y.axe");
  const undecided = findings.filter((item) => bandOf(item) === "unverified" && !technical.includes(item));
  return (
    <section className="scan-report report-sheet">
      <header className="report-sheet__mast">
        <div>
          <p className="report-sheet__kicker">{copy.site}</p>
          <h2>{hostName(report.url) || report.url}</h2>
        </div>
        <div className="report-sheet__actions">
          <button type="button" data-action="pdf" onClick={onPdf}>{copy.pdf}</button>
          <Link to="/compliance">{copy.newScan}</Link>
        </div>
      </header>
      <dl className="report-sheet__meta">
        <div><dt>{copy.address}</dt><dd dir="ltr">{report.url || "—"}</dd></div>
        <div><dt>{copy.date}</dt><dd>{formatWhen(report.scannedAt, locale)}</dd></div>
        <div><dt>{copy.status}</dt><dd>{status}</dd></div>
        <div><dt>{copy.score}</dt><dd>{shownScore}/100</dd></div>
      </dl>
      <div className="report-sheet__score">
        <div>
          <b>{shownScore}<small>/100</small></b>
          <span>{copy.score}</span>
        </div>
        <div>
          <b>{shownProcess}<small>%</small></b>
          <span>{copy.process}</span>
          <p>{copy.processHelp}</p>
        </div>
        <div>
          <b>{shownCoverage}<small>%</small></b>
          <span>{copy.coverage}</span>
          <div className="report-sheet__bar" aria-hidden="true"><span style={{ width: `${Number(shownCoverage) || 0}%` }} /></div>
          <p>{copy.coverageHelp}</p>
        </div>
      </div>
      <p className="report-sheet__scope">{copy.scoreHelp}</p>
      <p className="report-sheet__scope">{copy.unknown}: {counts.unknown}</p>
      <div className="report-sheet__metrics">
        <article><b>{counts.pass}</b><span>{copy.ok}</span></article>
        <article><b>{counts.action}</b><span>{copy.todo}</span></article>
        <article><b>{report.documents?.filter((item: { state?: string }) => item.state === "not_found_after_scan").length || 0}</b><span>{copy.missing}</span></article>
        <article><b>{counts.unknown}</b><span>{copy.unknown}</span></article>
      </div>
      <nav className="report-nav">
        {sections.map(([id, label]) => <a key={id} href={`#report-${id}`}>{label}</a>)}
        <a href="#report-plan">{copy.navPlan}</a>
        <a href="#report-open">{copy.navOpen}</a>
      </nav>
      {sections.map(([id, label]) => {
        const rank = (value?: string) => ({ high: 0, medium: 1, low: 2, info: 3 } as Record<string, number>)[value || "info"] ?? 4;
        const rows = proven.filter((item) => groupOf(item) === id).sort((a, b) => rank(a.severity) - rank(b.severity));
        return (
          <section key={id} id={`report-${id}`} className="report-findings">
            <h2 className="report-band">{label}</h2>
            {rows.length === 0 ? <p className="report-empty">{copy.empty}</p> : rows.map((item, index) => {
              const detail = detailOf(item, copy);
              const body = String(item.explanation || item.description || "").trim();
              const title = String(item.title || "").trim();
              const fix = String(detail.change || item.recommendation || "");
              const draft = String(detail.proposedText || "");
              const sourceUrl = officialSource(detail.lawName, detail.lawUrl);
              const located = item.locationVerified === false ? false : Boolean(item.url);
              return (
                <article key={`${item.checkId}-${index}`} className={`report-finding sev-${item.severity || "info"}`}>
                  <header>
                    <p>{copy.severity}: {copy[item.severity || "info"] || item.severity}</p>
                    <h3>{item.title}</h3>
                  </header>
                  {body && body !== title ? <p>{body}</p> : null}
                  <p dir="ltr">{located ? <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a> : copy.unknownPlace}</p>
                  {item.evidence ? <p className="report-finding__evidence" dir="auto">{item.evidence}</p> : null}
                  {fix ? <p><strong>{copy.fix}. </strong>{fix}</p> : null}
                  {draft && draft !== fix ? <p><strong>{copy.draft}. </strong>{draft}</p> : null}
                  {sourceUrl ? <p><strong>{copy.law}. </strong><a href={sourceUrl} target="_blank" rel="noopener noreferrer">{String(detail.lawName || sourceUrl)}</a></p> : null}
                </article>
              );
            })}
          </section>
        );
      })}
      <section className="report-sheet__block">
        <h2>{copy.tools}</h2>
        {(report.trackers || []).length === 0 ? <p>{copy.noTools}</p> : (
          <ul>
            {(report.trackers || []).map((tool: { name?: string; pageUrl?: string; beforeConsent?: string }) => (
              <li key={`${tool.name}-${tool.pageUrl}`}><strong>{tool.name}</strong><p dir="ltr">{tool.pageUrl}</p><p>{copy.purpose}. {tool.beforeConsent || copy.consent}</p></li>
            ))}
          </ul>
        )}
      </section>
      <section id="report-plan" className="report-sheet__block">
        <h2>{copy.plan}</h2>
        <ol>
          {actions.map((item: Finding & { order?: number; change?: string; verify?: string }) => (
            <li key={`${item.order || ""}-${item.checkId}`}>
              <strong>{item.title}</strong>
              <p dir="ltr">{item.url || copy.unknownPlace}</p>
              <p>{String(item.change || item.recommendation || "")}</p>
              {item.verify ? <p>{String(item.verify)}</p> : null}
            </li>
          ))}
        </ol>
      </section>
      <section id="report-open" className="report-sheet__block">
        <h2>{copy.notFoundTitle}</h2>
        {notFound.length === 0 ? <p>{copy.empty}</p> : notFound.map((item, index) => (
          <article key={`gap-${item.checkId}-${index}`} className="report-open"><h3>{item.title}</h3><p>{item.explanation || item.description}</p></article>
        ))}
        <h2>{copy.undecidedTitle}</h2>
        {undecided.length === 0 ? <p>{copy.empty}</p> : undecided.map((item, index) => (
          <article key={`open-${item.checkId}-${index}`} className="report-open"><h3>{item.title}</h3><p>{item.explanation || item.description}</p></article>
        ))}
        <h2>{copy.blockedTitle}</h2>
        {blocked.length === 0 ? <p>{copy.empty}</p> : blocked.map((item, index) => (
          <article key={`blocked-${item.checkId}-${index}`} className="report-open"><h3>{item.title}</h3><p>{item.explanation || item.description}</p></article>
        ))}
        <h2>{copy.technicalTitle}</h2>
        {technical.length === 0 ? <p>{copy.empty}</p> : technical.map((item, index) => (
          <article key={`tech-${item.checkId}-${index}`} className="report-open"><h3>{item.title}</h3><p>{item.explanation || item.description}</p></article>
        ))}
      </section>
    </section>
  );
}

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./complianceScanner.css";
import { FreeResult, MonitorBoard, PlanCards, commercialLocale } from "./ComplianceCommercial";
import { ComplianceReportView } from "./ComplianceReportView";

const TOKEN_KEY = "bizuplyComplianceTenant";
const ADMIN_KEY = "bizuplyComplianceAdmin";

const REVIEW_COPY: Record<Locale, { label: string; action: string; on: string; fail: string; history: string }> = {
  he: { label: "קוד פנימי", action: "אימות", on: "הגישה הפנימית פתוחה בכרטיסייה הזו בלבד. היא לא נשמרת כהרשאה של החשבון.", fail: "הקוד לא אומת.", history: "סריקות של הגישה הזו" },
  en: { label: "Internal code", action: "Verify", on: "Internal access was verified. Automatic monitoring is off.", fail: "The code was not accepted.", history: "Scans for this access" },
  es: { label: "Código de prueba", action: "Abrir el informe completo", on: "Este acceso abre sus propios informes. El seguimiento automático está apagado.", fail: "El código no fue aceptado.", history: "Escaneos de este acceso" },
  "pt-BR": { label: "Código de teste", action: "Abrir o relatório completo", on: "Este acesso abre os próprios relatórios. O monitoramento automático está desligado.", fail: "O código não foi aceito.", history: "Varreduras deste acesso" },
  ar: { label: "رمز الفحص", action: "افتحوا التقرير الكامل", on: "هذا الوصول يفتح تقاريره. المراقبة التلقائية متوقفة.", fail: "لم يُقبل الرمز.", history: "فحوصات هذا الوصول" },
};

function ReviewAccess({ locale, onUnlocked }: { locale: Locale; onUnlocked?: () => void }) {
  const copy = REVIEW_COPY[locale] || REVIEW_COPY.en;
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(Boolean(sessionStorage.getItem(ADMIN_KEY)));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const entered = code;
    setCode("");
    setMessage("");
    const response = await fetch("/compliance/api/review-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: entered }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true || !data.adminSession) {
      sessionStorage.removeItem(ADMIN_KEY);
      setOpen(false);
      setMessage(copy.fail);
      return;
    }
    sessionStorage.setItem(ADMIN_KEY, data.adminSession);
    setOpen(true);
    setMessage(copy.on);
    onUnlocked?.();
  }

  return (
    <section className="scan-review">
      <form onSubmit={submit}>
        <label>
          <span>{copy.label}</span>
          <input type="password" name="review-code" autoComplete="off" value={code} onChange={(event) => setCode(event.target.value)} />
        </label>
        <button className="scan-start" type="submit">{copy.action}</button>
      </form>
      {message && <p>{message}</p>}
      {open && !message ? <p>{copy.on}</p> : null}
    </section>
  );
}
const TYPES = ["brochure", "shop", "saas", "events", "professional", "other"] as const;

type Locale = "he" | "en" | "es" | "pt-BR" | "ar";
type Finding = {
  title?: string;
  description?: string;
  evidence?: string;
  evidenceLabel?: string;
  evidenceNote?: string;
  recommendation?: string;
  severity?: string;
  outcome?: string;
  url?: string;
  country?: string;
  checkId?: string;
  source?: { name?: string; url?: string } | null;
};

const COPY: Record<Locale, Record<string, string>> = {
  he: {
    kicker: "פרטיות · נגישות · אבטחה · רגולציה",
    title: "בדקו את האתר מול מה שהוא באמת מפרסם",
    lead: "סריקה טכנית וניתוח מסמכים של תקנון, פרטיות, עוגיות, נגישות ותנאי תשלום. הממצאים נשענים על הטקסט שנקרא, לא על ניחוש.",
    url: "כתובת האתר",
    fullName: "שם מלא",
    nameInvalid: "יש להזין שם פרטי ושם משפחה.",
    nameNotice: "השם נשמר עם הסריקה כדי לזהות את הדוח ולנהל את הפנייה. הוא לא נמכר ולא משמש לפרסום.",
    start: "התחילו סריקה",
    country: "איפה העסק פועל",
    search: "חיפוש מדינה",
    selected: "נבחרו",
    activity: "סוג הפעילות",
    audience: "האתר פונה גם ללקוחות במדינות נוספות?",
    yes: "כן",
    no: "לא",
    topics: "מה נבדק",
    topicPrivacy: "פרטיות",
    topicTerms: "תקנון",
    topicCookies: "עוגיות",
    topicAccess: "נגישות",
    topicPay: "תשלומים",
    topicSecurity: "אבטחה",
    notice: "הבדיקה אוטומטית. היא אינה ייעוץ משפטי, חוות דעת או אישור עמידה בחוק.",
    sample: "המחשה",
    sampleNote: "דוח לדוגמה. זו אינה תוצאת סריקה ואינה ציון אמיתי.",
    notLegal: "הציונים מפרידים בין קריאה, בדיקה טכנית וכיסוי. הם אינם אישור עמידה בחוק.",
    unread: "לא נקרא",
    running: "הסריקה רצה",
    documents: "מסמכים",
    technical: "בדיקה טכנית",
    coverage: "כיסוי",
    content: "ניתוח תוכן",
    pdf: "הורדת PDF",
    findings: "ממצאים",
    incomplete: "לא הושלם",
    evidence: "ראיה",
    source: "מקור",
    recommendation: "המלצה",
    all: "הכל",
    high: "גבוה",
    phaseCrawl: "סריקה",
    phaseDocuments: "מסמכים",
    phaseChecks: "בדיקות",
    phaseAnalysis: "ניתוח",
    phaseDone: "סיום",
    aiOff: "ניתוח התוכן לא בוצע, ולכן אין ציון משפטי.",
    aiOn: "ניתוח התוכן רץ על המסמכים שנקראו. הציון אינו אישור משפטי.",
    brochure: "אתר תדמית",
    shop: "חנות",
    saas: "SaaS",
    events: "אירועים",
    professional: "שירותים",
    other: "אחר",
    supported: "מקור מאומת",
    partial: "כיסוי חלקי",
    unavailable: "אין מקור מאומת",
  },
  en: {
    kicker: "Privacy · Accessibility · Security · Regulation",
    title: "Check the site against what it actually publishes",
    lead: "A technical scan and a reading of terms, privacy, cookies, accessibility, and payment terms. Findings stay tied to the text that was read.",
    url: "Website address",
    fullName: "Full name",
    nameInvalid: "Enter a first name and a last name.",
    nameNotice: "The name is stored with the scan so the report can be identified. It is not sold and it is not used for advertising.",
    start: "Start scan",
    country: "Where the business operates",
    search: "Search countries",
    selected: "Selected",
    activity: "Type of activity",
    audience: "Does the site also address customers in other countries?",
    yes: "Yes",
    no: "No",
    topics: "What is checked",
    topicPrivacy: "Privacy",
    topicTerms: "Terms",
    topicCookies: "Cookies",
    topicAccess: "Accessibility",
    topicPay: "Payments",
    topicSecurity: "Security",
    notice: "This is an automated check. It is not legal advice, a legal opinion, or confirmation of compliance.",
    sample: "Illustration",
    sampleNote: "A sample report. This is not a scan result and not a real score.",
    notLegal: "The scores separate reading, technical checks, and coverage. They are not confirmation of legal compliance.",
    unread: "Not read",
    running: "Scan in progress",
    documents: "Documents",
    technical: "Technical",
    coverage: "Coverage",
    content: "Content analysis",
    pdf: "Download PDF",
    findings: "Findings",
    incomplete: "Not completed",
    evidence: "Evidence",
    source: "Source",
    recommendation: "Recommendation",
    all: "All",
    high: "High",
    phaseCrawl: "Crawl",
    phaseDocuments: "Documents",
    phaseChecks: "Checks",
    phaseAnalysis: "Analysis",
    phaseDone: "Done",
    aiOff: "Content analysis did not run, so there is no legal score.",
    aiOn: "Content analysis ran on the documents that were read. The score is not legal approval.",
    brochure: "Brochure",
    shop: "Store",
    saas: "SaaS",
    events: "Events",
    professional: "Services",
    other: "Other",
    supported: "Verified source",
    partial: "Partial coverage",
    unavailable: "No verified source",
  },
  es: {
    kicker: "Privacidad · Accesibilidad · Seguridad · Regulación",
    title: "Revisen el sitio frente a lo que realmente publica",
    lead: "Escaneo técnico y lectura de condiciones, privacidad, cookies, accesibilidad y pagos. Los hallazgos se apoyan en el texto leído.",
    url: "Dirección del sitio",
    fullName: "Nombre completo",
    nameInvalid: "Escriban un nombre y un apellido.",
    nameNotice: "El nombre se guarda con el análisis para identificar el informe. No se vende ni se usa para publicidad.",
    start: "Iniciar revisión",
    country: "Dónde opera el negocio",
    search: "Buscar país",
    selected: "Seleccionados",
    activity: "Tipo de actividad",
    audience: "¿El sitio también se dirige a clientes de otros países?",
    yes: "Sí",
    no: "No",
    topics: "Qué se revisa",
    topicPrivacy: "Privacidad",
    topicTerms: "Condiciones",
    topicCookies: "Cookies",
    topicAccess: "Accesibilidad",
    topicPay: "Pagos",
    topicSecurity: "Seguridad",
    notice: "Es una revisión automática. No es asesoramiento jurídico ni confirmación de cumplimiento.",
    sample: "Ilustración",
    sampleNote: "Informe de ejemplo. No es un resultado real ni una puntuación real.",
    notLegal: "Las puntuaciones separan lectura, revisión técnica y cobertura. No confirman el cumplimiento legal.",
    unread: "No leído",
    running: "Revisión en curso",
    documents: "Documentos",
    technical: "Técnico",
    coverage: "Cobertura",
    content: "Análisis de contenido",
    pdf: "Descargar PDF",
    findings: "Hallazgos",
    incomplete: "No completado",
    evidence: "Evidencia",
    source: "Fuente",
    recommendation: "Recomendación",
    all: "Todo",
    high: "Alto",
    phaseCrawl: "Rastreo",
    phaseDocuments: "Documentos",
    phaseChecks: "Controles",
    phaseAnalysis: "Análisis",
    phaseDone: "Listo",
    aiOff: "El análisis de contenido no se ejecutó, así que no hay puntuación jurídica.",
    aiOn: "El análisis se hizo sobre los documentos leídos. La puntuación no es una aprobación legal.",
    brochure: "Sitio corporativo",
    shop: "Tienda",
    saas: "SaaS",
    events: "Eventos",
    professional: "Servicios",
    other: "Otro",
    supported: "Fuente verificada",
    partial: "Cobertura parcial",
    unavailable: "Sin fuente verificada",
  },
  "pt-BR": {
    kicker: "Privacidade · Acessibilidade · Segurança · Regulação",
    title: "Confira o site diante do que ele realmente publica",
    lead: "Varredura técnica e leitura de termos, privacidade, cookies, acessibilidade e pagamentos. Os achados ficam ligados ao texto lido.",
    url: "Endereço do site",
    fullName: "Nome completo",
    nameInvalid: "Informem um nome e um sobrenome.",
    nameNotice: "O nome fica salvo com a varredura para identificar o relatório. Ele não é vendido nem usado para publicidade.",
    start: "Iniciar verificação",
    country: "Onde o negócio atua",
    search: "Buscar país",
    selected: "Selecionados",
    activity: "Tipo de atividade",
    audience: "O site também se dirige a clientes de outros países?",
    yes: "Sim",
    no: "Não",
    topics: "O que é verificado",
    topicPrivacy: "Privacidade",
    topicTerms: "Termos",
    topicCookies: "Cookies",
    topicAccess: "Acessibilidade",
    topicPay: "Pagamentos",
    topicSecurity: "Segurança",
    notice: "Esta é uma verificação automática. Não é aconselhamento jurídico nem confirmação de conformidade.",
    sample: "Ilustração",
    sampleNote: "Relatório de exemplo. Não é um resultado real nem uma pontuação real.",
    notLegal: "As pontuações separam leitura, verificação técnica e cobertura. Elas não confirmam conformidade legal.",
    unread: "Não lido",
    running: "Verificação em andamento",
    documents: "Documentos",
    technical: "Técnico",
    coverage: "Cobertura",
    content: "Análise de conteúdo",
    pdf: "Baixar PDF",
    findings: "Achados",
    incomplete: "Não concluído",
    evidence: "Evidência",
    source: "Fonte",
    recommendation: "Recomendação",
    all: "Tudo",
    high: "Alto",
    phaseCrawl: "Rastreio",
    phaseDocuments: "Documentos",
    phaseChecks: "Verificações",
    phaseAnalysis: "Análise",
    phaseDone: "Concluído",
    aiOff: "A análise de conteúdo não rodou, então não há pontuação jurídica.",
    aiOn: "A análise usou os documentos lidos. A pontuação não é aprovação legal.",
    brochure: "Site institucional",
    shop: "Loja",
    saas: "SaaS",
    events: "Eventos",
    professional: "Serviços",
    other: "Outro",
    supported: "Fonte verificada",
    partial: "Cobertura parcial",
    unavailable: "Sem fonte verificada",
  },
  ar: {
    kicker: "الخصوصية · الإتاحة · الأمان · التنظيم",
    title: "افحصوا الموقع مقابل ما ينشره فعلًا",
    lead: "فحص تقني وقراءة للشروط والخصوصية وملفات الارتباط والإتاحة وشروط الدفع. النتائج تستند إلى النص الذي قُرئ.",
    url: "عنوان الموقع",
    fullName: "الاسم الكامل",
    nameInvalid: "أدخلوا الاسم الأول واسم العائلة.",
    nameNotice: "يُحفظ الاسم مع الفحص للتعرّف على التقرير وإدارة الطلب. لا يُباع ولا يُستخدم للإعلان.",
    start: "ابدأوا الفحص",
    country: "أين يعمل النشاط",
    search: "بحث عن دولة",
    selected: "المحدد",
    activity: "نوع النشاط",
    audience: "هل يخاطب الموقع زبائن في دول أخرى أيضًا؟",
    yes: "نعم",
    no: "لا",
    topics: "ما الذي يُفحص",
    topicPrivacy: "الخصوصية",
    topicTerms: "الشروط",
    topicCookies: "ملفات الارتباط",
    topicAccess: "الإتاحة",
    topicPay: "المدفوعات",
    topicSecurity: "الأمان",
    notice: "هذا فحص آلي. ليس استشارة قانونية ولا تأكيدًا للامتثال.",
    sample: "توضيح",
    sampleNote: "تقرير للعرض. هذه ليست نتيجة فحص وليست درجة حقيقية.",
    notLegal: "الدرجات تفصل بين القراءة والفحص التقني والتغطية. ليست تأكيدًا للامتثال القانوني.",
    unread: "لم يُقرأ",
    running: "الفحص جارٍ",
    documents: "المستندات",
    technical: "الفحص التقني",
    coverage: "التغطية",
    content: "تحليل المحتوى",
    pdf: "تنزيل PDF",
    findings: "النتائج",
    incomplete: "غير مكتمل",
    evidence: "دليل",
    source: "المصدر",
    recommendation: "توصية",
    all: "الكل",
    high: "مرتفع",
    phaseCrawl: "الزحف",
    phaseDocuments: "المستندات",
    phaseChecks: "الفحوصات",
    phaseAnalysis: "التحليل",
    phaseDone: "تم",
    aiOff: "لم يُنفَّذ تحليل المحتوى، لذلك لا توجد درجة قانونية.",
    aiOn: "جرى التحليل على المستندات التي قُرئت. الدرجة ليست اعتمادًا قانونيًا.",
    brochure: "موقع تعريفي",
    shop: "متجر",
    saas: "SaaS",
    events: "فعاليات",
    professional: "خدمات",
    other: "آخر",
    supported: "مصدر موثّق",
    partial: "تغطية جزئية",
    unavailable: "لا مصدر موثّق",
  },
};

const TOPIC_KEYS = ["topicPrivacy", "topicTerms", "topicCookies", "topicAccess", "topicPay", "topicSecurity"];

function localeOf(language: string): Locale {
  const value = language.toLowerCase();
  if (value.startsWith("pt")) return "pt-BR";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("ar")) return "ar";
  if (value.startsWith("he")) return "he";
  return "en";
}

const LIVE: Record<Locale, Record<string, string>> = {
  he: {
    liveTitle: "אנחנו בודקים את האתר שלך",
    live_wait: "ממתינים לנתוני ההתקדמות מהשרת",
    live_crawl: "קוראים את העמודים הציבוריים",
    live_browser: "טוענים עמוד בדפדפן",
    live_documents: "קוראים מסמכים משפטיים",
    live_checks: "מריצים בדיקות אבטחה, פרטיות ונגישות",
    live_analysis: "משווים את מה שנקרא",
    live_done: "הסריקה הסתיימה",
    catSecurity: "אבטחה",
    catPrivacy: "פרטיות ועוגיות",
    catAccess: "נגישות",
    catDocs: "מסמכים משפטיים",
    state_waiting: "ממתין",
    state_checking: "בבדיקה",
    state_done: "הושלם",
    state_blocked: "לא ניתן להשלים",
    now: "עכשיו: {name}",
    doneOf: "הושלמו {done} מתוך {total}",
  },
  en: {
    liveTitle: "We are checking your site",
    live_wait: "Waiting for progress from the server",
    live_crawl: "Reading public pages",
    live_browser: "Loading a page in the browser",
    live_documents: "Reading legal documents",
    live_checks: "Running security, privacy, and accessibility checks",
    live_analysis: "Comparing what was read",
    live_done: "The scan finished",
    catSecurity: "Security",
    catPrivacy: "Privacy and cookies",
    catAccess: "Accessibility",
    catDocs: "Legal documents",
    state_waiting: "Waiting",
    state_checking: "Checking",
    state_done: "Completed",
    state_blocked: "Could not complete",
    now: "Now: {name}",
    doneOf: "{done} of {total} completed",
  },
  es: {
    liveTitle: "Estamos revisando tu sitio",
    live_wait: "Esperando el avance del servidor",
    live_crawl: "Leyendo páginas públicas",
    live_browser: "Cargando una página en el navegador",
    live_documents: "Leyendo documentos legales",
    live_checks: "Ejecutando controles de seguridad, privacidad y accesibilidad",
    live_analysis: "Comparando lo leído",
    live_done: "El análisis terminó",
    catSecurity: "Seguridad",
    catPrivacy: "Privacidad y cookies",
    catAccess: "Accesibilidad",
    catDocs: "Documentos legales",
    state_waiting: "En espera",
    state_checking: "En revisión",
    state_done: "Completado",
    state_blocked: "No se pudo completar",
    now: "Ahora: {name}",
    doneOf: "{done} de {total} completadas",
  },
  "pt-BR": {
    liveTitle: "Estamos verificando o seu site",
    live_wait: "Aguardando o progresso do servidor",
    live_crawl: "Lendo páginas públicas",
    live_browser: "Carregando uma página no navegador",
    live_documents: "Lendo documentos legais",
    live_checks: "Executando verificações de segurança, privacidade e acessibilidade",
    live_analysis: "Comparando o que foi lido",
    live_done: "A varredura terminou",
    catSecurity: "Segurança",
    catPrivacy: "Privacidade e cookies",
    catAccess: "Acessibilidade",
    catDocs: "Documentos legais",
    state_waiting: "Aguardando",
    state_checking: "Em verificação",
    state_done: "Concluído",
    state_blocked: "Não foi possível concluir",
    now: "Agora: {name}",
    doneOf: "{done} de {total} concluídas",
  },
  ar: {
    liveTitle: "نحن نفحص موقعك",
    live_wait: "بانتظار تقدم الفحص من الخادم",
    live_crawl: "نقرأ الصفحات العلنية",
    live_browser: "نحمّل صفحة في المتصفح",
    live_documents: "نقرأ المستندات القانونية",
    live_checks: "نجري فحوصات الأمن والخصوصية والإتاحة",
    live_analysis: "نقارن ما قُرئ",
    live_done: "اكتمل الفحص",
    catSecurity: "الأمن",
    catPrivacy: "الخصوصية وملفات تعريف الارتباط",
    catAccess: "الإتاحة",
    catDocs: "مستندات قانونية",
    state_waiting: "بالانتظار",
    state_checking: "قيد الفحص",
    state_done: "اكتمل",
    state_blocked: "تعذر الإكمال",
    now: "الآن: {name}",
    doneOf: "اكتمل {done} من {total}",
  },
};

function ScanLive({
  copy,
  url,
  progress,
}: {
  copy: Record<string, string>;
  url: string;
  progress?: { phase?: string; categories?: Record<string, string>; completed?: number; total?: number; current?: string } | null;
}) {
  const categories = [
    ["security", copy.catSecurity],
    ["privacy", copy.catPrivacy],
    ["accessibility", copy.catAccess],
    ["documents", copy.catDocs],
  ] as const;
  const phase = progress?.phase || "";
  const total = Number(progress?.total);
  const completed = Number(progress?.completed);
  const hasBar = Number.isFinite(completed) && Number.isFinite(total) && total > 0;
  return (
    <section className="scan-live" aria-live="polite">
      <div className="scan-live__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <circle cx="28" cy="28" r="14" />
          <path d="M38 38 L52 52" />
        </svg>
      </div>
      <h2>{copy.liveTitle}</h2>
      <p className="scan-live__url" dir="ltr">{url || "—"}</p>
      <p className="scan-live__phase">{copy[`live_${phase}`] || copy.live_wait}</p>
      {progress?.current ? <p className="scan-live__phase">{copy.now.replace("{name}", progress.current)}</p> : null}
      {hasBar ? <p className="scan-live__phase">{copy.doneOf.replace("{done}", String(completed)).replace("{total}", String(total))}</p> : null}
      {hasBar ? (
        <div className="scan-live__bar" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total}>
          <span style={{ width: `${Math.max(0, Math.min(100, (completed / total) * 100))}%` }} />
        </div>
      ) : null}
      <ul className="scan-live__cats">
        {categories.map(([key, label]) => {
          const state = progress?.categories?.[key] || "waiting";
          return (
            <li key={key} className={`is-${state}`}>
              <b>{label}</b>
              <em>{copy[`state_${state}`] || copy.state_waiting}</em>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function ComplianceScannerPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const locale = localeOf(i18n.language || "he");
  const copy = COPY[locale];
  const live = LIVE[locale] || LIVE.en;
  const previewScan = !id && searchParams.get("ui") === "scan";
  const dir = locale === "he" || locale === "ar" ? "rtl" : "ltr";
  const [url, setUrl] = useState("https://");
  const [fullName, setFullName] = useState("");
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [support, setSupport] = useState<Record<string, { level?: string }>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [states, setStates] = useState<Array<{ code: string; en: string; he: string }>>([]);
  const [businessType, setBusinessType] = useState<(typeof TYPES)[number]>("brochure");
  const [audience, setAudience] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<any>(null);
  const [reload, setReload] = useState(0);
  const names = useMemo(() => {
    try { return new Intl.DisplayNames([locale === "pt-BR" ? "pt" : locale], { type: "region" }); }
    catch { return null; }
  }, [locale]);

  useEffect(() => {
    let ignore = false;
    fetch("/compliance/api/countries")
      .then((response) => response.json())
      .then((data) => {
        if (ignore) return;
        setCountries(data.countries || []);
        setSupport(data.support || {});
        setStates(data.subdivisions?.US || []);
      })
      .catch(() => { if (!ignore) setError(copy.notice); });
    return () => { ignore = true; };
  }, [copy.notice]);

  useEffect(() => {
    if (!id) return undefined;
    let stop = false;
    const tick = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY) || "";
        const admin = sessionStorage.getItem(ADMIN_KEY) || "";
        const platform = localStorage.getItem("token") || "";
        const headers: Record<string, string> = {};
        if (token) headers["x-tenant-token"] = token;
        if (admin) headers["x-admin-session"] = admin;
        if (platform) headers.Authorization = `Bearer ${platform}`;
        const view = searchParams.get("view") === "summary" ? "&view=summary" : "";
        const response = await fetch(`/compliance/api/scans/${id}?locale=${encodeURIComponent(locale)}${view}`, { headers });
        const data = await response.json();
        if (stop) return;
        if (!response.ok) { setError(data.error || ""); return; }
        setError("");
        setPayload(data);
        if (data.status === "queued" || data.status === "running") window.setTimeout(tick, 1200);
      } catch {
        if (!stop) setError(copy.notice);
      }
    };
    tick();
    return () => { stop = true; };
  }, [id, locale, reload, searchParams]);

  const matches = countries.filter((code) => {
    const name = names?.of(code) || code;
    const hay = `${code} ${name}`.toLowerCase();
    return hay.includes(query.trim().toLowerCase());
  }).slice(0, 8);

  async function startScan(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!selected.length) { setError(copy.country); return; }
    const nameParts = fullName.trim().split(/\s+/).filter((part) => part.length >= 2);
    if (nameParts.length < 2) { setError(copy.nameInvalid); return; }
    const token = localStorage.getItem(TOKEN_KEY) || undefined;
    const platform = localStorage.getItem("token") || "";
    const response = await fetch("/compliance/api/scans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(platform ? { Authorization: `Bearer ${platform}` } : {}),
      },
      body: JSON.stringify({
        url, requesterName: fullName.trim(), plan: "free", countries: selected, businessType,
        targetsOtherCountries: audience, locale, tenantToken: token,
      }),
    });
    const data = await response.json();
    if (!response.ok) { setError(data.error || ""); return; }
    if (data.tenantToken) localStorage.setItem(TOKEN_KEY, data.tenantToken);
    navigate(`/compliance/report/${data.id}`);
  }

  async function downloadPdf() {
    const token = localStorage.getItem(TOKEN_KEY) || "";
    const admin = sessionStorage.getItem(ADMIN_KEY) || "";
    const platform = localStorage.getItem("token") || "";
    const headers: Record<string, string> = {};
    if (token) headers["x-tenant-token"] = token;
    if (admin) headers["x-admin-session"] = admin;
    if (platform) headers.Authorization = `Bearer ${platform}`;
    const response = await fetch(`/compliance/api/scans/${id}/pdf`, { headers });
    if (!response.ok) { setError(copy.notice); return; }
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bizuply-website-report.pdf";
    link.click();
  }

  const levelLabel = (code: string) => {
    const level = support[code]?.level;
    if (level === "supported") return copy.supported;
    if (level === "partial") return copy.partial;
    return copy.unavailable;
  };

  if (location.pathname.endsWith("/compliance/review")) {
    return (
      <main className="scan-product scan-product--report" dir={dir} lang={locale}>
        <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
        <ReviewAccess locale={locale} onUnlocked={() => setReload((value) => value + 1)} />
      </main>
    );
  }

  return (
    <main className={id ? "scan-product scan-product--report" : "scan-product"} dir={dir} lang={locale}>
      {id ? <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet> : null}
      {!id && !previewScan && <form onSubmit={startScan}>
      <section className="scan-hero">
        <div className="scan-hero__copy">
          <p className="scan-kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p className="scan-lead">{copy.lead}</p>
          <div className="scan-panel">
            <div className="scan-launch">
              <label className="scan-url">
                <span>{copy.fullName}</span>
                <input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required />
              </label>
              <label className="scan-url">
                <span>{copy.url}</span>
                <input value={url} onChange={(event) => setUrl(event.target.value)} inputMode="url" required />
              </label>
              <button className="scan-start" type="submit">{copy.start}</button>
            </div>
            <p className="scan-name-note">{copy.nameNotice}</p>
            <div className="scan-field">
              <span>{copy.country}</span>
              <p className="scan-meta">{copy.selected} {selected.length}</p>
              <div className="scan-tags">
                {selected.map((code) => (
                  <button key={code} type="button" onClick={() => setSelected(selected.filter((item) => item !== code))}>
                    {(names?.of(code) || code)} · {levelLabel(code)}
                  </button>
                ))}
              </div>
              <input className="scan-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} />
              {query && (
                <ul className="scan-results-list">
                  {matches.map((code) => (
                    <li key={code}>
                      <button type="button" onClick={() => { setSelected([...new Set([...selected, code])]); setQuery(""); }}>
                        <strong>{names?.of(code) || code}</strong>
                        <em>{code}</em>
                        <span>{levelLabel(code)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {selected.includes("US") && (
                <div className="scan-tags">
                  {states.slice(0, 8).map((state) => (
                    <button key={state.code} type="button" onClick={() => setSelected([...new Set([...selected, state.code])])}>
                      {locale === "he" ? state.he : state.en}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="scan-field">
              <span>{copy.activity}</span>
              <div className="scan-types">
                {TYPES.map((type) => (
                  <button key={type} type="button" className={businessType === type ? "is-on" : ""} onClick={() => setBusinessType(type)} aria-pressed={businessType === type}>
                    {copy[type]}
                  </button>
                ))}
              </div>
            </div>
            <div className="scan-field">
              <span>{copy.audience}</span>
              <div className="scan-choice">
                <button type="button" className={audience ? "is-on" : ""} onClick={() => setAudience(true)}>{copy.yes}</button>
                <button type="button" className={!audience ? "is-on" : ""} onClick={() => setAudience(false)}>{copy.no}</button>
              </div>
            </div>
            <p className="scan-notice">{copy.notice}</p>
          </div>
        </div>
      </section>
      <ol className="scan-steps">
        <li>{copy.phaseCrawl}</li>
        <li>{copy.phaseDocuments}</li>
        <li>{copy.phaseDone}</li>
      </ol>
      </form>}
      {error && <p className="scan-error" role="alert">{error}</p>}
      {previewScan && (
        <ScanLive
          copy={live}
          url="https://example.com"
          progress={{ phase: "checks", current: "נגישות", completed: 4, total: 12, categories: { security: "checking", privacy: "waiting", accessibility: "done", documents: "blocked" } }}
        />
      )}
      {!id && !previewScan && (
        <>
          <PlanCards locale={commercialLocale(locale)} />
          <MonitorBoard locale={commercialLocale(locale)} />
        </>
      )}

      {payload && (
        <section className="scan-report" aria-live="polite">
          {payload.status !== "completed" ? (
            <ScanLive copy={live} url={payload.url || ""} progress={payload.progress} />
          ) : payload.access !== "full" ? (
            <FreeResult locale={commercialLocale(locale)} summary={payload.summary} status={payload.status} scanId={id} />
          ) : (
            <>
              <ComplianceReportView locale={locale} payload={payload} onPdf={downloadPdf} />
            </>
          )}
        </section>
      )}
    </main>
  );
}

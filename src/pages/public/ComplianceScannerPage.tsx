import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./complianceScanner.css";

const TOKEN_KEY = "bizuplyComplianceTenant";
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

function scoreText(value: number | null | undefined) {
  return value == null ? "—" : String(value);
}

function textDir(value?: string) {
  return value && /[\u0590-\u05FF\u0600-\u06FF]/.test(value) ? "rtl" : "ltr";
}

export default function ComplianceScannerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const locale = localeOf(i18n.language || "he");
  const copy = COPY[locale];
  const dir = locale === "he" || locale === "ar" ? "rtl" : "ltr";
  const [url, setUrl] = useState("https://");
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [support, setSupport] = useState<Record<string, { level?: string }>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [states, setStates] = useState<Array<{ code: string; en: string; he: string }>>([]);
  const [businessType, setBusinessType] = useState<(typeof TYPES)[number]>("brochure");
  const [audience, setAudience] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<any>(null);
  const [filter, setFilter] = useState("all");
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
        const response = await fetch(`/compliance/api/scans/${id}?locale=${encodeURIComponent(locale)}`, {
          headers: token ? { "x-tenant-token": token } : {},
        });
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
  }, [id, locale]);

  const matches = countries.filter((code) => {
    const name = names?.of(code) || code;
    const hay = `${code} ${name}`.toLowerCase();
    return hay.includes(query.trim().toLowerCase());
  }).slice(0, 8);

  async function startScan(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!selected.length) { setError(copy.country); return; }
    const token = localStorage.getItem(TOKEN_KEY) || undefined;
    const response = await fetch("/compliance/api/scans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url, plan: "free", countries: selected, businessType,
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
    const response = await fetch(`/compliance/api/scans/${id}/pdf`, { headers: { "x-tenant-token": token } });
    if (!response.ok) return;
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bizuply-website-report.pdf";
    link.click();
  }

  const report = payload?.report;
  const findings: Finding[] = report?.findings || [];
  const visible = findings.filter((item) => filter === "all" || item.outcome === filter || item.severity === filter || item.country === filter);
  const levelLabel = (code: string) => {
    const level = support[code]?.level;
    if (level === "supported") return copy.supported;
    if (level === "partial") return copy.partial;
    return copy.unavailable;
  };

  return (
    <main className="scan-product" dir={dir} lang={locale}>
      {!id && <form onSubmit={startScan}>
      <section className="scan-hero">
        <div className="scan-hero__copy">
          <p className="scan-kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p className="scan-lead">{copy.lead}</p>
          <div className="scan-panel">
            <label className="scan-url">
              <span>{copy.url}</span>
              <input value={url} onChange={(event) => setUrl(event.target.value)} inputMode="url" required />
            </label>
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
            <button className="scan-start" type="submit">{copy.start}</button>
            <p className="scan-notice">{copy.notice}</p>
          </div>
        </div>
        <aside className="scan-preview" aria-hidden="true">
          <p className="scan-kicker">{copy.sample}</p>
          <div className="scan-preview__sheet">
            <b>{copy.topicPrivacy}</b>
            <i /><i className="short" />
            <div className="scan-preview__bars"><span /><span /><span /></div>
            <small>{copy.sampleNote}</small>
          </div>
        </aside>
      </section>
      </form>}
      {error && <p className="scan-error" role="alert">{error}</p>}

      {payload && (
        <section className="scan-report" aria-live="polite">
          {payload.status !== "completed" ? (
            <div className="scan-progress">
              <h2>{copy.running}</h2>
              <ol>
                {([["crawl", copy.phaseCrawl], ["documents", copy.phaseDocuments], ["checks", copy.phaseChecks], ["analysis", copy.phaseAnalysis], ["done", copy.phaseDone]] as const).map(([phase, label]) => (
                  <li key={phase} className={payload.phase === phase ? "is-on" : ""}>{label}</li>
                ))}
              </ol>
            </div>
          ) : (
            <>
              <header className="scan-report__head">
                <div>
                  <p dir="ltr">{report.url}</p>
                  <h2>{report.ai?.contentPerformed ? copy.aiOn : copy.aiOff}</h2>
                  <a href="/compliance">{copy.start}</a>
                </div>
                <button type="button" className="scan-start" onClick={downloadPdf}>{copy.pdf}</button>
              </header>
              <p className="scan-not-legal">{copy.notLegal}</p>
              <div className="scan-scores">
                <article><b>{report.scores?.documents?.withheld ? copy.unread : scoreText(report.scores?.documents?.value)}</b><span>{copy.documents}</span></article>
                <article><b>{scoreText(report.scores?.technical?.value)}</b><span>{copy.technical}</span></article>
                <article><b>{scoreText(report.scores?.coverage?.value)}</b><span>{copy.coverage}</span></article>
                <article><b>{report.ai?.contentPerformed && !report.scores?.consistency?.withheld ? scoreText(report.scores?.consistency?.value) : "—"}</b><span>{copy.content}</span></article>
              </div>
              <p className="scan-summary" dir={textDir(report.summary)}>{report.summary}</p>
              <div className="scan-filters">
                {["all", "finding", "incomplete", "high"].map((item) => (
                  <button key={item} type="button" className={filter === item ? "is-on" : ""} onClick={() => setFilter(item)}>
                    {item === "all" ? copy.all : item === "finding" ? copy.findings : item === "incomplete" ? copy.incomplete : copy.high}
                  </button>
                ))}
              </div>
              <div className="scan-cards">
                {visible.map((item, index) => (
                  <article key={`${item.checkId}-${index}`} className={`sev-${item.severity || "info"}`} dir={textDir(item.title || item.description)}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.evidence && <blockquote><span>{item.evidenceLabel || copy.evidence}</span><p dir={textDir(item.evidence)}>{item.evidence}</p>{item.evidenceNote && <small>{item.evidenceNote}</small>}</blockquote>}
                    {item.recommendation && <p><strong>{copy.recommendation}. </strong>{item.recommendation}</p>}
                    {item.source?.name && <p className="scan-source">{copy.source}: {item.source.url ? <a href={item.source.url}>{item.source.name}</a> : item.source.name}</p>}
                  </article>
                ))}
              </div>
              {(report.limitations || []).length > 0 && (
                <ul className="scan-limits">
                  {report.limitations.map((item: string) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </>
          )}
        </section>
      )}
    </main>
  );
}

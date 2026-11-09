import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePathCore.mjs";
import { WEBSITE_SCAN } from "../../lib/websiteScanStory.mjs";
import { PriceBoard } from "./ComplianceCommercial";
import "./websiteScan.css";

type Locale = "he" | "en" | "es" | "pt-BR" | "ar";

function mediaCode(locale: Locale) {
  return locale === "pt-BR" ? "pt" : locale;
}

function shotsFor(locale: Locale) {
  const code = mediaCode(locale);
  return [
    { src: `/media/compliance-demo/scan-${code}.png`, width: 1280, height: 720 },
    { src: `/media/compliance-demo/free-${code}.png`, width: 1280, height: 720 },
    { src: `/media/compliance-demo/report-${code}.png`, width: 1280, height: 720 },
  ];
}
const LINKS: Record<Locale, { privacy: string; access: string; guides: string }> = {
  he: { privacy: "מדיניות הפרטיות", access: "הצהרת הנגישות", guides: "מדריכים" },
  en: { privacy: "privacy policy", access: "accessibility statement", guides: "guides" },
  es: { privacy: "política de privacidad", access: "declaración de accesibilidad", guides: "guías" },
  "pt-BR": { privacy: "política de privacidade", access: "declaração de acessibilidade", guides: "guias" },
  ar: { privacy: "سياسة الخصوصية", access: "بيان الإتاحة", guides: "الأدلة" },
};

function storyOf(language: string) {
  const locale = (normalizeMarketingLocale(language) || "en") as Locale;
  return { locale, copy: WEBSITE_SCAN[locale] || WEBSITE_SCAN.en };
}

function schemaFor(copy: typeof WEBSITE_SCAN.he, canonical: string, locale: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: copy.title, description: copy.description, url: canonical, inLanguage: locale, isPartOf: { "@id": "https://bizuply.com/#website" } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Bizuply", item: "https://bizuply.com/" },
        { "@type": "ListItem", position: 2, name: copy.crumb, item: canonical },
      ] },
      { "@type": "Service", name: "Bizuply Compliance AI", serviceType: "Website scan", provider: { "@id": "https://bizuply.com/#organization" }, areaServed: "Worldwide", url: canonical, description: copy.description },
      { "@type": "VideoObject", name: copy.videoTitle, description: copy.transcript, thumbnailUrl: `https://bizuply.com/media/compliance-demo/poster-${mediaCode(locale as Locale)}.jpg`, uploadDate: "2026-11-09", contentUrl: `https://bizuply.com/media/compliance-demo/${mediaCode(locale as Locale)}.mp4`, inLanguage: locale },
      { "@type": "Offer", name: "Free scan", price: "0", priceCurrency: "USD", description: "First scan with a score and a finding summary. Checkout is not open." },
      { "@type": "Offer", name: "One-time full report", price: "35", priceCurrency: "USD", description: "One full scan. Checkout is not open." },
      { "@type": "Offer", name: "Quarterly monitoring", price: "119", priceCurrency: "USD", description: "Four full scans a year, billed yearly in advance. Checkout is not open." },
      { "@type": "Offer", name: "Monthly monitoring", price: "300", priceCurrency: "USD", description: "Twelve full scans a year, billed yearly in advance. Checkout is not open." },
    ],
  };
}

const EXAMPLE: Record<Locale, { topic: string; finding: string; meaning: string; action: string; check: string }> = {
  he: {
    topic: "נושא: הגדרות אבטחה בדפדפן",
    finding: "ממצא לדוגמה: כותרת Content-Security-Policy לא אותרה בתגובה שנבדקה.",
    meaning: "מה המשמעות? מדיניות CSP יכולה לסייע בצמצום סיכונים מסוימים הקשורים לטעינת משאבים ולהרצת תוכן בדפדפן.",
    action: "מה מומלץ לעשות? לבחון הגדרת CSP המתאימה למשאבים ולסקריפטים שהאתר באמת צריך, לבדוק אותה בסביבת בדיקות ולוודא שאינה פוגעת בפעילות התקינה.",
    check: "איך בודקים שהתיקון הצליח? בודקים את כותרות התגובה לאחר העדכון ומוודאים שהמדיניות נטענת ופועלת כמתוכנן.",
  },
  en: {
    topic: "Topic: browser security settings",
    finding: "Sample finding: a Content-Security-Policy header was not seen on the checked response.",
    meaning: "What it means: a CSP can help limit some risks from loading resources and running content in the browser.",
    action: "What to do: review a policy that matches the resources and scripts the site actually needs, try it in a test environment, and confirm it does not break normal use.",
    check: "How to confirm: check the response headers after the change and confirm the policy is sent as intended.",
  },
  es: {
    topic: "Tema: ajustes de seguridad del navegador",
    finding: "Hallazgo de ejemplo: no se vio la cabecera Content-Security-Policy en la respuesta revisada.",
    meaning: "Qué significa: una CSP puede ayudar a limitar algunos riesgos al cargar recursos y ejecutar contenido.",
    action: "Qué conviene hacer: revisar una política acorde a los recursos reales, probarla en un entorno de prueba y confirmar que no interrumpe el uso normal.",
    check: "Cómo comprobarlo: revisar las cabeceras después del cambio y confirmar que la política se envía como se esperaba.",
  },
  "pt-BR": {
    topic: "Tema: ajustes de segurança do navegador",
    finding: "Achado de exemplo: o cabeçalho Content-Security-Policy não apareceu na resposta verificada.",
    meaning: "O que significa: uma CSP pode ajudar a limitar alguns riscos ao carregar recursos e executar conteúdo.",
    action: "O que fazer: revisar uma política alinhada aos recursos reais, testá-la em um ambiente de teste e confirmar que o uso normal continua.",
    check: "Como confirmar: conferir os cabeçalhos depois da mudança e ver se a política é enviada como previsto.",
  },
  ar: {
    topic: "الموضوع: إعدادات الأمن في المتصفح",
    finding: "نتيجة للعرض: لم تُرصد ترويسة Content-Security-Policy في الاستجابة التي فُحصت.",
    meaning: "ما المعنى؟ يمكن لسياسة CSP أن تساعد في الحد من بعض المخاطر عند تحميل الموارد وتشغيل المحتوى.",
    action: "ماذا يُستحسن؟ مراجعة سياسة تناسب الموارد والنصوص التي يحتاجها الموقع فعلًا، وتجربتها في بيئة اختبار، والتأكد أنها لا تعطل الاستخدام العادي.",
    check: "كيف يُتحقق؟ تُراجع ترويسات الاستجابة بعد التحديث ويُؤكد أن السياسة تُرسل كما خُطط.",
  },
};

function ExampleCard({ locale, flag }: { locale: Locale; flag: string }) {
  const item = EXAMPLE[locale] || EXAMPLE.en;
  return (
    <article className="scan-example">
      <p className="scan-demo__flag">{flag}</p>
      <h3>{item.topic}</h3>
      <p>{item.finding}</p>
      <p>{item.meaning}</p>
      <p>{item.action}</p>
      <p>{item.check}</p>
      <p dir="ltr">https://example.com/</p>
    </article>
  );
}

const POINTS: Record<Locale, string[]> = {
  he: ["בלי התקנת תוכנה", "תמונת מצב חינמית", "ממצאים, ראיות והמלצות בדוח המלא"],
  en: ["No software to install", "A free first picture", "Findings, evidence and recommendations in the full report"],
  es: ["Sin instalar software", "Una primera imagen gratis", "Hallazgos, pruebas y recomendaciones en el informe completo"],
  "pt-BR": ["Sem instalar software", "Um primeiro panorama grátis", "Achados, evidências e recomendações no relatório completo"],
  ar: ["بلا تثبيت برنامج", "صورة أولى مجانية", "نتائج وأدلة وتوصيات في التقرير الكامل"],
};
const STEPS: Record<Locale, string[]> = {
  he: ["מזינים שם וכתובת אתר", "הסריקה בודקת פרטיות, אבטחה, נגישות ומסמכים", "מתקבלת תמונת מצב, ואפשר לפתוח דוח מלא"],
  en: ["Enter a name and a website address", "The scan checks privacy, security, accessibility and documents", "You get a first picture, and can open a full report"],
  es: ["Escriba un nombre y la dirección del sitio", "El escaneo revisa privacidad, seguridad, accesibilidad y documentos", "Recibe una primera imagen y puede abrir un informe completo"],
  "pt-BR": ["Informe um nome e o endereço do site", "A varredura verifica privacidade, segurança, acessibilidade e documentos", "Você recebe um panorama e pode abrir um relatório completo"],
  ar: ["أدخلوا اسمًا وعنوان الموقع", "يفحص النظام الخصوصية والأمن والإتاحة والمستندات", "تصل صورة أولى، ويمكن فتح تقرير كامل"],
};
const INCLUDED: Record<Locale, { line: string; plans: string[] }> = {
  he: { line: "הדוח המלא כלול ברכישה חד־פעמית ובכל סריקה במסלולי המעקב.", plans: ["דוח חד־פעמי — $35", "מעקב רבעוני — $119 לשנה", "מעקב חודשי — $300 לשנה"] },
  en: { line: "The full report is included in the one-time purchase and in every scan on the monitoring plans.", plans: ["One-time report — $35", "Quarterly monitoring — $119 a year", "Monthly monitoring — $300 a year"] },
  es: { line: "El informe completo está incluido en la compra única y en cada escaneo de los planes de seguimiento.", plans: ["Informe único — 35 $", "Seguimiento trimestral — 119 $ al año", "Seguimiento mensual — 300 $ al año"] },
  "pt-BR": { line: "O relatório completo está incluído na compra avulsa e em cada varredura dos planos de acompanhamento.", plans: ["Relatório avulso — US$ 35", "Acompanhamento trimestral — US$ 119 por ano", "Acompanhamento mensal — US$ 300 por ano"] },
  ar: { line: "التقرير الكامل مشمول في الشراء لمرة واحدة وفي كل فحص ضمن مسارات المتابعة.", plans: ["تقرير لمرة واحدة — 35 دولارًا", "متابعة ربع سنوية — 119 دولارًا في السنة", "متابعة شهرية — 300 دولار في السنة"] },
};
const TRANSCRIPT: Record<Locale, string> = {
  he: "תמלול ההדגמה", en: "Demo transcript", es: "Transcripción de la demostración", "pt-BR": "Transcrição da demonstração", ar: "تفريغ العرض",
};

export function WebsiteScanPage() {
  const { i18n } = useTranslation();
  const { locale, copy } = storyOf(i18n.language);
  const links = LINKS[locale] || LINKS.en;
  const dir = locale === "he" || locale === "ar" ? "rtl" : "ltr";
  const canonical = marketingPublicUrl("/website-scan", locale);
  const code = mediaCode(locale);
  const shots = shotsFor(locale);
  const included = INCLUDED[locale] || INCLUDED.en;
  const [openShot, setOpenShot] = useState<number | null>(null);
  const order = [1, 0, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <article className="scan-product" dir={dir} lang={locale}>
      <Helmet>
        <title>{copy.title}</title>
        <meta name="description" content={copy.description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={copy.title} />
        <meta property="og:description" content={copy.description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(schemaFor(copy, canonical, locale))}</script>
      </Helmet>
      <div className="scan-product__wrap">
        <header className="scan-hero scan-rise">
          <div>
            <h1>{copy.h1}</h1>
            <p>{copy.lede}</p>
            <div className="scan-product__actions">
              <Link to="/compliance">{copy.primary}</Link>
              <a href="#scan-demo">{copy.watch}</a>
            </div>
            <ul className="scan-points">
              {(POINTS[locale] || POINTS.en).map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
          <figure className="scan-frame" id="scan-demo">
            <div className="scan-frame__bar" dir="ltr"><span /><span /><span /><b>bizuply.com/scan</b></div>
            <video controls preload="none" poster={`/media/compliance-demo/poster-${code}.jpg`} width="1280" height="720" playsInline>
              <source src={`/media/compliance-demo/${code}.mp4`} type="video/mp4" />
              <track kind="captions" srcLang={locale === "pt-BR" ? "pt-BR" : locale} src={`/media/compliance-demo/captions-${code}.vtt`} label={copy.crumb} default />
            </video>
          </figure>
        </header>
        <details className="scan-transcript"><summary>{TRANSCRIPT[locale]}</summary><p>{copy.transcript}</p></details>
      </div>
      {order.map((index) => {
        const section = copy.sections[index] as { heading: string; paragraphs?: string[]; subsections?: { heading: string; paragraphs: string[] }[] };
        if (!section) return null;
        const band = index === 1 || index === 7;
        const block = (
          <section className={`scan-section scan-rise${index === 9 ? " scan-close" : ""}`} key={section.heading}>
            <div className="scan-product__wrap">
              <h2>{section.heading}</h2>
              {(section.paragraphs || []).map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
              {index === 1 && (
                <p className="scan-inline-links">
                  <Link to="/privacy">{links.privacy}</Link>
                  <Link to="/accessibility">{links.access}</Link>
                  <Link to="/guides">{links.guides}</Link>
                </p>
              )}
              {section.subsections && (
                <div className={index === 1 || index === 6 ? "scan-grid" : "scan-stack"}>
                  {section.subsections.map((sub) => (
                    <article className="scan-card" key={sub.heading}>
                      <h3>{sub.heading}</h3>
                      {sub.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
                    </article>
                  ))}
                </div>
              )}
              {index === 2 && (
                <ol className="scan-steps">
                  {(STEPS[locale] || STEPS.en).map((step) => <li key={step}>{step}</li>)}
                </ol>
              )}
              {index === 3 && (
                <figure className="scan-shot-single">
                  <button type="button" aria-label={copy.shotAlt[1]} onClick={() => setOpenShot(1)}>
                    <img src={shots[1].src} alt={copy.shotAlt[1]} width={shots[1].width} height={shots[1].height} />
                  </button>
                  <figcaption><b className="scan-demo__flag">{copy.demoFlag}</b> {copy.freeCaption}</figcaption>
                </figure>
              )}
              {index === 4 && (
                <>
                  <figure className="scan-shot-single">
                    <button type="button" aria-label={copy.shotAlt[2]} onClick={() => setOpenShot(2)}>
                      <img src={shots[2].src} alt={copy.shotAlt[2]} width={shots[2].width} height={shots[2].height} />
                    </button>
                    <figcaption><b className="scan-demo__flag">{copy.demoFlag}</b> {copy.shots[2]}</figcaption>
                  </figure>
                  <p className="scan-included__line">{included.line}</p>
                  <ul className="scan-included">
                    {included.plans.map((plan) => <li key={plan}><a href="#scan-prices">{plan}</a></li>)}
                  </ul>
                  <p>{copy.note}</p>
                </>
              )}
              {index === 5 && <ExampleCard locale={locale} flag={copy.exampleFlag} />}
              {index === 8 && <PriceBoard locale={locale} showHeading={false} />}
              {index === 9 && <p><Link className="scan-cta" to="/compliance">{copy.closeCta}</Link></p>}
            </div>
          </section>
        );
        return band ? <div className="scan-band" key={section.heading}>{block}</div> : block;
      })}
      <div className="scan-band">
        <section className="scan-section scan-faq">
          <div className="scan-product__wrap">
            <h2>{copy.faqTitle}</h2>
            {copy.faq.map(([question, answer]: [string, string]) => (
              <details key={question}><summary>{question}</summary><p>{answer}</p></details>
            ))}
          </div>
        </section>
      </div>
      {openShot !== null && (
        <div className="scan-lightbox" role="dialog" aria-modal="true">
          <button type="button" onClick={() => setOpenShot(null)} aria-label={TRANSCRIPT[locale]}>×</button>
          <img src={shots[openShot].src} alt={copy.shotAlt[openShot]} width={shots[openShot].width} height={shots[openShot].height} />
        </div>
      )}
    </article>
  );
}

export { ComplianceAccountPage } from "./ComplianceAccountPage";

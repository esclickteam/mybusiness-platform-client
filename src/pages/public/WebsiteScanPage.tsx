import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePathCore.mjs";
import { WEBSITE_SCAN } from "../../lib/websiteScanStory.mjs";
import { PriceBoard } from "./ComplianceCommercial";
import "./websiteScan.css";

type Locale = "he" | "en" | "es" | "pt-BR" | "ar";

const SHOTS = [
  { src: "/media/compliance-demo/scan.png", width: 1920, height: 666 },
  { src: "/media/compliance-demo/free.png", width: 1120, height: 951 },
  { src: "/media/compliance-demo/report.png", width: 1920, height: 1080 },
];
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
      { "@type": "VideoObject", name: copy.videoTitle, description: copy.transcript, thumbnailUrl: "https://bizuply.com/media/compliance-demo/poster.jpg", uploadDate: "2026-11-09", contentUrl: "https://bizuply.com/media/compliance-demo/desktop.mp4", inLanguage: "he" },
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

export function WebsiteScanPage() {
  const { i18n } = useTranslation();
  const { locale, copy } = storyOf(i18n.language);
  const links = LINKS[locale] || LINKS.en;
  const dir = locale === "he" || locale === "ar" ? "rtl" : "ltr";
  const canonical = marketingPublicUrl("/website-scan", locale);
  const [openShot, setOpenShot] = useState<number | null>(null);
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
        <header className="scan-hero">
          <div>
            <h1>{copy.h1}</h1>
            <p>{copy.lede}</p>
            <p>{copy.note}</p>
            <div className="scan-product__actions">
              <Link to="/compliance">{copy.primary}</Link>
              <a href="#scan-demo">{copy.watch}</a>
            </div>
            <p className="scan-note">{copy.aside}</p>
          </div>
          <figure className="scan-frame" id="scan-demo">
            <div className="scan-frame__bar" dir="ltr"><span /><span /><span /><b>bizuply.com</b></div>
            <video className="scan-video scan-video--desk" controls preload="none" poster="/media/compliance-demo/poster.jpg" width="1280" height="720" playsInline>
              <source src="/media/compliance-demo/desktop.mp4" type="video/mp4" />
              <track kind="subtitles" srcLang="he" src="/media/compliance-demo/captions-he.vtt" label="עברית" default={locale === "he"} />
              <track kind="subtitles" srcLang="en" src="/media/compliance-demo/captions-en.vtt" label="English" default={locale === "en"} />
              <track kind="subtitles" srcLang="es" src="/media/compliance-demo/captions-es.vtt" label="Español" default={locale === "es"} />
              <track kind="subtitles" srcLang="pt-BR" src="/media/compliance-demo/captions-pt.vtt" label="Português" default={locale === "pt-BR"} />
              <track kind="subtitles" srcLang="ar" src="/media/compliance-demo/captions-ar.vtt" label="العربية" default={locale === "ar"} />
            </video>
            <video className="scan-video scan-video--phone" controls preload="none" poster="/media/compliance-demo/poster-mobile.jpg" width="390" height="844" playsInline>
              <source src="/media/compliance-demo/mobile.mp4" type="video/mp4" />
              <track kind="subtitles" srcLang={locale === "pt-BR" ? "pt-BR" : locale} src={`/media/compliance-demo/captions-${locale === "pt-BR" ? "pt" : locale}.vtt`} label={copy.crumb} default />
            </video>
            <figcaption>{copy.videoTitle}</figcaption>
          </figure>
        </header>
        <details className="scan-transcript"><summary>{copy.watch}</summary><p>{copy.transcript}</p></details>
        {copy.sections.map((section: { heading: string; paragraphs?: string[]; subsections?: { heading: string; paragraphs: string[] }[] }, index: number) => (
          <section className="scan-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {(section.paragraphs || []).map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
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
                    {sub.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
                  </article>
                ))}
              </div>
            )}
            {index === 2 && (
              <div className="scan-shots">
                {SHOTS.map((shot, index) => (
                  <figure key={shot.src}>
                    <button type="button" aria-label={copy.shotAlt[index]} onClick={() => setOpenShot(index)}>
                      <img src={shot.src} alt={copy.shotAlt[index]} width={shot.width} height={shot.height} />
                    </button>
                    <figcaption><b className="scan-demo__flag">{copy.demoFlag}</b> {copy.shots[index]}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            {index === 3 && (
              <>
                <figure className="scan-shot-single">
                  <img src={SHOTS[1].src} alt={copy.shotAlt[1]} width={SHOTS[1].width} height={SHOTS[1].height} />
                  <figcaption>{copy.freeCaption}</figcaption>
                </figure>
                <p><Link className="scan-cta" to="/compliance">{copy.freeCta}</Link></p>
              </>
            )}
            {index === 4 && (
              <figure className="scan-shot-single">
                <img src={SHOTS[2].src} alt={copy.shotAlt[2]} width={SHOTS[2].width} height={SHOTS[2].height} />
              </figure>
            )}
            {index === 5 && <ExampleCard locale={locale} flag={copy.exampleFlag} />}
            {index === 8 && <PriceBoard locale={locale} showHeading={false} />}
            {index === 9 && <p><Link className="scan-cta" to="/compliance">{copy.closeCta}</Link></p>}
          </section>
        ))}
        <section className="scan-section scan-faq">
          <h2>{copy.faqTitle}</h2>
          {copy.faq.map(([question, answer]: [string, string]) => (
            <details key={question}><summary>{question}</summary><p>{answer}</p></details>
          ))}
        </section>
      </div>
      {openShot !== null && (
        <div className="scan-lightbox" role="dialog" aria-modal="true">
          <button type="button" onClick={() => setOpenShot(null)}>×</button>
          <img src={SHOTS[openShot].src} alt={copy.shotAlt[openShot]} width={SHOTS[openShot].width} height={SHOTS[openShot].height} />
        </div>
      )}
    </article>
  );
}

export { ComplianceAccountPage } from "./ComplianceAccountPage";

import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../../api";
import { marketingPublicUrl } from "../../lib/localePathCore.mjs";
import "./aiVisibilityProduct.css";

const COPY = {
  he: {
    dir: "rtl",
    title: "סורק נראות AI | Bizuply",
    description: "סורק SEO, GEO ו־AEO לכל אתר ציבורי. הסריקה הראשונית מוגבלת ולא דורשת חשבון. מדידות AI חיות ורכישה בתשלום אינן פעילות.",
    crumb: "סורק נראות AI",
    hero: "גלו איך האתר שלכם נראה בגוגל ובמנועי AI",
    lead: "סורקים את האתר, מזהים בעיות SEO, GEO ו־AEO, ובודקים את הנראות של המותג במנועי AI באמצעות מדידות זמינות.",
    scan: "סרקו אתר בחינם",
    plans: "צפייה בחבילות",
    example: "המחשה. לא נתוני לקוח.",
    url: "כתובת האתר",
    scanning: "סורק",
    areas: [
      ["SEO", "בדיקות טכניות ונראות בחיפוש."],
      ["GEO", "מוכנות האתר למנועי AI. לא ציטוט בפועל."],
      ["AEO", "התאמת התוכן לשאלות ולמנועי תשובות."],
      ["נראות AI", "אזכור, קישור, המלצה ומתחרים. פעיל רק אחרי חיבור ספק מאושר."],
    ],
    stepsTitle: "איך זה עובד",
    steps: ["מזינים כתובת אתר.", "המערכת סורקת ומנתחת.", "מקבלים דוח וליקויים.", "משפרים את האתר.", "עוקבים אחר התוצאות בחבילה מתאימה."],
    plansTitle: "חבילות",
    plansNote: "אין מחירון מאושר ואין גבייה. הסריקה החינמית פעילה. שאר החבילות יוצגו לרכישה רק אחרי אישור מחיר וחיבור תשלום.",
    planItems: [
      ["סריקה חינמית", "בדיקה ראשונית של עד שלושה עמודים.", "פעיל"],
      ["סריקה מקצועית", "סריקה מורחבת ודוח מלא.", "בקרוב"],
      ["ניטור מתקדם", "ניטור חוזר, היסטוריה והשוואות.", "בקרוב"],
      ["נראות AI", "מדידות חיות והשוואת מתחרים, אחרי הפעלת ספקים.", "בקרוב"],
    ],
    faqTitle: "שאלות נפוצות",
    faq: [
      ["צריך הרשאות לאתר?", "לא. הסריקה הציבורית קוראת תוכן גלוי בלבד."],
      ["אילו אתרים נתמכים?", "כל אתר ציבורי שהגישה אליו מותרת, בלי תלות בפלטפורמה."],
      ["מה ההבדל בין SEO, GEO ו־AEO?", "SEO בודק חיפוש. GEO בודק מוכנות להבנה. AEO בודק אם העמוד עונה על השאלה שהוא עצמו עוסק בה."],
      ["האם הציון אומר שהמותג מופיע ב־ChatGPT?", "לא. ציון המוכנות אינו מדידת הופעה. מדידה חיה דורשת ספק מחובר ואישור נפרד."],
    ],
  },
  en: {
    dir: "ltr",
    title: "AI Visibility Scanner | Bizuply",
    description: "An SEO, GEO and AEO scanner for any public website. The first scan is limited and does not need an account. Live AI measurement and paid checkout are off.",
    crumb: "AI Visibility Scanner",
    hero: "See how your site reads in Google and in AI engines",
    lead: "Scan the site, find SEO, GEO and AEO issues, and check brand visibility in AI engines when a measurement provider is available.",
    scan: "Scan a site for free",
    plans: "View plans",
    example: "Illustration. Not a customer result.",
    url: "Website URL",
    scanning: "Scanning",
    areas: [
      ["SEO", "Technical checks and search readiness."],
      ["GEO", "Readiness for AI engines. Not a live citation."],
      ["AEO", "Whether the page answers the subject it covers."],
      ["AI visibility", "Mentions, links, recommendations and competitors. Active only after an approved provider is connected."],
    ],
    stepsTitle: "How it works",
    steps: ["Enter a website address.", "The system scans and analyzes.", "You receive a report and the issues.", "You improve the site.", "You follow the results on a matching plan."],
    plansTitle: "Plans",
    plansNote: "There is no approved price list and no charge. The free scan is available. The other plans stay marked as coming soon until a price and a payment connection are approved.",
    planItems: [
      ["Free scan", "A first check of up to three pages.", "Available"],
      ["Professional scan", "A wider scan and a full report.", "Coming soon"],
      ["Monitoring", "Repeat scans, history and comparisons.", "Coming soon"],
      ["AI visibility", "Live measurements and competitor comparison after providers are enabled.", "Coming soon"],
    ],
    faqTitle: "Questions",
    faq: [
      ["Does the scan need access to the site?", "No. The public scan reads visible content only."],
      ["Which sites are supported?", "Any public site that allows access, on any platform."],
      ["What is the difference between SEO, GEO and AEO?", "SEO checks search readiness. GEO checks whether the site can be understood. AEO checks whether a page answers the subject it covers."],
      ["Does the score mean the brand appears in ChatGPT?", "No. A readiness score is not a live appearance measurement. A live measurement needs a connected provider and a separate approval."],
    ],
  },
};

export default function AiVisibilityProductPage() {
  const { i18n } = useTranslation();
  const he = String(i18n.language || "").toLowerCase().startsWith("he");
  const t = he ? COPY.he : COPY.en;
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const canonical = marketingPublicUrl("/products/ai-visibility-scanner", he ? "he" : "en");
  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: he ? "סורק נראות AI" : "AI Visibility Scanner",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: canonical,
    description: t.description,
    offers: { "@type": "Offer", availability: "https://schema.org/PreOrder", price: "0", priceCurrency: "USD", description: he ? "סריקה ציבורית מוגבלת. אין מחיר לחבילות בתשלום." : "Limited public scan. Paid plans have no price yet." },
  }), [canonical, he, t.description]);

  async function onScan(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setPreview(null);
    try {
      const response = await API.post("/search-visibility/preview", { url });
      setPreview(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "הסריקה לא הושלמה");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="aiv" dir={t.dir}>
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="he" href={marketingPublicUrl("/products/ai-visibility-scanner", "he")} />
        <link rel="alternate" hrefLang="en" href={marketingPublicUrl("/products/ai-visibility-scanner", "en")} />
        <link rel="alternate" hrefLang="x-default" href={marketingPublicUrl("/products/ai-visibility-scanner", "en")} />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <section className="aiv-hero">
        <p className="aiv-kicker">Bizuply</p>
        <h1>{t.hero}</h1>
        <p className="aiv-lead">{t.lead}</p>
        <div className="aiv-actions">
          <a className="aiv-button" href="#scan">{t.scan}</a>
          <a className="aiv-button aiv-button-secondary" href="#plans">{t.plans}</a>
        </div>
        <aside className="aiv-demo" aria-label={t.example}>
          <p>{t.example}</p>
          <div className="aiv-demo-row"><span>SEO</span><strong>—</strong></div>
          <div className="aiv-demo-row"><span>GEO</span><strong>—</strong></div>
          <div className="aiv-demo-row"><span>AEO</span><strong>—</strong></div>
        </aside>
      </section>
      <section id="scan" className="aiv-section">
        <h2>{t.scan}</h2>
        <form className="aiv-form" onSubmit={onScan}>
          <label>
            {t.url}
            <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://" />
          </label>
          <button className="aiv-button" type="submit" disabled={busy || url.trim().length < 8}>{busy ? t.scanning : t.scan}</button>
        </form>
        {error ? <p className="aiv-error">{error}</p> : null}
        {preview ? (
          <div className="aiv-result">
            <p>{preview.host} · {preview.pages ?? 0}</p>
            <p>SEO {preview.scores?.seo?.score ?? "—"} · GEO {preview.scores?.geo?.score ?? "—"} · AEO {preview.scores?.aeo?.score ?? "—"}</p>
            <p>{preview.note}</p>
            <Link to="/search-visibility">{he ? "סריקה מלאה בחשבון" : "Full scan in an account"}</Link>
          </div>
        ) : null}
      </section>
      <section className="aiv-section">
        <div className="aiv-areas">
          {t.areas.map(([title, body]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="aiv-section">
        <h2>{t.stepsTitle}</h2>
        <ol>{t.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </section>
      <section id="plans" className="aiv-section">
        <h2>{t.plansTitle}</h2>
        <p>{t.plansNote}</p>
        <div className="aiv-areas">
          {t.planItems.map(([name, body, state]) => (
            <article key={name}>
              <h2>{name}</h2>
              <p>{body}</p>
              <p className="aiv-state">{state}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="aiv-section">
        <h2>{t.faqTitle}</h2>
        {t.faq.map(([question, answer]) => (
          <article key={question}>
            <h3>{question}</h3>
            <p>{answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

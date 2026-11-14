import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import API from "../../api";
import { marketingPublicUrl } from "../../lib/localePathCore.mjs";
import { SECURITY_SCANNER } from "../../lib/securityScannerStory.mjs";
import "./securityScannerMarketing.css";

type Plan = { id: string; name: string; priceIls: number; unit: string; sellable: boolean; billing?: string };

const ENGLISH_PLAN: Record<string, { name: string; unit: string }> = {
  basic: { name: "Basic", unit: "scan" },
  professional: { name: "Professional", unit: "scan" },
  monitoring: { name: "Monitoring", unit: "month" },
};

const CHECKS = {
  he: [
    ["הצפנה ותעודה", "HTTPS, תוקף תעודה וגרסת TLS."],
    ["כותרות אבטחה", "HSTS, CSP, X-Frame-Options וכותרות קשורות."],
    ["עוגיות", "דגלי Secure, HttpOnly ו־SameSite."],
    ["CORS", "שילוב של מקור פתוח עם הרשאות."],
    ["חשיפה ציבורית", "מידע טכנולוגי שמוחזר בכותרות או בדף."],
    ["קטלוג CVE מקומי", "התאמת גרסה רק כשמספר הגרסה ודאי."],
    ["DNS", "SPF, DMARC ו־CAA כרשומות ציבוריות."],
    ["טפסים", "בדיקה פסיבית. הטופס אינו נשלח."],
    ["API מאושר", "בקשות GET בלבד לנתיבים שאושרו מראש."],
  ],
  en: [
    ["TLS and certificate", "HTTPS, certificate validity and the TLS version."],
    ["Security headers", "HSTS, CSP, X-Frame-Options and related headers."],
    ["Cookies", "Secure, HttpOnly and SameSite flags."],
    ["CORS", "A wide-open origin combined with credentials."],
    ["Public exposure", "Technology details returned in headers or HTML."],
    ["Local CVE catalog", "A version match only when the version is certain."],
    ["DNS", "Public SPF, DMARC and CAA records."],
    ["Forms", "A passive check. The form is not submitted."],
    ["Approved API", "GET requests only, and only on paths approved in advance."],
  ],
};

const STEPS = {
  he: ["מוסיפים את הדומיין ומאשרים שהסריקה מותרת.", "מאמתים בעלות בקובץ או ברשומת DNS, או ממתינים לאישור הרשאה.", "בוחרים סריקה פסיבית או אקטיבית בתוך ההיקף שאושר.", "התור שומר את המשימה, והדשבורד מציג את השלב שנשמר.", "בסיום אפשר לקרוא ממצאים, להשוות סריקה ולהוריד PDF."],
  en: ["Add the domain and confirm the scan is allowed.", "Verify ownership with a file or DNS record, or wait for an authorization approval.", "Choose a passive or active scan inside the approved scope.", "The queue stores the job, and the dashboard shows the saved phase.", "When it finishes, read the findings, compare a scan and download the PDF."],
};

const LEVELS = {
  he: [
    ["מאומת", "הבדיקה ראתה ראיה ישירה, למשל גרסה שתואמת לקטלוג."],
    ["חשד", "יש סימן שדורש בדיקה אנושית. הוא אינו מוצג כפרצה מוכחת."],
    ["מידע", "פרטים שכדאי לדעת, בלי ציון של חולשה."],
  ],
  en: [
    ["Verified", "The check saw direct evidence, such as a version that matches the catalog."],
    ["Suspicion", "A sign that needs a person to review. It is not shown as a proven vulnerability."],
    ["Info", "Context worth knowing, without a vulnerability score."],
  ],
};

const NOT_LIVE = {
  he: ["חיוב אמיתי בכרטיס אשראי", "עובד סריקות בסביבת הייצור", "התחברות עם חשבון בדיקה שמור", "קטלוג CVE חי שמכסה את כל הרכיבים באינטרנט"],
  en: ["Live card charges", "The scan worker in production", "Stored test-account login", "A live CVE catalog that covers every component on the internet"],
};

function copyFor(language: string) {
  return language.startsWith("he") ? SECURITY_SCANNER.he : SECURITY_SCANNER.en;
}

export default function SecurityScannerMarketing() {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const he = path.startsWith("/he/");
  const copy = copyFor(he ? "he" : "en");
  const canonical = marketingPublicUrl("/security-scanner", he ? "he" : "en");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planState, setPlanState] = useState(he ? "טוען מחירים" : "Loading prices");

  useEffect(() => {
    let active = true;
    API.get("/security-scanner/plans")
      .then((response) => {
        if (!active) return;
        setPlans((response.data?.plans || []).filter((plan: Plan) => plan.sellable));
        setPlanState(response.data?.billing === "not_activated" ? (he ? "החיוב אינו פעיל" : "Billing is not active") : "");
      })
      .catch(() => {
        if (active) setPlanState(he ? "המחירים לא נטענו. הם אינם מוצגים ממספר קבוע בעמוד." : "Prices did not load. This page does not keep a second price list.");
      });
    return () => {
      active = false;
    };
  }, [he]);

  const faq = SECURITY_SCANNER[he ? "he" : "en"].faq;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <article className="scanner-product" dir={he ? "rtl" : "ltr"} lang={he ? "he" : "en"}>
      <Helmet>
        <title>{copy.title}</title>
        <meta name="description" content={copy.description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={copy.title} />
        <meta property="og:description" content={copy.description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <header className="scanner-product__hero">
        <div className="scanner-product__wrap">
          <p className="scanner-product__kicker">Bizuply</p>
          <h1>{copy.h1}</h1>
          <p>{copy.lede}</p>
          <div className="scanner-product__actions">
            <Link to="/login">{he ? "התחלת סריקה" : "Start a scan"}</Link>
            <a href="#sample-report">{he ? "צפייה בדוח לדוגמה" : "View a sample report"}</a>
          </div>
        </div>
      </header>

      <section className="scanner-product__section" id="dashboard-preview">
        <div className="scanner-product__wrap">
          <h2>{he ? "הדמיית דשבורד הסריקה" : "Scan dashboard preview"}</h2>
          <p>{he ? "זהו מבנה המסך. המספרים כאן הם המחשה, לא תוצאה של אתר אמיתי." : "This is the screen structure. The numbers here illustrate the layout, not a result from a real site."}</p>
          <div className="scanner-product__board" aria-hidden="true">
            <div><span>{he ? "בתור" : "Queued"}</span><strong>1</strong></div>
            <div><span>{he ? "מאומת" : "Verified"}</span><strong>2</strong></div>
            <div><span>{he ? "חשד" : "Suspicion"}</span><strong>1</strong></div>
            <div><span>{he ? "ציון" : "Score"}</span><strong>84</strong></div>
          </div>
        </div>
      </section>

      <section className="scanner-product__section scanner-product__section--white">
        <div className="scanner-product__wrap">
          <h2>{he ? "אילו בדיקות מבוצעות" : "Which checks run"}</h2>
          <ul className="scanner-product__cards">
            {(he ? CHECKS.he : CHECKS.en).map(([title, text]) => (
              <li key={title}><strong>{title}</strong><span>{text}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="scanner-product__section">
        <div className="scanner-product__wrap">
          <h2>{he ? "איך מתבצעת סריקה" : "How a scan runs"}</h2>
          <ol className="scanner-product__steps">
            {(he ? STEPS.he : STEPS.en).map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      </section>

      <section className="scanner-product__section scanner-product__section--white">
        <div className="scanner-product__wrap">
          <h2>{he ? "רמות חומרה" : "Severity levels"}</h2>
          <ul className="scanner-product__cards">
            {(he ? LEVELS.he : LEVELS.en).map(([title, text]) => (
              <li key={title}><strong>{title}</strong><span>{text}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="scanner-product__section" id="sample-report">
        <div className="scanner-product__wrap">
          <h2>{he ? "דוגמה לדוח PDF" : "Sample PDF report"}</h2>
          <div className="scanner-product__sheet">
            <p>{he ? "הדוח כולל ציון, הסבר לחישוב, ממצאים עם ראיה מצומצמת והמלצת תיקון." : "The report includes a score, the scoring method, findings with redacted evidence and a fix."}</p>
            <p>{he ? "בכל דוח כתוב שהסריקה אינה מוכיחה שהאתר מאובטח במלואו." : "Every report says the scan does not prove the site is fully secure."}</p>
            <p>{he ? "הקובץ נוצר בעברית מימין לשמאל, וגם באנגלית משמאל לימין." : "The file is generated in Hebrew, right to left, and in English, left to right."}</p>
          </div>
        </div>
      </section>

      <section className="scanner-product__section scanner-product__section--white">
        <div className="scanner-product__wrap">
          <h2>{he ? "השוואה בין סריקות" : "Scan comparison"}</h2>
          <p>{he ? "אחרי שתי סריקות שהושלמו לאותו אתר, הדשבורד מציג מה נוסף, מה ירד ומה נשאר." : "After two completed scans of the same site, the dashboard shows what was added, what dropped and what remains."}</p>
        </div>
      </section>

      <section className="scanner-product__section">
        <div className="scanner-product__wrap">
          <h2>{he ? "ניטור מתמשך והתראות" : "Monitoring and alerts"}</h2>
          <p>{he ? "חבילת הניטור שומרת תזמון לסריקה חוזרת, והמערכת רושמת התראה על סריקה שהושלמה ועל ממצא חמור." : "The monitoring package stores a schedule for a repeat scan, and the system records an alert when a scan finishes and when a severe finding appears."}</p>
          <p>{he ? "התזמון רץ רק כשיש יתרה פעילה. בפרודקשן העובד כבוי עד אישור נפרד." : "The schedule runs only when an active credit exists. In production the worker stays off until a separate approval."}</p>
        </div>
      </section>

      <section className="scanner-product__section scanner-product__section--white" id="packages">
        <div className="scanner-product__wrap">
          <h2>{he ? "חבילות ומחירים" : "Packages and prices"}</h2>
          <p>{planState}</p>
          <ul className="scanner-product__cards">
            {plans.map((plan) => {
              const english = ENGLISH_PLAN[plan.id];
              const name = he || !english ? plan.name : english.name;
              const unit = he || !english ? plan.unit : english.unit;
              return <li key={plan.id}><strong>{name}</strong><span>{plan.priceIls} ₪ / {unit}</span></li>;
            })}
          </ul>
          <p>{he ? "הזמנה נרשמת בלי להפעיל סריקה בתשלום. קישור הסליקה נפתח רק כשספק מאושר והגדרת ארגז חול פעילים." : "An order is recorded without unlocking a paid scan. A checkout link opens only when an approved provider and the sandbox setting are both active."}</p>
        </div>
      </section>

      <section className="scanner-product__section">
        <div className="scanner-product__wrap">
          <h2>{he ? "שאלות נפוצות" : "Common questions"}</h2>
          {faq.map(([question, answer]) => (
            <details key={question}><summary>{question}</summary><p>{answer}</p></details>
          ))}
        </div>
      </section>

      <section className="scanner-product__section scanner-product__section--white">
        <div className="scanner-product__wrap">
          <h2>{he ? "עדיין לא פעיל" : "Not live yet"}</h2>
          <ul>
            {(he ? NOT_LIVE.he : NOT_LIVE.en).map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className="scanner-product__actions">
            <Link to="/login">{he ? "כניסה לדשבורד" : "Open the dashboard"}</Link>
            <Link to="/website-scan">{he ? "סריקת האתר הקיימת" : "Existing website scan"}</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

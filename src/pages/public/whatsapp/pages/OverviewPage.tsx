import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Calculator,
  Check,
  Code2,
  FileText,
  Fingerprint,
  KeyRound,
  Lock,
  Plug,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Webhook,
  Workflow,
} from "lucide-react";
import ApiFlowDemo from "../ApiFlowDemo";
import HeroSimulation from "../HeroSimulation";
import { Accordion, CodeBlock, SectionHead } from "../ui";
import { SiteLink, englishOnly } from "../siteConfig";

type HeroCopy = {
  eyebrow: string;
  lines: [string, string];
  lead: string;
  start: string;
  explore: string;
  priceUnit: string;
  metaNote: string;
};

const HERO: Record<string, HeroCopy> = {
  en: {
    eyebrow: "Built on Meta's WhatsApp Cloud API",
    lines: ["WhatsApp API.", "Built for Your Business."],
    lead: "Connect your CRM, website, SaaS platform or custom system to WhatsApp using API & Webhooks.",
    start: "Get Started",
    explore: "Explore API",
    priceUnit: "/month per number",
    metaNote: "Meta messaging fees are billed separately. There is no free trial.",
  },
  he: {
    eyebrow: "מבוסס על WhatsApp Cloud API של Meta",
    lines: ["WhatsApp API.", "נבנה עבור העסק שלכם."],
    lead: "חברו CRM, אתר, פלטפורמת SaaS או מערכת מותאמת ל-WhatsApp באמצעות API ו-Webhooks.",
    start: "התחילו עכשיו",
    explore: "גלו את ה-API",
    priceUnit: "לחודש לכל מספר",
    metaNote: "עלויות ההודעות של Meta מחויבות בנפרד. אין ניסיון חינם.",
  },
  es: {
    eyebrow: "Basada en WhatsApp Cloud API de Meta",
    lines: ["WhatsApp API.", "Diseñada para su negocio."],
    lead: "Conecte su CRM, sitio web, plataforma SaaS o sistema propio a WhatsApp mediante API y webhooks.",
    start: "Empezar",
    explore: "Explorar la API",
    priceUnit: "/mes por número",
    metaNote: "Las tarifas de mensajería de Meta se facturan por separado.",
  },
  "pt-BR": {
    eyebrow: "Baseada na WhatsApp Cloud API da Meta",
    lines: ["WhatsApp API.", "Feita para o seu negócio."],
    lead: "Conecte seu CRM, site, plataforma SaaS ou sistema próprio ao WhatsApp por meio de API e webhooks.",
    start: "Começar",
    explore: "Explorar a API",
    priceUnit: "/mês por número",
    metaNote: "As tarifas de mensagens da Meta são cobradas separadamente.",
  },
  ar: {
    eyebrow: "مبنية على WhatsApp Cloud API من Meta",
    lines: ["WhatsApp API.", "مصممة لأعمالك."],
    lead: "اربط نظام CRM أو موقعك أو منصة SaaS أو نظامك الخاص بـ WhatsApp عبر API وWebhooks.",
    start: "ابدأ الآن",
    explore: "استكشف الواجهة",
    priceUnit: "شهريًا لكل رقم",
    metaNote: "رسوم المراسلة من Meta تُحتسب بشكل منفصل.",
  },
};

const TRUST = ["REST + OpenAPI 3.0", "HMAC-signed webhooks", "Idempotent sends"];

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Built on Meta's Cloud API",
    text: "Messages go through Meta's WhatsApp Cloud API, with numbers connected via Meta Embedded Signup.",
  },
  {
    icon: Workflow,
    title: "Connect Your Existing Systems",
    text: "Connect your CRM, website or custom application using our API.",
  },
  {
    icon: ReceiptText,
    title: "Transparent Pricing",
    text: "$29/month per number, with Meta messaging fees billed separately.",
  },
];

const PLAN_INCLUDES = [
  "WhatsApp Cloud API connection",
  "API & Webhooks",
  "Message templates",
  "Management dashboard",
  "Performance analytics",
  "Documentation & OpenAPI",
];

const ONBOARDING = [
  ["Meta Business account", "Use an existing one or create it during signup."],
  ["Embedded Signup", "Meta's own flow, opened from the Bizuply dashboard."],
  ["Verify the number", "Confirm ownership with a code by SMS or voice call."],
  ["Templates approved", "Submit templates; Meta reviews each one."],
  ["Create an API key", "Start sending from your own system."],
] as const;

const SECURITY = [
  { icon: KeyRound, title: "Hashed API keys", text: "Keys are shown once, then stored only as a SHA-256 hash and a short visible prefix." },
  { icon: Fingerprint, title: "Signed webhooks", text: "Every event carries an HMAC-SHA256 signature and timestamp you can verify." },
  { icon: Lock, title: "Encrypted Meta tokens", text: "Meta access tokens are encrypted at rest and never returned to the browser or your integration." },
  { icon: ShieldCheck, title: "Tenant isolation", text: "Each key is bound to one business, and every API request is scoped to it." },
];

const BENEFITS_HE = [
  {
    icon: BadgeCheck,
    title: "מבוסס על Cloud API של Meta",
    text: "ההודעות עוברות דרך WhatsApp Cloud API של Meta, והמספרים מחוברים דרך Meta Embedded Signup.",
  },
  {
    icon: Workflow,
    title: "חיבור למערכות שכבר יש לכם",
    text: "מחברים CRM, אתר או אפליקציה משלכם באמצעות ה־API.",
  },
  {
    icon: ReceiptText,
    title: "מחיר שקוף",
    text: "29 דולר לחודש לכל מספר. חיובי ההודעות של Meta מחויבים בנפרד.",
  },
];

const PLAN_INCLUDES_HE = [
  "חיבור ל־WhatsApp Cloud API",
  "API ו־Webhooks",
  "תבניות הודעה",
  "לוח בקרה",
  "נתוני ביצועים",
  "תיעוד ו־OpenAPI",
];

const ONBOARDING_HE = [
  ["חשבון Meta Business", "משתמשים בחשבון קיים, או יוצרים אחד במהלך ההרשמה."],
  ["Embedded Signup", "הזרימה של Meta נפתחת מתוך לוח הבקרה של ביזאפלי."],
  ["אימות המספר", "מאשרים בעלות בקוד ב־SMS או בשיחה."],
  ["אישור תבניות", "שולחים תבניות, ו־Meta בודקת כל אחת."],
  ["מפתח API", "מתחילים לשלוח מהמערכת שלכם."],
] as const;

const SECURITY_HE = [
  { icon: KeyRound, title: "מפתחות API מגובבים", text: "המפתח מוצג פעם אחת, ואחר כך נשמר רק כגיבוב SHA-256 וקידומת קצרה." },
  { icon: Fingerprint, title: "Webhooks חתומים", text: "כל אירוע נושא חתימת HMAC-SHA256 וחותמת זמן שאפשר לאמת." },
  { icon: Lock, title: "טוקנים של Meta מוצפנים", text: "טוקן הגישה של Meta מוצפן במנוחה, ולא חוזר לדפדפן או לאינטגרציה שלכם." },
  { icon: ShieldCheck, title: "הפרדה בין עסקים", text: "כל מפתח שייך לעסק אחד, וכל בקשת API מוגבלת אליו." },
];

const FAQ_EN = [
  { q: "What does the $29 cover?", a: "The Bizuply subscription for one connected WhatsApp number: onboarding, the API and webhooks, templates, the dashboard and documentation. Another number needs its own $29/month subscription." },
  { q: "Is there a free trial?", a: "No. The subscription starts at $29 per month for one number. You can read the documentation and estimate Meta costs before you sign up." },
  { q: "Are Meta's messaging charges included?", a: "No. Meta charges for messages by the recipient's country and the message category. Those charges are separate from the Bizuply subscription." },
  { q: "Can an agency manage many clients from one screen?", a: "Not yet. Each number has its own subscription, API key and webhook. Multi-client management is not available." },
];

const FAQ_HE = [
  { q: "מה כוללים 29 הדולר?", a: "מנוי ביזאפלי למספר וואטסאפ מחובר אחד: חיבור, API ו־webhooks, תבניות, לוח בקרה ותיעוד. מספר נוסף דורש מנוי נפרד של 29 דולר לחודש." },
  { q: "יש ניסיון חינם?", a: "אין. המנוי מתחיל ב־29 דולר לחודש למספר אחד. אפשר לקרוא את התיעוד ולהעריך את עלויות Meta לפני ההרשמה." },
  { q: "חיובי ההודעות של Meta כלולים?", a: "לא. Meta מחייבת לפי מדינת הנמען וקטגוריית ההודעה. החיובים האלה נפרדים ממנוי ביזאפלי." },
  { q: "סוכנות יכולה לנהל כמה לקוחות ממסך אחד?", a: "עדיין לא. לכל מספר יש מנוי, מפתח ו־webhook משלו. ניהול כמה לקוחות ממסך אחד אינו זמין." },
];

export default function OverviewPage({ lang }: { lang: string }) {
  const hero = HERO[lang] || HERO.en;
  const he = lang === "he";
  const en = he ? {} : englishOnly(lang);
  const Arrow = he ? ArrowLeft : ArrowRight;
  const benefits = he ? BENEFITS_HE : BENEFITS;
  const planIncludes = he ? PLAN_INCLUDES_HE : PLAN_INCLUDES;
  const onboarding = he ? ONBOARDING_HE : ONBOARDING;
  const security = he ? SECURITY_HE : SECURITY;
  const faq = he ? FAQ_HE : FAQ_EN;
  return (
    <>
      <section className="wa-hero" aria-labelledby="wa-hero-title">
        <div className="wa-wrap">
          <div className="wa-hero-grid">
            <div className="wa-hero-copy">
              <p className="wa-pill">
                <span className="wa-pill-dot" aria-hidden="true" />
                {hero.eyebrow}
              </p>
              <h1 id="wa-hero-title" className="wa-display">
                <bdi dir="ltr">{hero.lines[0]}</bdi>
                <br />
                <span className="wa-accent">{hero.lines[1]}</span>
              </h1>
              <p className="wa-lead">{hero.lead}</p>
              <div className="wa-hero-price" aria-label={`$29 ${hero.priceUnit}. ${hero.metaNote}`}>
                <div className="wa-hero-price-main" aria-hidden="true">
                  <strong>$29</strong>
                  <span>{hero.priceUnit}</span>
                </div>
                <p aria-hidden="true">{hero.metaNote}</p>
              </div>
              <div className="wa-actions">
                <SiteLink to="/get-started" className="wa-btn wa-btn-primary wa-btn-lg">
                  {hero.start} <Arrow size={16} aria-hidden="true" />
                </SiteLink>
                <SiteLink to="/docs" className="wa-btn wa-btn-ghost wa-btn-lg">
                  <Code2 size={16} aria-hidden="true" /> {hero.explore}
                </SiteLink>
              </div>
              <ul className="wa-hero-trust" {...en}>
                {TRUST.map((item) => (
                  <li key={item}><Check size={14} aria-hidden="true" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="wa-hero-visual">
              <HeroSimulation />
            </div>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-tight wa-benefits" aria-label="Key benefits">
        <div className="wa-wrap">
          <div className="wa-grid-3">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="wa-card is-hover wa-benefit">
                  <div className="wa-card-icon"><Icon size={20} aria-hidden="true" /></div>
                  <h2 className="wa-h3">{item.title}</h2>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-band" aria-labelledby="wa-how">
        <div className="wa-wrap">
          <div className="wa-reveal">
            <SectionHead
              eyebrow={he ? "איך זה עובד" : "How it works"}
              title={<span id="wa-how">{he ? "הודעה אחת, מהבקשה ועד האישור." : "Follow one message from request to receipt."}</span>}
              lead={he ? "עוברים על שליחה אחת: הבקשה שהמערכת שלכם שולחת, מה ביזאפלי בודקת, איך ההודעה מגיעה ל־WhatsApp, ואיך עדכוני הסטטוס חוזרים כ־webhooks חתומים." : "Step through a send in detail: the request your system makes, what Bizuply checks, how the message reaches WhatsApp, and how status updates come back as signed webhooks."}
            />
          </div>
          <div className="wa-reveal">
            <ApiFlowDemo lang={lang} />
          </div>
        </div>
      </section>

      <section {...en} className="wa-section" aria-labelledby="wa-meta">
        <div className="wa-wrap wa-split wa-reveal">
          <div>
            <p className="wa-eyebrow">{he ? "חיבור ל־Meta" : "Meta integration"}</p>
            <h2 id="wa-meta" className="wa-h2">{he ? "בנוי על WhatsApp Cloud API של Meta." : "Built on Meta's WhatsApp Cloud API."}</h2>
            <p className="wa-lead">
              {he
                ? "כל הודעה נשלחת דרך WhatsApp Cloud API של Meta. ביזאפלי מנהלת את החיבור ל־Meta ונותנת למערכות שלכם API יציב, כך שהקוד לא נוגע בטוקן הגישה של Meta."
                : "Every message is sent through Meta's WhatsApp Cloud API. Bizuply handles the Meta connection and gives your systems a simpler, stable API, so your code never touches Meta access tokens."}
            </p>
            <ul className="wa-list">
              <li><Check size={16} aria-hidden="true" /> {he ? "המספרים מחוברים דרך Meta Embedded Signup" : "Numbers are connected through Meta Embedded Signup"}</li>
              <li><Check size={16} aria-hidden="true" /> {he ? "מדיניות ההודעות, דירוג האיכות והמגבלות של Meta חלים כרגיל" : "Meta's messaging policies, quality ratings and limits apply as usual"}</li>
              <li><Check size={16} aria-hidden="true" /> {he ? "האינטגרציה מזדהה עם מפתח API של ביזאפלי" : "Your integration authenticates with a Bizuply API key"}</li>
            </ul>
          </div>
          <div className="wa-feature-visual">
            <dl className="wa-kv">
              <div><dt>{he ? "רשת ההודעות" : "Messaging network"}</dt><dd>Meta WhatsApp Cloud API</dd></div>
              <div><dt>{he ? "חיבור מספר" : "Number onboarding"}</dt><dd>Meta Embedded Signup</dd></div>
              <div><dt>{he ? "טוקן הגישה של Meta" : "Meta access token"}</dt><dd>{he ? "נשמר אצל ביזאפלי, מוצפן" : "Held by Bizuply, encrypted"}</dd></div>
              <div><dt>{he ? "ההרשאה שלכם" : "Your credential"}</dt><dd><code>biz_live_…</code> API key</dd></div>
              <div><dt>Base URL</dt><dd dir="ltr"><code>api.bizuply.com/api/v1/whatsapp</code></dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-band" aria-labelledby="wa-onboarding">
        <div className="wa-wrap wa-split is-flip wa-reveal">
          <div>
            <p className="wa-eyebrow">{he ? "התחלה" : "Fast onboarding"}</p>
            <h2 id="wa-onboarding" className="wa-h2">{he ? "מחשבון Meta ועד ההודעה הראשונה." : "From Meta account to first message, step by step."}</h2>
            <p className="wa-lead">
              {he
                ? "מחברים מספר דרך Embedded Signup של Meta, מתוך לוח הבקרה של ביזאפלי. אין תור אישור נפרד של ביזאפלי. הבדיקות של Meta עדיין חלות, ולכן הזמן תלוי בחשבון."
                : "Connect a number through Meta's Embedded Signup, inside the Bizuply dashboard. There's no separate Bizuply approval queue. Meta's own checks still apply, so timing depends on your account."}
            </p>
            <p className="wa-fine">
              {he
                ? "Meta עשויה לבקש אימות עסק, לבדוק את שם התצוגה, או להגביל את נפח ההודעות עד שהחשבון צובר היסטוריה."
                : "Meta may ask for business verification, review your display name, or limit messaging volume until your account builds a track record."}
            </p>
            <div className="wa-actions">
              <SiteLink to="/get-started" className="wa-btn wa-btn-ghost">
                {he ? "שלבי החיבור" : "See the onboarding steps"} <Arrow size={16} aria-hidden="true" />
              </SiteLink>
            </div>
          </div>
          <ol className="wa-steps wa-feature-visual" style={{ padding: 24 }}>
            {onboarding.map(([title, text], i) => (
              <li className="wa-step" key={title}>
                <span className="wa-step-n" aria-hidden="true">0{i + 1}</span>
                <div className="wa-step-body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section {...en} className="wa-section" aria-labelledby="wa-capabilities">
        <div className="wa-wrap">
          <div className="wa-reveal">
            <SectionHead
              eyebrow={he ? "יכולות" : "Capabilities"}
              title={<span id="wa-capabilities">{he ? "מה שהמערכת שלכם צריכה כדי לדבר ב־WhatsApp." : "Everything your system needs to talk on WhatsApp."}</span>}
              lead={he ? "API ממוקד, אירועים חתומים וכלים לניהול תבניות, סביב מספר וואטסאפ אחד לכל סביבת עבודה." : "A focused API, signed events and the tools to manage templates, all built around one WhatsApp number per workspace."}
            />
          </div>
          <div className="wa-grid-3 wa-reveal">
            <article className="wa-card is-hover">
              <div className="wa-card-icon"><Webhook size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">{he ? "API ו־webhooks" : "API and webhooks"}</h3>
              <p>
                {he
                  ? "שולחים תבנית מאושרת ב־POST אחד, בודקים סטטוס הודעה, ומקבלים webhooks חתומים: accepted, sent, delivered, read ו־failed."
                  : "Send approved templates with one POST, look up message status, and receive signed status webhooks: accepted, sent, delivered, read and failed."}
              </p>
              <div style={{ marginTop: 18 }}>
                <div className="wa-event-row"><span>whatsapp.message.delivered</span><span className="wa-badge is-ok">200</span></div>
                <div className="wa-event-row"><span>whatsapp.message.read</span><span className="wa-badge is-ok">200</span></div>
              </div>
            </article>
            <article className="wa-card is-hover">
              <div className="wa-card-icon"><FileText size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">{he ? "תבניות הודעה" : "Message templates"}</h3>
              <p>
                {he
                  ? "יוצרים תבניות בלוח הבקרה ושולחים אותן לאישור של Meta. המערכת מציגה את התבניות המאושרות וקוראת את סדר המשתנים מה־API."
                  : "Create templates in the dashboard and submit them to Meta for review. Your system lists approved templates and reads the variable order straight from the API."}
              </p>
              <div style={{ marginTop: 18 }}>
                <div className="wa-event-row"><span>order_update · en</span><span className="wa-badge is-ok">APPROVED</span></div>
                <div className="wa-event-row"><span>appointment_reminder · es</span><span className="wa-badge is-warn">PENDING</span></div>
              </div>
            </article>
            <article className="wa-card is-hover">
              <div className="wa-card-icon"><Plug size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">{he ? "CRM ומערכות משלכם" : "CRM and custom systems"}</h3>
              <p>
                {he
                  ? "כל מערכת שיכולה לשלוח בקשת HTTPS יכולה לשלוח הודעות וואטסאפ: CRM, אתר, שרת SaaS, ERP או כלי פנימי. בלי תוספים."
                  : "Any system that can make an HTTPS request can send WhatsApp messages: your CRM, website, SaaS backend, ERP or internal tools. No plugins or vendor lock-in."}
              </p>
              <div style={{ marginTop: 18 }}>
                <div className="wa-event-row"><span>POST /messages/template</span><span className="wa-badge is-info">201</span></div>
                <div className="wa-event-row"><span>GET /templates</span><span className="wa-badge is-info">200</span></div>
              </div>
            </article>
          </div>
          <div className="wa-split wa-reveal" style={{ marginTop: 56 }}>
            <div>
              <h3 className="wa-h2" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}>{he ? "קריאה אחת לשליחה. אירוע אחד לאישור." : "One call to send. One event to confirm."}</h3>
              <p className="wa-lead">
                {he
                  ? "משתמשים במשתני התבנית לפי הסדר, מוסיפים Idempotency-Key לניסיונות חוזרים, ומעבירים externalId משלכם כדי שכל webhook יחזור לרשומה הנכונה."
                  : <>Use the template variables in order, add an Idempotency-Key for safe retries, and pass your own <code>externalId</code> so every webhook maps straight back to the right record.</>}
              </p>
              <div className="wa-actions">
                <SiteLink to="/developers" className="wa-btn wa-btn-ghost">
                  {he ? "למפתחים" : "Developer overview"} <Arrow size={16} aria-hidden="true" />
                </SiteLink>
              </div>
            </div>
            <CodeBlock
              title="send.ts"
              language="js"
              code={`await fetch("https://api.bizuply.com/api/v1/whatsapp/messages/template", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.BIZUPLY_API_KEY}\`,
    "Content-Type": "application/json",
    "Idempotency-Key": "order-1042-confirmation",
  },
  body: JSON.stringify({
    to: "+15551234567",
    template: "order_update",
    variables: ["Avery", "1042"],
    externalId: "order_1042",
  }),
});`}
            />
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-band" aria-labelledby="wa-pricing">
        <div className="wa-wrap">
          <div className="wa-reveal">
            <SectionHead
              center
              eyebrow={he ? "מחיר שקוף" : "Transparent pricing"}
              title={<span id="wa-pricing">{he ? "מסלול אחד. מחיר אחד לכל מספר." : "One plan. One price per number."}</span>}
              lead={he ? "מנוי קבוע של ביזאפלי לכל מספר וואטסאפ מחובר. חיובי ההודעות של Meta נפרדים ומחויבים על ידי Meta." : "A flat Bizuply subscription for each connected WhatsApp number. Meta's messaging fees are separate and billed by Meta."}
            />
          </div>
          <div className="wa-pricing-block wa-reveal">
            <article className="wa-plan-card">
              <div className="wa-plan-card-head">
                <p className="wa-eyebrow">{he ? "מנוי ביזאפלי" : "Bizuply plan"}</p>
                <span className="wa-badge is-ok">{he ? "לכל מספר וואטסאפ" : "Per WhatsApp number"}</span>
              </div>
              <div className="wa-price is-xl">
                <strong>$29</strong>
                <span>{he ? <>לחודש<br />לכל מספר וואטסאפ</> : <>/month<br />per WhatsApp number</>}</span>
              </div>
              <p className="wa-plan-note">{lang === "he" ? "חיובי ההודעות של Meta מחויבים בנפרד, בנוסף למנוי. אין ניסיון חינם." : "Meta messaging fees are billed separately, in addition to the subscription. There is no free trial."}</p>
              <ul className="wa-plan-list">
                {planIncludes.map((item) => (
                  <li key={item}><span aria-hidden="true"><Check size={14} /></span>{item}</li>
                ))}
              </ul>
              <div className="wa-actions">
                <SiteLink to="/get-started" className="wa-btn wa-btn-primary wa-btn-lg">
                  {he ? "התחילו ב־29 דולר" : "Start for $29"} <Arrow size={16} aria-hidden="true" />
                </SiteLink>
                <SiteLink to="/pricing" className="wa-link">{he ? "פירוט המחיר" : "Pricing details"} <Arrow size={14} aria-hidden="true" /></SiteLink>
              </div>
            </article>
            <div className="wa-plan-side">
              <article className="wa-card">
                <div className="wa-card-icon is-cyan"><ReceiptText size={20} aria-hidden="true" /></div>
                <h3 className="wa-h3">{he ? "חיובי ההודעות של Meta" : "Meta messaging fees"}</h3>
                <p>
                  {he
                    ? "Meta מחייבת לפי הודעה, לפי מדינת הנמען וקטגוריית ההודעה. החיובים האלה הולכים לאמצעי התשלום בחשבון WhatsApp Business, לא למנוי ביזאפלי."
                    : "Meta charges per message, based on the recipient's country and the message category. These charges go to the payment method on your WhatsApp Business Account, not to your Bizuply subscription."}
                </p>
              </article>
              <article className="wa-card is-hover">
                <div className="wa-card-icon is-cyan"><Calculator size={20} aria-hidden="true" /></div>
                <h3 className="wa-h3">{he ? "הערכת העלות" : "Estimate your total"}</h3>
                <p>{he ? "משתמשים במחירון ש־Meta מפרסמת כדי להעריך עלות לפי מדינה, קטגוריה ונפח." : "Use Meta's published rate card to estimate messaging costs by country, category and volume."}</p>
                <SiteLink to="/pricing#calculator" className="wa-link" style={{ marginTop: 14 }}>
                  {he ? "למחשבון העלות" : "Open the cost calculator"} <Arrow size={14} aria-hidden="true" />
                </SiteLink>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section" aria-labelledby="wa-security">
        <div className="wa-wrap">
          <div className="wa-reveal">
            <SectionHead
              eyebrow={he ? "אבטחה" : "Security"}
              title={<span id="wa-security">{he ? "אבטחה שבנויה לתוך החיבור." : "Security built into the integration."}</span>}
              lead={he ? "הבקרות למטה מתארות איך הפלטפורמה עובדת היום. לא מציגים הסמכות שלא הושגו." : "The controls below are how the platform works today. We don't display certifications we haven't earned."}
            />
          </div>
          <div className="wa-grid-4 wa-reveal">
            {security.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="wa-card">
                  <div className="wa-card-icon"><Icon size={20} aria-hidden="true" /></div>
                  <h3 className="wa-h3">{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
          <div className="wa-actions wa-reveal">
            <SiteLink to="/security" className="wa-link">
              {he ? "סקירת האבטחה" : "Read the security overview"} <Arrow size={14} aria-hidden="true" />
            </SiteLink>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-band" aria-labelledby="wa-analytics">
        <div className="wa-wrap wa-split wa-reveal">
          <div>
            <p className="wa-eyebrow">{he ? "נתוני ביצועים" : "Performance analytics"}</p>
            <h2 id="wa-analytics" className="wa-h2">{he ? "רואים איך ההודעות מתפקדות." : "See how your messages perform."}</h2>
            <p className="wa-lead">
              {he
                ? "לוח הבקרה מושך מ־Meta נתוני הודעות לטווח התאריכים שנבחר: נשלחו, נמסרו ונקראו, תוצאות לפי תבנית ונתוני עלות של Meta, עם ייצוא CSV."
                : "The dashboard pulls messaging analytics from Meta for the date range you choose: sent, delivered and read counts, template-level results and Meta cost data, with CSV export."}
            </p>
            <ul className="wa-list">
              <li><RefreshCw size={16} aria-hidden="true" /> {he ? "מסונכרן מנתוני Meta של חשבון WhatsApp Business" : "Synced from Meta's analytics for your WhatsApp Business Account"}</li>
              <li><BarChart3 size={16} aria-hidden="true" /> {he ? "תובנות לפי תבנית כש־Meta מפעילה template analytics" : "Per-template insights when Meta template analytics are enabled"}</li>
              <li><Check size={16} aria-hidden="true" /> {he ? "סטטוס לכל שליחה דרך ה־API" : "Message status for every API send, available through the API"}</li>
            </ul>
          </div>
          <div className="wa-feature-visual" aria-label="Illustration of the analytics dashboard">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <span className="wa-mono" style={{ fontSize: 12, color: "var(--wa-muted)" }}>{he ? "הודעות · 14 הימים האחרונים" : "Messages · last 14 days"}</span>
              <span className="wa-badge">Illustration</span>
            </div>
            <div className="wa-bars" aria-hidden="true">
              {[42, 58, 51, 66, 72, 61, 49, 70, 84, 77, 69, 88, 93, 81].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
            <dl className="wa-kv" style={{ marginTop: 14 }}>
              <div><dt>{he ? "נמסרו" : "Delivered"}</dt><dd>{he ? "חי מ־Meta בלוח הבקרה" : "Live from Meta in your dashboard"}</dd></div>
              <div><dt>{he ? "נקראו" : "Read"}</dt><dd>{he ? "לפי יום ולפי תבנית" : "Per day and per template"}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section" aria-labelledby="wa-solutions">
        <div className="wa-wrap">
          <div className="wa-reveal">
            <SectionHead
              eyebrow={he ? "למי זה מתאים" : "Solutions"}
              title={<span id="wa-solutions">{he ? "למפתחים ולסוכנויות שהם בונים עבורן." : "For developers and the agencies they build for."}</span>}
            />
          </div>
          <div className="wa-grid-2 wa-reveal">
            <article className="wa-card is-hover">
              <div className="wa-card-icon"><Code2 size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">{he ? "מפתחים וצוותי SaaS" : "Developers and SaaS teams"}</h3>
              <p>
                {he
                  ? "מוסיפים WhatsApp למוצר עם REST API קטן, webhooks חתומים ודוגמאות ב־cURL, JavaScript ו־Python."
                  : "Add WhatsApp to your product with a small REST API, signed webhooks and examples in cURL, JavaScript and Python."}
              </p>
              <div className="wa-actions">
                <SiteLink to="/developers" className="wa-link">{he ? "למפתחים" : "For developers"} <Arrow size={14} aria-hidden="true" /></SiteLink>
                <SiteLink to="/docs" className="wa-link">{he ? "תיעוד" : "Documentation"} <Arrow size={14} aria-hidden="true" /></SiteLink>
              </div>
            </article>
            <article className="wa-card is-hover">
              <div className="wa-card-icon"><Building2 size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">{he ? "סוכנויות וחברות תוכנה" : "Agencies and software companies"}</h3>
              <p>
                {he
                  ? "מחברים מספר וואטסאפ של לקוח עם מנוי, מפתח ו־webhook משלו, ואז מחברים אותו למערכות שבונים עבורו. ניהול כמה לקוחות ממסך אחד עדיין לא זמין."
                  : "Connect a client's WhatsApp number with its own subscription, isolated API key and webhook, then plug it into the systems you build for them. Multi-client management is coming later."}
              </p>
              <div className="wa-actions">
                <SiteLink to="/agencies" className="wa-link">{he ? "ביזאפלי לסוכנויות" : "Bizuply for Agencies"} <Arrow size={14} aria-hidden="true" /></SiteLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section" aria-labelledby="wa-faq">
        <div className="wa-wrap">
          <SectionHead
            eyebrow={he ? "שאלות" : "Questions"}
            title={<span id="wa-faq">{he ? "לפני שמתחילים" : "Before you start"}</span>}
          />
          <Accordion items={faq} defaultOpen={0} />
          <div className="wa-actions" style={{ marginTop: 28 }}>
            <a className="wa-link" href={he ? "https://bizuply.com/he/crm" : "https://bizuply.com/crm"}>
              {he ? "CRM של ביזאפלי" : "Bizuply CRM"} <Arrow size={14} aria-hidden="true" />
            </a>
            <a className="wa-link" href={he ? "https://bizuply.com/he/automations" : "https://bizuply.com/automations"}>
              {he ? "אוטומציות" : "Automations"} <Arrow size={14} aria-hidden="true" />
            </a>
            <a className="wa-link" href={he ? "https://bizuply.com/he/appointments" : "https://bizuply.com/appointments"}>
              {he ? "תורים" : "Appointments"} <Arrow size={14} aria-hidden="true" />
            </a>
            <SiteLink to="/guides" className="wa-link">
              {he ? "מדריכי וואטסאפ" : "WhatsApp guides"} <Arrow size={14} aria-hidden="true" />
            </SiteLink>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-tight">
        <div className="wa-wrap wa-reveal">
          <div className="wa-cta">
            <div>
              <h2 className="wa-h2">{he ? "חברו את מספר הוואטסאפ הראשון." : "Connect your first WhatsApp number."}</h2>
              <p className="wa-lead">{he ? "29 דולר לחודש לכל מספר. חיובי ההודעות של Meta מחויבים בנפרד." : "$29/month per number. Meta messaging fees are billed separately."}</p>
            </div>
            <div className="wa-actions">
              <SiteLink to="/get-started" className="wa-btn wa-btn-primary">
                {he ? "התחילו עכשיו" : "Get Started"} <Arrow size={16} aria-hidden="true" />
              </SiteLink>
              <SiteLink to="/docs" className="wa-link">{he ? "גלו את ה־API" : "Explore API"} <Arrow size={14} aria-hidden="true" /></SiteLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

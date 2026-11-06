import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, FileText, LifeBuoy, Mail, Search, ShieldCheck } from "lucide-react";
import { coerceSupportedLanguage } from "../../../../i18n/localeUtils";
import ContactRequestForm from "../ContactRequestForm";
import { PRIVACY_URL, SIGN_IN_URL, SUPPORT_EMAIL, SiteLink, TERMS_URL } from "../siteConfig";
import { Accordion, SectionHead } from "../ui";

type Topic = "Getting started" | "Meta & verification" | "Numbers" | "Templates & messaging" | "Billing" | "API & webhooks";

const TOPICS: Topic[] = ["Getting started", "Meta & verification", "Numbers", "Templates & messaging", "Billing", "API & webhooks"];

const ARTICLES: Array<{ topic: Topic; q: string; a: string }> = [
  {
    topic: "Getting started",
    q: "What is the WhatsApp Business API?",
    a: "It's Meta's platform for businesses to message customers on WhatsApp from their own software, rather than from the WhatsApp Business app on a phone. Bizuply connects your number to it through Meta's WhatsApp Cloud API and gives you a REST API, signed webhooks and a dashboard.",
  },
  {
    topic: "Getting started",
    q: "How do I start?",
    a: "Create a WhatsApp API account on Get Started, pay $29/month for one number, then open WhatsApp → Connection and run Meta's Embedded Signup. Existing Bizuply customers can log in and go straight to Connection. Support is for questions, not for issuing access.",
  },
  {
    topic: "Getting started",
    q: "How does Bizuply relate to Meta?",
    a: "Bizuply is built on Meta's WhatsApp Cloud API. Messages are sent through that API, and numbers are connected through Meta's Embedded Signup. Meta's policies, reviews, messaging limits and fees apply as usual. Bizuply provides the API, webhooks, dashboard and tools on top.",
  },
  {
    topic: "Getting started",
    q: "Do I need a developer?",
    a: "Not to connect a number, manage templates or use the dashboard. To send messages from your own systems, such as a CRM, website, SaaS product or internal tools, someone needs to call the REST API and handle webhooks. The docs include cURL, JavaScript and Python examples.",
  },
  {
    topic: "Getting started",
    q: "Can agencies use Bizuply?",
    a: "Yes. An agency can connect a client's number and build that client's integration on the API today. Each number is its own workspace with its own $29/month subscription, API key and webhook. An agency console, consolidated billing and multi-client API keys are not available yet.",
  },
  {
    topic: "Meta & verification",
    q: "Does Meta need to approve my account?",
    a: "Meta reviews display names and may ask for business verification or review the account, depending on the business and use case. Bizuply doesn't add its own approval queue, but it can't skip Meta's checks either.",
  },
  {
    topic: "Meta & verification",
    q: "How long does onboarding take?",
    a: "The Embedded Signup flow itself is short. The time before you can message at full volume depends on Meta's reviews and the messaging limits Meta sets for your account, so we don't promise a fixed time.",
  },
  {
    topic: "Meta & verification",
    q: "Why can I only message a limited number of customers?",
    a: "Meta sets a messaging limit on how many unique customers you can start conversations with in 24 hours. It increases as you send good-quality messages. WhatsApp → Connection shows your current limit and quality rating.",
  },
  {
    topic: "Numbers",
    q: "Can I use my existing number?",
    a: "Often, yes. The number must be able to receive a verification code by SMS or voice call. If it's currently used in the WhatsApp or WhatsApp Business app, it may need to be migrated or removed from the app first, depending on what Meta supports.",
  },
  {
    topic: "Numbers",
    q: "Can I manage multiple numbers?",
    a: "Yes, one per workspace. One subscription covers one WhatsApp number, so each additional number goes in its own workspace with its own $29/month subscription, API key and webhook. There is no combined multi-number view yet.",
  },
  {
    topic: "Templates & messaging",
    q: "Why do I have to use templates?",
    a: "WhatsApp requires an approved template to start a conversation with a customer. The Bizuply API sends approved templates. Replies inside the 24-hour customer service window are handled in the Bizuply inbox.",
  },
  {
    topic: "Templates & messaging",
    q: "My template was rejected. What now?",
    a: "Meta rejects templates that break its policies or don't fit the chosen category. Edit the content or category in WhatsApp → Templates and submit it again. Rejected and pending templates can't be sent through the API.",
  },
  {
    topic: "Billing",
    q: "What does $29 include?",
    a: "The Bizuply subscription for one connected WhatsApp number: Meta Embedded Signup onboarding, the REST API and API key, signed webhooks, template management, the inbox, Meta-synced analytics, the dashboard, documentation and email support. There's no free trial, Meta's messaging charges are separate, and taxes may apply where required.",
  },
  {
    topic: "Billing",
    q: "What does Meta charge separately?",
    a: "Meta charges per template message, based on the recipient's country and the category: marketing, utility or authentication. Replies inside the 24-hour customer service window are generally free. In the standard setup, Meta bills these charges to the payment method on your WhatsApp Business Account. Use the cost calculator on the Pricing page to estimate them.",
  },
  {
    topic: "API & webhooks",
    q: "How do API keys work?",
    a: "Create a key in the dashboard under WhatsApp → API / Developers and send it as a Bearer token in the Authorization header. Each key belongs to one workspace, so it always sends from that workspace's number. The key is shown once and stored only as a hash. Regenerating issues a new key and the previous one stops working immediately. Keep keys on your server, never in browser or mobile code.",
  },
  {
    topic: "API & webhooks",
    q: "How do webhooks work?",
    a: "Set an HTTPS URL under WhatsApp → API / Developers. Bizuply then posts message status events (accepted, sent, delivered, read and failed) for messages you send through the API. Each request is signed with HMAC-SHA256 so you can verify it came from Bizuply, and failed deliveries are retried up to five times.",
  },
  {
    topic: "API & webhooks",
    q: "Can I connect my CRM?",
    a: "Yes, if your CRM can call a REST API or run custom code, for example through its workflows or a small middleware service. Bizuply doesn't ship ready-made CRM connectors; you or your developer call the API and handle the status webhooks.",
  },
  {
    topic: "API & webhooks",
    q: "Can I connect my own SaaS product?",
    a: "Yes. Your backend calls the Bizuply API with your workspace's API key to send approved templates and receives status webhooks. Each connected number has its own key, so a SaaS serving several businesses needs a workspace and subscription per number.",
  },
  {
    topic: "API & webhooks",
    q: "My webhook isn't receiving events.",
    a: "Check that the URL uses https and returns a 2xx status within 15 seconds, and that you verify the signature over the raw request body. Use 'Send test webhook' in WhatsApp → API / Developers to test. Failed deliveries are retried up to five times.",
  },
  {
    topic: "API & webhooks",
    q: "I get WHATSAPP_NOT_CONNECTED.",
    a: "The workspace behind your API key has no fully connected WhatsApp number. Open WhatsApp → Connection to finish or repair the connection.",
  },
  {
    topic: "API & webhooks",
    q: "How do I test the connection?",
    a: "After the number is connected and a template is approved, open WhatsApp → Connection and send a test template to a phone you own. Confirm consent first. Meta may charge for that send. To test webhooks without messaging a customer, use Send test webhook under WhatsApp → API / Developers.",
  },
  {
    topic: "API & webhooks",
    q: "Do webhooks include customer replies?",
    a: "Not yet. Webhooks cover outbound message status: accepted, sent, delivered, read and failed. Customer replies appear in the Bizuply WhatsApp inbox.",
  },
];

const TOPICS_HE: Topic[] = ["Getting started", "Meta & verification", "Numbers", "Templates & messaging", "Billing", "API & webhooks"];

const TOPIC_LABEL_HE: Record<Topic, string> = {
  "Getting started": "התחלה",
  "Meta & verification": "Meta ואימות",
  Numbers: "מספרים",
  "Templates & messaging": "תבניות והודעות",
  Billing: "חיוב",
  "API & webhooks": "API ו־Webhooks",
};

const ARTICLES_HE: Array<{ topic: Topic; q: string; a: string }> = [
  { topic: "Getting started", q: "מהו WhatsApp Business API?", a: "זו פלטפורמת Meta לעסקים ששולחים הודעות וואטסאפ מהמערכת שלהם, לא מאפליקציה בטלפון. ביזאפלי מחברת את המספר דרך Cloud API ונותנת REST API, webhooks חתומים ולוח בקרה." },
  { topic: "Getting started", q: "איך מתחילים?", a: "יוצרים חשבון WhatsApp API בעמוד ההתחלה, משלמים 29 דולר לחודש למספר אחד, ואז פותחים וואטסאפ → חיבור ומריצים את Embedded Signup של Meta. לקוחות ביזאפלי קיימים יכולים להתחבר ולעבור ישר לחיבור. התמיכה לשאלות, לא להנפקת גישה." },
  { topic: "Getting started", q: "איך ביזאפלי קשורה ל־Meta?", a: "ביזאפלי בנויה על WhatsApp Cloud API של Meta. ההודעות עוברות שם, והמספרים מתחברים ב־Embedded Signup. מדיניות, סקירות, מגבלות וחיובים של Meta חלים כרגיל." },
  { topic: "Getting started", q: "צריך מפתח?", a: "לא כדי לחבר מספר, לנהל תבניות או להשתמש בלוח. כדי לשלוח מהמערכות שלכם מישהו צריך לקרוא ל־REST API ולטפל ב־webhooks. בתיעוד יש דוגמאות cURL, JavaScript ו־Python." },
  { topic: "Getting started", q: "סוכנויות יכולות להשתמש בביזאפלי?", a: "כן. סוכנות יכולה לחבר מספר של לקוח ולבנות אינטגרציה על ה־API. לכל מספר יש מנוי 29 דולר, מפתח ו־webhook משלו. קונסולת ריבוי לקוחות עדיין אינה זמינה." },
  { topic: "Meta & verification", q: "Meta צריכה לאשר את החשבון?", a: "Meta בודקת שמות תצוגה ועשויה לבקש אימות עסק. ביזאפלי לא מוסיפה תור אישורים, וגם לא יכולה לדלג על בדיקות Meta." },
  { topic: "Meta & verification", q: "כמה זמן לוקח החיבור?", a: "זרימת Embedded Signup עצמה קצרה. הזמן עד שליחה בנפח מלא תלוי בסקירות ובמגבלות ש־Meta קובעת, ולכן אין הבטחת זמן קבוע." },
  { topic: "Meta & verification", q: "למה אפשר לפנות רק למספר מוגבל של לקוחות?", a: "Meta קובעת כמה לקוחות ייחודיים אפשר לפתוח איתם שיחה ב־24 שעות. המגבלה עולה עם הודעות איכותיות. וואטסאפ → חיבור מציג את המגבלה ואת דירוג האיכות." },
  { topic: "Numbers", q: "אפשר להשתמש במספר קיים?", a: "לרוב כן. המספר חייב לקבל קוד ב־SMS או בשיחה. אם הוא באפליקציית וואטסאפ, ייתכן שצריך להעביר או להסיר אותו קודם, לפי מה ש־Meta תומכת." },
  { topic: "Numbers", q: "אפשר לנהל כמה מספרים?", a: "כן, אחד לכל סביבת עבודה. כל מנוי מכסה מספר אחד. אין תצוגה מאוחדת לכמה מספרים." },
  { topic: "Templates & messaging", q: "למה חייבים תבניות?", a: "וואטסאפ דורש תבנית מאושרת כדי לפתוח שיחה עם לקוח. ה־API שולח תבניות מאושרות. תשובות בתוך חלון 24 השעות מטופלות בתיבה." },
  { topic: "Templates & messaging", q: "התבנית נדחתה. מה עכשיו?", a: "Meta דוחה תבניות שחורגות ממדיניות או לא מתאימות לקטגוריה. עורכים בוואטסאפ → תבניות ושולחים שוב. תבניות שנדחו או ממתינות לא נשלחות דרך ה־API." },
  { topic: "Billing", q: "מה כוללים 29 הדולר?", a: "מנוי ביזאפלי למספר מחובר אחד: Embedded Signup, REST API ומפתח, webhooks חתומים, תבניות, תיבה, אנליטיקה, לוח בקרה, תיעוד ותמיכה בדוא״ל. אין ניסיון חינם, חיובי Meta נפרדים, וייתכן מס." },
  { topic: "Billing", q: "מה Meta מחייבת בנפרד?", a: "Meta מחייבת לפי מדינת הנמען וקטגוריית התבנית. תשובות בחלון 24 השעות לרוב בחינם. בחיוב הסטנדרטי Meta מחייבת את אמצעי התשלום בחשבון WhatsApp Business. מחשבון המחירים מעריך את זה." },
  { topic: "API & webhooks", q: "איך עובדים מפתחות API?", a: "יוצרים מפתח תחת וואטסאפ → API / מפתחים ושולחים כ־Bearer. כל מפתח שייך לסביבה אחת. הוא מוצג פעם אחת ונשמר כגיבוב. חידוש מבטל את הקודם מיד." },
  { topic: "API & webhooks", q: "איך עובדים webhooks?", a: "מגדירים כתובת HTTPS תחת וואטסאפ → API / מפתחים. ביזאפלי שולחת סטטוס של הודעות יוצאות: accepted, sent, delivered, read ו־failed. כל בקשה חתומה ב־HMAC-SHA256." },
  { topic: "API & webhooks", q: "אפשר לחבר CRM?", a: "כן, אם ה־CRM יכול לקרוא ל־REST API או להריץ קוד. ביזאפלי לא משווקת מחברים מוכנים ל־CRM; אתם או המפתח קוראים ל־API." },
  { topic: "API & webhooks", q: "אפשר לחבר מוצר SaaS שלי?", a: "כן. השרת קורא ל־API עם מפתח הסביבה. לכל מספר מחובר מפתח משלו, לכן SaaS שמשרת כמה עסקים צריך סביבה ומנוי לכל מספר." },
  { topic: "API & webhooks", q: "ה־webhook לא מקבל אירועים.", a: "בודקים שהכתובת ב־https ומחזירה 2xx תוך 15 שניות, ושמאמתים חתימה על גוף הבקשה הגולמי. משתמשים ב־Send test webhook. ניסיונות חוזרים עד חמש פעמים." },
  { topic: "API & webhooks", q: "מתקבל WHATSAPP_NOT_CONNECTED.", a: "לסביבה מאחורי המפתח אין מספר וואטסאפ מחובר במלואו. פותחים וואטסאפ → חיבור ומשלימים או מתקנים." },
  { topic: "API & webhooks", q: "איך בודקים את החיבור?", a: "אחרי שהמספר מחובר ותבנית אושרה, פותחים וואטסאפ → חיבור ושולחים תבנית בדיקה לטלפון שלכם. מאשרים הסכמה קודם. Meta עשויה לחייב. לבדיקת webhook בלי הודעה ללקוח משתמשים ב־Send test webhook." },
  { topic: "API & webhooks", q: "האם webhooks כוללים תשובות לקוחות?", a: "עדיין לא. webhooks מכסים סטטוס הודעות יוצאות. תשובות לקוחות מופיעות בתיבת הוואטסאפ של ביזאפלי." },
];

const SHELL = {
  en: {
    eyebrow: "Help Center",
    title: "How can we help?",
    lead: "Answers about onboarding, Meta's requirements, numbers, templates, billing and the API.",
    search: "Search help articles",
    placeholder: "Search, e.g. verification, webhook, template",
    all: "All",
    topics: "Filter by topic",
    articles: "Help articles",
    article: "article",
    articlesN: "articles",
    empty: "No articles match. Try another term, or contact support below.",
    resources: "Resources",
    docs: "Documentation",
    docsLead: "API guides, webhooks and the endpoint reference.",
    security: "Security",
    securityLead: "How keys, webhooks and Meta tokens are protected.",
    privacy: "Privacy Policy",
    privacyLead: "How Bizuply handles personal data.",
    terms: "Terms of Service",
    termsLead: "The terms for using Bizuply.",
    support: "Support",
    contact: "Contact support.",
    contactLead: "Send the form, or email us. For API issues, include the requestId from the error response.",
    existing: "Existing customers can also log in and see live connection status under WhatsApp → Connection.",
    noStatus: "There is no public service status page yet. Connection and Meta account status are shown live in your dashboard.",
  },
  he: {
    eyebrow: "מרכז עזרה",
    title: "איך אפשר לעזור?",
    lead: "תשובות על חיבור, דרישות Meta, מספרים, תבניות, חיוב וה־API.",
    search: "חיפוש במאמרי העזרה",
    placeholder: "חיפוש, למשל אימות, webhook, תבנית",
    all: "הכול",
    topics: "סינון לפי נושא",
    articles: "מאמרי עזרה",
    article: "מאמר",
    articlesN: "מאמרים",
    empty: "אין מאמרים תואמים. נסו מונח אחר, או פנו לתמיכה למטה.",
    resources: "משאבים",
    docs: "תיעוד",
    docsLead: "מדריכי API, webhooks ומפרט נקודות הקצה.",
    security: "אבטחה",
    securityLead: "איך מוגנים מפתחות, webhooks וטוקנים של Meta.",
    privacy: "מדיניות פרטיות",
    privacyLead: "איך ביזאפלי מטפלת במידע אישי.",
    terms: "תנאי שימוש",
    termsLead: "התנאים לשימוש בביזאפלי.",
    support: "תמיכה",
    contact: "פנייה לתמיכה.",
    contactLead: "שולחים את הטופס, או כותבים לנו. לבעיות API מצרפים את ה־requestId מתשובת השגיאה.",
    existing: "לקוחות קיימים יכולים גם להתחבר ולראות סטטוס חיבור חי תחת וואטסאפ → חיבור.",
    noStatus: "אין עדיין עמוד סטטוס ציבורי. סטטוס החיבור וחשבון Meta מוצגים בלוח הבקרה.",
  },
};

export default function HelpPage() {
  const { i18n } = useTranslation();
  const he = coerceSupportedLanguage(i18n.language) === "he";
  const shell = he ? SHELL.he : SHELL.en;
  const source = he ? ARTICLES_HE : ARTICLES;
  const topicList = he ? TOPICS_HE : TOPICS;
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic | null>(null);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return source.filter((article) => {
      if (topic && article.topic !== topic) return false;
      const label = he ? TOPIC_LABEL_HE[article.topic] : article.topic;
      const text = `${article.q} ${article.a} ${label}`.toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [query, topic, source, he]);

  return (
    <>
      <section className="wa-page-hero">
        <div className="wa-wrap">
          <SectionHead
            as="h1"
            eyebrow={shell.eyebrow}
            title={shell.title}
            lead={shell.lead}
          />
          <div className="wa-help-search" role="search">
            <Search size={18} aria-hidden="true" />
            <label htmlFor="wa-help-search" className="wa-sr">{shell.search}</label>
            <input
              id="wa-help-search"
              className="wa-input"
              type="search"
              placeholder={shell.placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      <section className="wa-section is-tight" aria-labelledby="wa-help-articles">
        <div className="wa-wrap" style={{ maxWidth: 900 }}>
          <h2 id="wa-help-articles" className="wa-sr">{shell.articles}</h2>
          <div className="wa-chips" role="group" aria-label={shell.topics}>
            <button type="button" className="wa-chip" aria-pressed={topic === null} onClick={() => setTopic(null)}>{shell.all}</button>
            {topicList.map((item) => (
              <button key={item} type="button" className="wa-chip" aria-pressed={topic === item} onClick={() => setTopic(topic === item ? null : item)}>
                {he ? TOPIC_LABEL_HE[item] : item}
              </button>
            ))}
          </div>
          <p className="wa-fine" aria-live="polite" style={{ marginBottom: 14 }}>
            {results.length} {results.length === 1 ? shell.article : shell.articlesN}
          </p>
          {results.length ? (
            <Accordion key={`${topic}-${query}`} items={results.map((article) => ({ q: article.q, a: article.a }))} />
          ) : (
            <div className="wa-card">
              <p style={{ margin: 0 }}>
                {shell.empty}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="wa-section is-band" aria-labelledby="wa-help-resources">
        <div className="wa-wrap">
          <h2 id="wa-help-resources" className="wa-h2" style={{ marginBottom: 28 }}>{shell.resources}</h2>
          <div className="wa-grid-4">
            <SiteLink to="/docs" className="wa-card is-hover" style={{ textDecoration: "none" }}>
              <div className="wa-card-icon"><BookOpen size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">{shell.docs}</h3>
              <p>{shell.docsLead}</p>
            </SiteLink>
            <SiteLink to="/security" className="wa-card is-hover" style={{ textDecoration: "none" }}>
              <div className="wa-card-icon"><ShieldCheck size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">{shell.security}</h3>
              <p>{shell.securityLead}</p>
            </SiteLink>
            <a href={PRIVACY_URL} className="wa-card is-hover" style={{ textDecoration: "none" }}>
              <div className="wa-card-icon"><FileText size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">{shell.privacy}</h3>
              <p>{shell.privacyLead}</p>
            </a>
            <a href={TERMS_URL} className="wa-card is-hover" style={{ textDecoration: "none" }}>
              <div className="wa-card-icon"><FileText size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">{shell.terms}</h3>
              <p>{shell.termsLead}</p>
            </a>
          </div>
        </div>
      </section>

      <section className="wa-section" id="contact" aria-labelledby="wa-help-contact">
        <div className="wa-wrap wa-split" style={{ alignItems: "start" }}>
          <div>
            <p className="wa-eyebrow"><LifeBuoy size={14} aria-hidden="true" /> {shell.support}</p>
            <h2 id="wa-help-contact" className="wa-h2">{shell.contact}</h2>
            <p className="wa-lead">
              {shell.contactLead}
            </p>
            <ul className="wa-list">
              <li><Mail size={16} aria-hidden="true" /> <a className="wa-link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
              <li><LifeBuoy size={16} aria-hidden="true" /> <span>{shell.existing}</span></li>
            </ul>
            <p className="wa-fine">
              {shell.noStatus}
            </p>
          </div>
          <div className="wa-card">
            <ContactRequestForm defaultIntent="support" />
          </div>
        </div>
      </section>
    </>
  );
}

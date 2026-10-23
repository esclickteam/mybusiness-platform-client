import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePath.mjs";
import { getLocaleMarketingPage } from "../../lib/localeMarketing.mjs";
import { WhatsAppStatusIllustration } from "../../components/product-marketing/ProductIllustrations";
import {
  FaqAccordion,
  SectionHeading,
  SpotlightCard,
} from "../../components/product-marketing";
import "../../components/product-marketing/marketingKit.css";

const COPY = {
  he: {
    title: "WhatsApp API לעסקים | ביזאפלי (Bizuply)",
    description:
      "חיבור WhatsApp Cloud API של Meta דרך ביזאפלי. 29 דולר לחודש למספר מחובר. חיובי ההודעות של Meta נפרדים, ואין ניסיון חינם.",
    h1: "WhatsApp API לעסקים",
    lead: "ביזאפלי מחברת את WhatsApp Cloud API של Meta לעסק: תבניות שמאושרות אצל Meta, מעקב מסירה, ו־webhooks חתומים. המערכת שלכם מתחברת עם מפתח API של ביזאפלי, בלי לגעת בטוקן של Meta.",
    price: "29 דולר לחודש למספר וואטסאפ מחובר אחד.",
    metaFees: "חיובי ההודעות של Meta מחויבים בנפרד, לפי המחירון של Meta. אין כאן ניסיון חינם.",
    audiencesTitle: "למי זה מתאים",
    audiences: [
      ["מפתחים וצוותי SaaS", "מערכת שיכולה לשלוח בקשת HTTPS יכולה לשלוח תבנית מאושרת ולקבל אירועי סטטוס חתומים."],
      ["עסקים עם CRM או אתר", "המספר המחובר משמש את המערכת שכבר עובדת אצלכם, כולל CRM, אתר או כלי פנימי."],
      ["סוכנויות שבונות ללקוח", "לכל מספר יש מנוי, מפתח ו־webhook משלו. ניהול כמה לקוחות ממסך אחד עדיין לא זמין."],
    ],
    capabilitiesTitle: "יכולות שקיימות היום",
    capabilities: [
      ["שליחת תבניות", "שולחים תבנית שאושרה אצל Meta בקריאת POST, עם משתנים לפי הסדר שה־API מחזיר."],
      ["סטטוסים ו־webhooks", "אפשר לבדוק סטטוס הודעה ולקבל אירועים חתומים: accepted, sent, delivered, read ו־failed."],
      ["תבניות בלוח הבקרה", "יוצרים תבנית בלוח הבקרה ושולחים אותה לאישור של Meta. רק תבנית מאושרת נשלחת."],
      ["אנליטיקה", "לוח הבקרה מושך מ־Meta נתוני שליחה, מסירה וקריאה לטווח התאריכים שנבחר, כולל ייצוא CSV."],
    ],
    startTitle: "איך מתחילים",
    steps: [
      ["חשבון Meta Business", "משתמשים בחשבון קיים, או יוצרים אחד במהלך החיבור."],
      ["Embedded Signup", "הזרימה של Meta נפתחת מתוך לוח הבקרה של ביזאפלי. אין תור אישור נפרד של ביזאפלי."],
      ["אימות המספר", "מאשרים בעלות על המספר בקוד ב־SMS או בשיחה."],
      ["אישור תבניות", "שולחים תבניות, ו־Meta בודקת כל אחת."],
      ["מפתח API", "יוצרים מפתח ומתחילים לשלוח מהמערכת שלכם."],
    ],
    usesTitle: "תרחישים",
    uses: [
      "אישור הזמנה או עדכון סטטוס שנשלח כתבנית מאושרת מהמערכת שלכם.",
      "תזכורת תור, אחרי ש־Meta אישרה את נוסח התבנית.",
      "חיבור CRM או אתר קיים בלי להעביר את טוקן הגישה של Meta לקוד שלכם.",
    ],
    cta: "התחילו ב־29 דולר",
    plans: "פירוט המחיר באתר ה־API",
    demoTitle: "ההדגמה החיה",
    demoText: "האתר whatsapp.bizuply.com מציג דוגמת בקשה, תשובה ומסך שיחה. זו המחשה, לא עסקה חיה.",
    demoLink: "לצפייה בהדגמה",
    faqTitle: "לפני שמתחילים",
    faq: [
      ["מה כוללים 29 הדולר?", "מנוי למספר וואטסאפ מחובר אחד: חיבור, API ו־webhooks, תבניות, לוח בקרה ותיעוד. מספר נוסף דורש מנוי נפרד."],
      ["יש ניסיון חינם?", "אין. המנוי מתחיל ב־29 דולר לחודש למספר אחד."],
      ["חיובי Meta כלולים?", "לא. Meta מחייבת לפי מדינת הנמען וקטגוריית ההודעה, בנפרד ממנוי ביזאפלי."],
      ["אפשר לנהל כמה לקוחות ממסך אחד?", "עדיין לא. לכל מספר יש מנוי, מפתח ו־webhook משלו."],
    ],
    relatedTitle: "מוצרים משלימים",
  },
  en: {
    title: "WhatsApp API for businesses | Bizuply",
    description:
      "Connect Meta's WhatsApp Cloud API through Bizuply. $29 per month for one connected number. Meta messaging fees are separate, and there is no free trial.",
    h1: "WhatsApp API for businesses",
    lead: "Bizuply connects Meta's WhatsApp Cloud API to a business: templates Meta has approved, delivery status, and signed webhooks. Your system uses a Bizuply API key and does not handle Meta's access token.",
    price: "$29 per month for one connected WhatsApp number.",
    metaFees: "Meta's messaging fees are billed separately, on Meta's own rate card. There is no free trial.",
    audiencesTitle: "Who it is for",
    audiences: [
      ["Developers and SaaS teams", "Any system that can make an HTTPS request can send an approved template and receive signed status events."],
      ["Businesses with a CRM or website", "The connected number serves the system you already run, including a CRM, a website, or an internal tool."],
      ["Agencies building for a client", "Each number has its own subscription, key, and webhook. Managing many clients from one screen is not available yet."],
    ],
    capabilitiesTitle: "Capabilities that are live",
    capabilities: [
      ["Template sends", "Send a Meta-approved template with one POST, using variables in the order the API returns."],
      ["Status and webhooks", "Look up a message and receive signed events: accepted, sent, delivered, read, and failed."],
      ["Templates in the dashboard", "Create a template in the dashboard and submit it to Meta. Only an approved template can be sent."],
      ["Analytics", "The dashboard reads Meta send, delivery, and read counts for the date range you choose, including CSV export."],
    ],
    startTitle: "How to start",
    steps: [
      ["Meta Business account", "Use an existing account, or create one during connection."],
      ["Embedded Signup", "Meta's flow opens from the Bizuply dashboard. There is no separate Bizuply approval queue."],
      ["Verify the number", "Confirm ownership with a code by SMS or voice call."],
      ["Template review", "Submit templates. Meta reviews each one."],
      ["API key", "Create a key and start sending from your own system."],
    ],
    usesTitle: "Use cases",
    uses: [
      "An order confirmation or status update sent as a template Meta has approved.",
      "An appointment reminder, after Meta has approved the template wording.",
      "A CRM or website that stays on its own stack, without putting Meta's access token in your code.",
    ],
    cta: "Start for $29",
    plans: "Pricing on the API site",
    demoTitle: "Live demonstration",
    demoText: "whatsapp.bizuply.com shows a sample request, response, and conversation screen. It is an illustration, not a live transaction.",
    demoLink: "Open the demonstration",
    faqTitle: "Before you start",
    faq: [
      ["What does the $29 cover?", "The subscription for one connected WhatsApp number: onboarding, the API and webhooks, templates, the dashboard, and documentation. Another number needs its own subscription."],
      ["Is there a free trial?", "No. The subscription starts at $29 per month for one number."],
      ["Are Meta charges included?", "No. Meta bills by the recipient's country and the message category, separately from the Bizuply subscription."],
      ["Can one screen manage many clients?", "Not yet. Each number has its own subscription, API key, and webhook."],
    ],
    relatedTitle: "Related products",
  },
};

export default function WhatsAppApiProductPage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const hebrew = locale === "he";
  const localized = locale === "en" || locale === "he" ? null : getLocaleMarketingPage("/whatsapp-api", locale);
  const copy = hebrew ? COPY.he : COPY.en;
  const dir = getTextDirection(locale);

  useEffect(() => {
    document.title = localized?.title || copy.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", localized?.description || copy.description);
  }, [copy.title, copy.description, localized]);

  if (localized) {
    return (
      <main className="pm" dir={dir} lang={locale === "pt-BR" ? "pt-BR" : locale}>
        <Helmet>
          <title>{localized.title}</title>
          <meta name="description" content={localized.description} />
          <link rel="canonical" href={marketingPublicUrl("/whatsapp-api", locale)} />
        </Helmet>
        <section className="pm-section">
          <div className="pm-shell">
            <p className="pm-eyebrow">WhatsApp Cloud API</p>
            <h1 className="pm-title">{localized.h1}</h1>
            {localized.paragraphs.map((paragraph) => <p className="pm-lead" key={paragraph.slice(0, 24)}>{paragraph}</p>)}
            <WhatsAppStatusIllustration locale={locale} />
            <div className="crm-hero__actions">
              <a className="pm-cta pm-cta--primary" href="https://whatsapp.bizuply.com/get-started">$29</a>
              <Link className="pm-cta pm-cta--ghost" to="/pricing">{locale === "es" ? "Precios" : locale === "ar" ? "الأسعار" : "Preços"}</Link>
            </div>
          </div>
        </section>
        <section className="pm-section">
          <div className="pm-shell">
            <FaqAccordion items={(localized.faq || []).map(([q, a]) => ({ q, a }))} />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pm" dir={dir} lang={hebrew ? "he" : "en"}>
      <Helmet>
        <title>{copy.title}</title>
        <meta name="description" content={copy.description} />
        <link rel="canonical" href={marketingPublicUrl("/whatsapp-api", i18n.language)} />
      </Helmet>

      <section className="pm-section">
        <div className="pm-shell">
          <p className="pm-eyebrow">WhatsApp Cloud API</p>
          <h1 className="pm-title">{copy.h1}</h1>
          <p className="pm-lead">{copy.lead}</p>
          <p className="pm-spot__title">{copy.price}</p>
          <p className="pm-spot__text">{copy.metaFees}</p>
          <WhatsAppStatusIllustration locale={locale} />
          <div className="crm-hero__actions">
            <a className="pm-cta pm-cta--primary" href="https://whatsapp.bizuply.com/get-started">{copy.cta}</a>
            <a className="pm-cta pm-cta--ghost" href="https://whatsapp.bizuply.com/pricing">{copy.plans}</a>
          </div>
        </div>
      </section>

      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading title={copy.audiencesTitle} />
          <div className="pm-grid pm-grid--3">
            {copy.audiences.map(([title, text]) => (
              <SpotlightCard key={title}>
                <h2 className="pm-spot__title">{title}</h2>
                <p className="pm-spot__text">{text}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading title={copy.capabilitiesTitle} />
          <div className="pm-grid pm-grid--2">
            {copy.capabilities.map(([title, text], index) => (
              <SpotlightCard key={title} goldIndex={index}>
                <h2 className="pm-spot__title">{title}</h2>
                <p className="pm-spot__text">{text}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading title={copy.startTitle} />
          <ol className="pm-grid pm-grid--3">
            {copy.steps.map(([title, text], index) => (
              <SpotlightCard key={title} as="li" goldIndex={index}>
                <h2 className="pm-spot__title">{index + 1}. {title}</h2>
                <p className="pm-spot__text">{text}</p>
              </SpotlightCard>
            ))}
          </ol>
        </div>
      </section>

      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading title={copy.usesTitle} />
          <div className="pm-grid pm-grid--3">
            {copy.uses.map((item) => (
              <SpotlightCard key={item}>
                <p className="pm-spot__text">{item}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading title={copy.demoTitle} lead={copy.demoText} />
          <a className="pm-cta pm-cta--ghost" href="https://whatsapp.bizuply.com/">{copy.demoLink}</a>
        </div>
      </section>

      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading title={copy.faqTitle} />
          <FaqAccordion items={copy.faq.map(([q, a]) => ({ q, a }))} />
        </div>
      </section>

      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading title={copy.relatedTitle} />
          <div className="pm-grid pm-grid--2">
            {[
              ["/crm", "CRM"],
              ["/automations", hebrew ? "אוטומציות" : "Automations"],
              ["/appointments", hebrew ? "תורים" : "Appointments"],
            ].map(([to, label]) => (
              <SpotlightCard key={to}>
                <h2 className="pm-spot__title"><Link to={to}>{label}</Link></h2>
              </SpotlightCard>
            ))}
            <SpotlightCard>
              <h2 className="pm-spot__title"><a href="https://whatsapp.bizuply.com/">whatsapp.bizuply.com</a></h2>
            </SpotlightCard>
          </div>
        </div>
      </section>
    </main>
  );
}

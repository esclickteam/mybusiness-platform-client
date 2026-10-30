import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductDemoVideo from "../../../../components/product-marketing/ProductDemoVideo";
import { coerceSupportedLanguage } from "../../../../i18n/localeUtils";
import { SiteLink } from "../siteConfig";
import { Accordion, SectionHead } from "../ui";

type Section = { id: string; title: string; paragraphs: string[]; steps?: string[] };

type Copy = {
  eyebrow: string;
  title: string;
  lead: string;
  start: string;
  demoCaption: string;
  sections: Section[];
  faq: Array<{ q: string; a: string }>;
};

const EN: Copy = {
  eyebrow: "How it works in Bizuply",
  title: "Connect a number, then use WhatsApp from Bizuply.",
  lead: "These guides match the product as it ships today: $29/month per connected number, Meta messaging fees billed separately, and no free trial. Nothing here is a live send.",
  start: "Start for $29",
  demoCaption: "Product recording from the Bizuply WhatsApp workspace. The demo labels messages as not sent.",
  sections: [
    {
      id: "connect",
      title: "How to connect WhatsApp Business Platform",
      paragraphs: [
        "Pay $29/month for one number on Get Started, then open WhatsApp → Connection in the portal.",
        "Meta Embedded Signup asks you to choose or create a Meta Business account and a WhatsApp Business Account, then verify the number by SMS or voice call.",
        "Meta still reviews the display name and may ask for business verification. Bizuply does not add its own approval queue and cannot skip Meta's checks.",
        "If the number is already in the WhatsApp or WhatsApp Business app, email support@bizuply.com before you connect. Do not disconnect a live customer number without a plan.",
      ],
      steps: [
        "Create the WhatsApp API account and complete checkout.",
        "Open WhatsApp → Connection and start Embedded Signup.",
        "Verify the number and wait for Meta's display-name review.",
        "Add a payment method in Meta for messaging charges.",
      ],
    },
    {
      id: "inbox",
      title: "How to manage conversations in Bizuply",
      paragraphs: [
        "Customer replies open in the Bizuply WhatsApp inbox. They are not forwarded to external webhooks yet.",
        "Inside the 24-hour customer-service window you can reply from the inbox. Starting a conversation outside that window needs an approved template.",
        "Each workspace holds one number. An agency managing several clients needs a workspace, subscription and API key per number.",
      ],
    },
    {
      id: "crm",
      title: "How CRM and leads work with WhatsApp",
      paragraphs: [
        "The CRM plan is $49/month and is separate from WhatsApp. A lead keeps a source, one of six statuses, notes, tasks and a WhatsApp log.",
        "Leads can arrive from Meta Lead Ads, a Bizuply website form, or Google Ads lead forms. Staff then set the next step on the record.",
        "WhatsApp does not replace the CRM. A send uses a paid number and an approved template, and Meta bills the message.",
      ],
    },
    {
      id: "automations",
      title: "How automations send WhatsApp",
      paragraphs: [
        "Automations are on the business plan ($99/month or $990/year). A trigger such as a new lead or a status change can create a task or start a WhatsApp action.",
        "A WhatsApp action still needs a connected $29 number and a template Meta has approved. The product demo saves the automation and does not send a live message.",
      ],
    },
    {
      id: "templates",
      title: "How approved message templates work",
      paragraphs: [
        "Create the template under WhatsApp → Templates and submit it to Meta. Pending and rejected templates cannot be sent.",
        "The API lists only APPROVED templates. variables[0] fills {{1}}, and so on.",
        "Use Connection to send a test to a number you own after you confirm consent. Meta may charge for that send.",
      ],
    },
    {
      id: "app-vs-api",
      title: "WhatsApp app versus WhatsApp API",
      paragraphs: [
        "The WhatsApp Business app on a phone is for one person tapping messages. The Cloud API (this product) lets a CRM, website or backend send approved templates and share an inbox.",
        "A number on the phone app may need to be migrated or removed before Cloud API registration. Check with support before you move a live number.",
        "Quality ratings, messaging limits and opt-in rules are Meta's. Bizuply shows the live status in Connection.",
      ],
    },
    {
      id: "costs",
      title: "Which extra costs can apply",
      paragraphs: [
        "Bizuply: $29/month per connected number. No trial. Taxes may be added at checkout.",
        "Meta: per-template charges by recipient country and category (marketing, utility, authentication, service). Billed to the payment method on the WhatsApp Business Account.",
        "CRM ($49) and the business plan ($99/$990) are optional and separate. Media spend on Meta ads is also separate.",
        "Estimate Meta rates on the Pricing calculator. Meta's invoice is final.",
      ],
    },
  ],
  faq: [
    { q: "Do I need the CRM plan to use WhatsApp API?", a: "No. WhatsApp API is $29/month per number on its own. CRM and automations are separate products if you want them." },
    { q: "Can I test without messaging a customer?", a: "Use Send test webhook under API / Developers. A template test on Connection goes to a real phone and Meta may charge it." },
  ],
};

const HE: Copy = {
  eyebrow: "איך זה עובד בביזאפלי",
  title: "מחברים מספר, ואז עובדים בוואטסאפ מתוך ביזאפלי.",
  lead: "המדריכים האלה תואמים את המוצר כפי שהוא היום: 29 דולר לחודש למספר מחובר, חיובי ההודעות של Meta בנפרד, ואין ניסיון חינם. אין כאן שליחה חיה.",
  start: "התחילו ב־29 דולר",
  demoCaption: "הקלטה מתוך סביבת הוואטסאפ של ביזאפלי. בהדגמה ההודעות מסומנות כלא נשלחו.",
  sections: [
    {
      id: "connect",
      title: "איך מחברים את WhatsApp Business Platform",
      paragraphs: [
        "משלמים 29 דולר לחודש למספר אחד בעמוד ההתחלה, ואז פותחים וואטסאפ → חיבור בפורטל.",
        "Meta Embedded Signup מבקש לבחור או ליצור חשבון Meta Business וחשבון WhatsApp Business, ואז לאמת את המספר ב־SMS או בשיחה.",
        "Meta עדיין בודקת את שם התצוגה ועשויה לבקש אימות עסק. ביזאפלי לא מוסיפה תור אישורים משלה ולא יכולה לדלג על בדיקות Meta.",
        "אם המספר כבר באפליקציית וואטסאפ, כותבים ל־support@bizuply.com לפני החיבור. לא מנתקים מספר חי של לקוח בלי תכנון.",
      ],
      steps: [
        "יוצרים חשבון WhatsApp API ומשלימים תשלום.",
        "פותחים וואטסאפ → חיבור ומתחילים Embedded Signup.",
        "מאמתים את המספר וממתינים לסקירת שם התצוגה של Meta.",
        "מוסיפים אמצעי תשלום ב־Meta לחיובי ההודעות.",
      ],
    },
    {
      id: "inbox",
      title: "איך מנהלים שיחות בביזאפלי",
      paragraphs: [
        "תשובות לקוחות נפתחות בתיבת הוואטסאפ של ביזאפלי. הן עדיין לא מועברות ל־webhooks חיצוניים.",
        "בתוך חלון 24 השעות אפשר לענות מהתיבה. פתיחת שיחה מחוץ לחלון דורשת תבנית מאושרת.",
        "כל סביבת עבודה מחזיקה מספר אחד. סוכנות עם כמה לקוחות צריכה סביבה, מנוי ומפתח לכל מספר.",
      ],
    },
    {
      id: "crm",
      title: "איך עובדים עם CRM ולידים",
      paragraphs: [
        "מסלול ה־CRM הוא 49 דולר לחודש, ונפרד מוואטסאפ. לליד יש מקור, אחד משישה סטטוסים, הערות, משימות ויומן וואטסאפ.",
        "לידים יכולים להגיע ממודעות לידים של Meta, מטופס באתר ביזאפלי או מטפסי Google Ads.",
        "וואטסאפ לא מחליף את ה־CRM. שליחה משתמשת במספר בתשלום ובתבנית מאושרת, ו־Meta מחייבת את ההודעה.",
      ],
    },
    {
      id: "automations",
      title: "איך מפעילים אוטומציות",
      paragraphs: [
        "אוטומציות בחבילה העסקית (99 דולר לחודש או 990 לשנה). טריגר כמו ליד חדש או שינוי סטטוס יכול ליצור משימה או פעולת וואטסאפ.",
        "פעולת וואטסאפ עדיין דורשת מספר ב־29 דולר ותבנית ש־Meta אישרה. בהדגמה האוטומציה נשמרת ולא נשלחת הודעה חיה.",
      ],
    },
    {
      id: "templates",
      title: "איך משתמשים בתבניות מאושרות",
      paragraphs: [
        "יוצרים תבנית תחת וואטסאפ → תבניות ושולחים ל־Meta. תבניות ממתינות או שנדחו לא נשלחות.",
        "ה־API מחזיר רק תבניות APPROVED. variables[0] ממלא את {{1}}, וכן הלאה.",
        "במסך החיבור שולחים בדיקה למספר שבבעלותכם אחרי אישור הסכמה. Meta עשויה לחייב.",
      ],
    },
    {
      id: "app-vs-api",
      title: "מה ההבדל בין וואטסאפ רגיל ל־API",
      paragraphs: [
        "אפליקציית WhatsApp Business בטלפון מיועדת לאדם אחד. ה־Cloud API מאפשר ל־CRM, לאתר או לשרת לשלוח תבניות מאושרות ולשתף תיבה.",
        "מספר באפליקציה עשוי לדרוש העברה או הסרה לפני רישום ל־Cloud API. בודקים עם התמיכה לפני שמזיזים מספר חי.",
        "דירוג איכות, מגבלות הודעות והסכמה הם של Meta. ביזאפלי מציגה את הסטטוס החי בחיבור.",
      ],
    },
    {
      id: "costs",
      title: "אילו עלויות נוספות עשויות לחול",
      paragraphs: [
        "ביזאפלי: 29 דולר לחודש למספר מחובר. אין ניסיון. ייתכן מס בקופה.",
        "Meta: חיוב לפי מדינת הנמען וקטגוריית התבנית. מחויב לאמצעי התשלום בחשבון WhatsApp Business.",
        "CRM (49) והחבילה העסקית (99/990) אופציונליים ונפרדים. הוצאת מודעות גם היא נפרדת.",
        "מעריכים תעריפי Meta במחשבון המחירים. החשבונית של Meta היא הקובעת.",
      ],
    },
  ],
  faq: [
    { q: "צריך את מסלול ה־CRM כדי להשתמש ב־WhatsApp API?", a: "לא. WhatsApp API הוא 29 דולר לחודש למספר בפני עצמו. CRM ואוטומציות הם מוצרים נפרדים." },
    { q: "אפשר לבדוק בלי לשלוח ללקוח?", a: "משתמשים ב־Send test webhook תחת API / מפתחים. בדיקת תבנית בחיבור הולכת לטלפון אמיתי ו־Meta עשויה לחייב." },
  ],
};

export default function GuidesPage() {
  const { i18n } = useTranslation();
  const lang = coerceSupportedLanguage(i18n.language);
  const copy = lang === "he" ? HE : EN;
  const Arrow = lang === "he" ? ArrowLeft : ArrowRight;
  return (
    <>
      <section className="wa-page-hero">
        <div className="wa-wrap">
          <SectionHead as="h1" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
          <div className="wa-actions">
            <SiteLink to="/get-started" className="wa-btn wa-btn-primary wa-btn-lg">
              {copy.start} <Arrow size={16} aria-hidden="true" />
            </SiteLink>
            <SiteLink to="/pricing" className="wa-btn wa-btn-ghost wa-btn-lg">
              {lang === "he" ? "מחירים ועלויות Meta" : "Pricing and Meta costs"}
            </SiteLink>
          </div>
        </div>
      </section>

      <section className="wa-section is-tight">
        <div className="wa-wrap" style={{ maxWidth: 760 }}>
          <p className="wa-fine">{copy.demoCaption}</p>
          <ProductDemoVideo moduleId="whatsapp" />
        </div>
      </section>

      {copy.sections.map((section) => (
        <section key={section.id} className="wa-section is-tight" id={section.id} aria-labelledby={`wa-guide-${section.id}`}>
          <div className="wa-wrap" style={{ maxWidth: 760 }}>
            <h2 id={`wa-guide-${section.id}`} className="wa-h2">{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="wa-lead" style={{ marginTop: 12 }}>{p}</p>
            ))}
            {section.steps ? (
              <ol className="wa-steps" style={{ marginTop: 20 }}>
                {section.steps.map((step, index) => (
                  <li className="wa-step" key={step}>
                    <span className="wa-step-n" aria-hidden="true">0{index + 1}</span>
                    <div className="wa-step-body"><p>{step}</p></div>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>
      ))}

      <section className="wa-section is-band">
        <div className="wa-wrap" style={{ maxWidth: 760 }}>
          <SectionHead
            eyebrow={lang === "he" ? "שאלות" : "Questions"}
            title={lang === "he" ? "תשובות קצרות." : "Short answers."}
          />
          <Accordion items={copy.faq} defaultOpen={0} />
        </div>
      </section>
    </>
  );
}

import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BellRing,
  CalendarClock,
  ChevronLeft,
  Clock,
  Filter,
  Gauge,
  Images,
  ListChecks,
  PlugZap,
  Search,
  UserRound,
  Workflow,
  Zap,
} from "lucide-react";
import CrmProductHero from "../../components/crm-marketing/CrmProductHero";
import CrmScreenshotTour from "../../components/crm-marketing/CrmScreenshotTour";
import CrmIntegrationRail from "../../components/crm-marketing/CrmIntegrationRail";
import CrmMetaTrust from "../../components/crm-marketing/CrmMetaTrust";
import {
  crmFaq,
  pipelineStages,
} from "../../components/crm-marketing/crmMarketingData";
import {
  AuroraBackdrop,
  FaqAccordion,
  FinalCta,
  Reveal,
  ScrollProgress,
  SectionHeading,
  SpotlightCard,
  Stagger,
  StaggerItem,
} from "../../components/product-marketing";
import "../../components/product-marketing/marketingKit.css";
import "../../components/crm-marketing/CrmProductHero.css";
import "./crmProductPage.css";

const SEO_TITLE = "CRM ולידים מ־Meta | BizUply — Meta App Review Developers";
const SEO_DESCRIPTION =
  "BizUply הם מפתחי Meta שעברו App Review. חברו Facebook Lead Ads ל־CRM ונהלו לידים, לקוחות ופגישות במקום אחד.";

const MODULE_CARDS = [
  {
    icon: ListChecks,
    accent: "#7c3aed",
    title: "כרטיס ליד שמספר את כל הסיפור",
    text: "פרטי הפנייה וכל שדות הטופס, תיעוד של הערות, שיחות ווואטסאפ, שינויי סטטוס אוטומטיים, ומשימה עם תאריך ושעה.",
    tags: ["הערה", "שיחה", "וואטסאפ", "משימה"],
  },
  {
    icon: UserRound,
    accent: "#2563eb",
    title: "תיק לקוח מלא",
    text: "פרטי קשר, סטטוס שנגזר מהיסטוריית הפגישות, סך ההכנסות, תיעוד עם שבעה סוגי רשומות והעלאת מסמכים.",
    tags: ["פגישה", "קובץ", "הסכם", "שדות מותאמים"],
  },
  {
    icon: CalendarClock,
    accent: "#0891b2",
    title: "יומן שמחשב לבד מה פנוי",
    text: "החלונות הפנויים נגזרים משעות הפעילות וממשך השירות בקפיצות של 15 דקות, והתור נשמר עם מחיר וסטטוס תשלום.",
    tags: ["לוח חודשי", "היום", "עתידי"],
  },
  {
    icon: Clock,
    accent: "#059669",
    title: "שירותים ושעות פעילות",
    text: "קטלוג שירותים עם שם, תיאור, משך, מחיר ותמונה, ולוח שבועי של שעות פעילות — שמזינים גם את היומן וגם את עמוד הזימון ללקוחות.",
    tags: ["קטלוג שירותים", "שעות פעילות"],
  },
  {
    icon: BellRing,
    accent: "#f59e0b",
    title: "התראות שלא נותנות לפספס",
    text: "ליד חדש נכנס ומופיע בהתראות מיד, ומשימה שעבר זמנה עולה למרכז ההתראות עד שמסמנים אותה כבוצעה.",
    tags: ["לידים חדשים", "משימות שעבר זמנן"],
  },
  {
    icon: Gauge,
    accent: "#4f46e5",
    title: "תמונת מצב בלוח הבקרה",
    text: "לידים חדשים, לידים שלא טופלו, שינוי מול התקופה הקודמת, טבלת הלידים האחרונים והפגישות הקרובות.",
    tags: ["KPI", "לידים אחרונים", "פגישות קרובות"],
  },
];

const LIST_CARDS = [
  {
    icon: Search,
    accent: "#6d28d9",
    title: "חיפוש שמוצא כל פנייה",
    text: "חיפוש חופשי על שם, טלפון, אימייל, מקור וגם על השדות שהגיעו מהטופס עצמו.",
    tags: ["שם", "טלפון", "אימייל", "שדות טופס"],
  },
  {
    icon: Filter,
    accent: "#2563eb",
    title: "סינון לפי סטטוס ומקור",
    text: "מצמצמים את הרשימה לסטטוס אחד או לערוץ אחד — Meta, Google או האתר שלכם.",
    tags: ["5 סטטוסים", "Meta", "Google", "אתר"],
  },
  {
    icon: Images,
    accent: "#0891b2",
    title: "רשימה שמחזיקה נפח",
    text: "50 לידים בעמוד עם עימוד, וקיבוץ לפי תאריך הפנייה — כדי לראות מה נכנס היום ומה מחכה מאתמול.",
    tags: ["50 בעמוד", "קיבוץ לפי תאריך"],
  },
];

export default function CrmProductPage() {
  return (
    <div className="pm crm-page crmp" dir="rtl">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <link rel="canonical" href="https://bizuply.com/crm" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
        <link rel="preload" as="image" href="/leads1.jpeg" />
      </Helmet>

      <ScrollProgress />

      <CrmProductHero />

      {/* The five real lead statuses */}
      <section className="pm-section pm-section--tight crx">
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <ListChecks size={14} aria-hidden="true" />
                צינור הלידים
              </>
            }
            title={
              <>
                חמישה סטטוסים, <span className="pm-grad">תמונה אחת ברורה</span>
              </>
            }
            lead="כל ליד מחזיק סטטוס אחד, וכל שינוי סטטוס נרשם אוטומטית בציר הזמן שלו — כך שרואים מתי הוא זז ולאן."
          />

          <Reveal from="up" delay={0.1}>
            <ol className="crx-pipeline">
              {pipelineStages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <li
                    style={{ "--crx-accent": stage.accent }}
                  >
                    {stage.label}
                  </li>
                  {index < pipelineStages.length - 1 ? (
                    <ChevronLeft
                      className="crx-pipeline__arrow"
                      size={18}
                      aria-hidden="true"
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </ol>
          </Reveal>

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {LIST_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <StaggerItem key={card.title}>
                  <SpotlightCard accent={card.accent}>
                    <span className="pm-spot__icon">
                      <Icon size={19} />
                    </span>
                    <h3 className="pm-spot__title">{card.title}</h3>
                    <p className="pm-spot__text">{card.text}</p>
                    <ul className="pm-spot__tags">
                      {card.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Real captures from the dashboard */}
      <section className="pm-section crx crmp__shots">
        <AuroraBackdrop />
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <Images size={14} aria-hidden="true" />
                מתוך המערכת
              </>
            }
            title={
              <>
                לא הדמיה — <span className="pm-grad">המסכים האמיתיים</span>
              </>
            }
            lead="לידים, לקוחות ופגישות: שלושת המודולים שאתם עובדים איתם בפועל, בדיוק כפי שהם נראים בלוח הבקרה של העסק."
          />

          <CrmScreenshotTour />
        </div>
      </section>

      <CrmIntegrationRail />

      {/* What each module holds */}
      <section className="pm-section crx">
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <PlugZap size={14} aria-hidden="true" />
                מה יש בכל מודול
              </>
            }
            title={
              <>
                מהפנייה הראשונה ועד{" "}
                <span className="pm-grad">התור הבא ביומן</span>
              </>
            }
            lead="כרטיס ליד, תיק לקוח, יומן תורים וקטלוג שירותים — מודולים שמדברים ביניהם, בלי לייצא ולייבא כלום."
          />

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {MODULE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <StaggerItem key={card.title}>
                  <SpotlightCard accent={card.accent}>
                    <span className="pm-spot__icon">
                      <Icon size={19} />
                    </span>
                    <h3 className="pm-spot__title">{card.title}</h3>
                    <p className="pm-spot__text">{card.text}</p>
                    <ul className="pm-spot__tags">
                      {card.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <CrmMetaTrust />

      {/* Automations — lives under CRM in the product story */}
      <section className="pm-section pm-section--tight crx crmp__automations">
        <AuroraBackdrop />
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <Workflow size={14} aria-hidden="true" />
                אוטומציות בתוך ה־CRM
              </>
            }
            title={
              <>
                אחרי שהליד נכנס —{" "}
                <span className="pm-grad">המערכת ממשיכה בשבילכם</span>
              </>
            }
            lead="תזכורות, פולואפים והתראות על לידים חדשים ומשימות שעבר זמנן — רצים ברקע ומחוברים לאותו צינור לידים."
          />

          <Reveal from="up" delay={0.1}>
            <div className="crmp__auto-card">
              <span className="crmp__auto-icon" aria-hidden="true">
                <Zap size={22} />
              </span>
              <div>
                <h3>אוטומציות והתראות חכמות</h3>
                <p>
                  ליד חדש מופיע בהתראות מיד, משימה שעבר זמנה עולה למרכז ההתראות,
                  ופולואפים נשארים על המסך עד שמטפלים — בלי לרדוף אחרי פתקים.
                </p>
              </div>
              <Link to="/automations" className="pm-cta pm-cta--primary">
                לעמוד האוטומציות
                <ArrowLeft size={17} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ + closing */}
      <section className="pm-section pm-section--tight crx">
        <div className="pm-shell">
          <SectionHeading eyebrow="שאלות נפוצות" title="מה שחשוב לדעת על ה־CRM" />
          <FaqAccordion items={crmFaq} />

          <div className="crmp__final">
            <FinalCta
              eyebrow="מתחילים לסדר את הצינור"
              title="סדרו את צינור הלידים — ואל תפספסו אף פנייה"
              text="מחברים את מקורות הלידים, עובדים בסטטוסים ובמשימות, וממשיכים לתיק לקוח וליומן תורים. הכל באפליקציית Meta שעברה App Review."
              primaryLabel="מתחילים בחינם"
              secondaryLabel="דברו איתנו"
              secondaryTo="/contact"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

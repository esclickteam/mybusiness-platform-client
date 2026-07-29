import React from "react";
import { Helmet } from "react-helmet-async";
import {
  BellRing,
  Filter,
  Gauge,
  Images,
  LayoutList,
  MessageCircle,
  Radar,
  Search,
  Sparkles,
} from "lucide-react";
import CrmProductHero from "../../components/crm-marketing/CrmProductHero";
import CrmLiveConsole from "../../components/crm-marketing/CrmLiveConsole";
import CrmIntegrationRail from "../../components/crm-marketing/CrmIntegrationRail";
import CrmTopicSections from "../../components/crm-marketing/CrmTopicSections";
import CrmCapabilityShowcase from "../../components/crm-marketing/CrmCapabilityShowcase";
import CrmMetaTrust from "../../components/crm-marketing/CrmMetaTrust";
import { crmFaq } from "../../components/crm-marketing/crmMarketingData";
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

const CONSOLE_CARDS = [
  {
    icon: Search,
    accent: "#7c3aed",
    title: "חיפוש שמוצא כל פנייה",
    text: "חיפוש חופשי על שם, טלפון, אימייל, מקור וגם על השדות שהגיעו מהטופס עצמו — כולל נתוני הקמפיין.",
    tags: ["שם", "טלפון", "אימייל", "שדות טופס"],
  },
  {
    icon: Filter,
    accent: "#2563eb",
    title: "סינון לפי סטטוס ומקור",
    text: "מצמצמים את הרשימה לסטטוס אחד או לערוץ אחד — Meta, Google או אתר — כדי לעבוד על מה שחשוב עכשיו.",
    tags: ["5 סטטוסים", "Meta", "Google", "אתר"],
  },
  {
    icon: LayoutList,
    accent: "#0891b2",
    title: "רשימה שמחזיקה נפח",
    text: "50 לידים בעמוד עם עימוד, וקיבוץ לפי תאריך הפנייה — כדי לראות מה נכנס היום ומה מחכה מאתמול.",
    tags: ["50 בעמוד", "קיבוץ לפי תאריך"],
  },
  {
    icon: BellRing,
    accent: "#f59e0b",
    title: "התראות בזמן אמת",
    text: "ליד חדש נכנס — ומופיע בהתראות מיד. משימה שעבר זמנה עולה למרכז ההתראות עד שמסמנים אותה כבוצעה.",
    tags: ["לידים חדשים", "משימות שעבר זמנן"],
  },
  {
    icon: MessageCircle,
    accent: "#16a34a",
    title: "וואטסאפ וטלפון בלחיצה",
    text: "מהרשימה ומכרטיס הליד יוצאים ישר לשיחה או לוואטסאפ, ומתעדים את מה שקרה באותו מקום.",
    tags: ["WhatsApp", "שיחה", "תיעוד"],
  },
  {
    icon: Gauge,
    accent: "#4f46e5",
    title: "תמונת מצב בלוח הבקרה",
    text: "לידים חדשים, לידים שלא טופלו, שינוי מול התקופה הקודמת, טבלת הלידים האחרונים והפגישות הקרובות.",
    tags: ["KPI", "לידים אחרונים", "פגישות קרובות"],
  },
];

const SEO_TITLE = "CRM ולידים מ־Meta | BizUply — Meta App Review Developers";
const SEO_DESCRIPTION =
  "BizUply הם מפתחי Meta שעברו App Review. חברו Facebook Lead Ads ל־CRM ונהלו לידים, לקוחות ופגישות במקום אחד.";

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

      {/* The leads console, animated */}
      <section
        className="pm-section pm-section--dark crmp__console"
        style={{ "--pm-seam-top": "#f5f7fb", "--pm-seam-bottom": "#f5f7fb" }}
      >
        <AuroraBackdrop vivid dark grain />
        <div className="pm-shell">
          <SectionHeading
            center
            accent="#c4b5fd"
            eyebrow={
              <>
                <Radar size={14} aria-hidden="true" />
                צינור הלידים
              </>
            }
            title={
              <>
                ליד נכנס, זז בין סטטוסים{" "}
                <span className="pm-grad">ולא נשכח</span>
              </>
            }
            lead="ככה נראה יום עבודה במערכת: פנייה חדשה מהקמפיין נכנסת לצינור, מתעדים שיחה, פותחים משימה עם תאריך, וכשהליד מומר הוא ממשיך כלקוח עם פגישה ביומן."
          />

          <Reveal from="up" delay={0.12} className="crmp__console-frame">
            <CrmLiveConsole />
          </Reveal>

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {CONSOLE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <StaggerItem key={card.title}>
                  <SpotlightCard accent={card.accent} dark>
                    <span className="pm-spot__icon">
                      <Icon size={18} />
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

      <CrmIntegrationRail />

      {/* Real product screenshots */}
      <section className="pm-section pm-section--tight crmp__shots">
        <AuroraBackdrop beam={false} />
        <div className="pm-shell">
          <SectionHeading
            center
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
            lead="לידים, לקוחות ופגישות — שלושת המודולים שאתם עובדים איתם בפועל, בדיוק כפי שהם נראים בלוח הבקרה של העסק."
          />
        </div>
        <CrmTopicSections />
      </section>

      {/* Deep-dive rail */}
      <section className="pm-section crmp__capabilities">
        <div className="pm-shell">
          <SectionHeading
            center
            eyebrow={
              <>
                <Sparkles size={14} aria-hidden="true" />
                מה יש בכל מודול
              </>
            }
            title={
              <>
                מהפנייה הראשונה ועד{" "}
                <span className="pm-grad">התור הבא ביומן</span>
              </>
            }
            lead="כרטיס ליד, תיק לקוח, יומן תורים וקטלוג שירותים — ארבעה מודולים שמדברים ביניהם, בלי לייצא ולייבא כלום."
          />

          <div className="crmp__capabilities-inner">
            <CrmCapabilityShowcase />
          </div>
        </div>
      </section>

      <CrmMetaTrust />

      {/* FAQ + closing */}
      <section className="pm-section pm-section--tight crmp__faq">
        <div className="pm-shell">
          <SectionHeading
            center
            eyebrow="שאלות נפוצות"
            title="מה שחשוב לדעת על ה־CRM"
          />
          <div className="crmp__faq-inner">
            <FaqAccordion items={crmFaq} />
          </div>

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

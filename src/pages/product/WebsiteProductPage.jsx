import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Code2,
  History,
  Layers,
  Library,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  Share2,
  Sparkles,
} from "lucide-react";
import WebsiteBuilderHero from "../../components/website-builder-marketing/WebsiteBuilderHero";
import WebsiteTemplateLibrary from "../../components/website-builder-marketing/WebsiteTemplateLibrary";
import WebsiteSeoSection from "../../components/website-builder-marketing/WebsiteSeoSection";
import WebsiteEcosystem from "../../components/website-builder-marketing/WebsiteEcosystem";
import WebsiteLaunchFlow from "../../components/website-builder-marketing/WebsiteLaunchFlow";
import { websiteFaq } from "../../components/website-builder-marketing/websiteMarketingData";
import {
  AuroraBackdrop,
  FaqAccordion,
  FinalCta,
  ScrollProgress,
  SectionHeading,
  SpotlightCard,
  Stagger,
  StaggerItem,
} from "../../components/product-marketing";
import "../../components/product-marketing/marketingKit.css";
import "./websiteProductPage.css";

const SEO_TITLE = "בניית אתרים מקצועיים | BizUply";
const SEO_DESCRIPTION =
  "בונים אתר, חנות או אתר עם זימון תורים מתוך 205 תבניות, עורכים בעורך ויזואלי ומפרסמים לדומיין שלכם — כשכל פנייה מהאתר נכנסת ל־CRM.";

const EDITOR_CARDS = [
  {
    icon: MousePointerClick,
    accent: "#e11d8c",
    title: "עריכה במקום",
    text: "לוחצים על כותרת, טקסט או תמונה ומשנים אותם ישר על הקנבס, עם סרגל עריכה צף ותפריט הקשר.",
    tags: ["טקסט", "תמונות", "כפתורים"],
  },
  {
    icon: Palette,
    accent: "#7c3aed",
    title: "פאנל עיצוב מלא",
    text: "שש לשוניות שליטה — תוכן, עיצוב, פריסה, מדיה, תנועה ומתקדם: צבעים, טיפוגרפיה, מרווחים ואנימציות.",
    tags: ["צבעים", "טיפוגרפיה", "אנימציות"],
  },
  {
    icon: Layers,
    accent: "#4f46e5",
    title: "מבנה שאתם קובעים",
    text: "פאנל שכבות עם גרירה לסידור הסקשנים, הוספת עמודים ותתי־עמודים, קביעת עמוד בית ותפריט שמתעדכן לבד.",
    tags: ["גרירת סקשנים", "עמודים", "תפריט"],
  },
  {
    icon: Library,
    accent: "#0891b2",
    title: "ספריות תוכן",
    text: "140 עמודים מוכנים וקטלוג סקשנים לפי קטגוריה, בונה טפסים וספריית מדיה עם חיפוש תמונות — הכל בתוך העורך.",
    tags: ["140 עמודים", "סקשנים", "מדיה"],
  },
  {
    icon: MonitorSmartphone,
    accent: "#059669",
    title: "דסקטופ, טאבלט ומובייל",
    text: "עוברים בין מצבי תצוגה ומכוונים את העיצוב לכל מכשיר, כולל תפריט מובייל שמותאם באתר שפורסם.",
    tags: ["רספונסיבי", "תפריט מובייל"],
  },
  {
    icon: History,
    accent: "#f59e0b",
    title: "80 צעדי ביטול",
    text: "היסטוריית עריכה עמוקה עם ביטול וחזרה בקיצורי מקלדת, כדי להתנסות בלי לפחד לשבור.",
    tags: ["Undo", "Redo", "קיצורי מקלדת"],
  },
  {
    icon: Code2,
    accent: "#2563eb",
    title: "קוד משלכם כשצריך",
    text: "CSS ברמת אתר או עמוד, ותגיות HTML ל־head ול־body — לפיקסלים, לסקריפטים ולהתאמות מדויקות.",
    tags: ["CSS", "HTML", "סקריפטים"],
  },
  {
    icon: Share2,
    accent: "#db2777",
    title: "עבודה עם שותפים",
    text: "מזמינים מעצב או שותף לאתר בהרשאת עריכה או צפייה, רואים מי מחובר, מסירים גישה או מעבירים בעלות.",
    tags: ["עריכה", "צפייה", "העברת בעלות"],
  },
  {
    icon: Sparkles,
    accent: "#6d28d9",
    title: "פרסום בלחיצה",
    text: "האתר עולה לאוויר לכתובת שלכם תחת sites.bizuply.com, ואפשר לחזור לטיוטה ולפרסם שוב בכל שלב.",
    tags: ["טיוטה", "פרסום", "דומיין"],
  },
];

export default function WebsiteProductPage() {
  return (
    <div dir="rtl" className="pm wbp">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <link rel="canonical" href="https://bizuply.com/website-builder" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
        <link rel="preload" as="image" href="/floriquedesk.png" />
        <link rel="preload" as="image" href="/velmoradesk.png" />
        <link rel="preload" as="image" href="/lunelledesk.png" />
      </Helmet>

      <ScrollProgress />

      <WebsiteBuilderHero />

      <WebsiteTemplateLibrary />

      {/* What the visual editor gives you */}
      <section className="pm-section wbp__editor">
        <AuroraBackdrop />
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <Palette size={14} aria-hidden="true" />
                העורך הוויזואלי
              </>
            }
            title={
              <>
                עורכים את האתר <span className="pm-grad">בלי שורת קוד</span>
              </>
            }
            lead="לוחצים על אלמנט ומשנים אותו במקום, מסדרים סקשנים בגרירה, בודקים במובייל ומפרסמים — הכל מאותו מסך, בלי מתווכים."
          />

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {EDITOR_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <StaggerItem key={card.title}>
                  <SpotlightCard accent={card.accent} goldIndex={index}>
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

      <WebsiteSeoSection />

      <WebsiteEcosystem />

      <WebsiteLaunchFlow />

      {/* FAQ + closing */}
      <section className="pm-section pm-section--tight wbp__faq">
        <div className="pm-shell">
          <SectionHeading
            eyebrow="שאלות נפוצות"
            title="מה שחשוב לדעת לפני שמתחילים"
          />
          <FaqAccordion items={websiteFaq} />

          <div className="wbp__final">
            <FinalCta
              eyebrow="מוכנים לעלות לאוויר"
              title="האתר הבא שלכם מתחיל מתבנית — ונגמר בפניות"
              text="בוחרים תבנית, עורכים אותה בעורך הוויזואלי, מוסיפים תוספים ומפרסמים. הפניות מהאתר מחכות לכם בצינור הלידים ב־CRM."
              primaryLabel="הירשמו עכשיו"
              primaryTo="/register"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

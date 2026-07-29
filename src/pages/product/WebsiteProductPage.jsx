import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Code2,
  History,
  Languages,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  Puzzle,
  Sparkles,
  Wand2,
} from "lucide-react";
import WebsiteBuilderHero from "../../components/website-builder-marketing/WebsiteBuilderHero";
import WebsiteStudioSimulator from "../../components/website-builder-marketing/WebsiteStudioSimulator";
import WebsiteCapabilityShowcase from "../../components/website-builder-marketing/WebsiteCapabilityShowcase";
import WebsiteEcosystem from "../../components/website-builder-marketing/WebsiteEcosystem";
import WebsiteLaunchFlow from "../../components/website-builder-marketing/WebsiteLaunchFlow";
import { websiteFaq } from "../../components/website-builder-marketing/websiteMarketingData";
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
import "./websiteProductPage.css";

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
    icon: MonitorSmartphone,
    accent: "#0891b2",
    title: "דסקטופ, טאבלט ומובייל",
    text: "עוברים בין מצבי תצוגה ומכוונים את העיצוב לכל מכשיר, כולל תפריט מובייל שמותאם באתר שפורסם.",
    tags: ["רספונסיבי", "תפריט מובייל"],
  },
  {
    icon: History,
    accent: "#4f46e5",
    title: "80 צעדי ביטול",
    text: "היסטוריית עריכה עמוקה עם ביטול וחזרה בקיצורי מקלדת, כדי להתנסות בלי לפחד לשבור.",
    tags: ["Undo", "Redo", "קיצורי מקלדת"],
  },
  {
    icon: Wand2,
    accent: "#f59e0b",
    title: "כלי AI לטקסט",
    text: "בחירת טקסט ובקשה לשכתב, לקצר, להרחיב או לתרגם — וגם הצעות פלטת צבעים ווריאציות לסקשן.",
    tags: ["שכתוב", "קיצור", "תרגום"],
  },
  {
    icon: Code2,
    accent: "#059669",
    title: "קוד משלכם כשצריך",
    text: "CSS ברמת אתר או עמוד, ותגיות HTML ל־head ול־body — לפיקסלים, לסקריפטים ולהתאמות מדויקות.",
    tags: ["CSS", "HTML", "סקריפטים"],
  },
];

const SEO_TITLE = "בניית אתרים מקצועיים | BizUply";
const SEO_DESCRIPTION =
  "בונים אתר, חנות או אתר עם זימון תורים מתוך 205 תבניות, עורכים בעורך ויזואלי ומפרסמים לדומיין שלכם — כשכל פנייה מהאתר נכנסת ל־CRM.";

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

      {/* The editor itself, animated */}
      <section
        className="pm-section pm-section--dark wbp__studio"
        style={{ "--pm-seam-top": "#f4f6fa", "--pm-seam-bottom": "#f7f8fc" }}
      >
        <AuroraBackdrop vivid dark grain />
        <div className="pm-shell">
          <SectionHeading
            center
            accent="#c4b5fd"
            eyebrow={
              <>
                <Sparkles size={14} aria-hidden="true" />
                העורך הוויזואלי
              </>
            }
            title={
              <>
                ככה נראית עריכה של אתר{" "}
                <span className="pm-grad">בזמן אמת</span>
              </>
            }
            lead="בוחרים סקשן, משנים צבע מיתוג, מסדרים מחדש את סדר הסקשנים, בודקים במובייל ומפרסמים. בלי קוד, בלי מתווכים, בלי לצאת מהמסך."
          />

          <Reveal from="up" delay={0.12} className="wbp__studio-frame">
            <WebsiteStudioSimulator />
          </Reveal>

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {EDITOR_CARDS.map((card) => {
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

      {/* Deep-dive rail */}
      <section className="pm-section wbp__capabilities">
        <AuroraBackdrop />
        <div className="pm-shell">
          <SectionHeading
            center
            eyebrow={
              <>
                <Puzzle size={14} aria-hidden="true" />
                כל מה שיש מתחת למכסה
              </>
            }
            title={
              <>
                מהתבנית הראשונה ועד{" "}
                <span className="pm-grad">הדומיין שלכם</span>
              </>
            }
            lead="חמישה שלבים שקורים באותה מערכת: ספריית תבניות, בנייה עם AI, ספריות סקשנים ועמודים, פאנל SEO מלא, ופרסום עם דומיין ושיתוף צוות."
          />

          <div className="wbp__capabilities-inner">
            <WebsiteCapabilityShowcase />
          </div>
        </div>
      </section>

      <WebsiteEcosystem />

      <WebsiteLaunchFlow />

      {/* FAQ + closing */}
      <section className="pm-section pm-section--tight wbp__faq">
        <div className="pm-shell">
          <SectionHeading
            center
            eyebrow={
              <>
                <Languages size={14} aria-hidden="true" />
                שאלות נפוצות
              </>
            }
            title="מה שחשוב לדעת לפני שמתחילים"
          />
          <div className="wbp__faq-inner">
            <FaqAccordion items={websiteFaq} />
          </div>

          <div className="wbp__final">
            <FinalCta
              eyebrow="מוכנים לעלות לאוויר"
              title="האתר הבא שלכם מתחיל מתבנית — ונגמר בפניות"
              text="בוחרים תבנית, עורכים אותה בעורך הוויזואלי, מוסיפים תוספים ומפרסמים. הפניות מהאתר מחכות לכם בצינור הלידים ב־CRM."
              primaryLabel="מתחילים בחינם"
              secondaryLabel="לצפייה במסלולים"
              secondaryTo="/pricing"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

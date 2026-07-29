import React from "react";
import { Helmet } from "react-helmet-async";
import {
  BellRing,
  Bot,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  ListTodo,
  RefreshCw,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import {
  AuroraBackdrop,
  CenteredProductHero,
  FaqAccordion,
  FinalCta,
  Reveal,
  ScrollProgress,
  SectionHeading,
  SpotlightCard,
  Stagger,
  StaggerItem,
} from "../../components/product-marketing";
import {
  automationRecipes,
  automationsFaq,
  automationsHeroStats,
  automationsModules,
  automationsRail,
  automationsSteps,
} from "../../components/automations-marketing/automationsMarketingData";
import AutomationsNotificationsDemo from "../../components/automations-marketing/AutomationsNotificationsDemo";
import "../../components/product-marketing/marketingKit.css";
import "../../components/product-marketing/CenteredProductHero.css";

const SEO_TITLE = "אוטומציות לעסק | BizUply";
const SEO_DESCRIPTION =
  "תזכורות, פולואפים, משימות והתראות שרצות ברקע ומחוברות ל־CRM — כדי שפחות פניות ייפלו בין הכיסאות.";

const MODULE_ICONS = [BellRing, RefreshCw, CheckCircle2, Zap, Bot, Clock3];

export default function AutomationsProductPage() {
  return (
    <div className="pm pm-hero-page" dir="rtl">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <link rel="canonical" href="https://bizuply.com/automations" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
      </Helmet>

      <ScrollProgress />

      <CenteredProductHero
        ariaLabel="אוטומציות לעסק"
        accent="cyan"
        badges={[
          { label: "רץ ברקע בשבילכם", live: true },
          {
            label: "מחובר ל־CRM",
            icon: <Workflow size={13} aria-hidden="true" />,
          },
          {
            label: "בלי סיבוך טכני",
            icon: <Sparkles size={13} aria-hidden="true" />,
          },
        ]}
        title="אוטומציות"
        titleHighlight="שעובדות בשבילכם"
        lead="תזכורות, פולואפים, משימות עם דד־ליין והתראות על לידים חדשים — תהליכים פרקטיים שרצים ברקע ומחוברים לצינור הלידים, כדי שפחות דברים ייפלו בין הכיסאות."
        note={{
          icon: <Zap size={17} aria-hidden="true" />,
          text: "לא בונים תרשימי זרימה מסובכים — בוחרים תהליך, מגדירים תנאים, מפעילים, ורואים מה הושלם ומה ממתין.",
        }}
        stats={automationsHeroStats}
      />

      {/* How it works */}
      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <Workflow size={14} aria-hidden="true" />
                איך זה עובד
              </>
            }
            title={
              <>
                מטריגר פשוט עד{" "}
                <span className="pm-grad">תוצאה מתועדת</span>
              </>
            }
            lead="ארבעה שלבים ברורים: בוחרים מה ירוץ, מגדירים מתי ולמי, מפעילים ברקע, ומשפרים לפי מה שבאמת קורה בעסק."
          />

          <div className="pmx-flow">
            {automationsSteps.map((step, index) => (
              <Reveal
                key={step.title}
                from="up"
                delay={index * 0.1}
                className="pmx-flow__node"
              >
                <span className="pmx-flow__step" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <span className="pmx-flow__tags">
                  {step.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal from="up" delay={0.12}>
            <ol className="pmx-rail" aria-label="זרימת אוטומציה">
              {automationsRail.map((item, index) => (
                <React.Fragment key={item}>
                  <li>{item}</li>
                  {index < automationsRail.length - 1 ? (
                    <ChevronLeft
                      className="pmx-rail__arrow"
                      size={18}
                      aria-hidden="true"
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <AutomationsNotificationsDemo />

      {/* Recipes */}
      <section className="pm-section">
        <AuroraBackdrop />
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <ListTodo size={14} aria-hidden="true" />
                מתכונים מוכנים
              </>
            }
            title={
              <>
                אוטומציות שמתחילות{" "}
                <span className="pm-grad">לעבוד מהיום</span>
              </>
            }
            lead="שלושה תהליכים נפוצים שכבר מחוברים לעבודה האמיתית עם לידים ומשימות — בלי הגדרות מסובכות."
          />

          <div className="pmx-recipe">
            {automationRecipes.map((recipe, index) => (
              <Reveal
                key={recipe.title}
                from="up"
                delay={index * 0.1}
                className="pmx-recipe__card"
              >
                <h3>{recipe.title}</h3>
                <p>{recipe.text}</p>
                <div className="pmx-recipe__meta">
                  <span>{recipe.trigger}</span>
                  <span>{recipe.action}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <Bot size={14} aria-hidden="true" />
                מה רץ בשבילכם
              </>
            }
            title={
              <>
                פחות ידני,{" "}
                <span className="pm-grad">יותר שליטה</span>
              </>
            }
            lead="תזכורות, פולואפים, סטטוסים, התראות ו־AI — שכבות שחוסכות זמן בלי לאבד את התמונה המלאה."
          />

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {automationsModules.map((card, index) => {
              const Icon = MODULE_ICONS[index] || Zap;
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

      {/* FAQ + CTA */}
      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading
            eyebrow="שאלות נפוצות"
            title="מה שחשוב לדעת על אוטומציות"
          />
          <FaqAccordion items={automationsFaq} />

          <div className="pmx-final">
            <FinalCta
              eyebrow="תנו לעסק לרוץ גם בליכם"
              title="הפעילו תהליכים ששומרים על כל פנייה בתנועה"
              text="תזכורות, פולואפים והתראות שמחוברים ל־CRM — כדי שתתמקדו בלקוחות, והמערכת תשמור שהמשך לא יישכח."
              primaryLabel="לצפייה בחבילות"
              primaryTo="/pricing"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

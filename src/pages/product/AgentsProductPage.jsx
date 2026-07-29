import React from "react";
import { Helmet } from "react-helmet-async";
import {
  CalendarCheck2,
  ChevronLeft,
  ClipboardList,
  Handshake,
  Headset,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Eye,
  Megaphone,
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
  agentsFaq,
  agentsHeroStats,
  agentsModules,
  agentsRail,
  agentsServices,
  agentsSteps,
} from "../../components/agents-marketing/agentsMarketingData";
import "../../components/product-marketing/marketingKit.css";
import "../../components/product-marketing/CenteredProductHero.css";

const SEO_TITLE = "נציגים אנושיים לעסק | BizUply";
const SEO_DESCRIPTION =
  "שכבת שירות אנושית שמטפלת בלידים, מתאמת פגישות, ממלאת פרטים ומנהלת שיתופים — מתוך ה־CRM שלכם ב־BizUply.";

const MODULE_ICONS = [
  Headset,
  CalendarCheck2,
  ClipboardList,
  Eye,
  Handshake,
  Megaphone,
];

export default function AgentsProductPage() {
  return (
    <div className="pm pm-hero-page" dir="rtl">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <link rel="canonical" href="https://bizuply.com/agents" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
      </Helmet>

      <ScrollProgress />

      <CenteredProductHero
        ariaLabel="נציגים אנושיים לעסק"
        accent="emerald"
        badges={[
          { label: "שירות אנושי מחובר", live: true },
          {
            label: "עובדים מתוך ה־CRM",
            icon: <UsersRound size={13} aria-hidden="true" />,
          },
          {
            label: "שקיפות מלאה",
            icon: <Eye size={13} aria-hidden="true" />,
          },
        ]}
        title="נציגים אנושיים"
        titleHighlight="שמזיזים תוצאות"
        lead="שכבת שירות אנושית שמטפלת בלידים, מתאמת המשך, ממלאת פרטים ומנהלת שיתופי פעולה — לא במוקד מנותק, אלא מתוך המערכת שבה כבר רץ העסק שלכם."
        note={{
          icon: <ShieldCheck size={17} aria-hidden="true" />,
          text: "כל שיחה, סטטוס ומשימה מתועדים ב־CRM — כדי שתראו בדיוק מה קרה עם כל פנייה, בלי שיחות אבודות מחוץ לצינור.",
        }}
        stats={agentsHeroStats}
      />

      {/* How it works */}
      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <Headset size={14} aria-hidden="true" />
                איך זה עובד
              </>
            }
            title={
              <>
                מחיבור מהיר עד{" "}
                <span className="pm-grad">טיפול שמביא תוצאות</span>
              </>
            }
            lead="מגדירים צורך, מחברים נציג למערכת, מתחילים לטפל בפניות — ומודדים סטטוסים ופגישות בזמן אמת."
          />

          <div className="pmx-flow">
            {agentsSteps.map((step, index) => (
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
            <ol className="pmx-rail" aria-label="זרימת טיפול נציג">
              {agentsRail.map((item, index) => (
                <React.Fragment key={item}>
                  <li>{item}</li>
                  {index < agentsRail.length - 1 ? (
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

      {/* Service packages */}
      <section className="pm-section">
        <AuroraBackdrop />
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <Sparkles size={14} aria-hidden="true" />
                מה הנציגים עושים
              </>
            }
            title={
              <>
                שלוש שכבות שירות{" "}
                <span className="pm-grad">שמתחברות לעסק</span>
              </>
            }
            lead="אפשר להתחיל מטיפול בלידים, מתיאום פגישות, או ממנהל שיתופים אנושי — לפי העומס והיעד."
          />

          <div className="pmx-recipe">
            {agentsServices.map((service, index) => (
              <Reveal
                key={service.title}
                from="up"
                delay={index * 0.1}
                className="pmx-recipe__card"
              >
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="pmx-recipe__meta">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
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
                <UsersRound size={14} aria-hidden="true" />
                למה זה אחרת
              </>
            }
            title={
              <>
                נציגים שעובדים{" "}
                <span className="pm-grad">עם המערכת שלכם</span>
              </>
            }
            lead="מענה, תיאום, מילוי פרטים, שקיפות ושיתופים — שכבה אנושית שמחוברת לצינור האמיתי של העסק."
          />

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {agentsModules.map((card, index) => {
              const Icon = MODULE_ICONS[index] || Headset;
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
            title="מה שחשוב לדעת על נציגים אנושיים"
          />
          <FaqAccordion items={agentsFaq} />

          <div className="pmx-final">
            <FinalCta
              eyebrow="צריכים שכבה אנושית"
              title="חברו נציגים שמביאים תוצאות — בלי לאבד שליטה"
              text="טיפול בלידים, תיאום פגישות וניהול שיתופים מתוך BizUply. כל פעילות מתועדת, כל סטטוס גלוי, והעומס יורד מהיום הראשון."
              primaryLabel="לצפייה בחבילות"
              primaryTo="/pricing"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

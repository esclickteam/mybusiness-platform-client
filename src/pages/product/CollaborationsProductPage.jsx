import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Bot,
  ChevronLeft,
  Handshake,
  MapPin,
  MessageSquare,
  Network,
  Search,
  Sparkles,
  Store,
  UserRound,
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
  collaborationsFaq,
  collaborationsModules,
  collaborationsRail,
  collaborationsHeroStats,
  collaborationsSteps,
} from "../../components/collaborations-marketing/collaborationsMarketingData";
import CollabWorkspacePreview from "../../components/collaborations-marketing/CollabWorkspacePreview";
import "../../components/product-marketing/marketingKit.css";
import "../../components/product-marketing/CenteredProductHero.css";

const SEO_TITLE = "שיתופי פעולה עסקיים | BizUply";
const SEO_DESCRIPTION =
  "מצאו שותפים עסקיים, נהלו הצעות וצ׳אט בזמן אמת, פרסמו בשוק הזדמנויות וצמחו יחד — הכל במקום אחד ב־BizUply.";

const MODULE_ICONS = [UserRound, Search, Store, Handshake, MessageSquare, Bot];

export default function CollaborationsProductPage() {
  return (
    <div className="pm pm-hero-page" dir="rtl">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <link rel="canonical" href="https://bizuply.com/collaborations" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
      </Helmet>

      <ScrollProgress />

      <CenteredProductHero
        ariaLabel="שיתופי פעולה עסקיים"
        accent="pink"
        badges={[
          { label: "רשת שותפים חכמה", live: true },
          {
            label: "שוק הזדמנויות",
            icon: <Store size={13} aria-hidden="true" />,
          },
          {
            label: "צ׳אט עסקי חי",
            icon: <MessageSquare size={13} aria-hidden="true" />,
          },
        ]}
        title="מצאו שותפים עסקיים"
        titleHighlight="וצמחו יחד"
        lead="פרופיל שיתוף, מציאת שותפים לפי התאמה, שוק הזדמנויות, הצעות עם סטטוס וצ׳אט עסקי בזמן אמת — תהליך ברור שמחבר עסקים משלימים בלי שיחות מפוזרות."
        note={{
          icon: <Network size={17} aria-hidden="true" />,
          text: "מגלים שותף, שולחים הצעה, מנהלים שיחה ומודדים תוצאות — הכל באותה מערכת שבה כבר רצים הלידים והלקוחות.",
        }}
        stats={collaborationsHeroStats}
      />

      {/* How it works */}
      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <Handshake size={14} aria-hidden="true" />
                איך זה עובד
              </>
            }
            title={
              <>
                מפרופיל שיתוף עד{" "}
                <span className="pm-grad">עבודה משותפת</span>
              </>
            }
            lead="ארבעה שלבים ברורים: בונים נוכחות, מגלים התאמות, יוצרים קשר, ומנהלים את ההזדמנות בשוק ובצינור ההצעות."
          />

          <div className="pmx-flow">
            {collaborationsSteps.map((step, index) => (
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
            <ol className="pmx-rail" aria-label="טאבי מודול השיתופים">
              {collaborationsRail.map((item, index) => (
                <React.Fragment key={item}>
                  <li>{item}</li>
                  {index < collaborationsRail.length - 1 ? (
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

      <CollabWorkspacePreview />

      {/* Modules */}
      <section className="pm-section">
        <AuroraBackdrop />
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <Sparkles size={14} aria-hidden="true" />
                מה יש במודול
              </>
            }
            title={
              <>
                כל מה שצריך כדי{" "}
                <span className="pm-grad">לבנות שיתופים אמיתיים</span>
              </>
            }
            lead="לא רק רשימת אנשי קשר — פרופיל, גילוי, שוק, הצעות, צ׳אט והמלצות AI שעובדים יחד."
          />

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {collaborationsModules.map((card, index) => {
              const Icon = MODULE_ICONS[index] || MapPin;
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

      {/* FAQ + CTA */}
      <section className="pm-section pm-section--tight">
        <div className="pm-shell">
          <SectionHeading
            eyebrow="שאלות נפוצות"
            title="מה שחשוב לדעת על שיתופי פעולה"
          />
          <FaqAccordion items={collaborationsFaq} />

          <div className="pmx-final">
            <FinalCta
              eyebrow="מוכנים לפתוח ערוץ צמיחה"
              title="חברו שותפים רלוונטיים — ותנו לצמיחה לרוץ בשני כיוונים"
              text="בונים פרופיל שיתוף, מגלים עסקים משלימים, שולחים הצעה ומנהלים הכל בשוק ובצ׳אט. אפשר גם לחבר נציג אנושי שינהל את התהליך בשבילכם."
              primaryLabel="הירשמו עכשיו"
              primaryTo="/pricing"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

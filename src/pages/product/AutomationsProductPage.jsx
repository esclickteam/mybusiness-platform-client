import React from "react";
import { useTranslation } from "react-i18next";
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
  getAutomationRecipes,
  getAutomationsFaq,
  getAutomationsHeroStats,
  getAutomationsModules,
  getAutomationsRail,
  getAutomationsSteps,
} from "../../components/automations-marketing/automationsMarketingData";
import AutomationsNotificationsDemo from "../../components/automations-marketing/AutomationsNotificationsDemo";
import AutomationsBuilderPreview from "../../components/automations-marketing/AutomationsBuilderPreview";
import "../../components/product-marketing/marketingKit.css";
import "../../components/product-marketing/CenteredProductHero.css";

const MODULE_ICONS = [BellRing, RefreshCw, CheckCircle2, Zap, Bot, Clock3];

export default function AutomationsProductPage() {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";

  const seoTitle = t("automationsPage.seoTitle");
  const seoDescription = t("automationsPage.seoDescription");

  const automationsHeroStats = getAutomationsHeroStats(t);
  const automationsSteps = getAutomationsSteps(t);
  const automationsRail = getAutomationsRail(t);
  const automationRecipes = getAutomationRecipes(t);
  const automationsModules = getAutomationsModules(t);
  const automationsFaq = getAutomationsFaq(t);

  return (
    <div className="pm pm-hero-page" dir={dir}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href="https://bizuply.com/automations" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
      </Helmet>

      <ScrollProgress />

      <CenteredProductHero
        ariaLabel={t("automationsPage.hero.ariaLabel")}
        accent="cyan"
        badges={[
          { label: t("automationsPage.hero.badgeBackground"), live: true },
          {
            label: t("automationsPage.hero.badgeCrm"),
            icon: <Workflow size={13} aria-hidden="true" />,
          },
          {
            label: t("automationsPage.hero.badgeSimple"),
            icon: <Sparkles size={13} aria-hidden="true" />,
          },
        ]}
        title={t("automationsPage.hero.title")}
        titleHighlight={t("automationsPage.hero.titleHighlight")}
        lead={t("automationsPage.hero.lead")}
        note={{
          icon: <Zap size={17} aria-hidden="true" />,
          text: t("automationsPage.hero.noteText"),
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
                {t("automationsPage.howItWorks.eyebrow")}
              </>
            }
            title={
              <>
                {t("automationsPage.howItWorks.titleLead")}{" "}
                <span className="pm-grad">
                  {t("automationsPage.howItWorks.titleHighlight")}
                </span>
              </>
            }
            lead={t("automationsPage.howItWorks.lead")}
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
            <ol
              className="pmx-rail"
              aria-label={t("automationsPage.howItWorks.railAriaLabel")}
            >
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

      <AutomationsBuilderPreview />

      <AutomationsNotificationsDemo />

      {/* Recipes */}
      <section className="pm-section">
        <AuroraBackdrop />
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <ListTodo size={14} aria-hidden="true" />
                {t("automationsPage.recipesSection.eyebrow")}
              </>
            }
            title={
              <>
                {t("automationsPage.recipesSection.titleLead")}{" "}
                <span className="pm-grad">
                  {t("automationsPage.recipesSection.titleHighlight")}
                </span>
              </>
            }
            lead={t("automationsPage.recipesSection.lead")}
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
                {t("automationsPage.modulesSection.eyebrow")}
              </>
            }
            title={
              <>
                {t("automationsPage.modulesSection.titleLead")}{" "}
                <span className="pm-grad">
                  {t("automationsPage.modulesSection.titleHighlight")}
                </span>
              </>
            }
            lead={t("automationsPage.modulesSection.lead")}
          />

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {automationsModules.map((card, index) => {
              const Icon = MODULE_ICONS[index] || Zap;
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
            eyebrow={t("automationsPage.faqSection.eyebrow")}
            title={t("automationsPage.faqSection.title")}
          />
          <FaqAccordion items={automationsFaq} />

          <div className="pmx-final">
            <FinalCta
              eyebrow={t("automationsPage.finalCta.eyebrow")}
              title={t("automationsPage.finalCta.title")}
              text={t("automationsPage.finalCta.text")}
              primaryLabel={t("automationsPage.finalCta.primaryLabel")}
              primaryTo="/pricing"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

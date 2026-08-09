import React from "react";
import { useTranslation } from "react-i18next";
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
  getAgentsFaq,
  getAgentsHeroStats,
  getAgentsModules,
  getAgentsRail,
  getAgentsServices,
  getAgentsSteps,
} from "../../components/agents-marketing/agentsMarketingData";
import AgentsWorkspacePreview from "../../components/agents-marketing/AgentsWorkspacePreview";
import "../../components/product-marketing/marketingKit.css";
import "../../components/product-marketing/CenteredProductHero.css";

const MODULE_ICONS = [
  Headset,
  CalendarCheck2,
  ClipboardList,
  Eye,
  Handshake,
  Megaphone,
];

export default function AgentsProductPage() {
  const { t, i18n } = useTranslation();

  const agentsHeroStats = getAgentsHeroStats(t);
  const agentsSteps = getAgentsSteps(t);
  const agentsRail = getAgentsRail(t);
  const agentsServices = getAgentsServices(t);
  const agentsModules = getAgentsModules(t);
  const agentsFaq = getAgentsFaq(t);

  const seoTitle = t("agentsPage.seo.title");
  const seoDescription = t("agentsPage.seo.description");

  return (
    <div className="pm pm-hero-page" dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href="https://bizuply.com/agents" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
      </Helmet>

      <ScrollProgress />

      <CenteredProductHero
        ariaLabel={t("agentsPage.hero.ariaLabel")}
        accent="emerald"
        badges={[
          { label: t("agentsPage.hero.badges.service"), live: true },
          {
            label: t("agentsPage.hero.badges.crm"),
            icon: <UsersRound size={13} aria-hidden="true" />,
          },
          {
            label: t("agentsPage.hero.badges.transparency"),
            icon: <Eye size={13} aria-hidden="true" />,
          },
        ]}
        title={t("agentsPage.hero.title")}
        titleHighlight={t("agentsPage.hero.titleHighlight")}
        lead={t("agentsPage.hero.lead")}
        note={{
          icon: <ShieldCheck size={17} aria-hidden="true" />,
          text: t("agentsPage.hero.note"),
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
                {t("agentsPage.howItWorks.eyebrow")}
              </>
            }
            title={
              <>
                {t("agentsPage.howItWorks.titlePre")}{" "}
                <span className="pm-grad">
                  {t("agentsPage.howItWorks.titleHighlight")}
                </span>
              </>
            }
            lead={t("agentsPage.howItWorks.lead")}
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
            <ol className="pmx-rail" aria-label={t("agentsPage.rail.ariaLabel")}>
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

      <AgentsWorkspacePreview />

      {/* Service packages */}
      <section className="pm-section">
        <AuroraBackdrop />
        <div className="pm-shell">
          <SectionHeading
            eyebrow={
              <>
                <Sparkles size={14} aria-hidden="true" />
                {t("agentsPage.services.eyebrow")}
              </>
            }
            title={
              <>
                {t("agentsPage.services.titlePre")}{" "}
                <span className="pm-grad">
                  {t("agentsPage.services.titleHighlight")}
                </span>
              </>
            }
            lead={t("agentsPage.services.lead")}
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
                {t("agentsPage.modules.eyebrow")}
              </>
            }
            title={
              <>
                {t("agentsPage.modules.titlePre")}{" "}
                <span className="pm-grad">
                  {t("agentsPage.modules.titleHighlight")}
                </span>
              </>
            }
            lead={t("agentsPage.modules.lead")}
          />

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {agentsModules.map((card, index) => {
              const Icon = MODULE_ICONS[index] || Headset;
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
            eyebrow={t("agentsPage.faq.eyebrow")}
            title={t("agentsPage.faq.title")}
          />
          <FaqAccordion items={agentsFaq} />

          <div className="pmx-final">
            <FinalCta
              eyebrow={t("agentsPage.finalCta.eyebrow")}
              title={t("agentsPage.finalCta.title")}
              text={t("agentsPage.finalCta.text")}
              primaryLabel={t("agentsPage.finalCta.primaryLabel")}
              primaryTo="/pricing"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

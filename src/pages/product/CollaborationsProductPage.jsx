import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
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
  getCollaborationsFaq,
  getCollaborationsModules,
  getCollaborationsRail,
  getCollaborationsHeroStats,
  getCollaborationsSteps,
} from "../../components/collaborations-marketing/collaborationsMarketingData";
import CollabWorkspacePreview from "../../components/collaborations-marketing/CollabWorkspacePreview";
import "../../components/product-marketing/marketingKit.css";
import "../../components/product-marketing/CenteredProductHero.css";

const MODULE_ICONS = [UserRound, Search, Store, Handshake, MessageSquare, Bot];

export default function CollaborationsProductPage() {
  const { t, i18n } = useTranslation();

  const seoTitle = t("collabPage.seoTitle");
  const seoDescription = t("collabPage.seoDescription");

  const collaborationsHeroStats = getCollaborationsHeroStats(t);
  const collaborationsSteps = getCollaborationsSteps(t);
  const collaborationsRail = getCollaborationsRail(t);
  const collaborationsModules = getCollaborationsModules(t);
  const collaborationsFaq = getCollaborationsFaq(t);

  return (
    <div className="pm pm-hero-page" dir={i18n.language === "he" ? "rtl" : "ltr"}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href="https://bizuply.com/collaborations" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
      </Helmet>

      <ScrollProgress />

      <CenteredProductHero
        ariaLabel={t("collabPage.hero.ariaLabel")}
        accent="pink"
        badges={[
          { label: t("collabPage.hero.badgeNetwork"), live: true },
          {
            label: t("collabPage.hero.badgeMarketplace"),
            icon: <Store size={13} aria-hidden="true" />,
          },
          {
            label: t("collabPage.hero.badgeChat"),
            icon: <MessageSquare size={13} aria-hidden="true" />,
          },
        ]}
        title={t("collabPage.hero.title")}
        titleHighlight={t("collabPage.hero.titleHighlight")}
        lead={t("collabPage.hero.lead")}
        note={{
          icon: <Network size={17} aria-hidden="true" />,
          text: t("collabPage.hero.note"),
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
                {t("collabPage.how.eyebrow")}
              </>
            }
            title={
              <>
                {t("collabPage.how.titlePrefix")}{" "}
                <span className="pm-grad">{t("collabPage.how.titleHighlight")}</span>
              </>
            }
            lead={t("collabPage.how.lead")}
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
            <ol className="pmx-rail" aria-label={t("collabPage.how.railAria")}>
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
                {t("collabPage.modules.eyebrow")}
              </>
            }
            title={
              <>
                {t("collabPage.modules.titlePrefix")}{" "}
                <span className="pm-grad">{t("collabPage.modules.titleHighlight")}</span>
              </>
            }
            lead={t("collabPage.modules.lead")}
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
            eyebrow={t("collabPage.faq.eyebrow")}
            title={t("collabPage.faq.title")}
          />
          <FaqAccordion items={collaborationsFaq} />

          <div className="pmx-final">
            <FinalCta
              eyebrow={t("collabPage.cta.eyebrow")}
              title={t("collabPage.cta.title")}
              text={t("collabPage.cta.text")}
              primaryLabel={t("collabPage.cta.primaryLabel")}
              primaryTo="/pricing"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

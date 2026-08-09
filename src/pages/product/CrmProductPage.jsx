import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
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
} from "lucide-react";
import CrmProductHero from "../../components/crm-marketing/CrmProductHero";
import CrmScreenshotTour from "../../components/crm-marketing/CrmScreenshotTour";
import CrmIntegrationRail from "../../components/crm-marketing/CrmIntegrationRail";
import CrmMetaTrust from "../../components/crm-marketing/CrmMetaTrust";
import {
  getCrmFaq,
  getPipelineStages,
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

const MODULE_CARDS = [
  { icon: ListChecks, accent: "#7c3aed", key: "leadCard" },
  { icon: UserRound, accent: "#2563eb", key: "clientFile" },
  { icon: CalendarClock, accent: "#0891b2", key: "calendar" },
  { icon: Clock, accent: "#059669", key: "services" },
  { icon: BellRing, accent: "#f59e0b", key: "alerts" },
  { icon: Gauge, accent: "#4f46e5", key: "dashboard" },
];

const LIST_CARDS = [
  { icon: Search, accent: "#6d28d9", key: "search" },
  { icon: Filter, accent: "#2563eb", key: "filter" },
  { icon: Images, accent: "#0891b2", key: "list" },
];

export default function CrmProductPage() {
  const { t, i18n } = useTranslation();
  const pipelineStages = getPipelineStages(t);
  const crmFaq = getCrmFaq(t);
  const seoTitle = t("crmPage.seo.title");
  const seoDescription = t("crmPage.seo.description");

  return (
    <div
      className="pm crm-page crmp"
      dir={i18n.language === "he" ? "rtl" : "ltr"}
    >
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href="https://bizuply.com/crm" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
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
                {t("crmPage.pipelineSection.eyebrow")}
              </>
            }
            title={
              <>
                {t("crmPage.pipelineSection.titleA")}
                <span className="pm-grad">
                  {t("crmPage.pipelineSection.titleHighlight")}
                </span>
              </>
            }
            lead={t("crmPage.pipelineSection.lead")}
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
            {LIST_CARDS.map((card, index) => {
              const Icon = card.icon;
              const tags = t(`crmPage.listCards.${card.key}.tags`, {
                returnObjects: true,
              });
              return (
                <StaggerItem key={card.key}>
                  <SpotlightCard accent={card.accent} goldIndex={index}>
                    <span className="pm-spot__icon">
                      <Icon size={19} />
                    </span>
                    <h3 className="pm-spot__title">
                      {t(`crmPage.listCards.${card.key}.title`)}
                    </h3>
                    <p className="pm-spot__text">
                      {t(`crmPage.listCards.${card.key}.text`)}
                    </p>
                    <ul className="pm-spot__tags">
                      {tags.map((tag) => (
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
                {t("crmPage.shotsSection.eyebrow")}
              </>
            }
            title={
              <>
                {t("crmPage.shotsSection.titleA")}
                <span className="pm-grad">
                  {t("crmPage.shotsSection.titleHighlight")}
                </span>
              </>
            }
            lead={t("crmPage.shotsSection.lead")}
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
                {t("crmPage.modulesSection.eyebrow")}
              </>
            }
            title={
              <>
                {t("crmPage.modulesSection.titleA")}
                <span className="pm-grad">
                  {t("crmPage.modulesSection.titleHighlight")}
                </span>
              </>
            }
            lead={t("crmPage.modulesSection.lead")}
          />

          <Stagger className="pm-grid pm-grid--3" gap={0.07}>
            {MODULE_CARDS.map((card, index) => {
              const Icon = card.icon;
              const tags = t(`crmPage.moduleCards.${card.key}.tags`, {
                returnObjects: true,
              });
              return (
                <StaggerItem key={card.key}>
                  <SpotlightCard accent={card.accent} goldIndex={index}>
                    <span className="pm-spot__icon">
                      <Icon size={19} />
                    </span>
                    <h3 className="pm-spot__title">
                      {t(`crmPage.moduleCards.${card.key}.title`)}
                    </h3>
                    <p className="pm-spot__text">
                      {t(`crmPage.moduleCards.${card.key}.text`)}
                    </p>
                    <ul className="pm-spot__tags">
                      {tags.map((tag) => (
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

      {/* FAQ + closing */}
      <section className="pm-section pm-section--tight crx">
        <div className="pm-shell">
          <SectionHeading
            eyebrow={t("crmPage.faqSection.eyebrow")}
            title={t("crmPage.faqSection.title")}
          />
          <FaqAccordion items={crmFaq} />

          <div className="crmp__final">
            <FinalCta
              eyebrow={t("crmPage.finalCta.eyebrow")}
              title={t("crmPage.finalCta.title")}
              text={t("crmPage.finalCta.text")}
              primaryLabel={t("crmPage.finalCta.primaryLabel")}
              primaryTo="/pricing"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

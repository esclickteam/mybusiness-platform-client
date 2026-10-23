import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { marketingPublicUrl } from "../../lib/localePath.mjs";
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
      dir={getTextDirection(i18n.language)}
    >
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={marketingPublicUrl("/crm", i18n.language)} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bizuply" />
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

      {t("crmPage.audiences.eyebrow") !== "crmPage.audiences.eyebrow" ? (
        <>
          <section className="pm-section crx">
            <div className="pm-shell">
              <SectionHeading
                eyebrow={t("crmPage.audiences.eyebrow")}
                title={
                  <>
                    {t("crmPage.audiences.titleA")}
                    <span className="pm-grad">{t("crmPage.audiences.titleHighlight")}</span>
                  </>
                }
                lead={t("crmPage.audiences.lead")}
              />
              <Stagger className="pm-grid pm-grid--3" gap={0.07}>
                {["services", "ads", "sites"].map((key, index) => (
                  <StaggerItem key={key}>
                    <SpotlightCard accent={["#7c3aed", "#2563eb", "#0891b2"][index]} goldIndex={index}>
                      <h3 className="pm-spot__title">{t(`crmPage.audiences.cards.${key}.title`)}</h3>
                      <p className="pm-spot__text">{t(`crmPage.audiences.cards.${key}.text`)}</p>
                    </SpotlightCard>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>

          <section className="pm-section pm-section--tight crx">
            <div className="pm-shell">
              <SectionHeading eyebrow={t("crmPage.useCases.eyebrow")} title={t("crmPage.useCases.title")} />
              <div className="crx-sources">
                {["leadAd", "website", "client", "booking"].map((key) => (
                  <article key={key} className="crx-source" style={{ textAlign: "start" }}>
                    <h3 className="crx-source__name">{t(`crmPage.useCases.items.${key}.title`)}</h3>
                    <p className="crx-source__note">{t(`crmPage.useCases.items.${key}.text`)}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="pm-section pm-section--tight crx">
            <div className="pm-shell">
              <SectionHeading eyebrow={t("crmPage.start.eyebrow")} title={t("crmPage.start.title")} />
              <ol className="crx-sources">
                {["account", "source", "work"].map((key, index) => (
                  <li key={key} className="crx-source" style={{ textAlign: "start" }}>
                    <h3 className="crx-source__name">{index + 1}. {t(`crmPage.start.steps.${key}.title`)}</h3>
                    <p className="crx-source__note">{t(`crmPage.start.steps.${key}.text`)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="pm-section pm-section--tight crx">
            <div className="pm-shell">
              <SectionHeading
                eyebrow={t("crmPage.pricingNote.eyebrow")}
                title={t("crmPage.pricingNote.title")}
                lead={t("crmPage.pricingNote.text")}
              />
              <div className="crm-hero__actions">
                <Link className="pm-cta pm-cta--primary" to="/pricing">{t("crmPage.pricingNote.plans")}</Link>
                <Link className="pm-cta pm-cta--ghost" to="/business">{t("crmPage.pricingNote.account")}</Link>
              </div>
            </div>
          </section>

          <section className="pm-section pm-section--tight crx">
            <div className="pm-shell">
              <SectionHeading eyebrow={t("crmPage.related.eyebrow")} title={t("crmPage.related.title")} />
              <div className="crx-sources">
                {[
                  ["/automations", "automations"],
                  ["/appointments", "appointments"],
                  ["/website-builder", "websites"],
                  ["/whatsapp-api", "whatsapp"],
                ].map(([to, key]) => (
                  <Link key={key} to={to} className="crx-source" style={{ textAlign: "start", textDecoration: "none" }}>
                    <h3 className="crx-source__name">{t(`crmPage.related.${key}`)}</h3>
                    <p className="crx-source__note">{t(`crmPage.related.${key}Text`)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

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
              primaryTo="/business"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

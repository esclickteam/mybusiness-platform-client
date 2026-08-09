import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
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
import { getWebsiteFaq } from "../../components/website-builder-marketing/websiteMarketingData";
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

export default function WebsiteProductPage() {
  const { t, i18n } = useTranslation();

  const SEO_TITLE = t("websitePage.seo.title");
  const SEO_DESCRIPTION = t("websitePage.seo.description");

  const EDITOR_CARDS = [
    {
      icon: MousePointerClick,
      accent: "#e11d8c",
      title: t("websitePage.editor.cards.edit.title"),
      text: t("websitePage.editor.cards.edit.text"),
      tags: t("websitePage.editor.cards.edit.tags", { returnObjects: true }),
    },
    {
      icon: Palette,
      accent: "#7c3aed",
      title: t("websitePage.editor.cards.design.title"),
      text: t("websitePage.editor.cards.design.text"),
      tags: t("websitePage.editor.cards.design.tags", { returnObjects: true }),
    },
    {
      icon: Layers,
      accent: "#4f46e5",
      title: t("websitePage.editor.cards.structure.title"),
      text: t("websitePage.editor.cards.structure.text"),
      tags: t("websitePage.editor.cards.structure.tags", { returnObjects: true }),
    },
    {
      icon: Library,
      accent: "#0891b2",
      title: t("websitePage.editor.cards.content.title"),
      text: t("websitePage.editor.cards.content.text"),
      tags: t("websitePage.editor.cards.content.tags", { returnObjects: true }),
    },
    {
      icon: MonitorSmartphone,
      accent: "#059669",
      title: t("websitePage.editor.cards.responsive.title"),
      text: t("websitePage.editor.cards.responsive.text"),
      tags: t("websitePage.editor.cards.responsive.tags", { returnObjects: true }),
    },
    {
      icon: History,
      accent: "#f59e0b",
      title: t("websitePage.editor.cards.history.title"),
      text: t("websitePage.editor.cards.history.text"),
      tags: t("websitePage.editor.cards.history.tags", { returnObjects: true }),
    },
    {
      icon: Code2,
      accent: "#2563eb",
      title: t("websitePage.editor.cards.code.title"),
      text: t("websitePage.editor.cards.code.text"),
      tags: t("websitePage.editor.cards.code.tags", { returnObjects: true }),
    },
    {
      icon: Share2,
      accent: "#db2777",
      title: t("websitePage.editor.cards.collaborate.title"),
      text: t("websitePage.editor.cards.collaborate.text"),
      tags: t("websitePage.editor.cards.collaborate.tags", { returnObjects: true }),
    },
    {
      icon: Sparkles,
      accent: "#6d28d9",
      title: t("websitePage.editor.cards.publish.title"),
      text: t("websitePage.editor.cards.publish.text"),
      tags: t("websitePage.editor.cards.publish.tags", { returnObjects: true }),
    },
  ];

  return (
    <div dir={i18n.language === "he" ? "rtl" : "ltr"} className="pm wbp">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <link rel="canonical" href="https://bizuply.com/website-builder" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
        <link rel="preload" as="image" href="/floriquedesk.webp" />
        <link rel="preload" as="image" href="/velmoradesk.webp" />
        <link rel="preload" as="image" href="/PulseCoredesk.webp" />
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
                {t("websitePage.editor.eyebrow")}
              </>
            }
            title={
              <>
                {t("websitePage.editor.titleLead")}{" "}
                <span className="pm-grad">{t("websitePage.editor.titleHighlight")}</span>
              </>
            }
            lead={t("websitePage.editor.lead")}
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
            eyebrow={t("websitePage.faqSection.eyebrow")}
            title={t("websitePage.faqSection.title")}
          />
          <FaqAccordion items={getWebsiteFaq(t)} />

          <div className="wbp__final">
            <FinalCta
              eyebrow={t("websitePage.finalCta.eyebrow")}
              title={t("websitePage.finalCta.title")}
              text={t("websitePage.finalCta.text")}
              primaryLabel={t("websitePage.finalCta.primaryLabel")}
              primaryTo="/pricing"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

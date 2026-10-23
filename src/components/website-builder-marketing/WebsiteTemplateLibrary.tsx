import React from "react";
import { useTranslation } from "react-i18next";
import { LayoutTemplate } from "lucide-react";
import { Reveal, SectionHeading } from "../product-marketing";
import { getWebsiteHeroTemplates } from "./websiteHeroTemplates";
import { getTemplateCategories } from "./websiteMarketingData";
import "./websiteSections.css";

export default function WebsiteTemplateLibrary() {
  const { t } = useTranslation();
  const templateCategories = getTemplateCategories(t);
  const websiteHeroTemplates = getWebsiteHeroTemplates(t);

  return (
    <section className="pm-section wbx">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <LayoutTemplate size={14} aria-hidden="true" />
              {t("websitePage.library.eyebrow")}
            </>
          }
          title={
            <>
              {t("websitePage.library.titleLead")}{" "}
              <span className="pm-grad">{t("websitePage.library.titleHighlight")}</span>
            </>
          }
          lead={t("websitePage.library.lead")}
        />

        <Reveal from="up" delay={0.1}>
          <div className="wbx-templates">
            {websiteHeroTemplates.map((template) => (
              <figure className="wbx-template" key={template.id}>
                <img
                  src={template.desktopImage}
                  alt={t("websitePage.templateAlt", {
                    title: template.title,
                    category: template.category,
                  })}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <b>{template.title}</b>
                  <i>{template.category}</i>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>

        <Reveal from="up" delay={0.14}>
          <ul className="wbx-cats">
            {templateCategories.map((cat) => (
              <li key={cat.label} className="wbx-cat">
                <span className="wbx-cat__swatch" style={{ background: cat.accent }} aria-hidden="true" />
                <span className="wbx-cat__label">{cat.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

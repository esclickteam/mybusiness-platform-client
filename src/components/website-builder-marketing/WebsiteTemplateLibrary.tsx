import React from "react";
import { motion } from "framer-motion";
import { LayoutTemplate } from "lucide-react";
import { Reveal, SectionHeading } from "../product-marketing";
import { websiteHeroTemplates } from "./websiteHeroTemplates";
import { templateCategories } from "./websiteMarketingData";
import "./websiteSections.css";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WebsiteTemplateLibrary() {
  const max = Math.max(...templateCategories.map((c) => c.count));

  return (
    <section className="pm-section wbx">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <LayoutTemplate size={14} aria-hidden="true" />
              ספריית התבניות
            </>
          }
          title={
            <>
              205 תבניות שנבנו <span className="pm-grad">לפי תחומים</span>
            </>
          }
          lead="כל תבנית מגיעה עם עמודים מוכנים, פלטת צבעים ותוכן לדוגמה בעברית — ומשם עורכים כל אלמנט במקום עד שהאתר מדבר בשם העסק שלכם."
        />

        <Reveal from="up" delay={0.1}>
          <div className="wbx-templates">
            {websiteHeroTemplates.map((template) => (
              <figure className="wbx-template" key={template.id}>
                <img
                  src={template.desktopImage}
                  alt={`תבנית ${template.title} — ${template.category}`}
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
            {templateCategories.map((cat, index) => (
              <li key={cat.label} className="wbx-cat">
                <span className="wbx-cat__label">{cat.label}</span>
                <span className="wbx-cat__track">
                  <motion.span
                    className="wbx-cat__fill"
                    style={{ background: cat.accent }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: cat.count / max }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.9,
                      delay: index * 0.06,
                      ease: EASE,
                    }}
                  />
                </span>
                <span className="wbx-cat__count">{cat.count}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

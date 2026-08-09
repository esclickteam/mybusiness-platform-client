import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BarChart3, Inbox, MousePointerClick, Workflow } from "lucide-react";
import { Reveal, SectionHeading } from "../product-marketing";
import "./websiteSections.css";

const EASE = [0.22, 1, 0.36, 1] as const;

const SPARK = [34, 41, 38, 52, 47, 63, 58, 71, 66, 78, 84, 92];

export default function WebsiteLaunchFlow() {
  const { t } = useTranslation();

  const NODES = [
    {
      icon: MousePointerClick,
      accent: "linear-gradient(135deg, #e11d8c, #7c3aed)",
      title: t("websitePage.launch.nodes.visitor.title"),
      text: t("websitePage.launch.nodes.visitor.text"),
      tags: t("websitePage.launch.nodes.visitor.tags", {
        returnObjects: true,
      }) as string[],
    },
    {
      icon: Workflow,
      accent: "linear-gradient(135deg, #7c3aed, #2563eb)",
      title: t("websitePage.launch.nodes.handle.title"),
      text: t("websitePage.launch.nodes.handle.text"),
      tags: t("websitePage.launch.nodes.handle.tags", {
        returnObjects: true,
      }) as string[],
    },
    {
      icon: Inbox,
      accent: "linear-gradient(135deg, #2563eb, #059669)",
      title: t("websitePage.launch.nodes.crm.title"),
      text: t("websitePage.launch.nodes.crm.text"),
      tags: t("websitePage.launch.nodes.crm.tags", {
        returnObjects: true,
      }) as string[],
    },
  ];

  const KPIS = [
    { title: t("websitePage.launch.kpis.views.title"), text: t("websitePage.launch.kpis.views.text") },
    { title: t("websitePage.launch.kpis.visitors.title"), text: t("websitePage.launch.kpis.visitors.text") },
    { title: t("websitePage.launch.kpis.pages.title"), text: t("websitePage.launch.kpis.pages.text") },
    { title: t("websitePage.launch.kpis.sources.title"), text: t("websitePage.launch.kpis.sources.text") },
  ];

  return (
    <section className="pm-section wbx">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Workflow size={14} aria-hidden="true" />
              {t("websitePage.launch.eyebrow")}
            </>
          }
          title={
            <>
              {t("websitePage.launch.titleLead")}{" "}
              <span className="pm-grad">{t("websitePage.launch.titleHighlight")}</span>
            </>
          }
          lead={t("websitePage.launch.lead")}
        />

        <div className="wbx-flow">
          {NODES.map((node, index) => {
            const Icon = node.icon;
            return (
              <Reveal
                key={node.title}
                from="up"
                delay={index * 0.12}
                className="wbx-flow__node"
              >
                <span
                  className="wbx-flow__icon"
                  style={{ background: node.accent }}
                  aria-hidden="true"
                >
                  <Icon size={21} />
                </span>
                <h3>{node.title}</h3>
                <p>{node.text}</p>
                <span className="wbx-flow__tags">
                  {node.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </span>
              </Reveal>
            );
          })}
        </div>

        <Reveal from="up" delay={0.1}>
          <div className="wbx-analytics">
            <p className="pm-eyebrow">
              <BarChart3 size={14} aria-hidden="true" />
              {t("websitePage.launch.analyticsTitle")}
            </p>

            <div className="wbx-spark" aria-hidden="true">
              {SPARK.map((height, index) => (
                <motion.span
                  key={index}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: height / 100 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.045,
                    ease: EASE,
                  }}
                  style={{ height: "100%" }}
                />
              ))}
            </div>

            <ul className="wbx-analytics__kpis">
              {KPIS.map((kpi) => (
                <li key={kpi.title}>
                  <b>{kpi.title}</b>
                  <i>{kpi.text}</i>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

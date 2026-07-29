import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Inbox, MousePointerClick, Workflow } from "lucide-react";
import { Reveal, SectionHeading } from "../product-marketing";
import "./websiteSections.css";

const EASE = [0.22, 1, 0.36, 1] as const;

const NODES = [
  {
    icon: MousePointerClick,
    accent: "linear-gradient(135deg, #e11d8c, #7c3aed)",
    title: "מבקר משאיר פנייה",
    text: "טופס הלידים באתר שפורסם אוסף את הפרטים — כולל שדות מותאמים שהגדרתם בבונה הטפסים.",
    tags: ["שם", "טלפון", "הודעה", "שדות מותאמים"],
  },
  {
    icon: Workflow,
    accent: "linear-gradient(135deg, #7c3aed, #2563eb)",
    title: "BizUply מטפל בפנייה",
    text: "הפנייה נשמרת, נשלחת אליכם התראת אימייל, ומי שהשאיר פרטים מקבל הודעת תגובה אוטומטית.",
    tags: ["התראת אימייל", "תגובה אוטומטית", "חיוב שדה טלפון"],
  },
  {
    icon: Inbox,
    accent: "linear-gradient(135deg, #2563eb, #059669)",
    title: "ליד חדש ב־CRM",
    text: "הליד מופיע בצינור הלידים עם המקור \"אתר\" ובסטטוס \"חדש\", מוכן למשימה, לשיחה ולמעקב.",
    tags: ["מקור: אתר", "סטטוס: חדש", "משימות ומעקב"],
  },
];

const SPARK = [34, 41, 38, 52, 47, 63, 58, 71, 66, 78, 84, 92];

const KPIS = [
  { title: "צפיות", text: "סך כל הצפיות בעמודים" },
  { title: "מבקרים", text: "מבקרים ייחודיים" },
  { title: "עמודים", text: "העמודים המובילים" },
  { title: "מקורות", text: "תנועה כולל UTM" },
];

export default function WebsiteLaunchFlow() {
  return (
    <section className="pm-section wbx">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Workflow size={14} aria-hidden="true" />
              מהאתר לעסק
            </>
          }
          title={
            <>
              אתר שלא רק נראה טוב — אלא{" "}
              <span className="pm-grad">מחזיר פניות</span>
            </>
          }
          lead="הטפסים באתר לא נשארים בתיבת מייל. כל פנייה נכנסת לצינור הלידים של ה־CRM עם מקור וסטטוס, כדי שתדעו בדיוק מה קרה עם כל מי שפנה."
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
              מדידה בלוח הבקרה
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

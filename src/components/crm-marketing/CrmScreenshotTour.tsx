import React from "react";
import { Reveal } from "../product-marketing";
import "./crmSections.css";

type Shot = {
  src: string;
  /** Portrait mobile captures get a narrower frame. */
  portrait?: boolean;
  crumb: string;
  caption: string;
};

type Block = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  main: Shot;
  extras: Shot[];
};

/** Real captures from the business dashboard — no mock-ups. */
const BLOCKS: Block[] = [
  {
    id: "leads",
    eyebrow: "לידים",
    title: "ניהול לידים מקצה לקצה",
    lead: "רשימת הלידים עם מדדים למעלה, סינון לפי סטטוס ולפי מקור, וחיפוש חופשי על שם, טלפון, אימייל, מקור ושדות הטופס.",
    main: {
      src: "/leads1.jpeg",
      crumb: "CRM · ניהול לידים",
      caption:
        "מסך הלידים: עורך לידים, לידים חדשים, נוצר קשר, הומרו ומשימות פתוחות — עם סינון לפי סטטוס ולפי מקור",
    },
    extras: [
      {
        src: "/leads2.jpeg",
        crumb: "CRM · כרטיס ליד",
        caption:
          "כרטיס הליד: סיכום פרופיל, פרטי המקור, כל שדות הטופס, ותיעוד עם הערות ומשימות בעלות תאריך",
      },
      {
        src: "/leads3.jpeg",
        portrait: true,
        crumb: "מרכז התראות",
        caption: "מרכז ההתראות: לידים חדשים ומשימות שעבר זמנן, גם במובייל",
      },
    ],
  },
  {
    id: "clients",
    eyebrow: "לקוחות",
    title: "תיק לקוח שממשיך אחרי הסגירה",
    lead: "מאגר הלקוחות עם מדדי תורים והכנסות, ובתוך כל לקוח פרופיל מלא, תיעוד עם קבצים והיסטוריית תורים.",
    main: {
      src: "/leads4.jpeg",
      crumb: "CRM · ניהול לקוחות",
      caption:
        "מסך הלקוחות: סך הלקוחות, לקוחות פעילים, תורים והכנסות — עם חיפוש וסינון",
    },
    extras: [
      {
        src: "/leads5.jpeg",
        crumb: "CRM · פרופיל לקוח",
        caption:
          "פרופיל הלקוח: פרטי קשר, סיכום CRM, ותיעוד עם משימות, תאריך ושעה וצירוף קבצים",
      },
      {
        src: "/leads6.jpeg",
        crumb: "CRM · תורי הלקוח",
        caption:
          "תורי הלקוח: היסטוריית התורים עם משך, מחיר וסטטוס תשלום לכל תור",
      },
    ],
  },
  {
    id: "appointments",
    eyebrow: "פגישות",
    title: "יומן פגישות מסונכרן",
    lead: "לוח חודשי לצד רשימה מסונכרנת, כרטיס פגישה עם שירות, משך, מחיר וסטטוס תשלום, ושעות פעילות שמגדירות את החלונות הפנויים.",
    main: {
      src: "/leads7.jpeg",
      crumb: "CRM · יומן פגישות",
      caption:
        "יומן הפגישות: פגישות היום, פגישות קרובות, פגישות שלא שולמו וסך ההכנסות",
    },
    extras: [],
  },
];

function ShotFrame({ shot, eager }: { shot: Shot; eager?: boolean }) {
  return (
    <figure
      className={`crx-shot${shot.portrait ? " crx-shot--portrait" : ""}`}
    >
      <div className="crx-shot__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>{shot.crumb}</em>
      </div>
      <img
        src={shot.src}
        alt={shot.caption}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
      />
      <figcaption>{shot.caption}</figcaption>
    </figure>
  );
}

export default function CrmScreenshotTour() {
  return (
    <div className="crx-tour">
      {BLOCKS.map((block, index) => (
        <article className="crx-tour__block" key={block.id}>
          <Reveal from="up" distance={22} duration={0.65}>
            <p className="pm-eyebrow">{block.eyebrow}</p>
            <h3 className="pm-title">{block.title}</h3>
            <p className="pm-lead">{block.lead}</p>
          </Reveal>

          <Reveal from="up" distance={30} duration={0.8} delay={0.08}>
            <ShotFrame shot={block.main} eager={index === 0} />
          </Reveal>

          {block.extras.length ? (
            <div className="crx-tour__row">
              {block.extras.map((shot, i) => (
                <Reveal
                  key={shot.src}
                  from="up"
                  distance={26}
                  duration={0.7}
                  delay={0.1 + i * 0.08}
                >
                  <ShotFrame shot={shot} />
                </Reveal>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

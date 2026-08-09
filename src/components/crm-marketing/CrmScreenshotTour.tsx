import React from "react";
import { useTranslation } from "react-i18next";
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

type TFn = (key: string, options?: Record<string, unknown>) => any;

/** Real captures from the business dashboard — no mock-ups. */
function getBlocks(t: TFn): Block[] {
  return [
    {
      id: "leads",
      eyebrow: t("crmPage.tour.leads.eyebrow"),
      title: t("crmPage.tour.leads.title"),
      lead: t("crmPage.tour.leads.lead"),
      main: {
        src: "/leads1.jpeg",
        crumb: t("crmPage.tour.leads.main.crumb"),
        caption: t("crmPage.tour.leads.main.caption"),
      },
      extras: [
        {
          src: "/leads2.jpeg",
          crumb: t("crmPage.tour.leads.extra1.crumb"),
          caption: t("crmPage.tour.leads.extra1.caption"),
        },
        {
          src: "/leads3.jpeg",
          portrait: true,
          crumb: t("crmPage.tour.leads.extra2.crumb"),
          caption: t("crmPage.tour.leads.extra2.caption"),
        },
      ],
    },
    {
      id: "clients",
      eyebrow: t("crmPage.tour.clients.eyebrow"),
      title: t("crmPage.tour.clients.title"),
      lead: t("crmPage.tour.clients.lead"),
      main: {
        src: "/leads4.jpeg",
        crumb: t("crmPage.tour.clients.main.crumb"),
        caption: t("crmPage.tour.clients.main.caption"),
      },
      extras: [
        {
          src: "/leads5.jpeg",
          crumb: t("crmPage.tour.clients.extra1.crumb"),
          caption: t("crmPage.tour.clients.extra1.caption"),
        },
        {
          src: "/leads6.jpeg",
          crumb: t("crmPage.tour.clients.extra2.crumb"),
          caption: t("crmPage.tour.clients.extra2.caption"),
        },
      ],
    },
    {
      id: "appointments",
      eyebrow: t("crmPage.tour.appointments.eyebrow"),
      title: t("crmPage.tour.appointments.title"),
      lead: t("crmPage.tour.appointments.lead"),
      main: {
        src: "/leads7.jpeg",
        crumb: t("crmPage.tour.appointments.main.crumb"),
        caption: t("crmPage.tour.appointments.main.caption"),
      },
      extras: [],
    },
  ];
}

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
  const { t } = useTranslation();
  const BLOCKS = getBlocks(t);

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

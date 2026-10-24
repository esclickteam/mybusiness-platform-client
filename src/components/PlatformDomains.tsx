"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { Reveal } from "./product-marketing";
import "../styles/homeWow.css";

const ROWS = [
  {
    key: "pathSelf",
    to: "/platform",
    image: "/demo-media/home/crm.jpg",
    cta: "pathSelfCta",
  },
  {
    key: "pathHelp",
    to: "/services",
    image: "/demo-media/home/websites.jpg",
    cta: "pathHelpCta",
  },
] as const;

export default function PlatformDomains() {
  const { t, i18n } = useTranslation();

  return (
    <section className="home-ways" dir={getTextDirection(i18n.language)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Reveal from="up" distance={18}>
          <h2 className="home-ways__title">{t("home.domainsTitle")}</h2>
          <p className="home-ways__lead">{t("home.domainsLead")}</p>
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {ROWS.map((row) => (
            <Reveal key={row.key} from="up" distance={20}>
              <article className="home-way">
                <img src={row.image} alt={t(`home.${row.key}`)} width={960} height={540} />
                <div>
                  <h3>{t(`home.${row.key}`)}</h3>
                  <p>{t(`home.${row.key}Body`)}</p>
                  <Link to={row.to}>{t(`home.${row.cta}`)}</Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

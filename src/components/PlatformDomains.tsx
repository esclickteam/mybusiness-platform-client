"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { Reveal } from "./product-marketing";
import "../styles/homeWow.css";

const WAYS = [
  { n: 1, to: "/platform", image: "/demo-media/home/crm.jpg" },
  { n: 2, to: "/website-builder", image: "/demo-media/websites/poster.jpg" },
  { n: 3, to: "/meta-campaigns", image: "/demo-media/campaigns/poster.jpg" },
  { n: 4, to: "/pricing", image: "/demo-media/automations/poster.jpg" },
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
        <div className="home-ways__grid">
          {WAYS.map((way) => (
            <Reveal key={way.n} from="up" distance={20}>
              <article className={`home-way home-way--shot home-way--shot-${way.n}`}>
                <div className="home-way__shot">
                  <img src={way.image} alt={t(`home.way${way.n}Title`)} width="1280" height="800" />
                </div>
                <div>
                  <h3>{t(`home.way${way.n}Title`)}</h3>
                  <p>{t(`home.way${way.n}Body`)}</p>
                  <Link to={way.to}>{t(`home.way${way.n}Cta`)}</Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

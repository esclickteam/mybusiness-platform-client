"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { WayArt } from "./HomeVisuals";
import { Reveal } from "./product-marketing";
import "../styles/homeWow.css";

const WAYS = [
  { n: 1, to: "/platform" },
  { n: 2, to: "/website-builder" },
  { n: 3, to: "/meta-campaigns" },
  { n: 4, to: "/pricing" },
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
              <article className="home-way">
                <WayArt index={way.n - 1} />
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

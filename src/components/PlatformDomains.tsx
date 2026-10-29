"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { Reveal } from "./product-marketing";
import "../styles/homeWow.css";

const WAYS = [
  {
    n: 1,
    to: "/platform",
    image: "/demo-media/crm/leads-list.png",
  },
  {
    n: 2,
    to: "/website-builder",
    image: "/images/about/shot-editor.webp",
    phone: "/demo-media/websites/still-14.jpg",
  },
  {
    n: 3,
    to: "/meta-campaigns",
    image: "/demo-media/campaigns/poster.jpg",
    marks: true,
  },
  {
    n: 4,
    to: "/pricing",
    image: "/images/home/setup-team.jpg",
  },
] as const;

function BrandMarks() {
  return (
    <div className="home-way__marks" aria-hidden="true">
      <svg viewBox="0 0 32 32"><path fill="#0081FB" d="M7 16c0-4.2 2.3-7.2 5.4-7.2 2 0 3.4 1.3 4.6 3.2 1.4-1.9 2.8-3.2 4.8-3.2 3.1 0 5.2 3 5.2 7.2s-2.1 7.2-5.2 7.2c-2 0-3.4-1.3-4.8-3.2-1.2 1.9-2.6 3.2-4.6 3.2C9.3 23.2 7 20.2 7 16z" /></svg>
      <svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0866FF" /><path fill="#fff" d="M18.2 16.6h2.4l.5-2.6h-2.9V12.6c0-.8.3-1.3 1.4-1.3H21V8.7c-.4 0-1.1-.1-2-.1-2.3 0-3.8 1.4-3.8 3.9v1.5H13v2.6h2.2V24h3z" /></svg>
      <svg viewBox="0 0 32 32"><defs><linearGradient id="way-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#feda75" /><stop offset="45%" stopColor="#d62976" /><stop offset="100%" stopColor="#4f5bd5" /></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#way-ig)" /><rect x="8" y="8" width="16" height="16" rx="5" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="16" cy="16" r="4" fill="none" stroke="#fff" strokeWidth="2" /></svg>
    </div>
  );
}

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
          {WAYS.map((way, index) => (
            <Reveal key={way.n} className={`home-way-slot home-way-slot--${way.n}`} from="up" distance={18} delay={index * 0.06}>
              <article className="home-way">
                <div className="home-way__media">
                  <img src={way.image} alt={t(`home.way${way.n}Title`)} width="1280" height="800" />
                  {"phone" in way ? <img className="home-way__phone" src={way.phone} alt="" width="390" height="700" /> : null}
                  {"marks" in way ? <BrandMarks /> : null}
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

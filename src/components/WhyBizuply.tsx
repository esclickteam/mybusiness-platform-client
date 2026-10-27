"use client";

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { WhyArt } from "./HomeVisuals";
import "../styles/homeWow.css";

const CARDS = [
  { title: "feature1Title", text: "feature1Text" },
  { title: "feature2Title", text: "feature2Text" },
  { title: "feature3Title", text: "feature3Text" },
  { title: "feature4Title", text: "feature4Text" },
] as const;

export default function WhyBizuply() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="home-why-stage" dir={getTextDirection(i18n.language)}>
      <div className="home-why-stage__glow" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="home-why-stage__eyebrow">{t("why.eyebrow")}</p>
          <h2>{t("why.titleTop")}</h2>
          <p className="home-why-stage__lead">{t("why.subtitle")}</p>
        </div>
        <div className="home-why-grid">
          {CARDS.map((card, index) => (
            <article key={card.title} className="home-why-card">
              <div className="home-why-card__media">
                <WhyArt index={index} />
              </div>
              <div>
                <h3>{t(`why.${card.title}`)}</h3>
                <p>{t(`why.${card.text}`)}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/pricing" className="home-cta home-cta--primary">
            {t("why.planCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

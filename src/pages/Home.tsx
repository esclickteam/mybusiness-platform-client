"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import HeroSection from "../components/HeroSection";
import ScrollStory from "../components/ScrollStory";
import WhyBizuply from "../components/WhyBizuply";
import FAQMini from "../components/FAQMini";
import FinalCTA from "../components/FinalCTA";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <Helmet>
        <title>{t("seo.homeTitle")}</title>

        <meta name="description" content={t("seo.homeDescription")} />

        <meta property="og:title" content={t("seo.homeTitle")} />

        <meta property="og:description" content={t("seo.homeDescription")} />

        <meta property="og:type" content="website" />
      </Helmet>

      <HeroSection />

      <ScrollStory />

      <WhyBizuply />

      <FAQMini />

      <FinalCTA />
    </main>
  );
}

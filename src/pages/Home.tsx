"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { marketingPublicUrl } from "../lib/localePath.mjs";

import HeroSection from "../components/HeroSection";
import PlatformDomains from "../components/PlatformDomains";
import ProductsGrid from "../components/ProductsGrid";
import ScrollStory from "../components/ScrollStory";
import WhyBizuply from "../components/WhyBizuply";
import HomeServices from "../components/HomeServices";
import FAQMini from "../components/FAQMini";

export default function Home() {
  const { t, i18n } = useTranslation();
  const canonical = marketingPublicUrl("/", i18n.language);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-800" dir={getTextDirection(i18n.language)}>
      <Helmet>
        <title>{t("seo.homeTitle")}</title>

        <meta name="description" content={t("seo.homeDescription")} />

        <link rel="canonical" href={canonical} />

        <meta property="og:title" content={t("seo.homeTitle")} />

        <meta property="og:description" content={t("seo.homeDescription")} />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonical} />
      </Helmet>

      <HeroSection />

      <PlatformDomains />

      <ProductsGrid />

      <ScrollStory />

      <WhyBizuply />

      <HomeServices />

      <FAQMini />
    </main>
  );
}

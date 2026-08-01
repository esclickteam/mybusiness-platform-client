"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import HeroSection from "../components/HeroSection";
import ProductsGrid from "../components/ProductsGrid";
import ScrollStory from "../components/ScrollStory";
import WhyBizuply from "../components/WhyBizuply";
import FAQMini from "../components/FAQMini";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-800" dir="rtl">
      <Helmet>
        <title>{t("seo.homeTitle")}</title>

        <meta name="description" content={t("seo.homeDescription")} />

        <link rel="canonical" href="https://bizuply.com/" />

        <meta property="og:title" content={t("seo.homeTitle")} />

        <meta property="og:description" content={t("seo.homeDescription")} />

        <meta property="og:type" content="website" />

        <meta property="og:url" content="https://bizuply.com/" />
      </Helmet>

      <HeroSection />

      <ProductsGrid />

      <ScrollStory />

      <WhyBizuply />

      <FAQMini />
    </main>
  );
}

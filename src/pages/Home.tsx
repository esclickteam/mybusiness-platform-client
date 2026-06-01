"use client";

import React from "react";
import { Helmet } from "react-helmet-async";

import HeroSection from "../components/HeroSection";
import ScrollStory from "../components/ScrollStory";
import WhyBizuply from "../components/WhyBizuply";
import FAQMini from "../components/FAQMini";
import FinalCTA from "../components/FinalCTA";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <Helmet>
        <title>Bizuply — Run your business. All in one place.</title>

        <meta
          name="description"
          content="A modern business platform with a professional business page, collaborations, CRM and AI."
        />

        <meta
          property="og:title"
          content="Bizuply — Run your business. All in one place."
        />

        <meta
          property="og:description"
          content="A modern business platform with a professional business page, collaborations, CRM and AI."
        />

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
import React from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "../components/home/HeroSection";
import ScrollStory from "../components/home/ScrollStory";
import WhyBizUply from "../components/home/WhyBizUply";
import FAQMini from "../components/home/FAQMini";
import FinalCTA from "../components/home/FinalCTA";
import "../styles/Home.css";


export default function Home() {
  return (
    <main className="home-page">
      <Helmet>
        <title>Bizuply — Run your business. All in one place.</title>
        <meta
          name="description"
          content="A modern business platform with a professional business page, collaborations, CRM and AI."
        />
      </Helmet>

      <HeroSection />
      <ScrollStory />
      <WhyBizUply />
      <FAQMini />
      <FinalCTA />
    </main>
  );
}

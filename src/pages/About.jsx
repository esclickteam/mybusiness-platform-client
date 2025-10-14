import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/About.css";

function About() {
  return (
    <div className="about-container">
      <Helmet>
        <title>About BizUply | All-in-One Business Management Platform</title>
        <meta
          name="description"
          content="Learn about BizUply — an all-in-one SaaS platform that helps business owners manage clients, communication, scheduling, and growth efficiently."
        />
        <meta
          name="keywords"
          content="BizUply, business management, SaaS platform, CRM, automation, AI tools, small business software, business collaboration"
        />
        <link rel="canonical" href="https://bizuply.com/about" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content="About BizUply" />
        <meta
          property="og:description"
          content="Discover BizUply — the smart business management platform that simplifies communication, collaboration, and growth."
        />
        <meta property="og:url" content="https://bizuply.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About BizUply" />
        <meta
          name="twitter:description"
          content="BizUply helps small and medium businesses manage clients, automation, and communication — all in one platform."
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      <h1 className="about-title">About BizUply</h1>

      <p className="about-paragraph">
        Welcome to <strong>BizUply</strong> — a modern SaaS platform built to
        help business owners manage every aspect of their operations in one
        intuitive place. From client communication and reputation management to
        collaborations and automation — BizUply connects everything that matters
        to your business. Founded by entrepreneurs who understand real business
        challenges, our mission is to simplify management, strengthen
        connections, and support long-term growth.
      </p>

      <h2 className="about-section-title">Our Vision</h2>
      <p className="about-paragraph">
        We believe technology should work for business owners — not the other
        way around. Our vision is to make powerful business tools accessible,
        simple, and effective for every small and medium-sized business. BizUply
        empowers entrepreneurs to grow smarter by combining usability,
        innovation, and real human connection.
      </p>

      <h2 className="about-section-title">Our Journey</h2>
      <p className="about-paragraph">
        BizUply was founded with one goal — to bring all essential business
        tools under one roof. Instead of managing separate systems for CRM,
        scheduling, messaging, reviews, and partnerships, we created a unified
        platform that simplifies everything. Built with real user feedback,
        BizUply continues to evolve with AI-driven insights that make daily
        management faster, easier, and more meaningful.
      </p>

      <h2 className="about-section-title">What BizUply Offers</h2>
      <ul className="about-list">
        <li>
          <strong>Smart CRM & Communication:</strong> Manage customer data,
          messages, and relationships efficiently from one dashboard.
        </li>
        <li>
          <strong>Interactive Business Page:</strong> Showcase your services,
          reviews, and chat directly with clients.
        </li>
        <li>
          <strong>Ratings & Reviews System:</strong> Build credibility with
          verified client feedback.
        </li>
        <li>
          <strong>Business Collaborations:</strong> Connect with complementary
          businesses to create new growth opportunities.
        </li>
        <li>
          <strong>AI Business Assistant:</strong> Automate tasks, analyze
          activity, and get intelligent recommendations to boost performance.
        </li>
      </ul>

      <h2 className="about-section-title">Our Values</h2>
      <p className="about-paragraph">
        BizUply is built on three core principles that guide everything we do:
      </p>
      <ul className="about-list">
        <li>
          <strong>Transparency & Simplicity —</strong> Intuitive tools that
          empower you to focus on what truly matters.
        </li>
        <li>
          <strong>Innovation with Purpose —</strong> Practical solutions inspired
          by real business challenges.
        </li>
        <li>
          <strong>Community & Collaboration —</strong> A growing network of
          professionals dedicated to shared success.
        </li>
      </ul>

      <h2 className="about-section-title">Looking Ahead</h2>
      <p className="about-paragraph">
        We’re continuously improving BizUply to be the most reliable digital
        workspace for small and medium businesses. Our goal is to empower every
        entrepreneur with tools, insights, and automation that drive efficient,
        sustainable growth.
      </p>

      <h2 className="about-section-title">In a Few Words</h2>
      <p className="about-paragraph">
        BizUply is more than a management system — it’s a smarter way to run a
        business. By uniting technology, communication, and community, we help
        businesses stay organized, connected, and future-ready, so you can focus
        on what you do best: leading, creating, and growing.
      </p>
    </div>
  );
}

export default About;

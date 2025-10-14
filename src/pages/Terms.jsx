import React from "react";
import { Helmet } from "react-helmet-async"; // ✅ עודכן לגרסה הנכונה
import "../styles/Terms.css";

function Terms() {
  return (
    <div className="terms-container">
      <Helmet>
        {/* ✅ Basic SEO */}
        <title>Terms of Service & Privacy Policy - Bizuply</title>
        <meta
          name="description"
          content="Bizuply Terms of Service & Privacy Policy — usage rules, security, refunds, copyright, and accessibility for businesses using the platform."
        />
        <meta
          name="keywords"
          content="Bizuply, Terms of Service, Privacy Policy, Refund Policy, Copyright, Accessibility, Business Platform"
        />
        <link rel="canonical" href="https://bizuply.com/terms" />
        <meta name="robots" content="index, follow" />

        {/* ✅ Open Graph */}
        <meta property="og:title" content="Bizuply Terms of Service & Privacy Policy" />
        <meta
          property="og:description"
          content="Review Bizuply’s terms, privacy policy, and user rights for businesses and clients."
        />
        <meta property="og:url" content="https://bizuply.com/terms" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Bizuply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />

        {/* ✅ Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bizuply Terms of Service & Privacy Policy" />
        <meta
          name="twitter:description"
          content="Learn about Bizuply’s terms of service, privacy, and refund policies."
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      <h1 className="terms-title">Terms of Service & Privacy Policy</h1>

      <div className="terms-box">
        <section className="terms-section">
          <h2>General</h2>
          <p>
            The Bizuply platform (the “Website” and/or “App”) serves as a
            connection tool between users and service providers. Usage is
            subject to acceptance of these Terms of Service. Bizuply is not a
            party to any transaction between users and service providers and
            assumes no responsibility for the quality, accuracy, or reliability
            of services. All use of the platform constitutes agreement to these
            terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>Definitions</h2>
          <p>
            “User” – Any individual or legal entity browsing, registering, or
            using the Website. <br />
            “Service Provider” – Any third party offering services or products
            on the Website. <br />
            “Company” – Bizuply, operator of the platform. <br />
            “Services” – Any service provided via the Website including
            scheduling, CRM, communication, insights, etc. <br />
            “Content” – All data, reviews, ratings, text, images, video, or
            other material published on the Website.
          </p>
        </section>

        <section className="terms-section">
          <h2>Services Offered</h2>
          <p>
            Bizuply provides tools for small businesses and service providers:
            appointment scheduling, messaging, CRM, and AI-powered insights.
            Additional promotional or premium features may be offered from time
            to time. Bizuply reserves the right to update or change services
            without prior notice.
          </p>
        </section>

        <section className="terms-section">
          <h2>Privacy Policy</h2>
          <p>
            Bizuply respects your privacy. We may collect personal information
            (e.g., name, email, phone, payment details) as well as technical
            usage data (IP, browser, actions, cookies). Data is used to provide
            services, improve performance, prevent fraud, and meet legal
            obligations. Data will not be shared with third parties except as
            required to provide services, comply with law, or protect Bizuply’s
            rights.
          </p>
        </section>

        <section className="terms-section">
          <h2>Refund & Payment Policy</h2>
          <p>
            All payments for subscriptions or packages are final and
            non-refundable. If an account is suspended due to a violation of
            these Terms, no refund will be granted. Any disputes regarding
            third-party services must be handled directly with the service
            provider.
          </p>
        </section>

        <section className="terms-section">
          <h2>Intellectual Property</h2>
          <p>
            All content, design, code, and materials on Bizuply are protected by
            copyright and intellectual property laws. No use, reproduction, or
            distribution is permitted without prior written consent from
            Bizuply.
          </p>
        </section>

        <section className="terms-section">
          <h2>Accessibility</h2>
          <p>
            Bizuply is committed to providing an accessible digital experience
            for all users, including individuals with disabilities. If you
            encounter accessibility issues, please contact us at{" "}
            <a href="mailto:support@bizuply.com">support@bizuply.com</a>.
          </p>
        </section>

        <section className="terms-section">
          <h2>Governing Law</h2>
          <p>
            These Terms are governed by the laws of the United States. Any
            disputes shall be resolved exclusively in the competent courts of
            New York, USA.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Terms;

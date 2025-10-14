import React from "react";
import { Helmet } from "react-helmet-async"; // ✅ מעודכן לגרסה הנכונה
import "../styles/FAQ.css";

function FAQ() {
  return (
    <main className="faq-page">
      <Helmet>
        {/* ✅ Basic SEO */}
        <title>FAQ - Bizuply | Everything You Need to Know</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Bizuply – registration, appointments, security, and support."
        />
        <meta
          name="keywords"
          content="Bizuply FAQ, help, questions, support, business management, AI tools, booking system"
        />
        <link rel="canonical" href="https://bizuply.com/faq" />

        {/* ✅ Robots */}
        <meta name="robots" content="index, follow" />

        {/* ✅ Open Graph */}
        <meta property="og:title" content="Bizuply FAQ – Everything You Need to Know" />
        <meta
          property="og:description"
          content="Get answers about Bizuply's features, pricing, security, and business tools – all in one place."
        />
        <meta property="og:url" content="https://bizuply.com/faq" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bizuply" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />

        {/* ✅ Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bizuply FAQ – Everything You Need to Know" />
        <meta
          name="twitter:description"
          content="Find answers to frequently asked questions about Bizuply – registration, features, and support."
        />
        <meta name="twitter:image" content="https://bizuply.com/og-image.jpg" />

        {/* ✅ Structured Data (Rich Snippets) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Bizuply?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Bizuply is a smart platform that connects businesses and clients, enabling scheduling, messaging, AI insights, and collaboration in one place.",
                },
              },
              {
                "@type": "Question",
                "name": "Is there a free trial?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Bizuply offers a 14-day free trial with no credit card required.",
                },
              },
              {
                "@type": "Question",
                "name": "How do I join as a business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Click 'Join as a Business', complete your profile, and start managing appointments, clients, and collaborations from your dashboard.",
                },
              },
              {
                "@type": "Question",
                "name": "How do clients use the platform?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Clients can sign up for free, search businesses, book appointments, and chat directly — all from mobile or desktop.",
                },
              },
              {
                "@type": "Question",
                "name": "Is my data secure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Yes, Bizuply uses encryption and industry-standard practices to ensure your data is always protected.",
                },
              },
              {
                "@type": "Question",
                "name": "Where can I get support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "You can contact our support team anytime via the Contact Page for fast and friendly help.",
                },
              },
            ],
          })}
        </script>
      </Helmet>

      <h1 className="faq-title">Frequently Asked Questions</h1>

      <section className="faq-list">
        <details>
          <summary>What is Bizuply?</summary>
          <p>
            Bizuply is a smart platform that connects businesses and clients.
            It allows scheduling, messaging, AI-powered insights, and seamless
            collaboration — all in one place.
          </p>
        </details>

        <details>
          <summary>Is there a free trial?</summary>
          <p>
            Yes — Bizuply offers a 14-day free trial, with no credit card
            required.
          </p>
        </details>

        <details>
          <summary>How do I join as a business?</summary>
          <p>
            Simply click "Join as a Business", complete your profile, and start
            managing appointments, clients, and collaborations from one
            dashboard.
          </p>
        </details>

        <details>
          <summary>How do clients use the platform?</summary>
          <p>
            Clients can sign up for free, search businesses, book appointments,
            and chat directly — all from mobile or desktop.
          </p>
        </details>

        <details>
          <summary>Is my data secure?</summary>
          <p>
            Absolutely. Bizuply uses encryption and industry-standard practices
            to keep your information safe at all times.
          </p>
        </details>

        <details>
          <summary>Where can I get support?</summary>
          <p>
            Our support team is available through the{" "}
            <a href="/contact">Contact Page</a>, with fast and helpful
            responses.
          </p>
        </details>
      </section>
    </main>
  );
}

export default FAQ;

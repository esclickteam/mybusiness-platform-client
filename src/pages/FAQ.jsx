import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import "../styles/FAQ.css";

const FAQS = [
  {
    q: "What is Bizuply?",
    a: "Bizuply is a smart platform that connects businesses and clients. It combines scheduling, messaging, AI-powered insights, and collaborations — all in one place.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Bizuply offers a 14-day free trial with no credit card required.",
  },
  {
    q: "How do I join as a business?",
    a: "Click “Join as a Business”, complete your profile, and start managing clients, appointments, and collaborations from one dashboard.",
  },
  {
    q: "How do clients use the platform?",
    a: "Clients can sign up for free, search businesses, book appointments, and chat directly — from mobile or desktop.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. Bizuply uses encryption and industry-standard security practices to keep your data protected at all times.",
  },
  {
    q: "Where can I get support?",
    a: "You can contact our support team anytime via the Contact Page for fast and friendly help.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main className="faq-page">
      <Helmet>
        <title>FAQ - Bizuply | Everything You Need to Know</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Bizuply – registration, pricing, security, and support."
        />
        <link rel="canonical" href="https://bizuply.com/faq" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* =========================
          Header
      ========================= */}
      <header className="faq-header">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <p className="faq-subtitle">
          Everything you need to know about Bizuply — pricing, features,
          security, and getting started.
        </p>
      </header>

      {/* =========================
          FAQ List
      ========================= */}
      <section className="faq-container">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;

          return (
            <div
              key={i}
              className={`faq-item ${isOpen ? "open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() =>
                  setOpenIndex(isOpen ? null : i)
                }
              >
                <span>{item.q}</span>
                <span className="faq-icon">{isOpen ? "–" : "+"}</span>
              </button>

              {isOpen && (
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default FAQ;

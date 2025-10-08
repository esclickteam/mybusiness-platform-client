import React from "react";
import { Helmet } from "react-helmet";
import "../styles/FAQ.css";

function FAQ() {
  return (
    <main className="faq-page">
      <Helmet>
        <title>FAQ - Bizuply | Everything You Need to Know</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Bizuply – registration, appointments, security, and support."
        />
        <link rel="canonical" href="https://bizuply.com/faq" />
      </Helmet>

      <h1 className="faq-title">Frequently Asked Questions</h1>

      <section className="faq-list">
        <details>
          <summary>What is Bizuply?</summary>
          <p>
            Bizuply is a smart platform that connects businesses and clients. 
            It allows scheduling, messaging, AI-powered insights, and seamless collaboration — all in one place.
          </p>
        </details>

        <details>
          <summary>Is there a free trial?</summary>
          <p>
            Yes — Bizuply offers a 14-day free trial, with no credit card required.
          </p>
        </details>

        <details>
          <summary>How do I join as a business?</summary>
          <p>
            Simply click "Join as a Business", complete your profile, and start 
            managing appointments, clients, and collaborations from one dashboard.
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
            Absolutely. Bizuply uses encryption and industry-standard 
            practices to keep your information safe at all times.
          </p>
        </details>

        <details>
          <summary>Where can I get support?</summary>
          <p>
            Our support team is available through the <a href="/contact">Contact Page</a>, 
            with fast and helpful responses.
          </p>
        </details>
      </section>
    </main>
  );
}

export default FAQ;

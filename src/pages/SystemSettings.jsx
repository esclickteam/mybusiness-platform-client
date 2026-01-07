import React, { useState } from "react";
import "./faq.css";

const faqs = [
  {
    question: "What are System Settings in BizUply?",
    answer:
      "System Settings allow you to manage the core configuration of the BizUply platform, including preferences, permissions, and internal tools that affect how your business operates.",
  },
  {
    question: "Where can I manage my business and account preferences?",
    answer:
      "You can manage your business profile details, contact information, visibility settings, and general preferences directly from your dashboard. Changes are applied in real time across the platform.",
  },
  {
    question: "Which tools are considered part of the BizUply system?",
    answer:
      "BizUply includes Business Profiles, Dashboard & Analytics, CRM, Client Messaging, Business Collaborations, and internal system configuration tools.",
  },
  {
    question: "How does BizUply handle data security and privacy?",
    answer:
      "BizUply is built with strong security practices, including controlled access, secure data handling, and system-level safeguards to protect your business information.",
  },
  {
    question: "Can I control permissions and access within the system?",
    answer:
      "Yes. BizUply allows controlled access to system features based on your account and business configuration. Additional permissions may depend on your plan.",
  },
  {
    question: "How do system changes affect my dashboard and tools?",
    answer:
      "System updates are reflected immediately across your dashboard, CRM, messaging, and collaboration tools to ensure consistency.",
  },
  {
    question: "What should I do if something doesn’t work as expected?",
    answer:
      "Try refreshing the page and checking your connection. If the issue persists, visit the Troubleshooting & Errors section or contact Technical Support.",
  },
  {
    question: "Are system features updated automatically?",
    answer:
      "Yes. BizUply continuously deploys system improvements and updates automatically to ensure stability, performance, and new capabilities.",
  },
];

export default function SystemSettings() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {/* Header */}
      <h1 className="faq-title">BizUply System Settings</h1>

      <p className="faq-subtitle">
        Learn how the BizUply system works and how to manage your platform
        settings effectively.
      </p>

      {/* FAQ List */}
      <div className="faq-list">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={idx} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleIndex(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-question-${idx}`}
              >
                <span>{faq.question}</span>

                <span
                  className={`faq-plus ${isOpen ? "open" : ""}`}
                  aria-hidden
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  className="faq-answer"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

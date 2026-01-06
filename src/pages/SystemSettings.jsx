import React, { useState } from "react";

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
    <div
      style={{
        maxWidth: 860,
        margin: "3rem auto",
        padding: "0 20px",
        fontFamily: "Poppins, Inter, Arial, sans-serif",
        color: "#1f2937",
      }}
    >
      {/* Header */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: 8,
          fontSize: "2.2rem",
          fontWeight: 800,
          background: "linear-gradient(90deg, #6a11cb, #2575fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        BizUply System Settings
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          color: "#6b7280",
          fontSize: "1rem",
        }}
      >
        Learn how the BizUply system works and how to manage your platform
        settings effectively.
      </p>

      {/* FAQ List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                overflow: "hidden",
                transition: "box-shadow 0.2s ease",
              }}
            >
              <button
                onClick={() => toggleIndex(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-question-${idx}`}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  padding: "18px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                <span style={{ textAlign: "left" }}>{faq.question}</span>

                <span
                  style={{
                    fontSize: 20,
                    color: "#6366f1",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  style={{
                    padding: "0 20px 18px",
                    color: "#4b5563",
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                    animation: "fadeIn 0.2s ease",
                  }}
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

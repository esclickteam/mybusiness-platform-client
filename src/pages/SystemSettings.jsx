import React, { useState } from "react";

const faqs = [
  {
    question: "What are System Settings in BizUply?",
    answer: `System Settings allow you to control the core behavior of the BizUply platform.
This includes configuration options, platform preferences, and internal system tools that affect how your business operates within the system.`,
  },
  {
    question: "Where can I manage my business and account preferences?",
    answer: `You can manage your business profile details, contact information, visibility settings, and general preferences directly from your dashboard.
Any changes you make are applied across the platform in real time.`,
  },
  {
    question: "Which tools are considered part of the BizUply system?",
    answer: `The BizUply system includes:
- Business Profile management
- Dashboard and analytics
- CRM and client management
- Client messaging
- Business collaborations
- Internal system tools and configurations`,
  },
  {
    question: "How does BizUply handle data security and privacy?",
    answer: `BizUply is built with security and data protection in mind.
Access control, secure data handling, and system-level safeguards help ensure that your business information remains protected at all times.`,
  },
  {
    question: "Can I control permissions and access within the system?",
    answer: `Yes. BizUply allows controlled access to system features based on your account and business configuration.
Additional permission controls may be available depending on your plan and system setup.`,
  },
  {
    question: "How do system changes affect my dashboard and tools?",
    answer: `System setting updates are reflected immediately across the platform.
This ensures consistency between your dashboard, CRM, messaging, and collaboration tools.`,
  },
  {
    question: "What should I do if something in the system doesn’t work as expected?",
    answer: `First, refresh the page and make sure your internet connection is stable.
If the issue persists, check the Troubleshooting & Errors section or contact Technical Support with relevant details for faster assistance.`,
  },
  {
    question: "Are system features updated automatically?",
    answer: `Yes. BizUply continuously improves the platform.
System updates and improvements are deployed automatically to ensure stability, performance, and access to new features without manual action.`,
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
        maxWidth: 800,
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
        direction: "ltr",
        textAlign: "left",
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        BizUply System Settings – FAQs
      </h1>

      {faqs.map((faq, idx) => (
        <div
          key={idx}
          style={{
            borderBottom: "1px solid #ccc",
            padding: "1rem 0",
            overflowWrap: "break-word",
          }}
        >
          <button
            onClick={() => toggleIndex(idx)}
            aria-expanded={openIndex === idx}
            aria-controls={`faq-answer-${idx}`}
            id={`faq-question-${idx}`}
            style={{
              width: "100%",
              background: "rgba(85, 107, 47, 0.5)",
              border: "none",
              textAlign: "left",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              padding: "0.5rem 0.75rem",
              outline: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 6,
            }}
          >
            <span
              style={{
                userSelect: "none",
                color: "#f06292",
                marginRight: 10,
                fontWeight: "bold",
                fontSize: 24,
                lineHeight: 1,
              }}
            >
              ?
            </span>

            <span style={{ flexGrow: 1 }}>{faq.question}</span>

            <span style={{ fontSize: 24, lineHeight: 1 }}>
              {openIndex === idx ? "−" : "+"}
            </span>
          </button>

          {openIndex === idx && (
            <div
              id={`faq-answer-${idx}`}
              role="region"
              aria-labelledby={`faq-question-${idx}`}
              style={{
                marginTop: 10,
                whiteSpace: "pre-wrap",
                color: "#444",
                lineHeight: 1.6,
                textAlign: "left",
              }}
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
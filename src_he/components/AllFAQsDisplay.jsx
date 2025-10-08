import React, { useState, useEffect } from "react";
import { loadAllFAQs } from "./loadAllFAQs";

export default function AllFAQsDisplay() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await loadAllFAQs();
        setFaqs(data || []);
      } catch (err) {
        console.error("Failed to load FAQs:", err);
        setError(err.message || "Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <h3>Loading FAQs...</h3>
      </div>
    );

  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>
        <h3>Error loading FAQs</h3>
        <p>{error}</p>
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
        textAlign: "left",
        direction: "ltr",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: 28,
          marginBottom: 30,
          color: "#4b2aad",
        }}
      >
        All Questions & Answers
      </h1>

      {faqs.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          No FAQs available at the moment.
        </p>
      ) : (
        faqs.map((faq, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 16,
              borderBottom: "1px solid #ddd",
              borderRadius: 8,
              background: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => toggleFAQ(idx)}
              aria-expanded={openIndex === idx}
              aria-controls={`faq-answer-${idx}`}
              style={{
                width: "100%",
                background: openIndex === idx ? "#f4f0ff" : "#f9f9f9",
                border: "none",
                padding: "16px 20px",
                fontSize: 18,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "background 0.2s ease",
                color: "#333",
              }}
            >
              <span>{faq.question}</span>
              <span style={{ fontSize: 22 }}>
                {openIndex === idx ? "−" : "+"}
              </span>
            </button>

            {openIndex === idx && (
              <div
                id={`faq-answer-${idx}`}
                style={{
                  padding: "14px 20px",
                  background: "#fafafa",
                  color: "#444",
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { loadAllFAQs } from "./loadAllFAQs";

export default function AllFAQsDisplay() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const data = await loadAllFAQs();
        setFaqs(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) return <p>Loading FAQs...</p>;
  if (error) return <p>An error occurred: {error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20, direction: "rtl", textAlign: "right" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>All Questions & Answers</h1>
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: 15,
            borderBottom: "1px solid #ddd",
            paddingBottom: 10,
          }}
        >
          <button
            onClick={() => toggle(idx)}
            style={{
              width: "100%",
              background: "#f3f3f3",
              border: "none",
              padding: "12px 20px",
              fontSize: 18,
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 6,
              textAlign: "right",
            }}
            aria-expanded={openIndex === idx}
            aria-controls={`faq-answer-${idx}`}
          >
            <span>{faq.question}</span>
            <span style={{ fontSize: 24 }}>{openIndex === idx ? "−" : "+"}</span>
          </button>
          {openIndex === idx && (
            <div
              id={`faq-answer-${idx}`}
              style={{
                padding: "12px 20px",
                background: "#fafafa",
                whiteSpace: "pre-line",
                fontSize: 16,
                marginTop: 6,
                borderRadius: 6,
                color: "#222",
                lineHeight: 1.5,
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

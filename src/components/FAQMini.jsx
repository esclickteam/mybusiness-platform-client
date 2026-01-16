"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is there a free trial?",
    a: "Yes. You can start with a free trial. No credit card required.",
  },
  {
    q: "Does it work on mobile?",
    a: "Absolutely. Bizuply is fully responsive and works perfectly on mobile.",
  },
  {
    q: "Can I grow into more features?",
    a: "Yes. Start simple and unlock advanced tools as your business grows.",
  },
];

export default function FAQMini() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-mini">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-list">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;

          return (
            <div
              key={i}
              className={`faq-item ${isOpen ? "open" : ""}`}
            >
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="faq-q">{item.q}</span>
                <span className="faq-icon">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

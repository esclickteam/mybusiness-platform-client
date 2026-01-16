"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is there a free trial?",
    a: "Yes. You can start with a free trial and explore all core features. No credit card is required.",
  },
  {
    q: "Do I need a credit card to get started?",
    a: "No. You can try Bizuply without adding any payment details. Choose a plan only if you decide to continue.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. There are no long-term commitments, and you can cancel or change your plan at any time.",
  },
  {
    q: "Is this suitable for small businesses or solo founders?",
    a: "Yes. Bizuply is designed for freelancers, solo founders, and small teams who want to manage everything in one place.",
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
            <div key={i} className={`faq-item ${isOpen ? "open" : ""}`}>
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

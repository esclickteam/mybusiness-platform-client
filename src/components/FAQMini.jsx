"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What is Bizuply?",
    a: {
      lead:
        "Bizuply is an all-in-one platform that centralizes your business — business page, CRM, collaborations, and AI — so you can manage everything in one place.",
      bullets: [
        { title: "Business Page", text: "Turn visitors into leads with a professional profile." },
        { title: "CRM", text: "Track leads, clients, follow-ups, and pipeline stages." },
        { title: "Collaborations", text: "Work with other businesses and manage proposals & deals." },
        { title: "AI", text: "Get smart suggestions and next-step actions to move faster." },
      ],
      footer: "Everything stays connected — no more switching between scattered tools.",
    },
  },
  {
    q: "How does Bizuply help me get more clients?",
    a: {
      lead:
        "Bizuply helps you capture leads, respond faster, and stay consistent — which increases conversions over time.",
      bullets: [
        { title: "Capture leads", text: "Your business page turns traffic into inquiries." },
        { title: "Follow up faster", text: "CRM reminders and tasks keep leads warm." },
        { title: "Close more deals", text: "A clear pipeline view helps you move opportunities forward." },
      ],
      footer: "The result: fewer missed messages, faster follow-ups, and more closed clients.",
    },
  },
  {
    q: "What can I manage inside the CRM?",
    a: {
      lead:
        "Your CRM is where everything about a lead or client stays organized — so you always know what’s next.",
      bullets: [
        { title: "Leads & clients", text: "Keep every contact and inquiry in one place." },
        { title: "Tasks & follow-ups", text: "Set reminders, next steps, and due dates." },
        { title: "Notes & history", text: "Track conversations, status, and progress over time." },
        { title: "Pipeline stages", text: "Move deals through steps so nothing gets stuck." },
      ],
      footer: "No more spreadsheets or forgotten follow-ups — it’s all structured and searchable.",
    },
  },
  {
    q: "How does AI help in Bizuply?",
    a: {
      lead:
        "Bizuply AI helps you act faster by highlighting priorities and recommending next steps based on your activity.",
      bullets: [
        { title: "Next-step suggestions", text: "Get recommended actions for leads and deals." },
        { title: "Priority insights", text: "See what needs attention now — before it’s too late." },
        { title: "Faster responses", text: "Draft better replies and follow-ups in less time." },
      ],
      footer: "It’s like having a smart assistant inside your CRM — focused on results.",
    },
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
                  <p className="faq-lead">{item.a.lead}</p>

                  <ul className="faq-bullets">
                    {item.a.bullets.map((b, idx) => (
                      <li key={idx} className="faq-bullet">
                        <strong>{b.title}:</strong> {b.text}
                      </li>
                    ))}
                  </ul>

                  {item.a.footer && <p className="faq-footer">{item.a.footer}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

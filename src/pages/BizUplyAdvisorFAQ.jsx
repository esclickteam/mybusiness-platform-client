import React, { useState } from "react";
import "./faq.css";

const faqData = [
  {
    question: "What is the BizUply Advisor and how can it help me",
    answer: `
The BizUply Advisor is an advanced AI-based business and marketing advisory system designed to provide professional, personalized, and practical support for business, marketing, and operational challenges.

It provides:
• Immediate answers to professional questions
• Personalized recommendations based on your business data
• Strategic planning assistance
• Identification of opportunities and operational improvements

The advisor helps you make smarter, faster, and more informed decisions.
    `,
  },
  {
    question:
      "How do I pick a ready-made question or ask a free-form question in the BizUply Advisor",
    answer: `
You can use the advisor in two ways:

Ready-made questions:
• Choose from common business and marketing topics
• Get fast, focused answers for frequent needs

Free-form questions:
• Ask a specific or complex question
• Receive a personalized AI-driven response
• Get suggested next actions

Use ready-made questions for speed and free-form questions for deeper, tailored guidance.
    `,
  },
  {
    question: "Are the answers meant for all types of businesses",
    answer: `
The BizUply Advisor uses AI combined with your real business data to generate personalized insights.

Answers are tailored to:
• Your business profile
• Performance history
• Current activity
• Business goals

While highly effective, complex legal or financial issues may still require specialized human consulting.
    `,
  },
  {
    question: "How do I use the marketing advisor within BizUply",
    answer: `
The marketing advisor provides focused recommendations for digital and traditional marketing.

It helps you:
• Build monthly marketing plans
• Optimize ad spend
• Choose the right channels
• Improve conversion rates
• Increase exposure and engagement

Recommendations are data-driven and updated in real time.
    `,
  },
  {
    question: "What if my question doesn’t appear in the list",
    answer: `
You can ask any question freely using the free-form input.

The advisor:
• Analyzes your question in real time
• Provides a professional, relevant answer
• Suggests next actions or tools

This ensures accurate guidance even for unique or non-standard situations.
    `,
  },
  {
    question: "Is the service available 24/7",
    answer: `
Yes. The BizUply Advisor is available 24/7.

This allows:
• Immediate guidance anytime
• Faster decision-making
• Reduced delays and stress
• Support during nights, weekends, and holidays

Always-on access is a strategic advantage in today’s fast-paced business world.
    `,
  },
  {
    question: "How can I maximize the value from the BizUply Advisor",
    answer: `
To get the most value:
• Apply recommendations in daily operations
• Sync actions with CRM and dashboard
• Track performance results
• Ask follow-up questions

Consistent execution combined with AI guidance leads to measurable improvement.
    `,
  },
  {
    question: "How do I integrate the BizUply Advisor with other business systems",
    answer: `
BizUply supports integration with:
• CRM systems
• Business dashboards
• Marketing platforms
• Customer and order management tools

Real-time data sync ensures accurate, consistent insights and better decision-making.
    `,
  },
  {
    question: "What errors or issues might occur in the BizUply Advisor and how can I fix them",
    answer: `
Common issues and solutions include:

• Delayed responses: Check internet connection and refresh
• Data-sync issues: Verify business data and re-sync
• Login issues: Confirm permissions or reset password
• Technical bugs: Update browser or contact support

For unresolved issues, provide support with screenshots and system details.
    `,
  },
  {
    question: "How can I prevent recurring issues and errors in the BizUply Advisor",
    answer: `
Best practices:
• Keep business data up to date
• Ensure stable internet
• Use a modern, updated browser
• Manage permissions carefully
• Restart the system periodically
• Report issues promptly

These steps ensure reliable, smooth usage over time.
    `,
  },
];

export default function BizUplyAdvisorFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">FAQ – BizUply Advisor</h1>

      <div className="faq-list">
        {faqData.map((faq, idx) => {
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
                  style={{ whiteSpace: "pre-wrap" }}
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

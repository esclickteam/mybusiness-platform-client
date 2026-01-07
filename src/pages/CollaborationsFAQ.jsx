import React, { useState } from "react";
import "./faq.css";

const faqData = [
  {
    question: "What is a business collaboration and how can it grow my business",
    answer: `
A business collaboration is a partnership between two or more businesses working together toward shared goals such as marketing, sales, or service development.

Benefits include:
• Expanded market reach
• Shared marketing costs
• Access to new audiences
• Increased trust and credibility
• Stronger customer experience

Choosing partners with aligned values and goals ensures long-term success.
    `,
  },
  {
    question: "How do I publish a new collaboration offer in BizUply",
    answer: `
To publish a collaboration offer:
• Fill out the collaboration form with a clear title and description
• Define what your business offers and what you expect in return
• Add contact details, budget, and expiration date

Once published, offers are distributed to relevant businesses based on category, location, and collaboration type.
    `,
  },
  {
    question: "How do I identify and choose a suitable collaboration partner",
    answer: `
Key steps for choosing the right partner:
• Ensure alignment in values and goals
• Confirm target audiences complement each other
• Review business reputation and references
• Evaluate added value such as expertise or reach
• Hold discovery meetings to define roles and expectations

Tracking KPIs helps ensure collaboration success.
    `,
  },
  {
    question: "What are the best ways to manage collaborations effectively",
    answer: `
Successful collaboration management includes:
• Defining clear goals and KPIs
• Assigning roles and responsibilities
• Setting timelines and expectations
• Maintaining organized records
• Communicating regularly and transparently
• Monitoring performance and outcomes
• Addressing conflicts early

BizUply provides tools to support structured collaboration management.
    `,
  },
  {
    question: "How can I view and manage collaboration offers I’ve received",
    answer: `
In the Received Offers section you can:
• View all incoming collaboration proposals
• Filter and search offers
• Evaluate partner fit, budget, and timeline
• Approve or decline offers efficiently

Professional and timely responses increase success rates.
    `,
  },
  {
    question: "What does Sent Offers mean and how do I manage them",
    answer: `
Sent Offers include all collaboration proposals you’ve sent to other businesses.

Best practices:
• Track responses and follow-ups
• Document communications
• Set reminders for follow-up
• Be proactive in negotiations

Effective management increases conversion and reduces uncertainty.
    `,
  },
  {
    question: "Is there an expiration period for a collaboration offer",
    answer: `
Yes. You can define an expiration date and optional start/end dates.

Benefits:
• Better offer control
• Clear timelines
• Improved brand professionalism
• Operational flexibility

BizUply also supports digital agreements and electronic signatures.
    `,
  },
  {
    question: "What should I do if I can’t submit or publish a collaboration",
    answer: `
If submission fails, try:
• Completing all required fields
• Checking internet connectivity
• Refreshing the page (Ctrl + F5 / Cmd + Shift + R)
• Trying another browser or device
• Verifying user permissions
• Checking system maintenance notices

Contact support if the issue persists.
    `,
  },
  {
    question: "How do I communicate with a potential collaboration partner",
    answer: `
Communication options include:
• Using contact details in the offer
• BizUply’s internal messaging system
• Real-time chat for quick coordination
• Scheduling meetings when needed
• Documenting agreements and discussions

Clear, professional communication is essential.
    `,
  },
  {
    question: "How should conflicts or issues in collaborations be handled",
    answer: `
Best practices for handling conflicts:
• Maintain transparent, open communication
• Keep written records of agreements
• Define ground rules in advance
• Monitor performance and expectations
• Use mediation if necessary
• Conduct periodic review meetings

BizUply provides tools to support conflict resolution and collaboration tracking.
    `,
  },
];

export default function CollaborationsFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Business Collaborations – FAQ</h1>

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

import React, { useState } from "react";

const faqData = [
  {
    question: "❓ What is a business collaboration and how can it grow my business?",
    answer: `
A business collaboration is an agreement between two or more businesses to work together toward shared objectives—such as marketing, sales, service development, or improving customer experience. Collaborations expand reach, share advertising costs, provide access to new markets, and strengthen customer trust. It’s important to choose partners with aligned values and goals to avoid conflicts and ensure effective, long-term results. Integrated businesses can share information, create joint promotions, and strategically amplify one another.
    `,
  },
  {
    question: "❓ How do I publish a new collaboration offer in BizUply?",
    answer: `
To publish a collaboration, fill out a detailed form including: a clear title, a thorough description of the offer, what your business provides and what you’re seeking in return, contact details, budget, and expiration date. Be precise about needs and deliverables to focus inquiries and attract suitable partners. After posting, your offer is distributed to relevant businesses based on activity area, location, and collaboration type. Track incoming inquiries, approve or decline quickly, and maintain clear communication with potential partners.
    `,
  },
  {
    question: "❓ How do I identify and choose a suitable collaboration partner for my business?",
    answer: `
Choosing the right partner is key to collaboration success. First, ensure strong alignment between your company’s values and those of the potential partner so both sides operate with a shared mindset and goals. Also verify their target market fits yours to maximize impact.

Review the partner’s business track record, including shared clients and references, to confirm reliability and reputation. Assess whether they bring added value—such as complementary expertise, innovative technology, or access to new customers that you don’t currently reach.

Hold initial discovery meetings to define expectations, roles, timelines, and communication methods. This helps prevent future misunderstandings.

It’s also recommended to use digital partnership-management tools, including tracking KPIs (Key Performance Indicators).
    `,
  },
  {
    question: "❓ What are the best ways to manage collaborations effectively?",
    answer: `
Successful collaboration management requires deliberate planning and attention to key areas:

- Define clear, measurable goals.
- Assign roles and responsibilities.
- Align expectations.
- Plan realistic timelines.
- Use technology tools to manage partnerships.
- Keep organized records of decisions, costs, and outcomes.
- Address conflicts quickly and transparently.
- Measure and monitor continuously.
- Assess risks and create contingency plans.
- Maintain regular, open communication.

The BizUply platform supports these processes with tools for smart collaboration management.
    `,
  },
  {
    question:
      "❓ How can I view collaboration offers I’ve received and manage them effectively?",
    answer: `
In the “Received Offers” tab you’ll see all offers submitted by other businesses. Use the built-in filters and search, assess offer fit, partner credibility, budget, and validity period.

Timely responses and professional, open communication are crucial for success.

If an offer isn’t a fit, decline politely and professionally.
    `,
  },
  {
    question:
      "❓ What does “Sent Offers” mean and how do I manage them effectively?",
    answer: `
The “Sent Offers” category lists all collaboration offers you’ve submitted to other businesses. Track progress regularly, document outreach and responses, set follow-up timelines, be proactive in negotiations, and prepare a negotiation script.

Effective management of these offers increases your business potential and reduces uncertainty.
    `,
  },
  {
    question: "❓ Is there an expiration period for a collaboration?",
    answer: `
Yes. You can set an expiration date for an offer, limiting how long it remains active. You can also define exact start and end times.

Benefits: smarter offer management, stronger brand image, and operational flexibility.

BizUply supports creating digital agreements with electronic signatures directly in the platform.
    `,
  },
  {
    question:
      "❓ What should I do if I can’t submit or publish a collaboration?",
    answer: `
To troubleshoot submission issues:

- Make sure all required form fields are completed.
- Check for a stable internet connection.
- Check if there’s planned system maintenance.
- Refresh the page (Ctrl+F5).
- Try a different browser or device.
- Confirm you have the proper permissions.
- If the issue persists, contact technical support with full details.
    `,
  },
  {
    question: "❓ How do I communicate with a potential partner?",
    answer: `
Communication with a potential partner includes:

- Using the contact details provided in the offer form.
- BizUply’s internal messaging and business chat.
- Real-time communication for coordination and clarifications.
- Maintaining professional, transparent, and clear exchanges.
- Documenting conversations and agreements.
- Scheduling meetings and, if needed, communicating outside the platform.
- Providing ongoing updates to partners.
    `,
  },
  {
    question:
      "❓ How do we handle conflicts or issues in a business collaboration?",
    answer: `
Collaboration conflicts:

- Keep communication open, consistent, and transparent.
- Keep organized records of decisions and agreements.
- Set ground rules and procedures in advance.
- Use monitoring and reporting tools within the platform.
- Seek mediation if necessary.
- Contact technical support for technical issues.
- Set periodic review checkpoints.
- Stay flexible and open-minded.
- Provide training on partnership management.
- Maintain a positive, proactive approach.

BizUply provides tools and support for professional, effective collaboration management.
    `,
  },
];

export default function CollaborationsFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        padding: 20,
        direction: "ltr",
        textAlign: "left",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 25 }}>
        Business Collaborations – FAQ
      </h1>
      {faqData.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: 15,
            borderBottom: "1px solid #ddd",
            paddingBottom: 10,
          }}
        >
          <button
            onClick={() => toggle(index)}
            style={{
              width: "100%",
              textAlign: "left",
              background: "rgba(85, 107, 47, 0.5)",
              border: "none",
              padding: "12px 20px",
              fontSize: 18,
              fontWeight: "bold",
              cursor: "pointer",
              outline: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 6,
            }}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <span>{item.question}</span>
            <span style={{ fontSize: 24, lineHeight: 1 }}>
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div
              id={`faq-answer-${index}`}
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
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

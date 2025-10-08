```javascript
import React, { useState } from "react";

const faqData = [
  {
    question: "❓ What is a business collaboration and how can it advance my business?",
    answer: `
A business collaboration is an agreement between two or more businesses to work together to achieve shared business goals, such as marketing, sales, service development, or improving customer experience. Collaborations allow for increased exposure, shared advertising costs, access to new markets, and strengthening customer trust. It is important to choose partners with shared values and aligned goals to avoid conflicts and ensure effective long-term results. Collaborating businesses can share information, develop joint promotions, and strategically empower each other.
    `,
  },
  {
    question: "❓ How to publish a new collaboration proposal in the Esclick system?",
    answer: `
To publish a collaboration, you need to fill out a detailed form that includes: a clear title, a detailed description of the proposal, what the business offers and what it seeks to receive, contact details, budget, and the validity of the proposal. It is important to be precise in defining needs and offers to target inquiries and receive suitable partners. After publication, the proposal is distributed to relevant businesses according to filtering by field of activity, location, and type of collaboration. It is advisable to regularly monitor inquiries, quickly approve or reject proposals, and maintain clear communication with potential partners.
    `,
  },
  {
    question: "❓ How to identify and choose a suitable collaboration partner for my business?",
    answer: `
Choosing the right partner is a key factor in the success of business collaboration. First, ensure there is a complete alignment between your company's values and those of the potential partner, so both parties operate in the same spirit and with a common goal. Additionally, it is important to check that the partner's target market is suitable for your business to maximize benefits.

It is advisable to examine the partner's business record, including shared clients and recommendations to ensure reliability and a good reputation. Assess whether the partner brings added value, such as complementary professional expertise, innovative technology, or access to new customers not present in your network.

It is very important to hold initial introductory meetings, where clear expectations, roles, timelines, and communication methods between the parties are defined. This can help prevent misunderstandings in the future.

Additionally, it is recommended to use digital tools for managing partnerships, including tracking KPIs (Key Performance Indicators).
    `,
  },
  {
    question: "❓ What are the best ways to manage collaborations effectively?",
    answer: `
Managing successful collaborations requires careful planning and emphasis on several key aspects:

- Defining clear and measurable goals and objectives.
- Division of roles and responsibilities.
- Coordinating expectations.
- Planning timelines.
- Using technological tools for managing collaborations.
- Organized documentation of decisions, expenses, and results.
- Quick and transparent conflict management.
- Continuous measurement and control.
- Risk assessment and backup planning.
- Regular and communicative contact.

The Esclick platform supports all these processes and provides tools for managing smart collaborations.
    `,
  },
  {
    question: "❓ How can I view the collaboration proposals I have received and manage them effectively?",
    answer: `
In the "Received Proposals" tab, all proposals received from other businesses are displayed. It is recommended to use the built-in filtering and search tools, conduct a thorough assessment of the proposal's suitability, the partner's reliability, budget, and the proposal's validity.

Quick response, open and professional communication is important for the success of the collaboration.

If the proposal is not suitable, it is advisable to decline it professionally and politely.
    `,
  },
  {
    question: "❓ What does \"Sent Proposals\" mean and how to manage them effectively?",
    answer: `
The "Sent Proposals" category includes all collaboration proposals you have submitted and sent to other businesses. It is advisable to maintain regular tracking, document inquiries and responses, set timelines for follow-up, be proactive in managing negotiations, and prepare a negotiation script.

Effective management of these proposals increases your business potential and reduces uncertainties.
    `,
  },
  {
    question: "❓ Is there a time limit for the validity of a collaboration?",
    answer: `
Yes, you can set an expiration date for the proposal, which will limit the proposal period in the system. You can also set specific start and end times.

Benefits: Smart management of proposals, improving the business's image, operational flexibility.

Esclick supports the creation of digital agreements with electronic signatures directly in the system.
    `,
  },
  {
    question: "❓ What should I do if I cannot send or publish a collaboration?",
    answer: `
To resolve issues with sending a collaboration:

- Ensure all fields in the form are filled out.
- Check for a stable internet connection.
- Check the system's maintenance status.
- Refresh the page (Ctrl+F5).
- Try a different browser or device.
- Ensure you have the appropriate permissions.
- Contact technical support with full details if the problem persists.
    `,
  },
  {
    question: "❓ How to communicate with a potential partner?",
    answer: `
Communication with a potential partner includes:

- Using the contact details in the proposal form.
- An internal messaging system and business chat in the Esclick system.
- Real-time communication for coordination, inquiries, and clarifications.
- Maintaining professional, transparent, and clear communication.
- Documenting conversations and agreements.
- Scheduling meetings and communicating outside the platform if necessary.
- Regularly updating partners.
    `,
  },
  {
    question: "❓ How to deal with conflicts or issues in business collaboration?",
    answer: `
Conflicts in collaboration:

- Maintaining open, consistent, and transparent communication.
- Organized documentation of decisions and agreements.
- Setting procedures and rules of engagement in advance.
- Using monitoring and reporting tools in the system.
- Seeking mediation if necessary.
- Contacting technical support for technical issues.
- Setting periodic review points.
- Maintaining flexibility and openness.
- Education and training for partnership management.
- A positive and proactive approach.

Esclick provides tools and support for professional and efficient management of collaborations.
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
        direction: "rtl",
        textAlign: "right",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 25 }}>
        Questions and Answers - Business Collaborations
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
              textAlign: "right",
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
```
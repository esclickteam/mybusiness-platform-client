import React, { useState } from "react";
import "./faq.css";

const faqData = [
  {
    question: "What is a CRM system and how does it help manage my business",
    answer: `
A CRM (Customer Relationship Management) system is a core tool for managing customer relationships in one centralized place.

It allows you to:
• Store and organize customer information
• Track appointments, services, and interactions
• Improve communication and customer retention
• Analyze customer behavior and performance
• Make data-driven business decisions

On BizUply, the CRM is fully integrated with scheduling, messaging, and analytics tools for efficient management.
    `,
  },
  {
    question:
      "What data can I see in a customer profile and how can I use it",
    answer: `
A customer profile includes:
• Contact details (phone, email, address)
• Service and purchase history
• Upcoming and past appointments
• Notes and interaction logs

Using this data helps you:
• Deliver personalized service
• Improve retention and loyalty
• Identify sales and marketing opportunities
• Reduce cancellations with reminders
• Improve internal coordination
    `,
  },
  {
    question: "How are scheduling and bookings managed in the CRM",
    answer: `
Scheduling is managed through a dedicated interface showing all bookings and availability.

Features include:
• Adding, editing, and canceling appointments
• Automatic notifications to customers
• Calendar synchronization
• Optional advance payments
• Reminder messages

Accurate scheduling improves efficiency and customer satisfaction.
    `,
  },
  {
    question: "Can I edit or cancel existing bookings and how does it work",
    answer: `
Yes. Bookings can be edited or canceled directly from the scheduling interface.

The system:
• Automatically notifies customers
• Keeps a full history log
• Updates availability in real time

To reduce cancellations:
• Use reminders
• Define a clear cancellation policy
• Offer flexible rescheduling options
    `,
  },
  {
    question: "How can I add or update services and products in the CRM",
    answer: `
Services can be managed in the Services tab.

You can define:
• Service description
• Price
• Duration
• Special terms

Accurate service setup prevents scheduling conflicts and improves customer experience.
    `,
  },
  {
    question: "How do I manage the customer list and perform searches",
    answer: `
The Customers tab provides:
• A full customer list
• Advanced search and filtering
• Appointment and communication history
• Notes and status indicators

Good customer management improves service quality and operational control.
    `,
  },
  {
    question: "What should I do if data is not updating or the system has issues",
    answer: `
Try the following steps:
• Perform a hard refresh (Ctrl + F5 / Cmd + Shift + R)
• Check your internet connection
• Log out and log back in
• Clear cache and cookies
• Try another browser or device
• Check system maintenance messages

If issues persist, contact technical support with screenshots and details.
    `,
  },
  {
    question: "How can I analyze and improve customer performance using the CRM",
    answer: `
CRM analytics help you:
• Identify active and high-value customers
• Track responses to campaigns
• Improve service response times
• Detect churn risks early
• Create personalized offers
• Define KPIs and success metrics

Using CRM insights improves sales, retention, and customer satisfaction.
    `,
  },
  {
    question: "What is the difference between a CRM and an appointments-only system",
    answer: `
An appointments system focuses only on scheduling and time management.

A CRM provides:
• Full customer profiles
• Interaction history
• Analytics and reports
• Automated reminders
• Marketing and retention tools

Together, they provide a complete business management solution.
    `,
  },
  {
    question: "What should I do if I encounter errors in the CRM or scheduling system",
    answer: `
If errors occur:
• Check internet stability
• Refresh the system
• Review maintenance notifications
• Verify input accuracy
• Document the issue with screenshots
• Contact support with full details

Quick resolution helps prevent disruptions and data issues.
    `,
  },
];

export default function CrmFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">CRM & Scheduling – FAQ</h1>

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

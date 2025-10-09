import React, { useState } from "react";

const faqData = [
  {
    question: "❓ What is a CRM system and how does it help manage my business?",
    answer: `
A CRM (Customer Relationship Management) system is a core technology tool for managing your business’s customer relationships. It lets you organize, store, and track all relevant customer information in one accessible, structured place. The system improves communication with customers, appointment coordination, order management, and customer retention. With CRM you can analyze customer behavior, offer personalized service, and increase loyalty. Using a CRM streamlines sales and service processes, saves time and resources, and enables data-driven decisions. On the BizUply platform, the CRM is tailored to your business needs and integrates with additional tools for efficient management.
    `,
  },
  {
    question:
      "❓ What data can I see in a customer's profile in the CRM, and how do I use it for the business?",
    answer: `
In the CRM customer profile you’ll find comprehensive details including: contact info (phone, email, physical address), purchase history, previously ordered services, and upcoming appointments.

How to use this data to benefit the business:
- Deliver personalized service to boost satisfaction and increase conversion.
- Retain customers and maintain ongoing, high-quality communication.
- Use reminders and schedule management to reduce cancellations.
- Identify sales and marketing opportunities.
- Improve internal processes and sync across service teams.
- Spot problematic customers or those with growth potential.
    `,
  },
  {
    question: "❓ How are scheduling and bookings managed in the CRM?",
    answer: `
Scheduling is handled via a dedicated tab that presents all appointments, time slots, and bookings clearly and neatly. You can add, edit, and cancel bookings, and the system automatically notifies both the customer and the business owner.

How to encourage customers to book:
- Make it simple via the website, app, or direct links.
- Automatic reminders via SMS or email.
- Option to pay in advance at booking.
- Available customer support.
- Sync with customer calendars to prevent duplicates and errors.

What to watch for when scheduling:
- Confirm resource availability.
- Accurate customer details.
- Record the appointment purpose.
- Send alerts and updates.
- Manage workload and set a clear cancellation policy.
    `,
  },
  {
    question:
      "❓ Can I edit or cancel existing bookings, and how does that process work?",
    answer: `
Yes. You can edit or cancel bookings from the scheduling interface using “Edit” and “Cancel” actions. The system automatically updates the customer and maintains a full history log.

How to reduce cancellations:
- Send automatic reminders.
- Offer flexible scheduling within set limits.
- Communicate a clear cancellation policy.
- Optimize availability.

How to retain customers:
- Maintain consistent, personal communication.
- Track and improve satisfaction.
- Offer perks and benefits for returning customers.
- Provide professional and attentive service.
    `,
  },
  {
    question:
      "❓ How can I add or update services and products in the CRM?",
    answer: `
In the “Services” tab you can add or update services, including description, price, duration, and special service terms. It’s important to define accurate service duration to prevent calendar overlaps and manage workload efficiently.

After saving, the service is automatically added to the booking interface.

It’s recommended to update services regularly to prevent issues and improve the customer experience.
    `,
  },
  {
    question:
      "❓ How do I manage the customer list and perform efficient searches?",
    answer: `
The “Customers” tab shows a detailed list with key information. The system includes an advanced search engine for quick filtering by name, phone, or partial info.

Good management includes tracking appointment history, bookings, communications, and notes.

How to handle frequent cancellations:
- A clear cancellation policy.
- Personal outreach to customers with problematic history.
- Flexible options and reminders.
- Limit bookings or require a deposit when needed.
    `,
  },
  {
    question:
      "❓ What should I do if the system has issues or data isn’t updating?",
    answer: `
Troubleshooting steps:
1. Hard refresh the browser (Ctrl+F5 or Cmd+Shift+R).
2. Ensure a stable, fast internet connection.
3. Log out and log back in.
4. Try a different browser or device.
5. Clear cache and cookies.
6. Check system messages and planned maintenance.
7. Contact technical support with detailed documentation.

Issues may stem from server load, network problems, outdated browsers, cache conflicts, or system maintenance.

Tips for stability:
- Keep your browser updated.
- Restart the system periodically.
- Back up important data.
- Follow BizUply’s notification center.
    `,
  },
  {
    question:
      "❓ How can I analyze and improve customer performance using the CRM?",
    answer: `
The system provides tools to analyze customer data for better service and increased sales:

1. Analyze purchase/service history to identify active customers and opportunities.
2. Track responses to promotions/campaigns to improve marketing budgets.
3. Reports on response times and inquiry handling to improve service.
4. Keep a full log of all customer interactions.
5. Tailor personal offers for customers.
6. Identify churn-risk customers and intervene early.
7. Share info across staff to improve service consistency.

Use the data to define KPIs, run targeted campaigns, and improve processes and loyalty.
    `,
  },
  {
    question:
      "❓ What’s the difference between a CRM and an appointments-only system?",
    answer: `
An appointments system focuses on time management and scheduling between the business and customers, including setting dates, approvals, cancellations, and timetables.

A CRM is a holistic solution that also includes comprehensive customer information management, interaction logs, data analysis, quotes and reminders, and automated marketing.

Both systems complement each other and are fully synchronized, enabling centralized management via the business dashboard.

The combination streamlines operations, improves satisfaction, and provides a competitive advantage.
    `,
  },
  {
    question:
      "❓ What should I do if I encounter errors or issues in the CRM and scheduling system?",
    answer: `
To handle errors:
- Check internet connection and hard-refresh (Ctrl+F5 or Cmd+Shift+R).
- Check system messages for maintenance or updates.
- Identify when and how the error occurs.
- Ensure inputs are correct and complete.
- Contact support with a detailed description and screenshots.
- Ensure backups are available.
- Use monitoring tools for early alerts.

Quick handling prevents data loss, disruptions, and supports continuous operational improvement.
    `,
  },
];

export default function CrmFAQ() {
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
        CRM & Scheduling – FAQ
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

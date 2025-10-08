```javascript
import React, { useState } from "react";

const faqData = [
  {
    question: "❓ What is a CRM system and how does it contribute to managing my business?",
    answer: `
A CRM (Customer Relationship Management) system is a central technological tool for managing customer relationships in your business. It allows you to organize, store, and track all relevant information about customers in one accessible and orderly place. The system helps improve communication with customers, schedule meetings, manage orders, and retain customers. With CRM, you can analyze customer behaviors, offer personalized service, and increase customer loyalty. Using CRM streamlines sales and service processes, saves time and resources, and enables you to make data-driven decisions. On the Esclic platform, the CRM system is integrated in a way that is tailored to your business characteristics and allows integration with additional tools for efficient management.
    `,
  },
  {
    question: "❓ What data and details can be seen in the customer profile in the CRM system? And how can they be used for the benefit of the business?",
    answer: `
In the customer profile in the CRM system, you can access comprehensive and detailed information including: contact details (phone, email, physical address), purchase history, and services the customer has ordered in the past, as well as future meeting dates.

How to use this information for the benefit of the business:
- Tailoring personalized service that increases satisfaction and raises sales chances.
- Customer retention and maintaining continuous and quality relationships.
- Reminders and schedule management to reduce cancellations.
- Identifying sales and marketing opportunities.
- Improving internal processes and synchronization between service teams.
- Identifying problematic customers or those with growth potential.
    `,
  },
  {
    question: "❓ How is the management of appointments and orders carried out in the CRM system?",
    answer: `
Appointment management is done through a dedicated tab that displays all meetings, appointments, and orders in an organized and clear manner. You can add, edit, and cancel appointments, and the system sends automatic updates to the customer and the business owner.

How to encourage customers to schedule appointments?
- Simple accessibility through the website, app, or direct links.
- Automatic reminders via SMS or email.
- Option for advance payment at the time of scheduling.
- Customer service available for support.
- Synchronization with customer calendars to prevent duplicates and errors.

What is important to pay attention to when scheduling an appointment?
- Confirmation of resource availability.
- Accuracy in customer details.
- Documentation of the purpose of the appointment.
- Sending notifications and updates.
- Managing loads and cancellation policies.
    `,
  },
  {
    question: "❓ Is it possible to edit or cancel existing appointments, and how is this process carried out?",
    answer: `
Yes, it is possible to edit or cancel appointments through the appointment management interface with "Edit" and "Cancel" buttons. The system sends automatic updates to the customer and maintains complete documentation of the history.

How to prevent cancellations?
- Sending automatic reminders.
- Providing flexibility in appointments with restrictions.
- Clarifying cancellation policies.
- Optimizing availability.

How to retain customers?
- Regular personal communication.
- Monitoring and improving satisfaction.
- Offers and benefits for returning customers.
- Professional and attentive service.
    `,
  },
  {
    question: "❓ How can services and products be added or updated in the CRM system?",
    answer: `
In the "Services" tab, you can add or update services, including description, price, duration, and special service conditions. It is important to define an accurate service duration to prevent duplicates in the calendar and manage load efficiently.

After saving, the service is automatically added to the order interface.

It is recommended to update services frequently to prevent issues and improve customer experience.
    `,
  },
  {
    question: "❓ How is the customer list managed in the system and how is efficient searching performed?",
    answer: `
In the "Customers" tab, there is a detailed list of all customers with essential details. The system includes an advanced search engine for quick filtering by name, phone, or partial information.

Proper management includes documenting meeting history, appointments, correspondence, and notes.

How to deal with frequent appointment cancellations?
- Clear policy regarding cancellations.
- Personal communication with customers with problematic history.
- Flexible offers and reminders.
- Limiting orders or requiring a deposit if necessary.
    `,
  },
  {
    question: "❓ What should be done in case of system malfunctions or when data is not updating?",
    answer: `
Steps to resolve issues:
1. Refresh the browser with Ctrl+F5 or Cmd+Shift+R.
2. Check for a stable and fast internet connection.
3. Log out of the system and log back in.
4. Try a different browser or device.
5. Clear cache and cookies.
6. Check system messages and scheduled maintenance.
7. Contact technical support with detailed documentation.

Issues are sometimes caused by server overload, network problems, outdated browser versions, cache conflicts, and system maintenance.

Tips for maintaining stability:
- Keep your browser updated.
- Occasionally close and reopen the system.
- Back up important data.
- Follow the Esclic alert system.
    `,
  },
  {
    question: "❓ How can customer performance be analyzed and improved using the CRM system?",
    answer: `
The system provides tools for analyzing customer data to improve service and increase sales:

1. Analyzing purchase history and services to identify active customers and opportunities.
2. Tracking responses to promotions and campaigns to improve marketing budgets.
3. Reports on response times and managing inquiries to improve service.
4. Keeping a complete log of interactions with the customer.
5. Tailoring personal promotions for customers.
6. Identifying customers at risk of churn and early intervention.
7. Sharing information among team members to improve service consistency.

Using data includes setting KPIs, targeted campaigns, and improving processes and loyalty retention.
    `,
  },
  {
    question: "❓ What is the difference between a CRM system and a queue management system only?",
    answer: `
A queue management system focuses on managing schedules and appointments between the business and customers, including setting dates, confirmations, cancellations, and scheduling.

A CRM system is a comprehensive solution that also includes managing detailed information about customers, documenting interactions, analyzing data, managing proposals and reminders, and automated marketing.

Both systems complement each other and are fully synchronized, allowing central management through the business dashboard.

The combination allows for operational efficiency, improved satisfaction, and competitive advantage.
    `,
  },
  {
    question: "❓ What should I do in case of errors or malfunctions in the CRM and appointment management system?",
    answer: `
To address errors:
- Check internet connection and reload (Ctrl+F5 or Cmd+Shift+R).
- Check system messages regarding maintenance or updates.
- Try to identify when and how the error occurs.
- Ensure that the entered data is correct and complete.
- Contact support with a detailed description and screenshots.
- Ensure that backups are available.
- Use monitoring systems for early alerts.

Quick handling prevents data loss, disruptions, and continuous improvement in business operations.
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
        direction: "rtl",
        textAlign: "right",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 25 }}>
        Questions and Answers - CRM and Appointment Management System
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
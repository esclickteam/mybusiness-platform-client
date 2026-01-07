import React, { useState } from "react";
import "./faq.css";

const faqData = [
  {
    question: "What does my business dashboard show",
    answer: `
The business dashboard is a real-time control panel that presents a comprehensive picture of your business activity.

It includes:
• Number of appointments by status (approved, pending, canceled)
• Reviews and ratings trends
• Profile views and exposure analytics
• Visual charts for appointments and customer activity
• Interactive calendar for scheduling and planning
    `,
  },
  {
    question: "How can I see all scheduled appointments for the week or month",
    answer: `
In the Appointments section you can view all bookings using:

• Monthly calendar with marked appointment dates
• Daily appointment lists with customer and service details
• Table view with sorting and advanced filters
• Export options to Excel or PDF for reporting
    `,
  },
  {
    question: "What should I do if appointments or views don’t update on the dashboard",
    answer: `
Try the following troubleshooting steps:

• Check your internet connection
• Perform a hard refresh (Ctrl + F5 / Cmd + Shift + R)
• Clear browser cache and cookies
• Try another browser or device
• Log out and log back in
• Wait 5–10 minutes for data sync
• Check for system maintenance messages

If the issue persists, contact support with full details.
    `,
  },
  {
    question: "What does the calendar on the dashboard represent",
    answer: `
The calendar provides a visual overview of scheduled appointments.

• Each marked day indicates at least one appointment
• Clicking a day shows all appointments ordered by time
• You can navigate between months to plan ahead
• Easily identify busy and available days
    `,
  },
  {
    question: "How do I read the customers booked by month chart",
    answer: `
This chart shows how many customers booked appointments each month.

• Available as bar chart, line chart, or table
• Helps identify seasonal trends and peak periods
• Useful for planning marketing and budgeting strategies
    `,
  },
  {
    question: "What are smart action recommendations on the dashboard",
    answer: `
Smart recommendations are generated using system analytics.

Examples include:
• Suggestions to promote services when activity drops
• Reminders to request reviews
• Scheduling optimization tips
• Customer engagement recommendations

They update in real time based on your data.
    `,
  },
  {
    question: "What should I do if I notice incorrect or missing dashboard data",
    answer: `
• Verify appointments and statuses are correct
• Check for sync issues
• Refresh or re-login
• Review system notices
• If issues persist, report them with screenshots to support
    `,
  },
  {
    question: "How can I get a weekly or monthly business summary",
    answer: `
The dashboard provides summary reports including:

• Total appointments
• Profile exposure metrics
• Reviews and ratings overview

Reports can be viewed online, downloaded as PDF or Excel, and shared with your team.
    `,
  },
  {
    question: "What if dashboard data isn’t updating in real time",
    answer: `
If data appears outdated:

• Check internet stability
• Perform a hard refresh
• Clear cache and cookies
• Try another browser or device
• Look for maintenance alerts
• Log out and log back in
• Wait a few minutes for system sync

Contact support if the issue continues.
    `,
  },
  {
    question: "How can I improve dashboard metrics and increase business activity",
    answer: `
Improvement tips:

• Run targeted marketing campaigns
• Keep your business profile updated and professional
• Add high-quality images and videos
• Manage availability and reduce no-shows
• Encourage customer reviews
• Analyze trends and adjust activity
• Use CRM and analytics tools effectively

Consistent optimization leads to better performance and growth.
    `,
  },
];

export default function DashboardFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">
        Detailed Help Center FAQ – Business Dashboard
      </h1>

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

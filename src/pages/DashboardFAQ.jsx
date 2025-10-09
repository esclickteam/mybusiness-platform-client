import React, { useState } from "react";

const faqData = [
  {
    question: "❓ What does my business dashboard show?",
    answer: `
The business dashboard is a dynamic control panel designed to present a comprehensive, real-time picture of your business and help you make informed decisions. It includes:

- Number of appointments: A view of all scheduled appointments for the current week and the coming months, including status (approved, pending approval, canceled).
- Reviews & ratings: The number of positive and negative reviews received, with the ability to analyze reviews by time periods and identify positive trends or areas for improvement.
- Profile views: Impressions and exposure data per customer segment, including percentage changes compared to previous periods to evaluate the effectiveness of marketing campaigns.
- Analytical charts: Visual trends for sales, appointments, and customer activity over time—line charts, bar charts, and tabular data.
- Interactive calendar: Appointments and events by date, including filters and views by appointment types, customers, or staff.
    `,
  },
  {
    question: "❓ How can I see all scheduled appointments for the week or month?",
    answer: `
In the “Appointments” tab you can view all scheduled appointments via a clear, easy interface that includes:

- Monthly calendar: Dates with appointments are marked. Click a date to see the full list of that day’s appointments, including start time, customer name, and service.
- Table view: A full list of all appointments, with sorting by date, customer name, status (approved, canceled, etc.), and advanced filtering by various parameters.
- Reports & export: Export appointments to Excel or PDF for management needs, periodic reporting, and visual presentations.
    `,
  },
  {
    question: "❓ What should I do if appointments or views don’t update on the dashboard?",
    answer: `
Troubleshooting steps:

- Check stable internet connectivity: Try loading other sites; switch networks (Wi-Fi / cellular) if needed.
- Full page refresh: Use Ctrl + F5 (or Cmd + Shift + R on Mac) for a hard refresh that clears cache.
- Clear browser cache & cookies: Old cache may display stale data. Clear via browser settings.
- Try a different browser/device: Chrome, Firefox, Edge—or another computer.
- Log out and log back in: Permission or data updates may apply only after a new login.
- Wait 5–10 minutes: There may be a brief sync delay. Wait and try again.
- Check system/maintenance messages: The system may be updating or have a known issue.

If the problem persists, contact support with full details: browser, OS, description, and time of incident.
    `,
  },
  {
    question: "❓ What does the calendar on the dashboard represent?",
    answer: `
The calendar provides a visual view of all scheduled appointments in the selected month.

- Each marked day represents at least one appointment; clicking a day shows a list of appointments ordered by start time.
- You can navigate to past and future months to plan ahead.
- Quickly identify busy days and open days.
    `,
  },
  {
    question: "❓ How do I read the “Customers who booked by month” chart?",
    answer: `
This chart shows the number of customers who booked appointments each month of the year.

- You can display the data in multiple formats: bar chart, line chart, or table for different types of analysis.
- The data helps identify peak seasons, seasonal trends, and aids in budgeting and marketing planning.
- Use it to assess whether promotions had a positive impact.
    `,
  },
  {
    question: "❓ What are the “Smart action recommendations” on the dashboard?",
    answer: `
The system uses advanced analytics to evaluate your business data and provide tailored recommendations, such as:

- Promote deals or new services in case of a decline in appointments or views.
- Reminders to maintain steady activity and retain customers.
- Recommendations to reach out to customers for reviews and feedback.
- Tips to optimize scheduling and availability.

Recommendations appear in a dedicated section and update in real time.
    `,
  },
  {
    question: "❓ What should I do if I notice incorrect or missing data on the dashboard?",
    answer: `
- Make sure all your appointments are updated in the system with the correct statuses.
- Check for sync issues between the appointments system and the dashboard.
- Refresh the system or log out and back in.
- Check for any maintenance notices or known issues reported in the system.
- If data is still incorrect, collect exact examples and send a report to support with screenshots and full details.
    `,
  },
  {
    question: "❓ How can I get a weekly or monthly summary of business activity?",
    answer: `
The dashboard offers periodic summary reports that include:

- Total appointments held in the period.
- Profile view and exposure data.
- Review and rating summaries.

Reports can be viewed directly, downloaded as PDF or Excel, and shared with your team or managers.
    `,
  },
  {
    question: "❓ What if the business dashboard data isn’t updating in real time?",
    answer: `
If the dashboard isn’t updating or shows outdated data, follow these steps:

- Check your internet connection: Ensure it’s stable and fast. Weak or unstable connections can cause partial or slow data loads.
- Refresh the dashboard: Use a hard refresh (Ctrl + F5 or Cmd + Shift + R) to clear cache and reload data.
- Clear cache & cookies: Browsers sometimes keep old data that leads to outdated displays. Clear via browser settings.
- Try another browser/device: Open the dashboard in another browser (Chrome, Firefox, Edge) or device to rule out local issues.
- Check system messages: Look for maintenance notices or technical problems that might affect data updates.
- Log out and log back in: Session/permission issues often resolve after re-authentication.
- Wait a few minutes: Some systems update with a slight lag. Wait 5–10 minutes and try again.

If the issue remains, contact technical support with browser/OS details, a description, and the time of occurrence.
    `,
  },
  {
    question: "❓ How can I improve the dashboard metrics and increase business activity?",
    answer: `
Improving dashboard metrics requires a mix of marketing, operational, and technical actions:

- Targeted marketing & promotion: Run focused campaigns on social networks, Google, and more to increase exposure to your profile. Optimize keywords and use quality content on your business page.
- Better customer experience: Keep your business profile accurate and up to date (hours, pricing, services). Add high-quality photos and videos to showcase your services professionally.
- Efficient appointment management: Update your availability regularly. Use customer reminders to reduce cancellations and no-shows.
- Gather feedback & reviews: Ask satisfied customers to leave positive reviews. Respond quickly to inquiries and reviews—even negative ones—to show engagement and care.
- Data review & analysis: Analyze the dashboard’s charts and reports to identify trends across metrics. Adjust business activity accordingly (e.g., extend hours on peak days).
- Use technology tools: Leverage the CRM to manage customers and scheduling. Use BizUply Advisor or other analytics tools for tailored recommendations.

Combining these steps will help increase activity and ensure your dashboard reflects accurate, current data—contributing to overall success.
    `,
  },
];

export default function DashboardFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        padding: 20,
        direction: "ltr",
        textAlign: "left",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 25 }}>
        Detailed Help Center FAQ – Business Dashboard
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

import React, { useState } from "react";

const faqData = [
  {
    question: "❓ What does my business dashboard display?",
    answer: `
The business dashboard is a dynamic control panel designed to present a comprehensive real-time overview of the business, enabling informed decision-making. It includes:

- Number of meetings: Display of the total scheduled meetings for the current week and upcoming months, including status (confirmed, pending approval, canceled).
- Reviews and ratings: The number of positive and negative reviews received, with the option to analyze reviews by time periods and identify positive trends or areas for improvement.
- Profile views: Viewing and exposure data per customer segment, including percentage changes compared to previous periods, to assess the effectiveness of marketing campaigns.
- Analytical graphs: Visual representation of trends in sales, meetings, and customer activity over time – linear graphs, columns, and tabular data.
- Interactive calendar: Display of meetings and events by dates, including the option to filter and view by types of meetings, customers, or employees.
    `,
  },
  {
    question: "❓ How can I see all scheduled meetings for the week or month?",
    answer: `
In the "Meetings" tab, you can view all scheduled meetings in an easy-to-use interface, which includes:

- Monthly calendar: Marked dates where meetings are scheduled. Click on a date to see the detailed meetings for that day, including start time, client name, and service.
- Table view: A complete list of all meetings, with the option to sort by date, client name, status (confirmed, canceled, etc.), and advanced filtering by various parameters.
- Reports and export: Export meetings to Excel or PDF files for management purposes, periodic reports, and graphical presentation.
    `,
  },
  {
    question: "❓ What to do if meetings or views are not updating on the dashboard?",
    answer: `
Steps to troubleshoot:

- Check internet connection stability: Verify loading of other websites, try switching to another network (WiFi or cellular).
- Refresh the page: Use Ctrl + F5 (or Cmd + Shift + R on Mac) to perform a full refresh with cache clearing.
- Clear browser cache and cookies: Old cache may cause loading of outdated information. Clear them through browser settings.
- Use a different browser or device: Try accessing from Chrome, Firefox, Edge, or another computer.
- Log out and log back in: Sometimes, updating permissions or data occurs only after re-logging.
- Wait 5–10 minutes: There may be a delay in data synchronization in the system. Wait and try checking again.
- Check system messages and maintenance: The system may be undergoing updates or there may be known issues published in the message system.

If the problem persists after all these steps, contact technical support with all the information: browser, operating system, detailed description, and time of the event.
    `,
  },
  {
    question: "❓ What does the calendar symbolize on the dashboard?",
    answer: `
The calendar visually displays all scheduled meetings for the selected month.

- Each marked day represents at least one meeting, and clicking on the day shows the list of meetings organized by start time.
- You can navigate between previous and future months to plan activities in advance.
- Allows quick identification of busy or free days.
    `,
  },
  {
    question: "❓ How to read the graph \"Clients who scheduled meetings by month\"?",
    answer: `
The graph represents the number of clients who scheduled meetings each month throughout the year.

- The information can be displayed in various formats: column graph, lines, and table, for different analysis purposes.
- The data allows identification of peak seasons, seasonal trends, and assists in budget planning and marketing activities.
- You can use the information to assess whether promotional activities had a positive impact.
    `,
  },
  {
    question: "❓ What are \"smart action recommendations\" on the dashboard?",
    answer: `
The system uses advanced analytics to examine business data and provides tailored recommendations, such as:

- Promoting new offers or services in case of a decline in meetings or views.
- Reminders for maintaining stable activity and customer retention.
- Recommendations to contact clients for requesting reviews and feedback.
- Tips for optimizing scheduling and availability of appointments.

The recommendations appear in a separate tab and are updated in real-time.
    `,
  },
  {
    question: "❓ What to do if I identify incorrect or missing data on the dashboard?",
    answer: `
- Ensure all meetings in your possession are updated in the system with correct statuses.
- Check if there is a synchronization issue between the meeting management systems and the dashboard.
- Perform a system refresh or log out and log back in.
- Check for maintenance messages or reported issues in the system.
- If the data continues to be incorrect, collect accurate examples and send a report to technical support with screenshots and full details.
    `,
  },
  {
    question: "❓ How can I receive a weekly or monthly summary of business activity?",
    answer: `
The dashboard has the option to receive periodic summary reports that include:

- Total meetings that took place during the period.
- Viewing and exposure data for the business profile.
- Summary of reviews and ratings.

The reports can be viewed directly, downloaded as a PDF or Excel file, and shared with the team or managers.
    `,
  },
  {
    question: "❓ What to do if the data on the business dashboard is not updating in real-time?",
    answer: `
If the dashboard data is not updating or showing old information, follow these steps:

- Check internet connection: Ensure the connection is stable and fast. A weak or unstable connection may cause incomplete or slow data loading.
- Refresh the dashboard: Use a full refresh command in the browser (Ctrl + F5 or Cmd + Shift + R) to clear the cache and reload the data.
- Clear cache and cookies: Sometimes the browser saves old data that causes an outdated display. Clear Cache and Cookies through browser settings.
- Use a different browser or device: Try opening the dashboard in a different browser (such as Chrome, Firefox, or Edge) or from another device to rule out specific issues.
- Check system messages: See if the system displays maintenance messages or technical issues that may affect data updates.
- Log out and log back in: Sometimes issues with permissions or session activation are resolved by logging out of the system and logging back in.
- Wait a few minutes: Some systems may have a slight delay in updates. Wait 5–10 minutes and try again.

If the problem is not resolved after all these steps, contact technical support with details of the browser, operating system, description of the issue, and time of occurrence.
    `,
  },
  {
    question: "❓ How can I improve the data displayed on the dashboard and increase business activity?",
    answer: `
Improving the data on the dashboard requires a combination of marketing, management, and technological actions:

- Targeted promotion and marketing: Run targeted campaigns on social media, Google, etc., to increase exposure to the business profile. Optimize keywords and use quality content on the business page.
- Enhance customer experience: Ensure that the information on the business profile is accurate and up-to-date (operating hours, prices, services). Add quality images and videos that professionally showcase your services.
- Efficient management of meetings: Regularly update your availability on the calendar. Use reminders for clients to prevent cancellations and no-shows.
- Collect feedback and reviews: Ask satisfied clients to leave positive reviews. Respond quickly to inquiries and reviews, including negative ones, to show engagement and care.
- Analyze data: Analyze the graphs and reports on the dashboard, and try to identify trends and changes across various metrics. Adjust business activities based on the information (e.g., increase operating hours on peak days).
- Use technological tools: Utilize CRM tools for customer management and scheduling meetings. Use business advisors or other analytical tools for personalized recommendations.

Combining these steps will help you increase business activity and ensure that the business dashboard reflects updated and accurate data, contributing to overall success.
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
        direction: "rtl",
        textAlign: "right",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 25 }}>
        Detailed Questions and Answers for Help Center - Business Dashboard
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

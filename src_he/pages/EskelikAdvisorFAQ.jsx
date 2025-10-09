import React, { useState } from "react";

const faqData = [
  {
    question: "What is the Bizuply Advisor and how can it help me?",
    answer: `The Bizuply Advisor is an advanced AI-based business and marketing consulting system designed to provide you with professional, personalized, and practical answers to a wide range of business, marketing, and management challenges. The service operates 24/7, allowing you to receive quick insights and guidance without the need for costly meetings or long waits.

What does it offer you?

Instant answers to professional and complex questions in areas such as employee management, digital marketing, finance, customer service improvement, and more.

Recommendations tailored to your business, taking into account its size, industry, and specific needs.

Strategic planning for business activities, including monthly marketing plans, suggestions for streamlining processes, and cost reduction.

Assistance in identifying new opportunities, solving operational problems, and improving business performance.

Why do you need it?
In the modern business world, making fast and informed decisions is critical for success. The Bizuply Advisor enables you to:

Save valuable time that would otherwise be spent searching for information or learning independently.

Receive professional, up-to-date answers based on advanced algorithms and current business knowledge.

Avoid costly mistakes that may result from lack of experience or incorrect information.

Improve your business efficiency and productivity through focused tools and actionable insights.

How can it serve my business?

Small or medium-sized business owners can receive daily support for business management without relying on expensive external consultants.

Make informed decisions in areas such as marketing, sales, resource management, and customer relations.

Helps establish organized business processes, set goals and success metrics, and monitor ongoing performance.

Enhances your ability to handle growing competition and rapid market changes.

Lets you focus on what really matters — business growth — while receiving reliable support and answers to any challenge along the way.

The Bizuply Advisor is the technological tool that will make your business smarter, more efficient, and more professional, providing continuous, accessible support tailored to modern needs.`,
  },
  {
    question: "How do I choose a predefined question or ask a custom one in Bizuply Advisor?",
    answer: `Bizuply Advisor offers you two main ways to get professional, personalized business advice:

1. Choosing a predefined question:
The system includes ready-made questions based on the most common needs and challenges faced by small and medium-sized business owners. These cover topics such as digital marketing, team management, financial planning, dealing with declining income, improving customer service, and more.
You can easily browse questions by category and select the most relevant one, receiving professional and focused answers quickly to help solve common problems or make informed decisions.

2. Asking a custom question:
If your situation is more specific or complex, you can write your own question in the provided text box. The AI engine analyzes your query in real time and provides a personalized response based on its vast and updated knowledge base.
Additionally, the system offers actionable recommendations based on the question’s context to give you a full picture of potential improvement strategies.

When should you choose each option?

If you need a quick answer to a common problem, a predefined question is the most efficient option.

If you need personalized or detailed advice specific to your business, asking a custom question will provide a precise, tailored response.

Using both methods allows you to receive accurate, fast, and relevant information that will significantly improve your business decision-making and performance.`,
  },
  {
    question: "Are the answers suitable for all types of businesses?",
    answer: `The Bizuply Advisor is an advanced AI-based system that uses not only broad professional knowledge but also your specific business data, synced directly from your account and management systems. This enables it to provide personalized insights and recommendations tailored to your business, finances, and marketing needs.

This means the answers are not generic — they are based on relevant and updated information that allows you to make data-driven decisions specific to your situation. As a result, Bizuply Advisor offers real, personalized support to improve performance, streamline operations, and make smarter decisions.

However, it’s important to note that some complex or strategic matters still require professional human consultation, such as legal, financial, or specialized business advice. In such cases, we recommend consulting experts for deeper guidance.

Bizuply Advisor is a smart, powerful, and personalized tool for small and medium businesses, helping you make fast and accurate data-driven decisions — complementing, not replacing, professional consulting in complex cases.`,
  },
  {
    question: "How is the marketing advisor used within Bizuply?",
    answer: `The marketing advisor within Bizuply is an AI-powered tool that provides professional, focused answers to key marketing and advertising questions. It gives personalized recommendations based on your business data, industry, target audience, and goals.

With it, you can learn how to generate higher-quality leads, build precise monthly marketing plans, understand the pros and cons of paid versus organic campaigns, and choose the best marketing channels (Google, Facebook, Instagram, email, and more).

Marketing is the main engine of business growth — it drives exposure, engagement, and sales. Without a well-structured marketing plan, a business may fall behind and miss opportunities. Bizuply’s marketing advisor helps you optimize your ad budget, target the right audiences, and respond quickly to market changes.

The AI behind the system analyzes real-time data, identifies trends and patterns, and provides evidence-based suggestions. It can recommend campaign optimizations, conversion improvements, and ways to enhance online visibility — helping you make data-driven decisions instead of relying on guesswork.

Using Bizuply’s marketing advisor is a smart, cost-effective, and efficient way to improve marketing performance, increase visibility and engagement, and ultimately grow your revenue — all with an advanced, accessible tool tailored to your business needs.`,
  },
  {
    question: "What if my question doesn’t appear in the list?",
    answer: `In Bizuply Advisor, you can freely ask any business, marketing, or management-related question — even if it’s not in the predefined list. Simply type your question in the text box, and the AI engine will analyze and provide the most relevant professional answer.

Responses are generated quickly and based on an extensive knowledge base that includes up-to-date information about business management, marketing techniques, employee management, and more. The system understands the context and provides actionable recommendations.

If your question is complex, the system may also suggest next steps such as connecting you with human experts, recommending external tools, or suggesting relevant courses. This ensures you get the most effective solution without wasting time on unnecessary research or meetings.

Free questions give you flexibility to get answers precisely suited to your business, even in unique or non-standard cases — saving time, improving decisions, and increasing your business success.`,
  },
  {
    question: "Is the service available 24/7?",
    answer: `Yes, Bizuply Advisor is a fully digital service available anytime — 24 hours a day, 7 days a week. This means you can receive professional advice instantly, without waiting for office hours, meetings, or queues.

Such availability is critical for businesses since challenges, questions, or opportunities often arise unexpectedly and require immediate action. Instead of waiting to meet a consultant or searching for information, you get quick and accurate responses — even at night, weekends, or holidays.

This 24/7 accessibility also helps reduce stress and delays. Urgent business decisions no longer have to wait for human consultants. Bizuply Advisor gives you flexible, reliable support to manage your business efficiently and seize opportunities at any time.

In short — 24/7 availability isn’t just convenient; it’s a powerful strategic advantage for modern business owners.`,
  },
  {
    question: "How can I maximize the value I get from Bizuply Advisor?",
    answer: `To get the most from Bizuply Advisor, integrate its recommendations and insights into your daily business management. Implement the suggested actions in your calendar and CRM system to ensure tasks are executed on time and synced across all platforms for accurate, real-time performance tracking.

Continuous performance monitoring is key. By analyzing results from implemented recommendations, you can identify what works, what needs improvement, and adjust quickly. You can also ask follow-up questions to deepen insights in specific areas.

Remember, Bizuply Advisor provides smart guidance — success depends on consistent implementation. Using its insights effectively can improve customer service, operational efficiency, and profitability.

Combining professional guidance with continuous monitoring and automation is the key to maximizing Bizuply Advisor’s value and leading your business to long-term success.`,
  },
  {
    question: "How can I integrate Bizuply Advisor with other business management systems?",
    answer: `Integrating Bizuply Advisor with your business systems is essential for improving efficiency and decision-making. Bizuply supports connections with CRM, dashboards, marketing tools, and order management platforms, allowing real-time, synchronized insights.

This integration ensures that Bizuply’s recommendations and data — such as insights, opportunities, and analytics — are automatically reflected in your daily systems. For example, if the advisor detects a marketing opportunity, it can feed directly into your CRM or task system.

The integration also allows for feedback from your systems, enabling the advisor to adjust its recommendations dynamically. This reduces duplication, improves coordination, and enhances performance.

Efficient integration with Bizuply Advisor helps you run your business smarter, more data-driven, and with less manual effort — leveraging technology for informed decisions and better results.`,
  },
  {
    question: "What errors or issues can occur in Bizuply Advisor and how can I fix them?",
    answer: `Like any advanced technology, Bizuply Advisor may occasionally encounter errors due to factors like weak internet connection, data sync issues, server overload, or bugs. Here’s how to fix common problems:

No response or slow performance:
- Check your internet connection.
- Refresh the browser or app.
- Try another device or browser.

Data sync issues:
- Ensure your business details are up to date.
- Re-sync or contact support if needed.

Access/login problems:
- Verify you’re logged in with the correct business profile.
- Use password recovery if needed.

Technical bugs:
- Update your browser or app to the latest version.
- If the issue persists, contact Bizuply support with screenshots and device details.

Incorrect or generic answers:
- The AI may sometimes provide broad answers. Try rephrasing your question for more accuracy.

Regular maintenance, data updates, and system checks help prevent most issues. For major problems, Bizuply’s support team is ready to assist quickly.`,
  },
  {
    question: "How can I prevent recurring issues in Bizuply Advisor?",
    answer: `To prevent recurring errors or issues in Bizuply Advisor, follow these best practices:

- Keep your business and customer data up to date for accurate recommendations.
- Ensure a stable internet connection.
- Use an updated browser compatible with the system.
- Maintain proper permissions and user access control.
- Refresh the system regularly to prevent technical buildup.
- Contact support promptly if you encounter any issue.
- Review Bizuply’s user guides to improve usage efficiency.

Following these guidelines ensures a smooth, reliable experience with Bizuply Advisor.`,
  },
];

export default function BizuplyAdvisorFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
        textAlign: "right",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        Frequently Asked Questions – Bizuply Advisor
      </h1>
      {faqData.map(({ question, answer }, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            marginBottom: 15,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <button
            onClick={() => toggleIndex(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-content-${index}`}
            id={`faq-header-${index}`}
            style={{
              width: "100%",
              background: "rgba(85, 107, 47, 0.5)",
              color: "#333",
              padding: "15px 20px",
              fontSize: 18,
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              direction: "rtl",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 6,
            }}
          >
            <span
              style={{
                userSelect: "none",
                color: "#f06292",
                marginLeft: 10,
                paddingRight: 2,
                fontWeight: "bold",
                fontSize: 24,
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              ?
            </span>
            <span style={{ flexGrow: 1, textAlign: "right" }}>{question}</span>
            <span style={{ fontSize: 24, lineHeight: 1 }}>
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div
              id={`faq-content-${index}`}
              role="region"
              aria-labelledby={`faq-header-${index}`}
              style={{
                background: "#fafafa",
                padding: 20,
                whiteSpace: "pre-wrap",
                fontSize: 16,
                lineHeight: 1.6,
                color: "#444",
                textAlign: "right",
                direction: "rtl",
              }}
            >
              {answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

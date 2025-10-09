import React, { useState } from "react";

const faqData = [
  {
    question: "What is the BizUply Advisor and how can it help me?",
    answer: `The BizUply Advisor is an advanced AI-based business and marketing advisory system, designed to provide you with professional, personalized, and practical support for a wide range of business, marketing, and operational questions and challenges. The service operates 24/7 and lets you receive quick insights and guidance without expensive meetings or long waits.

What does it give you?

Immediate answers to professional and complex questions in areas like team management, digital marketing, financial management, customer service improvement, and more.

Recommendations tailored to your business, considering its size, industry, and your specific needs.

Strategic planning of business activities, including building monthly marketing plans, proposing ways to streamline business processes, and reducing costs.

Help identifying new opportunities, solving operational issues, and boosting your business performance.

Why do you need it?
In today’s business world, fast, well-informed decision-making is critical to survival and success. The BizUply Advisor enables you to:

Save valuable time otherwise spent searching for information and self-learning.

Get professional, up-to-date answers based on advanced algorithms and current business knowledge.

Avoid costly mistakes caused by lack of experience or incorrect information.

Improve your business efficiency and productivity through focused tools and insights you can quickly apply.

How can it serve my business?

Small and medium business owners can get daily support managing their business without relying on expensive outside consultants.

Make informed decisions in marketing, sales, resource management, and customer relations.

Establish organized business processes, set goals and success metrics, and maintain ongoing performance tracking.

Strengthen your ability to handle growing market competition and rapid changes in the business environment.

Focus on what really matters—growing the business—while getting reliable, supportive answers to any question or challenge along the way.

The BizUply Advisor is the technological tool that will help make your business management smarter, more efficient, and more professional—with continuous, accessible support that fits the advanced needs of today.`,
  },
  {
    question:
      "How do I pick a ready-made question or ask a free-form question in the BizUply Advisor?",
    answer: `The BizUply Advisor offers two main paths for getting professional, accessible, and personalized business advice:

1. Choosing a ready-made question:
The system includes ready-made questions built around the most common needs and questions of small and medium business owners. These cover diverse areas such as digital marketing, team management, financial planning, handling revenue declines, improving customer service, and more.
Selecting a ready-made question is simple via an easy menu that lets you review questions by category and pick the most relevant one. You’ll quickly receive a professional, focused answer to help you solve common problems or make the right decisions.

2. Asking a free-form question:
If your need is more specific or complex, you can write a precise, personal question in the dedicated text box. Your question is analyzed in real time by an advanced AI engine that provides a personalized response based on its broad and current knowledge.
In addition, the system suggests further actions and improvement ideas aligned with the context of your question, giving you a complete picture of next steps.

When to use each option?

If you want a quick response to a common problem or question, a ready-made question is the most efficient route.

If you need specific, complex, or highly tailored advice, a free-form question will provide a professional answer that fits your exact needs.

Using both paths wisely lets you quickly get accurate guidance and significantly improve your business management and growth.`,
  },
  {
    question: "Are the answers meant for all types of businesses?",
    answer: `The advanced BizUply Advisor uses AI that relies not only on broad professional knowledge, but also on your specific business data, pulled directly from your server and management systems. This enables the system to provide answers and recommendations personalized to your business, financial, and marketing situation—based on your profile, past performance, current activity, and business goals.

This means the answers aren’t merely generic; they’re grounded in relevant, up-to-date information, allowing you to make data-driven, precise decisions tailored to your unique needs. The BizUply Advisor provides real, personalized support to improve performance, streamline processes, and make better decisions.

That said, every business is unique, and some complex or strategic topics require deeper, specialized professional guidance, such as legal, financial, or bespoke business consulting. In such cases, we recommend working with expert consultants who can dive deeper and tailor solutions.

The BizUply Advisor is a smart, powerful, and personalized tool for small and medium businesses—helping you make faster, better decisions based on your own data. It complements (not replaces) specialized professional consulting in complex scenarios.`,
  },
  {
    question: "How do I use the marketing advisor within BizUply?",
    answer: `The marketing advisor within BizUply is a smart AI-based tool that provides professional, focused answers to key questions in both digital and traditional marketing. It gives you personalized recommendations based on your business’s unique data, field of activity, target audience, and goals.

With the marketing advisor, you can learn how to generate higher-quality leads, build a precise and focused monthly marketing plan, understand pros and cons of paid vs. organic campaigns, and select the best advertising channels for you (Google, Facebook, Instagram, email, and more).

Marketing is the central growth engine—it drives exposure, engagement, and sales. Without a well-planned marketing strategy, a business can fall behind and miss opportunities. The BizUply marketing advisor helps you maximize your ad budget, focus on relevant audiences, and respond quickly to market changes.

The AI behind the advisor analyzes data in real time, detects trends and patterns, and provides evidence-based suggestions. It can recommend campaign optimizations, conversion-rate improvements, and ways to enhance your online visibility. This enables data-driven decisions—not just gut feelings.

Using the marketing advisor is a smart, cost-effective, and efficient way to improve marketing performance, increase exposure and engagement, and ultimately grow your revenue—all through an advanced, accessible tool that provides continuous, tailored support.`,
  },
  {
    question: "What if my question doesn’t appear in the list?",
    answer: `In the BizUply Advisor, you can ask any business, marketing, or management question freely—even if it’s not in the ready-made list. Simply type your question into the text box, and the AI engine will analyze it and provide the most professional and relevant answer.

Responses arrive quickly and are based on a broad, up-to-date knowledge base, including general business information, marketing techniques, staff management, problem-solving, and more. The system understands context and provides personalized recommendations, including practical steps to take.

If a question is complex or requires deeper handling, the advisor may suggest additional actions—such as referring you to human experts, recommending external tools, or pointing to relevant courses. This way, you can handle your business challenges efficiently without wasting time searching or scheduling unfocused meetings.

Free-form questions let you get solutions tailored exactly to your unique needs—even in special or non-standard situations. Fast, accurate answers help save time, improve decision-making, and increase your chances of business success.`,
  },
  {
    question: "Is the service available 24/7?",
    answer: `Yes. The BizUply Advisor is fully digital and available anytime, 24/7. This lets you get immediate, professional guidance whenever you need it—without relying on human consultants’ hours, queues, or scheduled meetings.

Immediate availability is crucial because business and operational questions, issues, and opportunities often appear unexpectedly and require quick, informed responses. Instead of waiting for a meeting or searching for information, the advisor offers instant solutions so you can make fast, accurate decisions—even at night, on weekends, or during holidays.

Around-the-clock access reduces stress and risk. Urgent meetings with a business consultant can be hard to arrange and may delay important processes. The BizUply Advisor provides a flexible, accessible solution that helps you run your business more efficiently, capitalize on opportunities, and streamline operations at any moment.

So 24/7 isn’t just convenient—it’s a strategic advantage for handling today’s fast, dynamic business reality.`,
  },
  {
    question: "How can I maximize the value from the BizUply Advisor?",
    answer: `To get the most from the BizUply Advisor, integrate its recommendations into your daily operations. Start by implementing suggested actions in your management calendar, while syncing with your CRM and business dashboard. This ensures recommendations are executed on time and that data stays up to date across systems—giving you an accurate, reliable picture.

Ongoing performance tracking is essential. By analyzing results of actions taken following AI advice, you can identify what works and what needs improvement, then adapt quickly and wisely. The system also supports follow-up questions and deeper exploration of specific topics—keeping the process dynamic and aligned with your changing business reality.

Remember: the advisor is a smart assistant that provides insights and guidance, but success also depends on consistent execution. Using insights effectively can significantly improve business management, customer service, operational efficiency, and revenue.

Consistently combining professional guidance with routine management, continuous measurement, and use of automation is the key to maximizing the BizUply Advisor’s value and driving sustained success.`,
  },
  {
    question:
      "How do I integrate the BizUply Advisor with other business systems?",
    answer: `Integration between the BizUply Advisor and other business systems is key to improving efficiency and effectiveness. BizUply supports connections with CRMs, business dashboards, marketing platforms, and tools for managing customers and orders—so you always have a comprehensive, real-time view.

Integration is based on real-time data sync, so the advisor’s information—recommendations, insights, and business data—flows automatically into your operational systems. For example, if the advisor identifies a marketing opportunity or a customer service improvement, it can feed directly into your CRM to be embedded in marketing or service workflows.

Integration also supports feedback from your systems back into the advisor. It adapts its recommendations based on the most current data, enabling dynamic alignment with your business status. This prevents duplication, improves decision-making, and maximizes results.

Effective integration lets you manage your business in a smarter, more focused, data-driven way—using advanced tools that streamline operations and support well-informed decisions.`,
  },
  {
    question:
      "What errors or issues might occur in the BizUply Advisor and how can I fix them?",
    answer: `Like any advanced tech system, the BizUply Advisor may occasionally encounter errors or issues—due to internet connectivity problems, data-sync issues, server load, or software bugs. Here’s how to handle common cases:

Delays or missing answers:

• Check for a stable, fast internet connection—weak/unstable links cause delays.
• Refresh your browser or app.
• If the problem persists, try a different device or browser.

Data-sync issues with your business data:

• Ensure your business info is up to date and server details are correct.
• If the advisor shows incorrect data, try re-syncing via business settings or contact support.

Access/login issues:

• Confirm your permissions are correct and you’re logged into the right business profile.
• If you forgot your password or can’t log in, use password reset or contact support.

Technical glitches or bugs:

• Update your system or browser to the latest version.
• If issues remain, contact BizUply support with a clear description, screenshots, and your device/browser details.

Content accuracy or mismatch:

• The advisor is AI-based and may sometimes provide general answers. Use clear, detailed questions or seek human consultation for precision.

Good practices—regular checks and up-to-date business data—help reduce issues and ensure smooth usage. For significant problems, the support team is ready to help quickly.`,
  },
  {
    question:
      "How can I prevent recurring issues and errors in the BizUply Advisor?",
    answer: `To prevent recurring issues, follow these routine best practices:

• Keep data updated: Maintain current business, customer, and service details to ensure accurate, relevant recommendations.

• Check internet stability: Ensure a stable, fast connection—especially for real-time features or server sync.

• Use a modern browser: Use a supported, updated browser and disable extensions that may conflict.

• Manage permissions: Keep user permissions current and limit access to authorized users only.

• Periodically refresh: Regularly restart the browser/app to prevent technical buildup.

• Contact support promptly: Report issues quickly with precise details for fast resolution.

• Training and thoughtful use: Leverage built-in guides and tools to maximize efficiency and reduce errors.

These practices streamline your use of the BizUply Advisor and ensure a reliable, continuous experience for your business.`,
  },
];

export default function BizUplyAdvisorFAQ() {
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
        FAQ – BizUply Advisor
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
                color: "#f06292", // pink-red
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

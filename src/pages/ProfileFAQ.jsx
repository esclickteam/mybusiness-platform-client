import React, { useState } from "react";
import "./faq.css";

const faqData = [
  {
    question: "How do I use the different tabs on the business page",
    answer: `
The business page is divided into functional tabs that allow comprehensive, organized management and presentation of business information to both customers and the business owner.

Main: Shows an overview of the business, including name, description, and contact details.

Gallery: Centralizes all media content—photos and videos—used to showcase the business.

Reviews: Collects customer reviews and ratings and allows tracking overall performance.

Q&A: Displays frequently asked questions with answers from the business owner or support team.

Calendar: Manages appointments, meetings, and service bookings.

Chat with the business: Enables real-time communication between customers and the business.

Each tab is designed to provide focused information and a smooth user experience.
    `,
  },
  {
    question: "What should I do if the changes I made don’t appear on the business page",
    answer: `
If changes don’t appear after saving, try the following steps:

1. Perform a hard refresh (Ctrl + F5 / Cmd + Shift + R).
2. Clear browser cache and cookies.
3. Check your internet connection.
4. Try a different browser or device.
5. Wait 5–10 minutes for data sync.
6. Log out and log back in.

If the issue persists, contact technical support with screenshots and details.
    `,
  },
  {
    question: "How do I add or edit my business details",
    answer: `
Go to the admin panel and open the business page editor.

You can update:
• Business name and description
• Phone number and email
• City and category
• Logo and gallery images

Click “Save changes” to apply updates.
    `,
  },
  {
    question: "How do I manage the business image gallery",
    answer: `
Main gallery:
Up to 5 primary images displayed on the business profile.

Extended gallery:
Additional images and videos under the Gallery tab.

Use high-quality visuals and keep content up to date.
    `,
  },
  {
    question: "Why is it important to set the business category and location correctly",
    answer: `
Accurate category and location improve visibility and relevance on the platform.

Benefits include:
• Better exposure
• More inquiries
• Higher conversion rates
• More accurate business collaborations

Incorrect settings may reduce visibility.
    `,
  },
  {
    question: "What should I do if I have trouble accessing the business page or system",
    answer: `
Try the following steps:
1. Check your internet connection.
2. Try another browser.
3. Clear cache and cookies.
4. Perform a hard refresh.
5. Try from another device or network.

If the problem continues, contact support with screenshots.
    `,
  },
  {
    question: "How do I add videos to the business page and what are the benefits",
    answer: `
Videos can be added in the Gallery tab.

Benefits:
• Visual presentation of services
• Increased trust
• Higher customer engagement

Ensure videos are in MP4 format and within size limits.
    `,
  },
  {
    question: "How do I add services or service categories to the business page",
    answer: `
Services and categories are managed through the Calendar tab and CRM system.

This allows:
• Better appointment management
• Clear service organization
• Improved marketing and conversions
    `,
  },
  {
    question: "How can I manage and customize contact details on the business page",
    answer: `
Contact details can be managed in the admin panel.

You can:
• Update phone, email, and address
• Add social media links
• Control which details are publicly visible
    `,
  },
  {
    question: "How do I handle issues with uploading images or saving changes",
    answer: `
Before contacting support, check the following:

• File format (JPG/PNG for images, MP4 for videos)
• File size limits
• Perform a hard refresh
• Clear browser cache
• Check internet connection
• Try another browser or device
• Confirm that you clicked “Save”

If the issue persists, contact support with details and screenshots.
    `,
  },
];

export default function ProfileFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">FAQ – Business Profile</h1>

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

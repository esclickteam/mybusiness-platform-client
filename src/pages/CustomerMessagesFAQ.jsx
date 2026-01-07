import React, { useState } from "react";
import "./faq.css";

const faqData = [
  {
    question: "How can I view messages with clients",
    answer: `
In the Client Messages tab, you can view a full list of all clients with active conversations.

• Chats are ordered chronologically by most recent activity
• Messages update in real time
• Click any client to open the full conversation history
• All conversations are saved and can be reviewed at any time

This allows efficient and organized communication management.
    `,
  },
  {
    question: "How do I send a new message to a client",
    answer: `
To send a message:
• Select the client from the chat list
• Type your message in the input field
• Click Send or press Enter

Messages are delivered instantly using real-time technology.
You can also attach files, images, and links to enrich communication.
    `,
  },
  {
    question: "What should I do if a message is not sent",
    answer: `
Before contacting support, try the following:

• Check your internet connection
• Perform a hard refresh (Ctrl + F5 / Cmd + Shift + R)
• Check for system maintenance notices
• Try another browser (Chrome, Firefox, Edge)
• Verify attached files meet size and format limits

If the issue persists, contact support with full details.
    `,
  },
  {
    question: "How will I know if the client has read my message",
    answer: `
Currently, the system does not provide read receipts.

However:
• Chats update in real time
• You can see when the client responds or starts typing

If confirmation is critical, request it directly or use another communication channel.
    `,
  },
  {
    question: "Can I view historical messages with clients",
    answer: `
Yes. All messages are securely stored.

You can:
• Scroll through older conversations
• Search messages by keyword or date
• Maintain continuity in communication with clients

This improves professionalism and customer experience.
    `,
  },
  {
    question: "What should I do if client messages are not updating in real time",
    answer: `
Try the following steps:

• Check internet connection
• Refresh the page
• Clear cache and cookies
• Try another browser or device
• Check for system updates or maintenance

If the issue continues, contact support with screenshots and details.
    `,
  },
  {
    question: "Can I send files or links in messages",
    answer: `
Yes. You can send:
• Documents (PDF, DOC, etc.)
• Images (JPG, PNG)
• External links

Ensure files are within size limits (usually up to 5MB) and supported formats.
    `,
  },
  {
    question: "How do I handle incorrect or duplicate messages sent by mistake",
    answer: `
Messages cannot be edited or deleted after sending.

Recommended actions:
• Send a clarification or correction message
• Apologize if needed
• Review messages carefully before sending

This ensures transparent and professional communication.
    `,
  },
  {
    question: "What should I do if the chat or client list doesn’t load",
    answer: `
Try the following:

• Check your internet connection
• Refresh the page
• Clear browser cache and cookies
• Try another browser or device
• Check system status messages

If the issue persists, contact technical support with screenshots and timing details.
    `,
  },
  {
    question: "Can I manage multiple client conversations at the same time",
    answer: `
Yes. The system supports multiple simultaneous conversations.

Features include:
• Side chat list for quick switching
• Notifications for new messages
• No need to close active chats

This improves productivity and response speed.
    `,
  },
];

export default function CustomerMessagesFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">FAQs – Client Messages</h1>

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

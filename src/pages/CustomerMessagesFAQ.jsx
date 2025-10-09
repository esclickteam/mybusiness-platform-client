import React, { useState } from "react";

const faqData = [
  {
    question: "❓ How can I view messages with clients?",
    answer: `
In the "Client Messages" tab, you can find a complete list of all clients with active conversations. The chats are displayed chronologically, starting from the most recent messages, with real-time updates that keep you informed of every message sent or received. You can select any client from the list to open the full chat history. In addition, the system saves all conversations so you can review older messages at any time, enabling efficient and organized communication management with your clients.
    `,
  },
  {
    question: "❓ How do I send a new message to a client?",
    answer: `
To send a new message, select the client's name from the list available in the chat tab, type your message in the text box at the bottom of the chat window, and click the send button or press Enter on your keyboard. The message will be sent instantly and displayed in the chat window. The messaging system is based on real-time technology (WebSocket or Long Polling) to ensure fast and smooth communication. You can also attach files, images, and links to enrich your communication with the client.
    `,
  },
  {
    question: "❓ What should I do if the message is not sent?",
    answer: `
If a message fails to send, try the following troubleshooting steps before contacting support:

- Check your internet connection: make sure it’s stable and fast.
- Refresh the browser: use Ctrl + F5 (or Cmd + Shift + R on Mac) to reload the page and clear cache.
- Check for maintenance status: verify the system is not under maintenance or experiencing known issues.
- Try another browser: sometimes issues are browser-specific – switching to Chrome, Firefox, or Edge may help.
- Check attached files: if your message includes files, make sure their size and format comply with system requirements.

If the problem persists, contact technical support and provide the client’s details, message content, error time, and browser/system information.
    `,
  },
  {
    question: "❓ How will I know if the client has read my message?",
    answer: `
Currently, the chat system does not provide explicit read receipts for sent messages, to protect user privacy and maintain technical simplicity. However, the chats update in real time, so you can see when the client sends a response or starts typing. If it’s important to confirm receipt, it’s recommended to use an additional communication channel (such as phone or email) or include a direct confirmation request in your message.
    `,
  },
  {
    question: "❓ Can I view historical messages with clients?",
    answer: `
Yes, all messages are securely stored in the system, and you can access the chat history with any client at any time. The system allows you to scroll back to older messages and provides tools to filter and search through conversations by keywords or dates. This allows you to track previous communications and maintain professional continuity when responding to clients, improving both customer experience and internal business management.
    `,
  },
  {
    question: "❓ What should I do if client messages are not updating in real time?",
    answer: `
If chats do not update in real time, try the following:

- Check your internet connection: ensure it’s stable and active.
- Refresh the page: use Ctrl + F5 or Cmd + Shift + R to reload the system.
- Clear browser cache and cookies: stored data may sometimes cause loading issues.
- Try another browser or device: sometimes the issue is local.
- Check for system updates: there may be temporary maintenance or updates in progress.

If the issue continues, contact support with a detailed description, screenshots, and browser information.
    `,
  },
  {
    question: "❓ Can I send files or links in messages?",
    answer: `
Yes, the system allows sending files, images, and links directly in the client chat window. You can attach documents in common formats (PDF, JPG, PNG, DOC, etc.) and include external links to services, information pages, or product listings. Make sure that files do not exceed the maximum upload size (typically 5MB) and that the format is supported by the system. This feature allows you to enhance conversations and provide more professional and detailed responses to clients.
    `,
  },
  {
    question: "❓ How do I handle incorrect or duplicate messages sent by mistake?",
    answer: `
In the Bizuply system, it is not possible to delete or edit messages after they are sent, to maintain transparency and communication integrity. If an incorrect message is sent, it is recommended to send another message with clarification or apology. To reduce mistakes, review your message carefully before sending. This process ensures professional and respectful communication with clients.
    `,
  },
  {
    question: "❓ What should I do if the chat or client list doesn’t load?",
    answer: `
If the chat or client list fails to load, try the following steps:

- Check your internet connection.
- Refresh the page (Ctrl + F5 or Cmd + Shift + R).
- Clear browser cache and cookies.
- Try logging in using another browser or device.
- Check for maintenance messages or system issues.

If the issue persists, contact technical support with a screenshot, detailed description, and the time the issue occurred.
    `,
  },
  {
    question: "❓ Can I use the chat to handle multiple clients at once?",
    answer: `
Yes, the system allows you to manage multiple conversations simultaneously using a user-friendly interface with a side chat list. You can easily switch between conversations, receive notifications for new messages, and manage all communications efficiently without losing information or closing chats. This feature increases productivity and helps provide fast, professional service to clients.
    `,
  },
];

export default function CustomerMessagesFAQ() {
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
        FAQs - Client Messages
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

import React, { useState } from "react";

const faqData = [
  {
    question: "❓ How can I view messages with customers?",
    answer: `
In the "Customer Messages" tab, you can find a complete list of all customers with whom there are active conversations. The conversations are displayed in chronological order, starting with the most recent messages, with real-time updates that allow you to stay informed of any message sent or received. You can select any customer from the list and open the history of conversations with them. Additionally, the system saves all conversations so you can review old messages at any time, allowing for efficient and organized management of communication with customers.
    `,
  },
  {
    question: "❓ How to send a new message to a customer?",
    answer: `
To send a new message, select the customer's name from the available customer list in the conversations tab, type the message in the text box located at the bottom of the conversation window, and click the send button or press Enter on the keyboard. The message will be sent immediately and displayed in the conversation window. The messaging system is based on real-time update technology (WebSocket or Long Polling) to ensure that communication is fast and smooth. You can also attach files, images, and links to messages to enrich communication with the customer.
    `,
  },
  {
    question: "❓ What should I do if the message is not sent?",
    answer: `
If a message is not sent, it is recommended to follow these self-help steps before contacting support:

- Check for a stable internet connection: Make sure you are connected to a stable and fast internet network.
- Refresh the browser: Use the shortcut Ctrl + F5 (or Cmd + Shift + R on Mac) to reload the page and clear the cache.
- Check maintenance status: Ensure that the system is not in maintenance mode or that there is no known issue through system messages.
- Try another browser: Sometimes issues occur in a specific browser – switching to Chrome, Firefox, or Edge may help.
- Check attachments: If the message includes files, ensure that their size and format meet the system's requirements.

If the problem persists after all these steps, contact technical support and provide customer details, message content, error time, and browser and system data.
    `,
  },
  {
    question: "❓ How will I know if the customer has read my message?",
    answer: `
Currently, the chat system does not provide explicit read receipts for sent messages, in order to maintain user privacy and technological simplicity. However, conversations are updated in real-time, so you can see when the customer sends a response or starts typing a message. In cases where it is crucial to ensure that the customer received the message, it is recommended to use additional communication channels (such as phone or email) or to include an explicit request for confirmation of receipt in the message.
    `,
  },
  {
    question: "❓ Is it possible to view historical messages with customers?",
    answer: `
Yes, all messages are securely stored in the system and you can review the conversation history with any customer at any time. The system allows scrolling back to old messages and offers tools for filtering and searching within conversations by keywords or dates. This way, you can keep track of all previous communication and maintain a professional continuity in responding to customers, which enhances the service experience and the internal management of the business.
    `,
  },
  {
    question: "❓ What should I do if I do not see customer messages in real-time?",
    answer: `
If conversations are not updating in real-time, it is recommended to take the following actions:

- Check internet connection: Ensure that your network is stable and active.
- Refresh the page: Use Ctrl + F5 or Cmd + Shift + R to reload the system.
- Clear cache and cookies in the browser: In some cases, stored data may cause improper loading.
- Try another browser or another computer/device: Sometimes the issue is local.
- Check for system updates: There may be maintenance or temporary updates in the system.

If the problem persists after all these steps, contact support with a detailed description, screenshots, and browser details.
    `,
  },
  {
    question: "❓ Can I send files or links in messages?",
    answer: `
Yes, the system allows sending files, images, and links directly within the chat window with the customer. You can attach documents in common formats (PDF, JPG, PNG, DOC, etc.) and add external links to services, information sites, or product pages. It is important to ensure that the files do not exceed the maximum upload size (usually up to 5MB) and that the format is supported by the system. This option allows for enriching the conversation and providing a more professional and detailed response to customers.
    `,
  },
  {
    question: "❓ How to handle incorrect or duplicate messages sent by mistake?",
    answer: `
In the Esclic system, there is no option to delete or edit messages after sending, in order to maintain transparency and reliability in communication. If an incorrect message was sent, it is recommended to send another message with clarification or an apology. To reduce errors, it is advisable to read the message carefully before sending. This process ensures professional and respectful communication with customers.
    `,
  },
  {
    question: "❓ What should I do if I cannot load the list of conversations or customers?",
    answer: `
When the list of conversations or customers does not load, follow these steps:

- Check for a proper internet connection.
- Refresh the page (Ctrl + F5 or Cmd + Shift + R).
- Clear cache and cookies in the browser.
- Try accessing the system in another browser or device.
- Check for maintenance messages or issues in the system.

If the problem persists, contact technical support with a screenshot, detailed description, and the time the issue occurred.
    `,
  },
  {
    question: "❓ Is it possible to use the chat to work with multiple customers simultaneously?",
    answer: `
Yes, the system allows managing conversations with multiple customers simultaneously through a user-friendly interface organized by a sidebar conversation list. You can easily switch between different conversations, receive notifications about new messages, and manage organized and efficient communication without losing information or closing a conversation window. This function contributes to increased productivity and provides fast and professional service to customers.
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
        direction: "rtl",
        textAlign: "right",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 25 }}>
        Questions and Answers - Customer Messages
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

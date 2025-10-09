import { useState } from "react";

export default function ChatDemo() {
  const [messages, setMessages] = useState([
    { sender: "Dana Cohen", time: "09:47", text: "Hello, I wanted to check if you also deliver to Rishon LeZion?" },
    { sender: "Bizuply", time: "09:50", text: "Hi Dana, thanks for reaching out! Yes, we deliver to Rishon LeZion Sunday–Thursday." },
    { sender: "Dana Cohen", time: "09:52", text: "What’s the estimated delivery time if I order now?" },
    { sender: "Bizuply", time: "09:53", text: "Usually it takes up to 2 business days. If you place the order before 14:00 – we’ll ship it today!" },
    { sender: "Dana Cohen", time: "09:54", text: "Perfect! Thank you so much 🙏" },
    { sender: "Bizuply", time: "09:55", text: "You’re welcome! We’re here for any question 😊" },
  ]);

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-2xl shadow-md border">
      <h2 className="text-xl font-bold mb-4 text-center">Chat with Dana Cohen</h2>
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.sender === "Bizuply" ? "bg-purple-100 self-start" : "bg-gray-100 self-end ml-auto"
            }`}
          >
            <div className="text-sm text-gray-500">{msg.sender} • {msg.time}</div>
            <div className="text-md text-right">{msg.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";

export default function ChatDemo() {
  const [messages, setMessages] = useState([
    { sender: "Dana Cohen", time: "09:47", text: "Hello, I wanted to check if you have deliveries to Rishon Lezion as well?" },
    { sender: "Eskalik", time: "09:50", text: "Hi Dana, thank you for reaching out to us! Yes, we do deliveries to Rishon Lezion from Sunday to Thursday." },
    { sender: "Dana Cohen", time: "09:52", text: "What is the estimated arrival time if I order now?" },
    { sender: "Eskalik", time: "09:53", text: "Usually, it takes up to 2 business days. If you place an order by 14:00 – we will send it today!" },
    { sender: "Dana Cohen", time: "09:54", text: "Great! Thank you very much 🙏" },
    { sender: "Eskalik", time: "09:55", text: "You're welcome, we're here for any questions 😊" },
  ]);

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-2xl shadow-md border">
      <h2 className="text-xl font-bold mb-4 text-center">Chat with Dana Cohen</h2>
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.sender === "Eskalik" ? "bg-purple-100 self-start" : "bg-gray-100 self-end ml-auto"
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
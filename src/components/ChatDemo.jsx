import { useState } from "react";

export default function ChatDemo() {
  const [messages, setMessages] = useState([
    { sender: "דנה כהן", time: "09:47", text: "שלום, רציתי לבדוק אם יש לכם משלוחים גם לראשון לציון?" },
    { sender: "עסקליק", time: "09:50", text: "היי דנה, תודה שפנית אלינו! כן, אנחנו עושים משלוחים גם לראשון לציון בימים ראשון–חמישי." },
    { sender: "דנה כהן", time: "09:52", text: "מה זמן ההגעה המשוער אם אני מזמינה עכשיו?" },
    { sender: "עסקליק", time: "09:53", text: "בדרך כלל זה לוקח עד 2 ימי עסקים. אם תבצעי הזמנה עד השעה 14:00 – נשלח היום!" },
    { sender: "דנה כהן", time: "09:54", text: "מעולה! תודה רבה 🙏" },
    { sender: "עסקליק", time: "09:55", text: "בשמחה, אנחנו כאן לכל שאלה 😊" },
  ]);

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded-2xl shadow-md border">
      <h2 className="text-xl font-bold mb-4 text-center">צ׳אט עם דנה כהן</h2>
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.sender === "עסקליק" ? "bg-purple-100 self-start" : "bg-gray-100 self-end ml-auto"
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

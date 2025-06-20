import React, { useState } from "react";

const faq = [
  { question: "איך לערוך את הפרופיל שלי?", answer: "תוכל לערוך את הפרופיל תחת 'הגדרות' בתפריט." },
  { question: "איך ליצור קשר עם שירות הלקוחות?", answer: "ניתן ליצור קשר בטלפון 123456 או באימייל support@example.com" },
  // הוסיפי עוד שאלות ותשובות רלוונטיות למרכז העזרה שלך
];

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);

  async function sendQuestion() {
    if (!input.trim()) return;

    setChatLog((prev) => [...prev, { role: "user", content: input }]);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();

      setChatLog((prev) => [...prev, { role: "bot", content: data.answer, source: data.source }]);
    } catch (error) {
      setChatLog((prev) => [...prev, { role: "bot", content: "אירעה שגיאה בשרת" }]);
    }

    setInput("");
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 6, height: "400px", display: "flex", flexDirection: "column" }}>
      <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: 10 }}>
        {chatLog.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 8, textAlign: msg.role === "user" ? "right" : "left" }}>
            <b>{msg.role === "user" ? "אתה" : "בוט"}:</b> {msg.content} {msg.source && <small>({msg.source})</small>}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="כתוב כאן את השאלה שלך..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
        style={{ padding: 8, borderRadius: 4, border: "1px solid #aaa" }}
      />
      <button onClick={sendQuestion} style={{ marginTop: 8, padding: 8, borderRadius: 4, cursor: "pointer" }}>
        שלח
      </button>
    </div>
  );
}

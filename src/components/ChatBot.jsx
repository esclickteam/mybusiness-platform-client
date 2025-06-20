import React, { useState } from "react";

const faq = [
  { question: "איך לערוך את הפרופיל שלי?", answer: "תוכל לערוך את הפרופיל תחת 'הגדרות' בתפריט." },
  { question: "איך ליצור קשר עם שירות הלקוחות?", answer: "ניתן ליצור קשר בטלפון 123456 או באימייל support@example.com" },
  // הוסיפי עוד שאלות ותשובות רלוונטיות למרכז העזרה שלך
];

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [chatOpen, setChatOpen] = useState(true);

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

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "50%",
          width: 48,
          height: 48,
          fontSize: 28,
          cursor: "pointer",
          zIndex: 10000,
          border: "none",
          boxShadow: "0 3px 8px rgba(0,123,255,0.6)",
        }}
        aria-label="פתח יועץ AI"
      >
        💬
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        border: "1px solid #ccc",
        padding: 12,
        borderRadius: 6,
        height: 400,
        width: 350,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        zIndex: 10000,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong>יועץ AI</strong>
        <button
          onClick={() => setChatOpen(false)}
          aria-label="סגור צ'אט"
          style={{
            background: "transparent",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            color: "#007bff",
            fontWeight: "bold",
            lineHeight: "1",
            padding: "0 6px",
          }}
        >
          &times;
        </button>
      </header>

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
        style={{ padding: 8, borderRadius: 4, border: "1px solid #aaa", direction: "rtl" }}
        aria-label="שאלת בוט AI"
      />
      <button
        onClick={sendQuestion}
        style={{ marginTop: 8, padding: 8, borderRadius: 4, cursor: "pointer" }}
        aria-label="שלח שאלה לבוט AI"
      >
        שלח
      </button>
    </div>
  );
}

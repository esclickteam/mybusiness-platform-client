import React, { useState, useRef, useEffect } from "react";

export default function HelpChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // Chat messages
  const messagesEndRef = useRef(null);

  // Automatically scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a question to the server and add the response to the chat
  async function sendQuestion() {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: data.answer || "Sorry, no suitable answer was found.",
      };
      setMessages((msgs) => [...msgs, botMessage]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "An error occurred, please try again later." },
      ]);
    }
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Help – Questions & Answers
      </h2>

      <div
        style={{
          height: 400,
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: 12,
          borderRadius: 6,
          backgroundColor: "#fafafa",
          marginBottom: 12,
          direction: "ltr",
        }}
      >
        {messages.length === 0 && (
          <p style={{ textAlign: "center", color: "#888" }}>
            Type a question to start
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 10,
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                backgroundColor: msg.sender === "user" ? "#007bff" : "#e0e0e0",
                color: msg.sender === "user" ? "white" : "black",
                padding: "8px 12px",
                borderRadius: 20,
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
          style={{
            flexGrow: 1,
            padding: 10,
            borderRadius: 25,
            border: "1.5px solid #ccc",
            fontSize: 16,
            direction: "ltr",
            outline: "none",
          }}
          aria-label="Help question"
        />
        <button
          onClick={sendQuestion}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 25,
            padding: "0 20px",
            fontSize: 16,
            cursor: "pointer",
          }}
          aria-label="Send question"
        >
          Send
        </button>
      </div>
    </div>
  );
}

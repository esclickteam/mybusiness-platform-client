import React, { useState, useRef, useEffect } from "react";

export default function ChatBot({ chatOpen, setChatOpen }) {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  function cleanText(text) {
    return text.replace(/\*\*/g, "");
  }

  async function sendMessage() {
    if (!chatInput.trim()) return;

    const userMessage = { sender: "user", text: chatInput };
    setChatMessages((msgs) => [...msgs, userMessage]);
    setChatInput("");

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: chatInput }),
      });
      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: cleanText(data.answer || "סליחה, לא הצלחתי למצוא תשובה לשאלה זו."),
        source: data.source || "עסקליק AI",
      };
      setChatMessages((msgs) => [...msgs, botMessage]);
    } catch {
      setChatMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "אירעה שגיאה, נסה שוב מאוחר יותר.", source: "מערכת" },
      ]);
    }
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
          border: "none",
          borderRadius: "50%",
          width: 48,
          height: 48,
          cursor: "pointer",
          fontSize: 28,
          zIndex: 10000,
          boxShadow: "0 3px 8px rgba(0,123,255,0.6)",
        }}
        aria-label="פתח יועץ AI"
      >
        💬
      </button>
    );
  }

  return (
    <section
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        width: 350,
        maxHeight: 500,
        backgroundColor: "#fff",
        borderRadius: 14,
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        zIndex: 10000,
        overflow: "hidden",
      }}
    >
      <header
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "12px 20px",
          fontWeight: "700",
          fontSize: 18,
          letterSpacing: "0.5px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          userSelect: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        יועץ עסקליק AI
        <button
          onClick={() => setChatOpen(false)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            cursor: "pointer",
            lineHeight: "1",
            padding: "0 6px",
          }}
          aria-label="סגור צ'אט"
        >
          &times;
        </button>
      </header>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          backgroundColor: "#f6f8fa",
          fontSize: 15,
          lineHeight: 1.5,
          color: "#333",
        }}
      >
        {chatMessages.length === 0 && (
          <p
            style={{
              color: "#888",
              fontStyle: "italic",
              textAlign: "center",
              marginTop: 50,
              userSelect: "none",
            }}
          >
            שלום! איך אפשר לעזור לך?
          </p>
        )}
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: msg.sender === "user" ? "row-reverse" : "row",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "12px 18px",
                borderRadius: 25,
                borderBottomRightRadius: msg.sender === "user" ? 0 : 25,
                borderBottomLeftRadius: msg.sender === "user" ? 25 : 0,
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                whiteSpace: "pre-line",
                fontWeight: msg.sender === "bot" ? "500" : "400",
                fontSize: 15,
              }}
              title={msg.source ? `מקור התשובה: ${msg.source}` : ""}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          borderTop: "1px solid #ddd",
          padding: "12px 15px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="כתוב שאלה..."
          style={{
            flex: 1,
            border: "1.5px solid #ccc",
            borderRadius: 25,
            padding: "10px 18px",
            fontSize: 15,
            outline: "none",
            direction: "rtl",
            transition: "border-color 0.3s ease",
          }}
          aria-label="שאלת בוט AI"
          onFocus={(e) => (e.target.style.borderColor = "#007bff")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: 12,
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "50%",
            width: 42,
            height: 42,
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 3px 8px rgba(0,123,255,0.6)",
            transition: "background-color 0.3s ease",
          }}
          aria-label="שלח שאלה לבוט AI"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
        >
          &#9658;
        </button>
      </div>
    </section>
  );
}

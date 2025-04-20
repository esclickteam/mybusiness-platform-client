import React, { useState, useEffect, useRef } from "react";
import Markdown from "markdown-to-jsx";
import './AdvisorChat.css';

const BusinessAdvisorTab = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [startedChat, setStartedChat] = useState(false);
  const bottomRef = useRef(null);

  const presetQuestions = [
    "איך להעלות מחירים בלי לאבד לקוחות?",
    "איך להתמודד עם ירידה בהכנסות?",
    "מה הדרך הכי טובה לנהל עובדים?",
    "איך אפשר לשפר שירות לקוחות?",
    "איך בונים תוכנית עסקית פשוטה?"
  ];

  const sendMessage = async (newMessages) => {
    setLoading(true);
    const payload = {
      messages: newMessages,
      type: "business",
    };

    try {
      const response = await fetch("http://localhost:5005/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const botMessage = {
        role: "assistant",
        content: data.answer || "❌ לא התקבלה תשובה מהשרת.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("שגיאה:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ שגיאה בשרת או שאין קרדיטים פעילים." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const userMessage = { role: "user", content: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput("");
    setStartedChat(true);
    sendMessage(newMessages);
  };

  const handlePresetQuestion = (question) => {
    const userMessage = { role: "user", content: question };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setStartedChat(true);
    sendMessage(newMessages);
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="advisor-chat-container">
      <h2>יועץ עסקי 🤝</h2>
      <p>בחר/י שאלה מוכנה או שיחה חופשית:</p>

      {!startedChat && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginBottom: "1.5rem"
        }}>
          {presetQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => handlePresetQuestion(q)}
              style={{
                backgroundColor: "#f1f1f1",
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "10px 16px",
                cursor: "pointer",
                textAlign: "right"
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="chat-box-wrapper">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`bubble ${msg.role}`}>
              {msg.role === "assistant" ? (
                <Markdown
                  options={{
                    overrides: {
                      p: {
                        component: (props) => (
                          <p style={{
                            margin: "0.2em 0",
                            direction: "rtl",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            textAlign: "right"
                          }}>{props.children}</p>
                        )
                      }
                    }
                  }}
                >
                  {msg.content}
                </Markdown>
              ) : (
                msg.content
              )}
            </div>
          ))}

          {loading && (
            <div className="bubble assistant">⌛ מחשב תשובה...</div>
          )}

          <div style={{ height: "1px" }} ref={bottomRef}></div>
        </div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="כתבי שאלה משלך..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button onClick={handleSubmit} disabled={loading}>
          שליחה
        </button>
      </div>
    </div>
  );
};

export default BusinessAdvisorTab;

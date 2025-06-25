import React, { useState, useEffect, useRef } from "react";
import Markdown from "markdown-to-jsx";
import "./AdvisorChat.css";

const MarketingAdvisorTab = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [startedChat, setStartedChat] = useState(false);
  const bottomRef = useRef(null);

  const presetQuestions = [
    "איך להביא יותר לידים לעסק?",
    "איך לבנות תוכנית שיווק חודשית?",
    "מה ההבדל בין קמפיין ממומן לאורגני?",
    "איך לשפר אחוזי המרה באתר?",
    "באיזה רשת חברתית כדאי להתמקד?"
  ];

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  if (!apiBaseUrl) {
    throw new Error("Missing VITE_API_URL environment variable");
  }

  const sendMessage = async (newMessages) => {
    setLoading(true);
    const payload = {
      messages: newMessages,
      type: "marketing",
    };

    try {
      const response = await fetch(`${apiBaseUrl}/ask-ai`, {
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
      console.error("⚠️ שגיאה בבקשה:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ שגיאה בשרת או שאין קרדיטים פעילים." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!userInput.trim()) return;
    const userMessage = { role: "user", content: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput("");
    setStartedChat(true);
    sendMessage(newMessages);
  };

  const handlePresetQuestion = (text) => {
    const userMessage = { role: "user", content: text };
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
      <h2>יועץ שיווקי 📈</h2>
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
              className="preset-question-btn"
              onClick={() => handlePresetQuestion(q)}
              type="button"
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
                          <div style={{
                            margin: "0.2em 0",
                            direction: "rtl",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            textAlign: "right"
                          }}>
                            {props.children}
                          </div>
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

          <div style={{ minHeight: "80px" }} />
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="כתבי שאלה שיווקית..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          שליחה
        </button>
      </div>
    </div>
  );
};

export default MarketingAdvisorTab;

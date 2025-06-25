import React, { useState, useEffect, useRef } from "react";
import Markdown from "markdown-to-jsx";
import "./AdvisorChat.css";

const MarketingAdvisorTab = ({ businessId, conversationId, userId }) => {
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

  const sendMessage = async (promptText) => {
    if (!businessId || !promptText.trim()) return;

    setLoading(true);

    const payload = {
      businessId,
      prompt: promptText,
      profile: {
        conversationId: conversationId || null,
        userId: userId || null,
      },
    };

    try {
      console.log("🟢 שולח בקשה לשרת עם הפיילוד:", payload);

      const response = await fetch(`${apiBaseUrl}/chat/ai-command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("🟢 סטטוס תגובה מהשרת:", response.status);

      const data = await response.json();

      console.log("🟢 תוכן תגובה מהשרת:", data);

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
    sendMessage(userInput);
  };

  const handlePresetQuestion = (text) => {
    const userMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setStartedChat(true);
    sendMessage(text);
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
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
                          <p
                            style={{
                              margin: "0.2em 0",
                              direction: "rtl",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              textAlign: "right",
                            }}
                          >
                            {props.children}
                          </p>
                        ),
                      },
                    },
                  }}
                >
                  {msg.content}
                </Markdown>
              ) : (
                msg.content
              )}
            </div>
          ))}

          {loading && <div className="bubble assistant">⌛ מחשב תשובה...</div>}

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

import React, { useState, useEffect, useRef, useCallback } from "react";
import Markdown from "markdown-to-jsx";
import "./AdvisorChat.css";

const BusinessAdvisorTab = ({ businessId, conversationId, userId, businessDetails }) => {
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

  const apiBaseUrl = import.meta.env.VITE_API_URL;
  if (!apiBaseUrl) {
    throw new Error("Missing VITE_API_URL environment variable");
  }

  // שימוש ב־useRef כדי לשמור AbortController בין רינדורים
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(async (promptText, conversationMessages) => {
    if (!businessId || !promptText.trim()) return;
    if (loading) return;  // מניעת בקשה כפולה

    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();  // מבטל בקשות קודמות במידה ויש
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const payload = {
      businessId,
      prompt: promptText,
      businessDetails,
      profile: {
        conversationId: conversationId || null,
        userId: userId || null,
      },
      messages: conversationMessages || messages,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/chat/business-advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await response.json();

      const botMessage = {
        role: "assistant",
        content: data.answer || "❌ לא התקבלה תשובה מהשרת.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      if (error.name === "AbortError") {
        // בקשה בוטלה - לא עושים כלום
        return;
      }
      console.error("שגיאה:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ שגיאה בשרת או שאין קרדיטים פעילים." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [businessId, businessDetails, conversationId, userId, messages, loading, apiBaseUrl]);

  const handleSubmit = useCallback(() => {
    if (!userInput.trim() || loading) return;

    const userMessage = { role: "user", content: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    sendMessage(userInput, newMessages);
    setUserInput("");
    setStartedChat(true);
  }, [userInput, loading, messages, sendMessage]);

  const handlePresetQuestion = useCallback((question) => {
    if (loading) return;

    const userMessage = { role: "user", content: question };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    sendMessage(question, newMessages);
    setStartedChat(true);
  }, [loading, messages, sendMessage]);

  useEffect(() => {
    // גלילה חלקה לאחר עדכון ההודעות, עם דיליי קטן לוודא שהDOM מעודכן
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="advisor-chat-container">
      <h2>יועץ עסקי 🤝</h2>
      <p>בחר/י שאלה מוכנה או שיחה חופשית:</p>

      {!startedChat && (
        <div className="preset-questions-container">
          {presetQuestions.map((q, index) => (
            <button
              key={index}
              className="preset-question-btn"
              onClick={() => handlePresetQuestion(q)}
              type="button"
              disabled={loading}
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
          disabled={loading}
          dir="rtl"
          autoFocus
        />
        <button onClick={handleSubmit} disabled={loading || !userInput.trim()}>
          שליחה
        </button>
      </div>
    </div>
  );
};

export default BusinessAdvisorTab;

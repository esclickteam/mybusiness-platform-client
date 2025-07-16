import React, { useState, useEffect, useRef, useCallback } from "react";
import Markdown from "markdown-to-jsx";
import "./AdvisorChat.css";

const MarketingAdvisorTab = ({ businessId, conversationId }) => {
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

  const sendMessage = useCallback(async (newMessages) => {
    if (loading) {
      console.log("sendMessage aborted: already loading");
      return;  // מניעת שליחה כפולה
    }
    setLoading(true);
    const lastUserMessage = newMessages.filter(m => m.role === "user").slice(-1)[0]?.content || "";
    console.log("Sending message:", lastUserMessage);

    const payload = {
      businessId,
      prompt: lastUserMessage,
      profile: { conversationId }
    };

    try {
      console.log("Calling API:", `${apiBaseUrl}/chat/marketing-advisor`, payload);
      const response = await fetch(`${apiBaseUrl}/chat/marketing-advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("API response status:", response.status);
      const data = await response.json();
      console.log("API response data:", data);

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
      console.log("sendMessage finished");
    }
  }, [businessId, conversationId, loading, apiBaseUrl]);

  const handleSend = useCallback(() => {
    if (!userInput.trim()) {
      console.log("handleSend aborted: empty user input");
      return;
    }
    if (loading) {
      console.log("handleSend aborted: loading");
      return;
    }
    const userMessage = { role: "user", content: userInput };
    const newMessages = [...messages, userMessage];
    console.log("handleSend userMessage:", userMessage);
    setMessages(newMessages);
    setUserInput("");
    setStartedChat(true);
    sendMessage(newMessages);
  }, [userInput, loading, messages, sendMessage]);

  const handlePresetQuestion = useCallback((text) => {
    if (loading) {
      console.log("handlePresetQuestion aborted: loading");
      return;
    }
    const userMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    console.log("handlePresetQuestion:", text);
    setMessages(newMessages);
    setStartedChat(true);
    sendMessage(newMessages);
  }, [loading, messages, sendMessage]);

  useEffect(() => {
    console.log("Messages updated:", messages);
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  // לוג של props חשובים
  useEffect(() => {
    console.log("MarketingAdvisorTab mounted with props:", { businessId, conversationId });
  }, [businessId, conversationId]);

  return (
    <div className="advisor-chat-container">
      <h2>יועץ שיווקי 📈</h2>
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
                          <div
                            className="markdown-message"
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
                          </div>
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
          disabled={loading}
          dir="rtl"
          autoFocus
        />
        <button onClick={handleSend} disabled={loading || !userInput.trim()}>
          שליחה
        </button>
      </div>
    </div>
  );
};

export default MarketingAdvisorTab;

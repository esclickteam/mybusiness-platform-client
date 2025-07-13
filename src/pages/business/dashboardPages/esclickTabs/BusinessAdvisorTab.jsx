import React, { useState, useEffect, useRef, useCallback } from "react";
import Markdown from "markdown-to-jsx";
import "./AdvisorChat.css";

const BusinessAdvisorTab = ({ businessId, conversationId, userId, businessDetails }) => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [startedChat, setStartedChat] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(null);
  const [extraPurchaseCount, setExtraPurchaseCount] = useState(1);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [purchaseError, setPurchaseError] = useState("");
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

  // Abort controller לשיחות
  const abortControllerRef = useRef(null);

  // טען ספירת שאלות ראשונית
  useEffect(() => {
    async function fetchRemaining() {
      try {
        const res = await fetch(`${apiBaseUrl}/business/my`, { credentials: "include" });
        if (!res.ok) throw new Error("Error fetching business info");
        const data = await res.json();
        const business = data.business;
        const maxQuestions = 60 + (business.extraQuestionsAllowed || 0);
        const left = maxQuestions - (business.monthlyQuestionCount || 0);
        setRemainingQuestions(left);
      } catch (e) {
        console.error("Failed to fetch remaining questions:", e);
        setRemainingQuestions(null);
      }
    }
    fetchRemaining();
  }, [apiBaseUrl]);

  const sendMessage = useCallback(async (promptText, conversationMessages) => {
    if (!businessId || !promptText.trim()) return;
    if (loading) return;

    if (remainingQuestions !== null && remainingQuestions <= 0) {
      setMessages(prev => [...prev, { role: "assistant", content: "❗ הגעת למגבלת השאלות החודשית. ניתן לרכוש שאלות נוספות." }]);
      return;
    }

    setLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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

      if (response.status === 403) {
        // השרת הודיע על מגבלה
        setRemainingQuestions(0);
        setMessages(prev => [...prev, { role: "assistant", content: data.error || "❗ הגעת למגבלת השאלות החודשית." }]);
      } else {
        const botMessage = {
          role: "assistant",
          content: data.answer || "❌ לא התקבלה תשובה מהשרת.",
        };
        setMessages(prev => [...prev, botMessage]);
        // עדכן ספירת שאלות פנימית
        setRemainingQuestions(prev => (prev !== null ? prev - 1 : null));
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("שגיאה:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ שגיאה בשרת או שאין קרדיטים פעילים." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [businessId, businessDetails, conversationId, userId, messages, loading, apiBaseUrl, remainingQuestions]);

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

  // רכישת שאלות נוספות
  const handlePurchaseExtra = async () => {
    if (purchaseLoading || extraPurchaseCount <= 0) return;

    setPurchaseLoading(true);
    setPurchaseMessage("");
    setPurchaseError("");

    try {
      const res = await fetch(`${apiBaseUrl}/business/my/purchase-extra-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extraQuestions: Number(extraPurchaseCount) }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "שגיאה ברכישת שאלות נוספות");
      }

      setPurchaseMessage(`נרכשו ${extraPurchaseCount} שאלות נוספות בהצלחה.`);
      // עדכון ספירת שאלות פנימית
      setRemainingQuestions(prev => (prev !== null ? prev + Number(extraPurchaseCount) : null));
      setExtraPurchaseCount(1);
    } catch (e) {
      setPurchaseError(e.message);
    } finally {
      setPurchaseLoading(false);
    }
  };

  useEffect(() => {
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

      {remainingQuestions !== null && remainingQuestions <= 0 && (
        <div className="purchase-extra-container" style={{ marginTop: "1em", padding: "1em", border: "1px solid #ccc", borderRadius: "8px" }}>
          <p style={{ color: "red", marginBottom: "0.5em" }}>
            הגעת למגבלת השאלות החודשית (60). ניתן לרכוש שאלות נוספות במסגרת המנוי.
          </p>
          <label>
            כמה שאלות נוספות תרצה/י לרכוש?&nbsp;
            <input
              type="number"
              min="1"
              value={extraPurchaseCount}
              onChange={(e) => setExtraPurchaseCount(Number(e.target.value))}
              disabled={purchaseLoading}
              style={{ width: "60px", textAlign: "center" }}
            />
          </label>
          <button
            onClick={handlePurchaseExtra}
            disabled={purchaseLoading || extraPurchaseCount <= 0}
            style={{ marginLeft: "1em" }}
          >
            {purchaseLoading ? "רוכש..." : "רכוש שאלות נוספות"}
          </button>
          {purchaseMessage && <p style={{ color: "green", marginTop: "0.5em" }}>{purchaseMessage}</p>}
          {purchaseError && <p style={{ color: "red", marginTop: "0.5em" }}>{purchaseError}</p>}
        </div>
      )}

      <div className="chat-input" style={{ marginTop: "1em" }}>
        <input
          type="text"
          placeholder="כתבי שאלה משלך..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={loading || (remainingQuestions !== null && remainingQuestions <= 0)}
          dir="rtl"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !userInput.trim() || (remainingQuestions !== null && remainingQuestions <= 0)}
        >
          שליחה
        </button>
      </div>
    </div>
  );
};

export default BusinessAdvisorTab;

import React, { useState, useEffect, useRef, useCallback } from "react";
import Markdown from "markdown-to-jsx";
import "./AdvisorChat.css";

const MarketingAdvisorTab = ({ businessId, conversationId }) => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [startedChat, setStartedChat] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [purchaseError, setPurchaseError] = useState("");
  const bottomRef = useRef(null);

  const presetQuestions = [
    "איך להביא יותר לידים לעסק?",
    "איך לבנות תוכנית שיווק חודשית?",
    "מה ההבדל בין קמפיין ממומן לאורגני?",
    "איך לשפר אחוזי המרה באתר?",
    "באיזה רשת חברתית כדאי להתמקד?"
  ];

  const aiPackages = [
    { id: "ai_200", label: "חבילת AI של 200 שאלות", price: 1, type: "ai-package" },
    { id: "ai_500", label: "חבילת AI של 500 שאלות", price: 1, type: "ai-package" }
  ];

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  if (!apiBaseUrl) {
    throw new Error("Missing VITE_API_URL environment variable");
  }

  const abortControllerRef = useRef(null);

  const refreshRemainingQuestions = useCallback(async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/business/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch business data");
      const data = await res.json();
      const business = data.business;
      const maxQuestions = 60 + (business.extraQuestionsAllowed || 0);
      const usedQuestions = (business.monthlyQuestionCount || 0) + (business.extraQuestionsUsed || 0);
      setRemainingQuestions(Math.max(maxQuestions - usedQuestions, 0));
    } catch (err) {
      console.error("Error refreshing remaining questions:", err);
      setRemainingQuestions(null);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    refreshRemainingQuestions();
  }, [refreshRemainingQuestions]);

  const sendMessage = useCallback(async (promptText, conversationMessages) => {
    if (!businessId || !promptText.trim() || loading) return;

    if (remainingQuestions !== null && remainingQuestions <= 0) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❗ הגעת למגבלת השאלות החודשית. ניתן לרכוש שאלות נוספות." }
      ]);
      return;
    }

    setLoading(true);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const payload = {
      businessId,
      prompt: promptText,
      profile: { conversationId },
      messages: conversationMessages || messages,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/chat/marketing-advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (response.status === 403) {
        setRemainingQuestions(0);
        const data = await response.json();
        const errorMsg = data?.error || "❗ הגעת למגבלת השאלות החודשית.";
        setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
      } else {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer || "❌ לא התקבלה תשובה מהשרת." }]);
        setRemainingQuestions((prev) => (prev !== null ? Math.max(prev - 1, 0) : null));
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ שגיאה בשרת או שאין קרדיטים פעילים." }]);
      }
      console.error("Error sending marketing advisor message:", error);
    } finally {
      setLoading(false);
    }
  }, [businessId, conversationId, loading, remainingQuestions, apiBaseUrl, messages]);

  const handleSend = useCallback(() => {
    if (!userInput.trim() || loading) return;
    const userMessage = { role: "user", content: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput("");
    setStartedChat(true);
    sendMessage(userInput, newMessages);
  }, [userInput, loading, messages, sendMessage]);

  const handlePresetQuestion = useCallback((text) => {
    if (loading) return;
    const userMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setStartedChat(true);
    sendMessage(text, newMessages);
  }, [loading, messages, sendMessage]);

  const handlePurchaseExtra = async () => {
    if (purchaseLoading || !selectedPackage) return;
    if (!businessId) {
      setPurchaseError("לא נמצא מזהה עסק. אנא היכנס מחדש.");
      return;
    }

    setPurchaseLoading(true);
    setPurchaseMessage("");
    setPurchaseError("");

    try {
      const url = selectedPackage.type === "ai-package" ? "/cardcomAI/ai-package" : "/purchase-package";

      const res = await fetch(`${apiBaseUrl}${url}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          businessId,
          packageType: selectedPackage.type,
          price: selectedPackage.price,
        }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      setPurchaseMessage(`נרכשה ${selectedPackage.label} בהצלחה במחיר ${selectedPackage.price} ש"ח.`);
      setSelectedPackage(null);

      await refreshRemainingQuestions();
    } catch (e) {
      setPurchaseError(e.message || "שגיאה ברכישת החבילה");
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
      <h2>יועץ שיווקי 📈</h2>
      <p>בחר/י שאלה מוכנה או שיחה חופשית:</p>

      {!startedChat && (
        <>
          <div className="preset-questions-container">
            {presetQuestions.map((q, i) => (
              <button
                key={i}
                className="preset-question-btn"
                onClick={() => handlePresetQuestion(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
          <hr style={{ margin: "1em 0" }} />

          {remainingQuestions !== null && remainingQuestions <= 0 && (
            <div className="purchase-extra-container">
              <p>הגעת למגבלת השאלות החודשית. ניתן לרכוש חבילת AI נוספת:</p>
              {aiPackages.map((pkg) => (
                <label key={pkg.id} className="radio-label">
                  <input
                    type="radio"
                    name="question-package"
                    value={pkg.id}
                    disabled={purchaseLoading}
                    checked={selectedPackage?.id === pkg.id}
                    onChange={() => setSelectedPackage(pkg)}
                  />
                  {pkg.label} - {pkg.price} ש"ח
                </label>
              ))}
              <button
                onClick={handlePurchaseExtra}
                disabled={purchaseLoading || !selectedPackage}
              >
                {purchaseLoading ? "רוכש..." : "רכוש חבילה"}
              </button>

              {purchaseMessage && <p className="success">{purchaseMessage}</p>}
              {purchaseError && <p className="error">{purchaseError}</p>}
            </div>
          )}
        </>
      )}

      <div className="chat-box-wrapper">
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`bubble ${msg.role}`}>
              {msg.role === "assistant" ? (
                <Markdown
                  options={{
                    overrides: {
                      p: {
                        component: (props) => (
                          <p style={{ margin: "0.2em 0", direction: "rtl", textAlign: "right" }}>
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
          <div ref={bottomRef} style={{ height: 1 }} />
        </div>
      </div>

      {/* שורת הקלט המעודכנת, כמו ביועץ העסקי */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="כתבי שאלה משלך..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading || (remainingQuestions !== null && remainingQuestions <= 0)}
          dir="rtl"
        />
        <button
          onClick={handleSend}
          disabled={loading || !userInput.trim() || (remainingQuestions !== null && remainingQuestions <= 0)}
        >
          שליחה
        </button>
      </div>
    </div>
  );
};

export default MarketingAdvisorTab;

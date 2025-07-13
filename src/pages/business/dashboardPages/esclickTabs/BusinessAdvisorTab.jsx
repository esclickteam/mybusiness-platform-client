import React, { useState, useEffect, useRef, useCallback } from "react";
import Markdown from "markdown-to-jsx";
import API from "@api";
import "./AdvisorChat.css";

const BusinessAdvisorTab = ({ businessId, conversationId, userId, businessDetails }) => {
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
    "איך להעלות מחירים בלי לאבד לקוחות?",
    "איך להתמודד עם ירידה בהכנסות?",
    "מה הדרך הכי טובה לנהל עובדים?",
    "איך אפשר לשפר שירות לקוחות?",
    "איך בונים תוכנית עסקית פשוטה?"
  ];

  // חבילות שאלות רגילות (לא מוצגות, נשארות להרחבה עתידית אם תרצה)
  const questionPackages = [
    { id: 200, label: "חבילת 200 שאלות נוספות", price: 99, type: "regular" },
    { id: 500, label: "חבילת 500 שאלות נוספות", price: 199, type: "regular" }
  ];

  // רק חבילות AI מוצגות למשתמש
  const aiPackages = [
    { id: "ai_200", label: "חבילת AI של 200 שאלות", price: 99, type: "ai-package" },
    { id: "ai_500", label: "חבילת AI של 500 שאלות", price: 199, type: "ai-package" }
  ];

  const abortControllerRef = useRef(null);

  useEffect(() => {
    async function fetchRemaining() {
      try {
        const res = await API.get("/business/my");
        console.log("fetchRemaining response:", res.data);
        const business = res.data.business;
        const maxQuestions = 60 + (business.extraQuestionsAllowed || 0);
        const usedQuestions = (business.monthlyQuestionCount || 0) + (business.extraQuestionsUsed || 0);
        const left = maxQuestions - usedQuestions;
        setRemainingQuestions(left);
        console.log("Remaining questions set to:", left);
      } catch (e) {
        console.error("Failed to fetch remaining questions:", e);
        setRemainingQuestions(null);
      }
    }
    fetchRemaining();
  }, []);

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

    console.log("Sending message payload:", payload);

    try {
      const response = await API.post("/chat/business-advisor", payload, { signal: controller.signal });
      console.log("sendMessage response:", response.data);

      if (response.status === 403) {
        setRemainingQuestions(0);
        setMessages(prev => [...prev, { role: "assistant", content: response.data.error || "❗ הגעת למגבלת השאלות החודשית." }]);
      } else {
        const botMessage = {
          role: "assistant",
          content: response.data.answer || "❌ לא התקבלה תשובה מהשרת.",
        };
        setMessages(prev => [...prev, botMessage]);
        setRemainingQuestions(prev => (prev !== null ? prev - 1 : null));
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("שגיאה ב-sendMessage:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ שגיאה בשרת או שאין קרדיטים פעילים." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [businessId, businessDetails, conversationId, userId, messages, loading, remainingQuestions]);

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

  const handlePurchaseExtra = async () => {
  if (purchaseLoading || !selectedPackage) return;
  if (!userId) {
    setPurchaseError("לא נמצא מזהה משתמש. אנא היכנס מחדש.");
    return;
  }

  setPurchaseLoading(true);
  setPurchaseMessage("");
  setPurchaseError("");

  console.log("Purchasing package:", selectedPackage, "for userId:", userId);

  try {
    let url = selectedPackage.type === "ai-package" ? "/ai-package" : "/purchase-package";

    const res = await API.post(url, {
      packageId: selectedPackage.id,
      userId,
      packageType: selectedPackage.type,
    });

    setPurchaseMessage(`נרכשה ${selectedPackage.label} בהצלחה במחיר ${selectedPackage.price} ש"ח.`);
    if (selectedPackage.type === "regular") {
      setRemainingQuestions(prev => (prev !== null ? prev + selectedPackage.id : null));
    }
    setSelectedPackage(null);

  } catch (e) {
    console.error("Error purchasing package:", e);
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
      <h2>יועץ עסקי 🤝</h2>
      <p>בחר/י שאלה מוכנה או שיחה חופשית:</p>

      {!startedChat && (
        <>
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

          <hr style={{ margin: "1em 0" }} />

          <div className="purchase-extra-container" style={{ padding: "1em", border: "1px solid #ccc", borderRadius: "8px" }}>
            <p>ניתן לרכוש חבילת AI בלבד:</p>

            {aiPackages.map((pkg) => (
              <label
                key={pkg.id}
                style={{
                  display: "block",
                  marginBottom: "0.3em",
                  cursor: purchaseLoading ? "not-allowed" : "pointer",
                }}
              >
                <input
                  type="radio"
                  name="question-package"
                  value={pkg.id}
                  disabled={purchaseLoading}
                  checked={selectedPackage?.id === pkg.id}
                  onChange={() => setSelectedPackage(pkg)}
                  style={{ marginLeft: "0.5em" }}
                />
                {pkg.label} - {pkg.price} ש"ח
              </label>
            ))}

            <button
              onClick={handlePurchaseExtra}
              disabled={purchaseLoading || !selectedPackage}
              style={{ marginTop: "0.5em" }}
            >
              {purchaseLoading ? "רוכש..." : "רכוש חבילה"}
            </button>

            {purchaseMessage && <p style={{ color: "green", marginTop: "0.5em" }}>{purchaseMessage}</p>}
            {purchaseError && <p style={{ color: "red", marginTop: "0.5em" }}>{purchaseError}</p>}
          </div>
        </>
      )}

      <div className="chat-box-wrapper" style={{ marginTop: "1em" }}>
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
        <div
          className="purchase-extra-container"
          style={{ marginTop: "1em", padding: "1em", border: "1px solid #ccc", borderRadius: "8px" }}
        >
          <p style={{ color: "red", marginBottom: "0.5em" }}>
            הגעת למגבלת השאלות החודשית (60). ניתן לרכוש שאלות נוספות במסגרת המנוי.
          </p>
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

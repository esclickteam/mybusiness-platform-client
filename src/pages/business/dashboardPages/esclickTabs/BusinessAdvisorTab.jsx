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

  const aiPackages = [
    { id: "ai_200", label: "חבילת AI של 200 שאלות", price: 1, type: "ai-package" },
    { id: "ai_500", label: "חבילת AI של 500 שאלות", price: 1, type: "ai-package" }
  ];

  const abortControllerRef = useRef(null);

  // פונקציה לרענון קרדיטים
  const refreshRemainingQuestions = useCallback(async () => {
    console.log("Refreshing remaining questions...");
    try {
      const res = await API.get("/business/my");
      console.log("Refresh response:", res);
      const business = res.data.business;
      const maxQuestions = 60 + (business.extraQuestionsAllowed || 0);
      const usedQuestions = (business.monthlyQuestionCount || 0) + (business.extraQuestionsUsed || 0);
      const remaining = Math.max(maxQuestions - usedQuestions, 0);
      console.log("Remaining questions calculated:", remaining);
      setRemainingQuestions(remaining);
    } catch (error) {
      console.error("Error refreshing remaining questions:", error);
      setRemainingQuestions(null);
    }
  }, []);

  useEffect(() => {
    console.log("Component mounted or refreshRemainingQuestions changed");
    refreshRemainingQuestions();
  }, [refreshRemainingQuestions]);

  const sendMessage = useCallback(async (promptText, conversationMessages) => {
    console.log("sendMessage called with:", { promptText, conversationMessages });
    if (!businessId || !promptText.trim() || loading) {
      console.log("sendMessage aborted: invalid conditions", { businessId, promptText, loading });
      return;
    }

    if (remainingQuestions !== null && remainingQuestions <= 0) {
      console.log("No remaining questions. Showing limit message.");
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "❗ הגעת למגבלת השאלות החודשית. ניתן לרכוש שאלות נוספות." }
      ]);
      return;
    }

    setLoading(true);
    if (abortControllerRef.current) {
      console.log("Aborting previous request");
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const payload = {
      businessId,
      prompt: promptText,
      businessDetails,
      profile: { conversationId: conversationId || null, userId: userId || null },
      messages: conversationMessages || messages,
    };
    console.log("Sending payload:", payload);

    try {
      const response = await API.post("/chat/business-advisor", payload, { signal: controller.signal });
      console.log("API response:", response);

      if (response.status === 403) {
        console.warn("Reached question limit according to API");
        setRemainingQuestions(0);
        const errorMsg = response.data?.error || "❗ הגעת למגבלת השאלות החודשית.";
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: errorMsg }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: response.data.answer || "❌ לא התקבלה תשובה מהשרת." }
        ]);
        setRemainingQuestions(prev => (prev !== null ? Math.max(prev - 1, 0) : null));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.name !== "AbortError") {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "⚠️ שגיאה בשרת או שאין קרדיטים פעילים." }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [businessId, businessDetails, conversationId, userId, messages, loading, remainingQuestions]);

  const handleSubmit = useCallback(() => {
    console.log("handleSubmit called with userInput:", userInput);
    if (!userInput.trim() || loading) {
      console.log("handleSubmit aborted");
      return;
    }
    const userMessage = { role: "user", content: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    sendMessage(userInput, newMessages);
    setUserInput("");
    setStartedChat(true);
  }, [userInput, loading, messages, sendMessage]);

  const handlePresetQuestion = useCallback((question) => {
    console.log("handlePresetQuestion called with:", question);
    if (loading) {
      console.log("handlePresetQuestion aborted, loading in progress");
      return;
    }
    const userMessage = { role: "user", content: question };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    sendMessage(question, newMessages);
    setStartedChat(true);
  }, [loading, messages, sendMessage]);

  const handlePurchaseExtra = async () => {
    console.log("handlePurchaseExtra called");
    if (purchaseLoading || !selectedPackage) {
      console.log("handlePurchaseExtra aborted", { purchaseLoading, selectedPackage });
      return;
    }
    if (!businessId) {
      setPurchaseError("לא נמצא מזהה עסק. אנא היכנס מחדש.");
      return;
    }

    setPurchaseLoading(true);
    setPurchaseMessage("");
    setPurchaseError("");

    try {
      const url =
        selectedPackage.type === "ai-package"
          ? "/cardcomAI/ai-package"
          : "/purchase-package";

      console.log("Purchasing package:", selectedPackage);
      const res = await API.post(url, {
        packageId: selectedPackage.id,
        businessId,
        packageType: selectedPackage.type,
      });
      console.log("Purchase response:", res);

      if (res.data.paymentUrl) {
        console.log("Redirecting to payment URL:", res.data.paymentUrl);
        window.location.href = res.data.paymentUrl;
        return;
      }

      setPurchaseMessage(`נרכשה ${selectedPackage.label} בהצלחה במחיר ${selectedPackage.price} ש"ח.`);
      setSelectedPackage(null);

      await refreshRemainingQuestions();
    } catch (e) {
      console.error("Purchase error:", e);
      setPurchaseError(e.message || "שגיאה ברכישת החבילה");
    } finally {
      setPurchaseLoading(false);
    }
  };

  useEffect(() => {
    console.log("Messages updated, scrolling to bottom");
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  // --- לוגים ראשוניים לבדיקת פרופס וסטייט ---
  useEffect(() => {
    console.log("BusinessAdvisorTab mounted with props:", { businessId, conversationId, userId, businessDetails });
  }, [businessId, conversationId, userId, businessDetails]);

  return (
    <div className="advisor-chat-container">
      <h2>יועץ עסקי 🤝</h2>
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
              <p>ניתן לרכוש חבילת AI בלבד:</p>
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
                <Markdown options={{
                  overrides: {
                    p: { component: (props) => (
                      <p style={{ margin: "0.2em 0", direction: "rtl", textAlign: "right" }}>
                        {props.children}
                      </p>
                    ) }
                  }
                }}>
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

      {remainingQuestions !== null && remainingQuestions <= 0 && (
        <div className="purchase-extra-container">
          <p className="error">
            הגעת למגבלת השאלות החודשית (60). ניתן לרכוש שאלות נוספות במסגרת המנוי.
          </p>
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          placeholder="כתבי שאלה משלך..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={loading || (remainingQuestions !== null && remainingQuestions <= 0)}
          dir="rtl"
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

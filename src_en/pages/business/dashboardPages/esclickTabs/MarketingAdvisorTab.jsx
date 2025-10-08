```javascript
import React, { useState, useEffect, useRef, useCallback } from "react";
import Markdown from "markdown-to-jsx";
import API from "@api";
import "./AdvisorChat.css";

const MarketingAdvisorTab = ({ businessId, conversationId, userId, businessDetails }) => {
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
  const abortControllerRef = useRef(null);

  const presetQuestions = [
    "How to bring more leads to the business?",
    "How to build a monthly marketing plan?",
    "What is the difference between paid and organic campaigns?",
    "How to improve conversion rates on the website?",
    "Which social network should I focus on?"
  ];

  const aiPackages = [
    { id: "ai_200", label: "AI Package of 200 Questions", price: 99, type: "ai-package" },
    { id: "ai_500", label: "AI Package of 500 Questions", price: 139, type: "ai-package" }
  ];

  const refreshRemainingQuestions = useCallback(async () => {
    if (!businessId) return;
    try {
      const res = await API.get(`/business/${businessId}?t=${Date.now()}`);
      const business = res.data.business;

      const maxQuestions = 60 + (business.extraQuestionsAllowed || 0);
      const usedQuestions = (business.monthlyQuestionCount || 0) + (business.extraQuestionsUsed || 0);
      const remaining = Math.max(maxQuestions - usedQuestions, 0);
      setRemainingQuestions(remaining);
    } catch {
      setRemainingQuestions(null);
    }
  }, [businessId]);

  useEffect(() => {
    refreshRemainingQuestions();
  }, [refreshRemainingQuestions, businessId]);

  const sendMessage = useCallback(
    async (promptText, conversationMessages) => {
      if (!businessId || !promptText.trim() || loading) return;

      if (remainingQuestions !== null && remainingQuestions <= 0) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "❗ You have reached the monthly question limit. You can purchase additional questions." }
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
        businessDetails,
        profile: { conversationId: conversationId || null, userId: userId || null },
        messages: conversationMessages || messages
      };

      try {
        const response = await API.post("/chat/marketing-advisor", payload, { signal: controller.signal });
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: response.data.answer || "❌ No response received from the server." }
        ]);
        setRemainingQuestions(prev => (prev !== null ? Math.max(prev - 1, 0) : null));
        await refreshRemainingQuestions();
      } catch (error) {
        if (error.name === "AbortError") return;

        if (error.response?.status === 403) {
          const msg = error.response?.data?.error || "❗ You have reached the monthly question limit.";
          setRemainingQuestions(0);
          setMessages(prev => [...prev, { role: "assistant", content: msg }]);
          return;
        }

        setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Server error or no active credits." }]);
      } finally {
        setLoading(false);
      }
    },
    [businessId, businessDetails, conversationId, userId, messages, loading, remainingQuestions, refreshRemainingQuestions]
  );

  const handleSubmit = useCallback(() => {
    if (!userInput.trim() || loading) return;
    const userMessage = { role: "user", content: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    sendMessage(userInput, newMessages);
    setUserInput("");
    setStartedChat(true);
  }, [userInput, loading, messages, sendMessage]);

  const handlePresetQuestion = useCallback(
    (question) => {
      if (loading) return;
      const userMessage = { role: "user", content: question };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      sendMessage(question, newMessages);
      setStartedChat(true);
    },
    [loading, messages, sendMessage]
  );

  const handlePurchaseExtra = async () => {
    if (purchaseLoading || !selectedPackage) return;
    if (!businessId) {
      setPurchaseError("Business ID not found. Please log in again.");
      return;
    }

    setPurchaseLoading(true);
    setPurchaseMessage("");
    setPurchaseError("");

    try {
      const url = selectedPackage.type === "ai-package" ? "/cardcomAI/ai-package" : "/purchase-package";
      const res = await API.post(url, {
        packageId: selectedPackage.id,
        businessId,
        packageType: selectedPackage.type,
        price: selectedPackage.price
      });

      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
        return;
      }

      setPurchaseMessage(`Successfully purchased ${selectedPackage.label} for ${selectedPackage.price} ILS.`);
      setSelectedPackage(null);
      await refreshRemainingQuestions();
    } catch (e) {
      setPurchaseError(e.message || "Error purchasing the package");
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
      <h2>Marketing Advisor 📈</h2>
      <p>Select a preset question or free conversation:</p>

      {remainingQuestions !== null && (
        <p style={{ fontSize: 22, opacity: 0.7 }}>
          Monthly balance: {remainingQuestions} questions remaining
        </p>
      )}

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
        </>
      )}

      {remainingQuestions !== null && remainingQuestions <= 0 && (
        <div className="purchase-extra-container">
          <p>You have reached the monthly question limit. You can purchase an additional AI package:</p>
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
              {pkg.label} - {pkg.price} ILS
            </label>
          ))}
          <button onClick={handlePurchaseExtra} disabled={purchaseLoading || !selectedPackage}>
            {purchaseLoading ? "Purchasing..." : "Purchase Package"}
          </button>
          {purchaseMessage && <p className="success">{purchaseMessage}</p>}
          {purchaseError && <p className="error">{purchaseError}</p>}
        </div>
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
          {loading && <div className="bubble assistant">⌛ Calculating response...</div>}
          <div ref={bottomRef} style={{ height: 1 }} />
        </div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your question..."
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
          Send
        </button>
      </div>
    </div>
  );
};

export default MarketingAdvisorTab;
```
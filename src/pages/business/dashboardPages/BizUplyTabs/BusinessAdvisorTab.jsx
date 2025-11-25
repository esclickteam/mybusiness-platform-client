// --- CLEAN VERSION: NO PAYMENTS, NO PACKAGES ---

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

  const bottomRef = useRef(null);
  const abortControllerRef = useRef(null);

  const presetQuestions = [
    "How to raise prices without losing customers?",
    "How to deal with a drop in income?",
    "What is the best way to manage employees?",
    "How can customer service be improved?",
    "How to build a simple business plan?"
  ];

  const refreshRemainingQuestions = useCallback(async () => {
    if (!businessId) return;

    try {
      const res = await API.get(`/business/${businessId}?t=${Date.now()}`);
      const business = res.data.business;

      const maxQuestions = 60 + (business.extraQuestionsAllowed || 0);
      const usedQuestions =
        (business.monthlyQuestionCount || 0) +
        (business.extraQuestionsUsed || 0);

      setRemainingQuestions(Math.max(maxQuestions - usedQuestions, 0));
    } catch {
      setRemainingQuestions(null);
    }
  }, [businessId]);

  useEffect(() => {
    refreshRemainingQuestions();
  }, [refreshRemainingQuestions]);

  const sendMessage = useCallback(
    async (promptText, conversationMessages) => {
      if (!businessId || !promptText.trim() || loading) return;

      if (remainingQuestions !== null && remainingQuestions <= 0) {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "❗ You have reached your monthly question limit."
          }
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
        const response = await API.post("/chat/business-advisor", payload, {
          signal: controller.signal
        });

        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: response.data.answer || "❌ No response from server."
          }
        ]);

        setRemainingQuestions(prev =>
          prev !== null ? Math.max(prev - 1, 0) : null
        );

        await refreshRemainingQuestions();
      } catch (error) {
        if (error.name === "AbortError") return;

        if (error.response?.status === 403) {
          setRemainingQuestions(0);
          setMessages(prev => [
            ...prev,
            {
              role: "assistant",
              content: error.response.data.error || "❗ Limit reached."
            }
          ]);
          return;
        }

        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "⚠️ Server error." }
        ]);
      } finally {
        setLoading(false);
      }
    },
    [businessId, businessDetails, conversationId, userId, messages, loading, remainingQuestions, refreshRemainingQuestions]
  );

  const handleSubmit = () => {
    if (!userInput.trim() || loading) return;

    const userMessage = { role: "user", content: userInput };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    sendMessage(userInput, newMessages);
    setUserInput("");
    setStartedChat(true);
  };

  const handlePresetQuestion = (question) => {
    if (loading) return;

    const userMessage = { role: "user", content: question };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    sendMessage(question, newMessages);
    setStartedChat(true);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="advisor-chat-container">
      <h2>Business Advisor 🤝</h2>
      <p>Select a preset question or start a conversation:</p>

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

      <div className="chat-box-wrapper">
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`bubble ${msg.role}`}>
              {msg.role === "assistant" ? (
                <Markdown>{msg.content}</Markdown>
              ) : (
                msg.content
              )}
            </div>
          ))}
          {loading && <div className="bubble assistant">⌛ Thinking...</div>}
          <div ref={bottomRef} style={{ height: 1 }} />
        </div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Write your question..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={loading || (remainingQuestions !== null && remainingQuestions <= 0)}
          dir="rtl"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !userInput.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default BusinessAdvisorTab;

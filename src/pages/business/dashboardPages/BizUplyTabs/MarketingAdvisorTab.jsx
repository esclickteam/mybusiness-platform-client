import React, { useState, useEffect, useRef, useCallback } from "react";
import Markdown from "markdown-to-jsx";
import API from "@api";
import "./AdvisorChat.css";

const MarketingAdvisorTab = ({
  businessId,
  conversationId,
  userId,
  businessDetails,
}) => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [startedChat, setStartedChat] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(null);

  // 👉 גלילה פנימית בלבד
  const chatContainerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const presetQuestions = [
    "How to get more leads for my business?",
    "How to build a monthly marketing plan?",
    "What’s the difference between paid and organic campaigns?",
    "How to improve conversion rates on my website?",
    "Which social network should I focus on?",
  ];

  /* =========================
     LOAD REMAINING QUESTIONS
  ========================= */
  const refreshRemainingQuestions = useCallback(async () => {
    if (!businessId) return;

    try {
      const res = await API.get(`/business/${businessId}?t=${Date.now()}`);
      const business = res.data.business;

      const maxQuestions = 60 + (business.extraQuestionsAllowed || 0);
      const used =
        (business.monthlyQuestionCount || 0) +
        (business.extraQuestionsUsed || 0);

      setRemainingQuestions(Math.max(maxQuestions - used, 0));
    } catch {
      setRemainingQuestions(null);
    }
  }, [businessId]);

  useEffect(() => {
    refreshRemainingQuestions();
  }, [refreshRemainingQuestions]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const sendMessage = useCallback(
    async (promptText, conversationMessages) => {
      if (!businessId || !promptText.trim() || loading) return;

      if (remainingQuestions !== null && remainingQuestions <= 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "❗ You’ve reached your monthly question limit.",
          },
        ]);
        return;
      }

      setLoading(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await API.post(
          "/chat/marketing-advisor",
          {
            businessId,
            prompt: promptText,
            businessDetails,
            profile: {
              conversationId: conversationId || null,
              userId: userId || null,
            },
            messages: conversationMessages,
          },
          { signal: controller.signal }
        );

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              response.data.answer || "❌ No response received from server.",
          },
        ]);

        setRemainingQuestions((prev) =>
          prev !== null ? Math.max(prev - 1, 0) : null
        );

        await refreshRemainingQuestions();
      } catch (err) {
        if (err.name === "AbortError") return;

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Server error." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [
      businessId,
      businessDetails,
      conversationId,
      userId,
      loading,
      remainingQuestions,
      refreshRemainingQuestions,
    ]
  );

  /* =========================
     HANDLERS
  ========================= */
  const handleSubmit = () => {
    if (!userInput.trim() || loading) return;

    const userMessage = { role: "user", content: userInput };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setStartedChat(true);
    sendMessage(userInput, newMessages);
    setUserInput("");
  };

  const handlePresetQuestion = (question) => {
    if (loading) return;

    const userMessage = { role: "user", content: question };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setStartedChat(true);
    sendMessage(question, newMessages);
  };

  /* =========================
     INTERNAL AUTO SCROLL ONLY
  ========================= */
  useEffect(() => {
    if (!startedChat) return;
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTop =
      chatContainerRef.current.scrollHeight;
  }, [messages, startedChat]);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="advisor-chat-container">
      <h2>Marketing Advisor </h2>
      <p>Select a preset question or start chatting:</p>

      {remainingQuestions !== null && (
        <p style={{ fontSize: 22, opacity: 0.7 }}>
          Monthly balance: {remainingQuestions} questions left
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
        <div className="chat-box" ref={chatContainerRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`bubble ${msg.role}`}>
              {msg.role === "assistant" ? (
                <Markdown>{msg.content}</Markdown>
              ) : (
                msg.content
              )}
            </div>
          ))}

          {loading && (
            <div className="bubble assistant">⌛ Thinking...</div>
          )}
        </div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your question..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={
            loading ||
            (remainingQuestions !== null && remainingQuestions <= 0)
          }
        />

        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            !userInput.trim() ||
            (remainingQuestions !== null && remainingQuestions <= 0)
          }
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MarketingAdvisorTab;

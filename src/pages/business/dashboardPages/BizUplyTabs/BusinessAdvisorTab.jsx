// --- CLEAN VERSION: CHAT ONLY (NO INSIGHTS) ---

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Markdown from "markdown-to-jsx";
import API from "@api";
import "./AdvisorChat.css";

const BusinessAdvisorTab = ({
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

  const chatContainerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const presetQuestions = [
  "How can I get more customers this month?",
  "How should I raise prices without losing customers?",
  "Where can I cut costs without hurting quality?",
  "What should I focus on this week to grow faster?",
];

  /* =========================
     REFRESH QUESTION BALANCE
  ========================= */
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

  /* =========================
     INITIAL AI GREETING
  ========================= */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi 👋 I’m your **AI Business Advisor**.\n\nYou can ask me about pricing, growth, operations, team management, or any business challenge you’re facing.",
        },
      ]);
    }
  }, []);

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
            content: "❗ You’ve reached your monthly AI question limit.",
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
          "/chat/business-advisor",
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
              response.data.answer || "❌ No response from server.",
          },
        ]);

        setRemainingQuestions((prev) =>
          prev !== null ? Math.max(prev - 1, 0) : null
        );

        await refreshRemainingQuestions();
      } catch (error) {
        if (error.name === "AbortError") return;

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ Server error. Please try again.",
          },
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
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop =
      chatContainerRef.current.scrollHeight;
  }, [messages]);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="advisor-chat-container">
      {/* ===== TOP (STATIC CONTENT) ===== */}
      <div className="advisor-top">
        <h2>AI Business Advisor</h2>

        <p className="subtitle">
          Get clear, practical advice for running and growing your business.
        </p>

        {remainingQuestions !== null && (
          <p className="question-balance">
            <span>You have </span>
            <strong>{remainingQuestions}</strong>
            <span> AI questions remaining this month.</span>
          </p>
        )}

        {!startedChat && (
          <>
            <div className="preset-questions-container">
              {presetQuestions.map((q, i) => (
                <div
                  key={i}
                  className="preset-card"
                  onClick={() => handlePresetQuestion(q)}
                >
                  {q}
                </div>
              ))}
            </div>
            <hr />
          </>
        )}
      </div>

      {/* ===== CHAT AREA (FLEX ZONE) ===== */}
      <div className="advisor-chat-area">
        <div className="chat-box-wrapper">
          <div
  className={`chat-box ${!startedChat ? "pre-chat" : ""}`}
  ref={chatContainerRef}
>

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
              <div className="bubble assistant typing">
                AI is analyzing your question…
              </div>
            )}
          </div>
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="e.g. Should I raise prices or cut expenses first?"
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
            disabled={loading || !userInput.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessAdvisorTab;

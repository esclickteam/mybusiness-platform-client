// --- CLEAN VERSION: UX IMPROVED, LOGIC UNCHANGED ---

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
     INITIAL AI GREETING (UX)
  ========================= */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi 👋 I’m your **AI Marketing Advisor**.\n\nAsk me about lead generation, campaigns, funnels, content, or marketing strategy.",
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
            content:
              "❗ You’ve reached your monthly AI question limit.",
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
              response.data.answer ||
              "❌ No response received from server.",
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
          { role: "assistant", content: "⚠️ Server error. Please try again." },
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
     AUTO SCROLL (INTERNAL)
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
      <h2>AI Marketing Advisor</h2>
      <p className="subtitle">
        Get clear, actionable advice to grow your audience and increase conversions.
      </p>

      {remainingQuestions !== null && (
        <p className="question-balance">
          You have <strong>{remainingQuestions}</strong> AI questions remaining this month.
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
            <div className="bubble assistant typing">
              AI is analyzing your marketing question…
            </div>
          )}
        </div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="e.g. How can I get more leads with a small budget?"
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

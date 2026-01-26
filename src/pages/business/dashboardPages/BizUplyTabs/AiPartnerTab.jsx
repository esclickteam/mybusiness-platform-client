import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./AiPartnerTab.css";
import { aiDemoResponses } from "@/demo/aiDemoResponses";

const DEMO_MODE = true; // ⛔️ false בפרודקשן



const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

function convertNaturalDateToISO(text) {
  const now = new Date();
  const lowerText = text.toLowerCase();

  if (lowerText.includes("tomorrow")) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return text.replace(/tomorrow/gi, `${yyyy}-${mm}-${dd}`);
  }

  return text;
}

const AiPartnerTab = ({
  businessId,
  token,
  conversationId = null,
  onNewRecommendation,
  businessName,
  businessType,
  languageTone,
  targetAudience,
  businessGoal,
}) => {
  const navigate = useNavigate();

  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [aiCommandHistory, setAiCommandHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [commandText, setCommandText] = useState("");
  const [commandResponse, setCommandResponse] = useState(null);
  const chatScrollRef = useRef(null);


  // Credits and purchase management
  const [remainingQuestions, setRemainingQuestions] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [purchaseError, setPurchaseError] = useState("");

  // Fixed AI packages (like in Business/Marketing Advisor)
  const aiPackages = [
    { id: "ai_200", label: "AI package with 200 questions", price: 1, type: "ai-package" },
    { id: "ai_500", label: "AI package with 500 questions", price: 1, type: "ai-package" },
  ];

  const notificationSound = useRef(null);

  const filterText = useCallback(
    (text) =>
      text
        .replace(/https:\/\/res\.cloudinary\.com\/[^\s]+/g, "")
        .replace(/\*+/g, "")
        .trim(),
    []
  );

  const filterValidUniqueRecommendations = useCallback((recs) => {
    const filtered = recs.filter(
      (r) => r._id && typeof r._id === "string" && r._id.length === 24
    );
    const map = new Map();
    filtered.forEach((r) => {
      if (!map.has(r._id)) map.set(r._id, r);
    });
    return Array.from(map.values());
  }, []);

  const refreshRemainingQuestions = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/business/my`, {
        headers: { Authorization: `Bearer ${token}` },
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
  }, [token]);

  useEffect(() => {
    refreshRemainingQuestions();
  }, [refreshRemainingQuestions]);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!businessId || !token) return;
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiBaseUrl}/chat/recommendations/${businessId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load recommendations");
        const recs = await res.json();
        const valid = filterValidUniqueRecommendations(recs);
        const formatted = valid.map((r) => ({
          id: r._id,
          text: r.text,
          status: r.status,
          conversationId: r.conversationId || null,
          timestamp: r.createdAt || null,
          isEdited: r.isEdited || false,
          editedText: r.editedText || "",
        }));
        setSuggestions(formatted);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    }
    if (!showHistory) fetchRecommendations();
  }, [businessId, token, filterValidUniqueRecommendations, showHistory]);

  const fetchAiCommandHistory = useCallback(async () => {
    if (!businessId || !token) return;
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/ai-command-history/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch AI command history");
      const data = await res.json();
      setAiCommandHistory(data);
    } catch (err) {
      console.error("Error fetching AI command history:", err);
      setHistoryError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  }, [businessId, token]);

  useEffect(() => {
    if (showHistory) fetchAiCommandHistory();
  }, [showHistory, fetchAiCommandHistory]);

  useEffect(() => {
    if (!businessId || !token) return;

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const s = io(SOCKET_URL, {
      auth: { token, businessId },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      s.emit("joinRoom", businessId);
      if (conversationId) s.emit("joinConversation", conversationId);
    });

    s.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    s.on("newAiSuggestion", (suggestion) => {
      if (notificationSound.current) notificationSound.current.play();
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New AI Message", {
          body: suggestion.text || suggestion.recommendation,
          icon: "/logo192.png",
        });
      }
      setSuggestions((prev) => {
        if (prev.find((r) => r.id === (suggestion.id || suggestion.recommendationId))) return prev;
        if (typeof onNewRecommendation === "function") onNewRecommendation();
        return [
          ...prev,
          {
            id: suggestion.id || suggestion.recommendationId,
            text: suggestion.text || suggestion.recommendation,
            status: suggestion.status || "pending",
            conversationId: suggestion.conversationId,
            timestamp: suggestion.createdAt || new Date().toISOString(),
            isEdited: suggestion.isEdited || false,
            editedText: suggestion.editedText || "",
          },
        ];
      });
    });

    s.on("updateRecommendationStatus", ({ id, status }) => {
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    });

    s.on("recommendationUpdated", (updated) => {
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === updated._id
            ? {
                ...s,
                text: updated.text,
                isEdited: updated.isEdited,
                editedText: updated.editedText,
                status: updated.status,
              }
            : s
        )
      );
    });

    s.on("newMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    s.on("messageApproved", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      if (s.connected) {
        if (conversationId) s.emit("leaveConversation", conversationId);
        s.disconnect();
      }
    };
  }, [businessId, token, conversationId, onNewRecommendation]);

  const sendAiCommand = useCallback(async () => {
  if (!commandText.trim()) return;

  /* =========================
     🎬 DEMO MODE
  ========================= */
  if (DEMO_MODE) {
    setLoading(true);

    // שלב ביניים – נראה "חושב"
    setCommandResponse("🤖 Analyzing client data...");

    setTimeout(() => {
      setCommandResponse(aiDemoResponses.personal);
      setLoading(false);
      setCommandText("");
    }, 900);

    return;
  }

  /* =========================
     🚀 PRODUCTION MODE
  ========================= */
  if (remainingQuestions !== null && remainingQuestions <= 0) return;

  const convertedCommandText = convertNaturalDateToISO(commandText);

  setLoading(true);
  setCommandResponse(null);

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/chat/ai-partner`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessId,
          prompt: convertedCommandText,
          profile: {
            name: businessName,
            type: businessType,
            tone: languageTone,
            audience: targetAudience,
            goal: businessGoal,
            conversationId,
          },
          messages: chat,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to send command");

    setCommandResponse(data.answer);

    setRemainingQuestions((prev) =>
      prev !== null ? Math.max(prev - 1, 0) : null
    );
  } catch (err) {
    alert("Error sending AI command: " + err.message);
  } finally {
    setLoading(false);
    setCommandText("");
  }
}, [
  commandText,
  businessId,
  token,
  businessName,
  businessType,
  languageTone,
  targetAudience,
  businessGoal,
  conversationId,
  chat,
  remainingQuestions,
]);



  const approveSuggestion = useCallback(
    async ({ id, text }) => {
      setLoading(true);
      try {
        const filteredText = filterText(text);

        const url = `${import.meta.env.VITE_API_URL}/chat/send-approved`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ businessId, recommendationId: id, text: filteredText }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to approve");

        setSuggestions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "sent", text: filteredText } : s))
        );
        alert("Recommendation approved and sent to the client!");
        setActiveSuggestion(null);
      } catch (err) {
        console.error("Error approving suggestion:", err);
        alert("Error approving recommendation: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [businessId, token, filterText]
  );

  const rejectSuggestion = useCallback((id) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setActiveSuggestion(null);
  }, []);

  const editRecommendation = useCallback(
    async ({ id, newText }) => {
      setLoading(true);
      try {
        const url = `${import.meta.env.VITE_API_URL}/chat/edit-recommendation`;
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recommendationId: id, newText }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update recommendation");

        setSuggestions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, text: newText, isEdited: true, editedText: newText, status: "sent" } : s
          )
        );
        alert("Recommendation updated and sent successfully!");
        setActiveSuggestion(null);
        setEditing(false);
      } catch (err) {
        console.error("Error updating recommendation:", err);
        alert("Error updating recommendation: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

 useEffect(() => {
  if (!chatScrollRef.current) return;

  chatScrollRef.current.scrollTop =
    chatScrollRef.current.scrollHeight;
}, [chat, suggestions, commandResponse]);

  useEffect(() => {
    if (activeSuggestion) {
      setEditedText(activeSuggestion.text);
      setEditing(false);
    }
  }, [activeSuggestion]);

  const handlePurchaseExtra = async () => {
    if (purchaseLoading || !selectedPackage) return;

    setPurchaseLoading(true);
    setPurchaseMessage("");
    setPurchaseError("");

    try {
      const url = selectedPackage.type === "ai-package" ? "/cardcomAI/ai-package" : "/purchase-package";

      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

      setPurchaseMessage(`Successfully purchased ${selectedPackage.label} for ${selectedPackage.price}$.`);
      setSelectedPackage(null);

      await refreshRemainingQuestions();
    } catch (e) {
      setPurchaseError(e.message || "Error purchasing package");
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
  <div
    className="ai-partner-container"
    ref={chatScrollRef}
  >
    <h2> AI Business Partner</h2>

      <div style={{ margin: "1rem 0" }}>
        <button className="toggle-suggestions-btn" onClick={() => setShowHistory((prev) => !prev)}>
          View Command History
        </button>
      </div>

      {showHistory ? (
        <div
          className="ai-command-history"
          style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ccc", padding: "1rem" }}
        >
          {loadingHistory && <p>Loading history...</p>}
          {historyError && <p style={{ color: "red" }}>Error loading history: {historyError}</p>}
          {!loadingHistory && !historyError && aiCommandHistory.length === 0 && <p>No previous AI commands.</p>}
          {!loadingHistory && !historyError && aiCommandHistory.length > 0 && (
            <ul>
              {aiCommandHistory.map((cmd) => (
                <li
                  key={cmd._id}
                  style={{
                    marginBottom: "1rem",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "0.5rem",
                    direction: "ltr",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {new Date(cmd.createdAt).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                  <div>
                    <strong>Command:</strong>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        backgroundColor: "#f0f0f0",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        overflowX: "auto",
                      }}
                    >
                      {cmd.commandText}
                    </pre>
                  </div>
                  <div>
                    <strong>AI Response:</strong>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        backgroundColor: "#e6f7ff",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        overflowX: "auto",
                      }}
                    >
                      {cmd.responseText}
                    </pre>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <div className="center-textareas">
            <textarea
              className="uniform-textarea"
              rows={3}
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              placeholder="Tell your AI partner what you need — or pick a suggestion below"
              disabled={loading || (remainingQuestions !== null && remainingQuestions <= 0)}
            />
            <button
              onClick={sendAiCommand}
              disabled={loading || !commandText.trim() || (remainingQuestions !== null && remainingQuestions <= 0)}
            >
              Send to AI
            </button>
          </div>

          {remainingQuestions !== null && remainingQuestions <= 0 && (
            <div className="purchase-extra-container" style={{ marginTop: "1rem" }}>
              <p>You’ve reached the monthly question limit. You can purchase an additional AI package:</p>
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
                  {pkg.label} - {pkg.price}$
                </label>
              ))}
              <button onClick={handlePurchaseExtra} disabled={purchaseLoading || !selectedPackage}>
                {purchaseLoading ? "Processing..." : "Buy Package"}
              </button>

              {purchaseMessage && <p className="success">{purchaseMessage}</p>}
              {purchaseError && <p className="error">{purchaseError}</p>}
            </div>
          )}

          {commandResponse && (
            <div
              className="ai-response-box"
              style={{
                whiteSpace: "pre-wrap",
                marginTop: "1rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {commandResponse}
            </div>
          )}
        </>
      )}

      {activeSuggestion && (
        <div className="modal-overlay" onClick={() => setActiveSuggestion(null)}>
          <div className="modal-content approve-recommendation-box" onClick={(e) => e.stopPropagation()}>
            <h4>New AI Message</h4>

            {editing ? (
              <>
                <textarea
                  rows={6}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  disabled={loading}
                  className="uniform-textarea"
                />
                <div className="buttons-row">
                  <button
                    onClick={() => {
                      editRecommendation({
                        id: activeSuggestion.id,
                        newText: editedText,
                      });
                    }}
                    disabled={loading || !editedText.trim()}
                  >
                    Approve & Send
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setEditing(false);
                      setEditedText(activeSuggestion.text);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {filterText(activeSuggestion.text)
                  .split("\n")
                  .map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                {activeSuggestion.status === "pending" ? (
                  <div className="buttons-row">
                    <button
                      onClick={() => {
                        approveSuggestion({
                          id: activeSuggestion.id,
                          text: editedText.trim() || activeSuggestion.text,
                        });
                      }}
                      disabled={loading}
                    >
                      Approve & Send Immediately
                    </button>
                    <button disabled={loading} onClick={() => setEditing(true)}>
                      Edit
                    </button>
                    <button disabled={loading} onClick={() => rejectSuggestion(activeSuggestion.id)}>
                      Reject
                    </button>
                  </div>
                ) : (
                  <p>The recommendation has been approved and sent to the client.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <audio ref={notificationSound} src="/notification.mp3" preload="auto" />
  
    </div>
  );
};

export default AiPartnerTab;

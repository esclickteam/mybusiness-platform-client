import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SOCKET_URL = "https://api.esclick.co.il";

const AiContext = createContext();

export function AiProvider({ children }) {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState(() => {
    try {
      const stored = localStorage.getItem("aiSuggestions");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  // שמירת suggestions ב-localStorage בכל שינוי
  useEffect(() => {
    localStorage.setItem("aiSuggestions", JSON.stringify(suggestions));
  }, [suggestions]);

  // מאזין לאירוע storage כדי לסנכרן בין טאבים
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "aiSuggestions") {
        try {
          const newSuggestions = e.newValue ? JSON.parse(e.newValue) : [];
          setSuggestions(newSuggestions);

          if (activeSuggestion && !newSuggestions.find(s => s.id === activeSuggestion.id)) {
            setActiveSuggestion(null);
          }
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [activeSuggestion]);

  // חיבור וסנכרון socket
  useEffect(() => {
    if (!token || !user?.businessId) return;

    const s = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: {
        token,
        businessId: user.businessId,
      },
    });

    s.on("connect", () => {
      console.log("AI Socket connected:", s.id);
    });

    s.on("disconnect", (reason) => {
      console.log("AI Socket disconnected:", reason);
    });

    // קבלת המלצות AI חדשות - הוספה למערך בלי כפילויות
    s.on("newRecommendation", (suggestion) => {
      const newSuggestion = {
        id: suggestion.recommendationId,
        text: suggestion.recommendation,
        status: suggestion.status || "ממתין",
        conversationId: suggestion.conversationId,
        clientSocketId: suggestion.clientSocketId,
      };

      setSuggestions(prev => {
        if (prev.find(s => s.id === newSuggestion.id)) return prev;
        return [...prev, newSuggestion];
      });

      // !הסרתי את השורה שמעדכנת activeSuggestion כדי לא לפתוח את המודל אוטומטית
      // setActiveSuggestion(newSuggestion);
    });

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [token, user?.businessId]);

  const addSuggestion = (suggestion) => {
    setSuggestions((prev) => {
      if (prev.find(s => s.id === suggestion.id)) {
        return prev;
      }
      return [...prev, suggestion];
    });
    setActiveSuggestion(suggestion);
  };

  const approveSuggestion = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "https://api.esclick.co.il"}/chat/send-approved`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ businessId: user.businessId, recommendationId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve");

      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "sent" } : s))
      );
      setActiveSuggestion(null);

      if (data.conversationId) {
        navigate(`/business/chat/${data.conversationId}`);
      }
    } catch (err) {
      console.error("Approve suggestion error:", err);
      alert("שגיאה באישור ההמלצה: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const rejectSuggestion = (id) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setActiveSuggestion(null);
  };

  const closeModal = () => {
    setActiveSuggestion(null);
  };

  return (
    <AiContext.Provider
      value={{
        suggestions,
        addSuggestion,
        activeSuggestion,
        setActiveSuggestion, // אפשרי גם לחשוף לפעמים לשליטה חיצונית
        approveSuggestion,
        rejectSuggestion,
        closeModal,
        loading,
        socket,
      }}
    >
      {children}
      <AiModal />
    </AiContext.Provider>
  );
}

export function useAi() {
  return useContext(AiContext);
}

// רכיב modal להצגת ההמלצה
function AiModal() {
  const { activeSuggestion, approveSuggestion, rejectSuggestion, closeModal, loading } = useAi();

  if (!activeSuggestion) return null;

  return (
    <div
      onClick={closeModal}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
        justifyContent: "center", alignItems: "center", zIndex: 1000
      }}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          padding: 20,
          borderRadius: 8,
          maxWidth: 400,
          width: "90%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          textAlign: "right",
          direction: "rtl",
        }}
      >
        <h2>הודעת AI חדשה</h2>
        <p>{activeSuggestion.text}</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <button
            onClick={() => approveSuggestion(activeSuggestion.id)}
            disabled={loading}
            style={{ padding: "8px 16px" }}
          >
            אשר ושלח
          </button>
          <button
            onClick={() => rejectSuggestion(activeSuggestion.id)}
            disabled={loading}
            style={{ padding: "8px 16px" }}
          >
            דחה
          </button>
        </div>
      </div>
    </div>
  );
}

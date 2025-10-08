// src/context/AiContext.jsx — updated to reuse singleton socket
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "./socketContext";

const AiContext = createContext(null);

export function AiProvider({ children }) {
  /* ------------------------------------------------------------ */
  /*  Shared state & helpers                                      */
  /* ------------------------------------------------------------ */
  const { token, user } = useAuth();
  const socket = useSocket(); // ← לא יוצר חיבור חדש

  const [suggestions, setSuggestions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("aiSuggestions")) || [];
    } catch {
      return [];
    }
  });
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------------------ */
  /*  Persist + cross‑tab sync                                     */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    localStorage.setItem("aiSuggestions", JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== "aiSuggestions") return;
      try {
        const updated = e.newValue ? JSON.parse(e.newValue) : [];
        setSuggestions(updated);
        if (activeSuggestion && !updated.find((s) => s.id === activeSuggestion.id)) {
          setActiveSuggestion(null);
        }
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [activeSuggestion]);

  /* ------------------------------------------------------------ */
  /*  Socket listeners                                            */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    if (!socket) return;

    const handleNew = (suggestion) => {
      const newSug = {
        id: suggestion.recommendationId,
        text: suggestion.recommendation,
        status: suggestion.status || "ממתין",
        conversationId: suggestion.conversationId,
        clientSocketId: suggestion.clientSocketId,
      };
      setSuggestions((prev) => (prev.find((s) => s.id === newSug.id) ? prev : [...prev, newSug]));
    };

    socket.on("newRecommendation", handleNew);
    return () => socket.off("newRecommendation", handleNew);
  }, [socket]);

  /* ------------------------------------------------------------ */
  /*  Actions                                                     */
  /* ------------------------------------------------------------ */
  const approveSuggestion = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "https://api.esclick.co.il"}/chat/send-approved`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ businessId: user.businessId, recommendationId: id }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve");

      setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "sent" } : s)));
      setActiveSuggestion(null);
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

  const contextValue = {
    suggestions,
    activeSuggestion,
    setActiveSuggestion,
    approveSuggestion,
    rejectSuggestion,
    loading,
  };

  return (
    <AiContext.Provider value={contextValue}>
      {children}
      <AiModal />
    </AiContext.Provider>
  );
}

export const useAi = () => useContext(AiContext);

/* ------------------------------------------------------------ */
/*  Modal component                                             */
/* ------------------------------------------------------------ */
function AiModal() {
  const { activeSuggestion, approveSuggestion, rejectSuggestion, loading, setActiveSuggestion } = useAi();
  if (!activeSuggestion) return null;

  return (
    <div
      onClick={() => setActiveSuggestion(null)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        onClick={(e) => e.stopPropagation()}
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
          <button onClick={() => approveSuggestion(activeSuggestion.id)} disabled={loading}>
            אשר ושלח
          </button>
          <button onClick={() => rejectSuggestion(activeSuggestion.id)} disabled={loading}>
            דחה
          </button>
        </div>
      </div>
    </div>
  );
}

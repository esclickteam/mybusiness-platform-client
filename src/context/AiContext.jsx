import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = "https://api.esclick.co.il";

const AiContext = createContext();

export function AiProvider({ children }) {
  const { token, user } = useAuth();

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
          setActiveSuggestion(prev =>
            prev && !newSuggestions.find(s => s.id === prev.id) ? null : prev
          );
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // חיבור וסנכרון socket
  useEffect(() => {
    if (!token || !user?.businessId) return;

    const s = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token, businessId: user.businessId },
    });

    s.on("connect", () => {
      console.log("AI Socket connected:", s.id);
      // הצטרפות לחדר המלצות AI
      s.emit("joinRoom", user.businessId);
    });

    s.on("disconnect", reason => {
      console.log("AI Socket disconnected:", reason);
    });

    // קבלת המלצות AI חדשות
    s.on("newRecommendation", suggestion => {
      const newSuggestion = {
        id: suggestion.recommendationId,
        text: suggestion.recommendation,
        status: suggestion.status || "ממתין",
        conversationId: suggestion.conversationId,
        clientId: suggestion.clientId || null,  // ודא שהשרת שולח את זה
        businessId: user.businessId,
      };
      setSuggestions(prev =>
        prev.find(s => s.id === newSuggestion.id) ? prev : [...prev, newSuggestion]
      );
    });

    // מאזין לאישור המלצה בזמן אמת
    s.on("messageApproved", ({ recommendationId }) => {
      setSuggestions(prev =>
        prev.map(sug =>
          sug.id === recommendationId ? { ...sug, status: "sent" } : sug
        )
      );
      setActiveSuggestion(prev =>
        prev && prev.id === recommendationId ? null : prev
      );
    });

    setSocket(s);
    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [token, user?.businessId]);

  const addSuggestion = suggestion => {
    setSuggestions(prev =>
      prev.find(s => s.id === suggestion.id) ? prev : [...prev, suggestion]
    );
    setActiveSuggestion(suggestion);
  };

  // אישור המלצה דרך socket.emit (מועבר אובייקט עם כל הפרטים)
  const approveSuggestion = ({ id, conversationId, text, clientId, businessId }) => {
    if (!socket) return;
    setLoading(true);
    socket.emit("approveRecommendation", { recommendationId: id, conversationId, text, clientId, businessId }, ack => {
      setLoading(false);
      if (!ack.ok) {
        alert("שגיאה באישור ההמלצה: " + (ack.error || "Unknown error"));
      }
      // ה-state יתעדכן אוטומטית דרך listener
    });
  };

  const rejectSuggestion = id => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
    setActiveSuggestion(null);
  };

  const closeModal = () => setActiveSuggestion(null);

  return (
    <AiContext.Provider
      value={{
        suggestions,
        addSuggestion,
        activeSuggestion,
        setActiveSuggestion,
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
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 1000
      }}
      aria-modal="true" role="dialog" tabIndex={-1}
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
            onClick={() =>
              approveSuggestion({
                id: activeSuggestion.id,
                conversationId: activeSuggestion.conversationId,
                text: activeSuggestion.text,
                clientId: activeSuggestion.clientId,
                businessId: activeSuggestion.businessId,
              })
            }
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

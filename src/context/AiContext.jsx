import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext"; // נתיב מותאם

const SOCKET_URL = "https://api.esclick.co.il"; // או מה שהגדרת

const AiContext = createContext();

export function AiProvider({ children }) {
  const { token, user } = useAuth(); // משתמשים בקונטקסט האותנטיקציה לקבלת token ו-user
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

  useEffect(() => {
    if (!token || !user?.businessId) return;

    // יצירת חיבור socket עם auth
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

    // מאזין לאירוע newRecommendation מהשרת
    s.on("newRecommendation", (suggestion) => {
      const newSuggestion = {
        id: suggestion.recommendationId,
        text: suggestion.recommendation,
        status: suggestion.status || "ממתין",
        conversationId: suggestion.conversationId,
        clientSocketId: suggestion.clientSocketId,
      };
      setSuggestions((prev) => [...prev, newSuggestion]);
      setActiveSuggestion(newSuggestion);
    });

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [token, user?.businessId]);

  const addSuggestion = (suggestion) => {
    setSuggestions((prev) => [...prev, suggestion]);
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
    } catch (err) {
      console.error("Approve suggestion error:", err);
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
        approveSuggestion,
        rejectSuggestion,
        closeModal,
        loading,
        socket,
      }}
    >
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  return useContext(AiContext);
}

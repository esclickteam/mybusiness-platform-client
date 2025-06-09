import React, { createContext, useContext, useState } from "react";

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
  // מפת ספירות הודעות לא נקראות לפי שיחה: { [conversationId]: count }
  const [unreadCountsByConversation, setUnreadCountsByConversation] = useState({});

  // עדכון ספירה של שיחה אחת או הוספת שיחה חדשה עם ספירה
  const updateMessagesCount = (conversationId, count) => {
    setUnreadCountsByConversation((prev) => {
      // אם count זהה לערך הקודם, לא מעדכן את ה-state
      if (prev[conversationId] === count) return prev;
      return { ...prev, [conversationId]: count };
    });
  };

  // איפוס ספירת הודעות של שיחה מסוימת (מסיר אותה מהמפה)
  const resetMessagesCount = (conversationId) => {
    setUnreadCountsByConversation((prev) => {
      const updated = { ...prev };
      delete updated[conversationId];
      return updated;
    });
  };

  // הגדלת ספירת הודעות של שיחה מסוימת ב-1 (למשל בהודעה חדשה שלא נקראה)
  const incrementMessagesCount = (conversationId) => {
    setUnreadCountsByConversation((prev) => {
      const prevCount = prev[conversationId] || 0;
      return { ...prev, [conversationId]: prevCount + 1 };
    });
  };

  // סכום כל ההודעות הלא נקראות מכל השיחות (לנקודת התראה כללית)
  const totalUnreadCount = Object.values(unreadCountsByConversation).reduce((a, b) => a + b, 0);

  return (
    <UnreadMessagesContext.Provider
      value={{
        unreadCountsByConversation,
        updateMessagesCount,
        resetMessagesCount,
        incrementMessagesCount,
        totalUnreadCount,
      }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error("useUnreadMessages must be used within an UnreadMessagesProvider");
  }
  return context;
};

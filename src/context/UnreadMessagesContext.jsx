import React, { createContext, useContext, useState } from "react";

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
  // מפת ספירות הודעות לא נקראות לפי שיחה: { [conversationId]: count }
  const [unreadCountsByConversation, setUnreadCountsByConversation] = useState({});

  // עדכון ספירה של שיחה אחת או עדכון כללי עם אובייקט חדש
  const updateMessagesCount = (conversationId, count) => {
    setUnreadCountsByConversation((prev) => {
      // אם count זהה לערך הקודם, לא מעדכן
      if (prev[conversationId] === count) return prev;

      return { ...prev, [conversationId]: count };
    });
  };

  // איפוס ספירה של שיחה מסוימת
  const resetMessagesCount = (conversationId) => {
    setUnreadCountsByConversation((prev) => {
      const updated = { ...prev };
      delete updated[conversationId];
      return updated;
    });
  };

  // הגדלת ספירה של שיחה מסוימת באחד
  const incrementMessagesCount = (conversationId) => {
    setUnreadCountsByConversation((prev) => {
      const prevCount = prev[conversationId] || 0;
      return { ...prev, [conversationId]: prevCount + 1 };
    });
  };

  // סכום כל ההודעות הלא נקראות
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

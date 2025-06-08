import React, { createContext, useContext, useState } from "react";

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // עדכון ספירה – מקבל מספר או פונקציה שמקבלת את הערך הקודם
  const updateMessagesCount = (countOrUpdater) => {
    setUnreadCount((prev) =>
      typeof countOrUpdater === "function" ? countOrUpdater(prev) : countOrUpdater
    );
  };

  const resetMessagesCount = () => {
    setUnreadCount(0);
  };

  const incrementMessagesCount = () => {
    setUnreadCount((c) => c + 1);
  };

  return (
    <UnreadMessagesContext.Provider
      value={{
        unreadCount,
        updateMessagesCount,
        resetMessagesCount,
        incrementMessagesCount,
      }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error(
      "useUnreadMessages must be used within an UnreadMessagesProvider"
    );
  }
  return context;
};

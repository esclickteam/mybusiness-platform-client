import React, { createContext, useContext, useState } from "react";

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // עדכון ספירה – מקבל מספר או פונקציה שמקבלת את הערך הקודם
  const updateMessagesCount = (countOrUpdater) => {
  setUnreadCount((prev) => {
    const newCount =
      typeof countOrUpdater === "function" ? countOrUpdater(prev) : countOrUpdater;
    if (newCount === prev) {
      console.log("[UnreadMessagesContext] updateMessagesCount skipped, same value:", newCount);
      return prev; // לא מעדכן אם הערך זהה
    }
    console.log("[UnreadMessagesContext] updateMessagesCount:", prev, "->", newCount);
    return newCount;
  });
};

  const resetMessagesCount = () => {
    console.log("[UnreadMessagesContext] resetMessagesCount: 0");
    setUnreadCount(0);
  };

  const incrementMessagesCount = () => {
    setUnreadCount((c) => {
      console.log("[UnreadMessagesContext] incrementMessagesCount:", c, "->", c + 1);
      return c + 1;
    });
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

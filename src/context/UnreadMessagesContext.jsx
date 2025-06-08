import React, { createContext, useContext, useState } from "react";

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const updateMessagesCount = (count) => {
    setUnreadCount(count);
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

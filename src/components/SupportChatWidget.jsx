import React, { useCallback, useEffect, useState } from "react";
import ChatBot from "./ChatBot";

/**
 * Persistent site-wide customer support chat launcher.
 * Listens for `bizuply:openSupportChat` CustomEvent with optional { message }.
 */
export default function SupportChatWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState(null);

  const handleOpenEvent = useCallback((event) => {
    const message = event?.detail?.message || null;
    if (message) setInitialMessage(message);
    setChatOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener("bizuply:openSupportChat", handleOpenEvent);
    return () => {
      window.removeEventListener("bizuply:openSupportChat", handleOpenEvent);
    };
  }, [handleOpenEvent]);

  return (
    <ChatBot
      chatOpen={chatOpen}
      setChatOpen={setChatOpen}
      initialMessage={initialMessage}
      onInitialMessageSent={() => setInitialMessage(null)}
    />
  );
}

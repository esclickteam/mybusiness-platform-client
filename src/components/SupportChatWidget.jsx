import React, { Component, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bot } from "lucide-react";
import ChatBot from "./ChatBot";

function isBizuplyPublicBookingPath(pathname = "") {
  const parts = String(pathname || "")
    .split("/")
    .filter(Boolean);
  if (parts[0] === "book" && parts[1] === "bizuply" && parts[2]) return true;
  if (parts[0] === "bizuply" && parts[1] === "book" && parts[2]) return true;
  if (parts[0] === "book" && parts[1] && !/^[a-fA-F0-9]{24}$/.test(parts[1])) return true;
  return false;
}

/**
 * If ChatBot crashes while open, recover instead of swallowing the UI.
 * The floating launcher lives outside this boundary so it always stays available.
 */
class ChatBotBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[SupportChatWidget] ChatBot error:", error, info);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      // Close panel so the launcher button reappears immediately.
      this.props.onClose?.();
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

/**
 * Persistent site-wide customer support chat launcher.
 * Owns the floating button so a ChatBot crash cannot hide it.
 * Listens for `bizuply:openSupportChat` CustomEvent with optional { message }.
 */
export default function SupportChatWidget() {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState(null);
  const [panelKey, setPanelKey] = useState(0);

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

  const handleCloseAfterError = useCallback(() => {
    setChatOpen(false);
    // Remount ChatBot next open so a prior error does not stick.
    setPanelKey((k) => k + 1);
  }, []);

  if (isBizuplyPublicBookingPath(location.pathname)) {
    return null;
  }

  return (
    <>
      {!chatOpen && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-[10000] flex h-14 w-14 items-center justify-center rounded-full border border-violet-400/40 bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 text-white shadow-[0_14px_36px_rgba(109,40,217,0.45)] transition hover:scale-105 hover:from-violet-500 hover:via-violet-500 hover:to-indigo-500 hover:shadow-[0_18px_44px_rgba(109,40,217,0.55)]"
          aria-label="פתיחת העוזר החכם של Bizuply"
        >
          <Bot size={24} className="text-white" />
        </button>
      )}

      {chatOpen && (
        <ChatBotBoundary key={panelKey} onClose={handleCloseAfterError}>
          <ChatBot
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
            initialMessage={initialMessage}
            onInitialMessageSent={() => setInitialMessage(null)}
            hideLauncher
          />
        </ChatBotBoundary>
      )}
    </>
  );
}

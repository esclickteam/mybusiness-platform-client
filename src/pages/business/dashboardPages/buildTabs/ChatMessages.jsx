import React, { useEffect, useMemo, useRef } from "react";
import "./ChatMessages.css";
import VoiceBubble from "./VoiceBubble"; // Audio player

const ChatMessages = ({ messages = [], currentClientId }) => {
  const endRef = useRef(null);
  const containerRef = useRef(null);

  const safeCurrentId = useMemo(
    () => (currentClientId?.toString?.() || "").trim(),
    [currentClientId]
  );

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    // אם המשתמש כבר למטה – נגלול חלק, אחרת נשאיר אותו במקום (לא "חוטף" גלילה)
    const el = containerRef.current;
    if (!el) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;

    endRef.current?.scrollIntoView({
      behavior: nearBottom ? "smooth" : "auto",
      block: "end",
    });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="chat-box"
      dir="rtl"
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {messages.map((msg) => {
        const safeClientId = (msg.clientId?.toString?.() || "").trim();

        // Is the message from the current client (customer side)
        const isSelf = Boolean(safeClientId && safeCurrentId && safeClientId === safeCurrentId);

        const fromClass = isSelf
          ? "from-customer"
          : msg.from === "business"
          ? "from-business"
          : "from-system";

        const senderLabel =
          fromClass === "from-customer"
            ? "You (Customer)"
            : fromClass === "from-business"
            ? "Business"
            : "System";

        const hasImage =
          msg.file &&
          (msg.file.type?.startsWith("image") ||
            /\.(png|jpe?g|gif|webp)$/i.test(msg.file.url || ""));

        const hasVideo = msg.file && msg.file.type?.startsWith("video");
        const hasAudio = msg.file && msg.file.type?.startsWith("audio");
        const hasFile = Boolean(msg.file);

        return (
          <div key={msg.id || `${msg.timestamp}-${Math.random()}`} className={`chat-message-row ${fromClass}`}>
            <div className="chat-bubble">
              <span className="sender-label">{senderLabel}</span>

              {/* Text */}
              {msg.text && <p className="chat-text">{msg.text}</p>}

              {/* File - image, video, audio, or link */}
              {hasFile && (
                <>
                  {hasImage ? (
                    <img
                      className="chat-media chat-image"
                      src={msg.file.url}
                      alt={msg.file.name || "Image"}
                      loading="lazy"
                    />
                  ) : hasVideo ? (
                    <video className="chat-media chat-video" controls>
                      <source src={msg.file.url} type={msg.file.type} />
                    </video>
                  ) : hasAudio ? (
                    <div className="chat-audio">
                      <VoiceBubble url={msg.file.url} />
                    </div>
                  ) : (
                    <a className="chat-file" href={msg.file.url} download>
                      📎 {msg.file.name || "Download file"}
                    </a>
                  )}
                </>
              )}

              <span className="timestamp">
                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
              </span>
            </div>
          </div>
        );
      })}

      <div ref={endRef} />
    </div>
  );
};

export default ChatMessages;

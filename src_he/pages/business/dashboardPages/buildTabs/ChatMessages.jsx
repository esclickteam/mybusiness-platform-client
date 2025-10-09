import React, { useEffect, useRef } from 'react';
import './ChatMessages.css';
import VoiceBubble from './VoiceBubble'; // Audio player

const ChatMessages = ({ messages, currentClientId }) => {
  const endRef = useRef(null);

  // Automatic scrolling to the bottom when messages are updated
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-box" dir="rtl">
      {messages.map((msg) => {
        const safeClientId = msg.clientId?.toString().trim();
        const safeCurrentId = currentClientId?.toString().trim();

        // Is the message from the current client (user on their side)
        const isSelf = safeClientId && safeCurrentId && safeClientId === safeCurrentId;

        const fromClass = isSelf
          ? 'from-customer'
          : msg.from === 'business'
          ? 'from-business'
          : 'from-system';

        return (
          <div key={msg.id} className={`chat-message-row ${fromClass}`}>
            <div className="chat-bubble">
              <span className="sender-label">
                {fromClass === 'from-customer'
                  ? 'You (Customer)'
                  : fromClass === 'from-business'
                  ? 'Business'
                  : 'System'}
              </span>

              {/* Text */}
              {msg.text && <p>{msg.text}</p>}

              {/* File - image, video, audio, or link */}
              {msg.file && (
                msg.file.type?.startsWith('image') ||
                /\.(png|jpe?g|gif|webp)$/i.test(msg.file.url) ? (
                  <img src={msg.file.url} alt={msg.file.name} />
                ) : msg.file.type?.startsWith('video') ? (
                  <video controls>
                    <source src={msg.file.url} type={msg.file.type} />
                  </video>
                ) : msg.file.type?.startsWith('audio') ? (
                  <VoiceBubble url={msg.file.url} />
                ) : (
                  <a href={msg.file.url} download>{`📎 ${msg.file.name}`}</a>
                )
              )}

              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
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
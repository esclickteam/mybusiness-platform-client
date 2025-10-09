import React, { useEffect, useRef } from 'react';
import './ChatMessages.css';
import VoiceBubble from './VoiceBubble'; // נגן אודיו

const ChatMessages = ({ messages, currentClientId }) => {
  const endRef = useRef(null);

  // גלילה אוטומטית לתחתית כשל הודעות מתעדכנות
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-box" dir="rtl">
      {messages.map((msg) => {
        const safeClientId = msg.clientId?.toString().trim();
        const safeCurrentId = currentClientId?.toString().trim();

        // האם ההודעה מהלקוח הנוכחי (משתמש בצד שלו)
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
                  ? 'אתה (לקוח)'
                  : fromClass === 'from-business'
                  ? 'עסק'
                  : 'מערכת'}
              </span>

              {/* טקסט */}
              {msg.text && <p>{msg.text}</p>}

              {/* קובץ - תמונה, וידאו, אודיו, או קישור */}
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

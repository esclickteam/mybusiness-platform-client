import React from 'react';
import './ChatMessages.css';
import VoiceBubble from './VoiceBubble'; // ✅ הוספת קומפוננטת נגן

const ChatMessages = ({ messages, currentClientId }) => {
  return (
    <div className="chat-box" dir="rtl">
      {messages.map((msg) => {
        const safeClientId = msg.clientId?.toString().trim();
        const safeCurrentId = currentClientId?.toString().trim();

        const isSelf =
          safeClientId && safeCurrentId && safeClientId === safeCurrentId;

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

              {/* טקסט רגיל */}
              {msg.text && <p>{msg.text}</p>}

              {/* קובץ - תמונה / וידאו / אודיו / אחר */}
              {msg.file && (
                msg.file.type?.startsWith('image') ||
                /\.(png|jpe?g|gif|webp)$/i.test(msg.file.url) ? (
                  <img src={msg.file.url} alt={msg.file.name} />
                ) : msg.file.type?.startsWith('video') ? (
                  <video controls>
                    <source src={msg.file.url} type={msg.file.type} />
                  </video>
                ) : msg.file.type?.startsWith('audio') ? (
                  <VoiceBubble url={msg.file.url} /> // ✅ תצוגת נגן כמו וואטסאפ
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
    </div>
  );
};

export default ChatMessages;

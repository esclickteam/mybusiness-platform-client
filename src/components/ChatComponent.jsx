import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './ChatComponent.css'; // ייבוא ה-CSS

// התחברות לשרת Socket.io
const socket = io('https://api.esclick.co.il');  // עדכון לכתובת השרת שלך

const ChatComponent = () => {
  const [message, setMessage] = useState("");  // שדה ההודעה
  const [messages, setMessages] = useState([]); // רשימת ההודעות
  const [isLoading, setIsLoading] = useState(false);  // אינדיקטור של טעינה
  const [systemMessage, setSystemMessage] = useState(""); // הודעת מערכת

  // קבלת הודעות מהשרת
  useEffect(() => {
    socket.on('receiveMessage', (incoming) => {
      // אם Server שולח string, נהפוך אותו לאובייקט
      const msgObj = typeof incoming === 'string'
        ? { text: incoming, timestamp: new Date().toISOString(), from: 'business' }
        : incoming;
      setMessages((prevMessages) => [...prevMessages, msgObj]);
      setIsLoading(false);  // סיום טעינה
    });

    // ניתוק מהשרת כשהרכיב עוזב את הדף
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // פונקציה לשליחת הודעה לשרת
  const sendMessage = () => {
    if (message.trim()) {
      const newMsg = {
        text: message,
        timestamp: new Date().toISOString(),
        from: 'client',
      };
      setIsLoading(true);  // הצגת טעינה
      socket.emit('sendMessage', newMsg);  // שליחת הודעה לשרת
      setMessages((prev) => [...prev, newMsg]);  // הוספת ההודעה החדשה לממשק
      setMessage("");  // ניקוי שדה ההודעה
    }
  };

  // גלילה אוטומטית להודעות האחרונות
  useEffect(() => {
    const messageContainer = document.querySelector('.chat-messages');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>צ'אט עם העסק</h3>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && !isLoading && !systemMessage && (
          <div className="message system-message">
            ברוך הבא! איך אפשר לעזור לך היום?
          </div>
        )}
        {systemMessage && !isLoading && (
          <div className="message system-message">
            {systemMessage}
          </div>
        )}
        {messages.map((msg, index) => {
          const date = new Date(msg.timestamp);
          // פורמט שעה: דקות בלבד
          const formattedTime = !isNaN(date)
            ? date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
            : "שעה לא זמינה";

          return (
            <div key={index} className={`message ${msg.from === 'client' ? 'client' : 'business'}`}>
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{formattedTime}</div>
            </div>
          );
        })}
        {isLoading && (
          <div className="message system-message">
            <span className="loading-text">טוען...</span>
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="כתוב הודעה..."
        />
        <button onClick={sendMessage} disabled={isLoading}>שלח</button>
      </div>
    </div>
  );
};

export default ChatComponent;

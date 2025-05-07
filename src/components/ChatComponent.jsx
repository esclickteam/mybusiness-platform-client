import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './ChatComponent.css'; // ייבוא ה-CSS

// התחברות לשרת Socket.io
const socket = io('https://api.esclick.co.il');  // עדכון לכתובת השרת שלך

const ChatComponent = () => {
  const [message, setMessage] = useState("");  // שדה ההודעה
  const [messages, setMessages] = useState([]); // רשימת ההודעות הכללית
  const [clientMessages, setClientMessages] = useState([]); // רשימת ההודעות מלקוחות בלבד
  const [isLoading, setIsLoading] = useState(false);  // אינדיקטור של טעינה
  const [systemMessage, setSystemMessage] = useState(""); // הודעת מערכת
  const [isSending, setIsSending] = useState(false);  // משתנה למניעת שליחה כפולה

  // קבלת הודעות מהשרת
  useEffect(() => {
    socket.on('receiveMessage', (incoming) => {
      const msgObj = typeof incoming === 'string'
        ? { text: incoming, timestamp: new Date().toISOString(), from: 'business' }
        : incoming;

      // אם ההודעה מלקוח, נשמור אותה בנפרד בטאב של הודעות מלקוחות
      if (msgObj.from === 'client') {
        setClientMessages((prevMessages) => [...prevMessages, msgObj]);
      }

      // נוסיף את כל ההודעות גם לרשימה הכללית
      setMessages((prevMessages) => [...prevMessages, msgObj]);
      setIsLoading(false);  // סיום טעינה
    });

    // ניתוק מהשרת כשהרכיב עוזב את הדף
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // פונקציה לשליחת הודעה לשרת
  const sendMessage = (e) => {
    e.preventDefault(); // מונע שליחה כפולה
    if (isSending || !message.trim()) return; // אם יש שליחה בתהליך או שאין הודעה, לא שולחים

    setIsSending(true); // מציין שמתחילה שליחה
    const newMsg = {
      text: message,
      timestamp: new Date().toISOString(),
      from: 'client',
    };
    setIsLoading(true);  // הצגת טעינה
    socket.emit('sendMessage', newMsg);  // שליחת הודעה לשרת
    // עדכון ההודעות בצד הלקוח
    setMessages((prev) => [...prev, newMsg]);  
    setMessage("");  // ניקוי שדה ההודעה
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
        <button onClick={sendMessage} disabled={isLoading || isSending}>שלח</button>
      </div>

      {/* טאב הודעות מלקוחות */}
      <div className="client-messages-tab">
        <h3>הודעות מלקוחות</h3>
        {clientMessages.length === 0 && <div>אין הודעות מלקוחות כרגע.</div>}
        {clientMessages.map((msg, index) => {
          const date = new Date(msg.timestamp);
          const formattedTime = !isNaN(date)
            ? date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
            : "שעה לא זמינה";

          return (
            <div key={index} className="message client">
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{formattedTime}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatComponent;

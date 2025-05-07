import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './ChatComponent.css'; // ייבוא ה-CSS

const socket = io('https://api.esclick.co.il');  // התחברות לשרת

const ChatComponent = () => {
  const [message, setMessage] = useState("");  // שדה ההודעה
  const [messages, setMessages] = useState([]); // רשימת ההודעות הכללית (לקוחות + בעל העסק)
  const [isLoading, setIsLoading] = useState(false);  // אינדיקטור של טעינה
  const [isSending, setIsSending] = useState(false);  // משתנה למניעת שליחה כפולה

  // קבלת הודעות מהשרת
  useEffect(() => {
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setIsLoading(false);  // סיום טעינה
    });

    // ניתוק מהשרת כאשר הרכיב עוזב את הדף
    return () => {
      socket.off('newMessage');
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
      from: 'client', // ההודעה נשלחת על ידי הלקוח
      to: 'business'  // מייעדים את ההודעה לבעל העסק
    };

    setIsLoading(true);  // הצגת טעינה
    socket.emit('sendMessage', newMsg, () => {  // הוספת callback
      setIsLoading(false);  // אחרי שההודעה נשלחה, מסתיר את "טוען"
      setIsSending(false); // השבתת שליחה
    });
    
    setMessages((prev) => [...prev, newMsg]);  // עדכון ההודעות בצד הלקוח
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
    </div>
  );
};

export default ChatComponent;

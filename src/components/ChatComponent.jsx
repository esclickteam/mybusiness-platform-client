import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './ChatComponent.css'; // ייבוא ה-CSS

// התחברות לשרת Socket.io
const socket = io('https://api.esclick.co.il');  // עדכון לכתובת השרת שלך

const ChatComponent = () => {
  const [message, setMessage] = useState("");  // שדה ההודעה
  const [messages, setMessages] = useState([]); // רשימת ההודעות

  // קבלת הודעות מהשרת
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // ניתוק מהשרת כשהרכיב עוזב את הדף
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // פונקציה לשליחת הודעה לשרת
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', message);  // שליחת הודעה לשרת
      setMessage("");  // ניקוי שדה ההודעה
    }
  };

  // גלילה אוטומטית להודעות האחרונות
  useEffect(() => {
    const messageContainer = document.querySelector('.chat-messages');
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>צ'אט עם העסק</h3>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${index % 2 === 0 ? 'business' : 'client'}`}>
            {msg}
            <span className="message-time">{new Date().toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="כתוב הודעה..."
        />
        <button onClick={sendMessage}>שלח</button>
      </div>
    </div>
  );
};

export default ChatComponent;

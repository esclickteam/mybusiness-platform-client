import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './ChatComponent.css';

const socket = io('https://api.esclick.co.il', {
  autoConnect: false, // מניעת חיבור אוטומטי
});

const ChatComponent = ({ userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (userId) {
      socket.auth = { userId };
      socket.connect(); // התחברות ידנית לאחר קבלת מזהה המשתמש
      socket.on('newMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        setIsLoading(false);
      });
    }

    return () => {
      socket.off('newMessage');
      socket.disconnect(); // ניתוק בעת יציאת המשתמש
    };
  }, [userId]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("שליחה החלה");
    if (isSending || !message.trim()) {
      console.log("שליחה נמנעה כי ההודעה ריקה או שהיא כבר בשליחה");
      return;
    }
  
    setIsSending(true);  // מצב של שליחה
    setIsLoading(true);  // מצב של טעינה
    console.log("שליחה בעבודה");
  
    const newMsg = {
      text: message,
      timestamp: new Date().toISOString(),
      from: 'client',
      to: 'business',
    };
  
    console.log("הודעה נשלחה:", newMsg);
  
    // שליחה עם callback כדי לבדוק אם ההודעה נשלחה בהצלחה
    socket.emit('sendMessage', newMsg, (confirmation) => {
      console.log("תשובה מהשרת:", confirmation);
  
      setIsLoading(false);  // סיום טעינה
      setIsSending(false);  // סיום שליחה
  
      if (confirmation.success) {
        console.log("ההודעה נשלחה בהצלחה");
      } else {
        console.error("שגיאה בשליחת ההודעה");
        alert("שגיאה בשליחת ההודעה");
      }
    });
  
    setMessages((prev) => [...prev, newMsg]);
    setMessage('');  // מנקה את התיבה אחרי שליחה
  };
  
  
  

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
            : 'שעה לא זמינה';

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
        <button onClick={sendMessage} disabled={isLoading || isSending}>
          שלח
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;

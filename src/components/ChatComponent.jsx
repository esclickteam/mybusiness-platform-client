import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './ChatComponent.css';

// הגדרת Socket.IO
const socket = io('https://api.esclick.co.il', {
  autoConnect: false, // מניעת חיבור אוטומטי
});

const ChatComponent = ({ userId }) => {
  const [message, setMessage] = useState(''); // שדה הודעה חדשה
  const [messages, setMessages] = useState([]); // היסטוריית הודעות
  const [isLoading, setIsLoading] = useState(false); // מצב טעינה
  const [isSending, setIsSending] = useState(false); // מצב שליחת הודעה

  // התחברות והאזנה להודעות
  useEffect(() => {
    const token = localStorage.getItem('token'); // קבלת ה-token מה-localStorage

    if (userId && token) {
      // הוספת ה-token לאותנטיקציה של Socket.IO
      socket.auth = { userId, token };
      socket.connect(); // התחברות ידנית לאחר קבלת מזהה המשתמש

      // שמיעה להודעות חדשות
      socket.on('newMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setIsLoading(false); // סיום טעינה
      });
    }

    // ניתוק כאשר המשתמש יוצא
    return () => {
      socket.off('newMessage');
      socket.disconnect(); // ניתוק בעת יציאת המשתמש
    };
  }, [userId]);

  // שליחת הודעה
  const sendMessage = async (e) => {
    e.preventDefault();
    if (isSending || !message.trim()) {
      return; // אם ההודעה ריקה או היא כבר בשליחה, אל תשלח
    }

    setIsSending(true); // מצב של שליחה
    setIsLoading(true); // מצב של טעינה

    const newMsg = {
      text: message,
      timestamp: new Date().toISOString(),
      from: 'client',
      to: 'business',
    };

    console.log("שליחת הודעה:", newMsg);

    try {
      // שליחה עם async/await
      await socket.emit('sendMessage', newMsg, (confirmation) => {
        if (confirmation && confirmation.success) {
          console.log("ההודעה נשלחה בהצלחה");
        } else {
          console.error("שגיאה בשליחת ההודעה");
        }
      });

      // עדכון ההיסטוריה
      setMessages((prev) => [...prev, newMsg]);
      setMessage(''); // מנקה את תיבת ההודעה
    } catch (error) {
      console.error("שגיאה בהתחברות לשרת:", error);
      alert("שגיאה בשליחת ההודעה");
    } finally {
      setIsSending(false); // סיום שליחה
      setIsLoading(false); // סיום טעינה
    }
  };

  // גלילת ההודעות אוטומטית
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

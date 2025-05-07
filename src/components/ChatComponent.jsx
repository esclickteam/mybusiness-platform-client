import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './ChatComponent.css';

const socket = io('https://api.esclick.co.il', {
  autoConnect: false,  // מניעת חיבור אוטומטי
});

const ChatComponent = ({ userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (userId && token) {
      socket.auth = { userId, token };
      socket.connect();

      socket.on('newMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setIsLoading(false);
      });

      socket.on('connect_error', (error) => {
        console.error("שגיאה בחיבור לשרת:", error);
      });
    }

    return () => {
      socket.off('newMessage');
      socket.disconnect();
    };
  }, [userId, localStorage.getItem('token')]);  // חיבור מחדש כשיש שינוי ב־userId או token

  const sendMessage = async (e) => {
    e.preventDefault();
    if (isSending || !message.trim()) {
      alert("ההודעה ריקה, בבקשה כתוב משהו!");  // התראה למשתמש על הודעה ריקה
      return;
    }

    setIsSending(true);
    setIsLoading(true);

    const newMsg = {
      text: message,
      timestamp: new Date().toISOString(),
      from: 'client',
      to: 'business',
    };

    try {
      await socket.emit('sendMessage', newMsg, (confirmation) => {
        if (confirmation && confirmation.success) {
          console.log("ההודעה נשלחה בהצלחה");
        } else {
          console.error("שגיאה בשליחת ההודעה");
        }
      });

      setMessages((prev) => [...prev, newMsg]);
      setMessage('');
    } catch (error) {
      console.error("שגיאה בהתחברות לשרת:", error);
      alert("שגיאה בשליחת ההודעה");
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);  // גלילה אוטומטית כשיש שינוי בהודעות

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>צ'אט עם העסק</h3>
      </div>

      <div className="chat-messages" ref={messageContainerRef}>
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

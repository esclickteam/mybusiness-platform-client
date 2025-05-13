import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import API from "../api"; // ה-API שלך

const SOCKET_URL = process.env.REACT_APP_API_URL || "https://api.esclick.co.il";

export default function ChatWithBusiness({ businessId, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    const socketConnection = io(SOCKET_URL, {
      query: { userId },
      withCredentials: true,
    });
    setSocket(socketConnection);

    socketConnection.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socketConnection.disconnect();
  }, [userId]);

  useEffect(() => {
    // יוצר שיחה חדשה אם לא קיימת שיחה עם העסק
    const createConversation = async () => {
      const response = await API.post("/chat/create", {
        businessId,
        userId,
      });
      setConversationId(response.data.conversationId);
      setMessages(response.data.messages);
    };

    createConversation();
  }, [businessId, userId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const message = {
      text,
      senderId: userId,
      recipientId: businessId,
      conversationId,
    };

    // שליחת הודעה ל-API שלך
    await API.post("/chat/send", message);

    // שידור הודעה בזמן אמת
    socket.emit("sendMessage", message);

    setMessages((prevMessages) => [...prevMessages, message]);
    setText("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={sendMessage}>שלח</button>
    </div>
  );
}

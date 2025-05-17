import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import API from "../api"; 
import "./BusinessChatTab.css";

export default function BusinessChatTab({ businessId, user }) {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [input, setInput] = useState("");
  const socketRef = useRef();

  // fetch רשימת שיחות
  useEffect(() => {
    API.get("/chat/conversations", { params: { businessId } })
      .then(res => setConversations(res.data))
      .catch(console.error);

    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      query: { businessId, userId: user.id, role: "business" }
    });
    socketRef.current.on("chat:newMessage", msg => {
      setConversations(prev =>
        prev.map(conv =>
          conv.clientId === msg.userId
            ? { ...conv, messages: [...conv.messages, msg] }
            : conv
        )
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [businessId, user.id]);

  const sendMessage = () => {
    if (!input.trim() || !activeConv) return;
    const msg = {
      businessId,
      userId: activeConv.clientId,
      sender: "business",
      text: input.trim(),
      createdAt: new Date().toISOString()
    };
    socketRef.current.emit("chat:sendMessage", msg);
    setConversations(prev =>
      prev.map(conv =>
        conv.clientId === activeConv.clientId
          ? { ...conv, messages: [...conv.messages, msg] }
          : conv
      )
    );
    setInput("");
  };

  return (
    <div className="chat-container business">
      <div className="sidebar">
        {conversations.map(conv => (
          <div
            key={conv.clientId}
            className={`conv-item ${
              activeConv?.clientId === conv.clientId ? "active" : ""
            }`}
            onClick={() => setActiveConv(conv)}
          >
            {conv.clientName}
          </div>
        ))}
      </div>
      <div className="chat-area">
        {activeConv ? (
          <>
            <div className="message-list">
              {activeConv.messages.map((m, i) => (
                <div
                  key={i}
                  className={`message ${
                    m.sender === "business" ? "mine" : "theirs"
                  }`}
                >
                  <div className="text">{m.text}</div>
                  <div className="time">
                    {new Date(m.createdAt).toLocaleTimeString("he-IL", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="input-bar">
              <input
                type="text"
                placeholder="הקלד הודעה..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>שלח</button>
            </div>
          </>
        ) : (
          <div className="no-selection">בחר שיחה להתחלה</div>
        )}
      </div>
    </div>
  );
}

```javascript
import React, { useState, useEffect, useRef, useCallback } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { createSocket } from "../socket";

export default function CollabPartnersChat() {
  const { getValidAccessToken, logout, user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    API.get("/my/collab-partners")
      .then(res => setPartners(res.data.partners || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    async function setupSocket() {
      const sock = await createSocket(getValidAccessToken, logout, user?.businessId);
      if (!sock) return;

      sock.connect();
      socketRef.current = sock;
    }
    setupSocket();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [getValidAccessToken, logout, user?.businessId]);

  const startChat = useCallback(async (partnerId) => {
    if (!socketRef.current) return;
    try {
      const res = await API.post("/business-chat/start", { otherBusinessId: partnerId });
      const convId = res.data.conversationId;
      setConversationId(convId);
      setSelectedPartner(partnerId);

      socketRef.current.emit("joinConversation", convId);

      const historyRes = await API.get(`/business-chat/${convId}/messages`);
      setMessages(historyRes.data.messages || []);
    } catch (e) {
      console.error(e);
      alert("Error opening the chat, please try again");
    }
  }, []);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !conversationId) return;

    const handler = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages(prev => [...prev, msg]);
      }
    };
    sock.on("newMessage", handler);
    return () => {
      sock.off("newMessage", handler);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !conversationId) return;

    const fromBusinessId = user?.businessId || user?.business?._id || null;
    if (!fromBusinessId) {
      alert("Something went wrong, please log in again");
      return;
    }

    const msg = {
      conversationId,
      from: fromBusinessId,
      to: selectedPartner,
      text: input.trim(),
    };
    socketRef.current.emit("sendMessage", msg, (ack) => {
      if (typeof ack !== "object" || ack === null) {
        console.warn("Invalid sendMessage ack:", ack);
        return;
      }

      if (ack.ok) {
        setMessages(prev => [...prev, ack.message]);
        setInput("");
      } else {
        alert("Message sending failed: " + (ack.error || "Unknown error"));
      }
    });
  };

  return (
    <div>
      <h2>Collaboration Partners</h2>
      <ul>
        {partners.map(p => (
          <li key={p._id}>
            {p.businessName} <button onClick={() => startChat(p._id)}>Chat</button>
          </li>
        ))}
      </ul>

      {conversationId && (
        <div>
          <h3>
            Chat with {partners.find(p => p._id === selectedPartner)?.businessName || selectedPartner}
          </h3>
          <div
            style={{
              border: "1px solid #ccc",
              height: 300,
              overflowY: "auto",
              padding: 8,
              marginBottom: 8,
            }}
          >
            {messages.map((m, i) => (
              <div key={i}>
                <b>{m.from === (user?.businessId || user?.business?._id) ? "Me" : "Them"}:</b> {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ marginRight: 8 }}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage} disabled={!input.trim()}>
            Send
          </button>
        </div>
      )}
    </div>
  );
}
```
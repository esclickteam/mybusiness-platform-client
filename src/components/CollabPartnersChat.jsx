import React, { useState, useEffect, useRef, useCallback } from "react";
import API from "../api";
import { createSocket } from "../socket";

export default function CollabPartnersChat() {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  // Load collaborators
  useEffect(() => {
    API.get("/my/collab-partners")
      .then(res => setPartners(res.data.partners || []))
      .catch(console.error);
  }, []);

  // Initialize socket once
  useEffect(() => {
    const sock = createSocket();
    socketRef.current = sock;
    sock.connect();
    return () => {
      sock.disconnect();
    };
  }, []);

  // Start or fetch existing conversation
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
    }
  }, []);

  // Listen for new messages on active conversation
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

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !conversationId) return;
    const msg = {
      conversationId,
      from: localStorage.getItem("businessId"),
      to: selectedPartner,
      text: input.trim(),
    };
    socketRef.current.emit("sendMessage", msg, (ack) => {
      if (ack.ok) {
        setMessages(prev => [...prev, ack.message]);
        setInput("");
      }
    });
  };

  return (
    <div>
      <h2>שותפי שיתוף פעולה</h2>
      <ul>
        {partners.map(p => (
          <li key={p._id}>
            {p.businessName} <button onClick={() => startChat(p._id)}>צ'אט</button>
          </li>
        ))}
      </ul>

      {conversationId && (
        <div>
          <h3>
            צ'אט עם {partners.find(p => p._id === selectedPartner)?.businessName || selectedPartner}
          </h3>
          <div style={{ border: "1px solid #ccc", height: 300, overflowY: "auto", padding: 8, marginBottom: 8 }}>
            {messages.map((m, i) => (
              <div key={i}>
                <b>{m.from === localStorage.getItem("businessId") ? "אני" : "הם"}:</b> {m.text}
              </div>
            ))}
          </div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="הקלד הודעה..."
            style={{ marginRight: 8 }}
          />
          <button onClick={sendMessage}>שלח</button>
        </div>
      )}
    </div>
  );
}
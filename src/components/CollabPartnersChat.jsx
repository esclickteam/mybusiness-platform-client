// src/components/CollabPartnersChat.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { createSocket } from "../socket";


export default function CollabPartnersChat() {
  const { initialized, refreshToken } = useAuth();
  const myBusinessId = getBusinessId();

  const [partners, setPartners]             = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages]            = useState([]);
  const [input, setInput]                  = useState("");
  const socketRef = useRef(null);

  // 1. Load partners list
  useEffect(() => {
    API.get("/my/collab-partners")
      .then(res => setPartners(res.data.partners))
      .catch(console.error);
  }, []);

  // 2. Initialize socket once
  useEffect(() => {
    if (!initialized || !myBusinessId) return;
    let sock;
    (async () => {
      try {
        const token = await ensureValidToken();
        sock = createSocket();
        sock.auth = {
          token,
          role: "business",
          businessId: myBusinessId
        };
        sock.connect();
        socketRef.current = sock;
      } catch (e) {
        console.error("Socket init failed:", e);
      }
    })();
    return () => sock?.disconnect();
  }, [initialized, myBusinessId, refreshToken]);

  // 3. Start or fetch conversation & load history
  const startChat = useCallback(
    async partnerId => {
      if (!socketRef.current) return;
      try {
        // start or get existing
        const res = await API.post("/business-chat/start", { otherBusinessId: partnerId });
        const convId = res.data.conversationId;
        setConversationId(convId);
        setSelectedPartner(partnerId);

        // join room
        socketRef.current.emit("joinConversation", convId);

        // load history
        const hist = await API.get(`/business-chat/${convId}/messages`);
        setMessages(hist.data.messages || []);
      } catch (e) {
        console.error("startChat error:", e);
      }
    },
    []
  );

  // 4. Listen for new messages
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !conversationId) return;
    const handler = msg => {
      if (msg.conversationId === conversationId) {
        setMessages(prev => [...prev, msg]);
      }
    };
    sock.on("newMessage", handler);
    return () => sock.off("newMessage", handler);
  }, [conversationId]);

  // 5. Send a message
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !conversationId) return;
    const payload = {
      conversationId,
      from: myBusinessId,
      to: selectedPartner,
      text: input.trim(),
    };
    socketRef.current.emit("sendMessage", payload, ack => {
      if (ack.ok) {
        setMessages(prev => [...prev, ack.message]);
        setInput("");
      } else {
        console.error("sendMessage failed:", ack.error);
      }
    });
  };

  return (
    <div>
      <h2>שותפי שיתוף פעולה</h2>
      <ul>
        {partners.map(p => (
          <li key={p._id}>
            {p.businessName}{" "}
            <button onClick={() => startChat(p._id)}>צ'אט</button>
          </li>
        ))}
      </ul>

      {conversationId && (
        <div>
          <h3>
            צ'אט עם{" "}
            {partners.find(p => p._id === selectedPartner)?.businessName ||
              selectedPartner}
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
                <b>
                  {m.from === myBusinessId ? "אני" : "הם"}:
                </b>{" "}
                {m.text}
              </div>
            ))}
          </div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="הקלד הודעה..."
            style={{ width: "80%", marginRight: 8 }}
          />
          <button onClick={sendMessage} disabled={!input.trim()}>
            שלח
          </button>
        </div>
      )}
    </div>
  );
}

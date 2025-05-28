import React, { useState, useEffect } from "react";
import API from "../api"; // axios instance
import socket from "../socket"; // socket.io client instance

export default function CollabPartnersChat() {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await API.get("/my/collab-partners"); // נניח שיש API כזה שמחזיר שותפים
        setPartners(res.data.partners);
      } catch (e) {
        console.error(e);
      }
    }
    fetchPartners();
  }, []);

  // התחלת שיחה או קבלת שיחה קיימת
  const startChat = async (partnerId) => {
    try {
      const res = await API.post("/business-chat/start", { otherBusinessId: partnerId });
      setConversationId(res.data.conversationId);
      setSelectedPartner(partnerId);
      socket.emit("joinConversation", res.data.conversationId);
      
      // טען היסטוריית הודעות
      const historyRes = await API.get(`/business-chat/${res.data.conversationId}/messages`);
      setMessages(historyRes.data.messages);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      conversationId,
      from: localStorage.getItem("businessId"),
      to: selectedPartner,
      text: input,
    };
    socket.emit("sendMessage", msg, null, (ack) => {
      if (ack.ok) {
        setMessages((prev) => [...prev, ack.message]);
        setInput("");
      }
    });
  };

  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [conversationId]);

  return (
    <div>
      <h2>שותפי שיתוף פעולה</h2>
      <ul>
        {partners.map((p) => (
          <li key={p._id}>
            {p.businessName}{" "}
            <button onClick={() => startChat(p._id)}>צ'אט</button>
          </li>
        ))}
      </ul>

      {conversationId && (
        <div>
          <h3>צ'אט עם {partners.find(p => p._id === selectedPartner)?.businessName}</h3>
          <div style={{ border: "1px solid #ccc", height: 300, overflowY: "scroll" }}>
            {messages.map((m, i) => (
              <div key={i}>
                <b>{m.from === localStorage.getItem("businessId") ? "אני" : "הם"}:</b> {m.text}
              </div>
            ))}
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="הקלד הודעה..."
          />
          <button onClick={sendMessage}>שלח</button>
        </div>
      )}
    </div>
  );
}

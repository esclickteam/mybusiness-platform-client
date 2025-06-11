import React, { useState, useEffect, useRef, useCallback } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { createSocket } from "../socket";
import CollabContractForm from "./CollabContractForm";

export default function CollabPartnersChat() {
  const { getValidAccessToken, logout, user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showContractForm, setShowContractForm] = useState(false);
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
      alert("שגיאה בפתיחת השיחה, נסה שוב");
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
    return () => sock.off("newMessage", handler);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !conversationId) return;
    const fromBusinessId = user?.businessId || user?.business?._id || null;
    if (!fromBusinessId) {
      alert("משהו השתבש, אנא התחבר מחדש");
      return;
    }
    const msg = {
      conversationId,
      from: fromBusinessId,
      to: selectedPartner,
      text: input.trim(),
    };
    socketRef.current.emit("sendMessage", msg, (ack) => {
      if (ack?.ok) {
        setMessages(prev => [...prev, ack.message]);
        setInput("");
      } else {
        alert("שליחת ההודעה נכשלה");
      }
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !conversationId || !socketRef.current) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await API.post(`/business-chat/${conversationId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const msg = {
        conversationId,
        from: user.businessId,
        to: selectedPartner,
        text: `📎 קובץ מצורף: ${file.name}`,
        fileUrl: res.data.url,
      };
      socketRef.current.emit("sendMessage", msg);
      setMessages(prev => [...prev, msg]);
    } catch {
      alert("שגיאה בשליחת הקובץ");
    }
  };

  const sendJointPackage = () => {
    const msg = {
      conversationId,
      from: user.businessId,
      to: selectedPartner,
      text: "💼 הצעת חבילה משותפת: פרסום הדדי + קופון קיץ + שיתוף תכנים",
      jointPackage: true,
    };
    socketRef.current.emit("sendMessage", msg);
    setMessages(prev => [...prev, msg]);
  };

  const handleContractSubmit = (contractData) => {
    const msg = {
      conversationId,
      from: user.businessId,
      to: selectedPartner,
      text: `📄 נשלח הסכם שיתוף פעולה: ${contractData.title}`,
      contractData,
    };
    socketRef.current.emit("sendMessage", msg);
    setMessages(prev => [...prev, msg]);
    setShowContractForm(false);
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
          <h3>צ'אט עם {partners.find(p => p._id === selectedPartner)?.businessName || selectedPartner}</h3>

          <div style={{ border: "1px solid #ccc", height: 300, overflowY: "auto", padding: 8, marginBottom: 8 }}>
            {messages.map((m, i) => (
              <div key={i}>
                <b>{m.from === (user?.businessId || user?.business?._id) ? "אני" : "הם"}:</b> {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="הקלד הודעה..."
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            style={{ marginRight: 8 }}
          />
          <input type="file" onChange={handleFileUpload} style={{ marginRight: 8 }} />
          <button onClick={sendMessage} disabled={!input.trim()}>שלח</button>
          <button onClick={() => setShowContractForm(true)}>📝 שלח הסכם</button>
          <button onClick={sendJointPackage}>💼 שלח חבילה</button>

          {showContractForm && (
            <CollabContractForm
              currentUser={user.business || user}
              partnerBusiness={partners.find(p => p._id === selectedPartner)}
              onSubmit={handleContractSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
}

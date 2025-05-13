import React, { useState, useEffect } from "react";
import API from "../api"; // ה-API שלך

export default function ClientMessagesDashboard({ businessId }) {
  const [conversations, setConversations] = useState([]);
  const [texts, setTexts] = useState({}); // ניהול טקסט לכל שיחה בנפרד

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await API.get(`/chat/conversations/${businessId}`);
        setConversations(response.data);
      } catch (error) {
        console.error('שגיאה בטעינת השיחות:', error);
      }
    };

    fetchConversations();
  }, [businessId]);

  const handleTextChange = (conversationId, value) => {
    setTexts((prevTexts) => ({
      ...prevTexts,
      [conversationId]: value,
    }));
  };

  const replyToMessage = async (conversationId) => {
    const text = texts[conversationId];
    if (!text.trim()) return;

    const message = {
      text,
      senderId: businessId,
      conversationId,
    };

    try {
      // שליחת הודעה ל-API
      await API.post("/chat/send", message);

      // עדכון השיחות אחרי שליחת ההודעה
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv._id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, { text, senderId: businessId }],
              }
            : conv
        )
      );
      setTexts((prevTexts) => ({ ...prevTexts, [conversationId]: "" })); // איפוס השדה טקסט אחרי שליחה
    } catch (error) {
      console.error('שגיאה בשליחת ההודעה:', error);
    }
  };

  return (
    <div>
      <h2>הודעות מלקוחות</h2>
      {conversations.map((conversation) => (
        <div key={conversation._id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
          <h3>שיחה עם {conversation.clientName}</h3>
          <div style={{ maxHeight: '200px', overflowY: 'scroll', marginBottom: '10px' }}>
            {conversation.messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  background: msg.senderId === businessId ? '#f0f8ff' : '#f5f5f5',
                  padding: '8px',
                  borderRadius: '5px',
                  margin: '5px 0',
                }}
              >
                <strong>{msg.senderId === businessId ? 'העסק' : 'לקוח'}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <textarea
            value={texts[conversation._id] || ''}
            onChange={(e) => handleTextChange(conversation._id, e.target.value)}
            placeholder="הקלד תשובה"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}
          />
          <button onClick={() => replyToMessage(conversation._id)} style={{ padding: '10px', borderRadius: '5px' }}>
            שלח תשובה
          </button>
        </div>
      ))}
    </div>
  );
}

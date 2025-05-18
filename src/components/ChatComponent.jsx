import React, { useState, useEffect } from "react";
import API from "../api";
import ClientChatTab from "./ClientChatTab";
import BusinessChatTab from "./BusinessChatTab";

export default function ChatComponent({
  userId,
  partnerId,
  initialConversationId,
  customerId: customerIdProp,
  isBusiness
}) {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(customerIdProp || null);

  // לאתחל שיחה (ללקוח)
  useEffect(() => {
    if (isBusiness) return;
    if (!partnerId || conversationId) return;

    const initConversation = async () => {
      try {
        const { data } = await API.post(
          "/messages/conversations",
          { otherId: partnerId },
          { withCredentials: true }
        );
        setConversationId(data.conversationId);
      } catch (err) {
        console.error("⚠️ failed to init conversation", err);
      }
    };
    initConversation();
  }, [partnerId, conversationId, isBusiness]);

  // בצד העסק – טען את רשימת השיחות ובחר אוטומטית שיחה ראשונה
  useEffect(() => {
    if (!isBusiness) return;
    if (!userId) return;

    const fetchConversations = async () => {
      setLoading(true);
      try {
        const res = await API.get("/messages/conversations", {
          withCredentials: true,
        });
        setConversations(res.data);
        // בחר שיחה ראשונה אם אין conversationId
        if (res.data.length > 0 && !conversationId) {
          setConversationId(res.data[0].conversationId);
          setCurrentCustomerId(res.data[0].customer?._id);
        }
      } catch (err) {
        console.error("שגיאה בטעינת שיחות", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    // אם conversationId משתנה — נעדכן את customerId הרלוונטי
  }, [isBusiness, userId, conversationId]);

  // כשמשתנה ה־conversationId בצד העסק – עדכן customerId אוטומטית
  useEffect(() => {
    if (!isBusiness) return;
    if (!conversationId) return;
    const conv = conversations.find(c => c.conversationId === conversationId);
    if (conv) setCurrentCustomerId(conv.customer?._id);
  }, [conversationId, isBusiness, conversations]);

  if (loading) return <p>⏳ טוען שיחות...</p>;
  if (!conversationId) return <p>⏳ טוען שיחה...</p>;
  if (!userId) return <p>⏳ טוען משתמש...</p>;

  if (isBusiness) {
    return (
      <BusinessChatTab
        conversationId={conversationId}
        businessId={userId}
        customerId={currentCustomerId}
        userId={userId}
      />
    );
  }

  return (
    <ClientChatTab
      conversationId={conversationId}
      businessId={partnerId}
      userId={userId}
    />
  );
}

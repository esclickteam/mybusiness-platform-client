import React, { useState, useEffect } from "react";
import API from "../api";
import ClientChatTab from "./ClientChatTab";
import BusinessChatTab from "./BusinessChatTab";

export default function ChatComponent({
  userId,
  partnerId,
  initialConversationId,
  isBusiness
}) {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  // לאתחל שיחה ספציפית אם partnerId ו־conversationId לא קיימים (עבור לקוח)
  useEffect(() => {
    if (isBusiness) return;  // לעסק לא נעשה init כאן
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

  // טען את רשימת השיחות עבור בעל העסק
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
        // אפשר לבחור אוטומטית שיחה ראשונה להצגה
        if (res.data.length > 0 && !conversationId) {
          setConversationId(res.data[0].conversationId);
        }
      } catch (err) {
        console.error("שגיאה בטעינת שיחות", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isBusiness, userId, conversationId]);

  if (loading) return <p>⏳ טוען שיחות...</p>;
  if (!conversationId) return <p>⏳ טוען שיחה...</p>;
  if (!userId) return <p>⏳ טוען משתמש...</p>;

  if (isBusiness) {
    return (
      <>
        {/* כאן אפשר להוסיף UI לבחירת שיחה מתוך conversations */}
        <BusinessChatTab
          conversationId={conversationId}
          businessId={userId}
          customerId={conversations.find(c => c.conversationId === conversationId)?.clientId}
          userId={userId}
        />
      </>
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

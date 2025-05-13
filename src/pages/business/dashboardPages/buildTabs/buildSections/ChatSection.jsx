import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import ChatComponent from "@components/ChatComponent";
import API from "@api";
import "./ChatSection.css";

export default function ChatSection({ renderTopBar }) {
  const { user, initialized } = useAuth();
  const [selected, setSelected] = useState({ conversationId: null, partnerId: null });
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch conversations list
  useEffect(() => {
    if (!initialized) return;
    setIsLoading(true);
    setError("");
    console.log("טעינת שיחות...");
    API.get("/chat/conversations", { withCredentials: true })
      .then(res => {
        console.log("שיחות שהתקבלו: ", res.data);
        setConversations(res.data);
      })
      .catch(err => {
        console.error("שגיאה בטעינת שיחות", err);
        setError("שגיאה בטעינת שיחות");
      })
      .finally(() => setIsLoading(false));
  }, [initialized]);

  if (!initialized) {
    return <div className="loading-screen">🔄 טוען שיחות…</div>;
  }

  // Determine partner in each conversation
  const getPartner = (conv) => {
    const isUserBusiness = user.id === conv.business._id;
    const partnerId = isUserBusiness ? conv.customer._id : conv.business._id;
    const partnerName = isUserBusiness
      ? conv.customer.name || "לקוח"
      : conv.business.businessName || "עסק";
    return { partnerId, partnerName };
  };

  return (
    <div className="chat-section">
      <aside className="chat-sidebar">
        <h3>שיחות נכנסות</h3>
        {isLoading && <div className="spinner">טעינה…</div>}
        {error && <div className="error-banner">{error}</div>}
        {!isLoading && !error && conversations.length === 0 && (
          <div className="no-conversations">אין שיחות להצגה</div>
        )}
        {!isLoading && !error && conversations.length > 0 && (
          <ul className="convo-list">
            {conversations.map(conv => {
              const { partnerId, partnerName } = getPartner(conv);
              return (
                <li
                  key={conv._id}
                  className={
                    `convo-item ${selected.conversationId === conv._id ? "selected" : ""}`
                  }
                  onClick={() => {
                    console.log("שיחה נבחרה: ", conv._id);
                    setSelected({ conversationId: conv._id, partnerId });
                  }}
                >
                  {partnerName}
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <main className="chat-main">
        {selected.conversationId ? (
          <ChatComponent
            userId={user.id}
            partnerId={selected.partnerId}
            initialConversationId={selected.conversationId}
            isBusiness={true}
          />
        ) : (
          <div className="chat-placeholder">
            בחרי שיחה מהרשימה כדי להתחיל
          </div>
        )}
      </main>

      <div className="preview-column">{renderTopBar?.()}</div>
    </div>
  );
}

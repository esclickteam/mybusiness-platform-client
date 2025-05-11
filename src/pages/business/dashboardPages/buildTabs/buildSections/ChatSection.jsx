import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import "./ChatSection.css";
import ConversationsList from "@components/ConversationsList";
import ChatComponent from "@components/ChatComponent";

export default function ChatSection({ renderTopBar }) {
  const { user, initialized } = useAuth();
  const [selected, setSelected] = useState({
    conversationId: null,
    partnerId: null,
  });

  const [loading, setLoading] = useState(true); // אפשר להוסיף סטייט לטעינה

  useEffect(() => {
    if (!initialized) return;
    setLoading(false); // אחרי סיום ההתחInitial שים את הסטייט ב- false
  }, [initialized]);

  if (!initialized || loading) return <div className="loading-screen">🔄 טוען שיחות…</div>;

  return (
    <div className="chat-section">
      {/* הסיידבר החדש */}
      <aside className="chat-sidebar">
        <h3>שיחות נכנסות</h3>
        <ConversationsList
          isBusiness={true}
          onSelect={({ conversationId, partnerId }) =>
            setSelected({ conversationId, partnerId })
          }
        />
      </aside>

      {/* חלון הצ'אט */}
      <main className="chat-main">
        {selected.conversationId ? (
          <ChatComponent
            conversationId={selected.conversationId}
            partnerId={selected.partnerId}
            isBusiness={true}
          />
        ) : (
          <div className="chat-placeholder">
            בחרי שיחה מהרשימה כדי להתחיל
          </div>
        )}
      </main>

      {/* תצוגת פריוויו עליון */}
      <div className="preview-column">{renderTopBar?.()}</div>
    </div>
  );
}

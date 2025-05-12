// 📁 src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import ConversationsList from "@components/ConversationsList";
import ChatComponent from "@components/ChatComponent";
import "./ChatSection.css";

export default function ChatSection({ renderTopBar }) {
  const { initialized } = useAuth();
  const [selected, setSelected] = useState({
    conversationId: null,
    partnerId: null,
  });

  if (!initialized) {
    return <div className="loading-screen">🔄 טוען שיחות…</div>;
  }

  return (
    <div className="chat-section">
      <aside className="chat-sidebar">
        <h3>שיחות נכנסות</h3>
        <ConversationsList
          isBusiness={true}
          onSelect={({ conversationId, partnerId }) =>
            setSelected({ conversationId, partnerId })
          }
        />
      </aside>

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

      <div className="preview-column">{renderTopBar?.()}</div>
    </div>
  );
}

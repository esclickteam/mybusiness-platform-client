// src/pages/business/dashboardPages/buildTabs/buildSections/ChatSection.jsx
import React, { useState } from "react";
import { useAuth }      from "../../../../../context/AuthContext";
import "./ChatSection.css";
import ConversationsList from "@components/ConversationsList";
import ChatComponent     from "@components/ChatComponent";

export default function ChatSection({ renderTopBar }) {
  const { user, initialized } = useAuth();
  const [selected, setSelected] = useState({
    conversationId: null,
    partnerId:      null
  });

  if (!initialized) return null;

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

import React, { useState } from 'react';
import ConversationsList from './ConversationsList';
import ChatComponent     from './ChatComponent';
import './ChatPage.css'; // אם יש לך עיצובים

/**
 * Props:
 *  - isBusiness: boolean
 *  - userId: string
 *  - clientProfilePic, businessProfilePic: string URLs
 */
export default function ChatPage({
  isBusiness,
  userId,
  clientProfilePic,
  businessProfilePic
}) {
  const [selected, setSelected] = useState(null);
  // selected = { conversationId, partnerId }

  return (
    <div className="chat-page" style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 300, borderRight: '1px solid #ddd' }}>
        <ConversationsList
          isBusiness={isBusiness}
          onSelect={setSelected}
        />
      </aside>

      <main style={{ flex: 1 }}>
        {selected ? (
          <ChatComponent
            userId={userId}
            partnerId={selected.partnerId}
            conversationId={selected.conversationId}
            clientProfilePic={clientProfilePic}
            businessProfilePic={businessProfilePic}
            isBusiness={isBusiness}
          />
        ) : (
          <div style={{ padding: 20 }}>בחר שיחה בסיידבר כדי להתחיל</div>
        )}
      </main>
    </div>
  );
}

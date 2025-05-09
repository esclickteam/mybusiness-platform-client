// src/components/Chat/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import ConversationsList from './ConversationsList';
import ChatComponent     from './ChatComponent';
import './ChatPage.css'; // אם יש לך עיצובים

/**
 * Props:
 *  - isBusiness: boolean
 *  - userId: string
 *  - clientProfilePic, businessProfilePic: string URLs
 *  - initialPartnerId: string (מזהה לשיחה חדשה, אם מגיע)
 */
export default function ChatPage({
  isBusiness,
  userId,
  clientProfilePic,
  businessProfilePic,
  initialPartnerId = null
}) {
  const [selected, setSelected] = useState(null);
  // selected = { conversationId, partnerId }

  // אם קיבלנו initialPartnerId, נבחר אותו אוטומטית ברגע שהקומפוננטה עולה
  useEffect(() => {
    if (initialPartnerId && !selected) {
      setSelected({
        conversationId: null,       // אין עדיין conversationId קיים
        partnerId: initialPartnerId
      });
    }
  }, [initialPartnerId, selected]);

  return (
    <div className="chat-page">
      <aside>
        <ConversationsList
          isBusiness={isBusiness}
          onSelect={setSelected}
        />
      </aside>

      <main>
        {selected && selected.partnerId ? (
          <ChatComponent
            userId={userId}
            partnerId={selected.partnerId}
            conversationId={selected.conversationId || selected.partnerId}
            clientProfilePic={clientProfilePic}
            businessProfilePic={businessProfilePic}
            isBusiness={isBusiness}
          />
        ) : (
          <div className="no-chat-placeholder">
            בחר שיחה בסיידבר כדי להתחיל
          </div>
        )}
      </main>
    </div>
  );
}

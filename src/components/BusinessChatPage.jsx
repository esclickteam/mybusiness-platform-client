import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import io from "socket.io-client";

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId;
  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef();

  // מזהים מובייל לפי רוחב חלון
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!initialized || !businessId) return;

    setLoading(true);

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    socketRef.current = io(socketUrl, {
      query: { userId: businessId, role: "business" },
    });

    socketRef.current.emit("getConversations", {}, (res) => {
      if (res.ok) {
        const data = Array.isArray(res.conversations) ? res.conversations : [];
        setConvos(data);

        // במובייל - בוחרים אוטומטית את השיחה הראשונה אם קיימת
        if (data.length && !selected) {
          const first = data[0];
          const convoId = first._id || first.conversationId;
          const partnerId = first.participants.find((p) => p !== businessId) || "";
          if (isMobile) {
            setSelected({ conversationId: convoId, partnerId });
          }
        }
      } else {
        console.error("Error loading conversations:", res.error);
      }
      setLoading(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [initialized, businessId, isMobile, selected]);

  const handleSelect = (conversationId, partnerId) => {
    setSelected({ conversationId, partnerId });
  };

  if (!initialized) {
    return <p className={styles.loading}>טוען מידע…</p>;
  }

  return (
    <div className={styles.whatsappBg}>
      <div
        className={styles.chatContainer}
        style={{ flexDirection: isMobile ? "column" : selected ? "column" : "row" }}
      >
        {/* בדסקטופ בלבד, ואם לא נבחרה שיחה, מציגים סיידבר */}
        {!isMobile && !selected && (
          <aside className={styles.sidebarInner}>
            {loading ? (
              <p className={styles.loading}>טוען שיחות…</p>
            ) : (
              <ConversationsList
                conversations={convos}
                businessId={businessId}
                selectedConversationId={selected?.conversationId}
                onSelect={handleSelect}
                isBusiness={true}
              />
            )}
          </aside>
        )}

        <section className={styles.chatArea} style={{ flex: 1 }}>
          {selected?.conversationId && selected.partnerId ? (
            <BusinessChatTab
              conversationId={selected.conversationId}
              businessId={businessId}
              customerId={selected.partnerId}
              socket={socketRef.current}
            />
          ) : (
            !loading &&
            !isMobile && (
              <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
            )
          )}
        </section>
      </div>
    </div>
  );
}

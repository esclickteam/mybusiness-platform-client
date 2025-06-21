import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import ConversationsListBase from "./ConversationsList";
import BusinessChatTabBase from "./BusinessChatTab";
import styles from "./BusinessChatPage.module.css";
import API from "../api";
import { useSocket } from "../context/socketContext";
import { useOnScreen } from "../hooks/useOnScreen";

// עטיפה עם React.memo למניעת רינדורים מיותרים
const ConversationsList = React.memo(ConversationsListBase);
const BusinessChatTab = React.memo(BusinessChatTabBase);

// debounce helper
function useDebouncedCallback(callback, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

export default function BusinessChatPage() {
  const { user, initialized } = useAuth();
  const businessId = user?.businessId || user?.business?._id;

  const { updateMessagesCount } = useOutletContext();

  const [convos, setConvos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const socket = useSocket();
  const prevSelectedRef = useRef(null);

  // Map של ספירת הודעות לא נקראו לכל שיחה
  const [unreadCountsByConversation, setUnreadCountsByConversation] = useState({});

  // Pagination state
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // חישוב הסכום הכולל של הודעות לא נקראות להצגה בתפריט
  const totalUnreadCount = useMemo(
    () => Object.values(unreadCountsByConversation).reduce((a, b) => a + b, 0),
    [unreadCountsByConversation]
  );

  // עדכון ספירת הודעות כללית ב-outlet context לצורך התראה בתפריט הצד
  useEffect(() => {
    if (updateMessagesCount) {
      updateMessagesCount(totalUnreadCount);
    }
  }, [totalUnreadCount, updateMessagesCount]);

  // טעינת רשימת השיחות
  useEffect(() => {
    if (!initialized || !businessId) return;

    setLoading(true);
    API.get("/conversations", { params: { businessId } })
      .then(({ data }) => {
        setConvos(data);

        const initialUnread = {};
        data.forEach((convo) => {
          const id = convo.conversationId || convo._id;
          const unread = convo.unreadCount || 0;
          if (unread > 0) initialUnread[id] = unread;
        });
        setUnreadCountsByConversation(initialUnread);

        if (data.length > 0) {
          const first = data[0];
          const convoId = first.conversationId || first._id;
          const partnerId = first.partnerId || first.participants.find((p) => p !== businessId);
          setSelected({ conversationId: convoId, partnerId });
          setHasMoreMessages(true); // Reset pagination when new convo selected
          setMessages([]);
        }
      })
      .catch(() => {
        setError("שגיאה בטעינת שיחות");
      })
      .finally(() => setLoading(false));
  }, [initialized, businessId]);

  // שימוש ב-useOnScreen עבור אזור התצוגה של ההודעות
  const messagesAreaRef = useRef();
  const messagesAreaOnScreen = useOnScreen(messagesAreaRef, "200px");

  // debounce על בחירת שיחה למניעת קריאות מהירות מדי
  const debouncedSetSelected = useDebouncedCallback(setSelected, 150);

  // פונקציה לטעינת הודעות עם pagination
  const loadMessages = useCallback(
    (conversationId, before = null, append = false) => {
      if (!socket || !socket.connected || !conversationId) return;

      setIsLoadingMore(true);

      const limit = 20; // מספר הודעות לטעינה בכל פעם

      socket.emit(
        "getHistory",
        { conversationId, limit, before },
        (res) => {
          if (res.ok) {
            const newMessages = res.messages || [];

            setMessages((prev) =>
              append ? [...newMessages, ...prev] : newMessages
            );

            setHasMoreMessages(newMessages.length === limit);
          } else {
            setError("שגיאה בטעינת ההודעות");
            console.error("Failed to load messages:", res.error);
          }
          setIsLoadingMore(false);
        }
      );
    },
    [socket]
  );

  // טעינת ההודעות הראשונית או כאשר משתנה selected או messagesAreaOnScreen
  useEffect(() => {
    if (!messagesAreaOnScreen) return;
    if (selected?.conversationId) {
      loadMessages(selected.conversationId, null, false);
    } else {
      setMessages([]);
    }
  }, [selected, socket, messagesAreaOnScreen, loadMessages]);

  // טיפול בגלילה לטעינת הודעות נוספות (הודעות ישנות יותר)
  useEffect(() => {
    if (!messagesAreaRef.current) return;
    const el = messagesAreaRef.current;

    const handleScroll = () => {
      if (
        el.scrollTop === 0 && // הגיע לראש הרשימה
        hasMoreMessages &&
        !isLoadingMore
      ) {
        // במקום לשלוח את ה־_id שולחים את הטיימסטמפ של ההודעה הכי ישנה
        const oldestMessageTimestamp = messages.length > 0 ? messages[0].timestamp : null;
        if (oldestMessageTimestamp) {
          loadMessages(selected.conversationId, oldestMessageTimestamp, true);
        }
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [messages, hasMoreMessages, isLoadingMore, loadMessages, selected]);

  // סימון השיחה כנקראה בשרת
  useEffect(() => {
    if (!socket || !socket.connected || !selected?.conversationId) return;

    if (!messagesAreaOnScreen) return; // מחכים עד שהאזור נראה

    socket.emit("markMessagesRead", selected.conversationId, (response) => {
      if (!response.ok) {
        console.error("Failed to mark messages as read:", response.error);
      } else {
        setUnreadCountsByConversation((prev) => {
          const updated = { ...prev };
          delete updated[selected.conversationId];
          return updated;
        });
      }
    });
  }, [selected, socket, messagesAreaOnScreen]);

  // עזיבת השיחה הקודמת אם שונה
  useEffect(() => {
    if (!socket) return;

    if (
      prevSelectedRef.current &&
      prevSelectedRef.current !== selected?.conversationId
    ) {
      socket.emit("leaveConversation", prevSelectedRef.current, (ack) => {
        if (!ack.ok) {
          console.error("Failed to leave previous conversation:", ack.error);
        }
      });
    }
    prevSelectedRef.current = selected?.conversationId;
  }, [selected, socket]);

  // הצטרפות לשיחה החדשה
  useEffect(() => {
    if (!socket) return;
    if (!selected?.conversationId) return;

    socket.emit("joinConversation", selected.conversationId, (ack) => {
      if (!ack.ok) {
        setError("לא ניתן להצטרף לשיחה");
        console.error("Failed to join conversation:", ack.error);
      }
    });
  }, [selected, socket]);

  // מאזין להודעות חדשות
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const convoId = message.conversationId || message.conversation_id;

      if (convoId && convoId !== selected?.conversationId) {
        setUnreadCountsByConversation((prev) => {
          const prevCount = prev[convoId] || 0;
          return { ...prev, [convoId]: prevCount + 1 };
        });
      } else if (convoId === selected?.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("newClientMessageNotification", handleNewMessage);

    // ניהול חיבור מחדש של socket (reconnect)
    const handleReconnect = () => {
      if (selected?.conversationId) {
        socket.emit("joinConversation", selected.conversationId, (ack) => {
          if (!ack.ok) {
            setError("לא ניתן להצטרף לשיחה לאחר חיבור מחדש");
            console.error("Failed to rejoin conversation:", ack.error);
          }
        });
      }
    };

    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("newClientMessageNotification", handleNewMessage);
      socket.off("reconnect", handleReconnect);
    };
  }, [socket, selected?.conversationId]);

  // debounce על בחירת שיחה למניעת קריאות מהירות מדי
  const handleSelect = useDebouncedCallback((conversationId, partnerId) => {
    setHasMoreMessages(true);
    setMessages([]);
    setSelected({ conversationId, partnerId });
  }, 150);

  if (!initialized) {
    return <p className={styles.loading}>טוען מידע…</p>;
  }

  return (
    <div className={styles.chatContainer}>
      <aside className={styles.sidebarInner}>
        {loading ? (
          <p className={styles.loading}>טוען שיחות…</p>
        ) : (
          <ConversationsList
            conversations={convos}
            businessId={businessId}
            selectedConversationId={selected?.conversationId}
            onSelect={handleSelect}
            unreadCountsByConversation={unreadCountsByConversation}
            isBusiness
          />
        )}
        {error && <p className={styles.error}>{error}</p>}
      </aside>

      <section ref={messagesAreaRef} className={styles.chatArea}>
        {selected ? (
          <BusinessChatTab
            conversationId={selected.conversationId}
            businessId={businessId}
            customerId={selected.partnerId}
            businessName={user?.businessName || user?.name}
            socket={socket}
            messages={messages}
            setMessages={setMessages}
            isLoadingMore={isLoadingMore}
            hasMoreMessages={hasMoreMessages}
            loadMoreMessages={() => {
              if (messages.length > 0 && hasMoreMessages && !isLoadingMore) {
                const oldestMessageTimestamp = messages[0].timestamp;
                if (oldestMessageTimestamp) {
                  loadMessages(selected.conversationId, oldestMessageTimestamp, true);
                }
              }
            }}
          />
        ) : (
          <div className={styles.emptyMessage}>בחר שיחה כדי לראות הודעות</div>
        )}
      </section>
    </div>
  );
}

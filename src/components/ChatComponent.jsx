// src/components/ChatComponent.jsx

export default function ChatComponent({
  userId,
  partnerId,
  initialConversationId,
  customerId: customerIdProp,
  isBusiness
}) {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(customerIdProp || null);

  // אתחול שיחה ללקוח
  useEffect(() => {
    if (isBusiness || !partnerId || conversationId) return;
    setLoadingInit(true);

    API.post("/messages/conversations", { otherId: partnerId }, { withCredentials: true })
      .then(res => setConversationId(res.data.conversationId))
      .catch(err => console.error("⚠️ failed to init conversation", err))
      .finally(() => setLoadingInit(false));
  }, [partnerId, conversationId, isBusiness]);

  // טעינת שיחות לעסק
  useEffect(() => {
    if (!isBusiness || !userId) return;
    setLoadingConvs(true);

    API.get("/messages/conversations", { withCredentials: true })
      .then(res => {
        setConversations(res.data);
        if (!conversationId && res.data.length > 0) {
          setConversationId(res.data[0].conversationId);
          // --- עדכון שליפת לקוח גם לפי מבנה participants ---
          const c = res.data[0];
          let custId = null;
          if (c.customer?._id) custId = c.customer._id;
          else if (c.participants && Array.isArray(c.participants)) {
            custId = c.participants.find(pid => pid !== userId);
          }
          setCurrentCustomerId(custId);
        }
      })
      .catch(err => console.error("שגיאה בטעינת שיחות", err))
      .finally(() => setLoadingConvs(false));
  }, [isBusiness, userId]);

  // סנכרון customerId עם conversationId
  useEffect(() => {
    if (!isBusiness || !conversationId) return;
    const conv = conversations.find(c => c.conversationId === conversationId);
    if (conv) {
      let custId = null;
      if (conv.customer?._id) custId = conv.customer._id;
      else if (conv.participants && Array.isArray(conv.participants)) {
        custId = conv.participants.find(pid => pid !== userId);
      }
      setCurrentCustomerId(custId);
    }
  }, [conversationId, isBusiness, conversations, userId]);

  // מצבי טעינה
  if (loadingInit) return <p>⏳ פותח שיחה…</p>;
  if (loadingConvs) return <p>⏳ טוען שיחות…</p>;
  if (!conversationId) return <p>⏳ אין שיחה זמינה</p>;
  if (!userId) return <p>⏳ טוען משתמש…</p>;

  // רינדור
  return isBusiness ? (
    <BusinessChatTab
      conversationId={conversationId}
      businessId={userId}
      customerId={currentCustomerId}
      userId={userId}
    />
  ) : (
    <ClientChatTab
      conversationId={conversationId}
      businessId={partnerId}
      userId={userId}
      partnerId={partnerId}
    />
  );
}

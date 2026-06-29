"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

type Nullable<T> = T | null;

type ChatMessage = {
  _id?: string;
  from?: string;
  to?: string;
  text?: string;
  content?: string;
  role?: string;
  createdAt?: string;
  [key: string]: unknown;
};

type Suggestion = {
  id: string;
  text: string;
  status: "pending" | "sent" | "rejected" | string;
  conversationId?: string | null;
  timestamp?: string | null;
  isEdited?: boolean;
  editedText?: string;
};

type RawRecommendation = {
  _id?: string;
  id?: string;
  recommendationId?: string;
  text?: string;
  recommendation?: string;
  status?: string;
  conversationId?: string | null;
  createdAt?: string;
  isEdited?: boolean;
  editedText?: string;
};

type AiCommandHistoryItem = {
  _id: string;
  commandText: string;
  responseText: string;
  createdAt: string;
};

type AiPackage = {
  id: string;
  label: string;
  price: number;
  type: "ai-package";
};

type SelectedPackage = Nullable<AiPackage>;

type AiPartnerTabProps = {
  businessId: string;
  token: string;
  conversationId?: string | null;
  onNewRecommendation?: () => void;
  businessName?: string;
  businessType?: string;
  languageTone?: string;
  targetAudience?: string;
  businessGoal?: string;
};

type BusinessResponse = {
  business?: {
    extraQuestionsAllowed?: number;
    monthlyQuestionCount?: number;
    extraQuestionsUsed?: number;
  };
};

type AiPartnerResponse = {
  answer?: string;
  actionResult?: unknown;
  error?: string;
};

type PaymentResponse = {
  paymentUrl?: string;
  error?: string;
};

function convertNaturalDateToISO(text: string) {
  const now = new Date();
  const lowerText = text.toLowerCase();

  if (lowerText.includes("tomorrow") || lowerText.includes("מחר")) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");

    return text.replace(/tomorrow|מחר/gi, `${yyyy}-${mm}-${dd}`);
  }

  return text;
}

const aiPackages: AiPackage[] = [
  {
    id: "ai_200",
    label: "חבילת AI עם 200 שאלות",
    price: 1,
    type: "ai-package",
  },
  {
    id: "ai_500",
    label: "חבילת AI עם 500 שאלות",
    price: 1,
    type: "ai-package",
  },
];

export default function AiPartnerTab({
  businessId,
  token,
  conversationId = null,
  onNewRecommendation,
  businessName,
  businessType,
  languageTone,
  targetAudience,
  businessGoal,
}: AiPartnerTabProps) {
  const navigate = useNavigate();

  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestion, setActiveSuggestion] =
    useState<Nullable<Suggestion>>(null);

  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState("");

  const [showHistory, setShowHistory] = useState(false);
  const [aiCommandHistory, setAiCommandHistory] = useState<
    AiCommandHistoryItem[]
  >([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [commandText, setCommandText] = useState("");
  const [commandResponse, setCommandResponse] = useState<string | null>(null);

  const [remainingQuestions, setRemainingQuestions] =
    useState<number | null>(null);

  const [selectedPackage, setSelectedPackage] =
    useState<SelectedPackage>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [purchaseError, setPurchaseError] = useState("");

  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  const isLimitReached =
    remainingQuestions !== null && remainingQuestions <= 0;

  const pendingSuggestions = useMemo(
    () => suggestions.filter((item) => item.status === "pending"),
    [suggestions]
  );

  const sentSuggestions = useMemo(
    () => suggestions.filter((item) => item.status !== "pending"),
    [suggestions]
  );

  const balanceText = useMemo(() => {
    if (remainingQuestions === null) return "טוען מאזן";
    if (remainingQuestions === 0) return "לא נשארו שאלות AI";
    if (remainingQuestions === 1) return "נשארה שאלת AI אחת";
    return `נשארו ${remainingQuestions} שאלות AI`;
  }, [remainingQuestions]);

  const filterText = useCallback((text: string) => {
    return text
      .replace(/https:\/\/res\.cloudinary\.com\/[^\s]+/g, "")
      .replace(/\*+/g, "")
      .trim();
  }, []);

  const filterValidUniqueRecommendations = useCallback(
    (recs: RawRecommendation[]) => {
      const filtered = recs.filter(
        (item) =>
          item._id && typeof item._id === "string" && item._id.length === 24
      );

      const map = new Map<string, RawRecommendation>();

      filtered.forEach((item) => {
        if (item._id && !map.has(item._id)) {
          map.set(item._id, item);
        }
      });

      return Array.from(map.values());
    },
    []
  );

  const refreshRemainingQuestions = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/business/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("טעינת נתוני העסק נכשלה");

      const data = (await res.json()) as BusinessResponse;
      const business = data.business;

      if (!business) {
        setRemainingQuestions(null);
        return;
      }

      const maxQuestions = 60 + (business.extraQuestionsAllowed || 0);
      const usedQuestions =
        (business.monthlyQuestionCount || 0) +
        (business.extraQuestionsUsed || 0);

      setRemainingQuestions(Math.max(maxQuestions - usedQuestions, 0));
    } catch (error) {
      console.error("שגיאה ברענון יתרת השאלות:", error);
      setRemainingQuestions(null);
    }
  }, [token]);

  useEffect(() => {
    void refreshRemainingQuestions();
  }, [refreshRemainingQuestions]);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!businessId || !token) return;

      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;

        const res = await fetch(
          `${apiBaseUrl}/chat/recommendations/${businessId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("טעינת ההמלצות נכשלה");

        const recs = (await res.json()) as RawRecommendation[];
        const valid = filterValidUniqueRecommendations(recs);

        const formatted: Suggestion[] = valid.map((item) => ({
          id: item._id || "",
          text: item.text || "",
          status: item.status || "pending",
          conversationId: item.conversationId || null,
          timestamp: item.createdAt || null,
          isEdited: item.isEdited || false,
          editedText: item.editedText || "",
        }));

        setSuggestions(formatted);
      } catch (error) {
        console.error("שגיאה בטעינת ההמלצות:", error);
      }
    }

    if (!showHistory) {
      void fetchRecommendations();
    }
  }, [businessId, token, filterValidUniqueRecommendations, showHistory]);

  const fetchAiCommandHistory = useCallback(async () => {
    if (!businessId || !token) return;

    setLoadingHistory(true);
    setHistoryError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/ai-command-history/${businessId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("טעינת היסטוריית פקודות ה-AI נכשלה");

      const data = (await res.json()) as AiCommandHistoryItem[];
      setAiCommandHistory(data);
    } catch (error) {
      const err = error as Error;
      console.error("שגיאה בטעינת היסטוריית פקודות ה-AI:", err);
      setHistoryError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  }, [businessId, token]);

  useEffect(() => {
    if (showHistory) {
      void fetchAiCommandHistory();
    }
  }, [showHistory, fetchAiCommandHistory]);

  useEffect(() => {
    if (!businessId || !token) return;

    if ("Notification" in window && Notification.permission !== "granted") {
      void Notification.requestPermission();
    }

    const socket: Socket = io(SOCKET_URL, {
      auth: {
        token,
        businessId,
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("joinRoom", businessId);

      if (conversationId) {
        socket.emit("joinConversation", conversationId);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("newAiSuggestion", (suggestion: RawRecommendation) => {
      void notificationSound.current?.play().catch(() => undefined);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("הודעת AI חדשה", {
          body: suggestion.text || suggestion.recommendation || "",
          icon: "/logo192.png",
        });
      }

      setSuggestions((prev) => {
        const incomingId = suggestion.id || suggestion.recommendationId;

        if (!incomingId) return prev;

        const exists = prev.find((item) => item.id === incomingId);
        if (exists) return prev;

        if (typeof onNewRecommendation === "function") {
          onNewRecommendation();
        }

        return [
          ...prev,
          {
            id: incomingId,
            text: suggestion.text || suggestion.recommendation || "",
            status: suggestion.status || "pending",
            conversationId: suggestion.conversationId || null,
            timestamp: suggestion.createdAt || new Date().toISOString(),
            isEdited: suggestion.isEdited || false,
            editedText: suggestion.editedText || "",
          },
        ];
      });
    });

    socket.on(
      "updateRecommendationStatus",
      ({ id, status }: { id: string; status: string }) => {
        setSuggestions((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      }
    );

    socket.on("recommendationUpdated", (updated: RawRecommendation) => {
      if (!updated._id) return;

      setSuggestions((prev) =>
        prev.map((item) =>
          item.id === updated._id
            ? {
                ...item,
                text: updated.text || item.text,
                isEdited: updated.isEdited || false,
                editedText: updated.editedText || "",
                status: updated.status || item.status,
              }
            : item
        )
      );
    });

    socket.on("newMessage", (msg: ChatMessage) => {
      setChat((prev) => [...prev, msg]);
    });

    socket.on("messageApproved", (msg: ChatMessage) => {
      setChat((prev) => [...prev, msg]);
    });

    socket.on("disconnect", () => {
      console.log("הסוקט נותק");
    });

    return () => {
      if (socket.connected) {
        if (conversationId) {
          socket.emit("leaveConversation", conversationId);
        }

        socket.disconnect();
      }
    };
  }, [businessId, token, conversationId, onNewRecommendation]);

  const sendAiCommand = useCallback(async () => {
    const cleanText = commandText.trim();

    if (!cleanText || isLimitReached) return;

    const convertedCommandText = convertNaturalDateToISO(cleanText);

    setLoading(true);
    setCommandResponse(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/ai-partner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessId,
            prompt: convertedCommandText,
            profile: {
              name: businessName,
              type: businessType,
              tone: languageTone,
              audience: targetAudience,
              goal: businessGoal,
              conversationId,
            },
            messages: chat,
          }),
        }
      );

      const data = (await res.json()) as AiPartnerResponse;

      if (!res.ok) {
        throw new Error(data.error || "שליחת הפקודה נכשלה");
      }

      setCommandResponse(data.answer || "לא התקבלה תשובה מה-AI.");

      if (data.actionResult) {
        console.log("Action result:", data.actionResult);
      }

      setRemainingQuestions((prev) =>
        prev !== null ? Math.max(prev - 1, 0) : null
      );

      await refreshRemainingQuestions();
    } catch (error) {
      const err = error as Error;
      alert(`שגיאה בשליחת פקודת AI: ${err.message}`);
    } finally {
      setLoading(false);
      setCommandText("");
    }
  }, [
    commandText,
    isLimitReached,
    token,
    businessId,
    businessName,
    businessType,
    languageTone,
    targetAudience,
    businessGoal,
    conversationId,
    chat,
    refreshRemainingQuestions,
  ]);

  const approveSuggestion = useCallback(
    async ({ id, text }: { id: string; text: string }) => {
      setLoading(true);

      try {
        const filteredText = filterText(text);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/chat/send-approved`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              businessId,
              recommendationId: id,
              text: filteredText,
            }),
          }
        );

        const data = (await res.json()) as { error?: string };

        if (!res.ok) {
          throw new Error(data.error || "אישור ההמלצה נכשל");
        }

        setSuggestions((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: "sent", text: filteredText }
              : item
          )
        );

        alert("ההמלצה אושרה ונשלחה ללקוח!");
        setActiveSuggestion(null);
      } catch (error) {
        const err = error as Error;
        console.error("שגיאה באישור ההמלצה:", err);
        alert(`שגיאה באישור ההמלצה: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [businessId, token, filterText]
  );

  const rejectSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((item) => item.id !== id));
    setActiveSuggestion(null);
  }, []);

  const editRecommendation = useCallback(
    async ({ id, newText }: { id: string; newText: string }) => {
      setLoading(true);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/chat/edit-recommendation`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              recommendationId: id,
              newText,
            }),
          }
        );

        const data = (await res.json()) as { error?: string };

        if (!res.ok) {
          throw new Error(data.error || "עדכון ההמלצה נכשל");
        }

        setSuggestions((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  text: newText,
                  isEdited: true,
                  editedText: newText,
                  status: "sent",
                }
              : item
          )
        );

        alert("ההמלצה עודכנה ונשלחה בהצלחה!");
        setActiveSuggestion(null);
        setEditing(false);
      } catch (error) {
        const err = error as Error;
        console.error("שגיאה בעדכון ההמלצה:", err);
        alert(`שגיאה בעדכון ההמלצה: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!chatScrollRef.current) return;

    chatScrollRef.current.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat, suggestions, commandResponse]);

  useEffect(() => {
    if (activeSuggestion) {
      setEditedText(activeSuggestion.text);
      setEditing(false);
    }
  }, [activeSuggestion]);

  const handlePurchaseExtra = useCallback(async () => {
    if (purchaseLoading || !selectedPackage) return;

    setPurchaseLoading(true);
    setPurchaseMessage("");
    setPurchaseError("");

    try {
      const url =
        selectedPackage.type === "ai-package"
          ? "/cardcomAI/ai-package"
          : "/purchase-package";

      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          businessId,
          packageType: selectedPackage.type,
          price: selectedPackage.price,
        }),
      });

      const data = (await res.json()) as PaymentResponse;

      if (!res.ok) {
        throw new Error(data.error || "שגיאה ברכישת החבילה");
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      setPurchaseMessage(
        `החבילה ${selectedPackage.label} נרכשה בהצלחה במחיר ${selectedPackage.price}$.`
      );

      setSelectedPackage(null);
      await refreshRemainingQuestions();
    } catch (error) {
      const err = error as Error;
      setPurchaseError(err.message || "שגיאה ברכישת החבילה");
    } finally {
      setPurchaseLoading(false);
    }
  }, [
    purchaseLoading,
    selectedPackage,
    token,
    businessId,
    refreshRemainingQuestions,
  ]);

  return (
    <section
      dir="rtl"
      className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 text-right !text-slate-950 shadow-[0_30px_100px_rgba(15,23,42,0.12)] sm:p-6 lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-300/35 blur-3xl" />
        <div className="absolute right-0 top-16 h-96 w-96 rounded-full bg-cyan-200/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>


      <div
        ref={chatScrollRef}
        className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl"
      >
        <header className="relative overflow-hidden border-b border-slate-200 bg-white px-5 py-6 sm:px-7 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30%)]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-black !text-violet-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.8)]" />
                שותף עסקי AI
              </div>

              <h2 className="max-w-2xl text-4xl font-black tracking-tight !text-slate-950 sm:text-5xl lg:text-6xl">
                מרכז הפיקוד של ה-AI שלך
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 !text-slate-600 sm:text-base">
                תן לשותף ה-AI שלך משימות עסקיות, בדוק המלצות
                חכמות, אשר הודעות ללקוחות ושמור כל פקודה
                מסודרת במקום עבודה אחד ומקצועי.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-black uppercase tracking-[0.2em] !text-slate-400">
                  מאזן
                </p>
                <p className="mt-2 text-4xl font-black !text-slate-950">
                  {remainingQuestions ?? "—"}
                </p>
                <p
                  className={`mt-1 text-xs font-black ${
                    isLimitReached ? "!text-rose-600" : "!text-emerald-600"
                  }`}
                >
                  {balanceText}
                </p>
              </div>

              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 shadow-[0_18px_50px_rgba(245,158,11,0.10)]">
                <p className="text-xs font-black uppercase tracking-[0.2em] !text-amber-700/70">
                  ממתין
                </p>
                <p className="mt-2 text-4xl font-black !text-slate-950">
                  {pendingSuggestions.length}
                </p>
                <p className="mt-1 text-xs font-black !text-amber-700">
                  המלצות
                </p>
              </div>

              <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4 shadow-[0_18px_50px_rgba(6,182,212,0.10)]">
                <p className="text-xs font-black uppercase tracking-[0.2em] !text-cyan-700/70">
                  נשלחו
                </p>
                <p className="mt-2 text-4xl font-black !text-slate-950">
                  {sentSuggestions.length}
                </p>
                <p className="mt-1 text-xs font-black !text-cyan-700">
                  הושלמו
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-violet-200 bg-violet-600 px-5 text-sm font-black !text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              {showHistory ? "חזרה לשותף AI" : "צפה בהיסטוריית פקודות"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black !text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              חזרה
            </button>
          </div>
        </header>

        <main className="bg-slate-50/70 px-5 py-6 sm:px-7 lg:px-8">
          {showHistory ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black !text-slate-950">
                    היסטוריית פקודות
                  </h3>
                  <p className="mt-1 text-sm !text-slate-500">
                    פקודות קודמות ותשובות AI.
                  </p>
                </div>
              </div>

              {loadingHistory && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-bold !text-slate-700">
                  טוען היסטוריה...
                </div>
              )}

              {historyError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold !text-rose-700">
                  שגיאה בטעינת ההיסטוריה: {historyError}
                </div>
              )}

              {!loadingHistory &&
                !historyError &&
                aiCommandHistory.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-bold !text-slate-500">
                    אין פקודות AI קודמות.
                  </div>
                )}

              {!loadingHistory &&
                !historyError &&
                aiCommandHistory.length > 0 && (
                  <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
                    {aiCommandHistory.map((cmd) => (
                      <article
                        key={cmd._id}
                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <p className="text-xs font-black uppercase tracking-[0.18em] !text-slate-400">
                          {new Date(cmd.createdAt).toLocaleString("en-US", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>

                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                            <p className="mb-2 text-sm font-black !text-violet-800">
                              פקודה
                            </p>
                            <pre className="whitespace-pre-wrap break-words text-sm leading-6 !text-slate-700">
                              {cmd.commandText}
                            </pre>
                          </div>

                          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                            <p className="mb-2 text-sm font-black !text-cyan-800">
                              תשובת AI
                            </p>
                            <pre className="whitespace-pre-wrap break-words text-sm leading-6 !text-slate-700">
                              {cmd.responseText}
                            </pre>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                  <label className="mb-3 block text-sm font-black !text-slate-950">
                    מה השותף AI שלך צריך לעשות?
                  </label>

                  <textarea
                    rows={5}
                    value={commandText}
                    onChange={(event) => setCommandText(event.target.value)}
                    placeholder="כתוב לשותף ה-AI מה צריך לעשות — לדוגמה: צור הודעת פולואפ ללקוחות שלא סגרו החודש."
                    disabled={loading || isLimitReached}
                    className="min-h-36 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold leading-7 !text-slate-900 outline-none transition placeholder:!text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-bold !text-slate-500">
                      טיפ: כדאי לכלול את המטרה, סוג הלקוח והפעולה הרצויה.
                    </p>

                    <button
                      type="button"
                      onClick={sendAiCommand}
                      disabled={
                        loading || !commandText.trim() || isLimitReached
                      }
                      className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-violet-600 px-6 text-sm font-black !text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:!text-slate-500 disabled:shadow-none disabled:hover:translate-y-0"
                    >
                      {loading ? "עובד..." : "שלח ל-AI"}
                    </button>
                  </div>
                </div>

                {isLimitReached && (
                  <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-5 shadow-sm">
                    <h3 className="text-lg font-black !text-rose-700">
                      הגעת למגבלה החודשית
                    </h3>
                    <p className="mt-2 text-sm leading-6 !text-rose-600">
                      הגעת למגבלת השאלות החודשית. אפשר
                      לרכוש חבילת AI נוספת.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {aiPackages.map((pkg) => (
                        <label
                          key={pkg.id}
                          className={`cursor-pointer rounded-2xl border p-4 transition ${
                            selectedPackage?.id === pkg.id
                              ? "border-violet-500 bg-violet-600 !text-white shadow-lg shadow-violet-200"
                              : "border-slate-200 bg-white !text-slate-700 hover:border-violet-200 hover:bg-violet-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="question-package"
                            value={pkg.id}
                            disabled={purchaseLoading}
                            checked={selectedPackage?.id === pkg.id}
                            onChange={() => setSelectedPackage(pkg)}
                            className="sr-only"
                          />

                          <p className="text-sm font-black">{pkg.label}</p>
                          <p className="mt-1 text-xs font-bold opacity-80">
                            ${pkg.price}
                          </p>
                        </label>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handlePurchaseExtra}
                      disabled={purchaseLoading || !selectedPackage}
                      className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-violet-600 px-6 text-sm font-black !text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:!text-slate-500 disabled:shadow-none sm:w-auto"
                    >
                      {purchaseLoading ? "מעבד..." : "רכישת חבילה"}
                    </button>

                    {purchaseMessage && (
                      <p className="mt-3 text-sm font-bold !text-emerald-600">
                        {purchaseMessage}
                      </p>
                    )}

                    {purchaseError && (
                      <p className="mt-3 text-sm font-bold !text-rose-600">
                        {purchaseError}
                      </p>
                    )}
                  </div>
                )}

                {commandResponse && (
                  <div className="rounded-[28px] border border-emerald-100 bg-white p-5 !text-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <h3 className="text-lg font-black !text-slate-950">
                        תשובת AI
                      </h3>
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-7 !text-slate-700">
                      {commandResponse}
                    </div>
                  </div>
                )}
              </div>

              <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black !text-slate-950">
                      המלצות AI
                    </h3>
                    <p className="mt-1 text-sm !text-slate-500">
                      בדוק, ערוך ואשר הודעות לפני שליחה.
                    </p>
                  </div>
                </div>

                {suggestions.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <p className="text-sm font-black !text-slate-800">
                      אין עדיין המלצות
                    </p>
                    <p className="mt-2 text-xs leading-5 !text-slate-500">
                      הצעות AI חדשות משיחות עם לקוחות יופיעו
                      כאן.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
                    {suggestions.map((suggestion) => {
                      const isPending = suggestion.status === "pending";

                      return (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => setActiveSuggestion(suggestion)}
                          className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black ${
                                isPending
                                  ? "bg-amber-100 !text-amber-700"
                                  : "bg-emerald-100 !text-emerald-700"
                              }`}
                            >
                              {isPending ? "ממתין" : "נשלח"}
                            </span>

                            {suggestion.timestamp && (
                              <span className="text-xs font-bold !text-slate-400">
                                {new Date(
                                  suggestion.timestamp
                                ).toLocaleDateString("en-US")}
                              </span>
                            )}
                          </div>

                          <p className="line-clamp-4 text-sm leading-6 !text-slate-700">
                            {filterText(suggestion.text)}
                          </p>

                          {suggestion.isEdited && (
                            <p className="mt-3 text-xs font-black !text-cyan-700">
                              המלצה נערכה
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </aside>
            </div>
          )}
        </main>
      </div>

      {activeSuggestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={() => setActiveSuggestion(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-5 text-right !text-slate-950 shadow-[0_30px_120px_rgba(15,23,42,0.28)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] !text-violet-600">
                  הודעת AI חדשה
                </p>
                <h4 className="mt-2 text-2xl font-black !text-slate-950">
                  בדיקת המלצה
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setActiveSuggestion(null)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xl font-black !text-slate-700 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            {editing ? (
              <>
                <textarea
                  rows={7}
                  value={editedText}
                  onChange={(event) => setEditedText(event.target.value)}
                  disabled={loading}
                  className="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold leading-7 !text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      void editRecommendation({
                        id: activeSuggestion.id,
                        newText: editedText,
                      });
                    }}
                    disabled={loading || !editedText.trim()}
                    className="min-h-12 rounded-2xl bg-emerald-500 px-5 text-sm font-black !text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    אשר ושלח
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setEditing(false);
                      setEditedText(activeSuggestion.text);
                    }}
                    className="min-h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black !text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ביטול
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 !text-slate-800">
                  {filterText(activeSuggestion.text)
                    .split("\n")
                    .map((line, index) => (
                      <p
                        key={`${line}-${index}`}
                        className="mb-3 text-sm leading-7 !text-slate-700"
                      >
                        {line}
                      </p>
                    ))}
                </div>

                {activeSuggestion.status === "pending" ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => {
                        void approveSuggestion({
                          id: activeSuggestion.id,
                          text:
                            editedText.trim() || activeSuggestion.text,
                        });
                      }}
                      disabled={loading}
                      className="min-h-12 rounded-2xl bg-emerald-500 px-5 text-sm font-black !text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      אשר ושלח
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setEditing(true)}
                      className="min-h-12 rounded-2xl bg-violet-600 px-5 text-sm font-black !text-white shadow-lg shadow-violet-100 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      עריכה
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => rejectSuggestion(activeSuggestion.id)}
                      className="min-h-12 rounded-2xl border border-rose-200 bg-rose-50 px-5 text-sm font-black !text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      דחה
                    </button>
                  </div>
                ) : (
                  <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold !text-emerald-700">
                    ההמלצה אושרה ונשלחה
                    ללקוח.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <audio ref={notificationSound} src="/notification.mp3" preload="auto" />
    </section>
  );
}
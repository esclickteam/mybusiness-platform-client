import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileSignature,
  Handshake,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Store,
  UserRound,
  X,
} from "lucide-react";

import API from "../api";
import ProposalForm from "./business/dashboardPages/collabtabs/ProposalForm";

type Business = {
  _id: string;
  businessName?: string;
  category?: string;
  description?: string;
  area?: string;
  city?: string;
  contact?: string;
  phone?: string;
  email?: string;
  logo?: string;
  complementaryCategories?: string[];
};

type BusinessProfilePageProps = {
  resetSearchFilters?: () => void;
};

export default function BusinessProfilePage({
  resetSearchFilters,
}: BusinessProfilePageProps) {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUserBusinessId, setCurrentUserBusinessId] =
    useState<string | null>(null);
  const [currentUserBusinessName, setCurrentUserBusinessName] = useState("");

  const [createdConversationId, setCreatedConversationId] =
    useState<string | null>(null);

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatSubject, setChatSubject] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchBusiness() {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get(`/business/${businessId}`);

        if (mounted) {
          setBusiness(res.data.business || null);
        }
      } catch (err) {
        console.error("Failed to load business details:", err);

        if (mounted) {
          setError("לא הצלחנו לטעון את פרטי העסק");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (businessId) {
      fetchBusiness();
    }

    return () => {
      mounted = false;
    };
  }, [businessId]);

  useEffect(() => {
    async function fetchMyBusiness() {
      try {
        const res = await API.get("/business/my");

        setCurrentUserBusinessId(res.data.business?._id || null);
        setCurrentUserBusinessName(res.data.business?.businessName || "");
      } catch (err) {
        console.error("Failed to load my business:", err);

        setCurrentUserBusinessId(null);
        setCurrentUserBusinessName("");
      }
    }

    fetchMyBusiness();
  }, []);

  const isLoggedIn = Boolean(currentUserBusinessId);

  const location = useLocation();

  useEffect(() => {
    const state = location.state as {
      openProposal?: boolean;
      openChat?: boolean;
    } | null;

    if (!business || !currentUserBusinessId) return;

    if (state?.openProposal && currentUserBusinessName) {
      setIsProposalModalOpen(true);
    }

    if (state?.openChat) {
      setChatModalOpen(true);
    }
  }, [
    location.state,
    business,
    currentUserBusinessId,
    currentUserBusinessName,
  ]);

  const isOwnerViewingOther =
    Boolean(currentUserBusinessId) &&
    Boolean(business?._id) &&
    currentUserBusinessId !== business?._id;

  const locationText = useMemo(() => {
    if (!business) return "";

    return business.area || business.city || "";
  }, [business]);

  const contactItems = useMemo(() => {
    if (!business) return [];

    return [
      {
        label: "איש קשר",
        value: business.contact,
        icon: UserRound,
      },
      {
        label: "טלפון",
        value: business.phone,
        icon: Phone,
      },
      {
        label: "אימייל",
        value: business.email,
        icon: Mail,
      },
    ].filter((item) => Boolean(item.value));
  }, [business]);

  const resetChatModal = () => {
    setChatModalOpen(false);
    setCreatedConversationId(null);
    setChatMessage("");
    setChatSubject("");
  };

  const openProposalModal = () => {
    if (!currentUserBusinessName) return;
    setIsProposalModalOpen(true);
  };

  const openChatModal = () => {
    setCreatedConversationId(null);
    setChatMessage("");
    setChatSubject("");
    setChatModalOpen(true);
  };

  const handleSendBusinessMessage = async () => {
    if (!business?._id || !chatMessage.trim()) return;

    setSending(true);

    try {
      const fullMessage = chatSubject.trim()
        ? `נושא: ${chatSubject.trim()}\n\n${chatMessage.trim()}`
        : chatMessage.trim();

      const res = await API.post("/business-chat/start", {
        otherBusinessId: business._id,
        text: fullMessage,
      });

      setCreatedConversationId(res.data?.conversationId || null);
      setChatMessage("");
      setChatSubject("");
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("לא הצלחנו לשלוח את ההודעה. נסי שוב.");
    } finally {
      setSending(false);
    }
  };

  const handleBackToPartners = () => {
    resetSearchFilters?.();

    if (currentUserBusinessId) {
      navigate(`/business/${currentUserBusinessId}/dashboard/collab/find-partner`);
    } else {
      navigate(-1);
    }
  };

  const handleGoToSentMessages = () => {
    const dashboardBusinessId = currentUserBusinessId || businessId;

    setIsProposalModalOpen(false);

    navigate(`/business/${dashboardBusinessId}/dashboard/collab/messages?tab=sent`, {
      replace: true,
    });
  };

  const handleContinueChat = () => {
    if (!createdConversationId) return;

    const dashboardBusinessId = currentUserBusinessId || businessId;

    navigate(`/business/${dashboardBusinessId}/dashboard/collab/messages?tab=chat`, {
      state: { conversationId: createdConversationId },
    });
  };

  const applyChatTemplate = (template: string) => {
    setChatSubject(template);

    setChatMessage((prev) => {
      if (prev.trim()) return prev;

      if (template === "שיתוף פעולה") {
        return "שלום, אשמח לבדוק אפשרות לשיתוף פעולה בין העסקים שלנו.";
      }

      if (template === "שיחת היכרות") {
        return "שלום, אשמח לתאם שיחת היכרות קצרה ולבדוק אם יש התאמה לשיתוף פעולה.";
      }

      if (template === "הצעה עסקית") {
        return "שלום, יש לי הצעה עסקית שיכולה להתאים לעסק שלכם. אשמח לשלוח פרטים נוספים.";
      }

      return "";
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState text={error} />;
  }

  if (!business) {
    return <ErrorState text="העסק לא נמצא" />;
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50/70 px-4 py-6 text-right sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {isOwnerViewingOther && (
          <button
            type="button"
            onClick={handleBackToPartners}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" />
            חזרה לשותפים
          </button>
        )}

        <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[2rem] border border-white bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur">
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={business.businessName || "Business logo"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-11 w-11 text-violet-700" />
                )}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  פרופיל עסקי
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  {business.businessName || "עסק ללא שם"}
                </h1>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge icon={Store} text={business.category || "ללא קטגוריה"} />
                  {locationText && <Badge icon={MapPin} text={locationText} />}
                </div>
              </div>
            </div>

            {isLoggedIn && (
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <button
                  type="button"
                  onClick={openProposalModal}
                  disabled={!currentUserBusinessName}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileSignature className="h-5 w-5" />
                  שליחת הצעה
                </button>

                <button
                  type="button"
                  onClick={openChatModal}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-5 text-sm font-black text-sky-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
                >
                  <MessageCircle className="h-5 w-5" />
                  התחלת צ׳אט
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MiniStatCard
            icon={Store}
            label="תחום פעילות"
            value={business.category || "לא הוגדר"}
            tone="violet"
          />
          <MiniStatCard
            icon={MapPin}
            label="אזור שירות"
            value={locationText || "לא הוגדר"}
            tone="sky"
          />
          <MiniStatCard
            icon={Handshake}
            label="אפשרות פעולה"
            value={isLoggedIn ? "הצעה / צ׳אט" : "צפייה בלבד"}
            tone="emerald"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <InfoPanel
              icon={Building2}
              title="על העסק"
              subtitle="תיאור ופרטים כלליים"
            >
              <p className="text-sm font-semibold leading-8 text-slate-600">
                {business.description || "לא נוסף תיאור לעסק עדיין."}
              </p>
            </InfoPanel>

            <InfoPanel
              icon={Handshake}
              title="התאמה לשיתוף פעולה"
              subtitle="מקום טוב להבין האם העסק מתאים לשיתוף פעולה"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <AgreementPoint
                  title="אפשרות להצעת שיתוף פעולה"
                  text="אפשר לשלוח הצעה מסודרת עם שירותים, תנאי תשלום, סעיפים ותנאי ביטול."
                />
                <AgreementPoint
                  title="אפשרות לפתיחת שיחה"
                  text="אפשר להתחיל צ׳אט עסקי לפני שליחת הצעה או אחרי יצירת קשר ראשוני."
                />
              </div>
            </InfoPanel>
          </div>

          <aside className="space-y-6">
            <InfoPanel
              icon={Phone}
              title="פרטי קשר"
              subtitle="פרטים שהעסק הציג בפרופיל"
            >
              {contactItems.length ? (
                <div className="space-y-3">
                  {contactItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-400">
                            {item.label}
                          </p>
                          <p className="truncate text-sm font-black text-slate-950">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-500">
                  לא הוגדרו פרטי קשר לעסק.
                </p>
              )}
            </InfoPanel>

            <InfoPanel
              icon={CheckCircle2}
              title="פעולות מהירות"
              subtitle="מה ניתן לעשות מכאן"
            >
              <div className="space-y-3">
                <QuickAction
                  icon={FileSignature}
                  title="שליחת הצעה"
                  text="פתיחת טופס הסכם/הצעה מסודר"
                  onClick={openProposalModal}
                  disabled={!isLoggedIn || !currentUserBusinessName}
                />
                <QuickAction
                  icon={MessageCircle}
                  title="שליחת הודעה"
                  text="התחלת שיחה עסקית עם העסק"
                  onClick={openChatModal}
                  disabled={!isLoggedIn}
                />
              </div>
            </InfoPanel>
          </aside>
        </section>
      </div>

      {isProposalModalOpen && (
        <AppModal onClose={() => setIsProposalModalOpen(false)}>
          <div className="mx-auto max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] bg-white p-4 shadow-2xl sm:p-6">
            <ProposalForm
              fromBusinessName={currentUserBusinessName}
              toBusiness={business}
              onClose={() => setIsProposalModalOpen(false)}
              onSent={handleGoToSentMessages}
            />
          </div>
        </AppModal>
      )}

      {chatModalOpen && (
        <AppModal onClose={resetChatModal}>
          <div
            dir="rtl"
            className="mx-auto w-full max-w-2xl rounded-[2rem] bg-white p-5 text-right shadow-2xl sm:p-6"
          >
            {!createdConversationId ? (
              <>
                <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                      <MessageCircle className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        שליחת הודעה לעסק
                      </h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                        ההודעה תפתח שיחה חדשה עם {business.businessName}.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetChatModal}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-sky-50 p-4">
                  <p className="text-xs font-black text-slate-400">נשלח אל</p>
                  <p className="mt-1 text-sm font-black text-slate-950">
                    {business.businessName}
                  </p>
                </div>

                <div className="mb-4 grid gap-2 sm:grid-cols-3">
                  {["שיתוף פעולה", "שיחת היכרות", "הצעה עסקית"].map(
                    (template) => (
                      <button
                        key={template}
                        type="button"
                        onClick={() => applyChatTemplate(template)}
                        className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                      >
                        {template}
                      </button>
                    )
                  )}
                </div>

                <label className="mb-4 block">
                  <p className="mb-2 text-sm font-black text-slate-800">
                    נושא ההודעה
                  </p>
                  <input
                    value={chatSubject}
                    onChange={(event) => setChatSubject(event.target.value)}
                    placeholder="לדוגמה: שיתוף פעולה בין עסקים"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </label>

                <label className="block">
                  <p className="mb-2 text-sm font-black text-slate-800">
                    תוכן ההודעה
                  </p>
                  <textarea
                    value={chatMessage}
                    onChange={(event) => setChatMessage(event.target.value)}
                    rows={5}
                    maxLength={800}
                    placeholder="כתבי כאן את ההודעה שלך..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </label>

                <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>{chatMessage.length}/800 תווים</span>
                  <span>תיפתח שיחה חדשה לאחר השליחה</span>
                </div>

                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetChatModal}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-5 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                  >
                    ביטול
                  </button>

                  <button
                    type="button"
                    onClick={handleSendBusinessMessage}
                    disabled={!chatMessage.trim() || sending}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.20)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    {sending ? "שולח..." : "שליחת הודעה"}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h3 className="mt-5 text-2xl font-black text-slate-950">
                  ההודעה נשלחה בהצלחה
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-7 text-slate-500">
                  נפתחה שיחה חדשה עם העסק. אפשר להמשיך את השיחה מתוך אזור
                  ההודעות.
                </p>

                <button
                  type="button"
                  onClick={handleContinueChat}
                  className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.20)] transition hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-5 w-5" />
                  המשך לצ׳אט
                </button>
              </div>
            )}
          </div>
        </AppModal>
      )}
    </main>
  );
}

function Badge({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm ring-1 ring-slate-100">
      <Icon className="h-3.5 w-3.5 text-violet-700" />
      {text}
    </span>
  );
}

function MiniStatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: "sky" | "violet" | "emerald";
}) {
  const toneClass = {
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    emerald: "bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-black text-slate-400">{label}</p>
          <p className="mt-1 truncate text-lg font-black text-slate-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoPanel({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function AgreementPoint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        <p className="text-sm font-black text-slate-950">{title}</p>
      </div>

      <p className="text-sm font-semibold leading-7 text-slate-500">{text}</p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  text,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-right transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm group-hover:bg-violet-50">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-sm font-black text-slate-950">{title}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
          {text}
        </p>
      </div>
    </button>
  );
}

function LoadingState() {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-50 p-4"
    >
      <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-violet-700" />
        <p className="mt-4 text-sm font-black text-slate-500">
          טוען את פרטי העסק...
        </p>
      </div>
    </div>
  );
}

function ErrorState({ text }: { text: string }) {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-50 p-4"
    >
      <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-10 text-center shadow-sm">
        <p className="text-lg font-black text-rose-700">{text}</p>
        <p className="mt-2 text-sm font-semibold text-rose-500">
          נסי לרענן את העמוד או לחזור אחורה.
        </p>
      </div>
    </div>
  );
}

function AppModal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="flex w-full items-center justify-center"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
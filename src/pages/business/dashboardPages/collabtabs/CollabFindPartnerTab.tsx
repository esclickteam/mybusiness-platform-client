import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Eye,
  Handshake,
  Loader2,
  MapPin,
  Search,
  Send,
  Sparkles,
  Store,
  Target,
  UsersRound,
} from "lucide-react";

import API from "../../../../api";
import { fetchMyBusinessId, resolveBusinessId } from "./collabUtils";

type BusinessPartner = {
  _id: string;
  businessName?: string;
  category?: string;
  description?: string;
  logo?: string;
  area?: string;
  city?: string;
  complementaryCategories?: string[];
};

type SearchMode = "category" | "free" | string;

type CollabFindPartnerTabProps = {
  searchMode?: SearchMode;
  searchCategory?: string;
  freeText?: string;
};

type PartnerCardProps = {
  business: BusinessPartner;
  isMine: boolean;
  onOpenProfile: (business: BusinessPartner) => void;
  onSendProposal: (business: BusinessPartner) => void;
  onStartChat: (business: BusinessPartner) => void;
  chatLoadingId: string | null;
};

function PartnerCard({
  business,
  isMine,
  onOpenProfile,
  onSendProposal,
  onStartChat,
  chatLoadingId,
}: PartnerCardProps) {
  const logoUrl = business.logo || "/default-logo.png";
  const locationText = business.area || business.city || "לא הוגדר מיקום";

  return (
    <article
      dir="rtl"
      className={[
        "group flex h-full flex-col overflow-hidden rounded-[2rem] border bg-white text-right shadow-sm transition",
        "hover:-translate-y-1 hover:border-violet-100 hover:shadow-[0_24px_80px_rgba(15,23,42,0.10)]",
        isMine ? "border-violet-200 ring-4 ring-violet-50" : "border-slate-100",
      ].join(" ")}
    >
      <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5">
        <div className="pointer-events-none absolute -left-12 -top-16 h-44 w-44 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-32 w-32 rounded-full bg-sky-200/50 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] border border-white bg-white/85 shadow-[0_14px_38px_rgba(15,23,42,0.08)] backdrop-blur">
            {business.logo ? (
              <img
                src={logoUrl}
                alt={`לוגו של ${business.businessName || "עסק"}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-8 w-8 text-sky-700" />
            )}
          </div>

          {isMine ? (
            <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700 ring-1 ring-violet-100">
              העסק שלי
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
              שותף פוטנציאלי
            </span>
          )}
        </div>

        <div className="relative mt-5">
          <h3 className="line-clamp-2 min-h-[56px] text-xl font-black leading-7 text-slate-950">
            {business.businessName || "עסק ללא שם"}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm">
              <Store className="h-3.5 w-3.5 text-sky-700" />
              {business.category || "לא הוגדרה קטגוריה"}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-700 ring-1 ring-sky-100">
              <MapPin className="h-3.5 w-3.5" />
              {locationText}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
            תיאור העסק
          </p>

          <p className="line-clamp-4 min-h-[96px] text-sm font-semibold leading-6 text-slate-600">
            {business.description || "עדיין לא הוזן תיאור לעסק הזה."}
          </p>
        </div>

        {business.complementaryCategories?.length ? (
          <div className="mt-5">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              קטגוריות מתאימות
            </p>

            <div className="flex flex-wrap gap-2">
              {business.complementaryCategories.slice(0, 4).map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoTile icon={Target} label="התאמה" value="רלוונטי" />

          <InfoTile
            icon={Handshake}
            label="פעולה"
            value={isMine ? "לא זמין" : "פתיחה"}
          />
        </div>

        {isMine ? (
          <div className="mt-5 flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-5 text-sm font-black text-slate-500">
            זה העסק שלך
          </div>
        ) : (
          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => onSendProposal(business)}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5"
            >
              <Send className="h-5 w-5" />
              שליחת הצעה
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onStartChat(business)}
                disabled={chatLoadingId === business._id}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-3 text-sm font-black text-sky-800 transition hover:bg-sky-100 disabled:opacity-60"
              >
                {chatLoadingId === business._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Handshake className="h-4 w-4" />
                )}
                צ׳אט
              </button>

              <button
                type="button"
                onClick={() => onOpenProfile(business)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                <Eye className="h-4 w-4" />
                פרופיל
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function CollabFindPartnerTab({
  searchMode,
  searchCategory,
  freeText,
}: CollabFindPartnerTabProps) {
  const navigate = useNavigate();

  const [myBusinessId, setMyBusinessId] = useState<string | null>(null);
  const [partners, setPartners] = useState<BusinessPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState("");
  const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [businessId, partnersRes] = await Promise.all([
        fetchMyBusinessId(),
        API.get("/business/findPartners"),
      ]);

      setMyBusinessId(businessId);
      setPartners(partnersRes.data.relevant || []);
    } catch (fetchError) {
      console.error("Failed to load partners:", fetchError);
      setError("שגיאה בטעינת השותפים");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredPartners = useMemo(() => {
    if (!partners.length) return [];

    let result = partners;

    if (searchMode === "category" && searchCategory) {
      const categoryQuery = searchCategory.toLowerCase();

      result = result.filter((business) => {
        return (
          business.category?.toLowerCase().includes(categoryQuery) ||
          (business.complementaryCategories || []).some((category) =>
            category.toLowerCase().includes(categoryQuery)
          )
        );
      });
    }

    if (searchMode === "free" && freeText) {
      const textQuery = freeText.toLowerCase();

      result = result.filter((business) => {
        return (
          business.businessName?.toLowerCase().includes(textQuery) ||
          business.description?.toLowerCase().includes(textQuery) ||
          business.category?.toLowerCase().includes(textQuery)
        );
      });
    }

    const localQuery = localSearch.trim().toLowerCase();

    if (localQuery) {
      result = result.filter((business) => {
        return (
          business.businessName?.toLowerCase().includes(localQuery) ||
          business.description?.toLowerCase().includes(localQuery) ||
          business.category?.toLowerCase().includes(localQuery) ||
          business.area?.toLowerCase().includes(localQuery) ||
          business.city?.toLowerCase().includes(localQuery)
        );
      });
    }

    return result;
  }, [partners, searchMode, searchCategory, freeText, localSearch]);

  const otherPartnersCount = useMemo(() => {
    return partners.filter((business) => business._id !== myBusinessId).length;
  }, [partners, myBusinessId]);

  const categoriesCount = useMemo(() => {
    const categories = new Set<string>();

    partners.forEach((business) => {
      if (business.category) categories.add(business.category);

      business.complementaryCategories?.forEach((category) => {
        categories.add(category);
      });
    });

    return categories.size;
  }, [partners]);

  const withDescriptionCount = useMemo(() => {
    return partners.filter((business) => Boolean(business.description)).length;
  }, [partners]);

  const handleOpenProfile = useCallback(
    (business: BusinessPartner) => {
      navigate(`/business-profile/${business._id}`);
    },
    [navigate]
  );

  const handleSendProposal = useCallback(
    (business: BusinessPartner) => {
      navigate(`/business-profile/${business._id}`, {
        state: { openProposal: true },
      });
    },
    [navigate]
  );

  const handleStartChat = useCallback(
    async (business: BusinessPartner) => {
      const businessId = myBusinessId || (await fetchMyBusinessId());

      if (!businessId) {
        alert("לא נמצא מזהה עסק. נסו לרענן את הדף.");
        return;
      }

      if (!myBusinessId) {
        setMyBusinessId(businessId);
      }

      setChatLoadingId(business._id);

      try {
        const res = await API.post("/business-chat/start", {
          otherBusinessId: business._id,
          text: "שלום, אשמח לבדוק אפשרות לשיתוף פעולה בין העסקים שלנו.",
        });

        const conversationId = res.data?.conversationId;

        if (conversationId) {
          navigate(
            `/business/${businessId}/dashboard/collab/messages?tab=chat&conversationId=${conversationId}`
          );
        }
      } catch (chatError) {
        console.error("Failed to start chat:", chatError);
        alert("לא הצלחנו להתחיל שיחה. נסו שוב.");
      } finally {
        setChatLoadingId(null);
      }
    },
    [myBusinessId, navigate]
  );

  if (loading) {
    return (
      <div
        dir="rtl"
        className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
      >
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-violet-700" />

        <p className="mt-4 text-sm font-black text-slate-500">
          מחפש שותפים רלוונטיים...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="rounded-[2rem] border border-rose-100 bg-rose-50 p-10 text-center"
      >
        <p className="text-lg font-black text-rose-700">{error}</p>

        <p className="mt-2 text-sm font-semibold text-rose-500">
          רענן את העמוד ונסה שוב.
        </p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6 text-right">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              איתור שותפים
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              מציאת שותפים עסקיים
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
              גלה עסקים רלוונטיים, צפה בפרופילים שלהם והתחל שיתופי פעולה איכותיים מתוך מקום אחד מסודר.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              תוצאות מתאימות
            </p>

            <p className="mt-2 text-3xl font-black text-violet-700">
              {filteredPartners.length}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="סה״כ שותפים"
          value={partners.length}
          helper="עסקים שנמצאו"
          icon={UsersRound}
          tone="sky"
        />

        <StatCard
          label="שותפים זמינים"
          value={otherPartnersCount}
          helper="לא כולל העסק שלך"
          icon={Handshake}
          tone="violet"
        />

        <StatCard
          label="קטגוריות"
          value={categoriesCount}
          helper="תחומי התאמה"
          icon={Target}
          tone="amber"
        />

        <StatCard
          label="עם תיאור"
          value={withDescriptionCount}
          helper="פרופילים מלאים"
          icon={CheckCircle2}
          tone="emerald"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 bg-gradient-to-l from-white to-sky-50/60 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">
                שותפים רלוונטיים
              </h3>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {filteredPartners.length} מוצגים מתוך {partners.length} שותפים
              </p>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={localSearch}
                onChange={(event) => setLocalSearch(event.target.value)}
                placeholder="חיפוש שותפים..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-12 pl-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 sm:w-[360px]"
              />
            </div>
          </div>
        </div>

        {filteredPartners.length === 0 ? (
          <EmptyPartnersState />
        ) : (
          <div
            ref={gridRef}
            className="grid gap-4 p-5 md:grid-cols-2 2xl:grid-cols-3"
          >
            {filteredPartners.map((business) => (
              <PartnerCard
                key={business._id}
                business={business}
                isMine={business._id === myBusinessId}
                onOpenProfile={handleOpenProfile}
                onSendProposal={handleSendProposal}
                onStartChat={handleStartChat}
                chatLoadingId={chatLoadingId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  helper,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  helper: string;
  tone: "sky" | "violet" | "amber" | "emerald";
}) {
  const toneClass = {
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">{label}</p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs font-black text-emerald-600">פעיל</p>

          <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sky-700">
        <Icon className="h-4 w-4" />

        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
      </div>

      <p className="truncate text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function EmptyPartnersState() {
  return (
    <div
      dir="rtl"
      className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/70 to-violet-50/70 px-6 py-14 text-center"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-violet-700 shadow-sm">
        <Handshake className="h-7 w-7" />
      </div>

      <h4 className="text-xl font-black text-slate-950">
        לא נמצאו שותפים מתאימים
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
        נסה לשנות את החיפוש או לבחור קטגוריה רחבה יותר.
      </p>
    </div>
  );
}
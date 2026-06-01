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
  Sparkles,
  Store,
  Target,
  UsersRound,
} from "lucide-react";

import API from "../../../../api";

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
};

function PartnerCard({ business, isMine, onOpenProfile }: PartnerCardProps) {
  const logoUrl = business.logo || "/default-logo.png";
  const locationText = business.area || business.city || "Location not set";

  return (
    <article
      className={[
        "group flex h-full flex-col overflow-hidden rounded-[2rem] border bg-white shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)]",
        isMine
          ? "border-sky-200 ring-4 ring-sky-50"
          : "border-slate-100",
      ].join(" ")}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-5 text-white">
        <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/15 bg-white/10 shadow-lg shadow-slate-950/20 backdrop-blur">
            {business.logo ? (
              <img
                src={logoUrl}
                alt={`${business.businessName || "Business"} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-8 w-8 text-white/85" />
            )}
          </div>

          {isMine ? (
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-950">
              My Business
            </span>
          ) : (
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-sky-100">
              Partner
            </span>
          )}
        </div>

        <div className="relative mt-5">
          <h3 className="line-clamp-2 min-h-[56px] text-xl font-black leading-7">
            {business.businessName || "Unnamed Business"}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-sky-100">
              <Store className="h-3.5 w-3.5" />
              {business.category || "No category"}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-sky-100">
              <MapPin className="h-3.5 w-3.5" />
              {locationText}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
            Business Description
          </p>

          <p className="line-clamp-4 min-h-[96px] text-sm font-semibold leading-6 text-slate-600">
            {business.description || "No business description provided yet."}
          </p>
        </div>

        {business.complementaryCategories?.length ? (
          <div className="mt-5">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Matching Categories
            </p>

            <div className="flex flex-wrap gap-2">
              {business.complementaryCategories.slice(0, 4).map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-900"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoTile icon={Target} label="Match" value="Relevant" />
          <InfoTile
            icon={Handshake}
            label="Action"
            value={isMine ? "Disabled" : "Open"}
          />
        </div>

        {isMine ? (
          <div className="mt-5 flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-5 text-sm font-black text-slate-500">
            This is your business
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpenProfile(business)}
            className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
          >
            <Eye className="h-5 w-5" />
            View Profile
          </button>
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

  const gridRef = useRef<HTMLDivElement | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [myBusinessRes, partnersRes] = await Promise.all([
        API.get("/business/my"),
        API.get("/business/findPartners"),
      ]);

      setMyBusinessId(myBusinessRes.data.business?._id || null);
      setPartners(partnersRes.data.relevant || []);
    } catch (fetchError) {
      console.error("Failed to load partners:", fetchError);
      setError("Failed to load partners");
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

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-100 bg-white p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-sky-900" />
        <p className="mt-4 text-sm font-black text-slate-500">
          Finding relevant partners...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-10 text-center">
        <p className="text-lg font-black text-rose-700">{error}</p>
        <p className="mt-2 text-sm font-semibold text-rose-500">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-28 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-100">
              <Sparkles className="h-4 w-4" />
              Partner Finder
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Find business partners
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100/90">
              Discover relevant businesses, review their profiles and start
              high-value collaborations from one premium workspace.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-100">
              Matching results
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {filteredPartners.length}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total partners"
          value={partners.length}
          helper="businesses found"
          icon={UsersRound}
        />
        <StatCard
          label="Available partners"
          value={otherPartnersCount}
          helper="excluding your business"
          icon={Handshake}
        />
        <StatCard
          label="Categories"
          value={categoriesCount}
          helper="matching areas"
          icon={Target}
        />
        <StatCard
          label="With description"
          value={withDescriptionCount}
          helper="complete profiles"
          icon={CheckCircle2}
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">
                Relevant Partners
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {filteredPartners.length} shown from {partners.length} total
                partners
              </p>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={localSearch}
                onChange={(event) => setLocalSearch(event.target.value)}
                placeholder="Search partners..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:w-[360px]"
              />
            </div>
          </div>
        </div>

        {filteredPartners.length === 0 ? (
          <EmptyPartnersState />
        ) : (
          <div ref={gridRef} className="grid gap-4 p-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredPartners.map((business) => (
              <PartnerCard
                key={business._id}
                business={business}
                isMine={business._id === myBusinessId}
                onOpenProfile={handleOpenProfile}
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
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-xs font-black text-emerald-600">▲ Active</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
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
      <div className="mb-2 flex items-center gap-2 text-sky-900">
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
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/40 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950 shadow-sm">
        <Handshake className="h-7 w-7" />
      </div>

      <h4 className="text-xl font-black text-slate-950">
        No matching partners found
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try adjusting your search filters or looking for a broader business
        category.
      </p>
    </div>
  );
}
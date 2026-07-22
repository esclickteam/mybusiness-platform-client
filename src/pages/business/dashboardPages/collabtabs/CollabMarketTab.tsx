import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  Eye,
  Handshake,
  Loader2,
  Megaphone,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Send,
  Sparkles,
  Tags,
  Target,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";

import API from "../../../../api";
import { BizuplyLoadingState } from "../../../../components/ui/BizuplyLoader";
import { fetchMyBusinessId, resolveBusinessId } from "./collabUtils";

type CollabFormState = {
  title: string;
  description: string;
  needs: string;
  offers: string;
  contactName: string;
  budget: string;
  expiryDate: string;
};

type CollabMarketItem = {
  _id: string;
  title?: string;
  description?: string;
  needs?: string[];
  offers?: string[];
  budget?: number;
  validUntil?: string | null;
  fromBusinessId?: string | { _id?: string };
  contactName?: string;
  phone?: string;
  createdAt?: string;
};

type CreateCollabFormProps = {
  onSuccess?: () => void;
  onCancel: () => void;
};

const emptyForm: CollabFormState = {
  title: "",
  description: "",
  needs: "",
  offers: "",
  contactName: "",
  budget: "",
  expiryDate: "",
};

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100";

const textareaClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100";

const phoneInputClass =
  "!h-[48px] !w-full !rounded-2xl !border !border-slate-200 !bg-slate-50 !pl-14 !pr-4 !text-left !text-sm !font-semibold !text-slate-900 !outline-none focus:!border-violet-300 focus:!bg-white";

const phoneButtonClass =
  "!left-0 !right-auto !rounded-l-2xl !rounded-r-none !border-slate-200 !bg-white";

function CreateCollabForm({ onSuccess, onCancel }: CreateCollabFormProps) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [formData, setFormData] = useState<CollabFormState>(emptyForm);
  const [useExpiry, setUseExpiry] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);

      const { title, description, contactName } = formData;

      if (!title.trim() || !description.trim() || !contactName.trim() || !phone) {
        setError(t("collab.market.form.requiredFields"));
        return;
      }

      setLoading(true);

      try {
        await API.post("/collaboration-market", {
          title: formData.title.trim(),
          description: formData.description.trim(),
          needs: splitTags(formData.needs),
          offers: splitTags(formData.offers),
          budget: formData.budget ? Number(formData.budget) : undefined,
          validUntil:
            useExpiry && formData.expiryDate
              ? new Date(formData.expiryDate).toISOString()
              : null,
          contactName: formData.contactName.trim(),
          phone,
        });

        setFormData(emptyForm);
        setPhone("");
        setUseExpiry(false);

        onSuccess?.();
      } catch (submitError) {
        console.error("Publish collaboration error:", submitError);
        setError(t("collab.market.form.publishError"));
      } finally {
        setLoading(false);
      }
    },
    [formData, useExpiry, phone, onSuccess, t]
  );

  return (
    <form onSubmit={handleSubmit} dir={dir} className="space-y-5 text-start">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
            <Sparkles className="h-4 w-4" />
            {t("collab.market.form.badge")}
          </div>

          <h3 className="mt-3 text-2xl font-black text-slate-950">
            {t("collab.market.form.title")}
          </h3>

          <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
            {t("collab.market.form.subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          aria-label={t("collab.market.form.closeAria")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label={t("collab.market.form.fieldTitle")} required icon={Megaphone}>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={t("collab.market.form.titlePlaceholder")}
            className={inputClass}
          />
        </FormField>

        <FormField label={t("collab.market.form.contact")} required icon={UserRound}>
          <input
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder={t("collab.market.form.contactPlaceholder")}
            className={inputClass}
          />
        </FormField>

        <div className="lg:col-span-2">
          <FormField label={t("collab.market.form.description")} required icon={BriefcaseBusiness}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder={t("collab.market.form.descriptionPlaceholder")}
              className={textareaClass}
            />
          </FormField>
        </div>

        <FormField label={t("collab.market.form.needs")} icon={Target}>
          <input
            name="needs"
            placeholder={t("collab.market.form.needsPlaceholder")}
            value={formData.needs}
            onChange={handleChange}
            className={inputClass}
          />

          <p className="mt-2 text-xs font-semibold text-slate-400">
            {t("collab.market.form.tagsHint")}
          </p>
        </FormField>

        <FormField label={t("collab.market.form.offers")} icon={Tags}>
          <input
            name="offers"
            placeholder={t("collab.market.form.offersPlaceholder")}
            value={formData.offers}
            onChange={handleChange}
            className={inputClass}
          />

          <p className="mt-2 text-xs font-semibold text-slate-400">
            {t("collab.market.form.tagsHint")}
          </p>
        </FormField>

        <FormField label={t("collab.market.form.phone")} required icon={Phone}>
          <div dir="ltr" className="text-left">
            <PhoneInput
              country="il"
              value={phone}
              onChange={(value) => setPhone(value)}
              inputProps={{
                required: true,
                name: "phone",
                dir: "ltr",
              }}
              containerClass="!w-full !text-left"
              inputClass={phoneInputClass}
              buttonClass={phoneButtonClass}
              dropdownClass="!text-left"
              searchClass="!text-left"
              enableSearch
            />
          </div>
        </FormField>

        <FormField label={t("collab.market.form.budget")} icon={DollarSign}>
          <div className="relative">
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
              ₪
            </span>

            <input
              type="number"
              name="budget"
              placeholder={t("collab.market.form.budgetPlaceholder")}
              value={formData.budget}
              onChange={handleChange}
              className={`${inputClass} pr-10`}
            />
          </div>
        </FormField>

        <div className="lg:col-span-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-violet-100 bg-gradient-to-l from-violet-50 to-sky-50 p-4">
            <input
              type="checkbox"
              checked={useExpiry}
              onChange={(event) => setUseExpiry(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-violet-700 focus:ring-violet-500"
            />

            <div>
              <p className="text-sm font-black text-slate-900">
                {t("collab.market.form.setExpiry")}
              </p>

              <p className="text-xs font-semibold text-slate-500">
                {t("collab.market.form.setExpiryHint")}
              </p>
            </div>
          </label>
        </div>

        {useExpiry && (
          <FormField label={t("collab.market.form.expiryDate")} icon={CalendarClock}>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("collab.market.form.cancel")}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-6 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <BizuplyLoader size="sm" compact />
          ) : (
            <Plus className="h-5 w-5" />
          )}

          {loading ? t("collab.market.form.publishing") : t("collab.market.form.submit")}
        </button>
      </div>
    </form>
  );
}

export default function CollabMarketTab() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [collabMarket, setCollabMarket] = useState<CollabMarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [myBusinessId, setMyBusinessId] = useState<string | null>(null);
  const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchCollabs = useCallback(async () => {
    try {
      setLoading(true);

      const [marketRes, businessId] = await Promise.all([
        API.get("/collaboration-market"),
        fetchMyBusinessId(),
      ]);

      setCollabMarket(marketRes.data.collabs || []);
      setMyBusinessId(businessId);
    } catch (error) {
      console.error("Failed loading collaboration market:", error);
      setCollabMarket([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollabs();
  }, [fetchCollabs]);

  const filteredCollabs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return collabMarket;

    return collabMarket.filter((item) => {
      return (
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.needs?.some((tag) => tag.toLowerCase().includes(query)) ||
        item.offers?.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [collabMarket, search]);

  const activeCount = useMemo(() => {
    const now = Date.now();

    return collabMarket.filter((item) => {
      if (!item.validUntil) return true;
      return new Date(item.validUntil).getTime() >= now;
    }).length;
  }, [collabMarket]);

  const withBudgetCount = useMemo(() => {
    return collabMarket.filter((item) => Number(item.budget) > 0).length;
  }, [collabMarket]);

  const totalTagsCount = useMemo(() => {
    return collabMarket.reduce((sum, item) => {
      return sum + (item.needs?.length || 0) + (item.offers?.length || 0);
    }, 0);
  }, [collabMarket]);

  const handleSendProposal = useCallback(
    (item: CollabMarketItem) => {
      const publisherId = resolveBusinessId(item.fromBusinessId);
      if (!publisherId) return;

      navigate(`/business-profile/${publisherId}`, {
        state: { openProposal: true },
      });
    },
    [navigate]
  );

  const handleStartChat = useCallback(
    async (item: CollabMarketItem) => {
      const publisherId = resolveBusinessId(item.fromBusinessId);
      const businessId = myBusinessId || (await fetchMyBusinessId());

      if (!publisherId) {
        alert(t("collab.market.alerts.unknownPublisher"));
        return;
      }

      if (!businessId) {
        alert(t("collab.market.alerts.missingBusinessId"));
        return;
      }

      if (!myBusinessId) {
        setMyBusinessId(businessId);
      }

      setChatLoadingId(item._id);

      try {
        const res = await API.post("/business-chat/start", {
          otherBusinessId: publisherId,
          text: t("collab.market.chatIntro", { title: item.title || t("collab.market.untitled") }),
        });

        const conversationId = res.data?.conversationId;

        if (conversationId) {
          navigate(
            `/business/${businessId}/dashboard/collab/messages?tab=chat&conversationId=${conversationId}`
          );
        }
      } catch (chatError) {
        console.error("Failed to start chat:", chatError);
        alert(t("collab.market.alerts.chatFailed"));
      } finally {
        setChatLoadingId(null);
      }
    },
    [myBusinessId, navigate, t]
  );

  return (
    <div dir={dir} className="space-y-6 text-start">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
              <Handshake className="h-4 w-4" />
              {t("collab.market.badge")}
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {t("collab.market.title")}
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
              {t("collab.market.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            {t("collab.market.publish")}
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("collab.market.stats.total")}
          value={collabMarket.length}
          helper={t("collab.market.stats.totalHelper")}
          icon={Handshake}
          tone="sky"
        />

        <StatCard
          label={t("collab.market.stats.active")}
          value={activeCount}
          helper={t("collab.market.stats.activeHelper")}
          icon={CheckCircle2}
          tone="emerald"
        />

        <StatCard
          label={t("collab.market.stats.withBudget")}
          value={withBudgetCount}
          helper={t("collab.market.stats.withBudgetHelper")}
          icon={DollarSign}
          tone="amber"
        />

        <StatCard
          label={t("collab.market.stats.tags")}
          value={totalTagsCount}
          helper={t("collab.market.stats.tagsHelper")}
          icon={Tags}
          tone="violet"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 bg-gradient-to-l from-white to-sky-50/60 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">
                {t("collab.market.listTitle")}
              </h3>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {t("collab.market.showing", { shown: filteredCollabs.length, total: collabMarket.length })}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("collab.market.searchPlaceholder")}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-12 pl-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 sm:w-[360px]"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                {t("collab.market.publishNew")}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredCollabs.length === 0 ? (
          <EmptyMarketState onCreate={() => setShowCreateModal(true)} />
        ) : (
          <div className="grid gap-4 p-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredCollabs.map((item) => {
              const publisherId = resolveBusinessId(item.fromBusinessId);

              return (
              <CollabCard
                key={item._id}
                item={item}
                publisherId={publisherId}
                chatLoading={chatLoadingId === item._id}
                onViewProfile={() => {
                  if (publisherId) {
                    navigate(`/business-profile/${publisherId}`);
                  }
                }}
                onSendProposal={() => handleSendProposal(item)}
                onStartChat={() => handleStartChat(item)}
              />
            );
            })}
          </div>
        )}
      </section>

      {showCreateModal && (
        <AppModal onClose={() => setShowCreateModal(false)}>
          <div
            dir={dir}
            className="mx-auto max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-5 text-start shadow-2xl sm:p-6"
          >
            <CreateCollabForm
              onSuccess={() => {
                setShowCreateModal(false);
                fetchCollabs();
              }}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </AppModal>
      )}
    </div>
  );
}

function CollabCard({
  item,
  publisherId,
  onViewProfile,
  onSendProposal,
  onStartChat,
  chatLoading,
}: {
  item: CollabMarketItem;
  publisherId: string | null;
  onViewProfile: () => void;
  onSendProposal: () => void;
  onStartChat: () => void;
  chatLoading?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language?.startsWith("he") ? "he-IL" : "en-US";
  const needs = item.needs || [];
  const offers = item.offers || [];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white text-start shadow-sm transition hover:-translate-y-1 hover:border-violet-100 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
      <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5">
        <div className="pointer-events-none absolute -left-12 -top-14 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="relative">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
              <Handshake className="h-6 w-6" />
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700 shadow-sm">
              {item.validUntil ? t("collab.market.timeLimited") : t("collab.market.open")}
            </span>
          </div>

          <h3 className="line-clamp-2 min-h-[56px] text-xl font-black leading-7 text-slate-950">
            {item.title || t("collab.market.untitled")}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-4">
          {needs.length > 0 && (
            <TagBlock label={t("collab.market.need")} tags={needs} tone="need" />
          )}

          {offers.length > 0 && (
            <TagBlock label={t("collab.market.offer")} tags={offers} tone="offer" />
          )}

          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              {t("collab.market.description")}
            </p>

            <p className="line-clamp-4 text-sm font-semibold leading-6 text-slate-600">
              {item.description || t("collab.market.noDescription")}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <InfoTile
            icon={DollarSign}
            label={t("collab.market.budget")}
            value={
              item.budget
                ? `₪${Number(item.budget).toLocaleString(dateLocale)}`
                : t("collab.market.notSpecified")
            }
          />

          <InfoTile
            icon={CalendarClock}
            label={t("collab.market.expiry")}
            value={
              item.validUntil
                ? new Date(item.validUntil).toLocaleDateString(dateLocale)
                : t("collab.market.noExpiry")
            }
          />
        </div>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={onSendProposal}
            disabled={!publisherId}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
            {t("collab.market.sendProposal")}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onStartChat}
              disabled={!publisherId || chatLoading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-3 text-sm font-black text-sky-800 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {chatLoading ? (
                <BizuplyLoader size="xs" compact />
              ) : (
                <MessageCircle className="h-4 w-4" />
              )}
              {t("collab.market.chat")}
            </button>

            <button
              type="button"
              onClick={onViewProfile}
              disabled={!publisherId}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Eye className="h-5 w-5" />
              {t("collab.market.profile")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function TagBlock({
  label,
  tags,
  tone,
}: {
  label: string;
  tags: string[];
  tone: "need" | "offer";
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={`${label}-${tag}`}
            className={[
              "rounded-full px-3 py-1.5 text-xs font-black",
              tone === "need"
                ? "bg-sky-50 text-sky-700"
                : "bg-emerald-50 text-emerald-700",
            ].join(" ")}
          >
            {tag}
          </span>
        ))}
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
  const { t } = useTranslation();
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

          <p className="mt-2 text-xs font-black text-emerald-600">{t("collab.active")}</p>

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

function FormField({
  label,
  required,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-violet-700" />

        <span className="text-sm font-black text-slate-800">
          {label}
          {required && <span className="mr-1 text-rose-500">*</span>}
        </span>
      </div>

      {children}
    </label>
  );
}

function LoadingState() {
  const { t } = useTranslation();
  return <BizuplyLoadingState label={t("collab.market.loading")} />;
}

function EmptyMarketState({ onCreate }: { onCreate: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/70 to-violet-50/70 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-violet-700 shadow-sm">
        <Handshake className="h-7 w-7" />
      </div>

      <h4 className="text-xl font-black text-slate-950">
        {t("collab.market.emptyTitle")}
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
        {t("collab.market.emptyHint")}
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5"
      >
        <Plus className="h-5 w-5" />
        {t("collab.market.publish")}
      </button>
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/25 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="flex min-h-full w-full items-center justify-center py-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </div>
    </div>
  );
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
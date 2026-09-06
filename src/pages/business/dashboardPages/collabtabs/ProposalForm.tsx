import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  CheckCircle2,
  DollarSign,
  FileSignature,
  Handshake,
  Loader2,
  PackageCheck,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import API from "../../../../api";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import { getIntlLocale, getTextDirection } from "../../../../i18n/localeUtils";

type BusinessTarget = {
  _id?: string;
  businessName?: string;
  contact?: string;
  phone?: string;
};

type ProposalFormProps = {
  fromBusinessName?: string;
  toBusiness?: BusinessTarget | null;
  onClose?: () => void;
  onSent?: (proposalId?: string) => void;
};

type ProposalFormData = {
  toBusinessId: string | null;
  title: string;
  description: string;

  giving: string;
  receiving: string;

  type: "One-sided" | "Two-sided" | "With commissions";
  payment: string;
  amount: string;

  startDate: string;
  endDate: string;
  validUntil: string;

  cancelAnytime: boolean;
  confidentiality: boolean;

  providerContactName: string;
  providerPhone: string;

  receiverContactName: string;
  receiverPhone: string;

  providerServiceName: string;
  providerServiceDetails: string;
  providerIncludedItems: string;
  providerDeliverables: string;

  receiverServiceName: string;
  receiverServiceDetails: string;
  receiverIncludedItems: string;
  receiverDeliverables: string;

  changeTerms: string;
  cancellationTerms: string;
  exclusions: string;
  notes: string;
};

type ToastState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const initialFormData: ProposalFormData = {
  toBusinessId: null,
  title: "",
  description: "",

  giving: "",
  receiving: "",

  type: "Two-sided",
  payment: "",
  amount: "",

  startDate: "",
  endDate: "",
  validUntil: "",

  cancelAnytime: false,
  confidentiality: false,

  providerContactName: "",
  providerPhone: "",

  receiverContactName: "",
  receiverPhone: "",

  providerServiceName: "",
  providerServiceDetails: "",
  providerIncludedItems: "",
  providerDeliverables: "",

  receiverServiceName: "",
  receiverServiceDetails: "",
  receiverIncludedItems: "",
  receiverDeliverables: "",

  changeTerms: "",
  cancellationTerms: "",
  exclusions: "",
  notes: "",
};

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const textareaClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100";

const phoneInputClass =
  "!h-[48px] !w-full !rounded-2xl !border !border-slate-200 !bg-slate-50 !pl-14 !pr-4 !text-left !text-sm !font-semibold !text-slate-900 !outline-none focus:!border-violet-300 focus:!bg-white";

const phoneButtonClass =
  "!left-0 !right-auto !rounded-l-2xl !rounded-r-none !border-slate-200 !bg-white";

export default function ProposalForm({
  fromBusinessName,
  toBusiness,
  onClose,
  onSent,
}: ProposalFormProps) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const providerBusinessName = fromBusinessName || t("collab.proposal.senderFallback");
  const receiverBusinessName = toBusiness?.businessName || t("collab.proposal.marketFallback");

  const [formData, setFormData] = useState<ProposalFormData>({
    ...initialFormData,
    toBusinessId: toBusiness?._id || null,
    receiverContactName: toBusiness?.contact || "",
    receiverPhone: toBusiness?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      toBusinessId: toBusiness?._id || null,
      receiverContactName: prev.receiverContactName || toBusiness?.contact || "",
      receiverPhone: prev.receiverPhone || toBusiness?.phone || "",
    }));
  }, [toBusiness]);

  useEffect(() => {
    if (!toast.open) return;

    const timeoutId = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [toast.open]);

  const previewGiving = useMemo(() => {
    return splitLines(formData.giving);
  }, [formData.giving]);

  const previewReceiving = useMemo(() => {
    return splitLines(formData.receiving);
  }, [formData.receiving]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    const checked =
      event.target instanceof HTMLInputElement ? event.target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.validUntil ||
      !formData.providerContactName.trim() ||
      !formData.providerPhone
    ) {
      return t("collab.proposal.requiredAll");
    }

    if (!formData.providerServiceName.trim()) {
      return t("collab.proposal.needServiceName", { name: providerBusinessName });
    }

    if (!formData.providerServiceDetails.trim()) {
      return t("collab.proposal.needServiceDetails", { name: providerBusinessName });
    }

    if (formData.type !== "One-sided" && !formData.receiverServiceName.trim()) {
      return t("collab.proposal.needReceiverService", { name: receiverBusinessName });
    }

    if (formData.type !== "One-sided" && !formData.receiverContactName.trim()) {
      return t("collab.proposal.needReceiverContact", { name: receiverBusinessName });
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setToast({
        open: true,
        severity: "error",
        message: validationError,
      });
      return;
    }

    setLoading(true);

    const payload = {
      toBusinessId: formData.toBusinessId,

      title: formData.title.trim(),
      description: formData.description.trim(),

      giving: splitLines(formData.giving),
      receiving: splitLines(formData.receiving),

      type: formData.type,
      payment: formData.payment.trim(),

      amount: formData.amount !== "" ? Number(formData.amount) : null,

      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      validUntil: formData.validUntil,

      cancelAnytime: Boolean(formData.cancelAnytime),
      confidentiality: Boolean(formData.confidentiality),

      contactName: formData.providerContactName.trim(),
      phone: formData.providerPhone,

      agreementDetails: {
        provider: {
          businessName: providerBusinessName,
          contactName: formData.providerContactName.trim(),
          phone: formData.providerPhone,
          serviceName: formData.providerServiceName.trim(),
          serviceDetails: formData.providerServiceDetails.trim(),
          includedItems: splitLines(formData.providerIncludedItems),
          deliverables: splitLines(formData.providerDeliverables),
        },

        receiver: {
          businessName: receiverBusinessName,
          contactName: formData.receiverContactName.trim(),
          phone: formData.receiverPhone,
          serviceName: formData.receiverServiceName.trim(),
          serviceDetails: formData.receiverServiceDetails.trim(),
          includedItems: splitLines(formData.receiverIncludedItems),
          deliverables: splitLines(formData.receiverDeliverables),
        },

        terms: {
          changeTerms: formData.changeTerms.trim(),
          cancellationTerms: formData.cancellationTerms.trim(),
          exclusions: splitLines(formData.exclusions),
          notes: formData.notes.trim(),
          cancelAnytime: Boolean(formData.cancelAnytime),
          confidentiality: Boolean(formData.confidentiality),
        },
      },
    };

    try {
      const res = await API.post("/business/my/proposals", payload);

      if (res.status === 200 || res.status === 201) {
        const proposalId =
          res.data?.proposal?.proposalId ||
          res.data?.proposal?._id ||
          res.data?.proposalId;

        setToast({
          open: true,
          severity: "success",
          message: t("collab.proposal.sentSuccess"),
        });

        onSent?.(proposalId);
      } else {
        setToast({
          open: true,
          severity: "error",
          message: t("collab.proposal.sendFailedRetry"),
        });
      }
    } catch (err: any) {
      setToast({
        open: true,
        severity: "error",
        message: err?.response?.data?.error || t("collab.proposal.sendError"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        dir={pageDir}
        className="mx-auto w-full max-w-5xl space-y-6"
      >
        <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
                <FileSignature className="h-4 w-4" />
                {t("collab.proposal.badge")}
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                {t("collab.proposal.title")}
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
                {t("collab.proposal.lead")}
              </p>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 text-sm font-black text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
                {t("collab.proposal.close")}
              </button>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <SectionTitle
            icon={Handshake}
            title={t("collab.proposal.businessesTitle")}
            subtitle={t("collab.proposal.businessesSubtitle")}
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField label={t("collab.proposal.sendingBusiness")}>
              <input value={providerBusinessName} disabled className={inputClass} />
            </FormField>

            <FormField label={t("collab.proposal.receivingBusiness")}>
              <input value={receiverBusinessName} disabled className={inputClass} />
            </FormField>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <SectionTitle
            icon={Sparkles}
            title={t("collab.proposal.proposalTitle")}
            subtitle={t("collab.proposal.proposalSubtitle")}
          />

          <div className="mt-5 grid gap-4">
            <FormField label={t("collab.proposal.proposalName")} required>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t("collab.proposal.proposalNamePlaceholder")}
                className={inputClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.generalDescription")} required>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder={t("collab.proposal.generalDescriptionPlaceholder")}
                className={textareaClass}
              />
            </FormField>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <AgreementSideCard
            title={t("collab.proposal.sideOf", { name: providerBusinessName })}
            subtitle={t("collab.proposal.sideGiving")}
            badge={t("collab.proposal.firstParty")}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label={t("collab.proposal.contact")} required>
                <input
                  name="providerContactName"
                  value={formData.providerContactName}
                  onChange={handleChange}
                  placeholder={t("collab.proposal.contactPlaceholder")}
                  className={inputClass}
                />
              </FormField>

              <FormField label={t("collab.proposal.phone")} required>
                <PhoneField
                  value={formData.providerPhone}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      providerPhone: value,
                    }))
                  }
                />
              </FormField>
            </div>

            <FormField label={t("collab.proposal.serviceName")} required>
              <input
                name="providerServiceName"
                value={formData.providerServiceName}
                onChange={handleChange}
                placeholder={t("collab.proposal.serviceNamePlaceholder")}
                className={inputClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.serviceDetails")} required>
              <textarea
                name="providerServiceDetails"
                value={formData.providerServiceDetails}
                onChange={handleChange}
                rows={4}
                placeholder={t("collab.proposal.serviceDetailsPlaceholder")}
                className={textareaClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.whatGives", { name: providerBusinessName })}>
              <textarea
                name="giving"
                value={formData.giving}
                onChange={handleChange}
                rows={4}
                placeholder={t("collab.proposal.whatGivesPlaceholder")}
                className={textareaClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.included")}>
              <textarea
                name="providerIncludedItems"
                value={formData.providerIncludedItems}
                onChange={handleChange}
                rows={4}
                placeholder={t("collab.proposal.includedPlaceholder")}
                className={textareaClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.deliverables")}>
              <textarea
                name="providerDeliverables"
                value={formData.providerDeliverables}
                onChange={handleChange}
                rows={4}
                placeholder={t("collab.proposal.deliverablesPlaceholder")}
                className={textareaClass}
              />
            </FormField>
          </AgreementSideCard>

          <AgreementSideCard
            title={t("collab.proposal.sideOf", { name: receiverBusinessName })}
            subtitle={t("collab.proposal.receiverSideSubtitle")}
            badge={t("collab.proposal.secondParty")}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label={t("collab.proposal.contact")} required={formData.type !== "One-sided"}>
                <input
                  name="receiverContactName"
                  value={formData.receiverContactName}
                  onChange={handleChange}
                  placeholder={t("collab.proposal.contactPlaceholder")}
                  className={inputClass}
                />
              </FormField>

              <FormField label={t("collab.proposal.phone")}>
                <PhoneField
                  value={formData.receiverPhone}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      receiverPhone: value,
                    }))
                  }
                />
              </FormField>
            </div>

            <FormField label={t("collab.proposal.serviceName")} required={formData.type !== "One-sided"}>
              <input
                name="receiverServiceName"
                value={formData.receiverServiceName}
                onChange={handleChange}
                placeholder={t("collab.proposal.receiverServicePlaceholder")}
                className={inputClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.serviceDetails")}>
              <textarea
                name="receiverServiceDetails"
                value={formData.receiverServiceDetails}
                onChange={handleChange}
                rows={4}
                placeholder={t("collab.proposal.receiverDetailsPlaceholder")}
                className={textareaClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.whatGives", { name: receiverBusinessName })}>
              <textarea
                name="receiving"
                value={formData.receiving}
                onChange={handleChange}
                rows={4}
                placeholder={t("collab.proposal.receiverGivesPlaceholder")}
                className={textareaClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.included")}>
              <textarea
                name="receiverIncludedItems"
                value={formData.receiverIncludedItems}
                onChange={handleChange}
                rows={4}
                placeholder={t("collab.proposal.receiverIncludedPlaceholder")}
                className={textareaClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.deliverables")}>
              <textarea
                name="receiverDeliverables"
                value={formData.receiverDeliverables}
                onChange={handleChange}
                rows={4}
                placeholder={t("collab.proposal.receiverDeliverablesPlaceholder")}
                className={textareaClass}
              />
            </FormField>
          </AgreementSideCard>
        </section>

        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <SectionTitle
            icon={DollarSign}
            title={t("collab.proposal.termsTitle")}
            subtitle={t("collab.proposal.termsSubtitle")}
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField label={t("collab.proposal.collabType")}>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="One-sided">{t("collab.proposal.oneSided")}</option>
                <option value="Two-sided">{t("collab.proposal.twoSided")}</option>
                <option value="With commissions">{t("collab.proposal.withCommissions")}</option>
              </select>
            </FormField>

            <FormField label={t("collab.proposal.amount")}>
              <div className="relative">
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
                  ₪
                </span>

                <input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder={t("collab.proposal.optional")}
                  className={`${inputClass} pr-10`}
                />
              </div>
            </FormField>

            <div className="md:col-span-2">
              <FormField label={t("collab.proposal.paymentDetails")}>
                <textarea
                  name="payment"
                  value={formData.payment}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t("collab.proposal.paymentPlaceholder")}
                  className={textareaClass}
                />
              </FormField>
            </div>

            <FormField label={t("collab.proposal.startDate")}>
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.endDate")}>
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>

            <FormField label={t("collab.proposal.validUntil")} required>
              <input
                name="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>

            <div className="grid gap-3">
              <CheckboxCard
                name="cancelAnytime"
                checked={formData.cancelAnytime}
                onChange={handleChange}
                title={t("collab.proposal.cancelAnytime")}
                subtitle={t("collab.proposal.cancelAnytimeHint")}
              />

              <CheckboxCard
                name="confidentiality"
                checked={formData.confidentiality}
                onChange={handleChange}
                title={t("collab.proposal.confidentiality")}
                subtitle={t("collab.proposal.confidentialityHint")}
              />
            </div>

            <div className="md:col-span-2">
              <FormField label={t("collab.proposal.changeTerms")}>
                <textarea
                  name="changeTerms"
                  value={formData.changeTerms}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t("collab.proposal.changeTermsPlaceholder")}
                  className={textareaClass}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label={t("collab.proposal.cancelTerms")}>
                <textarea
                  name="cancellationTerms"
                  value={formData.cancellationTerms}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t("collab.proposal.cancelTermsPlaceholder")}
                  className={textareaClass}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label={t("collab.proposal.exclusions")}>
                <textarea
                  name="exclusions"
                  value={formData.exclusions}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t("collab.proposal.exclusionsPlaceholder")}
                  className={textareaClass}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label={t("collab.proposal.notes")}>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t("collab.proposal.notesPlaceholder")}
                  className={textareaClass}
                />
              </FormField>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SectionTitle
              icon={PackageCheck}
              title={t("collab.proposal.previewTitle")}
              subtitle={t("collab.proposal.previewSubtitle")}
            />

            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-black"
            >
              <FileSignature className="h-5 w-5" />
              {t("collab.proposal.viewPreview")}
            </button>
          </div>
        </section>

        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-[2rem] border border-slate-100 bg-white/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black text-slate-800">
                {t("collab.proposal.readyToSend")}
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {t("collab.proposal.willSendTo", { name: receiverBusinessName })}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-6 text-sm font-black text-slate-800 shadow-[0_14px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <BizuplyLoader size="sm" compact />
            ) : (
              <Send className="h-5 w-5" />
            )}
            {loading ? t("collab.proposal.sending") : t("collab.proposal.sendProposal")}
          </button>
        </div>
      </form>

      {showPreviewModal && (
        <ProposalPreviewModal
          providerBusinessName={providerBusinessName}
          receiverBusinessName={receiverBusinessName}
          formData={formData}
          previewGiving={previewGiving}
          previewReceiving={previewReceiving}
          onClose={() => setShowPreviewModal(false)}
        />
      )}

      {toast.open && (
        <div className="fixed bottom-6 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
          <div
            dir={pageDir}
            className={[
              "flex items-start gap-3 rounded-2xl border px-4 py-3 text-right shadow-2xl",
              toast.severity === "success"
                ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                : "border-rose-100 bg-rose-50 text-rose-800",
            ].join(" ")}
          >
            {toast.severity === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}

            <p className="text-sm font-black leading-6">{toast.message}</p>

            <button
              type="button"
              onClick={() => setToast((prev) => ({ ...prev, open: false }))}
              className="mr-auto rounded-full p-1 transition hover:bg-white/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-xl font-black text-slate-800">{title}</h3>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <p className="mb-2 text-sm font-black text-slate-800">
        {label}
        {required && <span className="mr-1 text-rose-500">*</span>}
      </p>

      {children}
    </label>
  );
}

function AgreementSideCard({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-black text-slate-800">{title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
            {subtitle}
          </p>
        </div>

        <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700 ring-1 ring-violet-100">
          {badge}
        </span>
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function CheckboxCard({
  name,
  checked,
  onChange,
  title,
  subtitle,
}: {
  name: keyof ProposalFormData;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  subtitle: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-sky-50/60">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5 rounded border-slate-300 text-violet-700 focus:ring-violet-500"
      />

      <span>
        <span className="block text-sm font-black text-slate-900">{title}</span>
        <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
          {subtitle}
        </span>
      </span>
    </label>
  );
}

function ProposalPreviewModal({
  providerBusinessName,
  receiverBusinessName,
  formData,
  previewGiving,
  previewReceiving,
  onClose,
}: {
  providerBusinessName: string;
  receiverBusinessName: string;
  formData: ProposalFormData;
  previewGiving: string[];
  previewReceiving: string[];
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const intlLocale = getIntlLocale(i18n.language);
  const formatPreviewDate = (value: string) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString(intlLocale);
  };

  const agreementTypeText: Record<ProposalFormData["type"], string> = {
    "One-sided": t("collab.proposal.oneSided"),
    "Two-sided": t("collab.proposal.twoSided"),
    "With commissions": t("collab.proposal.withCommissions"),
  };

  const previewAmount = formData.amount ? `₪${Number(formData.amount).toLocaleString(intlLocale)}` : "—";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/60 p-4 backdrop-blur-sm">
      <div
        dir={pageDir}
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 sm:p-7">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
              <FileSignature className="h-4 w-4" />
              {t("collab.proposal.previewBadge")}
            </div>

            <h3 className="mt-4 text-2xl font-black text-slate-800">
              {t("collab.proposal.previewHeading")}
            </h3>

            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              {t("collab.proposal.previewLead")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-140px)] overflow-y-auto p-5 sm:p-7">
          <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-5">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <h4 className="text-xl font-black text-slate-800">
                {t("collab.proposal.agreementDetails")}
              </h4>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {formData.title || t("collab.proposal.untitled")}
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <PreviewInfo label={t("collab.proposal.sendingBusiness")} value={providerBusinessName} />
                <PreviewInfo label={t("collab.proposal.receivingBusiness")} value={receiverBusinessName} />
                <PreviewInfo label={t("collab.proposal.senderContact")} value={formData.providerContactName || "—"} />
                <PreviewInfo label={t("collab.proposal.senderPhone")} value={formData.providerPhone || "—"} />
                <PreviewInfo label={t("collab.proposal.receiverContact")} value={formData.receiverContactName || "—"} />
                <PreviewInfo label={t("collab.proposal.receiverPhone")} value={formData.receiverPhone || "—"} />
                <PreviewInfo label={t("collab.proposal.collabType")} value={agreementTypeText[formData.type]} />
                <PreviewInfo label={t("collab.proposal.amount")} value={previewAmount} />
                <PreviewInfo label={t("collab.proposal.startDate")} value={formatPreviewDate(formData.startDate)} />
                <PreviewInfo label={t("collab.proposal.endDate")} value={formatPreviewDate(formData.endDate)} />
                <PreviewInfo label={t("collab.proposal.validUntil")} value={formatPreviewDate(formData.validUntil)} />
                <PreviewInfo label={t("collab.proposal.cancelAnytime")} value={formData.cancelAnytime ? t("collab.proposal.yes") : t("collab.proposal.no")} />
                <PreviewInfo label={t("collab.proposal.confidentiality")} value={formData.confidentiality ? t("collab.proposal.yes") : t("collab.proposal.no")} />
              </div>

              <PreviewTextBlock
                title={t("collab.proposal.generalDescription")}
                value={formData.description || "—"}
              />

              <PreviewTextBlock
                title={t("collab.proposal.serviceDetailsOf", { name: providerBusinessName })}
                value={formData.providerServiceDetails || "—"}
              />

              <PreviewListBlock
                title={t("collab.proposal.whatGivesOf", { name: providerBusinessName })}
                items={previewGiving}
                emptyText={t("collab.proposal.emptyItems")}
              />

              <PreviewListBlock
                title={t("collab.proposal.includedOf", { name: providerBusinessName })}
                items={splitLines(formData.providerIncludedItems)}
                emptyText={t("collab.proposal.emptyItems")}
              />

              <PreviewListBlock
                title={t("collab.proposal.deliverablesOf", { name: providerBusinessName })}
                items={splitLines(formData.providerDeliverables)}
                emptyText={t("collab.proposal.emptyItems")}
              />

              <PreviewTextBlock
                title={t("collab.proposal.serviceDetailsOf", { name: receiverBusinessName })}
                value={formData.receiverServiceDetails || "—"}
              />

              <PreviewListBlock
                title={t("collab.proposal.whatGivesOf", { name: receiverBusinessName })}
                items={previewReceiving}
                emptyText={t("collab.proposal.emptyItems")}
              />

              <PreviewListBlock
                title={t("collab.proposal.includedOf", { name: receiverBusinessName })}
                items={splitLines(formData.receiverIncludedItems)}
                emptyText={t("collab.proposal.emptyItems")}
              />

              <PreviewListBlock
                title={t("collab.proposal.deliverablesOf", { name: receiverBusinessName })}
                items={splitLines(formData.receiverDeliverables)}
                emptyText={t("collab.proposal.emptyItems")}
              />

              <PreviewTextBlock
                title={t("collab.proposal.paymentDetails")}
                value={formData.payment || "—"}
              />

              <PreviewTextBlock
                title={t("collab.proposal.changeTerms")}
                value={formData.changeTerms || "—"}
              />

              <PreviewTextBlock
                title={t("collab.proposal.cancelTerms")}
                value={formData.cancellationTerms || "—"}
              />

              <PreviewListBlock
                title={t("collab.proposal.exclusions")}
                items={splitLines(formData.exclusions)}
                emptyText={t("collab.proposal.noExclusions")}
              />

              <PreviewTextBlock
                title={t("collab.proposal.notes")}
                value={formData.notes || "—"}
              />

              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">{t("collab.proposal.signatures")}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {t("collab.proposal.signaturesHint")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-white p-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:bg-black"
          >
            {t("collab.proposal.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-slate-800">{value}</p>
    </div>
  );
}

function PreviewTextBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-800">{title}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-7 text-slate-600">
        {value}
      </p>
    </div>
  );
}

function PreviewListBlock({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-800">{title}</p>

      {items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${title}-${item}-${index}`}
              className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm font-semibold text-slate-400">{emptyText}</p>
      )}
    </div>
  );
}

function PhoneField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div dir="ltr" className="w-full text-left">
      <PhoneInput
        country="il"
        value={value}
        onChange={onChange}
        inputProps={{
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
  );
}

function splitLines(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
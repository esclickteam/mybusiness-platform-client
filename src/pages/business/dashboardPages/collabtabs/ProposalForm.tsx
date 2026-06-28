import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  FileSignature,
  Handshake,
  Loader2,
  PackageCheck,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import API from "../../../../api";

type BusinessTarget = {
  _id?: string;
  businessName?: string;
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

  contactName: string;
  phone: string;

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

  contactName: "",
  phone: "",

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

export default function ProposalForm({
  fromBusinessName,
  toBusiness,
  onClose,
  onSent,
}: ProposalFormProps) {
  const [formData, setFormData] = useState<ProposalFormData>({
    ...initialFormData,
    toBusinessId: toBusiness?._id || null,
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (toBusiness?._id) {
      setFormData((prev) => ({
        ...prev,
        toBusinessId: toBusiness._id || null,
      }));
    }
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
      !formData.contactName.trim() ||
      !formData.phone
    ) {
      return "Please fill in all required fields.";
    }

    if (!formData.providerServiceName.trim()) {
      return "Please fill the service / product name for your side.";
    }

    if (!formData.providerServiceDetails.trim()) {
      return "Please fill the service / product details for your side.";
    }

    if (formData.type !== "One-sided" && !formData.receiverServiceName.trim()) {
      return "Please fill the service / product name for the other side.";
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

      contactName: formData.contactName.trim(),
      phone: formData.phone,

      agreementDetails: {
        provider: {
          businessName: fromBusinessName || "",
          serviceName: formData.providerServiceName.trim(),
          serviceDetails: formData.providerServiceDetails.trim(),
          includedItems: splitLines(formData.providerIncludedItems),
          deliverables: splitLines(formData.providerDeliverables),
        },

        receiver: {
          businessName: toBusiness?.businessName || "Public Market",
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
          message: "Proposal sent successfully",
        });

        onSent?.(proposalId);
      } else {
        setToast({
          open: true,
          severity: "error",
          message: "Sending failed. Please try again.",
        });
      }
    } catch (err: any) {
      setToast({
        open: true,
        severity: "error",
        message: err?.response?.data?.error || "Error sending proposal. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
                <FileSignature className="h-4 w-4" />
                Business Agreement Builder
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Business-to-Business Proposal
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
                Create a clear collaboration proposal with services, included
                items, payment terms, change policy and cancellation terms.
              </p>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 text-sm font-black text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
                Close
              </button>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <SectionTitle
            icon={Handshake}
            title="Businesses"
            subtitle="The proposal sender and the business receiving it."
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField label="From">
              <input value={fromBusinessName || ""} disabled className={inputClass} />
            </FormField>

            <FormField label="To">
              <input
                value={toBusiness?.businessName || "Public Market"}
                disabled
                className={inputClass}
              />
            </FormField>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <SectionTitle
            icon={Sparkles}
            title="Proposal Details"
            subtitle="Basic details that explain the collaboration."
          />

          <div className="mt-5 grid gap-4">
            <FormField label="Proposal Title" required>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Monthly marketing collaboration"
                className={inputClass}
              />
            </FormField>

            <FormField label="Description" required>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the collaboration in a clear and professional way..."
                className={textareaClass}
              />
            </FormField>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <AgreementSideCard
            title="Your Side"
            subtitle="What your business provides in this collaboration."
            badge="Provider"
          >
            <FormField label="Service / Product Name" required>
              <input
                name="providerServiceName"
                value={formData.providerServiceName}
                onChange={handleChange}
                placeholder="Example: Lead management service"
                className={inputClass}
              />
            </FormField>

            <FormField label="Service / Product Details" required>
              <textarea
                name="providerServiceDetails"
                value={formData.providerServiceDetails}
                onChange={handleChange}
                rows={4}
                placeholder="Explain exactly what this service or product includes..."
                className={textareaClass}
              />
            </FormField>

            <FormField label="What You Will Provide">
              <textarea
                name="giving"
                value={formData.giving}
                onChange={handleChange}
                rows={4}
                placeholder={"One item per line\nExample: 10 qualified leads per month"}
                className={textareaClass}
              />
            </FormField>

            <FormField label="Included Items / Scope">
              <textarea
                name="providerIncludedItems"
                value={formData.providerIncludedItems}
                onChange={handleChange}
                rows={4}
                placeholder={"One item per line\nExample: Daily CRM follow-up"}
                className={textareaClass}
              />
            </FormField>

            <FormField label="Deliverables / Outputs">
              <textarea
                name="providerDeliverables"
                value={formData.providerDeliverables}
                onChange={handleChange}
                rows={4}
                placeholder={"One item per line\nExample: Monthly performance report"}
                className={textareaClass}
              />
            </FormField>
          </AgreementSideCard>

          <AgreementSideCard
            title="Other Side"
            subtitle="What the other business provides or commits to."
            badge="Receiver"
          >
            <FormField label="Service / Product Name">
              <input
                name="receiverServiceName"
                value={formData.receiverServiceName}
                onChange={handleChange}
                placeholder="Example: Event production package"
                className={inputClass}
              />
            </FormField>

            <FormField label="Service / Product Details">
              <textarea
                name="receiverServiceDetails"
                value={formData.receiverServiceDetails}
                onChange={handleChange}
                rows={4}
                placeholder="Explain what the other side provides..."
                className={textareaClass}
              />
            </FormField>

            <FormField label="What You Will Receive">
              <textarea
                name="receiving"
                value={formData.receiving}
                onChange={handleChange}
                rows={4}
                placeholder={"One item per line\nExample: Commission for every closed deal"}
                className={textareaClass}
              />
            </FormField>

            <FormField label="Included Items / Scope">
              <textarea
                name="receiverIncludedItems"
                value={formData.receiverIncludedItems}
                onChange={handleChange}
                rows={4}
                placeholder={"One item per line\nExample: Access to client list"}
                className={textareaClass}
              />
            </FormField>

            <FormField label="Deliverables / Outputs">
              <textarea
                name="receiverDeliverables"
                value={formData.receiverDeliverables}
                onChange={handleChange}
                rows={4}
                placeholder={"One item per line\nExample: Signed referral report"}
                className={textareaClass}
              />
            </FormField>
          </AgreementSideCard>
        </section>

        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <SectionTitle
            icon={DollarSign}
            title="Terms & Payment"
            subtitle="Define payment, dates, changes, cancellation and confidentiality."
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField label="Collaboration Type">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="One-sided">One-sided</option>
                <option value="Two-sided">Two-sided</option>
                <option value="With commissions">With commissions</option>
              </select>
            </FormField>

            <FormField label="Amount">
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Payment / Commission Details">
                <textarea
                  name="payment"
                  value={formData.payment}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Example: 10% commission for every closed client, paid monthly."
                  className={textareaClass}
                />
              </FormField>
            </div>

            <FormField label="Start Date">
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>

            <FormField label="End Date">
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>

            <FormField label="Valid Until" required>
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
                title="Cancelable Anytime"
                subtitle="Allow either side to cancel according to the written terms."
              />

              <CheckboxCard
                name="confidentiality"
                checked={formData.confidentiality}
                onChange={handleChange}
                title="Include Confidentiality Clause"
                subtitle="Mark this proposal as including confidentiality terms."
              />
            </div>

            <div className="md:col-span-2">
              <FormField label="Change Terms">
                <textarea
                  name="changeTerms"
                  value={formData.changeTerms}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Example: Any change to scope, price or schedule must be approved in writing by both parties."
                  className={textareaClass}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Cancellation Terms">
                <textarea
                  name="cancellationTerms"
                  value={formData.cancellationTerms}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Example: Either party may cancel with 14 days written notice. Payments for completed work are non-refundable."
                  className={textareaClass}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Exclusions / Not Included">
                <textarea
                  name="exclusions"
                  value={formData.exclusions}
                  onChange={handleChange}
                  rows={4}
                  placeholder={"One item per line\nExample: Paid ads budget is not included"}
                  className={textareaClass}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Additional Notes">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any additional agreement notes..."
                  className={textareaClass}
                />
              </FormField>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <SectionTitle
            icon={Phone}
            title="Contact Details"
            subtitle="The person responsible for this proposal."
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField label="Contact Person" required>
              <input
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Contact person"
                className={inputClass}
              />
            </FormField>

            <FormField label="Phone" required>
              <PhoneInput
                country="us"
                value={formData.phone}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone: value,
                  }))
                }
                inputProps={{
                  required: true,
                  name: "phone",
                }}
                containerClass="!w-full"
                inputClass="!w-full !h-[48px] !rounded-2xl !border !border-slate-200 !bg-slate-50 !pl-14 !text-sm !font-semibold !text-slate-900 !outline-none focus:!border-violet-300 focus:!bg-white"
                buttonClass="!rounded-l-2xl !border-slate-200 !bg-white"
              />
            </FormField>
          </div>
        </section>

        <section className="rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <SectionTitle
            icon={PackageCheck}
            title="Agreement Preview"
            subtitle="Quick preview of the agreement structure before sending."
          />

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <PreviewBlock
              title="Your Side Provides"
              items={previewGiving}
              emptyText="No provided items yet."
            />

            <PreviewBlock
              title="You Receive"
              items={previewReceiving}
              emptyText="No receiving items yet."
            />
          </div>
        </section>

        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-[2rem] border border-slate-100 bg-white/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black text-slate-950">
                Ready to send proposal
              </p>
              <p className="text-xs font-semibold text-slate-500">
                It will be sent to {toBusiness?.businessName || "Public Market"}.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            {loading ? "Sending..." : "Send Proposal"}
          </button>
        </div>
      </form>

      {toast.open && (
        <div className="fixed bottom-6 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
          <div
            className={[
              "flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl",
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
              className="ml-auto rounded-full p-1 transition hover:bg-white/60"
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
        <h3 className="text-xl font-black text-slate-950">{title}</h3>
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
        {required && <span className="ml-1 text-rose-500">*</span>}
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
          <h3 className="text-xl font-black text-slate-950">{title}</h3>
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

function PreviewBlock({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-black text-slate-950">{title}</p>

      {items.length ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={`${title}-${item}-${index}`}
              className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm font-semibold text-slate-400">{emptyText}</p>
      )}
    </div>
  );
}

function splitLines(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
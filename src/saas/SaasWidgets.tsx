import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import logo from "../images/logo_final.svg";
import {
  EXAMPLE_PLANS,
  REVENUE_DISCLAIMER,
  formatIls,
  formatUsd,
  illustrativeMrr,
  whatsappHref,
  type SaasProduct,
  type SaasQuote,
} from "./logic";
import { startSaasCheckout, submitSaasLead } from "./api";

export function SaasSeo({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const ensure = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    ensure("robots", "noindex, follow");
    ensure("googlebot", "noindex, follow");
  }, []);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, follow" />
      <meta name="googlebot" content="noindex, follow" />
    </Helmet>
  );
}

export function SaasHeader({
  actionHref = "/saas#platforms",
  actionLabel = "Browse platforms",
}: {
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="inline-flex items-center" aria-label="Bizuply home">
          <img src={logo} alt="Bizuply" className="h-9 w-auto" />
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <a href={actionHref} className="hidden rounded-full px-3 py-2 hover:bg-slate-100 sm:inline">
            {actionLabel}
          </a>
          <a href="/saas#how-it-works" className="rounded-full px-3 py-2 hover:bg-slate-100">
            How it works
          </a>
        </nav>
      </div>
    </header>
  );
}

const btnPrimary =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#5B4DFF] to-[#7C4DFF] px-5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(91,77,255,0.28)] transition hover:brightness-110";
const btnGhost =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 transition hover:border-[#c4b5fd] hover:bg-slate-50";

export function PrimaryButton({
  children,
  onClick,
  href,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
}) {
  if (href) {
    const external = /^https?:/i.test(href);
    if (external) {
      return (
        <a className={btnPrimary} href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <a className={btnPrimary} href={href}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={btnPrimary} onClick={onClick}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  href,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  if (href) {
    const external = /^https?:/i.test(href);
    if (external) {
      return (
        <a className={btnGhost} href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <a className={btnGhost} href={href}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={btnGhost} onClick={onClick}>
      {children}
    </button>
  );
}

export function RequestInfoModal({
  product,
  open,
  onClose,
}: {
  product: SaasProduct;
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  if (!open) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    try {
      await submitSaasLead({
        slug: product.slug,
        ...form,
        pageUrl: window.location.href,
      });
      setStatus("sent");
    } catch (err: any) {
      setStatus("error");
      setError(err?.response?.data?.error || "We could not send your request. Try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 p-0 sm:place-items-center sm:p-6" role="presentation" onClick={onClose}>
      <form
        role="dialog"
        aria-labelledby="saas-lead-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
        className="max-h-[92vh] w-full overflow-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6D4AFF]">Request information</p>
        <h2 id="saas-lead-title" className="mt-2 text-2xl font-black text-slate-950">
          {product.name}
        </h2>
        <p className="mt-1 text-sm text-slate-500">Tell us how to reach you. This request is saved in the Bizuply CRM.</p>
        {status === "sent" ? (
          <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-800">
            Thanks. We received your request about {product.name}.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {[
              ["name", "Name"],
              ["email", "Email"],
              ["phone", "Phone / WhatsApp"],
              ["country", "Country"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm font-semibold text-slate-700">
                {label}
                <input
                  required
                  name={key}
                  type={key === "email" ? "email" : "text"}
                  value={(form as any)[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3 text-base font-medium outline-none focus:border-[#7C4DFF]"
                />
              </label>
            ))}
            <label className="block text-sm font-semibold text-slate-700">
              Platform interested in
              <input
                readOnly
                value={product.name}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 font-semibold"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                rows={4}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3 text-base font-medium outline-none focus:border-[#7C4DFF]"
              />
            </label>
            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
            <div className="flex gap-2 pt-2">
              <button type="submit" className={`${btnPrimary} flex-1`} disabled={status === "saving"}>
                {status === "saving" ? "Sending…" : "Send request"}
              </button>
              <button type="button" className={btnGhost} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
        {status === "sent" ? (
          <button type="button" className={`${btnGhost} mt-4 w-full`} onClick={onClose}>
            Close
          </button>
        ) : null}
      </form>
    </div>
  );
}

export function CheckoutModal({
  product,
  open,
  onClose,
}: {
  product: SaasProduct;
  open: boolean;
  onClose: () => void;
}) {
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const quote: SaasQuote | undefined = product.quotes?.[paymentType];

  if (!open) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await startSaasCheckout({
        slug: product.slug,
        paymentType,
        email,
        name,
      });
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      setError("Checkout did not return a payment link.");
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Checkout is temporarily unavailable. Request information and we will send payment details."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 sm:place-items-center sm:p-6" onClick={onClose}>
      <form
        role="dialog"
        aria-labelledby="saas-buy-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
        className="w-full rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6D4AFF]">Buy now</p>
        <h2 id="saas-buy-title" className="mt-2 text-2xl font-black">{product.name}</h2>
        <p className="mt-1 text-sm text-slate-500">
          Secure checkout uses Bizuply billing. The card is charged in ILS.
        </p>
        <div className="mt-5 grid gap-3">
          {(["full", "deposit"] as const).map((type) => {
            const row = product.quotes?.[type];
            const selected = paymentType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setPaymentType(type)}
                className={`rounded-2xl border px-4 py-4 text-left ${
                  selected ? "border-[#7C4DFF] bg-[#f6f3ff]" : "border-slate-200"
                }`}
              >
                <span className="block text-sm font-black text-slate-900">
                  {type === "full" ? "Full payment" : "50% deposit"}
                </span>
                <span className="mt-1 block text-sm font-semibold text-slate-600">
                  {formatUsd(row?.amountUsd || (type === "deposit" ? product.priceUsd / 2 : product.priceUsd))}
                  {row ? ` · charged as ${formatIls(row.amountIls)}` : ""}
                </span>
              </button>
            );
          })}
        </div>
        <label className="mt-4 block text-sm font-semibold text-slate-700">
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3" />
        </label>
        <label className="mt-3 block text-sm font-semibold text-slate-700">
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3" />
        </label>
        {quote ? (
          <p className="mt-3 text-xs font-medium text-slate-500">
            Rate used for this checkout: 1 USD = {quote.usdToIlsRate} ILS.
          </p>
        ) : null}
        {error ? <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p> : null}
        <div className="mt-5 flex gap-2">
          <button className={`${btnPrimary} flex-1`} disabled={busy || !product.purchasable} type="submit">
            {busy ? "Opening checkout…" : "Continue to payment"}
          </button>
          <button type="button" className={btnGhost} onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export function WhatsAppButton({
  e164,
  message,
  className = "",
}: {
  e164: string;
  message: string;
  className?: string;
}) {
  const href = whatsappHref(e164, message);
  if (!href) {
    return (
      <button type="button" disabled className={`${btnGhost} cursor-not-allowed opacity-60 ${className}`}>
        Chat on WhatsApp
      </button>
    );
  }
  return (
    <a
      className={`${btnGhost} ${className}`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      Chat on WhatsApp
    </a>
  );
}

export function IncludedSection({ items }: { items: string[] }) {
  const list = items.length
    ? items
    : [
        "Fully developed SaaS platform",
        "Multi-tenant architecture",
        "White-label branding",
        "Source code included",
        "Super Admin",
        "Customer dashboard",
        "Subscription management",
        "Role & permission system",
        "Responsive mobile UI",
        "Documentation",
        "Installation assistance",
        "Video tutorials",
        "Initial technical support",
      ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Everything You Need to Launch</h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {list.map((item) => (
          <li key={item} className="flex items-start gap-3 rounded-2xl border border-white bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            <span className="mt-0.5 text-[#6D4AFF]">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BuildVsBuy() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Why Build From Scratch?</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black">Custom Development</h3>
          <ul className="mt-4 space-y-2 text-sm font-semibold text-slate-600">
            <li>$30,000-$80,000+</li>
            <li>4-12 months</li>
            <li>Development risk</li>
            <li>Testing required</li>
            <li>Requires project management</li>
          </ul>
        </article>
        <article className="rounded-3xl bg-gradient-to-br from-[#5B4DFF] to-[#312e81] p-6 text-white shadow-xl">
          <h3 className="text-lg font-black">Bizuply Ready-to-Launch SaaS</h3>
          <ul className="mt-4 space-y-2 text-sm font-semibold text-white/90">
            <li>From $8,900</li>
            <li>Ready immediately</li>
            <li>Already developed</li>
            <li>Tested platform</li>
            <li>White-label ready</li>
            <li>Source code included</li>
          </ul>
        </article>
      </div>
      <p className="mt-6 text-xl font-black text-slate-900">Skip the development. Start selling.</p>
    </section>
  );
}

export function BusinessModel() {
  const [customers, setCustomers] = useState(50);
  const [planId, setPlanId] = useState<(typeof EXAMPLE_PLANS)[number]["id"] | "enterprise">("professional");
  const [customPrice, setCustomPrice] = useState(299);
  const monthly = useMemo(() => {
    if (planId === "enterprise") return customPrice;
    return EXAMPLE_PLANS.find((plan) => plan.id === planId)?.price || 99;
  }, [planId, customPrice]);
  const mrr = illustrativeMrr(customers, monthly);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Build Your Own SaaS Business</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
        You choose the subscription prices and sell the platform to businesses. The examples below show how monthly recurring revenue would be calculated from your own pricing. They describe a model you can run. They are not results of this platform.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {EXAMPLE_PLANS.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
            <p className="text-sm font-black">{plan.name}</p>
            <p className="mt-1 text-lg font-black text-[#5B4DFF]">{formatUsd(plan.price)}/month</p>
          </div>
        ))}
        <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
          <p className="text-sm font-black">Enterprise</p>
          <p className="mt-1 text-lg font-black text-[#5B4DFF]">Custom</p>
        </div>
      </div>
      <div className="mt-6 rounded-3xl border border-white bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setPlanId(plan.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                planId === plan.id ? "bg-[#5B4DFF] text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {plan.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPlanId("enterprise")}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              planId === "enterprise" ? "bg-[#5B4DFF] text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            Enterprise
          </button>
        </div>
        <label className="mt-5 block text-sm font-bold text-slate-700">
          Customers: {customers}
          <input
            type="range"
            min={10}
            max={200}
            value={customers}
            onChange={(event) => setCustomers(Number(event.target.value))}
            className="mt-2 w-full accent-[#5B4DFF]"
          />
        </label>
        {planId === "enterprise" ? (
          <label className="mt-4 block text-sm font-bold text-slate-700">
            Custom monthly price
            <input
              type="number"
              min={0}
              value={customPrice}
              onChange={(event) => setCustomPrice(Number(event.target.value))}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3"
            />
          </label>
        ) : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => { setCustomers(50); setPlanId("professional"); }} className="rounded-2xl bg-slate-50 px-4 py-4 text-left">
            <p className="text-sm font-semibold text-slate-500">50 customers × $99/month</p>
            <p className="text-2xl font-black">{formatUsd(illustrativeMrr(50, 99))} MRR</p>
          </button>
          <button type="button" onClick={() => { setCustomers(100); setPlanId("professional"); }} className="rounded-2xl bg-slate-50 px-4 py-4 text-left">
            <p className="text-sm font-semibold text-slate-500">100 customers × $99/month</p>
            <p className="text-2xl font-black">{formatUsd(illustrativeMrr(100, 99))} MRR</p>
          </button>
        </div>
        <p className="mt-5 text-sm font-semibold text-slate-500">
          {customers} customers × {formatUsd(monthly)}/month
        </p>
        <p className="text-4xl font-black tracking-tight text-slate-950">{formatUsd(mrr)} MRR</p>
        <p className="mt-4 text-xs font-medium leading-5 text-slate-500">{REVENUE_DISCLAIMER}</p>
      </div>
    </section>
  );
}

export function OwnershipSection() {
  const items = [
    "Your logo",
    "Your colors",
    "Your domain",
    "Your pricing",
    "Your customers",
    "Your payment gateway",
    "Your database",
    "Source code",
    "Full control",
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:px-6">
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Your Platform. Your Brand.</h2>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white bg-white px-4 py-5 text-sm font-bold text-slate-800 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export function SaasFooter() {
  return (
    <footer className="border-t border-slate-200/80 px-4 py-8 text-center text-xs font-semibold text-slate-400">
      Bizuply · Ready-to-launch SaaS platforms
    </footer>
  );
}

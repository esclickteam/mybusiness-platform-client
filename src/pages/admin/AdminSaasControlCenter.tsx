import { useEffect, useState, type FormEvent } from "react";
import API from "../../api";
import { MARKETPLACE_CATEGORIES } from "../../saas/logic";
import AdminHeader from "./AdminsHeader";
import { ADMIN_PAGE_SHELL_CLASS } from "../../utils/adminResponsive";

type TemplateDraft = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  screenshotUrl: string;
  interactiveDemoEnabled: boolean;
  supportsAdminDemo: boolean;
  supportsCustomerDemo: boolean;
  demoSelectorUrl: string;
  adminDemoUrl: string;
  customerDemoUrl: string;
  whiteLabel: boolean;
  partnerModel: boolean;
  exclusiveCountry: boolean;
  features: string;
  whatsappBlurb: string;
  status: string;
  sortOrder: number;
};

const EMPTY: TemplateDraft = {
  id: "",
  name: "",
  slug: "",
  category: "other",
  description: "",
  screenshotUrl: "",
  interactiveDemoEnabled: false,
  supportsAdminDemo: false,
  supportsCustomerDemo: false,
  demoSelectorUrl: "",
  adminDemoUrl: "",
  customerDemoUrl: "",
  whiteLabel: true,
  partnerModel: true,
  exclusiveCountry: true,
  features: "",
  whatsappBlurb: "",
  status: "DRAFT",
  sortOrder: 100,
};

function fromApi(row: Partial<TemplateDraft> & { features?: string[] | string }): TemplateDraft {
  return {
    ...EMPTY,
    ...row,
    features: Array.isArray(row.features) ? row.features.join("\n") : row.features || "",
    status: row.status || "DRAFT",
  };
}

export default function AdminSaasControlCenter() {
  const [rows, setRows] = useState<TemplateDraft[]>([]);
  const [draft, setDraft] = useState<TemplateDraft>(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await API.get("/admin/saas-templates");
    setRows((data.templates || []).map((row: TemplateDraft & { features?: string[] }) => fromApi(row)));
  }

  useEffect(() => {
    load().catch(() => setError("לא הצלחנו לטעון את התבניות"));
  }, []);

  function set<K extends keyof TemplateDraft>(key: K, value: TemplateDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const body = {
      ...draft,
      features: draft.features.split("\n").map((line) => line.trim()).filter(Boolean),
    };
    try {
      if (draft.id) await API.patch(`/admin/saas-templates/${draft.id}`, body);
      else await API.post("/admin/saas-templates", body);
      setDraft(EMPTY);
      await load();
    } catch {
      setError("השמירה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id: string, status: string) {
    setError("");
    try {
      await API.post(`/admin/saas-templates/${id}/status`, { status });
      await load();
    } catch {
      setError("עדכון הסטטוס נכשל");
    }
  }

  return (
    <div className={ADMIN_PAGE_SHELL_CLASS} dir="rtl">
      <AdminHeader />
      <main className="mx-auto grid max-w-[1480px] gap-6 px-3 py-6 sm:px-6 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="text-xs font-black text-[#7C4DFF]">Admin</p>
          <h1 className="text-2xl font-black text-purple-950">SaaS Control Center</h1>
          <p className="mt-1 max-w-2xl font-bold text-slate-500">
            תבניות עם סטטוס ACTIVE מופיעות אוטומטית ב־/saas. המסך הזה נשאר באדמין.
          </p>
          {error ? <p className="mt-3 font-bold text-rose-600">{error}</p> : null}
          <div className="mt-4 grid gap-3">
            {rows.map((row) => (
              <article key={row.id || row.slug} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-purple-950">{row.name}</h2>
                    <p className="text-sm font-bold text-slate-500">
                      {row.category} · {row.status} · /saas/{row.slug}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-600">{row.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black" onClick={() => setDraft(row)}>
                      עריכה
                    </button>
                    {row.status !== "ACTIVE" ? (
                      <button type="button" className="rounded-full bg-[#24124d] px-3 py-2 text-xs font-black text-white" onClick={() => setStatus(row.id, "ACTIVE")}>
                        ACTIVE
                      </button>
                    ) : (
                      <button type="button" className="rounded-full bg-white px-3 py-2 text-xs font-black ring-1 ring-slate-200" onClick={() => setStatus(row.id, "DRAFT")}>
                        DRAFT
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <form onSubmit={onSubmit} className="h-fit rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-black">{draft.id ? "עריכת תבנית" : "תבנית חדשה"}</h2>
          <label className="mt-3 block text-sm font-bold">
            Name
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.name} onChange={(event) => set("name", event.target.value)} required />
          </label>
          <label className="mt-3 block text-sm font-bold">
            Slug
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.slug} onChange={(event) => set("slug", event.target.value)} />
          </label>
          <label className="mt-3 block text-sm font-bold">
            Category
            <select className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.category} onChange={(event) => set("category", event.target.value)}>
              {MARKETPLACE_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-sm font-bold">
            Description
            <textarea className="mt-1 min-h-24 w-full rounded-2xl border px-3 py-2" value={draft.description} onChange={(event) => set("description", event.target.value)} />
          </label>
          <label className="mt-3 block text-sm font-bold">
            Screenshot URL
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.screenshotUrl} onChange={(event) => set("screenshotUrl", event.target.value)} />
          </label>
          <label className="mt-3 block text-sm font-bold">
            Admin demo URL
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.adminDemoUrl} onChange={(event) => set("adminDemoUrl", event.target.value)} />
          </label>
          <label className="mt-3 block text-sm font-bold">
            Customer demo URL
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.customerDemoUrl} onChange={(event) => set("customerDemoUrl", event.target.value)} />
          </label>
          <label className="mt-3 block text-sm font-bold">
            Explore full demo URL
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.demoSelectorUrl} onChange={(event) => set("demoSelectorUrl", event.target.value)} />
          </label>
          <div className="mt-3 grid gap-2 text-sm font-bold">
            <Check label="Interactive Demo" checked={draft.interactiveDemoEnabled} onChange={(value) => set("interactiveDemoEnabled", value)} />
            <Check label="Admin / Owner Demo" checked={draft.supportsAdminDemo} onChange={(value) => set("supportsAdminDemo", value)} />
            <Check label="Customer Demo" checked={draft.supportsCustomerDemo} onChange={(value) => set("supportsCustomerDemo", value)} />
            <Check label="White Label" checked={draft.whiteLabel} onChange={(value) => set("whiteLabel", value)} />
            <Check label="Partner Model" checked={draft.partnerModel} onChange={(value) => set("partnerModel", value)} />
            <Check label="Exclusive Country" checked={draft.exclusiveCountry} onChange={(value) => set("exclusiveCountry", value)} />
          </div>
          <label className="mt-3 block text-sm font-bold">
            Status
            <select className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.status} onChange={(event) => set("status", event.target.value)}>
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </label>
          <button type="submit" disabled={busy} className="mt-4 w-full rounded-full bg-[#24124d] px-4 py-3 text-sm font-black text-white">
            {busy ? "שומר…" : "שמירה"}
          </button>
          {draft.id ? (
            <button type="button" className="mt-2 w-full rounded-full bg-slate-100 px-4 py-3 text-sm font-black" onClick={() => setDraft(EMPTY)}>
              תבנית חדשה
            </button>
          ) : null}
        </form>
      </main>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

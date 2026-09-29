import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import { MARKETPLACE_CATEGORIES } from "../../saas/logic";
import AdminHeader from "./AdminsHeader";
import { ADMIN_PAGE_SHELL_CLASS } from "../../utils/adminResponsive";

type ShotDraft = {
  key: string;
  label: string;
  caption: string;
  imageUrl: string;
  audience: string;
  tab: string;
  gallery: string;
};

type TemplateDraft = {
  id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  description: string;
  coverImage: string;
  cardScreenshot: string;
  screenshotUrl: string;
  screenshots: ShotDraft[];
  mobileScreenshots: ShotDraft[];
  promoVideoUrl: string;
  promoVideoPosterUrl: string;
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

const EMPTY_SHOT: ShotDraft = {
  key: "",
  label: "",
  caption: "",
  imageUrl: "",
  audience: "both",
  tab: "",
  gallery: "dashboard",
};

const EMPTY: TemplateDraft = {
  id: "",
  name: "",
  slug: "",
  category: "other",
  tagline: "",
  description: "",
  coverImage: "",
  cardScreenshot: "",
  screenshotUrl: "",
  screenshots: [],
  mobileScreenshots: [],
  promoVideoUrl: "",
  promoVideoPosterUrl: "",
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

function asShots(value: unknown): ShotDraft[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => ({ ...EMPTY_SHOT, ...(item as ShotDraft) }));
}

function fromApi(row: Partial<TemplateDraft> & { features?: string[] | string; screenshots?: unknown; mobileScreenshots?: unknown }): TemplateDraft {
  return {
    ...EMPTY,
    ...row,
    screenshots: asShots(row.screenshots),
    mobileScreenshots: asShots(row.mobileScreenshots),
    features: Array.isArray(row.features) ? row.features.join("\n") : row.features || "",
    status: row.status || "DRAFT",
  };
}

async function uploadImage(file: File) {
  const body = new FormData();
  body.append("file", file);
  const { data } = await API.post("/admin/saas-templates/upload", body);
  return String(data.url || "");
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
      <main className="mx-auto grid max-w-[1480px] gap-6 px-3 py-6 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="text-xs font-black text-[#7C4DFF]">Admin</p>
          <h1 className="text-2xl font-black text-purple-950">SaaS Control Center</h1>
          <p className="mt-1 max-w-2xl font-bold text-slate-500">
            תבניות עם סטטוס ACTIVE מופיעות אוטומטית ב־/saas. מדיה, וידאו וקישורי דמו נשמרים על התבנית.
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
                    {row.slug ? (
                      <Link className="rounded-full bg-white px-3 py-2 text-xs font-black ring-1 ring-slate-200" to={`/saas/${row.slug}`} target="_blank">
                        תצוגת עמוד
                      </Link>
                    ) : null}
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
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black">{draft.id ? "עריכת תבנית" : "תבנית חדשה"}</h2>
            {draft.slug ? (
              <Link className="text-sm font-black text-[#6d4aff]" to={`/saas/${draft.slug}`} target="_blank">
                תצוגה מקדימה
              </Link>
            ) : null}
          </div>
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
            Tagline
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.tagline} onChange={(event) => set("tagline", event.target.value)} />
          </label>
          <label className="mt-3 block text-sm font-bold">
            Description
            <textarea className="mt-1 min-h-24 w-full rounded-2xl border px-3 py-2" value={draft.description} onChange={(event) => set("description", event.target.value)} />
          </label>
          <ImageField label="Cover" value={draft.coverImage} onChange={(value) => set("coverImage", value)} />
          <ImageField label="Card screenshot" value={draft.cardScreenshot} onChange={(value) => set("cardScreenshot", value)} />
          <ShotList
            title="Screenshots"
            shots={draft.screenshots}
            onChange={(shots) => set("screenshots", shots)}
          />
          <ShotList
            title="Mobile screenshots"
            shots={draft.mobileScreenshots}
            onChange={(shots) => set("mobileScreenshots", shots)}
          />
          <label className="mt-3 block text-sm font-bold">
            Promo video URL
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.promoVideoUrl} onChange={(event) => set("promoVideoUrl", event.target.value)} />
          </label>
          <ImageField label="Video poster" value={draft.promoVideoPosterUrl} onChange={(value) => set("promoVideoPosterUrl", value)} />
          <label className="mt-3 block text-sm font-bold">
            Admin demo URL
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.adminDemoUrl} onChange={(event) => set("adminDemoUrl", event.target.value)} />
          </label>
          <label className="mt-3 block text-sm font-bold">
            Customer demo URL
            <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={draft.customerDemoUrl} onChange={(event) => set("customerDemoUrl", event.target.value)} />
          </label>
          <label className="mt-3 block text-sm font-bold">
            Full demo URL
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

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block text-sm font-bold">
      {label}
      <input className="mt-1 w-full rounded-2xl border px-3 py-2" value={value} onChange={(event) => onChange(event.target.value)} />
      <input
        className="mt-2 block text-xs"
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          uploadImage(file).then(onChange).catch(() => onChange(value));
        }}
      />
    </label>
  );
}

function ShotList({
  title,
  shots,
  onChange,
}: {
  title: string;
  shots: ShotDraft[];
  onChange: (shots: ShotDraft[]) => void;
}) {
  function update(index: number, patch: Partial<ShotDraft>) {
    onChange(shots.map((shot, shotIndex) => (shotIndex === index ? { ...shot, ...patch } : shot)));
  }
  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= shots.length) return;
    const copy = shots.slice();
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    onChange(copy);
  }
  return (
    <fieldset className="mt-4 rounded-3xl border border-slate-200 p-3">
      <legend className="px-2 text-sm font-black">{title}</legend>
      <div className="grid gap-3">
        {shots.map((shot, index) => (
          <div key={`${shot.imageUrl}-${index}`} className="rounded-2xl bg-slate-50 p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="rounded-2xl border px-3 py-2" placeholder="Label" value={shot.label} onChange={(event) => update(index, { label: event.target.value })} />
              <input className="rounded-2xl border px-3 py-2" placeholder="Caption" value={shot.caption} onChange={(event) => update(index, { caption: event.target.value })} />
              <input className="rounded-2xl border px-3 py-2 sm:col-span-2" placeholder="Image URL" value={shot.imageUrl} onChange={(event) => update(index, { imageUrl: event.target.value })} />
              <select className="rounded-2xl border px-3 py-2" value={shot.gallery} onChange={(event) => update(index, { gallery: event.target.value })}>
                {["dashboard", "customers", "admin", "reports", "mobile", "settings", "jobs", "services", "properties"].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <select className="rounded-2xl border px-3 py-2" value={shot.tab} onChange={(event) => update(index, { tab: event.target.value })}>
                <option value="">No preview tab</option>
                {["dashboard", "customers", "bookings", "reports", "branding"].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <select className="rounded-2xl border px-3 py-2" value={shot.audience} onChange={(event) => update(index, { audience: event.target.value })}>
                <option value="both">Both</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  uploadImage(file).then((url) => update(index, { imageUrl: url })).catch(() => undefined);
                }}
              />
            </div>
            <div className="mt-2 flex gap-2">
              <button type="button" className="rounded-full bg-white px-3 py-1 text-xs font-black" onClick={() => move(index, -1)}>למעלה</button>
              <button type="button" className="rounded-full bg-white px-3 py-1 text-xs font-black" onClick={() => move(index, 1)}>למטה</button>
              <button type="button" className="rounded-full bg-white px-3 py-1 text-xs font-black text-rose-600" onClick={() => onChange(shots.filter((_, shotIndex) => shotIndex !== index))}>הסרה</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="mt-3 rounded-full bg-[#24124d] px-3 py-2 text-xs font-black text-white" onClick={() => onChange([...shots, { ...EMPTY_SHOT }])}>
        הוספת מסך
      </button>
    </fieldset>
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

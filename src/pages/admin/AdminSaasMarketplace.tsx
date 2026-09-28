import { useEffect, useState, type FormEvent } from "react";
import API from "../../api";
import AdminHeader from "./AdminsHeader";
import { MARKETPLACE_CATEGORIES } from "../../saas/logic";

type Screenshot = { key: string; label: string; imageUrl: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  headline: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  priceUsd: number;
  estimatedDevCostLabel: string;
  mainImageUrl: string;
  accent: string;
  accentSecondary: string;
  screenshots: Screenshot[];
  features: string[];
  included: string[];
  demoUrl: string;
  status: string;
  badge: string;
  seoTitle: string;
  seoDescription: string;
  whatsappBlurb: string;
  sortOrder: number;
  archivedAt?: string | null;
};

const EMPTY: Product = {
  id: "",
  name: "",
  slug: "",
  category: "other",
  headline: "",
  subtitle: "",
  shortDescription: "",
  fullDescription: "",
  priceUsd: 0,
  estimatedDevCostLabel: "",
  mainImageUrl: "",
  accent: "#5B4DFF",
  accentSecondary: "#38BDF8",
  screenshots: [],
  features: [],
  included: [],
  demoUrl: "",
  status: "draft",
  badge: "",
  seoTitle: "",
  seoDescription: "",
  whatsappBlurb: "",
  sortOrder: 100,
  archivedAt: null,
};

const STATUS_LABEL: Record<string, string> = {
  draft: "טיוטה",
  published: "Published",
  sold_out: "Sold Out",
  coming_soon: "Coming Soon",
};

function lines(value: string[]) {
  return (value || []).join("\n");
}

export default function AdminSaasMarketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [screens, setScreens] = useState<Screenshot[]>([]);
  const [settings, setSettings] = useState({ whatsappE164: "", usdToIlsRate: 3.7 });
  const [draft, setDraft] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const [list, meta] = await Promise.all([
      API.get("/admin/saas-marketplace"),
      API.get("/admin/saas-marketplace/meta"),
    ]);
    setProducts(list.data.products || []);
    setScreens(meta.data.screens || []);
    setSettings({
      whatsappE164: meta.data.settings?.whatsappE164 || "",
      usdToIlsRate: meta.data.settings?.usdToIlsRate || 3.7,
    });
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      API.get("/admin/saas-marketplace"),
      API.get("/admin/saas-marketplace/meta"),
    ])
      .then(([list, meta]) => {
        if (!active) return;
        setProducts(list.data.products || []);
        setScreens(meta.data.screens || []);
        setSettings({
          whatsappE164: meta.data.settings?.whatsappE164 || "",
          usdToIlsRate: meta.data.settings?.usdToIlsRate || 3.7,
        });
      })
      .catch(() => {
        if (active) setError("לא הצלחנו לטעון את ה-Marketplace");
      });
    return () => {
      active = false;
    };
  }, []);

  function openNew() {
    setDraft({
      ...EMPTY,
      screenshots: screens.map((screen) => ({ ...screen, imageUrl: "" })),
    });
  }

  function openEdit(product: Product) {
    setDraft({
      ...product,
      screenshots: screens.map((screen) => {
        const existing = product.screenshots?.find((item) => item.key === screen.key);
        return existing || { ...screen, imageUrl: "" };
      }),
    });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setError("");
    const body = {
      ...draft,
      features: linesToArray(draft.features as unknown as string),
      included: linesToArray(draft.included as unknown as string),
    };
    try {
      if (draft.id) await API.patch(`/admin/saas-marketplace/${draft.id}`, body);
      else await API.post("/admin/saas-marketplace", body);
      setDraft(null);
      setNotice("נשמר");
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "שמירה נכשלה");
    }
  }

  async function act(id: string, action: string) {
    setError("");
    try {
      if (action === "delete") {
        if (!window.confirm("למחוק את המערכת?")) return;
        await API.delete(`/admin/saas-marketplace/${id}`);
      } else {
        await API.post(`/admin/saas-marketplace/${id}/${action}`);
      }
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "הפעולה נכשלה");
    }
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    try {
      await API.patch("/admin/saas-marketplace/settings", settings);
      setNotice("ההגדרות נשמרו. ה-Marketplace נשאר unlisted באתר הראשי.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "שמירת הגדרות נכשלה");
    }
  }

  async function upload(file: File, apply: (url: string) => void) {
    const data = new FormData();
    data.append("file", file);
    const result = await API.post("/admin/saas-marketplace/upload", data);
    apply(result.data.url);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f6f7fb]">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-900">SaaS Marketplace</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Published כאן לא מוסיף קישור לעמוד הבית. העמודים נשארים unlisted עד השקה נפרדת.
            </p>
          </div>
          <button type="button" onClick={openNew} className="rounded-2xl bg-[#7C4DFF] px-4 py-3 text-sm font-black text-white">
            Create SaaS product
          </button>
        </div>
        {notice ? <p className="mt-4 text-sm font-bold text-emerald-700">{notice}</p> : null}
        {error ? <p className="mt-4 text-sm font-bold text-rose-600">{error}</p> : null}

        <form onSubmit={saveSettings} className="mt-6 grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-[1fr_160px_auto]">
          <label className="text-sm font-bold">
            WhatsApp מכירות
            <input
              value={settings.whatsappE164}
              onChange={(event) => setSettings({ ...settings, whatsappE164: event.target.value })}
              placeholder="+9725..."
              className="mt-1 w-full rounded-2xl border px-3 py-3"
            />
          </label>
          <label className="text-sm font-bold">
            USD → ILS
            <input
              type="number"
              step="0.01"
              value={settings.usdToIlsRate}
              onChange={(event) => setSettings({ ...settings, usdToIlsRate: Number(event.target.value) })}
              className="mt-1 w-full rounded-2xl border px-3 py-3"
            />
          </label>
          <button className="self-end rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" type="submit">
            שמירת הגדרות
          </button>
        </form>

        <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-sm">
          <table className="min-w-full text-right text-sm">
            <thead className="text-xs font-bold text-slate-400">
              <tr>
                <th className="px-4 py-3">שם</th>
                <th className="px-4 py-3">סטטוס</th>
                <th className="px-4 py-3">מחיר</th>
                <th className="px-4 py-3">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-3">
                    <p className="font-black">{product.name}</p>
                    <p className="text-xs text-slate-400">/saas/{product.slug}</p>
                    {product.archivedAt ? <p className="text-xs font-bold text-amber-600">בארכיון</p> : null}
                  </td>
                  <td className="px-4 py-3 font-bold">{STATUS_LABEL[product.status] || product.status}</td>
                  <td className="px-4 py-3">${product.priceUsd}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Action onClick={() => openEdit(product)}>Edit</Action>
                      <Action onClick={() => act(product.id, "duplicate")}>Duplicate</Action>
                      <Action onClick={() => act(product.id, "publish")}>Publish</Action>
                      <Action onClick={() => act(product.id, "unpublish")}>Unpublish</Action>
                      <Action onClick={() => act(product.id, product.archivedAt ? "unarchive" : "archive")}>
                        {product.archivedAt ? "Unarchive" : "Archive"}
                      </Action>
                      <Action onClick={() => act(product.id, "delete")}>Delete</Action>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {draft ? (
          <form onSubmit={save} className="mt-6 grid gap-3 rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">{draft.id ? "עריכה" : "מערכת חדשה"}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Name" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} />
              <Field label="Slug" value={draft.slug} onChange={(slug) => setDraft({ ...draft, slug })} />
              <label className="text-sm font-bold">
                Category
                <select
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                  className="mt-1 w-full rounded-2xl border px-3 py-3"
                >
                  {MARKETPLACE_CATEGORIES.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Status
                <select
                  value={draft.status}
                  onChange={(event) => setDraft({ ...draft, status: event.target.value })}
                  className="mt-1 w-full rounded-2xl border px-3 py-3"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
              </label>
              <Field label="Headline" value={draft.headline} onChange={(headline) => setDraft({ ...draft, headline })} />
              <Field label="Badge" value={draft.badge} onChange={(badge) => setDraft({ ...draft, badge })} />
            </div>
            <Area label="Short description" value={draft.shortDescription} onChange={(shortDescription) => setDraft({ ...draft, shortDescription })} />
            <Area label="Full description" value={draft.fullDescription} onChange={(fullDescription) => setDraft({ ...draft, fullDescription })} />
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Price (USD)" value={String(draft.priceUsd)} onChange={(value) => setDraft({ ...draft, priceUsd: Number(value) })} />
              <Field label="Estimated development cost" value={draft.estimatedDevCostLabel} onChange={(estimatedDevCostLabel) => setDraft({ ...draft, estimatedDevCostLabel })} />
              <Field label="Demo URL" value={draft.demoUrl} onChange={(demoUrl) => setDraft({ ...draft, demoUrl })} />
            </div>
            <Field label="Main image URL" value={draft.mainImageUrl} onChange={(mainImageUrl) => setDraft({ ...draft, mainImageUrl })} />
            <label className="text-sm font-bold">
              העלאת תמונה ראשית
              <input
                type="file"
                accept="image/*"
                className="mt-1 block"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file || !draft) return;
                  upload(file, (url) => setDraft({ ...draft, mainImageUrl: url })).catch(() =>
                    setError("העלאה נכשלה. אפשר להדביק URL.")
                  );
                }}
              />
            </label>
            <Area
              label="Features (שורה לכל פריט)"
              value={Array.isArray(draft.features) ? lines(draft.features) : String(draft.features || "")}
              onChange={(value) => setDraft({ ...draft, features: value.split("\n") as unknown as string[] })}
            />
            <Area
              label="What's included"
              value={Array.isArray(draft.included) ? lines(draft.included) : String(draft.included || "")}
              onChange={(value) => setDraft({ ...draft, included: value.split("\n") as unknown as string[] })}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="SEO title" value={draft.seoTitle} onChange={(seoTitle) => setDraft({ ...draft, seoTitle })} />
              <Field label="WhatsApp blurb" value={draft.whatsappBlurb} onChange={(whatsappBlurb) => setDraft({ ...draft, whatsappBlurb })} />
            </div>
            <Area label="SEO description" value={draft.seoDescription} onChange={(seoDescription) => setDraft({ ...draft, seoDescription })} />
            <div className="grid gap-2">
              {(draft.screenshots || []).map((screen, index) => (
                <label key={screen.key} className="text-xs font-bold text-slate-500">
                  {screen.label}
                  <input
                    value={screen.imageUrl}
                    onChange={(event) => {
                      const screenshots = draft.screenshots.slice();
                      screenshots[index] = { ...screen, imageUrl: event.target.value };
                      setDraft({ ...draft, screenshots });
                    }}
                    placeholder="Screenshot URL"
                    className="mt-1 w-full rounded-2xl border px-3 py-2 text-sm"
                  />
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="rounded-2xl bg-[#7C4DFF] px-4 py-3 text-sm font-black text-white" type="submit">
                שמירה
              </button>
              <button type="button" className="rounded-2xl border px-4 py-3 text-sm font-bold" onClick={() => setDraft(null)}>
                סגירה
              </button>
            </div>
          </form>
        ) : null}
      </main>
    </div>
  );
}

function linesToArray(value: string | string[]) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  return String(value || "").split("\n").map((item) => item.trim()).filter(Boolean);
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-bold">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-3" />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-bold">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-1 w-full rounded-2xl border px-3 py-3" />
    </label>
  );
}

function Action({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
      {children}
    </button>
  );
}

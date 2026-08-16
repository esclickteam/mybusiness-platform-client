import React from "react";
import { BarChart3, Cake, HelpCircle, Languages, QrCode, Search, Users } from "lucide-react";

import API from "../../../../api";
import {
  Field,
  PluginPanelProps,
  SitePluginPanelFrame,
  TextInput,
} from "./SitePluginPanelFrame";

function useJson<T>(loader: () => Promise<T>, deps: React.DependencyList) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState("");
  const reload = React.useCallback(async () => {
    try {
      setError("");
      setData(await loader());
    } catch (err) {
      setError((err as Error)?.message || "Load failed");
    }
  }, deps);
  React.useEffect(() => {
    void reload();
  }, [reload]);
  return { data, error, reload, setData };
}

export function AnalyticsProPanel(props: PluginPanelProps) {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const { data, error, reload } = useJson(async () => {
    const { data: res } = await API.get(`/site-builder/sites/${props.siteId}/analytics/events`, {
      params: { from: from || undefined, to: to || undefined },
    });
    return res;
  }, [props.siteId, from, to]);
  const overview = data?.overview || {};
  return (
    <SitePluginPanelFrame
      {...props}
      icon={BarChart3}
      accent="#0EA5E9"
      title="Analytics Pro"
      description="אירועי המרה, מקורות, מכשירים ומשפך."
      loading={!data && !error}
      saving={false}
      message={error}
      onSave={() => reload()}
    >
      <div data-testid="analytics-overview" className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Field label="מתאריך">
            <TextInput type="date" value={from} onChange={setFrom} />
          </Field>
          <Field label="עד תאריך">
            <TextInput type="date" value={to} onChange={setTo} />
          </Field>
        </div>
        <div data-testid="analytics-site-filter" className="text-xs text-slate-500">
          Site: {props.siteId}
        </div>
        <div data-testid="analytics-funnel" className="rounded-xl border p-3 text-sm">
          Funnel views {overview.funnel?.views || 0} / submits {overview.funnel?.submits || 0} /
          popup {overview.funnel?.popupImpressions || 0}→{overview.funnel?.popupConversions || 0}
        </div>
        <div data-testid="analytics-utm" className="rounded-xl border p-3 text-sm">
          UTM/Source: {JSON.stringify(overview.sources || {})}
        </div>
        <div data-testid="analytics-device" className="rounded-xl border p-3 text-sm">
          Device: {JSON.stringify(overview.devices || {})}
        </div>
        <div data-testid="analytics-top-conversion-pages" className="rounded-xl border p-3 text-sm">
          Top conversion pages:{" "}
          {(overview.topConversionPages || []).map((row: { path: string; count: number }) => (
            <div key={row.path}>
              {row.path} ({row.count})
            </div>
          ))}
        </div>
      </div>
    </SitePluginPanelFrame>
  );
}

export function SeoProPanel(props: PluginPanelProps) {
  const { data, error, reload } = useJson(async () => {
    const { data: res } = await API.get(`/site-builder/sites/${props.siteId}/seo-audit`);
    return res.audit;
  }, [props.siteId]);
  const issues = data?.issues || [];
  const codes = new Set(issues.map((issue: { code?: string }) => issue.code));
  return (
    <SitePluginPanelFrame
      {...props}
      icon={Search}
      accent="#059669"
      title="SEO Pro"
      description="ביקורת SEO עם ציון והמלצות. Core SEO נשאר חינם."
      loading={!data && !error}
      saving={false}
      message={error}
      onSave={() => reload()}
    >
      <div data-testid="seo-audit" className="space-y-3 text-sm">
        <div data-testid="seo-score" className="text-2xl font-black">
          SEO SCORE {data?.score ?? "-"}
        </div>
        <div data-testid="seo-recommendations">
          {(data?.recommendations || []).map((row: string) => (
            <div key={row}>{row}</div>
          ))}
        </div>
        {[
          ["missing_title", "MISSING TITLE"],
          ["missing_description", "MISSING DESCRIPTION"],
          ["duplicate_title", "DUPLICATE TITLE"],
          ["missing_h1", "MISSING H1"],
          ["broken_internal_link", "BROKEN LINK"],
          ["missing_alt", "IMAGE ALT"],
          ["canonical_mismatch", "CANONICAL"],
          ["noindex", "NOINDEX"],
          ["sitemap_empty", "SITEMAP"],
          ["schema_missing", "SCHEMA"],
        ].map(([code, label]) => (
          <div key={code} data-testid={`seo-issue-${code}`}>
            {label}: {codes.has(code) ? "FOUND" : data?.sitemapValid && code === "sitemap_empty" ? "OK" : data?.schemaPresent && code === "schema_missing" ? "OK" : "CHECKED"}
          </div>
        ))}
      </div>
    </SitePluginPanelFrame>
  );
}

export function MultiLanguagePanel(props: PluginPanelProps) {
  const { data, error, reload } = useJson(async () => {
    const { data: res } = await API.get(`/site-builder/sites/${props.siteId}/i18n`);
    return res;
  }, [props.siteId]);
  return (
    <SitePluginPanelFrame
      {...props}
      icon={Languages}
      accent="#2563EB"
      title="רב־לשוני"
      description="עברית /he ואנגלית /en עם hreflang."
      loading={!data && !error}
      saving={false}
      message={error}
      onSave={() => reload()}
    >
      <div data-testid="i18n-settings" className="space-y-2 text-sm">
        <div>Enabled: {String(Boolean(data?.enabled))}</div>
        <div data-testid="i18n-hreflang">{JSON.stringify(data?.hreflang || {})}</div>
        <div>Languages: {(data?.settings?.languages || []).map((l: { code: string }) => l.code).join(", ")}</div>
      </div>
    </SitePluginPanelFrame>
  );
}

export function ReferAFriendPanel(props: PluginPanelProps) {
  const [name, setName] = React.useState("QA Referral");
  const { data, error, reload } = useJson(async () => {
    const { data: res } = await API.get(`/site-builder/sites/${props.siteId}/referrals`);
    return res;
  }, [props.siteId]);
  return (
    <SitePluginPanelFrame
      {...props}
      icon={Users}
      accent="#F59E0B"
      title="חבר מביא חבר"
      description="קמפיין, קוד, ביקור והמרה — בלי תשלום אמיתי."
      loading={!data && !error}
      saving={false}
      message={error}
      onSave={() => reload()}
    >
      <div data-testid="referral-dashboard" className="space-y-3">
        <Field label="שם קמפיין">
          <TextInput value={name} onChange={setName} />
        </Field>
        <button
          type="button"
          data-testid="referral-campaign-create"
          className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-bold text-white"
          onClick={async () => {
            const { data: created } = await API.post(
              `/site-builder/sites/${props.siteId}/referrals/campaigns`,
              { name }
            );
            const campaignId = created?.campaign?._id;
            if (campaignId) {
              await API.post(`/site-builder/sites/${props.siteId}/referrals`, {
                campaignId,
                referrerName: "QA",
              });
            }
            await reload();
          }}
        >
          Create campaign
        </button>
        {(data?.campaigns || []).map((c: { _id: string; name: string }) => (
          <div key={c._id} data-testid="referral-campaign">
            {c.name}
          </div>
        ))}
        {(data?.referrals || []).map((r: { _id: string; code: string; status: string; clickCount?: number }) => (
          <div key={r._id} data-testid="referral-code">
            {r.code} · {r.status} · clicks {r.clickCount || 0}
            <div data-testid="referral-link">
              /api/site-builder/public/SITE/r/{r.code}
            </div>
          </div>
        ))}
      </div>
    </SitePluginPanelFrame>
  );
}

export function BirthdayClubPanel(props: PluginPanelProps) {
  const [name, setName] = React.useState("QA Birthday");
  const [email, setEmail] = React.useState("qa-bday@example.com");
  const [birthday, setBirthday] = React.useState(new Date().toISOString().slice(0, 10));
  const { data, error, reload } = useJson(async () => {
    const { data: res } = await API.get(`/site-builder/sites/${props.siteId}/birthdays/upcoming`);
    return res;
  }, [props.siteId]);
  return (
    <SitePluginPanelFrame
      {...props}
      icon={Cake}
      accent="#EC4899"
      title="מועדון יום הולדת"
      description="שדה יום הולדת, קרובים וסגמנט שנתי."
      loading={!data && !error}
      saving={false}
      message={error}
      onSave={() => reload()}
    >
      <div className="space-y-3">
        <Field label="שם">
          <TextInput value={name} onChange={setName} />
        </Field>
        <Field label="אימייל">
          <TextInput value={email} onChange={setEmail} />
        </Field>
        <div data-testid="birthday-field">
          <Field label="יום הולדת">
            <TextInput type="date" value={birthday} onChange={setBirthday} />
          </Field>
        </div>
        <button
          type="button"
          data-testid="birthday-save"
          className="rounded-lg bg-pink-600 px-3 py-2 text-sm font-bold text-white"
          onClick={async () => {
            await API.post(`/site-builder/sites/${props.siteId}/birthdays`, { name, email, birthday });
            await reload();
          }}
        >
          Save birthday
        </button>
        <button
          type="button"
          data-testid="birthday-trigger"
          className="rounded-lg border px-3 py-2 text-sm font-bold"
          onClick={async () => {
            await API.post(`/site-builder/sites/${props.siteId}/birthdays/trigger`);
          }}
        >
          Annual trigger (dry run)
        </button>
        <div data-testid="birthday-upcoming">
          {(data?.upcoming || []).map((row: { _id: string; name?: string; daysUntil?: number }) => (
            <div key={String(row._id)}>
              {row.name} · {row.daysUntil}d
            </div>
          ))}
        </div>
        <div data-testid="birthday-segment">Upcoming 30-day segment</div>
      </div>
    </SitePluginPanelFrame>
  );
}

export function QrGeneratorPanel(props: PluginPanelProps) {
  const [label, setLabel] = React.useState("QA QR");
  const [destination, setDestination] = React.useState("https://bizuply.com");
  const { data, error, reload } = useJson(async () => {
    const { data: res } = await API.get(`/site-builder/sites/${props.siteId}/qrs`);
    return res;
  }, [props.siteId]);
  return (
    <SitePluginPanelFrame
      {...props}
      icon={QrCode}
      accent="#111827"
      title="QR Pro"
      description="יצירה, הורדה, יעד דינמי ואנליטיקת סריקות."
      loading={!data && !error}
      saving={false}
      message={error}
      onSave={() => reload()}
    >
      <div className="space-y-3">
        <Field label="Label">
          <TextInput value={label} onChange={setLabel} />
        </Field>
        <Field label="Destination">
          <TextInput value={destination} onChange={setDestination} />
        </Field>
        <button
          type="button"
          data-testid="qr-create"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white"
          onClick={async () => {
            await API.post(`/site-builder/sites/${props.siteId}/qrs`, {
              label,
              destination,
              isDynamic: true,
            });
            await reload();
          }}
        >
          Create QR
        </button>
        {(data?.items || []).map((item: { _id: string; slug: string; destination: string; scanCount?: number }) => {
          const url = `/api/site-builder/public/q/${item.slug}`;
          return (
            <div key={item._id} data-testid="qr-item" className="rounded-xl border p-3 text-sm">
              <div>{item.slug}</div>
              <a data-testid="qr-download" href={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
                Download
              </a>
              <button
                type="button"
                data-testid="qr-edit"
                className="ml-2 text-xs font-bold"
                onClick={async () => {
                  await API.put(`/site-builder/sites/${props.siteId}/qrs/${item._id}`, {
                    destination,
                    label,
                  });
                  await reload();
                }}
              >
                Edit destination
              </button>
              <div data-testid="qr-analytics">scans {item.scanCount || 0}</div>
            </div>
          );
        })}
      </div>
    </SitePluginPanelFrame>
  );
}

export function FaqProPanel(props: PluginPanelProps) {
  const [name, setName] = React.useState("QA FAQ");
  const [question, setQuestion] = React.useState("What is included?");
  const [answer, setAnswer] = React.useState("QA answer");
  const [category, setCategory] = React.useState("General");
  const { data, error, reload } = useJson(async () => {
    const { data: res } = await API.get(`/site-builder/sites/${props.siteId}/faq-sets`);
    return res;
  }, [props.siteId]);
  return (
    <SitePluginPanelFrame
      {...props}
      icon={HelpCircle}
      accent="#7C3AED"
      title="FAQ Pro"
      description="סט FAQ לשימוש חוזר, קטגוריה, חיפוש ו-schema."
      loading={!data && !error}
      saving={false}
      message={error}
      onSave={() => reload()}
    >
      <div className="space-y-3">
        <Field label="Set name">
          <TextInput value={name} onChange={setName} />
        </Field>
        <Field label="Question">
          <TextInput value={question} onChange={setQuestion} />
        </Field>
        <Field label="Answer">
          <TextInput value={answer} onChange={setAnswer} />
        </Field>
        <Field label="Category">
          <TextInput value={category} onChange={setCategory} />
        </Field>
        <button
          type="button"
          data-testid="faq-create"
          className="rounded-lg bg-violet-700 px-3 py-2 text-sm font-bold text-white"
          onClick={async () => {
            await API.post(`/site-builder/sites/${props.siteId}/faq-sets`, {
              name,
              categories: [category],
              items: [{ id: "q1", question, answer, category }],
              schemaEnabled: true,
            });
            await reload();
          }}
        >
          Create FAQ set
        </button>
        {(data?.items || []).map((item: { _id: string; name: string; items?: unknown[] }) => (
          <div key={item._id} data-testid="faq-set" className="rounded-xl border p-3 text-sm">
            {item.name} · {(item.items || []).length} items
            <button
              type="button"
              data-testid="faq-edit"
              className="ml-2 text-xs font-bold"
              onClick={async () => {
                await API.put(`/site-builder/sites/${props.siteId}/faq-sets/${item._id}`, {
                  name: `${item.name} edited`,
                  categories: [category],
                  items: [{ id: "q1", question, answer, category }],
                  schemaEnabled: true,
                });
                await reload();
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </SitePluginPanelFrame>
  );
}

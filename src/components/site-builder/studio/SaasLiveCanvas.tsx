import { useEffect, useState } from "react";

type Visual = {
  styles: Record<string, Record<string, Record<string, string>>>;
  text: Record<string, string>;
  hidden: Record<string, boolean>;
  order: Record<string, number>;
};

type Selection = { id: string; label: string; locked: boolean; text: string };

const FIELDS = [
  ["color", "צבע טקסט", "color"],
  ["backgroundColor", "רקע", "color"],
  ["fontSize", "גודל גופן", "text"],
  ["fontFamily", "גופן", "text"],
  ["padding", "ריווח פנימי", "text"],
  ["margin", "שוליים", "text"],
  ["borderRadius", "עיגול פינות", "text"],
  ["border", "מסגרת", "text"],
  ["textAlign", "יישור", "text"],
  ["gap", "רווח בין רכיבים", "text"],
  ["width", "רוחב", "text"],
] as const;

function emptyVisual(): Visual {
  return { styles: {}, text: {}, hidden: {}, order: {} };
}

export default function SaasLiveCanvas({
  siteId,
  businessId,
  pageId,
  device,
  visual,
  onVisual,
}: {
  siteId: string;
  businessId: string;
  pageId: string;
  device: "desktop" | "tablet" | "mobile";
  visual: Visual;
  onVisual: (visual: Visual) => void;
}) {
  const [frameUrl, setFrameUrl] = useState("");
  const [message, setMessage] = useState("טוען את המסך החי…");
  const [selected, setSelected] = useState<Selection | null>(null);
  const width = device === "mobile" ? 390 : device === "tablet" ? 768 : "100%";

  useEffect(() => {
    let alive = true;
    setSelected(null);
    setFrameUrl("");
    setMessage("טוען את המסך החי…");
    const params = new URLSearchParams({ siteId, businessId, screen: pageId });
    fetch(`/api/site-builder/design-frame?${params.toString()}`, { credentials: "include" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!alive) return;
        if (body.status === "ready" && body.url) setFrameUrl(String(body.url));
        else setMessage(String(body.error || "המסך החי עדיין לא נפתח"));
      })
      .catch(() => {
        if (alive) setMessage("המסך החי עדיין לא נפתח");
      });
    return () => {
      alive = false;
    };
  }, [siteId, businessId, pageId]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data || {};
      if (data.source !== "saas-visual" || data.type !== "select") return;
      setSelected({
        id: String(data.id || ""),
        label: String(data.label || ""),
        locked: Boolean(data.locked),
        text: String(data.text || ""),
      });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function send(next: Visual) {
    onVisual(next);
    const frame = document.getElementById("saas-live-frame") as HTMLIFrameElement | null;
    frame?.contentWindow?.postMessage({ source: "saas-studio", type: "apply", screen: pageId, visual: next }, "*");
  }

  function patchStyle(key: string, value: string) {
    if (!selected) return;
    const deviceKey = device === "mobile" ? "mobile" : device === "tablet" ? "tablet" : "desktop";
    const current = visual.styles[selected.id] || {};
    send({
      ...visual,
      styles: {
        ...visual.styles,
        [selected.id]: { ...current, [deviceKey]: { ...(current[deviceKey] || {}), [key]: value } },
      },
    });
  }

  return (
    <div className="flex h-full min-h-0">
      <div className="min-w-0 flex-1 bg-slate-100 p-4">
        {frameUrl ? (
          <iframe
            id="saas-live-frame"
            title={pageId}
            src={frameUrl}
            className="mx-auto h-full border-0 bg-white"
            style={{ width }}
            onLoad={(event) => {
              event.currentTarget.contentWindow?.postMessage({ source: "saas-studio", type: "hello" }, "*");
              event.currentTarget.contentWindow?.postMessage({ source: "saas-studio", type: "apply", screen: pageId, visual }, "*");
            }}
          />
        ) : (
          <p className="p-6 text-sm font-bold text-slate-700">{message}</p>
        )}
      </div>
      <aside className="w-72 shrink-0 overflow-auto border-r border-slate-200 bg-white p-4">
        <p className="text-xs font-black text-violet-700">רכיב במסך החי</p>
        {selected ? (
          <div className="mt-3 space-y-3">
            <p className="truncate text-sm font-bold text-slate-800">{selected.label || selected.id}</p>
            {!selected.locked && (
              <label className="block text-xs font-bold text-slate-600">
                טקסט
                <input
                  className="mt-1 w-full rounded border px-2 py-1 text-sm"
                  value={visual.text[selected.id] ?? selected.text}
                  onChange={(event) => send({ ...visual, text: { ...visual.text, [selected.id]: event.target.value } })}
                />
              </label>
            )}
            {FIELDS.map(([key, label, kind]) => (
              <label key={key} className="block text-xs font-bold text-slate-600">
                {label}
                <input
                  className="mt-1 w-full rounded border px-2 py-1 text-sm"
                  type={kind === "color" ? "color" : "text"}
                  value={visual.styles[selected.id]?.[device === "mobile" ? "mobile" : device === "tablet" ? "tablet" : "desktop"]?.[key] || (kind === "color" ? "#111827" : "")}
                  onChange={(event) => patchStyle(key, event.target.value)}
                />
              </label>
            ))}
            <button
              type="button"
              className="rounded bg-violet-700 px-3 py-2 text-xs font-bold text-white"
              onClick={() => {
                const frame = document.getElementById("saas-live-frame") as HTMLIFrameElement | null;
                frame?.contentWindow?.postMessage({ source: "saas-studio", type: "open", id: selected.id }, "*");
              }}
            >
              פתיחת טאב, טופס או חלונית
            </button>
            {!selected.locked && (
              <button
                type="button"
                className="rounded bg-slate-900 px-3 py-2 text-xs font-bold text-white"
                onClick={() => send({ ...visual, hidden: { ...visual.hidden, [selected.id]: !visual.hidden[selected.id] } })}
              >
                {visual.hidden[selected.id] ? "הצג רכיב" : "הסתר רכיב"}
              </button>
            )}
            {!selected.locked && (
              <label className="block text-xs font-bold text-slate-600">
                סדר בתוך שורה או רשת
                <input
                  className="mt-1 w-full rounded border px-2 py-1 text-sm"
                  type="number"
                  min={-20}
                  max={20}
                  value={visual.order[selected.id] || 0}
                  onChange={(event) => send({ ...visual, order: { ...visual.order, [selected.id]: Number(event.target.value) || 0 } })}
                />
              </label>
            )}
            {selected.locked && <p className="text-xs leading-5 text-slate-500">הרכיב מוגן: אפשר לשנות את העיצוב, בלי להסתיר או להזיז אותו.</p>}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-slate-600">לחצו על רכיב במסך כדי לערוך צבע, גופן, ריווח ומסגרת.</p>
        )}
      </aside>
    </div>
  );
}

export { emptyVisual };

"use client";

import { useEffect, useState } from "react";

type Version = { revision: number; at: string; summary: string; pages: number };

export function SaasVisualRestore({ siteId, businessId }: { siteId?: string; businessId?: string }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [revision, setRevision] = useState("");
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!siteId || !businessId) return;
    const query = `businessId=${encodeURIComponent(businessId)}`;
    fetch(`/api/site-builder/sites/${siteId}/visual-versions?${query}`, { credentials: "include" })
      .then((response) => response.json())
      .then((body) => setVersions(Array.isArray(body.versions) ? body.versions : []))
      .catch(() => setVersions([]));
  }, [siteId, businessId]);

  if (!siteId || !versions.length) return null;

  async function showPreview() {
    if (!revision) return;
    const response = await fetch(`/api/site-builder/sites/${siteId}/visual-versions/${revision}?businessId=${encodeURIComponent(businessId || "")}`, { credentials: "include" });
    const body = await response.json();
    const titles = Array.isArray(body.pages) ? body.pages.map((page: { title?: string }) => page.title).filter(Boolean).slice(0, 8) : [];
    setPreview(titles.join(" · ") || "אין כותרות בגרסה");
    setMessage("");
  }

  async function restore() {
    if (!revision) return;
    setMessage("");
    const response = await fetch(`/api/site-builder/sites/${siteId}/visual-versions/${revision}/restore?businessId=${encodeURIComponent(businessId || "")}`, {
      method: "POST",
      credentials: "include",
    });
    const body = await response.json().catch(() => ({}));
    setMessage(response.ok && body.productSync?.status === "published" ? "הגרסה פורסמה מחדש לעותק החי" : body.error || "השחזור לא עודכן במערכת החיה");
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-xs">
      <strong>שחזור גרסה</strong>
      <select className="rounded-full border px-3 py-1" value={revision} onChange={(event) => setRevision(event.target.value)}>
        <option value="">בחירת גרסה</option>
        {versions.map((version) => (
          <option key={version.revision} value={version.revision}>
            {version.revision} · {version.summary}
          </option>
        ))}
      </select>
      <button type="button" className="rounded-full border px-3 py-1 font-bold" onClick={() => void showPreview()}>תצוגה מקדימה</button>
      <button type="button" className="rounded-full border px-3 py-1 font-bold" onClick={() => void restore()}>פרסום מחדש</button>
      {preview ? <span>{preview}</span> : null}
      {message ? <span>{message}</span> : null}
    </div>
  );
}

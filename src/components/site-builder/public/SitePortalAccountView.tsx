import React, { useEffect, useState } from "react";
import { sitePortalLogout, sitePortalMe } from "../../../api/sitePortalApi";
import type { SitePortalMember } from "../../../utils/sitePortalSession";

type PortalPage = {
  id: string;
  title: string;
  slug?: string;
  path?: string;
};

type Props = {
  siteId: string;
  siteName?: string;
};

export default function SitePortalAccountView({ siteId, siteName = "" }: Props) {
  const [member, setMember] = useState<SitePortalMember | null>(null);
  const [portalPages, setPortalPages] = useState<PortalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await sitePortalMe(siteId);
        if (cancelled) return;
        setMember(data.member);
        setPortalPages(
          Array.isArray((data as any).portalPages) ? (data as any).portalPages : []
        );
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "לא מחוברים לאזור האישי");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [siteId]);

  async function handleLogout() {
    await sitePortalLogout(siteId);
    window.history.replaceState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  if (loading) {
    return (
      <div dir="rtl" className="grid min-h-screen place-items-center bg-white">
        <p className="text-sm font-bold text-slate-500">טוען חשבון...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div dir="rtl" className="grid min-h-screen place-items-center bg-white px-4">
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-xl font-black text-slate-900">לא מחוברים</h1>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <a
            href="/portal/login"
            className="mt-5 inline-flex rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
          >
            להתחברות
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-10"
    >
      <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold text-sky-700">החשבון שלי</p>
        <h1 className="mt-2 text-2xl font-black text-slate-900">
          שלום {member.fullName || "אורח/ת"}
        </h1>
        {siteName ? (
          <p className="mt-1 text-sm font-medium text-slate-500">{siteName}</p>
        ) : null}

        <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="font-bold text-slate-500">אימייל</span>
            <span className="font-semibold text-slate-800">{member.email}</span>
          </div>
          {member.phone ? (
            <div className="flex justify-between gap-3">
              <span className="font-bold text-slate-500">טלפון</span>
              <span className="font-semibold text-slate-800">{member.phone}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-black text-slate-900">העמודים שלי</h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            אלה העמודים הפרטיים שהעסק בנה עבורכם באזור האישי.
          </p>

          {portalPages.length === 0 ? (
            <p className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
              עדיין לא שויכו עמודים לחשבון זה.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {portalPages.map((page) => {
                const href =
                  page.path ||
                  `/${String(page.slug || page.id || "").replace(/^\/+/, "")}`;
                return (
                  <a
                    key={page.id}
                    href={href}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-sky-200 hover:bg-sky-50"
                  >
                    <span>{page.title}</span>
                    <span className="text-xs text-sky-700">כניסה</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href="/"
            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"
          >
            חזרה לאתר
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
          >
            התנתקות
          </button>
        </div>
      </div>
    </div>
  );
}

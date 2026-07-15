import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import {
  FolderPlus,
  Globe2,
  LayoutTemplate,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Copy,
  FolderInput,
  Folder,
  ExternalLink,
  Sparkles,
  UserPlus,
} from "lucide-react";

import {
  createSiteFolder,
  deleteMySite,
  deleteSiteFolder,
  duplicateMySite,
  listMySites,
  listSiteFolders,
  moveMySiteToFolder,
  renameMySite,
  type MySiteSummary,
  type SiteFolder,
} from "../api/mySitesApi";
import SiteShareModal from "../components/website/SiteShareModal";

type MenuState = {
  siteId: string;
  top: number;
  left: number;
} | null;

const MENU_WIDTH = 220;
const MENU_ESTIMATED_HEIGHT = 320;

function formatUpdatedAt(value?: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("he-IL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function statusLabel(site: MySiteSummary) {
  if (site.published || site.status === "published") {
    return site.publicUrl || site.slug || "מפורסם";
  }
  return "טיוטה — טרם פורסם";
}

export default function MySitesPage() {
  const { businessId = "" } = useParams<{ businessId: string }>();
  const navigate = useNavigate();

  const [sites, setSites] = useState<MySiteSummary[]>([]);
  const [folders, setFolders] = useState<SiteFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeFolderId, setActiveFolderId] = useState<string | "all">("all");
  const [menu, setMenu] = useState<MenuState>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [shareSite, setShareSite] = useState<MySiteSummary | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const basePath = `/business/${businessId}/dashboard`;

  const loadAll = useCallback(async () => {
    if (!businessId) return;

    setLoading(true);
    setError("");

    try {
      const [nextSites, nextFolders] = await Promise.all([
        listMySites(businessId, {
          q: query.trim() || undefined,
          folderId:
            activeFolderId === "all"
              ? undefined
              : activeFolderId === "root"
                ? null
                : activeFolderId,
        }),
        listSiteFolders(businessId),
      ]);

      setSites(nextSites);
      setFolders(nextFolders);
    } catch (err: any) {
      setError(err?.message || "לא ניתן לטעון את האתרים כרגע");
    } finally {
      setLoading(false);
    }
  }, [businessId, query, activeFolderId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadAll();
    }, query ? 250 : 0);

    return () => window.clearTimeout(timer);
  }, [loadAll, query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const folderNameById = useMemo(() => {
    const map = new Map<string, string>();
    folders.forEach((f) => map.set(f._id, f.name));
    return map;
  }, [folders]);

  async function handleCreateSite() {
    navigate(`${basePath}/website/create`);
  }

  async function handleCreateFolder() {
    const name = window.prompt("שם התיקייה החדשה");
    if (!name?.trim()) return;

    try {
      setBusyId("folder");
      await createSiteFolder(businessId, name.trim());
      await loadAll();
    } catch (err: any) {
      alert(err?.message || "יצירת תיקייה נכשלה");
    } finally {
      setBusyId(null);
    }
  }

  function openSite(site: MySiteSummary) {
    const templateKey = String(site.templateKey || "").trim();
    if (templateKey) {
      navigate(
        `${basePath}/website/sites/${site._id}/edit?template=${encodeURIComponent(templateKey)}`
      );
      return;
    }
    navigate(`${basePath}/website/sites/${site._id}/edit`);
  }

  async function handleRename(site: MySiteSummary) {
    setMenu(null);
    const name = window.prompt("שם חדש לאתר", site.name || "האתר שלי");
    if (!name?.trim()) return;

    try {
      setBusyId(site._id);
      await renameMySite(site._id, name.trim());
      await loadAll();
    } catch (err: any) {
      alert(err?.message || "שינוי השם נכשל");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDuplicate(site: MySiteSummary) {
    setMenu(null);
    try {
      setBusyId(site._id);
      await duplicateMySite(site._id);
      await loadAll();
    } catch (err: any) {
      alert(err?.message || "שכפול האתר נכשל");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(site: MySiteSummary) {
    setMenu(null);
    const ok = window.confirm(
      `למחוק את "${site.name || "האתר"}"? האתר יוסר מהרשימה.`
    );
    if (!ok) return;

    try {
      setBusyId(site._id);
      await deleteMySite(site._id);
      await loadAll();
    } catch (err: any) {
      alert(err?.message || "מחיקת האתר נכשלה");
    } finally {
      setBusyId(null);
    }
  }

  async function handleMoveToFolder(site: MySiteSummary) {
    setMenu(null);

    if (!folders.length) {
      const create = window.confirm(
        "אין עדיין תיקיות. ליצור תיקייה חדשה עכשיו?"
      );
      if (!create) return;
      await handleCreateFolder();
      return;
    }

    const options = folders
      .map((f, i) => `${i + 1}. ${f.name}`)
      .concat(`${folders.length + 1}. ללא תיקייה (ראשי)`)
      .join("\n");

    const choice = window.prompt(
      `העברה לתיקייה — הזינו מספר:\n${options}`,
      "1"
    );
    if (!choice) return;

    const index = Number(choice) - 1;
    const folderId =
      index >= 0 && index < folders.length ? folders[index]._id : null;

    try {
      setBusyId(site._id);
      await moveMySiteToFolder(site._id, folderId);
      await loadAll();
    } catch (err: any) {
      alert(err?.message || "העברה לתיקייה נכשלה");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeleteFolder(folder: SiteFolder) {
    const ok = window.confirm(
      `למחוק את התיקייה "${folder.name}"? האתרים שבה יחזרו לרשימה הראשית.`
    );
    if (!ok) return;

    try {
      setBusyId(folder._id);
      await deleteSiteFolder(folder._id);
      if (activeFolderId === folder._id) setActiveFolderId("all");
      await loadAll();
    } catch (err: any) {
      alert(err?.message || "מחיקת תיקייה נכשלה");
    } finally {
      setBusyId(null);
    }
  }

  const selectedSite = menu
    ? sites.find((s) => s._id === menu.siteId) || null
    : null;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f5f6fb] px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-slate-500">
              בניית אתרים
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              האתרים שלי
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              כל האתרים של העסק במקום אחד — עריכה, ארגון בתיקיות, ושכפול בקלות.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCreateFolder}
              disabled={busyId === "folder"}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <FolderPlus className="h-4 w-4" />
              תיקייה חדשה
            </button>

            <button
              type="button"
              onClick={handleCreateSite}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              אתר חדש
            </button>
          </div>
        </div>

        {/* Create hint strip */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-gradient-to-l from-slate-100 via-white to-violet-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
              <Sparkles className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                מוכנים לבנות אתר חדש?
              </p>
              <p className="text-sm text-slate-600">
                בחרו איך לבנות — מתבנית מוכנה או עם AI — ותתחילו לערוך מיד בעורך Bizuply.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCreateSite}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <LayoutTemplate className="h-4 w-4" />
            בחירת שיטה
          </button>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש לפי שם אתר..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-3 text-sm text-slate-900 outline-none ring-violet-500/30 placeholder:text-slate-400 focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveFolderId("all")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeFolderId === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              הכל
            </button>
            <button
              type="button"
              onClick={() => setActiveFolderId("root")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeFolderId === "root"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              ללא תיקייה
            </button>
            {folders.map((folder) => (
              <button
                key={folder._id}
                type="button"
                onClick={() => setActiveFolderId(folder._id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleDeleteFolder(folder);
                }}
                title="לחיצה ימנית למחיקה"
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  activeFolderId === folder._id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                <Folder className="h-3.5 w-3.5" />
                {folder.name}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200"
              />
            ))}
          </div>
        ) : sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Globe2 className="h-7 w-7 text-slate-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">עדיין אין אתרים</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-600">
              צרו אתר ראשון מתבנית מוכנה — אפשר לארגן אותו אחר כך בתיקיות.
            </p>
            <button
              type="button"
              onClick={handleCreateSite}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              צרו אתר ראשון
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => {
              const published = site.published || site.status === "published";
              const folderLabel = site.folderId
                ? folderNameById.get(String(site.folderId))
                : null;

              return (
                <article
                  key={site._id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => openSite(site)}
                    className="block w-full text-right"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-violet-50">
                      {site.thumbnailUrl ? (
                        <img
                          src={site.thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
                          <LayoutTemplate className="h-8 w-8 text-slate-400" />
                          <span className="text-xs font-medium text-slate-500">
                            {site.templateName || site.templateKey || "אתר Bizuply"}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/25 group-hover:opacity-100">
                        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow">
                          פתיחה בעורך
                        </span>
                      </div>

                      <div
                        className={`absolute bottom-0 inset-x-0 px-3 py-1.5 text-[11px] font-semibold ${
                          published
                            ? "bg-emerald-500/90 text-white"
                            : "bg-slate-700/85 text-white"
                        }`}
                      >
                        {site.access === "shared"
                          ? "משותף איתי"
                          : published
                            ? "מפורסם ב־Bizuply"
                            : "טיוטה"}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-start justify-between gap-2 px-3.5 py-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900">
                        {site.name || "האתר שלי"}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {statusLabel(site)}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        {folderLabel ? (
                          <span className="inline-flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            {folderLabel}
                          </span>
                        ) : null}
                        {site.updatedAt ? (
                          <span>עודכן {formatUpdatedAt(site.updatedAt)}</span>
                        ) : null}
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="תפריט פעולות"
                      disabled={busyId === site._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = (
                          e.currentTarget as HTMLButtonElement
                        ).getBoundingClientRect();

                        const spaceBelow = window.innerHeight - rect.bottom - 12;
                        const openUp = spaceBelow < MENU_ESTIMATED_HEIGHT;

                        const top = openUp
                          ? Math.max(12, rect.top - MENU_ESTIMATED_HEIGHT - 6)
                          : rect.bottom + 6;

                        // Keep menu fully inside the viewport (RTL-friendly)
                        let left = rect.left;
                        left = Math.min(
                          left,
                          window.innerWidth - MENU_WIDTH - 12
                        );
                        left = Math.max(12, left);

                        setMenu({
                          siteId: site._id,
                          top,
                          left,
                        });
                      }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition hover:bg-slate-700"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions menu — portal so it never gets clipped by cards/overflow */}
      {menu && selectedSite
        ? createPortal(
            <div
              ref={menuRef}
              style={{
                position: "fixed",
                top: menu.top,
                left: menu.left,
                width: MENU_WIDTH,
                zIndex: 9999,
                maxHeight: "min(360px, calc(100vh - 24px))",
              }}
              className="overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-2xl"
            >
              {selectedSite.access !== "shared" ? (
                <MenuButton
                  icon={Pencil}
                  label="שינוי שם"
                  onClick={() => handleRename(selectedSite)}
                />
              ) : null}
              <MenuButton
                icon={ExternalLink}
                label="פתיחה בעורך"
                onClick={() => {
                  setMenu(null);
                  openSite(selectedSite);
                }}
              />
              {selectedSite.access !== "shared" ? (
                <MenuButton
                  icon={UserPlus}
                  label="שיתוף / העברה"
                  onClick={() => {
                    setMenu(null);
                    setShareSite(selectedSite);
                  }}
                />
              ) : null}
              {selectedSite.publicUrl &&
              (selectedSite.published ||
                selectedSite.status === "published") ? (
                <MenuButton
                  icon={Globe2}
                  label="צפייה באתר החי"
                  onClick={() => {
                    setMenu(null);
                    window.open(selectedSite.publicUrl, "_blank", "noopener");
                  }}
                />
              ) : null}
              <div className="my-1 border-t border-slate-100" />
              <MenuButton
                icon={Copy}
                label="שכפול אתר"
                onClick={() => handleDuplicate(selectedSite)}
              />
              {selectedSite.access !== "shared" ? (
                <>
                  <MenuButton
                    icon={FolderInput}
                    label="העברה לתיקייה"
                    onClick={() => handleMoveToFolder(selectedSite)}
                  />
                  <MenuButton
                    icon={Trash2}
                    label="מחיקה"
                    danger
                    onClick={() => handleDelete(selectedSite)}
                  />
                </>
              ) : null}
            </div>,
            document.body
          )
        : null}

      {shareSite ? (
        <SiteShareModal
          site={shareSite}
          open={Boolean(shareSite)}
          onClose={() => setShareSite(null)}
        />
      ) : null}
    </div>
  );
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-right text-sm transition hover:bg-slate-50 ${
        danger ? "text-rose-600" : "text-slate-700"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

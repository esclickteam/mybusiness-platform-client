import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  Folder,
  FolderInput,
  FolderPlus,
  Globe2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Trash2,
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
import MySiteCardPreview from "../components/website/MySiteCardPreview";
import { prefetchGalleryPreviewKeys } from "../utils/templatePreviewScheduler";
import { useLocaleDir } from "../hooks/useLocaleDir";

type MenuState = {
  siteId: string;
  top: number;
  left: number;
} | null;

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

const MENU_WIDTH = 220;
const MENU_ESTIMATED_HEIGHT = 360;

function formatUpdatedAt(value: string | undefined, locale: string) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function statusLabel(site: MySiteSummary, t: TranslateFn) {
  if (site.published || site.status === "published") {
    const url = String(site.publicUrl || site.slug || "").trim();
    if (/draft-/i.test(url)) {
      return t("mySites.statusLabel.publishedNeedUrl");
    }
    return url || t("mySites.statusLabel.published");
  }

  return t("mySites.statusLabel.draft");
}

function siteStatus(site: MySiteSummary, t: TranslateFn) {
  const published = site.published || site.status === "published";

  if (published) {
    return {
      label: t("mySites.status.active"),
      wrapper: "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    };
  }

  return {
    label: t("mySites.status.draft"),
    wrapper: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  };
}

function normalizeSiteDedupeKey(site: MySiteSummary) {
  const templateKey = String(site.templateKey || "")
    .trim()
    .toLowerCase();
  const name = String(site.name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  return `${templateKey}::${name}`;
}

function isPublishedSite(site: MySiteSummary) {
  return Boolean(site.published || site.status === "published");
}

/**
 * Hide orphan draft cards when a published site with the same
 * template + name already exists (common after publish left a leftover draft).
 */
function dedupeSitesForDisplay(sites: MySiteSummary[]) {
  const publishedKeys = new Set(
    sites.filter(isPublishedSite).map(normalizeSiteDedupeKey),
  );

  return sites.filter((site) => {
    if (isPublishedSite(site)) return true;
    const key = normalizeSiteDedupeKey(site);
    if (!key || key === "::") return true;
    return !publishedKeys.has(key);
  });
}

export default function MySitesPage() {
  const { businessId = "" } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const dateLocale = i18n.language?.startsWith("he") ? "he-IL" : "en-US";

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

      setSites(dedupeSitesForDisplay(nextSites));
      setFolders(nextFolders);
    } catch (err: any) {
      setError(err?.message || t("mySites.loadError"));
    } finally {
      setLoading(false);
    }
  }, [businessId, query, activeFolderId, t]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadAll();
    }, query ? 250 : 0);

    return () => window.clearTimeout(timer);
  }, [loadAll, query]);

  // Batch-load live saved-site previews
  useEffect(() => {
    if (!sites.length) return;
    prefetchGalleryPreviewKeys(sites.map((site) => `site:${site._id}`));
  }, [sites]);

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
    folders.forEach((folder) => map.set(folder._id, folder.name));
    return map;
  }, [folders]);

  const selectedSite = menu
    ? sites.find((site) => site._id === menu.siteId) || null
    : null;

  function handleCreateSite() {
    navigate(`${basePath}/website/create`);
  }

  async function handleCreateFolder() {
    const name = window.prompt(t("mySites.prompts.newFolderName"));
    if (!name?.trim()) return;

    try {
      setBusyId("folder");
      await createSiteFolder(businessId, name.trim());
      await loadAll();
    } catch (err: any) {
      alert(err?.message || t("mySites.errors.createFolder"));
    } finally {
      setBusyId(null);
    }
  }

  function openSite(site: MySiteSummary) {
    const templateKey = String(site.templateKey || "").trim();

    if (templateKey) {
      navigate(
        `${basePath}/website/sites/${site._id}/edit?template=${encodeURIComponent(
          templateKey
        )}`
      );
      return;
    }

    navigate(`${basePath}/website/sites/${site._id}/edit`);
  }

  function openSiteManagement(site: MySiteSummary) {
    setMenu(null);
    void import("./SiteManagementPanelPage");
    navigate(`${basePath}/website/sites/${site._id}/manage`);
  }

  async function handleRename(site: MySiteSummary) {
    setMenu(null);

    const name = window.prompt(
      t("mySites.prompts.renameSite"),
      site.name || t("mySites.defaultSiteName")
    );
    if (!name?.trim()) return;

    try {
      setBusyId(site._id);
      await renameMySite(site._id, name.trim());
      await loadAll();
    } catch (err: any) {
      alert(err?.message || t("mySites.errors.rename"));
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
      alert(err?.message || t("mySites.errors.duplicate"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(site: MySiteSummary) {
    setMenu(null);

    const approved = window.confirm(
      t("mySites.prompts.deleteSite", {
        name: site.name || t("mySites.siteFallback"),
      })
    );
    if (!approved) return;

    try {
      setBusyId(site._id);
      await deleteMySite(site._id);
      await loadAll();
    } catch (err: any) {
      alert(err?.message || t("mySites.errors.delete"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleMoveToFolder(site: MySiteSummary) {
    setMenu(null);

    if (!folders.length) {
      const shouldCreate = window.confirm(t("mySites.prompts.noFoldersCreate"));

      if (!shouldCreate) return;
      await handleCreateFolder();
      return;
    }

    const options = folders
      .map((folder, index) => `${index + 1}. ${folder.name}`)
      .concat(`${folders.length + 1}. ${t("mySites.prompts.noFolderOption")}`)
      .join("\n");

    const choice = window.prompt(
      t("mySites.prompts.moveToFolder", { options }),
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
      alert(err?.message || t("mySites.errors.moveToFolder"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeleteFolder(folder: SiteFolder) {
    const approved = window.confirm(
      t("mySites.prompts.deleteFolder", { name: folder.name })
    );

    if (!approved) return;

    try {
      setBusyId(folder._id);
      await deleteSiteFolder(folder._id);

      if (activeFolderId === folder._id) {
        setActiveFolderId("all");
      }

      await loadAll();
    } catch (err: any) {
      alert(err?.message || t("mySites.errors.deleteFolder"));
    } finally {
      setBusyId(null);
    }
  }

  function openActionsMenu(
    event: React.MouseEvent<HTMLButtonElement>,
    siteId: string
  ) {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const openUp = spaceBelow < MENU_ESTIMATED_HEIGHT;

    const top = openUp
      ? Math.max(12, rect.top - MENU_ESTIMATED_HEIGHT - 6)
      : rect.bottom + 6;

    let left = rect.left;
    left = Math.min(left, window.innerWidth - MENU_WIDTH - 12);
    left = Math.max(12, left);

    setMenu({
      siteId,
      top,
      left,
    });
  }

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#f7f8fc] px-4 py-6 text-start sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1480px]">
        <header className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="order-1 xl:order-2">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400">
                {t("mySites.badge")}
              </span>
              <span className="h-1 w-1 rounded-full bg-violet-400" />
              <span className="text-sm font-bold text-violet-600">
                {t("mySites.managementCenter")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                {t("mySites.title")}
              </h1>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 shadow-sm">
                <Sparkles className="h-5 w-5 text-violet-600" />
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              {t("mySites.subtitle")}
            </p>
          </div>

          <div className="order-2 flex flex-wrap items-center gap-3 xl:order-1">
            <button
              type="button"
              onClick={handleCreateSite}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(109,40,217,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(109,40,217,0.3)]"
            >
              <Plus className="h-4 w-4" />
              {t("mySites.newSite")}
            </button>

            <button
              type="button"
              onClick={handleCreateFolder}
              disabled={busyId === "folder"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FolderPlus className="h-4 w-4" />
              {t("mySites.newFolder")}
            </button>
          </div>
        </header>

        <section className="mb-6 rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("mySites.searchPlaceholder")}
                className="h-12 w-full rounded-2xl border border-transparent bg-slate-50 pe-11 ps-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-200 focus:bg-white focus:ring-4 focus:ring-violet-100/70"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-600 transition hover:border-violet-200 hover:text-violet-700"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {t("mySites.moreFilters")}
              </button>

              <FolderFilterButton
                active={activeFolderId === "all"}
                onClick={() => setActiveFolderId("all")}
                label={t("mySites.allSites")}
              />

              <FolderFilterButton
                active={activeFolderId === "root"}
                onClick={() => setActiveFolderId("root")}
                label={t("mySites.noFolder")}
              />

              {folders.map((folder) => (
                <button
                  key={folder._id}
                  type="button"
                  onClick={() => setActiveFolderId(folder._id)}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    handleDeleteFolder(folder);
                  }}
                  title={t("mySites.rightClickDelete")}
                  className={`inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-xs font-black transition ${
                    activeFolderId === folder._id
                      ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700"
                  }`}
                >
                  <Folder className="h-4 w-4" />
                  {folder.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-[16/9] animate-pulse bg-slate-100" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/5 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-4 w-3/5 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-10 animate-pulse rounded-2xl bg-slate-50" />
                </div>
              </div>
            ))}
          </div>
        ) : sites.length === 0 ? (
          <div className="relative overflow-hidden rounded-[30px] border border-dashed border-violet-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#f3e8ff,transparent_45%)]" />

            <div className="relative mx-auto flex max-w-lg flex-col items-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-violet-100 text-violet-600 shadow-inner">
                <Globe2 className="h-8 w-8" />
              </div>

              <h2 className="text-2xl font-black text-slate-800">
                {t("mySites.emptyTitle")}
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                {t("mySites.emptyText")}
              </p>

              <button
                type="button"
                onClick={handleCreateSite}
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-6 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                {t("mySites.createFirstSite")}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {sites.map((site) => {
              const published =
                site.published || site.status === "published";
              const folderLabel = site.folderId
                ? folderNameById.get(String(site.folderId))
                : null;
              const status = siteStatus(site, t);

              return (
                <article
                  key={site._id}
                  className="group relative overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_22px_48px_rgba(76,29,149,0.12)]"
                >
                  <button
                    type="button"
                    onClick={() => openSite(site)}
                    className="block w-full text-start"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-violet-50">
                      <MySiteCardPreview site={site} />

                      <div className="absolute inset-0 flex items-center justify-center border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/0 opacity-0 transition duration-300 group-hover:border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/35 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-800 shadow-xl">
                          <Pencil className="h-4 w-4" />
                          {t("mySites.openInEditor")}
                        </span>
                      </div>

                      <div className="absolute end-4 top-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-black shadow-sm backdrop-blur ${status.wrapper}`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </span>
                      </div>

                      {folderLabel ? (
                        <div className="absolute bottom-4 end-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[11px] font-black text-slate-700 shadow-sm backdrop-blur">
                            <Folder className="h-3.5 w-3.5" />
                            {folderLabel}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </button>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <Globe2 className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-base font-black text-slate-800">
                              {site.name || t("mySites.defaultSiteName")}
                            </h3>

                            <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                              {statusLabel(site, t)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label={t("mySites.actionsMenu")}
                        disabled={busyId === site._id}
                        onClick={(event) => openActionsMenu(event, site._id)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock3 className="h-4 w-4" />
                        <span>
                          {site.updatedAt
                            ? t("mySites.updated", {
                                date: formatUpdatedAt(site.updatedAt, dateLocale),
                              })
                            : t("mySites.notUpdated")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-500">
                        <CheckCircle2
                          className={`h-4 w-4 ${
                            published
                              ? "text-emerald-500"
                              : "text-slate-300"
                          }`}
                        />
                        {published ? t("mySites.published") : t("mySites.draft")}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

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
              className="overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_24px_60px_rgba(15,23,42,0.2)]"
            >
              {selectedSite.access !== "shared" ? (
                <MenuButton
                  icon={Pencil}
                  label={t("mySites.menu.rename")}
                  onClick={() => handleRename(selectedSite)}
                />
              ) : null}

              <MenuButton
                icon={ExternalLink}
                label={t("mySites.menu.openEditor")}
                onClick={() => {
                  setMenu(null);
                  openSite(selectedSite);
                }}
              />

              <MenuButton
                icon={Settings2}
                label={t("mySites.menu.managePanel")}
                onClick={() => openSiteManagement(selectedSite)}
              />

              {selectedSite.access !== "shared" ? (
                <MenuButton
                  icon={UserPlus}
                  label={t("mySites.menu.shareTransfer")}
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
                  label={t("mySites.menu.viewLive")}
                  onClick={() => {
                    setMenu(null);
                    window.open(selectedSite.publicUrl, "_blank", "noopener");
                  }}
                />
              ) : null}

              <div className="my-1.5 border-t border-slate-100" />

              <MenuButton
                icon={Copy}
                label={t("mySites.menu.duplicate")}
                onClick={() => handleDuplicate(selectedSite)}
              />

              {selectedSite.access !== "shared" ? (
                <>
                  <MenuButton
                    icon={FolderInput}
                    label={t("mySites.menu.moveToFolder")}
                    onClick={() => handleMoveToFolder(selectedSite)}
                  />

                  <MenuButton
                    icon={Trash2}
                    label={t("mySites.menu.delete")}
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

function FolderFilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-xs font-black transition ${
        active
          ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg"
          : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700"
      }`}
    >
      {label}
      <ChevronDown className="h-3.5 w-3.5 opacity-70" />
    </button>
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
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-sm transition ${
        danger
          ? "text-rose-600 hover:bg-rose-50"
          : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" />
      <span className="font-bold">{label}</span>
    </button>
  );
}

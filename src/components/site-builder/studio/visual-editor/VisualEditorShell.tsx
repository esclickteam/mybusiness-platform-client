import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Monitor,
  Settings2,
  Smartphone,
  Tablet,
} from "lucide-react";

import VisualEditorCanvas from "./VisualEditorCanvas";
import VisualFloatingToolbar from "./VisualFloatingToolbar";
import VisualContextMenu from "./VisualContextMenu";
import VisualAddLayersPanel from "./VisualAddLayersPanel";
import EditorPluginOverlays from "./EditorPluginOverlays";
import VisualSitePagesPanel, {
  type VisualSitePageItem,
} from "./VisualSitePagesPanel";
import VisualStorePanel from "./VisualStorePanel";
import VisualEditorIconRail from "./VisualEditorIconRail";
import VisualEditorPluginStorePanel from "./VisualEditorPluginStorePanel";
import VisualMediaModal from "./components/VisualMediaModal";
import VisualLinkModal from "./components/VisualLinkModal";
import FormBuilderModal from "../FormBuilderModal";
import ConnectDomainModal from "../../../website/ConnectDomainModal";
import { getSitePlugins } from "../../../../api/sitePluginsApi";
import {
  emitStoreCatalogChanged,
  stripStoreBoundVisualImageOverrides,
  subscribeStoreCatalogChanged,
} from "../data/templates/shared/storeCatalogSync";
import type { VisualDeviceMode } from "./visualEditorTypes";
import type { useVisualEditorState } from "./hooks/useVisualEditorState";
import type { VisualLibraryPageTemplate } from "./library/visualLibraryTypes";

const DEVICE_OPTIONS: Array<{
  value: VisualDeviceMode;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: "desktop", label: "דסקטופ", icon: <Monitor className="h-4 w-4" /> },
  { value: "tablet", label: "טאבלט", icon: <Tablet className="h-4 w-4" /> },
  { value: "mobile", label: "מובייל", icon: <Smartphone className="h-4 w-4" /> },
];

const PUBLIC_SITE_DOMAIN =
  import.meta.env.VITE_BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";

type VisualEditorRuntime = ReturnType<typeof useVisualEditorState> & {
  templateName?: string;
  templateKey?: string;

  isPreviewMode: boolean;
  setIsPreviewMode?: React.Dispatch<React.SetStateAction<boolean>>;
  togglePreviewMode?: () => void;

  isInlineEditing?: boolean;
  setIsInlineEditing?: React.Dispatch<React.SetStateAction<boolean>>;

  clearSelection?: () => void;

  isSaving: boolean;
  isUploadingMedia?: boolean;
  lastSavedAt?: string;
  saveError?: string;

  save?: (
    status?: "draft" | "published",
  ) => void | Promise<void> | Promise<any>;

  saveDraft?: () => void | Promise<void> | Promise<any>;
  publish?: () => void | Promise<void> | Promise<any>;

  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;

  deviceMode?: VisualDeviceMode;
  setDeviceMode?: (mode: VisualDeviceMode) => void;
};

type VisualEditorShellProps = {
  editor: VisualEditorRuntime;
  onBack?: () => void;
  className?: string;
  siteId?: string;
  businessId?: string;
  siteSlug?: string;
  customDomain?: string;
  onAddLibraryPage?: (page: VisualLibraryPageTemplate) => void;
  sitePages?: VisualSitePageItem[];
  activeSitePageId?: string;
  onSelectSitePage?: (
    pageId: string,
    currentVisualData?: Record<string, any>,
  ) => void;
  onSitePageAction?: (
    action: string,
    pageId: string,
    meta?: {
      parentPageId?: string;
      targetPageId?: string;
      placement?: "before" | "after" | "inside";
      orderedIds?: string[];
      rowSnapshots?: Array<{ id: string; depth: number }>;
    },
  ) => void;
};

export default function VisualEditorShell({
  editor,
  onBack,
  className = "",
  siteId,
  businessId: businessIdProp,
  siteSlug = "",
  customDomain = "",
  onAddLibraryPage,
  sitePages = [],
  activeSitePageId = "",
  onSelectSitePage,
  onSitePageAction,
}: VisualEditorShellProps) {
  const navigate = useNavigate();
  const [actionError, setActionError] = useState("");
  const [sidePanelMode, setSidePanelMode] = useState<
    "add" | "layers" | "code" | "pages" | "store" | "plugins" | null
  >(null);
  const [preferredAddTab, setPreferredAddTab] = useState<
    "sections" | "pages" | "plugins"
  >("sections");
  const [overlayRefreshKey, setOverlayRefreshKey] = useState(0);
  const [storePluginEnabled, setStorePluginEnabled] = useState(false);
  const [connectDomainOpen, setConnectDomainOpen] = useState(false);
  const [linkedCustomDomain, setLinkedCustomDomain] = useState(
    String(customDomain || "").trim().toLowerCase(),
  );

  const businessId = String(
    businessIdProp || (editor as any)?.businessId || "",
  ).trim();

  useEffect(() => {
    setLinkedCustomDomain(String(customDomain || "").trim().toLowerCase());
  }, [customDomain]);

  useEffect(() => {
    let cancelled = false;
    const id = String(siteId || "").trim();
    if (!id) {
      setStorePluginEnabled(false);
      return;
    }

    getSitePlugins(id)
      .then((plugins) => {
        if (cancelled) return;
        const enabled = Array.isArray(plugins.enabledPlugins)
          ? plugins.enabledPlugins
          : [];
        const detected = Array.isArray(plugins.detectedFromSite)
          ? plugins.detectedFromSite
          : [];
        setStorePluginEnabled(
          enabled.includes("store") || detected.includes("store"),
        );
      })
      .catch(() => {
        if (!cancelled) setStorePluginEnabled(false);
      });

    return () => {
      cancelled = true;
    };
  }, [siteId, overlayRefreshKey]);

  useEffect(() => {
    return subscribeStoreCatalogChanged((detail) => {
      const changedId = String(detail.businessId || "").trim();
      if (changedId && businessId && changedId !== businessId) return;

      const current = ((editor as any)?.data || {}) as Record<string, any>;
      const next = stripStoreBoundVisualImageOverrides(current);
      if (next === current) return;

      if (typeof (editor as any)?.replaceData === "function") {
        (editor as any).replaceData(next);
      } else {
        (editor as any)?.setData?.(next);
      }
    });
  }, [businessId, editor]);

  const siteUrlLabel = useMemo(() => {
    if (linkedCustomDomain) return `https://${linkedCustomDomain}`;
    const slug = String(siteSlug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) return `https://${PUBLIC_SITE_DOMAIN}`;
    return `https://${slug}.${PUBLIC_SITE_DOMAIN}`;
  }, [linkedCustomDomain, siteSlug]);

  const templateName =
    editor.templateName ||
    editor.renderer?.name ||
    editor.templateKey ||
    "עורך אתר";

  const isPreviewMode = Boolean(editor.isPreviewMode);
  const isInlineEditing = Boolean(editor.isInlineEditing);
  const isSaving = Boolean(editor.isSaving);
  const isUploadingMedia = Boolean(editor.isUploadingMedia);

  const hasSelectedElement = Boolean(editor.selectedElement);

  const shouldShowFloatingToolbar =
    !isPreviewMode && hasSelectedElement;

  const shouldShowContextMenu =
    !isPreviewMode && !isInlineEditing;

  const busy = isSaving || isUploadingMedia;

  useEffect(() => {
    if (!editor.saveError) {
      setActionError("");
      return;
    }

    setActionError(editor.saveError);
  }, [editor.saveError]);

  const autoAddedSectionRef = React.useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const addPlugin = params.get("addPlugin");
    const addPage = params.get("addPage");
    const addSection = params.get("addSection");

    if (addPlugin) {
      setSidePanelMode("plugins");
      setOverlayRefreshKey((k) => k + 1);
    } else if (addPage || addSection) {
      setPreferredAddTab(addPage ? "pages" : "sections");
      setSidePanelMode("add");
    }

    if (addPage && typeof onAddLibraryPage === "function") {
      import("./library/pageLibrary").then(({ getPageTemplateById }) => {
        const page = getPageTemplateById(addPage);
        if (page) {
          window.setTimeout(() => onAddLibraryPage(page), 600);
        }
      });
    }

    const addLibrarySection = (editor as any)?.addLibrarySection as
      | ((id: string, placement?: "append") => void)
      | undefined;
    if (
      addSection &&
      typeof addLibrarySection === "function" &&
      autoAddedSectionRef.current !== addSection
    ) {
      autoAddedSectionRef.current = addSection;
      const timer = window.setTimeout(() => {
        addLibrarySection(addSection, "append");
        params.delete("addSection");
        params.delete("addPlugin");
        const next = params.toString();
        const url = `${window.location.pathname}${next ? `?${next}` : ""}`;
        window.history.replaceState({}, "", url);
      }, 700);
      return () => window.clearTimeout(timer);
    }
  }, [onAddLibraryPage, editor]);

  async function runAction(
    action: () => void | Promise<void> | Promise<any>,
  ) {
    setActionError("");

    try {
      await action();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "הפעולה נכשלה",
      );
    }
  }

  function handleTogglePreview() {
    editor.setIsInlineEditing?.(false);
    setSidePanelMode(null);
    editor.clearSelection?.();

    if (typeof editor.togglePreviewMode === "function") {
      editor.togglePreviewMode();
      return;
    }

    editor.setIsPreviewMode?.((current) => !current);
  }

  function handlePublish() {
    void runAction(async () => {
      if (typeof editor.save === "function") {
        await editor.save("published");
        return;
      }

      if (typeof editor.publish === "function") {
        await editor.publish();
        return;
      }

      throw new Error("פעולת הפרסום אינה מחוברת לעורך.");
    });
  }

  return (
    <div
      data-template-visual-editor="true"
      data-visual-inline-editing={
        isInlineEditing ? "true" : "false"
      }
      className={[
        "fixed inset-0 z-[100] flex min-h-screen flex-col overflow-hidden bg-slate-100 text-slate-800",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dir="rtl"
    >
      <header className="relative z-[2147483100] flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur-xl lg:px-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-800">
            {templateName}
          </p>
          <p
            dir="ltr"
            className="truncate text-[11px] font-bold text-slate-500"
            title={siteUrlLabel}
          >
            {siteUrlLabel}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
          {DEVICE_OPTIONS.map((device) => (
            <button
              key={device.value}
              type="button"
              title={device.label}
              onClick={() => editor.setDeviceMode?.(device.value)}
              className={[
                "inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-black transition",
                editor.deviceMode === device.value
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
              ].join(" ")}
            >
              {device.icon}
              <span className="hidden lg:inline">{device.label}</span>
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {siteId && businessId ? (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/business/${businessId}/dashboard/website/sites/${siteId}/manage`,
                )
              }
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 lg:px-4"
              title="פאנל ניהול"
            >
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">פאנל ניהול</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleTogglePreview}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 lg:px-4"
          >
            {isPreviewMode ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isPreviewMode ? "חזרה לעריכה" : "תצוגה מקדימה"}
            </span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={handlePublish}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-violet-200/70 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-4 text-sm font-black text-black shadow-sm transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 lg:px-5"
          >
            {isSaving ? "מפרסם..." : "פרסום"}
          </button>
        </div>
      </header>

      {actionError ? (
        <div className="relative z-[2147483099] flex h-11 shrink-0 items-center justify-center border-b border-rose-200 bg-rose-50 px-4 text-center text-sm font-black text-rose-700">
          {actionError}
        </div>
      ) : null}

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {!isPreviewMode ? (
          <VisualEditorIconRail
            sidePanelMode={sidePanelMode}
            storePluginEnabled={storePluginEnabled}
            hasDomain={Boolean(linkedCustomDomain)}
            pageCount={sitePages.length}
            onBack={onBack}
            onOpenDomain={() => setConnectDomainOpen(true)}
            onOpenAdd={() => {
              setPreferredAddTab("sections");
              setSidePanelMode((current) =>
                current === "add" ? null : "add",
              );
            }}
            onOpenPlugins={() =>
              setSidePanelMode((current) =>
                current === "plugins" ? null : "plugins",
              )
            }
            onTogglePanel={(mode) =>
              setSidePanelMode((current) =>
                current === mode ? null : mode,
              )
            }
          />
        ) : null}

        <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <section className="absolute inset-0 min-h-0 overflow-hidden">
          <VisualEditorCanvas editor={editor as any} siteId={siteId} />
        </section>

        {shouldShowFloatingToolbar ? (
          <VisualFloatingToolbar editor={editor as any} />
        ) : null}

        {shouldShowContextMenu ? (
          <VisualContextMenu editor={editor as any} />
        ) : null}

        {!isPreviewMode ? (
          <VisualAddLayersPanel
            editor={editor as any}
            mode={
              sidePanelMode === "add" ||
              sidePanelMode === "layers" ||
              sidePanelMode === "code"
                ? sidePanelMode
                : null
            }
            onClose={() => setSidePanelMode(null)}
            onAddLibraryPage={onAddLibraryPage}
            preferredAddTab={preferredAddTab}
            siteId={siteId}
            onOverlayInstalled={() => setOverlayRefreshKey((k) => k + 1)}
          />
        ) : null}

        {!isPreviewMode ? (
          <VisualEditorPluginStorePanel
            open={sidePanelMode === "plugins"}
            siteId={siteId}
            onClose={() => setSidePanelMode(null)}
            onInstalled={() => setOverlayRefreshKey((k) => k + 1)}
          />
        ) : null}

        {!isPreviewMode ? (
          <VisualSitePagesPanel
            open={sidePanelMode === "pages"}
            editor={editor as any}
            pages={sitePages}
            activePageId={activeSitePageId}
            onClose={() => setSidePanelMode(null)}
            onSelectPage={(pageId) => {
              if (typeof onSelectSitePage !== "function") return;
              const currentVisualData =
                ((editor as any).data as Record<string, any>) || {};
              onSelectSitePage(pageId, currentVisualData);
            }}
            onAddPage={() => {
              setPreferredAddTab("pages");
              setSidePanelMode("add");
            }}
            onPageAction={onSitePageAction}
          />
        ) : null}

        {!isPreviewMode ? (
          <VisualStorePanel
            open={sidePanelMode === "store"}
            businessId={businessId}
            onClose={() => {
              setSidePanelMode(null);
              // Refresh canvas catalog when leaving the store panel.
              emitStoreCatalogChanged(businessId);
            }}
          />
        ) : null}

        <VisualLinkModal
          open={Boolean((editor as any).linkModal?.open)}
          elementId={(editor as any).linkModal?.elementId || ""}
          elementLabel={(editor as any).linkModal?.elementLabel || "קישור"}
          href={(editor as any).linkModal?.href || ""}
          sitePageId={(editor as any).linkModal?.sitePageId || ""}
          phone={(editor as any).linkModal?.phone || ""}
          email={(editor as any).linkModal?.email || ""}
          subject={(editor as any).linkModal?.subject || ""}
          message={(editor as any).linkModal?.message || ""}
          pages={(editor as any).getLinkTargets?.()?.pages || []}
          sections={(editor as any).getLinkTargets?.()?.sections || []}
          onClose={() => (editor as any).closeLinkModal?.()}
          onApply={(payload) => (editor as any).applyLinkFromModal?.(payload)}
          onRemove={() => {
            const elementId = String(
              (editor as any).linkModal?.elementId || "",
            ).trim();

            if (!elementId) return;

            (editor as any).applyLinkFromModal?.({ href: "#" });
          }}
        />

        {(editor as any).formBuilderModal?.open ? (
          <FormBuilderModal
            form={(editor as any).activeFormBuilderConfig}
            onClose={() => (editor as any).closeFormBuilder?.()}
            onUpdateForm={(patch) =>
              (editor as any).updateFormBuilderConfig?.(patch)
            }
            onUpdateField={(fieldId, patch) =>
              (editor as any).updateFormBuilderField?.(fieldId, patch)
            }
            onDeleteField={(fieldId) =>
              (editor as any).deleteFormBuilderField?.(fieldId)
            }
            onMoveField={(fieldId, direction) =>
              (editor as any).moveFormBuilderField?.(fieldId, direction)
            }
          />
        ) : null}

        <VisualMediaModal
          open={Boolean((editor as any).mediaModal?.open)}
          mode={(editor as any).mediaModal?.mode || "change"}
          elementId={(editor as any).mediaModal?.elementId || ""}
          elementLabel={(editor as any).mediaModal?.elementLabel || "מדיה"}
          currentSrc={(editor as any).mediaModal?.currentSrc || ""}
          currentAlt={(editor as any).mediaModal?.currentAlt || ""}
          mediaType={(editor as any).mediaModal?.mediaType || "image"}
          editorData={(editor as any).data}
          isUploading={isUploadingMedia}
          onClose={() => (editor as any).closeMediaModal?.()}
          onModeChange={(mode) => {
            const elementId = String(
              (editor as any).mediaModal?.elementId || "",
            ).trim();

            if (!elementId) return;

            (editor as any).openMediaModal?.(elementId, mode, {
              target: (editor as any).mediaModal?.target,
            });
          }}
          onApplyMedia={(payload) => {
            (editor as any).applyMediaFromModal?.(payload);
          }}
          onUploadFile={(file) => {
            void (editor as any).uploadMediaFileFromModal?.(file);
          }}
          onApplyEdit={(values) => {
            (editor as any).applyMediaEditValues?.(values);
          }}
          onResetEdit={() => {
            (editor as any).resetMediaEditValues?.();
          }}
        />
        </main>
      </div>

      <EditorPluginOverlays
        siteId={siteId}
        siteSlug={siteSlug}
        refreshKey={overlayRefreshKey}
      />

      <ConnectDomainModal
        open={connectDomainOpen}
        onClose={() => setConnectDomainOpen(false)}
        siteId={siteId}
        siteSlug={siteSlug}
        initialCustomDomain={linkedCustomDomain}
        onConnected={({ customDomain: nextDomain }) => {
          setLinkedCustomDomain(String(nextDomain || "").trim().toLowerCase());
        }}
      />
    </div>
  );
}

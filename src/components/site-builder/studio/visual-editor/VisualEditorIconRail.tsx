import React from "react";
import {
  ArrowLeft,
  Code2,
  FileStack,
  Globe2,
  Layers3,
  PanelTop,
  Plus,
  Puzzle,
  ShoppingBag,
} from "lucide-react";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { useTranslation } from "react-i18next";

export type VisualEditorSidePanelMode =
  | "add"
  | "layers"
  | "code"
  | "pages"
  | "header"
  | "store"
  | "plugins"
  | null;

type VisualEditorIconRailProps = {
  sidePanelMode: VisualEditorSidePanelMode;
  storePluginEnabled: boolean;
  hasDomain: boolean;
  pageCount: number;
  onBack?: () => void;
  onOpenDomain: () => void;
  onTogglePanel: (mode: Exclude<VisualEditorSidePanelMode, null>) => void;
  onOpenAdd: () => void;
  onOpenPlugins: () => void;
};

function RailButton({
  title,
  active,
  disabled,
  onClick,
  testId,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  testId?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      className={[
        "relative flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-xl transition",
        active
          ? "bg-violet-100 text-violet-700 shadow-sm ring-1 ring-violet-200"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        disabled ? "cursor-not-allowed opacity-35" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export const VISUAL_EDITOR_ICON_RAIL_WIDTH_PX = 72;

export default function VisualEditorIconRail({
  sidePanelMode,
  storePluginEnabled,
  hasDomain,
  pageCount,
  onBack,
  onOpenDomain,
  onTogglePanel,
  onOpenAdd,
  onOpenPlugins,
}: VisualEditorIconRailProps) {
  const railDir = useLocaleDir();
  const { t } = useTranslation();
  return (
    <aside
      data-visual-editor-icon-rail="true"
      className="relative z-[2147483600] flex w-[72px] shrink-0 flex-col items-center border-s border-slate-200 bg-white/95 py-2 shadow-sm backdrop-blur-xl"
      dir={railDir}
    >
      <div className="flex flex-col items-center gap-1 px-1">
        <RailButton title={t("studio.back")} onClick={onBack} disabled={!onBack}>
          <ArrowLeft className="rtl-flip h-5 w-5" />
        </RailButton>
      </div>

      <div className="mt-2 flex flex-1 flex-col items-center gap-1 overflow-y-auto px-1">
        <RailButton
          title={t("studio.add")}
          testId="visual-editor-add"
          active={sidePanelMode === "add"}
          onClick={onOpenAdd}
        >
          <Plus className="h-5 w-5" />
        </RailButton>

        <RailButton
          title={t("studio.plugins")}
          testId="visual-editor-plugins"
          active={sidePanelMode === "plugins"}
          onClick={onOpenPlugins}
        >
          <Puzzle className="h-5 w-5" />
        </RailButton>

        <RailButton
          title={t("studio.pagesNav")}
          testId="visual-editor-pages"
          active={sidePanelMode === "pages"}
          onClick={() => onTogglePanel("pages")}
        >
          <FileStack className="h-5 w-5" />
          {pageCount > 0 ? (
            <span className="absolute -left-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-slate-800 px-1 text-[9px] font-black text-white">
              {pageCount > 99 ? "99+" : pageCount}
            </span>
          ) : null}
        </RailButton>

        <RailButton
          title={t("studio.headerFooter")}
          active={sidePanelMode === "header"}
          onClick={() => onTogglePanel("header")}
        >
          <PanelTop className="h-5 w-5" />
        </RailButton>

        <RailButton
          title={t("studio.layers")}
          active={sidePanelMode === "layers"}
          onClick={() => onTogglePanel("layers")}
        >
          <Layers3 className="h-5 w-5" />
        </RailButton>

        <RailButton
          title={t("studio.customCode")}
          active={sidePanelMode === "code"}
          onClick={() => onTogglePanel("code")}
        >
          <Code2 className="h-5 w-5" />
        </RailButton>

        {storePluginEnabled ? (
          <RailButton
            title={t("studio.store")}
            active={sidePanelMode === "store"}
            onClick={() => onTogglePanel("store")}
          >
            <ShoppingBag className="h-5 w-5" />
          </RailButton>
        ) : null}

        <RailButton
          title={hasDomain ? t("studio.manageDomain") : t("studio.connectDomain")}
          onClick={onOpenDomain}
        >
          <Globe2 className="h-5 w-5" />
        </RailButton>
      </div>
    </aside>
  );
}

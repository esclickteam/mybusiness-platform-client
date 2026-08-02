import React from "react";
import {
  ArrowLeft,
  Code2,
  FileStack,
  Globe2,
  Layers3,
  Monitor,
  Plus,
  Redo2,
  ShoppingBag,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import type { VisualDeviceMode } from "./visualEditorTypes";

export type VisualEditorSidePanelMode =
  | "add"
  | "layers"
  | "code"
  | "pages"
  | "store"
  | null;

type VisualEditorIconRailProps = {
  sidePanelMode: VisualEditorSidePanelMode;
  deviceMode: VisualDeviceMode;
  storePluginEnabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
  busy: boolean;
  hasDomain: boolean;
  pageCount: number;
  onBack?: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDeviceChange: (mode: VisualDeviceMode) => void;
  onOpenDomain: () => void;
  onTogglePanel: (mode: Exclude<VisualEditorSidePanelMode, null>) => void;
  onOpenAdd: () => void;
};

const DEVICE_OPTIONS: Array<{
  value: VisualDeviceMode;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: "desktop", label: "דסקטופ", icon: <Monitor className="h-4 w-4" /> },
  { value: "tablet", label: "טאבלט", icon: <Tablet className="h-4 w-4" /> },
  { value: "mobile", label: "מובייל", icon: <Smartphone className="h-4 w-4" /> },
];

function RailButton({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={[
        "relative flex h-11 w-11 items-center justify-center rounded-xl transition",
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
  deviceMode,
  storePluginEnabled,
  canUndo,
  canRedo,
  busy,
  hasDomain,
  pageCount,
  onBack,
  onUndo,
  onRedo,
  onDeviceChange,
  onOpenDomain,
  onTogglePanel,
  onOpenAdd,
}: VisualEditorIconRailProps) {
  return (
    <aside
      data-visual-editor-icon-rail="true"
      className="relative z-[2147483050] flex w-[72px] shrink-0 flex-col items-center border-l border-slate-200 bg-white/95 py-2 shadow-sm backdrop-blur-xl"
      dir="rtl"
    >
      <div className="flex flex-col items-center gap-1 px-1">
        <RailButton title="חזרה" onClick={onBack} disabled={!onBack}>
          <ArrowLeft className="h-4 w-4" />
        </RailButton>
      </div>

      <div className="mt-2 flex flex-1 flex-col items-center gap-1 overflow-y-auto px-1">
        <RailButton
          title="הוספה"
          active={sidePanelMode === "add"}
          onClick={onOpenAdd}
        >
          <Plus className="h-4 w-4" />
        </RailButton>

        <RailButton
          title="עמודים"
          active={sidePanelMode === "pages"}
          onClick={() => onTogglePanel("pages")}
        >
          <FileStack className="h-4 w-4" />
          {pageCount > 0 ? (
            <span className="absolute -left-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-slate-800 px-1 text-[9px] font-black text-white">
              {pageCount > 99 ? "99+" : pageCount}
            </span>
          ) : null}
        </RailButton>

        <RailButton
          title="שכבות"
          active={sidePanelMode === "layers"}
          onClick={() => onTogglePanel("layers")}
        >
          <Layers3 className="h-4 w-4" />
        </RailButton>

        <RailButton
          title="קוד מותאם"
          active={sidePanelMode === "code"}
          onClick={() => onTogglePanel("code")}
        >
          <Code2 className="h-4 w-4" />
        </RailButton>

        {storePluginEnabled ? (
          <RailButton
            title="חנות"
            active={sidePanelMode === "store"}
            onClick={() => onTogglePanel("store")}
          >
            <ShoppingBag className="h-4 w-4" />
          </RailButton>
        ) : null}

        <RailButton
          title={hasDomain ? "ניהול דומיין" : "חיבור דומיין"}
          onClick={onOpenDomain}
        >
          <Globe2 className="h-4 w-4" />
        </RailButton>
      </div>

      <div className="mt-auto flex flex-col items-center gap-1 border-t border-slate-100 px-1 pt-2">
        <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-slate-200 bg-slate-50 p-1">
          {DEVICE_OPTIONS.map((device) => (
            <RailButton
              key={device.value}
              title={device.label}
              active={deviceMode === device.value}
              onClick={() => onDeviceChange(device.value)}
            >
              {device.icon}
            </RailButton>
          ))}
        </div>

        <div className="mt-1 flex flex-col items-center gap-0.5 rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <RailButton
            title="ביטול"
            disabled={!canUndo || busy}
            onClick={onUndo}
          >
            <Undo2 className="h-4 w-4" />
          </RailButton>
          <RailButton
            title="ביצוע מחדש"
            disabled={!canRedo || busy}
            onClick={onRedo}
          >
            <Redo2 className="h-4 w-4" />
          </RailButton>
        </div>
      </div>
    </aside>
  );
}

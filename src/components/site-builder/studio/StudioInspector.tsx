import React from "react";
import type { InspectorTab } from "./types";

type Props = {
  activeTab: InspectorTab;
  setActiveTab: (tab: InspectorTab) => void;
  stylesRef: React.RefObject<HTMLDivElement>;
  traitsRef: React.RefObject<HTMLDivElement>;
  onSetBackgroundImage: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
};

export default function StudioInspector({
  activeTab,
  setActiveTab,
  stylesRef,
  traitsRef,
  onSetBackgroundImage,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
}: Props) {
  return (
    <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-14 shrink-0 border-b border-slate-200">
        <Tab active={activeTab === "design"} onClick={() => setActiveTab("design")}>
          עיצוב
        </Tab>
        <Tab active={activeTab === "settings"} onClick={() => setActiveTab("settings")}>
          הגדרות
        </Tab>
        <Tab active={activeTab === "animations"} onClick={() => setActiveTab("animations")}>
          תנועה
        </Tab>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {activeTab === "design" && (
          <>
            <PanelTitle
              title="עיצוב אלמנט"
              subtitle="צבעים, פונטים, רקע, ריווח, פינות, גבול וצל"
            />

            <div className="mb-5 grid grid-cols-2 gap-2">
              <ActionButton onClick={onSetBackgroundImage}>
                תמונת רקע
              </ActionButton>
              <ActionButton onClick={onDuplicate}>
                שכפול
              </ActionButton>
              <ActionButton onClick={onBringForward}>
                קדימה
              </ActionButton>
              <ActionButton onClick={onSendBackward}>
                אחורה
              </ActionButton>
              <ActionButton danger onClick={onDelete}>
                מחיקה
              </ActionButton>
            </div>

            <div ref={stylesRef} />
          </>
        )}

        {activeTab === "settings" && (
          <>
            <PanelTitle
              title="הגדרות אלמנט"
              subtitle="קישורים, פעולות, תמונות, שדות והגדרות מתקדמות"
            />
            <div ref={traitsRef} />
          </>
        )}

        {activeTab === "animations" && (
          <>
            <PanelTitle
              title="אנימציות"
              subtitle="אפקטי כניסה, hover, מעבר וגלילה"
            />

            <AnimationButton label="Fade Up" value='data-animate="fade-up"' />
            <AnimationButton label="Zoom In" value='data-animate="zoom-in"' />
            <AnimationButton label="Hover Lift" value="מוגדר בכרטיסים" />
            <AnimationButton label="Carousel" value="קיים באלמנט קרוסלה" />
            <AnimationButton label="Parallax" value="יתווסף בשלב הבא" />
          </>
        )}
      </div>
    </aside>
  );
}

function Tab({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex-1 text-sm font-black transition",
        active
          ? "border-b-2 border-violet-700 bg-violet-50 text-violet-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-3 py-3 text-xs font-black transition",
        danger
          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function AnimationButton({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 rounded-3xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-black text-slate-950">{label}</p>
      <p className="mt-1 text-xs font-bold text-slate-400">{value}</p>
    </div>
  );
}
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bot, GripVertical, Mail, MessageCircle, Phone, X } from "lucide-react";

import {
  buildWhatsAppUrl,
  findSmartBotNode,
  mergeSmartBotSettings,
  type SmartBotSettings,
  type SmartBotTreeOption,
} from "./smartBotUtils";

type ChatLine = {
  id: string;
  role: "bot" | "user";
  text: string;
};

type SmartBotWidgetProps = {
  settings?: Partial<SmartBotSettings> | null;
  mode?: "live" | "editor";
  onPositionChange?: (pos: { x: number; y: number }) => void;
};

export default function SmartBotWidget({
  settings: settingsProp,
  mode = "live",
  onPositionChange,
}: SmartBotWidgetProps) {
  const settings = useMemo(
    () => mergeSmartBotSettings(settingsProp),
    [settingsProp]
  );
  const isEditor = mode === "editor";
  const position = settings.triggerPosition || { x: 92, y: 82 };

  const [open, setOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [nodeId, setNodeId] = useState(settings.startNodeId || "welcome");
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [dragPos, setDragPos] = useState(position);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineCounter = useRef(0);

  const currentNode = useMemo(
    () => findSmartBotNode(settings, nodeId),
    [settings, nodeId]
  );

  useEffect(() => {
    setDragPos(position);
  }, [position.x, position.y]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines, open, showContact, currentNode]);

  const pushLine = useCallback((role: "bot" | "user", text: string) => {
    lineCounter.current += 1;
    setLines((prev) => [
      ...prev,
      { id: `line-${lineCounter.current}`, role, text },
    ]);
  }, []);

  const openBot = useCallback(() => {
    setOpen(true);
    setShowContact(false);
    const startId = settings.startNodeId || settings.nodes?.[0]?.id || "welcome";
    setNodeId(startId);
    const startNode = findSmartBotNode(settings, startId);
    const welcome =
      settings.welcomeMessage ||
      startNode?.message ||
      "שלום! איך אפשר לעזור?";
    lineCounter.current = 0;
    setLines([{ id: "line-0", role: "bot", text: welcome }]);
  }, [settings]);

  const closeBot = useCallback(() => {
    setOpen(false);
    setShowContact(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeBot();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeBot]);

  function onPointerDown(e: React.PointerEvent) {
    if (!isEditor) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: dragPos.x,
      origY: dragPos.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor) return;
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    const dx = ((e.clientX - dragRef.current.startX) / vw) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / vh) * 100;
    setDragPos({
      x: Math.min(96, Math.max(4, dragRef.current.origX + dx)),
      y: Math.min(96, Math.max(4, dragRef.current.origY + dy)),
    });
  }

  function onPointerUp() {
    if (!dragRef.current || !isEditor) return;
    dragRef.current = null;
    onPositionChange?.(dragPos);
  }

  function handleOption(option: SmartBotTreeOption) {
    if (isEditor) return;
    pushLine("user", option.label);

    if (option.action === "contact") {
      setShowContact(true);
      pushLine("bot", "בחרו איך ליצור קשר:");
      return;
    }

    if (option.action === "open-link" && option.payload?.url) {
      window.open(String(option.payload.url), "_blank", "noopener,noreferrer");
      return;
    }

    const nextId = option.nextNodeId;
    if (!nextId) return;
    const next = findSmartBotNode(settings, nextId);
    if (!next) return;
    setNodeId(next.id);
    setShowContact(false);
    pushLine("bot", next.message);
  }

  if (settings.isActive === false) return null;

  const triggerStyle = settings.triggerStyle || "both";
  const showIcon = triggerStyle === "icon" || triggerStyle === "both";
  const showLabel = triggerStyle === "label" || triggerStyle === "both";
  const triggerColor = settings.triggerColor || "#0F766E";
  const triggerTextColor = settings.triggerTextColor || "#FFFFFF";
  const headerColor = settings.windowHeaderColor || "#0F766E";
  const windowBg = settings.windowBgColor || "#FFFFFF";
  const botBubble = settings.botBubbleColor || "#F1F5F9";
  const botText = settings.botBubbleTextColor || "#0F172A";
  const userBubble = settings.userBubbleColor || "#0F766E";
  const userText = settings.userBubbleTextColor || "#FFFFFF";

  const phone = String(settings.contactPhone || "").trim();
  const whatsapp = String(settings.contactWhatsapp || phone).trim();
  const email = String(settings.contactEmail || "").trim();
  const hasContact =
    settings.contactEnabled !== false && Boolean(phone || whatsapp || email);

  const options =
    showContact || !currentNode
      ? []
      : currentNode.options || [];

  return (
    <div data-bizuply-smart-bot="true" dir="rtl">
      {!open ? (
        <div
          className="fixed z-[99980]"
          style={{
            left: `${dragPos.x}%`,
            top: `${dragPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {isEditor ? (
            <span
              className="absolute -left-2 -top-2 flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-slate-900/80 text-white"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <GripVertical size={12} />
            </span>
          ) : null}

          <button
            type="button"
            onClick={openBot}
            aria-label={settings.triggerLabel || "צריכים עזרה?"}
            className={`flex items-center gap-2 shadow-lg transition hover:scale-105 ${
              showLabel && showIcon
                ? "rounded-full px-4 py-3"
                : showLabel
                  ? "rounded-full px-4 py-3"
                  : "h-14 w-14 justify-center rounded-full"
            }`}
            style={{ background: triggerColor, color: triggerTextColor }}
          >
            {showIcon ? <Bot size={22} /> : null}
            {showLabel ? (
              <span className="text-sm font-bold whitespace-nowrap">
                {settings.triggerLabel || "צריכים עזרה?"}
              </span>
            ) : null}
          </button>
        </div>
      ) : null}

      {open ? (
        <div className="fixed bottom-4 right-4 z-[99990] w-[min(100vw-1.5rem,380px)]">
          <div
            className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl"
            style={{ background: windowBg }}
          >
            <header
              className="flex items-center justify-between gap-3 px-4 py-3 text-white"
              style={{ background: headerColor }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
                  <Bot size={20} />
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-sm font-black">
                    {settings.botName || "בוט חכם"}
                  </strong>
                  <span className="block text-[11px] font-semibold text-white/80">
                    אונליין · עונה מיד
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeBot}
                aria-label="סגירה"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <X size={16} />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="max-h-[min(50vh,360px)] space-y-3 overflow-y-auto px-4 py-4"
            >
              {lines.map((line) => (
                <div
                  key={line.id}
                  className={`flex ${line.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm font-medium leading-6"
                    style={
                      line.role === "user"
                        ? { background: userBubble, color: userText }
                        : { background: botBubble, color: botText }
                    }
                  >
                    {line.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 px-3 py-3">
              {showContact && hasContact ? (
                <div className="grid gap-2">
                  {phone ? (
                    <a
                      href={`tel:${phone}`}
                      className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white"
                      style={{ background: headerColor }}
                    >
                      <Phone size={16} />
                      {settings.contactLabel || "צרו קשר"} · טלפון
                    </a>
                  ) : null}
                  {whatsapp ? (
                    <a
                      href={buildWhatsAppUrl(
                        whatsapp,
                        `שלום, פניתי דרך הבוט באתר`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  ) : null}
                  {email ? (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700"
                    >
                      <Mail size={16} />
                      אימייל
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setShowContact(false)}
                    className="text-xs font-semibold text-slate-500"
                  >
                    חזרה לשיחה
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleOption(option)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      {option.label}
                    </button>
                  ))}
                  {settings.contactEnabled !== false ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditor) return;
                        pushLine("user", settings.contactLabel || "צרו קשר");
                        setShowContact(true);
                        pushLine("bot", "בחרו איך ליצור קשר:");
                      }}
                      className="rounded-full px-3 py-2 text-xs font-bold text-white"
                      style={{ background: headerColor }}
                    >
                      {settings.contactLabel || "צרו קשר"}
                    </button>
                  ) : null}
                  {!options.length && settings.contactEnabled === false ? (
                    <p className="w-full text-center text-xs text-slate-500">
                      אין אפשרויות בשלב זה
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

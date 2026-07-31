import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bot, GripVertical, Mail, MessageCircle, Phone, Send, X } from "lucide-react";

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
  const position = settings.triggerPosition || { x: 8, y: 82 };

  const [open, setOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [awaitingInput, setAwaitingInput] = useState<SmartBotTreeOption | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");
  const [nodeId, setNodeId] = useState(settings.startNodeId || "welcome");
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [dragPos, setDragPos] = useState(position);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const dragPosRef = useRef(dragPos);
  const suppressClickRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineCounter = useRef(0);

  const currentNode = useMemo(
    () => findSmartBotNode(settings, nodeId),
    [settings, nodeId]
  );

  useEffect(() => {
    dragPosRef.current = dragPos;
  }, [dragPos]);

  useEffect(() => {
    if (dragRef.current) return;
    setDragPos(position);
  }, [position.x, position.y]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines, open, showContact, awaitingInput, currentNode]);

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
    setAwaitingInput(null);
    setInputValue("");
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
    setAwaitingInput(null);
    setInputValue("");
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
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: dragPosRef.current.x,
      origY: dragPosRef.current.y,
      moved: false,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor) return;
    if (e.pointerId !== dragRef.current.pointerId) return;
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    const dx = ((e.clientX - dragRef.current.startX) / vw) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / vh) * 100;
    if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
      dragRef.current.moved = true;
    }
    // right/bottom positioning (RTL-friendly), invert X like benefits-wheel
    const next = {
      x: Math.min(96, Math.max(4, dragRef.current.origX - dx)),
      y: Math.min(96, Math.max(4, dragRef.current.origY + dy)),
    };
    dragPosRef.current = next;
    setDragPos(next);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor) return;
    if (e.pointerId !== dragRef.current.pointerId) return;
    const moved = dragRef.current.moved;
    dragRef.current = null;
    if (moved) {
      suppressClickRef.current = true;
      onPositionChange?.(dragPosRef.current);
      e.preventDefault();
      e.stopPropagation();
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }

  function handleOption(option: SmartBotTreeOption) {
    pushLine("user", option.label);
    const action = option.action || (option.nextNodeId ? "next" : "reply");

    if (action === "contact") {
      setShowContact(true);
      setAwaitingInput(null);
      pushLine("bot", "בחרו איך ליצור קשר:");
      return;
    }

    if (action === "open-link") {
      const url = option.payload?.url;
      if (url && !isEditor) {
        window.open(String(url), "_blank", "noopener,noreferrer");
      }
      if (option.replyText) pushLine("bot", option.replyText);
      return;
    }

    if (action === "end") {
      pushLine(
        "bot",
        option.replyText || "תודה שפניתם אלינו! אנחנו כאן אם תצטרכו משהו נוסף."
      );
      setAwaitingInput(null);
      return;
    }

    if (action === "ask-input") {
      setAwaitingInput(option);
      setShowContact(false);
      pushLine(
        "bot",
        option.payload?.prompt ||
          "כתבו לנו כאן את השאלה או הפרטים:"
      );
      return;
    }

    if (action === "reply") {
      if (option.replyText) pushLine("bot", option.replyText);
      if (option.nextNodeId) {
        const next = findSmartBotNode(settings, option.nextNodeId);
        if (next && next.id !== nodeId) {
          setNodeId(next.id);
          if (next.message && next.message !== option.replyText) {
            pushLine("bot", next.message);
          }
        }
      }
      setAwaitingInput(null);
      setShowContact(false);
      return;
    }

    // next
    const nextId = option.nextNodeId;
    if (!nextId) {
      if (option.replyText) pushLine("bot", option.replyText);
      return;
    }
    const next = findSmartBotNode(settings, nextId);
    if (!next) return;
    setNodeId(next.id);
    setShowContact(false);
    setAwaitingInput(null);
    pushLine("bot", next.message);
  }

  function submitManualInput() {
    const text = inputValue.trim();
    if (!text || !awaitingInput) return;
    pushLine("user", text);
    setInputValue("");
    const option = awaitingInput;
    setAwaitingInput(null);

    pushLine(
      "bot",
      option.replyText || "תודה! קיבלנו את ההודעה ונחזור אליכם בהקדם."
    );

    if (option.nextNodeId) {
      const next = findSmartBotNode(settings, option.nextNodeId);
      if (next) {
        setNodeId(next.id);
        if (next.message) pushLine("bot", next.message);
      }
    }
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
    showContact || awaitingInput || !currentNode ? [] : currentNode.options || [];

  return (
    <div data-bizuply-smart-bot="true" dir="rtl">
      <button
        type="button"
        onClick={() => {
          if (suppressClickRef.current) return;
          if (open) closeBot();
          else openBot();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label={settings.triggerLabel || "צריכים עזרה?"}
        className={`fixed z-[99990] flex items-center gap-2 shadow-lg transition hover:scale-105 ${
          isEditor ? "cursor-grab active:cursor-grabbing ring-2 ring-teal-400 ring-offset-2" : ""
        } ${
          showLabel
            ? "rounded-full px-4 py-3"
            : "h-14 w-14 justify-center rounded-full"
        }`}
        style={{
          right: `${dragPos.x}%`,
          bottom: `${100 - dragPos.y}%`,
          transform: "translate(50%, 50%)",
          background: triggerColor,
          color: triggerTextColor,
        }}
      >
        {isEditor ? <GripVertical size={14} className="opacity-80" /> : null}
        {showIcon ? <Bot size={22} /> : null}
        {showLabel ? (
          <span className="text-sm font-bold whitespace-nowrap">
            {settings.triggerLabel || "צריכים עזרה?"}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="fixed z-[99995] w-[min(100vw-1.5rem,380px)]"
          style={{
            right: `max(0.75rem, calc(${dragPos.x}% - 8px))`,
            bottom: `max(5.5rem, calc(${100 - dragPos.y}% + 36px))`,
          }}
        >
          <div
            className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl"
            style={{ background: windowBg }}
            onPointerDown={(e) => e.stopPropagation()}
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
                    {isEditor ? "תצוגה מקדימה בעורך" : "אונליין · עונה מיד"}
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
                      href={isEditor ? undefined : `tel:${phone}`}
                      onClick={(e) => {
                        if (isEditor) e.preventDefault();
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white"
                      style={{ background: headerColor }}
                    >
                      <Phone size={16} />
                      {settings.contactLabel || "צרו קשר"} · טלפון
                    </a>
                  ) : null}
                  {whatsapp ? (
                    <a
                      href={
                        isEditor
                          ? undefined
                          : buildWhatsAppUrl(whatsapp, `שלום, פניתי דרך הבוט באתר`)
                      }
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        if (isEditor) e.preventDefault();
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  ) : null}
                  {email ? (
                    <a
                      href={isEditor ? undefined : `mailto:${email}`}
                      onClick={(e) => {
                        if (isEditor) e.preventDefault();
                      }}
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
              ) : awaitingInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitManualInput();
                    }}
                    placeholder="כתבו תשובה כאן..."
                    className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
                  />
                  <button
                    type="button"
                    onClick={submitManualInput}
                    className="grid h-11 w-11 place-items-center rounded-xl text-white"
                    style={{ background: headerColor }}
                    aria-label="שליחה"
                  >
                    <Send size={16} />
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

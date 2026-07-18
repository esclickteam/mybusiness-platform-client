import React, { useCallback, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCopy,
  ExternalLink,
  ListTodo,
  Loader2,
  Megaphone,
  MessageCircle,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

export type AdvisorAction = {
  type: string;
  label: string;
  description?: string;
  requiresConfirmation?: boolean;
  executed?: boolean;
  payload?: Record<string, unknown>;
};

export type ExecutedAction = {
  tool?: string;
  actionType?: string;
  message?: string;
  data?: {
    content?: string;
    phone?: string;
    whatsappUrl?: string;
    ownerSendsManually?: boolean;
  };
};

export type WhatsAppPrepared = {
  content: string;
  phone?: string;
  whatsappUrl: string;
};

type ActionMeta = {
  icon: React.ElementType;
  accent: string;
  hint: string;
};

const ACTION_META: Record<string, ActionMeta> = {
  CREATE_TASK: {
    icon: ListTodo,
    accent: "violet",
    hint: "נוצרת משימה ב-CRM",
  },
  CREATE_TASKS: {
    icon: ListTodo,
    accent: "violet",
    hint: "מספר משימות לביצוע",
  },
  CREATE_APPOINTMENT: {
    icon: CalendarDays,
    accent: "sky",
    hint: "פגישה חדשה ביומן",
  },
  CREATE_WEEKLY_PLAN: {
    icon: CalendarDays,
    accent: "indigo",
    hint: "שמירה כתכנית + משימות",
  },
  CREATE_MONTHLY_PLAN: {
    icon: CalendarDays,
    accent: "indigo",
    hint: "שמירה כתכנית + משימות",
  },
  CREATE_MARKETING_MESSAGE: {
    icon: MessageCircle,
    accent: "emerald",
    hint: "הודעה מוכנה — אתה שולח",
  },
  CREATE_POST: {
    icon: Megaphone,
    accent: "amber",
    hint: "תוכן לעמוד העסק",
  },
  OPEN_LEADS: {
    icon: Users,
    accent: "rose",
    hint: "מעבר למסך לידים",
  },
  OPEN_CLIENTS: {
    icon: Users,
    accent: "rose",
    hint: "מעבר ללקוחות",
  },
  OPEN_COLLABORATIONS: {
    icon: Search,
    accent: "cyan",
    hint: "מעבר לשיתופי פעולה",
  },
  OPEN_APPOINTMENTS: {
    icon: CalendarDays,
    accent: "sky",
    hint: "מעבר ליומן",
  },
  CUSTOM: {
    icon: Sparkles,
    accent: "violet",
    hint: "פעולה מותאמת",
  },
};

const ACCENT_STYLES: Record<string, string> = {
  violet: "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100",
  sky: "border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100",
  emerald:
    "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100",
  amber: "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100",
  rose: "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100",
};

export function getActionMeta(type: string): ActionMeta {
  return (
    ACTION_META[type] || {
      icon: Zap,
      accent: "violet",
      hint: "לחץ לביצוע",
    }
  );
}

export function stripExecutedSummaryFromAnswer(content: string): string {
  return content
    .replace(/\n---\n\*\*פעולות שבוצעו:\*\*[\s\S]*$/i, "")
    .trim();
}

function decodeWaText(value: string) {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function normalizeExtractedPhone(raw: string) {
  const digits = raw.replace(/[^\d+]/g, "");
  return digits || raw.trim();
}

export function extractWhatsAppFromAnswer(content: string): {
  displayContent: string;
  extracted: WhatsAppPrepared[];
} {
  const extracted: WhatsAppPrepared[] = [];
  let displayContent = content;

  const linkRegex =
    /https?:\/\/wa\.me\/([^?\s)\]"']+)(?:\?text=([^)\s\]"']+))?/gi;

  displayContent = displayContent.replace(linkRegex, (full, phoneRaw, textRaw) => {
    const phone = normalizeExtractedPhone(phoneRaw);
    const message = textRaw ? decodeWaText(textRaw) : "";

    if (message) {
      extracted.push({
        phone,
        content: message,
        whatsappUrl: full,
      });
    }

    return "";
  });

  const blockRegex =
    /(?:^|\n)(?:#{1,3}\s*)?(?:\*\*)?(?:הודע(?:ת|ה)\s*(?:WhatsApp|וואטסאפ|whatsapp)|נוסח(?:\s+הודעה)?(?:\s+מוכן)?)(?:\*\*)?[^\n]*\n+([\s\S]{10,800}?)(?=\n\n|\n#{1,3}\s|\n(?:\*|_)?(?:הצע|פעול|שלב|סיכום)|$)/gi;

  displayContent = displayContent.replace(blockRegex, (_full, body: string) => {
    const cleanBody = body
      .replace(/^>\s?/gm, "")
      .replace(/^\*\s+/gm, "")
      .replace(/\*\*/g, "")
      .trim();

    if (cleanBody.length < 8) return _full;

    const phoneMatch = cleanBody.match(
      /(?:אל|טלפון|ללקוח)[:\s]*([0-9+\-() ]{9,15})/i
    );
    const phone = phoneMatch ? normalizeExtractedPhone(phoneMatch[1]) : undefined;
    const message = cleanBody
      .replace(/(?:אל|טלפון|ללקוח)[:\s]*[0-9+\-() ]{9,15}\s*/i, "")
      .trim();

    if (!message) return _full;

    const whatsappUrl = phone
      ? `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    extracted.push({
      phone,
      content: message,
      whatsappUrl,
    });

    return "";
  });

  displayContent = displayContent.replace(/\n{3,}/g, "\n\n").trim();

  return { displayContent, extracted };
}

export function WhatsAppPreparedCard({
  prepared,
}: {
  prepared: WhatsAppPrepared;
}) {
  const [copied, setCopied] = useState(false);

  const copyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prepared.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [prepared.content]);

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-emerald-100 bg-emerald-600/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <MessageCircle className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-black text-emerald-900">
              הודעת WhatsApp מוכנה
            </p>
            <p className="text-[11px] font-bold text-emerald-700/80">
              אתה פותח ושולח — אין שליחה אוטומטית
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {prepared.phone && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="rounded-lg bg-white px-2 py-1 ring-1 ring-slate-200">
              אל: {prepared.phone}
            </span>
          </div>
        )}

        <div className="relative">
          <p className="whitespace-pre-wrap rounded-xl border border-emerald-100 bg-white p-4 text-sm font-semibold leading-7 text-slate-800">
            {prepared.content}
          </p>
          <button
            type="button"
            onClick={() => void copyText()}
            className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/95 px-2 py-1 text-[11px] font-black text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ClipboardCopy className="h-3 w-3" />
            {copied ? "הועתק!" : "העתק"}
          </button>
        </div>

        <a
          href={prepared.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-300/40 transition hover:bg-[#1fb855]"
        >
          <MessageCircle className="h-5 w-5" />
          שלח הודעה ב-WhatsApp
        </a>
      </div>
    </div>
  );
}

export function AdvisorExecutedStrip({
  items,
  renderWhatsApp,
}: {
  items: ExecutedAction[];
  renderWhatsApp: (prepared: WhatsAppPrepared) => React.ReactNode;
}) {
  if (!items.length) return null;

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
        ✓ בוצע במערכת
      </p>
      {items.map((item, i) => {
        const waUrl = item.data?.whatsappUrl;
        const waContent = item.data?.content;

        if (waUrl && waContent) {
          return (
            <div key={`exec-wa-${i}`}>
              {renderWhatsApp({
                content: waContent,
                phone: item.data?.phone,
                whatsappUrl: waUrl,
              })}
            </div>
          );
        }

        return (
          <div
            key={`exec-${i}`}
            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2.5"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p className="text-sm font-bold leading-6 text-emerald-900">
              {item.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function AdvisorActionsPanel({
  actions,
  actionLoading,
  disabled,
  onAction,
}: {
  actions: AdvisorAction[];
  actionLoading: string | null;
  disabled: boolean;
  onAction: (action: AdvisorAction) => void;
}) {
  const visible = actions.filter((a) => !a.executed);
  if (!visible.length) return null;

  const whatsappActions = visible.filter((a) =>
    ["CREATE_MARKETING_MESSAGE", "SEND_MESSAGE", "SEND_CLIENT_MESSAGE"].includes(
      a.type
    )
  );
  const otherActions = visible.filter(
    (a) =>
      !["CREATE_MARKETING_MESSAGE", "SEND_MESSAGE", "SEND_CLIENT_MESSAGE"].includes(
        a.type
      )
  );

  return (
    <div className="mt-5 space-y-3">
      {whatsappActions.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3">
          <p className="mb-2 text-xs font-black text-emerald-800">
            הודעות מוכנות לשליחה שלך
          </p>
          <div className="space-y-2">
            {whatsappActions.map((action) => {
              const isLoading = actionLoading === action.type;

              return (
                <button
                  key={`${action.type}-${action.label}`}
                  type="button"
                  disabled={disabled || !!actionLoading}
                  onClick={() => onAction(action)}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-[#1fb855] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <MessageCircle className="h-5 w-5" />
                  )}
                  {action.label.includes("WhatsApp")
                    ? action.label
                    : `שלח: ${action.label}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {otherActions.length > 0 && (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <p className="text-sm font-black text-slate-900">הצעדים הבאים</p>
        <p className="text-xs font-semibold text-slate-500">
          לחץ לביצוע — פעולות רגישות יבקשו אישור
        </p>
      </div>

      <div className="grid gap-2 p-3 sm:grid-cols-2">
        {otherActions.map((action) => {
          const meta = getActionMeta(action.type);
          const Icon = meta.icon;
          const style =
            ACCENT_STYLES[meta.accent] || ACCENT_STYLES.violet;
          const isLoading = actionLoading === action.type;

          return (
            <button
              key={`${action.type}-${action.label}`}
              type="button"
              disabled={disabled || !!actionLoading}
              onClick={() => onAction(action)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-right transition disabled:cursor-not-allowed disabled:opacity-50 ${style}`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 shadow-sm">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black leading-6">
                  {action.label}
                </span>
                <span className="block text-[11px] font-semibold opacity-80">
                  {action.description || meta.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
      )}
    </div>
  );
}

const LOADING_STEPS = [
  "קורא נתוני עסק...",
  "מנתח לידים ופגישות...",
  "מכין תשובה ופעולות...",
];

export function AdvisorThinkingLoader() {
  const [step, setStep] = useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % LOADING_STEPS.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="flex max-w-md gap-3 rounded-[22px] border border-violet-100 bg-white px-4 py-4 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </span>
        <div>
          <p className="text-sm font-black text-slate-900">היועץ עובד...</p>
          <p className="mt-1 text-xs font-bold text-violet-600 transition-all">
            {LOADING_STEPS[step]}
          </p>
          <div className="mt-2 flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const CAPABILITY_PILLS = [
  "פגישות",
  "משימות",
  "לידים",
  "WhatsApp מוכן",
  "שותפים",
];

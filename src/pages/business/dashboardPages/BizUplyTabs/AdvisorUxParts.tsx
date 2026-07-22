import React, { useCallback, useState } from "react";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCopy,
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
  hintKey: string;
};

const ACTION_META: Record<string, Omit<ActionMeta, "hintKey"> & { hintKey: string }> = {
  CREATE_TASK: {
    icon: ListTodo,
    accent: "violet",
    hintKey: "advisor.actionHints.CREATE_TASK",
  },
  CREATE_TASKS: {
    icon: ListTodo,
    accent: "violet",
    hintKey: "advisor.actionHints.CREATE_TASKS",
  },
  CREATE_APPOINTMENT: {
    icon: CalendarDays,
    accent: "sky",
    hintKey: "advisor.actionHints.CREATE_APPOINTMENT",
  },
  CREATE_WEEKLY_PLAN: {
    icon: CalendarDays,
    accent: "indigo",
    hintKey: "advisor.actionHints.CREATE_WEEKLY_PLAN",
  },
  CREATE_MONTHLY_PLAN: {
    icon: CalendarDays,
    accent: "indigo",
    hintKey: "advisor.actionHints.CREATE_MONTHLY_PLAN",
  },
  CREATE_MARKETING_MESSAGE: {
    icon: MessageCircle,
    accent: "emerald",
    hintKey: "advisor.actionHints.CREATE_MARKETING_MESSAGE",
  },
  CREATE_POST: {
    icon: Megaphone,
    accent: "amber",
    hintKey: "advisor.actionHints.CREATE_POST",
  },
  OPEN_LEADS: {
    icon: Users,
    accent: "rose",
    hintKey: "advisor.actionHints.OPEN_LEADS",
  },
  OPEN_CLIENTS: {
    icon: Users,
    accent: "rose",
    hintKey: "advisor.actionHints.OPEN_CLIENTS",
  },
  OPEN_COLLABORATIONS: {
    icon: Search,
    accent: "cyan",
    hintKey: "advisor.actionHints.OPEN_COLLABORATIONS",
  },
  OPEN_APPOINTMENTS: {
    icon: CalendarDays,
    accent: "sky",
    hintKey: "advisor.actionHints.OPEN_APPOINTMENTS",
  },
  CUSTOM: {
    icon: Sparkles,
    accent: "violet",
    hintKey: "advisor.actionHints.CUSTOM",
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

export function getCapabilityPills(t: TFunction) {
  return [
    t("advisor.capabilityPills.meetings"),
    t("advisor.capabilityPills.tasks"),
    t("advisor.capabilityPills.leads"),
    t("advisor.capabilityPills.whatsapp"),
    t("advisor.capabilityPills.partners"),
  ];
}

export function getActionMeta(type: string, t: TFunction) {
  const meta = ACTION_META[type];

  if (meta) {
    return {
      icon: meta.icon,
      accent: meta.accent,
      hint: t(meta.hintKey),
    };
  }

  return {
    icon: Zap,
    accent: "violet",
    hint: t("advisor.actionHints.fallback"),
  };
}

export function stripExecutedSummaryFromAnswer(content: string): string {
  return content
    .replace(/\n---\n\*\*פעולות שבוצעו:\*\*[\s\S]*$/i, "")
    .replace(/\n---\n\*\*Actions executed:\*\*[\s\S]*$/i, "")
    .replace(/\n---\n\*\*Actions completed:\*\*[\s\S]*$/i, "")
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
    /(?:^|\n)(?:#{1,3}\s*)?(?:\*\*)?(?:הודע(?:ת|ה)\s*(?:WhatsApp|וואטסאפ|whatsapp)|WhatsApp message|Ready message)(?:\*\*)?[^\n]*\n+([\s\S]{10,800}?)(?=\n\n|\n#{1,3}\s|\n(?:\*|_)?(?:הצע|פעול|שלב|סיכום|Suggest|Action|Step|Summary)|$)/gi;

  displayContent = displayContent.replace(blockRegex, (_full, body: string) => {
    const cleanBody = body
      .replace(/^>\s?/gm, "")
      .replace(/^\*\s+/gm, "")
      .replace(/\*\*/g, "")
      .trim();

    if (cleanBody.length < 8) return _full;

    const phoneMatch = cleanBody.match(
      /(?:אל|טלפון|ללקוח|To|Phone|Customer)[:\s]*([0-9+\-() ]{9,15})/i
    );
    const phone = phoneMatch ? normalizeExtractedPhone(phoneMatch[1]) : undefined;
    const message = cleanBody
      .replace(/(?:אל|טלפון|ללקוח|To|Phone|Customer)[:\s]*[0-9+\-() ]{9,15}\s*/i, "")
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
  const { t } = useTranslation();
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
              {t("advisor.whatsappCard.title")}
            </p>
            <p className="text-[11px] font-bold text-emerald-700/80">
              {t("advisor.whatsappCard.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {prepared.phone && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="rounded-lg bg-white px-2 py-1 ring-1 ring-slate-200">
              {t("advisor.whatsappCard.to")} {prepared.phone}
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
            {copied ? t("advisor.whatsappCard.copied") : t("advisor.whatsappCard.copy")}
          </button>
        </div>

        <a
          href={prepared.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-black text-black shadow-lg shadow-emerald-300/40 transition hover:bg-[#1fb855]"
        >
          <MessageCircle className="h-5 w-5" />
          {t("advisor.whatsappCard.send")}
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
  const { t } = useTranslation();

  if (!items.length) return null;

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
        {t("advisor.executedLabel")}
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
  const { t } = useTranslation();
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
            {t("advisor.actionsPanel.readyMessages")}
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
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-black text-black shadow-md transition hover:bg-[#1fb855] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <BizuplyLoader size="sm" compact />
                  ) : (
                    <MessageCircle className="h-5 w-5" />
                  )}
                  {action.label.includes("WhatsApp")
                    ? action.label
                    : `${t("advisor.actionsPanel.sendPrefix")} ${action.label}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {otherActions.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80">
          <div className="border-b border-slate-200 bg-white px-4 py-3">
            <p className="text-sm font-black text-slate-900">
              {t("advisor.actionsPanel.nextSteps")}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {t("advisor.actionsPanel.nextStepsHint")}
            </p>
          </div>

          <div className="grid gap-2 p-3 sm:grid-cols-2">
            {otherActions.map((action) => {
              const meta = getActionMeta(action.type, t);
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
                  className={`flex items-start gap-3 rounded-xl border p-3 text-start transition disabled:cursor-not-allowed disabled:opacity-50 ${style}`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 shadow-sm">
                    {isLoading ? (
                      <BizuplyLoader size="xs" compact />
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

export function AdvisorThinkingLoader() {
  const { t } = useTranslation();
  const loadingSteps = [
    t("advisor.thinkingSteps.data"),
    t("advisor.thinkingSteps.analyze"),
    t("advisor.thinkingSteps.prepare"),
  ];
  const [step, setStep] = useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % loadingSteps.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, [loadingSteps.length]);

  return (
    <div className="flex justify-start">
      <div className="flex max-w-md gap-3 rounded-[22px] border border-violet-100 bg-white px-4 py-4 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </span>
        <div>
          <p className="text-sm font-black text-slate-900">
            {t("advisor.thinkingTitle")}
          </p>
          <p className="mt-1 text-xs font-bold text-violet-600 transition-all">
            {loadingSteps[step]}
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


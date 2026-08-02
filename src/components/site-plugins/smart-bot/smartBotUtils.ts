export type SmartBotOptionAction =
  | "next"
  | "contact"
  | "reply"
  | "ask-input"
  | "end"
  | "open-link";

export type SmartBotTreeOption = {
  id: string;
  label: string;
  nextNodeId?: string;
  action?: SmartBotOptionAction;
  /** Custom bot reply text for reply / ask-input / end */
  replyText?: string;
  payload?: Record<string, string>;
};

export type SmartBotTreeNode = {
  id: string;
  title: string;
  message: string;
  options: SmartBotTreeOption[];
};

export type SmartBotTriggerStyle = "icon" | "label" | "both";

export type SmartBotSettings = {
  isActive?: boolean;
  botName?: string;
  welcomeMessage?: string;
  triggerStyle?: SmartBotTriggerStyle;
  triggerLabel?: string;
  triggerPosition?: { x: number; y: number };
  /** right-bottom = CSS right/bottom (current). left-top = legacy left/top. */
  positionAnchor?: "right-bottom" | "left-top";
  triggerColor?: string;
  triggerTextColor?: string;
  windowHeaderColor?: string;
  windowBgColor?: string;
  botBubbleColor?: string;
  botBubbleTextColor?: string;
  userBubbleColor?: string;
  userBubbleTextColor?: string;
  contactEnabled?: boolean;
  contactLabel?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactEmail?: string;
  startNodeId?: string;
  nodes?: SmartBotTreeNode[];
};

const DEFAULT_NODES: SmartBotTreeNode[] = [
  {
    id: "welcome",
    title: "פתיחה",
    message: "שלום! במה אפשר לעזור?",
    options: [
      { id: "opt-services", label: "מידע על השירותים", action: "next", nextNodeId: "services" },
      {
        id: "opt-custom",
        label: "שאלה אחרת",
        action: "ask-input",
        replyText: "תודה! נחזור אליכם בהקדם עם מענה.",
        payload: { prompt: "כתבו לנו כאן את השאלה או הפרטים:" },
      },
      { id: "opt-contact", label: "יצירת קשר", action: "contact" },
    ],
  },
  {
    id: "services",
    title: "שירותים",
    message: "נשמח לספר על השירותים שלנו. בחרו אפשרות:",
    options: [
      {
        id: "opt-reply",
        label: "מה כלול?",
        action: "reply",
        replyText: "אנחנו מציעים ליווי מלא, תיאום תורים ומענה מהיר בוואטסאפ.",
        nextNodeId: "services",
      },
      { id: "opt-back", label: "חזרה לתפריט", action: "next", nextNodeId: "welcome" },
      { id: "opt-contact-2", label: "יצירת קשר", action: "contact" },
    ],
  },
];

export const SMART_BOT_DEFAULTS: Required<
  Pick<
    SmartBotSettings,
    | "isActive"
    | "botName"
    | "welcomeMessage"
    | "triggerStyle"
    | "triggerLabel"
    | "triggerPosition"
    | "triggerColor"
    | "triggerTextColor"
    | "windowHeaderColor"
    | "windowBgColor"
    | "botBubbleColor"
    | "botBubbleTextColor"
    | "userBubbleColor"
    | "userBubbleTextColor"
    | "contactEnabled"
    | "contactLabel"
    | "contactPhone"
    | "contactWhatsapp"
    | "contactEmail"
    | "startNodeId"
    | "nodes"
  >
> = {
  isActive: true,
  botName: "בוט חכם",
  welcomeMessage: "שלום! איך אפשר לעזור לכם היום?",
  triggerStyle: "both",
  triggerLabel: "צריכים עזרה?",
  triggerPosition: { x: 8, y: 82 },
  triggerColor: "#0F766E",
  triggerTextColor: "#FFFFFF",
  windowHeaderColor: "#0F766E",
  windowBgColor: "#FFFFFF",
  botBubbleColor: "#F1F5F9",
  botBubbleTextColor: "#0F172A",
  userBubbleColor: "#0F766E",
  userBubbleTextColor: "#FFFFFF",
  contactEnabled: true,
  contactLabel: "צרו קשר",
  contactPhone: "",
  contactWhatsapp: "",
  contactEmail: "",
  startNodeId: "welcome",
  nodes: DEFAULT_NODES,
};

const VALID_ACTIONS = new Set<SmartBotOptionAction>([
  "next",
  "contact",
  "reply",
  "ask-input",
  "end",
  "open-link",
]);

function normalizeAction(opt: SmartBotTreeOption): SmartBotOptionAction {
  if (opt.action && VALID_ACTIONS.has(opt.action)) return opt.action;
  if (opt.nextNodeId) return "next";
  return "reply";
}

function normalizeNodes(nodes?: SmartBotTreeNode[] | null): SmartBotTreeNode[] {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return DEFAULT_NODES.map((n) => ({
      ...n,
      options: n.options.map((o) => ({ ...o })),
    }));
  }
  return nodes.map((node, index) => ({
    id: String(node?.id || `node-${index + 1}`),
    title: String(node?.title || `שלב ${index + 1}`),
    message: String(node?.message || ""),
    options: Array.isArray(node?.options)
      ? node.options.map((opt, optIndex) => {
          const action = normalizeAction(opt);
          const replyFromPayload =
            opt.payload && typeof opt.payload.replyText === "string"
              ? opt.payload.replyText
              : undefined;
          return {
            id: String(opt?.id || `opt-${index + 1}-${optIndex + 1}`),
            label: String(opt?.label || "אפשרות"),
            nextNodeId: opt?.nextNodeId ? String(opt.nextNodeId) : undefined,
            action,
            replyText: String(opt?.replyText || replyFromPayload || ""),
            payload:
              opt?.payload && typeof opt.payload === "object" ? opt.payload : undefined,
          };
        })
      : [],
  }));
}

export function mergeSmartBotSettings(
  stored?: Partial<SmartBotSettings> | null
): SmartBotSettings {
  const merged: SmartBotSettings = {
    ...SMART_BOT_DEFAULTS,
    ...(stored || {}),
  };

  merged.nodes = normalizeNodes(merged.nodes);
  merged.triggerStyle =
    merged.triggerStyle === "icon" ||
    merged.triggerStyle === "label" ||
    merged.triggerStyle === "both"
      ? merged.triggerStyle
      : "both";

  if (!merged.triggerPosition || typeof merged.triggerPosition !== "object") {
    merged.triggerPosition = { ...SMART_BOT_DEFAULTS.triggerPosition };
    merged.positionAnchor = "right-bottom";
  } else {
    let x = Number(merged.triggerPosition.x);
    let y = Number(merged.triggerPosition.y);
    // Migrate legacy left/top positions (x≈90 was near the right) to right/bottom.
    if (merged.positionAnchor !== "right-bottom" && Number.isFinite(x) && x > 50) {
      x = 100 - x;
    }
    // Keep the centered trigger (translate 50%/50%) fully on-screen.
    const pad = merged.triggerStyle === "icon" ? 8 : 16;
    merged.triggerPosition = {
      x: Math.min(100 - pad, Math.max(pad, Number.isFinite(x) ? x : 8)),
      y: Math.min(100 - pad, Math.max(pad, Number.isFinite(y) ? y : 82)),
    };
    merged.positionAnchor = "right-bottom";
  }

  if (merged.isActive !== false) {
    merged.isActive = true;
  }

  if (!merged.startNodeId || !merged.nodes.some((n) => n.id === merged.startNodeId)) {
    merged.startNodeId = merged.nodes[0]?.id || "welcome";
  }

  return merged;
}

export function findSmartBotNode(
  settings: SmartBotSettings,
  nodeId?: string | null
): SmartBotTreeNode | null {
  const nodes = settings.nodes || [];
  if (!nodes.length) return null;
  const id = nodeId || settings.startNodeId || nodes[0].id;
  return nodes.find((n) => n.id === id) || nodes[0];
}

export function buildWhatsAppUrl(phone: string, message?: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${digits}${text ? `?text=${text}` : ""}`;
}

export function newTreeNodeId(nodes: SmartBotTreeNode[]) {
  let i = nodes.length + 1;
  let id = `node-${i}`;
  const used = new Set(nodes.map((n) => n.id));
  while (used.has(id)) {
    i += 1;
    id = `node-${i}`;
  }
  return id;
}

export function newOptionId(node: SmartBotTreeNode) {
  let i = (node.options?.length || 0) + 1;
  let id = `opt-${node.id}-${i}`;
  const used = new Set((node.options || []).map((o) => o.id));
  while (used.has(id)) {
    i += 1;
    id = `opt-${node.id}-${i}`;
  }
  return id;
}

/** Remove obsolete in-page placeholder boxes for the floating smart-bot overlay. */
export function removeSmartBotPlaceholderMarkers(root?: ParentNode | null) {
  const scope = root || (typeof document !== "undefined" ? document : null);
  if (!scope) return 0;

  const markers = Array.from(
    scope.querySelectorAll<HTMLElement>(
      '[data-bizuply-plugin="smart-bot"], [data-bizuply-widget="smart-bot"], [data-bizuply-plugin="sales-agent"], [data-bizuply-widget="sales-agent"]'
    )
  );

  let removed = 0;
  markers.forEach((marker) => {
    const shell = marker.closest<HTMLElement>(
      '[data-bizuply-plugin-widget="true"], [data-visual-inserted-element="true"]'
    );
    const target = shell && shell.contains(marker) ? shell : marker;
    target.remove();
    removed += 1;
  });
  return removed;
}

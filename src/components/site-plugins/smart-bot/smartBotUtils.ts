import i18n from "../../../i18n/i18n";

export type SmartBotOptionAction = {
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

function defaultNodes(): SmartBotTreeNode[] {
  return [
    {
      id: "welcome",
      title: i18n.t("publicWidgets.smartBot.startTitle"),
      message: i18n.t("publicWidgets.smartBot.startMessage"),
      options: [
        {
          id: "opt-services",
          label: i18n.t("publicWidgets.smartBot.optServices"),
          action: "next",
          nextNodeId: "services",
        },
        {
          id: "opt-custom",
          label: i18n.t("publicWidgets.smartBot.optOther"),
          action: "ask-input",
          replyText: i18n.t("publicWidgets.smartBot.optOtherReply"),
          payload: { prompt: i18n.t("publicWidgets.smartBot.askPrompt") },
        },
        {
          id: "opt-contact",
          label: i18n.t("publicWidgets.smartBot.optContact"),
          action: "contact",
        },
      ],
    },
    {
      id: "services",
      title: i18n.t("publicWidgets.smartBot.servicesTitle"),
      message: i18n.t("publicWidgets.smartBot.servicesMessage"),
      options: [
        {
          id: "opt-reply",
          label: i18n.t("publicWidgets.smartBot.optIncluded"),
          action: "reply",
          replyText: i18n.t("publicWidgets.smartBot.optIncludedReply"),
          nextNodeId: "services",
        },
        {
          id: "opt-back",
          label: i18n.t("publicWidgets.smartBot.optBack"),
          action: "next",
          nextNodeId: "welcome",
        },
        {
          id: "opt-contact-2",
          label: i18n.t("publicWidgets.smartBot.optContact"),
          action: "contact",
        },
      ],
    },
  ];
}

function smartBotDefaults(): Required<
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
> {
  return {
    isActive: true,
    botName: i18n.t("publicWidgets.smartBot.defaultName"),
    welcomeMessage: i18n.t("publicWidgets.smartBot.defaultWelcome"),
    triggerStyle: "both",
    triggerLabel: i18n.t("publicWidgets.smartBot.defaultTrigger"),
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
    contactLabel: i18n.t("publicWidgets.smartBot.defaultContact"),
    contactPhone: "",
    contactWhatsapp: "",
    contactEmail: "",
    startNodeId: "welcome",
    nodes: defaultNodes(),
  };
}

export const SMART_BOT_DEFAULTS = smartBotDefaults();

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
    return defaultNodes().map((n) => ({
      ...n,
      options: n.options.map((o) => ({ ...o })),
    }));
  }
  return nodes.map((node, index) => ({
    id: String(node?.id || `node-${index + 1}`),
    title: String(node?.title || i18n.t("publicWidgets.smartBot.stepN", { n: index + 1 })),
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
            label: String(opt?.label || i18n.t("publicWidgets.smartBot.option")),
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
  const defaults = smartBotDefaults();
  const merged: SmartBotSettings = {
    ...defaults,
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
    merged.triggerPosition = { ...defaults.triggerPosition };
    merged.positionAnchor = "right-bottom";
  } else {
    let x = Number(merged.triggerPosition.x);
    let y = Number(merged.triggerPosition.y);
    // Migrate legacy left/top positions (x≈90 was near the right) to right/bottom.
    if (merged.positionAnchor !== "right-bottom" && Number.isFinite(x) && x > 50) {
      x = 100 - x;
    }
    // Allow near-edge positions; runtime drag clamps by measured button size.
    merged.triggerPosition = {
      x: Math.min(98.8, Math.max(1.2, Number.isFinite(x) ? x : 8)),
      y: Math.min(98.8, Math.max(1.2, Number.isFinite(y) ? y : 82)),
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

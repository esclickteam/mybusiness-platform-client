export type AutomationSenderMode = "bizuply_managed" | "business_connected";

export type AutomationConnectionView = {
  readyToSend?: boolean;
  authorized?: boolean;
  needsReconnect?: boolean;
  showConnect?: boolean;
  message?: string;
  code?: string;
  senderMode?: string;
};

export function automationWhatsAppGate(
  view: AutomationConnectionView | null | undefined
) {
  const ready = view?.readyToSend === true && view?.authorized !== false;
  if (ready) {
    return {
      state: "connected" as const,
      showReconnect: false,
      showConnect: false,
      message: "",
    };
  }
  const showReconnect = view?.needsReconnect === true;
  const showConnect = view?.showConnect === true;
  return {
    state: showReconnect
      ? ("reconnect" as const)
      : view?.authorized === false
        ? ("unauthorized" as const)
        : ("missing" as const),
    showReconnect,
    showConnect,
    message: String(view?.message || ""),
  };
}

export function pickAutomationSenderRequest(
  explicit: string | null | undefined
): AutomationSenderMode | "auto" {
  if (explicit === "bizuply_managed" || explicit === "business_connected") {
    return explicit;
  }
  return "auto";
}

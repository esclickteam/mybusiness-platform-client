import API from "../api";
import {
  reportGuidedDemoProgress,
  triggerGuidedDemoAutomation,
  sendGuidedDemoSandboxMessage,
} from "../api/guidedDemoApi";
import {
  isGuidedDemoActive,
  readGuidedDemoSession,
  writeGuidedDemoSession,
} from "./sessionStore";

type Listener = (session: any) => void;

const listeners = new Set<Listener>();
let interceptorId: number | null = null;
let lastWrongClickAt = 0;

export const demoProgress = {
  isActive() {
    return isGuidedDemoActive();
  },
  getSession() {
    return readGuidedDemoSession();
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit(session: any) {
    if (session) writeGuidedDemoSession(session);
    listeners.forEach((fn) => fn(session));
  },
  async report(event: string, payload: Record<string, unknown> = {}) {
    if (!this.isActive()) return null;
    const data = await reportGuidedDemoProgress(event, payload);
    if (data?.session) this.emit(data.session);
    return data?.session || null;
  },
  async completeStep(event: string, payload: Record<string, unknown> = {}) {
    return this.report(event, payload);
  },
  notifyWrongAction() {
    const now = Date.now();
    if (now - lastWrongClickAt < 900) return;
    lastWrongClickAt = now;
    window.dispatchEvent(
      new CustomEvent("guided-demo:nudge", {
        detail: { message: "כדי להמשיך בדמו, בצעו קודם את הפעולה המסומנת." },
      })
    );
  },
};

export function mapRequestToEvent(config: { method?: string; url?: string; data?: any }) {
  const method = String(config.method || "get").toUpperCase();
  const url = String(config.url || "");
  let body = config.data;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};
  if (method === "PATCH" && /\/crm\/leads\/[^/]+\/status/.test(url)) {
    return { event: "CRM_STATUS_CHANGED", payload: { status: body.status } };
  }
  if (method === "POST" && /\/crm\/leads\/[^/]+\/activities/.test(url)) {
    if (body.type === "task") return { event: "TASK_CREATED", payload: body };
    if (body.type === "note" || !body.type) {
      return { event: "CRM_NOTE_CREATED", payload: body };
    }
  }
  if (method === "POST" && /\/crm-extras\/(notes|tasks)/.test(url)) {
    return {
      event: url.includes("tasks") ? "TASK_CREATED" : "CRM_NOTE_CREATED",
      payload: body,
    };
  }
  if (method === "POST" && /\/automations\/?$/.test(url)) {
    return { event: "AUTOMATION_CREATED", payload: body };
  }
  if ((method === "PUT" || method === "PATCH") && /\/automations\//.test(url)) {
    return { event: "AUTOMATION_CREATED", payload: body };
  }
  if (method === "POST" && /\/automations\/[^/]+\/publish/.test(url)) {
    return { event: "AUTOMATION_ACTIVATED", payload: body };
  }
  if (method === "POST" && /\/appointments\/?$/.test(url)) {
    return { event: "APPOINTMENT_CREATED", payload: body };
  }
  if ((method === "PUT" || method === "PATCH") && /site-builder/.test(url)) {
    if (body.published === true || body.status === "published") {
      return { event: "WEBSITE_DEMO_PUBLISHED", payload: body };
    }
    return { event: "WEBSITE_SAVED", payload: body };
  }
  return null;
}

export function startDemoProgressBridge() {
  if (interceptorId != null) return;
  interceptorId = API.interceptors.response.use(
    (response) => {
      if (!demoProgress.isActive()) return response;
      const mapped = mapRequestToEvent(response.config || {});
      if (mapped) {
        void demoProgress.report(mapped.event, mapped.payload);
      }
      return response;
    },
    (error) => Promise.reject(error)
  );
}

export function stopDemoProgressBridge() {
  if (interceptorId == null) return;
  API.interceptors.response.eject(interceptorId);
  interceptorId = null;
}

export async function runDemoSpecialAction(step: { id?: string; target?: string }) {
  if (step?.id === "auto-trigger-demo" || step?.target === "automations-demo-trigger") {
    const data = await triggerGuidedDemoAutomation();
    if (data?.session) demoProgress.emit(data.session);
    return data?.session;
  }
  if (step?.target === "messages-demo-send" || step?.target === "whatsapp-demo-send") {
    const data = await sendGuidedDemoSandboxMessage("הודעת הדגמה");
    if (data?.session) demoProgress.emit(data.session);
    return data?.session;
  }
  return null;
}

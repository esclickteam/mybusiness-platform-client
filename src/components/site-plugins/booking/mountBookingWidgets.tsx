import { createRoot, type Root } from "react-dom/client";
import React from "react";

import BookingWidget, {
  type BookingWidgetChrome,
  type BookingWidgetTheme,
  type BookingWidgetVariant,
} from "./BookingWidget";

const roots = new WeakMap<Element, Root>();
const HOST_ATTR = "data-bizuply-booking-host";

const BOOKING_MOUNT_SELECTOR = [
  '[data-bizuply-widget="booking"]',
  '[data-bizuply-booking-mount="true"]',
].join(", ");

const TEMPLATE_BOOKING_SECTION_SELECTOR = [
  '[data-section-kind="booking"]',
  '[data-template-section-type="booking"]',
  '[data-bizuply-block="booking"]',
  '[data-bizuply-widget="booking-calendar"]',
].join(", ");

const LIBRARY_INSERT_SELECTOR = [
  "[data-visual-inserted-section='true']",
  "[data-visual-insert-host]",
  "[data-visual-inserted='true']",
].join(", ");

export function buildBookingWidgetMarker(label = "יומן פגישות") {
  return `<div data-bizuply-widget="booking" data-bizuply-block="booking" data-bizuply-booking-mount="true" data-bizuply-crm-calendar="true" data-bizuply-booking-chrome="card" data-bizuply-booking-variant="month" data-bizuply-booking-accent="#0f766e" data-bizuply-booking-ink="#111827" style="width:100%;height:100%;min-height:320px;direction:rtl;box-sizing:border-box;background:#ffffff;color:#111827;border:1px solid #e5e7eb;border-radius:20px" title="${label}"></div>`;
}

export function pageHasBookingWidget(root: ParentNode | null | undefined) {
  if (!root) return false;
  return Boolean(
    root.querySelector(BOOKING_MOUNT_SELECTOR) ||
      root.querySelector(TEMPLATE_BOOKING_SECTION_SELECTOR),
  );
}

function isLibraryInsertContext(node: HTMLElement) {
  return Boolean(node.closest(LIBRARY_INSERT_SELECTOR));
}

function stampMountAttrs(
  node: HTMLElement,
  chrome?: BookingWidgetChrome,
) {
  node.setAttribute("data-bizuply-widget", "booking");
  node.setAttribute("data-bizuply-booking-mount", "true");
  node.setAttribute("data-bizuply-crm-calendar", "true");
  if (!node.getAttribute("data-bizuply-booking-variant")) {
    node.setAttribute("data-bizuply-booking-variant", "month");
  }
  if (!node.getAttribute("data-bizuply-block")) {
    node.setAttribute("data-bizuply-block", "booking");
  }
  // Template mounts sync CRM without replacing page design (no modal card).
  // Gallery/library sections keep card chrome and must not rewrite templates.
  if (chrome && !node.getAttribute("data-bizuply-booking-chrome")) {
    node.setAttribute("data-bizuply-booking-chrome", chrome);
  }
}

/**
 * Template booking sections (beauty calendars, ready-website booking blocks)
 * often lack an explicit mount. Promote them so CRM BookingWidget can hydrate.
 * Never mutates gallery/library inserts into embedded template chrome.
 */
function ensureTemplateBookingMounts(root: ParentNode) {
  root.querySelectorAll(TEMPLATE_BOOKING_SECTION_SELECTOR).forEach((node) => {
    if (!(node instanceof HTMLElement)) return;

    const chrome: BookingWidgetChrome | undefined = isLibraryInsertContext(node)
      ? "card"
      : "embedded";

    // Already a mountable widget node.
    if (
      node.getAttribute("data-bizuply-booking-mount") === "true" ||
      node.getAttribute("data-bizuply-widget") === "booking"
    ) {
      stampMountAttrs(node, chrome);
      return;
    }

    const existingMount = node.querySelector<HTMLElement>(BOOKING_MOUNT_SELECTOR);
    if (existingMount) {
      stampMountAttrs(existingMount, chrome);
      return;
    }

    // Prefer a dedicated calendar frame / card inside the section.
    // Do not stamp the decorative .t-glow wrapper when a mount already exists
    // (handled above) — that would replace template layout chrome.
    const frame =
      node.querySelector<HTMLElement>("[data-bizuply-booking-frame='true']") ||
      node.querySelector<HTMLElement>("[data-bizuply-widget='booking-calendar']") ||
      (!isLibraryInsertContext(node)
        ? node.querySelector<HTMLElement>(".t-glow")
        : null);

    if (frame && frame !== node) {
      // Hide static demo calendar chrome; keep geometry for the CRM widget.
      Array.from(frame.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        if (child.getAttribute(HOST_ATTR) === "true") return;
        if (
          child.getAttribute("data-bizuply-booking-mount") === "true" ||
          child.getAttribute("data-bizuply-widget") === "booking"
        ) {
          return;
        }
        child.setAttribute("data-bizuply-booking-demo", "true");
      });
      stampMountAttrs(frame, chrome);
      if (!frame.style.minHeight) frame.style.minHeight = "420px";
      return;
    }

    // Fallback: inject a mount host at the end of the section.
    // Additive only — does not replace existing template markup.
    let injected = node.querySelector<HTMLElement>(
      '[data-bizuply-booking-mount="true"][data-bizuply-booking-injected="true"]',
    );
    if (!injected) {
      injected = node.ownerDocument.createElement("div");
      injected.setAttribute("data-bizuply-booking-injected", "true");
      injected.style.width = "100%";
      injected.style.minHeight = "420px";
      injected.style.marginTop = "16px";
      injected.style.position = "relative";
      node.appendChild(injected);
    }
    stampMountAttrs(injected, chrome);
  });
}

function hideBookingDemoChrome(mount: HTMLElement) {
  const section =
    mount.closest(
      "section, [data-visual-inserted-section='true'], [data-section-kind]",
    ) || mount.parentElement;
  if (!section) return;

  section
    .querySelectorAll('[data-bizuply-booking-demo="true"]')
    .forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      node.style.visibility = "hidden";
      node.style.pointerEvents = "none";
      node.setAttribute("aria-hidden", "true");
      node.setAttribute("data-bizuply-booking-demo-hidden", "true");
    });
}

function readChrome(mount: HTMLElement): BookingWidgetChrome {
  const raw = String(mount.getAttribute("data-bizuply-booking-chrome") || "")
    .trim()
    .toLowerCase();
  if (raw === "embedded" || raw === "card") return raw;

  // Gallery / library inserts keep intentional card chrome.
  if (isLibraryInsertContext(mount)) return "card";

  // Beauty / ready-website template mounts blend into surrounding design.
  if (
    mount.getAttribute("data-bizuply-booking-frame") === "true" ||
    mount.closest(
      "[data-template-section-type='booking'], [data-template-section-type]",
    )
  ) {
    return "embedded";
  }

  return "card";
}

function ensureHost(mount: HTMLElement, chrome: BookingWidgetChrome) {
  let host = mount.querySelector<HTMLElement>(`[${HOST_ATTR}="true"]`);
  if (!host) {
    Array.from(mount.childNodes).forEach((child) => {
      if (!(child instanceof HTMLElement)) {
        mount.removeChild(child);
        return;
      }
      if (child.getAttribute(HOST_ATTR) === "true") return;
      if (
        child.getAttribute("data-visual-inserted") === "true" ||
        child.getAttribute("data-visual-edit-id")
      ) {
        child.style.visibility = "hidden";
        child.style.pointerEvents = "none";
        return;
      }
      // Keep geometry: mark static template calendar UI as demo chrome.
      child.setAttribute("data-bizuply-booking-demo", "true");
      child.style.visibility = "hidden";
      child.style.pointerEvents = "none";
      child.setAttribute("aria-hidden", "true");
    });

    host = mount.ownerDocument.createElement("div");
    host.setAttribute(HOST_ATTR, "true");
    host.setAttribute("data-bizuply-plugin-runtime", "true");
    mount.appendChild(host);
  }

  const computed = window.getComputedStyle(mount);
  if (computed.position === "static") {
    mount.style.position = "relative";
  }
  if (!mount.style.minHeight) {
    mount.style.minHeight = "320px";
  }

  if (chrome === "embedded") {
    // Flow into the template frame — no absolute scroll-trap / modal box.
    host.style.position = "relative";
    host.style.inset = "auto";
    host.style.top = "";
    host.style.right = "";
    host.style.bottom = "";
    host.style.left = "";
    host.style.width = "100%";
    host.style.height = "auto";
    host.style.minHeight = "320px";
    host.style.boxSizing = "border-box";
    host.style.overflow = "visible";
    host.style.zIndex = "5";
    host.style.background = "transparent";
    mount.style.overflow = "visible";
  } else {
    host.style.position = "absolute";
    host.style.inset = "0";
    host.style.width = "100%";
    host.style.height = "100%";
    host.style.minHeight = "";
    host.style.boxSizing = "border-box";
    host.style.overflow = "auto";
    host.style.zIndex = "5";
    mount.style.overflow = "hidden";
  }

  return host;
}

function readVariant(mount: HTMLElement): BookingWidgetVariant {
  const raw = String(
    mount.getAttribute("data-bizuply-booking-variant") || "",
  )
    .trim()
    .toLowerCase();
  return raw === "week" ? "week" : "month";
}

function isUsableColor(value: string) {
  const clean = String(value || "").trim().toLowerCase();
  if (!clean) return false;
  if (
    clean === "transparent" ||
    clean === "inherit" ||
    clean === "initial" ||
    clean === "unset" ||
    clean === "rgba(0, 0, 0, 0)" ||
    clean === "rgba(0,0,0,0)"
  ) {
    return false;
  }
  return true;
}

function rgbToHex(value: string) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  if (clean.startsWith("#")) return clean;
  const match = clean.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i,
  );
  if (!match) return clean;
  const toHex = (n: string) =>
    Math.max(0, Math.min(255, Number(n))).toString(16).padStart(2, "0");
  return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`;
}

function readCssVar(el: Element | null, name: string) {
  if (!el || !(el instanceof HTMLElement)) return "";
  const fromInline = el.style.getPropertyValue(name).trim();
  if (fromInline) return fromInline;
  try {
    return window.getComputedStyle(el).getPropertyValue(name).trim();
  } catch {
    return "";
  }
}

function readTheme(
  mount: HTMLElement,
  chrome: BookingWidgetChrome,
): BookingWidgetTheme {
  const computed = window.getComputedStyle(mount);
  const section =
    mount.closest("section, [data-section-kind], [data-template-section-type]") ||
    mount.parentElement;
  const attrAccent = mount.getAttribute("data-bizuply-booking-accent") || "";
  const attrInk = mount.getAttribute("data-bizuply-booking-ink") || "";
  const attrMuted = mount.getAttribute("data-bizuply-booking-muted") || "";
  const attrSurface =
    mount.getAttribute("data-bizuply-booking-surface") || "";
  const attrLine = mount.getAttribute("data-bizuply-booking-line") || "";
  const attrSoft = mount.getAttribute("data-bizuply-booking-soft") || "";

  const styleAccent = mount.style.getPropertyValue("--biz-booking-accent");
  const styleInk = mount.style.getPropertyValue("--biz-booking-ink");
  const styleMuted = mount.style.getPropertyValue("--biz-booking-muted");
  const styleSurface = mount.style.getPropertyValue("--biz-booking-surface");
  const styleLine = mount.style.getPropertyValue("--biz-booking-line");
  const styleSoft = mount.style.getPropertyValue("--biz-booking-soft");

  const liveColor = mount.style.color;
  const liveBg = mount.style.backgroundColor;
  const liveBorder = mount.style.borderColor;

  // Inherit beauty template tokens when blending into page design.
  const templateAccent = readCssVar(section, "--p") || readCssVar(mount, "--p");
  const templateMuted =
    readCssVar(section, "--muted") || readCssVar(mount, "--muted");
  const templateInk =
    readCssVar(section, "--text") ||
    readCssVar(mount, "--text") ||
    readCssVar(section, "--ink");
  const templateSoft =
    readCssVar(section, "--surface") || readCssVar(mount, "--surface");

  const surfaceCandidate =
    styleSurface || liveBg || attrSurface || computed.backgroundColor;
  const inkCandidate =
    styleInk ||
    liveColor ||
    attrInk ||
    templateInk ||
    computed.color;
  const lineCandidate =
    styleLine || liveBorder || attrLine || computed.borderTopColor;
  const accentCandidate =
    styleAccent ||
    attrAccent ||
    templateAccent ||
    (liveColor ? liveColor : "") ||
    inkCandidate;

  const surface = isUsableColor(surfaceCandidate)
    ? rgbToHex(surfaceCandidate)
    : chrome === "embedded"
      ? "transparent"
      : "#ffffff";
  const ink = isUsableColor(inkCandidate)
    ? rgbToHex(inkCandidate)
    : "#111827";
  const line = isUsableColor(lineCandidate)
    ? rgbToHex(lineCandidate)
    : chrome === "embedded"
      ? "rgba(0,0,0,0.12)"
      : "#e5e7eb";
  const accent = isUsableColor(accentCandidate)
    ? rgbToHex(accentCandidate)
    : "#0f766e";
  const muted = isUsableColor(styleMuted || attrMuted || templateMuted)
    ? rgbToHex(styleMuted || attrMuted || templateMuted)
    : "#6b7280";
  const soft = isUsableColor(styleSoft || attrSoft || templateSoft)
    ? rgbToHex(styleSoft || attrSoft || templateSoft)
    : "#f3f4f6";

  return {
    accent,
    ink,
    muted,
    surface,
    line,
    soft,
    onAccent: "#ffffff",
    onInk: "#ffffff",
  };
}

function applyThemeCssVars(host: HTMLElement, theme: BookingWidgetTheme) {
  if (theme.accent) host.style.setProperty("--biz-booking-accent", theme.accent);
  if (theme.ink) host.style.setProperty("--biz-booking-ink", theme.ink);
  if (theme.muted) host.style.setProperty("--biz-booking-muted", theme.muted);
  if (theme.surface) {
    host.style.setProperty("--biz-booking-surface", theme.surface);
  }
  if (theme.line) host.style.setProperty("--biz-booking-line", theme.line);
  if (theme.soft) host.style.setProperty("--biz-booking-soft", theme.soft);
}

function collectBookingMountNodes(root: ParentNode): HTMLElement[] {
  ensureTemplateBookingMounts(root);
  const nodes = Array.from(
    root.querySelectorAll(BOOKING_MOUNT_SELECTOR),
  ).filter((node): node is HTMLElement => node instanceof HTMLElement);

  // Prefer inner mounts over the wrapping section when both are stamped.
  return nodes.filter((node) => {
    const inner = Array.from(
      node.querySelectorAll<HTMLElement>(BOOKING_MOUNT_SELECTOR),
    ).find((candidate) => candidate !== node);
    return !inner;
  });
}

type MountOptions = {
  businessId?: string;
  pluginEnabled?: boolean;
  preview?: boolean;
  editorMode?: boolean;
};

export function mountBookingWidgets(
  root: ParentNode | null | undefined,
  options: MountOptions = {},
) {
  if (!root) return;

  const nodes = collectBookingMountNodes(root);
  nodes.forEach((node) => {
    // Skip bare section wrappers that only label the block; wait for inner mount.
    if (
      node.matches("section") &&
      node.getAttribute("data-bizuply-booking-mount") !== "true" &&
      node.getAttribute("data-bizuply-widget") !== "booking" &&
      !node.querySelector(BOOKING_MOUNT_SELECTOR)
    ) {
      return;
    }

    hideBookingDemoChrome(node);
    const chrome = readChrome(node);
    // Persist inferred chrome so remounts (e.g. after adding a gallery section)
    // do not flip template calendars to card/modal styling.
    if (!node.getAttribute("data-bizuply-booking-chrome")) {
      node.setAttribute("data-bizuply-booking-chrome", chrome);
    }
    const host = ensureHost(node, chrome);
    const variant = readVariant(node);
    const theme = readTheme(node, chrome);
    applyThemeCssVars(host, theme);
    applyThemeCssVars(node, theme);

    let reactRoot = roots.get(host);
    const needsFreshRoot =
      !reactRoot ||
      !host.isConnected ||
      host.getAttribute("data-bizuply-booking-mounted") !== "true";

    if (needsFreshRoot) {
      if (reactRoot) {
        try {
          reactRoot.unmount();
        } catch {
          // stale root after DOM reset
        }
        roots.delete(host);
      }
      host.innerHTML = "";
      reactRoot = createRoot(host);
      roots.set(host, reactRoot);
    }

    // Always enable CRM sync when businessId is present — templates with
    // booking/calendar must use services + working hours from the CRM.
    const businessId = String(options.businessId || "").trim();
    const liveCrm = Boolean(businessId) && options.preview !== true;

    reactRoot.render(
      React.createElement(BookingWidget, {
        businessId: businessId || undefined,
        pluginEnabled: Boolean(options.pluginEnabled || liveCrm),
        preview: options.preview === true ? true : !liveCrm,
        editorMode: options.editorMode,
        variant,
        chrome,
        theme,
      }),
    );
    host.setAttribute("data-bizuply-booking-mounted", "true");
    node.setAttribute("data-bizuply-booking-mounted", "true");
  });
}

export function unmountBookingWidgets(root: ParentNode | null | undefined) {
  if (!root) return;
  root.querySelectorAll(`[${HOST_ATTR}="true"]`).forEach((node) => {
    const reactRoot = roots.get(node);
    if (reactRoot) {
      reactRoot.unmount();
      roots.delete(node);
    }
  });
}

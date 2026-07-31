import { createRoot, type Root } from "react-dom/client";
import React from "react";

import BookingWidget, {
  type BookingWidgetTheme,
  type BookingWidgetVariant,
} from "./BookingWidget";

const roots = new WeakMap<Element, Root>();
const HOST_ATTR = "data-bizuply-booking-host";

const BOOKING_MOUNT_SELECTOR = [
  '[data-bizuply-widget="booking"]',
  '[data-bizuply-booking-mount="true"]',
].join(", ");

export function buildBookingWidgetMarker(label = "יומן פגישות") {
  return `<div data-bizuply-widget="booking" data-bizuply-block="booking" data-bizuply-booking-mount="true" data-bizuply-crm-calendar="true" data-bizuply-booking-variant="month" data-bizuply-booking-accent="#0f766e" data-bizuply-booking-ink="#111827" style="width:100%;height:100%;min-height:320px;direction:rtl;box-sizing:border-box;background:#ffffff;color:#111827;border:1px solid #e5e7eb;border-radius:20px" title="${label}"></div>`;
}

export function pageHasBookingWidget(root: ParentNode | null | undefined) {
  if (!root) return false;
  return Boolean(root.querySelector(BOOKING_MOUNT_SELECTOR));
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

function ensureHost(mount: HTMLElement) {
  let host = mount.querySelector<HTMLElement>(`[${HOST_ATTR}="true"]`);
  if (!host) {
    Array.from(mount.childNodes).forEach((child) => {
      if (!(child instanceof HTMLElement)) {
        mount.removeChild(child);
        return;
      }
      if (
        child.getAttribute("data-visual-inserted") === "true" ||
        child.getAttribute("data-visual-edit-id")
      ) {
        child.style.visibility = "hidden";
        child.style.pointerEvents = "none";
        return;
      }
      mount.removeChild(child);
    });

    host = mount.ownerDocument.createElement("div");
    host.setAttribute(HOST_ATTR, "true");
    host.setAttribute("data-bizuply-plugin-runtime", "true");
    host.style.position = "absolute";
    host.style.inset = "0";
    host.style.width = "100%";
    host.style.height = "100%";
    host.style.boxSizing = "border-box";
    host.style.overflow = "auto";
    host.style.zIndex = "5";
    mount.appendChild(host);
  }

  const computed = window.getComputedStyle(mount);
  if (computed.position === "static") {
    mount.style.position = "relative";
  }
  mount.style.overflow = "hidden";

  return host;
}

function readVariant(mount: HTMLElement): BookingWidgetVariant {
  const raw = String(
    mount.getAttribute("data-bizuply-booking-variant") || "",
  )
    .trim()
    .toLowerCase();
  return raw === "month" ? "month" : "week";
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

function readTheme(mount: HTMLElement): BookingWidgetTheme {
  const computed = window.getComputedStyle(mount);
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

  // Prefer live inspector styles over authored data-* defaults so color edits apply.
  const liveColor = mount.style.color;
  const liveBg = mount.style.backgroundColor;
  const liveBorder = mount.style.borderColor;
  const surfaceCandidate =
    styleSurface || liveBg || attrSurface || computed.backgroundColor;
  const inkCandidate = styleInk || liveColor || attrInk || computed.color;
  const lineCandidate =
    styleLine || liveBorder || attrLine || computed.borderTopColor;
  // When the user recolors the mount in the inspector, drive accent from that too.
  const accentCandidate =
    styleAccent ||
    (liveColor ? liveColor : "") ||
    attrAccent ||
    inkCandidate;

  const surface = isUsableColor(surfaceCandidate)
    ? rgbToHex(surfaceCandidate)
    : "#ffffff";
  const ink = isUsableColor(inkCandidate)
    ? rgbToHex(inkCandidate)
    : "#111827";
  const line = isUsableColor(lineCandidate)
    ? rgbToHex(lineCandidate)
    : "#e5e7eb";
  const accent = isUsableColor(accentCandidate)
    ? rgbToHex(accentCandidate)
    : "#0f766e";
  const muted = isUsableColor(styleMuted || attrMuted)
    ? rgbToHex(styleMuted || attrMuted)
    : "#6b7280";
  const soft = isUsableColor(styleSoft || attrSoft)
    ? rgbToHex(styleSoft || attrSoft)
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

  const nodes = root.querySelectorAll(BOOKING_MOUNT_SELECTOR);
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;

    if (
      node.matches("section, [data-section-kind]") &&
      !node.getAttribute("data-bizuply-booking-mount") &&
      node.getAttribute("data-bizuply-widget") !== "booking"
    ) {
      return;
    }

    hideBookingDemoChrome(node);
    const host = ensureHost(node);
    const variant = readVariant(node);
    const theme = readTheme(node);
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

    reactRoot.render(
      React.createElement(BookingWidget, {
        businessId: options.businessId,
        pluginEnabled: options.pluginEnabled,
        preview: options.preview,
        editorMode: options.editorMode,
        variant,
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

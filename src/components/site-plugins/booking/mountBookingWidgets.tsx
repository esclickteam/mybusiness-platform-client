import { createRoot, type Root } from "react-dom/client";
import React from "react";

import BookingWidget, {
  type BookingWidgetVariant,
} from "./BookingWidget";

const roots = new WeakMap<Element, Root>();
const HOST_ATTR = "data-bizuply-booking-host";

const BOOKING_MOUNT_SELECTOR = [
  '[data-bizuply-widget="booking"]',
  '[data-bizuply-booking-mount="true"]',
].join(", ");

export function buildBookingWidgetMarker(label = "יומן פגישות") {
  return `<div data-bizuply-plugin="booking" data-bizuply-widget="booking" data-bizuply-block="booking" data-bizuply-booking-mount="true" data-bizuply-booking-variant="month" style="width:100%;height:100%;min-height:280px;direction:rtl;box-sizing:border-box"></div>`;
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
      // Keep layout geometry: collapse visually without removing from flow math of siblings.
      node.style.visibility = "hidden";
      node.style.pointerEvents = "none";
      node.setAttribute("aria-hidden", "true");
      node.setAttribute("data-bizuply-booking-demo-hidden", "true");
    });
}

function ensureHost(mount: HTMLElement) {
  let host = mount.querySelector<HTMLElement>(`[${HOST_ATTR}="true"]`);
  if (!host) {
    // Clear only non-visual-editor children; preserve positioned mount box itself.
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

  // Preserve the mount's saved absolute position/size — only ensure a positioning context.
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

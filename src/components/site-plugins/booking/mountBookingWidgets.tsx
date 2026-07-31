import { createRoot, type Root } from "react-dom/client";
import React from "react";

import BookingWidget from "./BookingWidget";

const roots = new WeakMap<Element, Root>();

const BOOKING_MOUNT_SELECTOR = [
  '[data-bizuply-widget="booking"]',
  '[data-bizuply-booking-mount="true"]',
  '[data-bizuply-block="booking"]:not(section):not([data-section-kind])',
].join(", ");

export function buildBookingWidgetMarker(label = "יומן פגישות") {
  return `<div data-bizuply-plugin="booking" data-bizuply-widget="booking" data-bizuply-block="booking" data-bizuply-booking-mount="true" style="width:100%;height:100%;min-height:220px;direction:rtl;box-sizing:border-box"><div style="width:100%;height:100%;padding:20px 12px;text-align:center;border:2px dashed #7dd3fc;border-radius:16px;background:linear-gradient(135deg,#f0f9ff,#eff6ff);font-family:system-ui,sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:11px;font-weight:700;color:#0284c7;margin-bottom:4px">תוסף Bizuply</div><div style="font-size:15px;font-weight:800;color:#1e293b">${label}</div><div style="font-size:10px;color:#64748b;margin-top:4px">מתחבר אוטומטית ליומן ותורים</div></div></div>`;
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
      node.style.display = "none";
      node.setAttribute("data-bizuply-booking-demo-hidden", "true");
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

  const nodes = root.querySelectorAll(BOOKING_MOUNT_SELECTOR);
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;

    // Avoid mounting on outer section wrappers that only carry a marker.
    if (
      node.matches("section, [data-section-kind]") &&
      !node.getAttribute("data-bizuply-booking-mount") &&
      node.getAttribute("data-bizuply-widget") !== "booking"
    ) {
      return;
    }

    hideBookingDemoChrome(node);

    node.style.width = "100%";
    node.style.height = "100%";
    node.style.minHeight = node.style.minHeight || "220px";
    node.style.overflow = "auto";
    node.style.zIndex = String(
      Math.max(Number(node.style.zIndex || 0) || 0, 40),
    );

    let reactRoot = roots.get(node);
    const needsFreshRoot =
      !reactRoot ||
      !node.isConnected ||
      node.getAttribute("data-bizuply-booking-mounted") !== "true";

    if (needsFreshRoot) {
      if (reactRoot) {
        try {
          reactRoot.unmount();
        } catch {
          // stale root after DOM reset
        }
        roots.delete(node);
      }

      node.innerHTML = "";
      reactRoot = createRoot(node);
      roots.set(node, reactRoot);
    }

    reactRoot.render(
      React.createElement(BookingWidget, {
        businessId: options.businessId,
        pluginEnabled: options.pluginEnabled,
        preview: options.preview,
        editorMode: options.editorMode,
      }),
    );
    node.setAttribute("data-bizuply-booking-mounted", "true");
    node.setAttribute("data-bizuply-plugin-runtime", "true");
  });
}

export function unmountBookingWidgets(root: ParentNode | null | undefined) {
  if (!root) return;
  root.querySelectorAll(BOOKING_MOUNT_SELECTOR).forEach((node) => {
    const reactRoot = roots.get(node);
    if (reactRoot) {
      reactRoot.unmount();
      roots.delete(node);
    }
  });
}

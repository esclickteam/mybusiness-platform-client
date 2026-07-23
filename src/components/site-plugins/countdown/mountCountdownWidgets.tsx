import { createRoot, type Root } from "react-dom/client";
import React from "react";

import CountdownWidget from "./CountdownWidget";
import { normalizeCountdownSettings, type CountdownSettings } from "./countdownUtils";

const roots = new WeakMap<Element, Root>();

export function buildCountdownWidgetMarker(label = "ספירה לאחור") {
  return `<div data-bizuply-plugin="countdown" data-bizuply-widget="countdown" data-countdown-mount="true" style="width:100%;height:100%;min-height:120px;direction:rtl;box-sizing:border-box"><div style="width:100%;height:100%;padding:20px 12px;text-align:center;border:2px dashed #c4b5fd;border-radius:16px;background:linear-gradient(135deg,#f5f3ff,#eff6ff);font-family:system-ui,sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:11px;font-weight:700;color:#7c3aed;margin-bottom:4px">תוסף Bizuply</div><div style="font-size:15px;font-weight:800;color:#1e293b">${label}</div><div style="font-size:10px;color:#64748b;margin-top:4px">גררו ושנו גודל בעורך</div></div></div>`;
}

export function pageHasCountdownWidget(root: ParentNode | null | undefined) {
  if (!root) return false;
  return Boolean(root.querySelector('[data-bizuply-widget="countdown"]'));
}

type MountOptions = {
  preview?: boolean;
  editorMode?: boolean;
  onFloatingPositionChange?: (pos: { x: number; y: number }) => void;
};

export function mountCountdownWidgets(
  root: ParentNode | null | undefined,
  settings: CountdownSettings | unknown,
  options?: MountOptions
) {
  if (!root) return;

  const normalized = normalizeCountdownSettings(settings);
  if (normalized.isActive === false) return;

  const nodes = root.querySelectorAll('[data-bizuply-widget="countdown"]');
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;

    if (normalized.layoutMode === "floating") {
      node.style.minHeight = "0";
      node.style.height = "0";
      node.style.overflow = "visible";
    } else {
      node.style.width = "100%";
      node.style.height = "100%";
      node.style.minHeight = "0";
      node.style.overflow = "visible";
    }

    let reactRoot = roots.get(node);
    const needsFreshRoot =
      !reactRoot ||
      !node.isConnected ||
      node.getAttribute("data-bizuply-countdown-mounted") !== "true";

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
      React.createElement(CountdownWidget, {
        settings: normalized,
        preview: options?.preview,
        editorMode: options?.editorMode,
        onFloatingPositionChange: options?.onFloatingPositionChange,
      })
    );
    node.setAttribute("data-bizuply-countdown-mounted", "true");
  });
}

export function unmountCountdownWidgets(root: ParentNode | null | undefined) {
  if (!root) return;
  root.querySelectorAll('[data-bizuply-widget="countdown"]').forEach((node) => {
    const reactRoot = roots.get(node);
    if (reactRoot) {
      reactRoot.unmount();
      roots.delete(node);
    }
  });
}

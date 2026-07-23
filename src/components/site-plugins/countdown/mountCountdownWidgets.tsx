import { createRoot, type Root } from "react-dom/client";
import React from "react";

import CountdownWidget from "./CountdownWidget";
import { normalizeCountdownSettings, type CountdownSettings } from "./countdownUtils";

const roots = new WeakMap<Element, Root>();

export function buildCountdownWidgetMarker(label = "ספירה לאחור") {
  return `<div data-bizuply-plugin="countdown" data-bizuply-widget="countdown" data-countdown-mount="true" style="min-height:120px;width:100%;direction:rtl"><div style="padding:32px 16px;text-align:center;border:2px dashed #c4b5fd;border-radius:16px;background:linear-gradient(135deg,#f5f3ff,#eff6ff);font-family:system-ui,sans-serif"><div style="font-size:12px;font-weight:700;color:#7c3aed;margin-bottom:4px">תוסף Bizuply</div><div style="font-size:16px;font-weight:800;color:#1e293b">${label}</div><div style="font-size:11px;color:#64748b;margin-top:6px">יוצג כטיימר חי באתר</div></div></div>`;
}

export function pageHasCountdownWidget(root: ParentNode | null | undefined) {
  if (!root) return false;
  return Boolean(root.querySelector('[data-bizuply-widget="countdown"]'));
}

export function mountCountdownWidgets(
  root: ParentNode | null | undefined,
  settings: CountdownSettings | unknown,
  options?: { preview?: boolean }
) {
  if (!root) return;

  const normalized = normalizeCountdownSettings(settings);
  if (normalized.isActive === false) return;

  const nodes = root.querySelectorAll('[data-bizuply-widget="countdown"]');
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;

    let reactRoot = roots.get(node);
    if (!reactRoot) {
      node.innerHTML = "";
      reactRoot = createRoot(node);
      roots.set(node, reactRoot);
    }

    reactRoot.render(
      React.createElement(CountdownWidget, {
        settings: normalized,
        preview: options?.preview,
      })
    );
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

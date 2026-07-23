import { createRoot, type Root } from "react-dom/client";

import {
  getPluginWidgetShell,
} from "../../site-builder/studio/visual-editor/utils/visualPluginWidgets";

const roots = new WeakMap<Element, Root>();

type MountSiteAuthOptions = {
  site?: Record<string, any>;
  slug?: string;
  editorMode?: boolean;
};

/**
 * Site-auth is overlay-only (like benefits wheel). Legacy HTML widgets inserted
 * into the page are hidden so they don't show as blue boxes in the header.
 */
export function hideLegacySiteAuthInlineWidgets(root: ParentNode | null | undefined) {
  if (!root) return;

  root.querySelectorAll('[data-bizuply-widget="site-auth"]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;

    const reactRoot = roots.get(node);
    if (reactRoot) {
      try {
        reactRoot.unmount();
      } catch {
        // stale root
      }
      roots.delete(node);
    }

    node.innerHTML = "";
    node.style.display = "none";
    node.style.visibility = "hidden";
    node.style.width = "0";
    node.style.height = "0";
    node.style.minHeight = "0";
    node.style.overflow = "hidden";
    node.style.pointerEvents = "none";
    node.style.border = "none";
    node.style.background = "transparent";
    node.setAttribute("data-bizuply-site-auth-legacy-hidden", "true");
    node.removeAttribute("data-bizuply-site-auth-mounted");

    const shell = getPluginWidgetShell(node);
    if (shell) {
      shell.style.display = "none";
      shell.style.visibility = "hidden";
      shell.style.width = "0";
      shell.style.height = "0";
      shell.style.minWidth = "0";
      shell.style.minHeight = "0";
      shell.style.overflow = "hidden";
      shell.style.pointerEvents = "none";
      shell.style.border = "none";
      shell.style.background = "transparent";
      shell.style.boxShadow = "none";
    }
  });
}

export function mountSiteAuthWidgets(
  root: ParentNode | null | undefined,
  _settings?: unknown,
  _options: MountSiteAuthOptions = {}
) {
  hideLegacySiteAuthInlineWidgets(root);
}

export function unmountSiteAuthWidgets(root: ParentNode | null | undefined) {
  hideLegacySiteAuthInlineWidgets(root);
}

export { buildSiteAuthWidgetMarker, pageHasSiteAuthWidget } from "./siteAuthUtils";

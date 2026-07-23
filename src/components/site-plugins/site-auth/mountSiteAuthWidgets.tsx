import { createRoot, type Root } from "react-dom/client";
import React from "react";

import SiteAuthLoginWidget from "./SiteAuthLoginWidget";
import {
  mergeSiteAuthSettings,
  shouldMountInlineAuthButton,
  type SiteAuthWidgetSettings,
} from "./siteAuthUtils";
import { SiteMemberAuthProvider } from "../../../context/SiteMemberAuthContext";
import {
  ensurePluginWidgetsLayering,
  fitPluginWidgetShellToContent,
  sanitizePluginWidgetEditorNodes,
} from "../../site-builder/studio/visual-editor/utils/visualPluginWidgets";

const roots = new WeakMap<Element, Root>();

type MountSiteAuthOptions = {
  site?: Record<string, any>;
  slug?: string;
  editorMode?: boolean;
};

export function mountSiteAuthWidgets(
  root: ParentNode | null | undefined,
  settings: SiteAuthWidgetSettings | unknown,
  options: MountSiteAuthOptions = {}
) {
  if (!root) return;

  const normalized = mergeSiteAuthSettings(settings);
  if (!shouldMountInlineAuthButton(normalized)) return;

  const site = options.site || {};
  const slug = String(options.slug || site?.slug || "");

  const nodes = root.querySelectorAll('[data-bizuply-widget="site-auth"]');
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;

    node.style.display = "inline-flex";
    node.style.alignItems = "center";
    node.style.justifyContent = "center";
    node.style.width = "fit-content";
    node.style.height = "fit-content";
    node.style.minHeight = "0";
    node.style.overflow = "visible";

    let reactRoot = roots.get(node);
    const needsFreshRoot =
      !reactRoot ||
      !node.isConnected ||
      node.getAttribute("data-bizuply-site-auth-mounted") !== "true";

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

    const widget = (
      <SiteMemberAuthProvider slug={slug}>
        <SiteAuthLoginWidget
          site={site}
          settings={normalized}
          variant="inline"
          mode={options.editorMode ? "editor" : "live"}
        />
      </SiteMemberAuthProvider>
    );

    reactRoot.render(widget);
    node.setAttribute("data-bizuply-site-auth-mounted", "true");
    node.setAttribute("data-bizuply-plugin-runtime", "true");

    window.requestAnimationFrame(() => {
      fitPluginWidgetShellToContent(node);
    });
  });

  if (root instanceof HTMLElement) {
    sanitizePluginWidgetEditorNodes(root);
    ensurePluginWidgetsLayering(root);
  }
}

export function unmountSiteAuthWidgets(root: ParentNode | null | undefined) {
  if (!root) return;
  root.querySelectorAll('[data-bizuply-widget="site-auth"]').forEach((node) => {
    const reactRoot = roots.get(node);
    if (reactRoot) {
      reactRoot.unmount();
      roots.delete(node);
    }
    if (node instanceof HTMLElement) {
      node.removeAttribute("data-bizuply-site-auth-mounted");
    }
  });
}

export { buildSiteAuthWidgetMarker, pageHasSiteAuthWidget } from "./siteAuthUtils";

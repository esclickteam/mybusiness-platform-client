import { createRoot, type Root } from "react-dom/client";
import React from "react";

import SiteAuthLoginWidget from "./SiteAuthLoginWidget";
import {
  mergeSiteAuthSettings,
  shouldMountInlineAuthButton,
  type SiteAuthWidgetSettings,
} from "./siteAuthUtils";
import { SiteMemberAuthProvider } from "../../../context/SiteMemberAuthContext";

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
    node.style.minHeight = "44px";

    let reactRoot = roots.get(node);
    if (!reactRoot) {
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
  });
}

export function unmountSiteAuthWidgets(root: ParentNode | null | undefined) {
  if (!root) return;
  root.querySelectorAll('[data-bizuply-widget="site-auth"]').forEach((node) => {
    const reactRoot = roots.get(node);
    if (reactRoot) {
      reactRoot.unmount();
      roots.delete(node);
    }
  });
}

export { buildSiteAuthWidgetMarker, pageHasSiteAuthWidget } from "./siteAuthUtils";

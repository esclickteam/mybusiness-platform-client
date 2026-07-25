import { getPluginWidgetShell } from "../../site-builder/studio/visual-editor/utils/visualPluginWidgets";

/** Site-auth uses a floating overlay (like benefits wheel), not inline HTML widgets. */
export function hideLegacySiteAuthInlineWidgets(root: ParentNode | null | undefined) {
  if (!root) return;

  root.querySelectorAll('[data-bizuply-widget="site-auth"]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;

    node.innerHTML = "";
    node.style.display = "none";
    node.style.visibility = "hidden";
    node.style.width = "0";
    node.style.height = "0";
    node.style.pointerEvents = "none";

    const shell = getPluginWidgetShell(node);
    if (shell) {
      shell.style.display = "none";
      shell.style.visibility = "hidden";
      shell.style.width = "0";
      shell.style.height = "0";
      shell.style.pointerEvents = "none";
    }
  });
}

export function mountSiteAuthWidgets(root: ParentNode | null | undefined) {
  hideLegacySiteAuthInlineWidgets(root);
}

export function unmountSiteAuthWidgets(root: ParentNode | null | undefined) {
  hideLegacySiteAuthInlineWidgets(root);
}

export { buildSiteAuthWidgetMarker, pageHasSiteAuthWidget } from "./siteAuthUtils";

import { getPluginWidgetShell } from "../../site-builder/studio/visual-editor/utils/visualPluginWidgets";

/** Template headers ship generic login/logout links — hide when site-auth overlay is active. */
export function hideTemplateHeaderAuthButtons(root: ParentNode | null | undefined) {
  if (!root) return;

  root.querySelectorAll<HTMLElement>('[data-header-auth="true"]').forEach((node) => {
    node.style.display = "none";
    node.setAttribute("data-bizuply-site-auth-hidden", "true");
  });

  root
    .querySelectorAll<HTMLElement>(
      '[data-header-login="true"], [data-header-logout="true"], a[href="/login"], a[href="/logout"]'
    )
    .forEach((node) => {
      const inHeader = node.closest("header, [data-visual-section-key*='header'], [data-template-section-id*='header']");
      if (!inHeader) return;
      node.style.display = "none";
      node.setAttribute("data-bizuply-site-auth-hidden", "true");
    });
}

/** Site-auth uses a floating overlay (like benefits wheel), not inline HTML widgets. */
export function hideLegacySiteAuthInlineWidgets(root: ParentNode | null | undefined) {
  if (!root) return;

  const shellsToRemove = new Set<HTMLElement>();

  root.querySelectorAll('[data-bizuply-widget="site-auth"]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const shell = getPluginWidgetShell(node);
    if (shell) shellsToRemove.add(shell);
    else shellsToRemove.add(node);
  });

  root.querySelectorAll('[data-bizuply-plugin="site-auth"]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const shell = getPluginWidgetShell(node);
    if (shell) shellsToRemove.add(shell);
    else shellsToRemove.add(node);
  });

  root.querySelectorAll<HTMLElement>('[data-bizuply-plugin-widget="true"]').forEach((shell) => {
    const label = String(shell.getAttribute("data-visual-edit-label") || "").trim();
    const html = shell.innerHTML || "";
    if (
      html.includes('data-bizuply-widget="site-auth"') ||
      html.includes('data-bizuply-plugin="site-auth"') ||
      label.includes("התחברות") ||
      label.includes("אזור אישי")
    ) {
      shellsToRemove.add(shell);
    }
  });

  shellsToRemove.forEach((shell) => {
    shell.remove();
  });
}

export function mountSiteAuthWidgets(root: ParentNode | null | undefined) {
  hideLegacySiteAuthInlineWidgets(root);
  hideTemplateHeaderAuthButtons(root);
}

export function unmountSiteAuthWidgets(root: ParentNode | null | undefined) {
  hideLegacySiteAuthInlineWidgets(root);
  hideTemplateHeaderAuthButtons(root);
}

export { buildSiteAuthWidgetMarker, pageHasSiteAuthWidget } from "./siteAuthUtils";

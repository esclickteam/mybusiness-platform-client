/**
 * Login/register forms mount as one shell, but owners must click inner
 * buttons/links and edit them like normal canvas controls. These helpers
 * mark those controls and sync edits back onto the durable shell attrs.
 */

export const PORTAL_AUTH_CONTROL_ATTR = "data-bizuply-portal-control";
export const PORTAL_AUTH_SHELL_ID_ATTR = "data-bizuply-portal-shell-id";

export type PortalAuthControlKind = "submit" | "switch" | "forgot";

export function isPortalAuthControl(
  node: HTMLElement | null | undefined,
): boolean {
  if (!node) return false;
  const kind = String(node.getAttribute(PORTAL_AUTH_CONTROL_ATTR) || "").trim();
  return kind === "submit" || kind === "switch" || kind === "forgot";
}

export function getPortalAuthControlKind(
  node: HTMLElement | null | undefined,
): PortalAuthControlKind | "" {
  if (!isPortalAuthControl(node)) return "";
  return String(
    node?.getAttribute(PORTAL_AUTH_CONTROL_ATTR) || "",
  ).trim() as PortalAuthControlKind;
}

export function getPortalAuthShell(node: HTMLElement | null | undefined) {
  if (!node) return null;
  return (
    node.closest<HTMLElement>(
      '[data-bizuply-portal-mount="true"], [data-bizuply-widget^="portal-"]',
    ) || null
  );
}

export function buildPortalAuthControlId(
  shellId: string,
  kind: PortalAuthControlKind,
) {
  const base = String(shellId || "portal").trim() || "portal";
  return `${base}__portal_${kind}`;
}

export function isPortalAuthControlId(elementId: string) {
  return /__portal_(submit|switch|forgot)$/.test(String(elementId || ""));
}

export function parsePortalAuthControlId(elementId: string): {
  shellId: string;
  kind: PortalAuthControlKind;
} | null {
  const match = String(elementId || "").match(
    /^(.*)__portal_(submit|switch|forgot)$/,
  );
  if (!match?.[1] || !match[2]) return null;
  return {
    shellId: match[1],
    kind: match[2] as PortalAuthControlKind,
  };
}

/** Map a control edit onto the shell attributes that survive publish. */
export function portalControlPatchForShell(
  kind: PortalAuthControlKind,
  patch: { text?: string; href?: string },
): Record<string, string> {
  const next: Record<string, string> = {};

  if (typeof patch.text === "string") {
    if (kind === "submit") next["data-portal-copy-submit"] = patch.text;
    if (kind === "switch") next["data-portal-copy-switch"] = patch.text;
    if (kind === "forgot") next["data-portal-copy-forgot"] = patch.text;
  }

  if (typeof patch.href === "string" && kind !== "submit") {
    next[`data-portal-link-${kind}`] = patch.href;
  }

  return next;
}

export function applyPortalShellAttributePatch(
  shell: HTMLElement,
  patch: Record<string, string>,
) {
  Object.entries(patch).forEach(([attr, value]) => {
    const clean = String(value ?? "").trim();
    if (clean) shell.setAttribute(attr, clean);
    else shell.removeAttribute(attr);
  });

  delete shell.dataset.bizuplyPortalMounted;
  delete shell.dataset.bizuplyPortalLive;
  shell.removeAttribute("data-bizuply-portal-mounted");
  shell.removeAttribute("data-bizuply-portal-live");
}

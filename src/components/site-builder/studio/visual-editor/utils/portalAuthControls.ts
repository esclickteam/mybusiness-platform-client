/**
 * Login/register forms mount as one shell, but owners must click inner
 * buttons/links and edit them like normal canvas controls. These helpers
 * mark those controls and sync edits back onto the durable shell attrs.
 */

export const PORTAL_AUTH_CONTROL_ATTR = "data-bizuply-portal-control";
export const PORTAL_AUTH_SHELL_ID_ATTR = "data-bizuply-portal-shell-id";

export const PORTAL_MOUNT_SHELL_SELECTOR = [
  '[data-bizuply-portal-mount="true"]',
  '[data-bizuply-widget^="portal-"]',
].join(", ");

export type PortalAuthControlKind =
  | "submit"
  | "switch"
  | "forgot"
  | "title"
  | "subtitle"
  | "eyebrow";

const PORTAL_AUTH_CONTROL_KINDS = new Set<PortalAuthControlKind>([
  "submit",
  "switch",
  "forgot",
  "title",
  "subtitle",
  "eyebrow",
]);

export function isPortalMountShell(
  node: HTMLElement | null | undefined,
): boolean {
  if (!node) return false;
  return (
    node.getAttribute("data-bizuply-portal-mount") === "true" ||
    String(node.getAttribute("data-bizuply-widget") || "").startsWith(
      "portal-",
    )
  );
}

export function isPortalAuthControl(
  node: HTMLElement | null | undefined,
): boolean {
  if (!node) return false;
  const kind = String(node.getAttribute(PORTAL_AUTH_CONTROL_ATTR) || "").trim();
  return PORTAL_AUTH_CONTROL_KINDS.has(kind as PortalAuthControlKind);
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
  return node.closest<HTMLElement>(PORTAL_MOUNT_SHELL_SELECTOR) || null;
}

export function buildPortalAuthControlId(
  shellId: string,
  kind: PortalAuthControlKind,
) {
  const base = String(shellId || "portal").trim() || "portal";
  return `${base}__portal_${kind}`;
}

export function isPortalAuthControlId(elementId: string) {
  return /__portal_(submit|switch|forgot|title|subtitle|eyebrow)$/.test(
    String(elementId || ""),
  );
}

export function parsePortalAuthControlId(elementId: string): {
  shellId: string;
  kind: PortalAuthControlKind;
} | null {
  const match = String(elementId || "").match(
    /^(.*)__portal_(submit|switch|forgot|title|subtitle|eyebrow)$/,
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
    if (kind === "title") next["data-portal-copy-title"] = patch.text;
    if (kind === "subtitle") next["data-portal-copy-subtitle"] = patch.text;
    if (kind === "eyebrow") next["data-portal-copy-eyebrow"] = patch.text;
  }

  // Only switch/forgot are navigational links. Never put href on the form shell
  // or on the submit action button.
  if (
    typeof patch.href === "string" &&
    (kind === "switch" || kind === "forgot")
  ) {
    next[`data-portal-link-${kind}`] = patch.href;
  }

  return next;
}

/** Portal mount shells are widgets, never site-wide links. */
export function stripPortalShellLinkFields(item: Record<string, any> | null) {
  if (!item || typeof item !== "object") return item;
  const next = { ...item };
  delete next.href;
  delete next.target;
  delete next.rel;
  delete next.linkValue;
  delete next.linkTarget;
  return next;
}

/** Clear baked-in link attrs so clicks reach inputs / submit, not navigation. */
export function clearPortalShellLinkDomAttrs(shell: HTMLElement | null) {
  if (!shell) return;
  [
    "data-bizuply-public-href",
    "data-bizuply-public-target",
    "data-bizuply-public-link",
    "data-visual-link-href",
    "data-visual-link-target",
    "data-href",
    "data-link-url",
    "href",
  ].forEach((attr) => shell.removeAttribute(attr));
  if (shell.getAttribute("role") === "link") {
    shell.removeAttribute("role");
  }
  if (shell.getAttribute("tabindex") === "0") {
    shell.removeAttribute("tabindex");
  }
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

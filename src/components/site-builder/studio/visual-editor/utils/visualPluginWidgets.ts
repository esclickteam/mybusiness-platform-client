import {
  PORTAL_AUTH_CONTROL_ATTR,
  isPortalAuthControl,
} from "./portalAuthControls";

const PLUGIN_WIDGET_SHELL_SELECTOR =
  '[data-bizuply-plugin-widget="true"][data-visual-inserted-element="true"]';

const BOOKING_WIDGET_SHELL_SELECTOR = [
  '[data-bizuply-booking-mount="true"]',
  '[data-bizuply-widget="booking"]:not([data-bizuply-booking-live="true"])',
].join(", ");

const PORTAL_MOUNT_SHELL_SELECTOR = [
  '[data-bizuply-portal-mount="true"]',
  '[data-bizuply-widget^="portal-"]',
].join(", ");

const PLUGIN_RUNTIME_ROOT_SELECTOR =
  '[data-bizuply-plugin-runtime="true"], [data-bizuply-booking-live="true"], [data-bizuply-booking-host="true"], .bizuply-countdown-widget, .bizuply-booking-widget-root';

function resolvePortalAuthControl(
  node: HTMLElement | null | undefined,
): HTMLElement | null {
  if (!node) return null;
  if (isPortalAuthControl(node)) return node;
  const nested = node.closest<HTMLElement>(`[${PORTAL_AUTH_CONTROL_ATTR}]`);
  return isPortalAuthControl(nested) ? nested : null;
}

export function getPluginWidgetShell(
  node: HTMLElement | null | undefined,
): HTMLElement | null {
  if (!node) return null;
  return (
    node.closest<HTMLElement>(PLUGIN_WIDGET_SHELL_SELECTOR) ||
    node.closest<HTMLElement>(BOOKING_WIDGET_SHELL_SELECTOR) ||
    node.closest<HTMLElement>(PORTAL_MOUNT_SHELL_SELECTOR)
  );
}

export function isPluginWidgetShell(node: HTMLElement | null | undefined) {
  if (!node) return false;
  return (
    node.matches(PLUGIN_WIDGET_SHELL_SELECTOR) ||
    node.matches(BOOKING_WIDGET_SHELL_SELECTOR) ||
    node.matches(PORTAL_MOUNT_SHELL_SELECTOR)
  );
}

export function isInsidePluginWidgetContent(node: HTMLElement | null | undefined) {
  if (!node) return false;
  // Login/register submit + switch/forgot links are real canvas controls.
  if (resolvePortalAuthControl(node)) return false;
  const shell = getPluginWidgetShell(node);
  if (!shell) return false;
  return shell !== node;
}

export function shouldSkipPluginWidgetRegistration(
  node: HTMLElement | null | undefined,
) {
  if (!node) return false;
  if (isPluginWidgetShell(node)) return false;
  if (resolvePortalAuthControl(node)) return false;
  if (isInsidePluginWidgetContent(node)) return true;
  return Boolean(node.closest(PLUGIN_RUNTIME_ROOT_SELECTOR));
}

export function resolvePluginWidgetSelectionTarget(
  node: HTMLElement,
  canvas: HTMLElement,
): HTMLElement | null {
  const portalControl = resolvePortalAuthControl(node);
  if (portalControl && canvas.contains(portalControl)) {
    // Keep the clicked button/link — do not bounce selection to the shell.
    return portalControl === node ? null : portalControl;
  }

  const shell = getPluginWidgetShell(node);
  if (shell && canvas.contains(shell) && shell !== node) {
    return shell;
  }
  return null;
}

export function isBookingWidgetMount(node: HTMLElement | null | undefined) {
  if (!node) return false;
  return (
    node.getAttribute("data-bizuply-booking-mount") === "true" ||
    (node.getAttribute("data-bizuply-widget") === "booking" &&
      node.getAttribute("data-bizuply-booking-live") !== "true")
  );
}

/**
 * Portal widgets inject a live form at runtime. Before save we empty the shell
 * and drop the mounted flag so publish never freezes a dead copy of the form
 * (which looked fillable but sent people to login / did nothing on submit).
 */
export function sanitizePortalMountShells(root: HTMLElement | null) {
  if (!root) return;

  root
    .querySelectorAll<HTMLElement>(PORTAL_MOUNT_SHELL_SELECTOR)
    .forEach((shell) => {
      delete shell.dataset.bizuplyPortalMounted;
      delete shell.dataset.bizuplyPortalLive;
      shell.removeAttribute("data-bizuply-portal-mounted");
      shell.removeAttribute("data-bizuply-portal-live");

      while (shell.firstChild) {
        shell.removeChild(shell.firstChild);
      }
    });
}

export function sanitizePluginWidgetEditorNodes(root: HTMLElement | null) {
  if (!root) return;

  const shellSelector = [
    PLUGIN_WIDGET_SHELL_SELECTOR,
    BOOKING_WIDGET_SHELL_SELECTOR,
    PORTAL_MOUNT_SHELL_SELECTOR,
  ].join(", ");

  root.querySelectorAll<HTMLElement>(shellSelector).forEach((shell) => {
    shell.querySelectorAll<HTMLElement>("[data-visual-edit-id]").forEach((node) => {
      if (node === shell) return;
      // Keep stamped portal auth buttons/links selectable after re-apply.
      if (isPortalAuthControl(node)) return;

      node.removeAttribute("data-visual-edit-id");
      node.removeAttribute("data-visual-editable");
      node.removeAttribute("data-visual-edit-type");
      node.removeAttribute("data-visual-type");
      node.removeAttribute("data-visual-layer");
      node.removeAttribute("data-visual-auto-id");
      node.removeAttribute("data-visual-edit-label");
      node.setAttribute("data-bizuply-plugin-runtime", "true");
    });

    shell.querySelectorAll<HTMLElement>(PLUGIN_RUNTIME_ROOT_SELECTOR).forEach((runtime) => {
      runtime.setAttribute("data-bizuply-plugin-runtime", "true");
      runtime.querySelectorAll<HTMLElement>("[data-visual-edit-id]").forEach((node) => {
        if (isPortalAuthControl(node)) return;

        node.removeAttribute("data-visual-edit-id");
        node.removeAttribute("data-visual-editable");
        node.removeAttribute("data-visual-edit-type");
        node.removeAttribute("data-visual-type");
        node.removeAttribute("data-visual-layer");
        node.removeAttribute("data-visual-auto-id");
        node.removeAttribute("data-visual-edit-label");
        node.setAttribute("data-bizuply-plugin-runtime", "true");
      });
    });
  });

  /*
    Do not empty portal mounts here — applyAllVisualDataToDom runs often
    (device toggle, selection refresh) and would flash blank forms. Emptying
    happens only when building the published HTML snapshot.
  */
}

export function ensurePluginWidgetsLayering(root: HTMLElement) {
  const isPublicRuntime = Boolean(
    root.closest?.("[data-bizuply-public-render-root='true']") ||
      root.matches?.("[data-bizuply-public-render-root='true']"),
  );

  root.querySelectorAll<HTMLElement>(PLUGIN_WIDGET_SHELL_SELECTOR).forEach((shell) => {
    shell.style.setProperty("overflow", "visible", "important");
    shell.style.setProperty("isolation", "isolate", "important");

    if (!isPublicRuntime) {
      shell.style.setProperty("z-index", "9000", "important");
      shell.style.setProperty("position", "absolute", "important");
    }

    shell.querySelectorAll<HTMLElement>(PLUGIN_RUNTIME_ROOT_SELECTOR).forEach((runtime) => {
      runtime.style.setProperty("overflow", "visible", "important");
      runtime.style.setProperty("pointer-events", "none", "important");
    });

    let parent = shell.parentElement;
    while (parent && parent !== root) {
      const computed = window.getComputedStyle(parent);
      if (
        computed.overflow === "hidden" ||
        computed.overflow === "clip" ||
        computed.overflowY === "hidden" ||
        computed.overflowX === "hidden"
      ) {
        parent.style.setProperty("overflow", "visible", "important");
      }
      parent = parent.parentElement;
    }
  });
}

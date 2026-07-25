const PLUGIN_WIDGET_SHELL_SELECTOR =
  '[data-bizuply-plugin-widget="true"][data-visual-inserted-element="true"]';

const PLUGIN_RUNTIME_ROOT_SELECTOR =
  '[data-bizuply-plugin-runtime="true"], [data-bizuply-widget], .bizuply-countdown-widget';

export function getPluginWidgetShell(
  node: HTMLElement | null | undefined,
): HTMLElement | null {
  if (!node) return null;
  return node.closest<HTMLElement>(PLUGIN_WIDGET_SHELL_SELECTOR);
}

export function isPluginWidgetShell(node: HTMLElement | null | undefined) {
  if (!node) return false;
  return node.matches(PLUGIN_WIDGET_SHELL_SELECTOR);
}

export function isInsidePluginWidgetContent(node: HTMLElement | null | undefined) {
  const shell = getPluginWidgetShell(node);
  if (!shell || !node) return false;
  return shell !== node;
}

export function shouldSkipPluginWidgetRegistration(
  node: HTMLElement | null | undefined,
) {
  if (!node) return false;
  if (isPluginWidgetShell(node)) return false;
  if (isInsidePluginWidgetContent(node)) return true;
  return Boolean(node.closest(PLUGIN_RUNTIME_ROOT_SELECTOR));
}

export function resolvePluginWidgetSelectionTarget(
  node: HTMLElement,
  canvas: HTMLElement,
): HTMLElement | null {
  const shell = getPluginWidgetShell(node);
  if (shell && canvas.contains(shell) && shell !== node) {
    return shell;
  }
  return null;
}

export function fitPluginWidgetShellToContent(node: HTMLElement) {
  const shell = getPluginWidgetShell(node);
  if (!shell) return;

  const trigger = shell.querySelector<HTMLElement>('[data-bizuply-site-auth-button="true"]');
  if (!trigger) return;

  const rect = trigger.getBoundingClientRect();
  const padding = 6;
  const width = Math.max(32, Math.ceil(rect.width) + padding);
  const height = Math.max(32, Math.ceil(rect.height) + padding);

  shell.style.width = `${width}px`;
  shell.style.height = `${height}px`;
  shell.style.minWidth = `${width}px`;
  shell.style.minHeight = `${height}px`;
  shell.style.maxWidth = `${width}px`;
  shell.style.maxHeight = `${height}px`;
  shell.style.overflow = "visible";
  shell.style.boxSizing = "border-box";

  const mount = shell.querySelector<HTMLElement>('[data-bizuply-widget="site-auth"]');
  if (mount) {
    mount.style.width = "100%";
    mount.style.height = "100%";
    mount.style.minHeight = "0";
    mount.style.display = "inline-flex";
    mount.style.alignItems = "center";
    mount.style.justifyContent = "center";
  }
}

export function sanitizePluginWidgetEditorNodes(root: HTMLElement | null) {
  if (!root) return;

  root.querySelectorAll<HTMLElement>(PLUGIN_WIDGET_SHELL_SELECTOR).forEach((shell) => {
    shell.querySelectorAll<HTMLElement>("[data-visual-edit-id]").forEach((node) => {
      if (node === shell) return;

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

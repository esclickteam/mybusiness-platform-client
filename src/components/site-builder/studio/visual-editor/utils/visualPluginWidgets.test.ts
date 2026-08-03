import { describe, expect, it } from "vitest";

import {
  isInsidePluginWidgetContent,
  resolvePluginWidgetSelectionTarget,
  shouldSkipPluginWidgetRegistration,
} from "./visualPluginWidgets";

function mountLoginShell() {
  const root = document.createElement("div");
  const shell = document.createElement("div");
  shell.setAttribute("data-bizuply-portal-mount", "true");
  shell.setAttribute("data-bizuply-widget", "portal-login");
  shell.setAttribute("data-visual-edit-id", "sec-portal-login");

  const switchLink = document.createElement("a");
  switchLink.setAttribute("data-bizuply-portal-control", "switch");
  switchLink.setAttribute("data-visual-edit-id", "sec-portal-login__portal_switch");
  switchLink.href = "/register";
  switchLink.textContent = "הרשמה";

  const filler = document.createElement("div");
  filler.textContent = "inner";

  shell.appendChild(filler);
  shell.appendChild(switchLink);
  root.appendChild(shell);
  document.body.appendChild(root);

  return { root, shell, switchLink, filler };
}

describe("visualPluginWidgets portal auth controls", () => {
  it("keeps stamped portal controls selectable", () => {
    const { root, shell, switchLink, filler } = mountLoginShell();

    expect(isInsidePluginWidgetContent(switchLink)).toBe(false);
    expect(shouldSkipPluginWidgetRegistration(switchLink)).toBe(false);
    expect(resolvePluginWidgetSelectionTarget(switchLink, root)).toBe(null);

    // Non-control content still redirects selection to the shell.
    expect(isInsidePluginWidgetContent(filler)).toBe(true);
    expect(resolvePluginWidgetSelectionTarget(filler, root)).toBe(shell);

    root.remove();
  });
});

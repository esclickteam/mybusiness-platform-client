import { describe, expect, it } from "vitest";

import {
  applyVisualContentToDom,
  collectVisualContentFromDom,
} from "./visualDomApply";
import { VISUAL_CONTENT_KEY } from "./visualData";

describe("portal shell link harvest", () => {
  it("does not copy inner switch/forgot href onto the portal shell", () => {
    const root = document.createElement("div");
    const shell = document.createElement("div");
    shell.setAttribute("data-bizuply-portal-mount", "true");
    shell.setAttribute("data-bizuply-widget", "portal-login");
    shell.setAttribute("data-visual-edit-id", "sec-portal-login");
    shell.setAttribute("data-visual-editable", "true");

    const switchLink = document.createElement("a");
    switchLink.href = "/register";
    switchLink.setAttribute("data-bizuply-portal-control", "switch");
    switchLink.setAttribute(
      "data-visual-edit-id",
      "sec-portal-login__portal_switch",
    );
    switchLink.textContent = "הרשמה";
    shell.appendChild(switchLink);
    root.appendChild(shell);
    document.body.appendChild(root);

    const collected = collectVisualContentFromDom(root, {
      [VISUAL_CONTENT_KEY]: {
        "sec-portal-login": { href: "/register", target: "_self" },
      },
    });

    expect(collected["sec-portal-login"]?.href).toBeUndefined();
    expect(collected["sec-portal-login"]?.target).toBeUndefined();

    root.remove();
  });

  it("does not apply shell href content onto portal mount DOM", () => {
    const root = document.createElement("div");
    const shell = document.createElement("div");
    shell.setAttribute("data-bizuply-portal-mount", "true");
    shell.setAttribute("data-bizuply-widget", "portal-register");
    shell.setAttribute("data-visual-edit-id", "sec-portal-register");
    shell.setAttribute("data-bizuply-public-href", "/account");
    shell.setAttribute("role", "link");
    root.appendChild(shell);
    document.body.appendChild(root);

    applyVisualContentToDom(root, {
      [VISUAL_CONTENT_KEY]: {
        "sec-portal-register": { href: "/account", target: "_self" },
      },
    });

    expect(shell.getAttribute("data-bizuply-public-href")).toBeNull();
    expect(shell.getAttribute("data-visual-link-href")).toBeNull();
    expect(shell.getAttribute("role")).toBeNull();

    root.remove();
  });
});

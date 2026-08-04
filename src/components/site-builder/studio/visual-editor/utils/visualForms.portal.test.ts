import { describe, expect, it } from "vitest";

import { resolveFormContext } from "./visualForms";

describe("resolveFormContext portal exclusion", () => {
  it("does not treat portal mounts as contact form builders", () => {
    const root = document.createElement("div");
    const shell = document.createElement("div");
    shell.setAttribute("data-bizuply-portal-mount", "true");
    shell.setAttribute("data-bizuply-widget", "portal-login");
    shell.setAttribute("data-visual-edit-id", "sec-portal-login");

    const submit = document.createElement("button");
    submit.setAttribute("data-bizuply-portal-control", "submit");
    submit.setAttribute("data-visual-edit-id", "sec-portal-login__portal_submit");
    submit.textContent = "התחברות";

    const email = document.createElement("input");
    email.type = "email";

    shell.appendChild(email);
    shell.appendChild(submit);
    root.appendChild(shell);
    document.body.appendChild(root);

    expect(resolveFormContext(submit, root)).toBeNull();
    expect(resolveFormContext(shell, root)).toBeNull();

    root.remove();
  });
});

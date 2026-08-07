import { describe, expect, it } from "vitest";
import { bindClientPortalVariables } from "./bindClientPortalVariables";

describe("bindClientPortalVariables", () => {
  it("replaces raw CRM values without keeping chip chrome", () => {
    document.body.innerHTML = `
      <div id="root">
        <span
          data-client-variable="true"
          data-client-variable-key="weight"
          data-client-variable-display="raw"
          class="inline-flex rounded-full bg-violet-50"
        >72</span>
        <span
          data-client-variable-key="balance"
          data-client-variable-label="יתרה"
          data-client-variable-display="label-value"
        >יתרה - 0</span>
        <p>שלום {{client_name}}</p>
      </div>
    `;

    const root = document.getElementById("root");
    bindClientPortalVariables(root, {
      weight: 81,
      balance: 250,
      client_name: "דנה",
    });

    const weight = root?.querySelector(
      '[data-client-variable-key="weight"]',
    ) as HTMLElement;
    const balance = root?.querySelector(
      '[data-client-variable-key="balance"]',
    ) as HTMLElement;

    expect(weight.textContent).toBe("81");
    expect(weight.classList.contains("rounded-full")).toBe(false);
    expect(balance.textContent).toBe("יתרה - 250");
    expect(root?.textContent).toContain("שלום דנה");
  });
});

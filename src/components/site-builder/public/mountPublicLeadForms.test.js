import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../api/publicSiteLeadsApi", () => ({
  submitPublicSiteLead: vi.fn(),
  uploadPublicFormFile: vi.fn(),
}));

import { submitPublicSiteLead } from "../../../api/publicSiteLeadsApi";
import {
  mountPublicLeadForms,
  __testables,
} from "./mountPublicLeadForms.js";

const { upgradeLegacyLeadFormCtas } = __testables;

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function buildIdoLikeForm() {
  const root = document.createElement("div");
  root.innerHTML = `
    <form
      data-bizuply-form-id="contact-form"
      data-bizuply-form-builder="true"
      data-bizuply-form-skin="template"
      data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אליך בהקדם."
    >
      <input placeholder="שם מלא" />
      <input placeholder="טלפון" />
      <textarea placeholder="ספרו בקצרה על העסק והמטרה"></textarea>
      <div
        role="button"
        tabindex="0"
        data-visual-edit-label="שליחת בקשה לשיחה"
        class="cta"
      >
        <span>שליחת בקשה לשיחה</span>
      </div>
    </form>
  `;
  const form = root.querySelector("form");
  form.querySelector('input[placeholder="שם מלא"]').value = "Realtime CTA Lead";
  form.querySelector('input[placeholder="טלפון"]').value = "0509991122";
  form.querySelector("textarea").value =
    "E2E regression lead. Email: realtime-cta-lead@example.com";
  return { root, form };
}

function buildSemanticForm() {
  const root = document.createElement("div");
  root.innerHTML = `
    <form data-bizuply-form-id="contact-form" data-bizuply-form-builder="true">
      <input name="name" placeholder="שם מלא" />
      <input name="phone" placeholder="טלפון" />
      <button type="submit">שליחת בקשה לשיחה</button>
    </form>
  `;
  const form = root.querySelector("form");
  form.querySelector('input[placeholder="שם מלא"]').value = "Semantic Lead";
  form.querySelector('input[placeholder="טלפון"]').value = "0501112233";
  return { root, form };
}

describe("mountPublicLeadForms submit CTA regression", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
    submitPublicSiteLead.mockResolvedValue({
      success: true,
      leadId: "lead-1",
      message: "ok",
    });
  });

  it("upgrades legacy div[role=button] CTA into button type=submit", () => {
    const { root, form } = buildIdoLikeForm();
    upgradeLegacyLeadFormCtas(root);
    const cta = form.querySelector("[data-bizuply-lead-submit], button");
    expect(cta?.tagName).toBe("BUTTON");
    expect(cta?.getAttribute("type")).toBe("submit");
    expect(form.querySelector('[role="button"]')).toBeNull();
  });

  it("click on upgraded CTA creates exactly one Lead", async () => {
    const { root, form } = buildIdoLikeForm();
    mountPublicLeadForms(root, { slug: "launchgateb12", host: "bizuplylgtmsn7ksf50.com" });

    const cta = form.querySelector('button[type="submit"]');
    expect(cta).toBeTruthy();
    cta.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    // native click on submit should also fire submit; simulate browser behavior
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await flush();
    await flush();

    expect(submitPublicSiteLead).toHaveBeenCalledTimes(1);
    expect(submitPublicSiteLead.mock.calls[0][0]).toBe("launchgateb12");
    expect(submitPublicSiteLead.mock.calls[0][1].name).toBe("Realtime CTA Lead");
    expect(submitPublicSiteLead.mock.calls[0][1].phone).toBe("0509991122");
  });

  it("Enter in a field submits exactly one Lead via native submit", async () => {
    const { root, form } = buildSemanticForm();
    mountPublicLeadForms(root, { slug: "launchgateb12" });

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await flush();

    expect(submitPublicSiteLead).toHaveBeenCalledTimes(1);
  });

  it("rapid double-click creates exactly one Lead", async () => {
    const { root, form } = buildSemanticForm();
    let resolveRequest;
    submitPublicSiteLead.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    mountPublicLeadForms(root, { slug: "launchgateb12" });
    const cta = form.querySelector('button[type="submit"]');

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    cta.click();
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await flush();

    expect(submitPublicSiteLead).toHaveBeenCalledTimes(1);
    expect(cta.disabled).toBe(true);

    resolveRequest({ success: true, leadId: "lead-1", message: "ok" });
    await flush();
    await flush();
  });

  it("API failure does not show success and keeps form retryable", async () => {
    submitPublicSiteLead.mockRejectedValue({
      response: { data: { error: "server failed" } },
    });
    const { root, form } = buildSemanticForm();
    mountPublicLeadForms(root, { slug: "launchgateb12" });

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await flush();
    await flush();

    const status = form.querySelector("[data-bizuply-lead-status='true']");
    expect(status?.textContent).toContain("server failed");
    expect(status?.dataset.tone).toBe("error");
    expect(form.getAttribute("data-bizuply-lead-submitted")).not.toBe("true");
    expect(form.querySelector('button[type="submit"]').disabled).toBe(false);
  });

  it("legacy role=button click path still works before browser paints upgrade side-effects", async () => {
    const { root, form } = buildIdoLikeForm();
    // Mount upgrades immediately; assert click on resulting button still single-fires.
    mountPublicLeadForms(root, { slug: "launchgateb12" });
    const cta = form.querySelector('button[type="submit"]');
    cta.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await flush();
    expect(submitPublicSiteLead).toHaveBeenCalledTimes(1);
  });
});

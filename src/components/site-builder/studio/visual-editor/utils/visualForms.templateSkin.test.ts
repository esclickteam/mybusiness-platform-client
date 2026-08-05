import { describe, expect, it } from "vitest";

import type { BizuplyFormConfig } from "../../FormBuilderModal";
import {
  applyFormBuilderConfigToFormNode,
  collectFormConfigFromDom,
  syncTemplateSkinnedFormFromConfig,
} from "./visualForms";

function makeTemplateForm() {
  const form = document.createElement("form");
  form.className = "grid gap-4 rounded-[42px] bg-[#f7efe3] p-5";
  form.setAttribute("data-bizuply-form-builder", "true");
  form.setAttribute("data-bizuply-form-id", "demo-contact");
  form.setAttribute("data-bizuply-form-skin", "template");
  form.setAttribute(
    "data-bizuply-success-message",
    "תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.",
  );
  form.innerHTML = `
    <input class="rounded-2xl bg-white px-5 py-4" name="name" data-bizuply-form-field-id="name" placeholder="שם מלא" />
    <input class="rounded-2xl bg-white px-5 py-4" name="phone" data-bizuply-form-field-id="phone" placeholder="טלפון" type="tel" />
    <input class="rounded-2xl bg-white px-5 py-4" name="email" data-bizuply-form-field-id="email" placeholder="אימייל" type="email" />
    <textarea class="min-h-36 rounded-2xl bg-white px-5 py-4" name="other" data-bizuply-form-field-id="other" placeholder="מה תרצו לשאול?"></textarea>
    <button type="submit" class="rounded-full bg-[#b99067] px-7 py-4 text-white">שליחת פרטים</button>
  `;
  document.body.appendChild(form);
  return form;
}

const genericConfig: BizuplyFormConfig = {
  id: "contact-form",
  title: "טופס יצירת קשר",
  submitText: "שליחת הודעה",
  successMessage: "ההודעה נשלחה בהצלחה",
  fields: [
    { id: "name", label: "שם מלא", type: "text", placeholder: "שם מלא", required: true, options: [] },
    { id: "phone", label: "טלפון", type: "phone", placeholder: "טלפון", required: true, options: [] },
    { id: "message", label: "הודעה", type: "textarea", placeholder: "איך אפשר לעזור?", required: false, options: [] },
  ],
};

describe("template form skin parity", () => {
  it("does not overwrite template-skinned form innerHTML with generic chrome", () => {
    const form = makeTemplateForm();
    const before = form.innerHTML;
    const beforeClass = form.className;

    applyFormBuilderConfigToFormNode(form, genericConfig);

    expect(form.querySelector("[data-bizuply-form-header]")).toBeNull();
    expect(form.className).toBe(beforeClass);
    expect(form.querySelector('[data-bizuply-form-field-id="email"]')).toBeTruthy();
    expect(form.querySelector('button[type="submit"]')?.textContent).toContain("שליחת פרטים");
    expect(form.innerHTML).toBe(before);
    form.remove();
  });

  it("collect + re-apply without edits keeps DOM stable", () => {
    const form = makeTemplateForm();
    const before = form.innerHTML;
    const parsed = collectFormConfigFromDom(form, "demo-contact");

    expect(parsed.preserveTemplateSkin).toBe(true);
    expect(parsed.fields.map((f) => f.id)).toEqual(["name", "phone", "email", "other"]);

    applyFormBuilderConfigToFormNode(form, parsed);
    expect(form.innerHTML).toBe(before);
    expect(form.querySelector("[data-bizuply-form-header]")).toBeNull();
    form.remove();
  });

  it("ignores stale generic defaults on template skin sync", () => {
    const form = makeTemplateForm();
    syncTemplateSkinnedFormFromConfig(form, genericConfig);
    expect(form.querySelector('[data-bizuply-form-field-id="email"]')).toBeTruthy();
    expect(form.querySelector('[data-bizuply-form-field-id="message"]')).toBeNull();
    expect(form.querySelector('button[type="submit"]')?.textContent).toContain("שליחת פרטים");
    form.remove();
  });

  it("applies real field edits while keeping template classes", () => {
    const form = makeTemplateForm();
    const className = form.className;

    syncTemplateSkinnedFormFromConfig(form, {
      id: "demo-contact",
      title: "",
      submitText: "שליחת פרטים",
      successMessage: "ok",
      preserveTemplateSkin: true,
      fields: [
        { id: "name", label: "שם מלא", type: "text", placeholder: "שם מלא", options: [], width: "full" },
        { id: "phone", label: "טלפון", type: "phone", placeholder: "טלפון", options: [], width: "full" },
        { id: "email", label: "אימייל", type: "email", placeholder: "אימייל", options: [], width: "full" },
        { id: "company", label: "חברה", type: "text", placeholder: "חברה", options: [], width: "full" },
        { id: "other", label: "הודעה", type: "textarea", placeholder: "מה תרצו לשאול?", options: [], width: "full" },
      ],
    });

    expect(form.className).toBe(className);
    expect(form.querySelector("[data-bizuply-form-header]")).toBeNull();
    expect(form.querySelector('[data-bizuply-form-field-id="company"]')).toBeTruthy();
    expect(form.querySelector('[data-bizuply-form-field-id="company"]')?.className).toContain("rounded-2xl");
    form.remove();
  });

  it("still rewrites intentionally generic (non-template) forms", () => {
    const form = document.createElement("form");
    form.innerHTML = `<input name="name" /><button type="submit">Send</button>`;
    document.body.appendChild(form);

    applyFormBuilderConfigToFormNode(form, genericConfig);

    expect(form.querySelector("[data-bizuply-form-header]")).toBeTruthy();
    expect(form.querySelector("[data-bizuply-form-title]")?.textContent).toContain("טופס יצירת קשר");
    form.remove();
  });
});

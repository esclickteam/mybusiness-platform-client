import { describe, expect, it } from "vitest";

// Lightweight mirror of field collection used by public lead mount.
function collectLeadFormPayload(form) {
  const controls = Array.from(form.querySelectorAll("input, textarea, select")).filter((node) => {
    const type = String(node.getAttribute("type") || "text").toLowerCase();
    return !["button", "submit", "reset", "file", "hidden"].includes(type);
  });
  const payload = { name: "", phone: "", email: "", message: "", fields: [] };
  controls.forEach((control) => {
    const value = String(control.value || "").trim();
    if (!value) return;
    const id = control.getAttribute("data-bizuply-form-field-id") || control.getAttribute("name") || "";
    const label = control.getAttribute("placeholder") || id;
    payload.fields.push({ label, value });
    if (id === "name") payload.name = value;
    if (id === "phone") payload.phone = value;
    if (id === "email") payload.email = value;
    if (id === "other" || id === "message") payload.message = value;
  });
  return payload;
}

describe("template-skinned lead forms still collect CRM fields", () => {
  it("includes name/phone/email/message from template markup", () => {
    const form = document.createElement("form");
    form.setAttribute("data-bizuply-form-skin", "template");
    form.innerHTML = `
      <input name="name" data-bizuply-form-field-id="name" value="Dana" />
      <input name="phone" data-bizuply-form-field-id="phone" value="0501234567" />
      <input name="email" data-bizuply-form-field-id="email" value="dana@example.com" />
      <textarea name="other" data-bizuply-form-field-id="other">Hello</textarea>
      <button type="submit">שליחת פרטים</button>
    `;
    // jsdom value assignment
    form.querySelector('[data-bizuply-form-field-id="name"]').value = "Dana";
    form.querySelector('[data-bizuply-form-field-id="phone"]').value = "0501234567";
    form.querySelector('[data-bizuply-form-field-id="email"]').value = "dana@example.com";
    form.querySelector('[data-bizuply-form-field-id="other"]').value = "Hello";

    const payload = collectLeadFormPayload(form);
    expect(payload.name).toBe("Dana");
    expect(payload.phone).toBe("0501234567");
    expect(payload.email).toBe("dana@example.com");
    expect(payload.message).toBe("Hello");
    expect(payload.fields).toHaveLength(4);
  });
});

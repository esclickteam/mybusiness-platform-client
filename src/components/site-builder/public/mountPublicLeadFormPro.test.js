import { describe, expect, it } from "vitest";
import {
  applyConditionalVisibility,
  isSafeRedirectUrl,
} from "./mountPublicLeadFormPro";

describe("mountPublicLeadFormPro", () => {
  it("hides conditional fields until the source matches", () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <div data-bizuply-form-field-wrapper="true">
        <select data-bizuply-form-field-id="need">
          <option value="no" selected>no</option>
          <option value="yes">yes</option>
        </select>
      </div>
      <div data-bizuply-form-field-wrapper="true" data-bizuply-visible-when='{"fieldId":"need","operator":"equals","value":"yes"}'>
        <input data-bizuply-form-field-id="extra" />
      </div>
    `;
    applyConditionalVisibility(form);
    const extra = form.querySelector('[data-bizuply-form-field-id="extra"]');
    expect(extra.disabled).toBe(true);
    form.querySelector("select").value = "yes";
    applyConditionalVisibility(form);
    expect(extra.disabled).toBe(false);
  });

  it("rejects unsafe redirects", () => {
    expect(isSafeRedirectUrl("/thanks")).toBe(true);
    expect(isSafeRedirectUrl("javascript:alert(1)")).toBe(false);
  });
});

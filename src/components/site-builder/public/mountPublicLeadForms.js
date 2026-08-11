import { submitPublicSiteLead } from "../../../api/publicSiteLeadsApi";

const LEAD_FORM_SELECTOR = [
  'form[data-bizuply-block="lead-form"]',
  'form[data-bizuply-form-builder="true"]',
  'form[data-bizuply-widget="lead-form"]',
  'form[data-bizuply-crm-lead="true"]',
  'form[data-bizuply-form-id]',
].join(", ");

const SUBMIT_CTA_SELECTOR = [
  "button[type='submit']",
  "input[type='submit']",
  "button[type='button']",
  "[role='button']",
].join(", ");

function safeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLike(value, needles) {
  const text = safeText(value).toLowerCase();
  return needles.some((needle) => text.includes(needle));
}

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function classifyField({ name, id, label, placeholder, type, tagName }) {
  const blob = [name, id, label, placeholder, type].join(" ");

  if (
    type === "email" ||
    looksLike(blob, ["email", "אימייל", "דואל", "דוא״ל", "מייל"])
  ) {
    return "email";
  }

  if (
    type === "tel" ||
    looksLike(blob, ["phone", "tel", "mobile", "טלפון", "נייד", "פלאפון"])
  ) {
    return "phone";
  }

  if (
    tagName === "TEXTAREA" ||
    looksLike(blob, ["message", "notes", "comment", "הודעה", "פרטים", "בקשה", "עזר"])
  ) {
    return "message";
  }

  if (
    looksLike(blob, [
      "name",
      "fullname",
      "שם",
      "full_name",
      "fullname",
      "contact_name",
    ])
  ) {
    return "name";
  }

  return "other";
}

function readFieldLabel(control) {
  const wrapper = control.closest(
    "[data-bizuply-form-field-wrapper], .ido-form-field-slot, label",
  );
  const labeledBy = control.getAttribute("aria-labelledby");
  if (labeledBy && typeof document !== "undefined") {
    const labelNode = document.getElementById(labeledBy);
    if (labelNode) return safeText(labelNode.textContent);
  }

  if (control.id && typeof document !== "undefined") {
    try {
      const forLabel = document.querySelector(
        `label[for="${String(control.id).replace(/"/g, '\\"')}"]`,
      );
      if (forLabel) return safeText(forLabel.textContent);
    } catch {
      // ignore invalid selectors
    }
  }

  const labelNode =
    wrapper?.querySelector?.(
      '[data-bizuply-form-field-label="true"], label, [data-visual-edit-type="text"]',
    ) || null;

  return safeText(
    labelNode?.textContent ||
      control.getAttribute("aria-label") ||
      control.getAttribute("placeholder") ||
      control.getAttribute("name") ||
      control.id ||
      "שדה",
  );
}

function collectLeadFormPayload(form) {
  const controls = Array.from(
    form.querySelectorAll("input, textarea, select"),
  ).filter((node) => {
    if (!(node instanceof HTMLElement)) return false;
    const type = String(node.getAttribute("type") || "text").toLowerCase();
    if (["button", "submit", "reset", "file", "hidden", "checkbox", "radio"].includes(type)) {
      return type === "checkbox" || type === "radio" ? node.checked : false;
    }
    if (node.disabled) return false;
    return true;
  });

  const payload = {
    name: "",
    phone: "",
    email: "",
    message: "",
    fields: [],
  };

  controls.forEach((control) => {
    const value = safeText(
      control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement ||
        control instanceof HTMLSelectElement
        ? control.value
        : "",
    );
    if (!value) return;

    const wrapper = control.closest("[data-bizuply-form-field-wrapper]");
    const fieldId =
      control.getAttribute("data-bizuply-form-field-id") ||
      wrapper?.getAttribute("data-bizuply-form-field-id") ||
      control.getAttribute("name") ||
      control.id ||
      "";
    const label = readFieldLabel(control);
    const kind = classifyField({
      name: control.getAttribute("name") || "",
      id: fieldId,
      label,
      placeholder: control.getAttribute("placeholder") || "",
      type: String(control.getAttribute("type") || "").toLowerCase(),
      tagName: control.tagName,
    });

    if (kind === "name" && !payload.name) payload.name = value;
    else if (kind === "phone" && !payload.phone) payload.phone = value;
    else if (kind === "email" && !payload.email) payload.email = value;
    else if (kind === "message" && !payload.message) payload.message = value;

    payload.fields.push({ label: label || fieldId || kind, value });
  });

  return payload;
}

function isLeadForm(form) {
  if (!(form instanceof HTMLFormElement)) return false;
  if (form.matches(LEAD_FORM_SELECTOR)) return true;
  if (form.querySelector("[data-bizuply-form-field-wrapper]")) return true;
  return false;
}

function ctaIdentityBlob(node) {
  return [
    node.getAttribute("data-visual-edit-id"),
    node.getAttribute("data-visual-edit-label"),
    node.getAttribute("aria-label"),
    node.id,
    node.getAttribute("name"),
    node.className,
    node.textContent,
  ]
    .map((value) => safeText(value).toLowerCase())
    .join(" ");
}

function looksLikeSubmitCta(node) {
  if (!(node instanceof HTMLElement)) return false;
  if (node.getAttribute("data-bizuply-ignore-lead") === "true") return false;
  if (node.closest("a")) return false;

  const type = String(node.getAttribute("type") || "").toLowerCase();
  if (type === "submit") return true;

  return looksLike(ctaIdentityBlob(node), [
    "submit",
    "שליח",
    "שלח",
    "send",
    "book",
    "שיחה",
    "transmit",
  ]);
}

function copyAttributes(from, to) {
  Array.from(from.attributes || []).forEach((attr) => {
    if (!attr?.name) return;
    if (attr.name === "role" || attr.name === "type" || attr.name === "tabindex") return;
    try {
      to.setAttribute(attr.name, attr.value);
    } catch {
      // ignore invalid attribute copies
    }
  });
}

/**
 * Upgrade non-semantic CTAs inside lead forms to real submit buttons so:
 * - click works
 * - Enter in a field works
 * - disabled/loading can apply
 */
function upgradeLegacyLeadFormCtas(root) {
  if (!root?.querySelectorAll) return;

  Array.from(root.querySelectorAll("form")).forEach((form) => {
    if (!isLeadForm(form)) return;

    // Convert button[type=button] that look like the form submit CTA.
    Array.from(form.querySelectorAll("button[type='button']")).forEach((button) => {
      if (!looksLikeSubmitCta(button)) return;
      button.setAttribute("type", "submit");
      button.setAttribute("data-bizuply-lead-submit", "true");
    });

    // Convert div/[role=button] fake CTAs into semantic submit buttons.
    Array.from(form.querySelectorAll("[role='button']")).forEach((node) => {
      if (node instanceof HTMLButtonElement || node instanceof HTMLInputElement) return;
      if (!looksLikeSubmitCta(node)) return;

      const button = document.createElement("button");
      button.type = "submit";
      button.setAttribute("data-bizuply-lead-submit", "true");
      copyAttributes(node, button);
      button.className = node.className || button.className;
      button.innerHTML = node.innerHTML;
      node.replaceWith(button);
    });
  });
}

function setFormStatus(form, message, tone) {
  let status = form.querySelector("[data-bizuply-lead-status='true']");
  if (!status) {
    status = document.createElement("div");
    status.setAttribute("data-bizuply-lead-status", "true");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.className = "mt-3 text-sm font-bold";
    form.appendChild(status);
  }

  status.textContent = message || "";
  status.dataset.tone = tone || "info";
  status.style.color =
    tone === "error" ? "#be123c" : tone === "success" ? "#047857" : "#475569";
}

function readCtaLabel(node) {
  if (node instanceof HTMLInputElement) return String(node.value || "");
  return String(node.textContent || "");
}

function writeCtaLabel(node, label) {
  if (node instanceof HTMLInputElement) {
    node.value = label;
    return;
  }
  node.textContent = label;
}

function setFormBusy(form, busy, label) {
  form.setAttribute("aria-busy", busy ? "true" : "false");

  form.querySelectorAll(SUBMIT_CTA_SELECTOR).forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (!looksLikeSubmitCta(node) && node.getAttribute("type") !== "submit") return;

    if (busy) {
      if (!node.dataset.bizuplyLeadOriginalLabel) {
        node.dataset.bizuplyLeadOriginalLabel = readCtaLabel(node);
      }
      if (node instanceof HTMLButtonElement || node instanceof HTMLInputElement) {
        node.disabled = true;
      } else {
        node.setAttribute("aria-disabled", "true");
        node.style.pointerEvents = "none";
        node.style.opacity = "0.72";
      }
      if (label) writeCtaLabel(node, label);
      return;
    }

    if (form.getAttribute("data-bizuply-lead-submitted") === "true") {
      if (node instanceof HTMLButtonElement || node instanceof HTMLInputElement) {
        node.disabled = true;
      } else {
        node.setAttribute("aria-disabled", "true");
        node.style.pointerEvents = "none";
      }
      return;
    }

    if (node instanceof HTMLButtonElement || node instanceof HTMLInputElement) {
      node.disabled = false;
    } else {
      node.removeAttribute("aria-disabled");
      node.style.pointerEvents = "";
      node.style.opacity = "";
    }

    const original = node.dataset.bizuplyLeadOriginalLabel;
    if (original != null) {
      writeCtaLabel(node, original);
      delete node.dataset.bizuplyLeadOriginalLabel;
    }
  });
}

function getOrCreateSubmitKey(form) {
  const existing = form.getAttribute("data-bizuply-lead-idempotency-key");
  if (existing) return existing;
  const key = createIdempotencyKey();
  form.setAttribute("data-bizuply-lead-idempotency-key", key);
  return key;
}

async function handleLeadFormSubmit(form, options) {
  if (form.getAttribute("data-bizuply-lead-submitting") === "true") return;
  if (form.getAttribute("data-bizuply-lead-submitted") === "true") return;

  const collected = collectLeadFormPayload(form);
  if (!collected.name && !collected.phone && !collected.email && !collected.message) {
    setFormStatus(form, "נא למלא את פרטי הטופס לפני השליחה", "error");
    return;
  }

  const idempotencyKey = getOrCreateSubmitKey(form);

  form.setAttribute("data-bizuply-lead-submitting", "true");
  setFormBusy(form, true, "שולחים...");
  setFormStatus(form, "שולחים את הפנייה...", "info");

  try {
    const response = await submitPublicSiteLead(options.slug || "", {
      formId:
        form.getAttribute("data-bizuply-form-id") ||
        form.getAttribute("data-bizuply-block") ||
        "website-form",
      pagePath: options.pagePath || "",
      host: options.host || "",
      name: collected.name,
      phone: collected.phone,
      email: collected.email,
      message: collected.message,
      fields: collected.fields,
      idempotencyKey,
    });

    const successMessage =
      safeText(response?.message) ||
      safeText(form.getAttribute("data-bizuply-success-message")) ||
      "תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.";

    form.setAttribute("data-bizuply-lead-submitted", "true");
    setFormStatus(form, successMessage, "success");
    form.reset();
    setFormBusy(form, false);
    // Keep submit locked briefly so double-click after success cannot resubmit
    // until the user intentionally starts a new attempt (new idempotency key).
    window.setTimeout(() => {
      form.removeAttribute("data-bizuply-lead-submitted");
      form.removeAttribute("data-bizuply-lead-idempotency-key");
      setFormBusy(form, false);
    }, 2500);
  } catch (error) {
    const apiError =
      error?.response?.data?.error ||
      error?.message ||
      "שגיאה בשליחת הטופס. נסו שוב בעוד רגע.";
    setFormStatus(form, apiError, "error");
    // Keep the same idempotency key so an immediate retry of the SAME attempt
    // cannot create a duplicate if the first request already succeeded server-side.
    setFormBusy(form, false);
  } finally {
    form.removeAttribute("data-bizuply-lead-submitting");
  }
}

function resolveLeadSubmitControl(target) {
  if (!(target instanceof Element)) return null;
  const control = target.closest(SUBMIT_CTA_SELECTOR);
  if (!(control instanceof HTMLElement)) return null;
  return control;
}

/**
 * Wire public site contact/lead forms into CRM (source: website).
 * Idempotent: reuses one delegated listener and refreshes options.
 */
export function mountPublicLeadForms(root, options = {}) {
  if (!root || typeof root.addEventListener !== "function") return;

  root.__bizuplyLeadFormOptions = {
    slug: safeText(options.slug),
    host: safeText(options.host),
    pagePath: safeText(options.pagePath),
    businessId: safeText(options.businessId),
  };

  upgradeLegacyLeadFormCtas(root);

  if (root.dataset.bizuplyLeadFormsMounted === "true") return;
  root.dataset.bizuplyLeadFormsMounted = "true";

  root.addEventListener(
    "submit",
    (event) => {
      const form = event.target;
      if (!isLeadForm(form) || !root.contains(form)) return;
      event.preventDefault();
      event.stopPropagation();
      void handleLeadFormSubmit(form, root.__bizuplyLeadFormOptions || {});
    },
    true,
  );

  root.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      const control = resolveLeadSubmitControl(target);
      if (!control || !root.contains(control)) return;

      const form = control.closest("form");
      if (!isLeadForm(form)) return;
      if (!looksLikeSubmitCta(control) && control.getAttribute("type") !== "submit") return;

      const type = String(control.getAttribute("type") || "").toLowerCase();
      const isNativeSubmit =
        (control instanceof HTMLButtonElement && (type === "submit" || type === "")) ||
        (control instanceof HTMLInputElement && type === "submit") ||
        control.getAttribute("type") === "submit";

      // Native submit buttons rely on the form "submit" event only — avoid double fire.
      if (isNativeSubmit) return;

      // Legacy non-submit CTAs (type=button / role=button) still submit via the shared handler.
      event.preventDefault();
      event.stopPropagation();
      void handleLeadFormSubmit(form, root.__bizuplyLeadFormOptions || {});
    },
    true,
  );

  root.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target;
      const control = resolveLeadSubmitControl(target);
      if (!control || !root.contains(control)) return;
      if (control instanceof HTMLButtonElement || control instanceof HTMLInputElement) return;

      const form = control.closest("form");
      if (!isLeadForm(form) || !looksLikeSubmitCta(control)) return;

      event.preventDefault();
      event.stopPropagation();
      void handleLeadFormSubmit(form, root.__bizuplyLeadFormOptions || {});
    },
    true,
  );
}

export const __testables = {
  collectLeadFormPayload,
  isLeadForm,
  looksLikeSubmitCta,
  upgradeLegacyLeadFormCtas,
  handleLeadFormSubmit,
  setFormBusy,
};

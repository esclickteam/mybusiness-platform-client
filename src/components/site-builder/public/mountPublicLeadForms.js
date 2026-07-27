import { submitPublicSiteLead } from "../../../api/publicSiteLeadsApi";

const LEAD_FORM_SELECTOR = [
  'form[data-bizuply-block="lead-form"]',
  'form[data-bizuply-form-builder="true"]',
  'form[data-bizuply-widget="lead-form"]',
  'form[data-bizuply-crm-lead="true"]',
  'form[data-bizuply-form-id]',
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

function setFormStatus(form, message, tone) {
  let status = form.querySelector("[data-bizuply-lead-status='true']");
  if (!status) {
    status = document.createElement("div");
    status.setAttribute("data-bizuply-lead-status", "true");
    status.setAttribute("role", "status");
    status.className = "mt-3 text-sm font-bold";
    form.appendChild(status);
  }

  status.textContent = message || "";
  status.style.color =
    tone === "error" ? "#be123c" : tone === "success" ? "#047857" : "#475569";
}

function setFormBusy(form, busy) {
  form.setAttribute("aria-busy", busy ? "true" : "false");
  form.querySelectorAll("button, input[type='submit']").forEach((node) => {
    if (node instanceof HTMLButtonElement || node instanceof HTMLInputElement) {
      node.disabled = busy;
    }
  });
}

async function handleLeadFormSubmit(form, options) {
  if (form.getAttribute("data-bizuply-lead-submitting") === "true") return;

  const collected = collectLeadFormPayload(form);
  if (!collected.name && !collected.phone && !collected.email && !collected.message) {
    setFormStatus(form, "נא למלא את פרטי הטופס לפני השליחה", "error");
    return;
  }

  form.setAttribute("data-bizuply-lead-submitting", "true");
  setFormBusy(form, true);
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
    });

    const successMessage =
      safeText(response?.message) ||
      safeText(form.getAttribute("data-bizuply-success-message")) ||
      "תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.";

    setFormStatus(form, successMessage, "success");
    form.reset();
  } catch (error) {
    const apiError =
      error?.response?.data?.error ||
      error?.message ||
      "שגיאה בשליחת הטופס. נסו שוב בעוד רגע.";
    setFormStatus(form, apiError, "error");
  } finally {
    form.removeAttribute("data-bizuply-lead-submitting");
    setFormBusy(form, false);
  }
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
      if (!(target instanceof Element)) return;

      const button = target.closest("button, input[type='submit']");
      if (!(button instanceof HTMLElement) || !root.contains(button)) return;

      const form = button.closest("form");
      if (!isLeadForm(form)) return;

      const type = String(button.getAttribute("type") || "submit").toLowerCase();
      if (type !== "submit" && type !== "button") return;
      if (type === "button" && button.getAttribute("data-bizuply-ignore-lead") === "true") {
        return;
      }

      // type=button lead CTAs still submit to CRM
      if (type === "button") {
        event.preventDefault();
        event.stopPropagation();
        void handleLeadFormSubmit(form, root.__bizuplyLeadFormOptions || {});
      }
    },
    true,
  );
}

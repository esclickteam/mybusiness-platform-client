function safeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseVisibleWhen(raw) {
  try {
    const parsed = JSON.parse(String(raw || ""));
    if (!parsed || typeof parsed !== "object") return null;
    const fieldId = safeText(parsed.fieldId);
    if (!fieldId) return null;
    return {
      fieldId,
      operator:
        parsed.operator === "notEquals" || parsed.operator === "contains"
          ? parsed.operator
          : "equals",
      value: String(parsed.value || ""),
    };
  } catch {
    return null;
  }
}

function readControlValue(control) {
  if (!(control instanceof HTMLElement)) return "";
  if (control instanceof HTMLInputElement && control.type === "checkbox") {
    return control.checked ? "true" : "";
  }
  if (control instanceof HTMLInputElement && control.type === "file") {
    return control.files?.[0]?.name || "";
  }
  if (
    control instanceof HTMLInputElement ||
    control instanceof HTMLTextAreaElement ||
    control instanceof HTMLSelectElement
  ) {
    return safeText(control.value);
  }
  return "";
}

function findControlByFieldId(form, fieldId) {
  const id = safeText(fieldId);
  if (!id) return null;
  return (
    form.querySelector(`[data-bizuply-form-field-id="${id}"]`) ||
    form.querySelector(`[name="${id}"]`) ||
    form.querySelector(`#${CSS.escape ? CSS.escape(id) : id}`)
  );
}

function conditionMatches(actual, condition) {
  const left = safeText(actual).toLowerCase();
  const right = safeText(condition.value).toLowerCase();
  if (condition.operator === "contains") return left.includes(right);
  if (condition.operator === "notEquals") return left !== right;
  return left === right;
}

export function applyConditionalVisibility(form) {
  const wrappers = Array.from(
    form.querySelectorAll("[data-bizuply-form-field-wrapper], [data-bizuply-visible-when]"),
  );
  wrappers.forEach((wrapper) => {
    const raw =
      wrapper.getAttribute("data-bizuply-visible-when") ||
      wrapper
        .querySelector?.("[data-bizuply-visible-when]")
        ?.getAttribute("data-bizuply-visible-when");
    const condition = parseVisibleWhen(raw);
    if (!condition) {
      wrapper.style.display = "";
      wrapper.removeAttribute("data-bizuply-field-hidden");
      return;
    }
    const source = findControlByFieldId(form, condition.fieldId);
    const visible = conditionMatches(readControlValue(source), condition);
    wrapper.style.display = visible ? "" : "none";
    if (visible) wrapper.removeAttribute("data-bizuply-field-hidden");
    else wrapper.setAttribute("data-bizuply-field-hidden", "true");
    wrapper.querySelectorAll("input, textarea, select").forEach((node) => {
      if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement) {
        node.disabled = !visible;
      }
    });
  });
}

function stepCount(form) {
  const attr = Number(form.getAttribute("data-bizuply-form-steps") || 0);
  if (attr > 1) return attr;
  const steps = new Set(
    Array.from(form.querySelectorAll("[data-bizuply-form-step]")).map((node) =>
      Number(node.getAttribute("data-bizuply-form-step") || 0),
    ),
  );
  return [...steps].filter((value) => value > 0).length;
}

function currentStep(form) {
  return Number(form.getAttribute("data-bizuply-current-step") || 1) || 1;
}

export function applyMultiStep(form) {
  const total = stepCount(form);
  if (total < 2) return;
  const step = currentStep(form);
  form.setAttribute("data-bizuply-current-step", String(step));
  form.querySelectorAll("[data-bizuply-form-field-wrapper]").forEach((wrapper) => {
    const fieldStep = Number(wrapper.getAttribute("data-bizuply-form-step") || 1) || 1;
    const onStep = fieldStep === step;
    wrapper.style.display = onStep ? "" : "none";
    wrapper.setAttribute("data-bizuply-step-hidden", onStep ? "false" : "true");
    wrapper.querySelectorAll("input, textarea, select").forEach((node) => {
      if (
        node instanceof HTMLInputElement ||
        node instanceof HTMLTextAreaElement ||
        node instanceof HTMLSelectElement
      ) {
        if (!onStep) node.disabled = true;
      }
    });
  });

  let nav = form.querySelector("[data-bizuply-form-step-nav='true']");
  if (!nav) {
    nav = document.createElement("div");
    nav.setAttribute("data-bizuply-form-step-nav", "true");
    nav.className = "mt-3 flex items-center justify-between gap-3";
    const actions = form.querySelector("[data-bizuply-form-actions='true']");
    if (actions) actions.parentNode?.insertBefore(nav, actions);
    else form.appendChild(nav);
  }
  nav.innerHTML = `
    <button type="button" data-bizuply-form-prev="true" class="rounded-xl border px-4 py-2 text-sm font-black">הקודם</button>
    <span class="text-xs font-bold">${step} / ${total}</span>
    <button type="button" data-bizuply-form-next="true" class="rounded-xl border px-4 py-2 text-sm font-black">הבא</button>
  `;
  const prev = nav.querySelector("[data-bizuply-form-prev='true']");
  const next = nav.querySelector("[data-bizuply-form-next='true']");
  if (prev instanceof HTMLButtonElement) prev.disabled = step <= 1;
  if (next instanceof HTMLButtonElement) next.hidden = step >= total;
  const submit = form.querySelector("[data-bizuply-form-actions='true']");
  if (submit instanceof HTMLElement) {
    submit.style.display = step >= total ? "" : "none";
  }
}

export function enhancePublicLeadForm(form) {
  if (!(form instanceof HTMLFormElement)) return;
  applyConditionalVisibility(form);
  applyMultiStep(form);
  if (form.dataset.bizuplyFormProBound === "true") return;
  form.dataset.bizuplyFormProBound = "true";
  form.addEventListener("input", () => applyConditionalVisibility(form));
  form.addEventListener("change", () => applyConditionalVisibility(form));
  form.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest("[data-bizuply-form-next='true']")) {
      event.preventDefault();
      const total = stepCount(form);
      const nextStep = Math.min(total, currentStep(form) + 1);
      form.setAttribute("data-bizuply-current-step", String(nextStep));
      applyMultiStep(form);
    }
    if (target.closest("[data-bizuply-form-prev='true']")) {
      event.preventDefault();
      const prevStep = Math.max(1, currentStep(form) - 1);
      form.setAttribute("data-bizuply-current-step", String(prevStep));
      applyMultiStep(form);
    }
  });
}

export function collectFileInputs(form) {
  return Array.from(form.querySelectorAll('input[type="file"]')).filter((node) => {
    if (!(node instanceof HTMLInputElement)) return false;
    if (node.disabled) return false;
    if (node.closest("[data-bizuply-field-hidden='true']")) return false;
    return Boolean(node.files && node.files[0]);
  });
}

export function isSafeRedirectUrl(value) {
  const url = safeText(value);
  if (!url) return false;
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function maybeRedirectAfterSubmit(form) {
  const url = form.getAttribute("data-bizuply-redirect-url") || "";
  if (!isSafeRedirectUrl(url)) return false;
  window.setTimeout(() => {
    window.location.assign(url);
  }, 400);
  return true;
}

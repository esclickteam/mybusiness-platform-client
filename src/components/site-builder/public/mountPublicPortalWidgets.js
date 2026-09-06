import {
  sitePortalLogin,
  sitePortalRegister,
  sitePortalForgotPassword,
  sitePortalResetPassword,
  sitePortalMe,
  sitePortalMyOrders,
  sitePortalLogout,
} from "../../../api/sitePortalApi";
import i18n from "../../../i18n/i18n";
import { getTextDirection } from "../../../i18n/localeUtils";
import {
  findStoredPortalTokenHint,
  getSitePortalToken,
} from "../../../utils/sitePortalSession";
import { resolvePortalPaths } from "./portalSitePaths";

const t = (key, opts) => i18n.t(key, opts);

function clearMount(el) {
  if (typeof el.replaceChildren === "function") {
    el.replaceChildren();
    return;
  }
  while (el.firstChild) el.removeChild(el.firstChild);
}

function el(tag, style = {}, text = "") {
  const node = document.createElement(tag);
  Object.assign(node.style, style);
  if (text) node.textContent = text;
  return node;
}

function readCart(businessId) {
  try {
    const raw = localStorage.getItem(`bizuply_store_cart_${businessId}`) || "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function resolveSiteId(site) {
  return String(site?._id || site?.id || "").trim();
}

function navigateToSitePath(path) {
  const target = String(path || "/") || "/";

  window.history.pushState({}, "", target);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function readPortalTheme(container) {
  const ds = container?.dataset || {};
  return {
    accent: ds.bizuplyPortalAccent || "#0e7490",
    ink: ds.bizuplyPortalInk || "#0f172a",
    muted: ds.bizuplyPortalMuted || "#64748b",
    line: ds.bizuplyPortalLine || "#e2e8f0",
    soft: ds.bizuplyPortalSoft || "#f8fafc",
  };
}

function styleInput(input, theme) {
  Object.assign(input.style, {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "12px",
    borderRadius: "16px",
    border: `1px solid ${theme.line}`,
    padding: "14px 16px",
    fontSize: "14px",
    fontWeight: "600",
    color: theme.ink,
    background: "#fff",
    outline: "none",
  });
}

function prepareMountShell(container) {
  clearMount(container);
  container.dir = getTextDirection(i18n.language);
  delete container.dataset.bizuplyPortalMounted;
  delete container.dataset.bizuplyPortalLive;
  // Legacy saves put switch/forgot href on the whole form shell — strip so
  // fills/submit work and only real inner anchors navigate.
  [
    "data-bizuply-public-href",
    "data-bizuply-public-target",
    "data-bizuply-public-link",
    "data-visual-link-href",
    "data-visual-link-target",
    "data-href",
    "data-link-url",
    "href",
  ].forEach((attr) => container.removeAttribute(attr));
  if (container.getAttribute("role") === "link") {
    container.removeAttribute("role");
  }
  if (container.getAttribute("tabindex") === "0") {
    container.removeAttribute("tabindex");
  }
  Object.assign(container.style, {
    overflow: "auto",
    boxSizing: "border-box",
  });
}

/** Saved copy on the mount shell (editable in the studio header/forms panel). */
function readPortalCopy(container, key, fallback) {
  const value = String(
    container?.getAttribute(`data-portal-copy-${key}`) ||
      container?.dataset?.[
        `portalCopy${key.charAt(0).toUpperCase()}${key.slice(1)}`
      ] ||
      "",
  ).trim();
  return value || fallback;
}

/** Saved link targets for the form's text buttons (הרשמה / שכחתי סיסמה / …). */
function readPortalLink(container, key, fallback) {
  const value = String(
    container?.getAttribute(`data-portal-link-${key}`) ||
      container?.dataset?.[
        `portalLink${key.charAt(0).toUpperCase()}${key.slice(1)}`
      ] ||
      "",
  ).trim();
  return value || fallback;
}

function bindEditorSafeLink(anchor, href, editorMode) {
  anchor.href = href || "#";
  if (!editorMode) return;

  // Block navigation in the studio, but let the click bubble so the
  // visual editor can select this link like any other canvas button.
  anchor.addEventListener("click", (event) => {
    event.preventDefault();
  });
}

function portalAuthControlLabels() {
  return {
    submit: t("publicWidgets.portal.submitButton"),
    switch: t("publicWidgets.portal.switchLink"),
    forgot: t("publicWidgets.portal.forgotPassword"),
    title: t("publicWidgets.portal.formTitle"),
    subtitle: t("publicWidgets.portal.formSubtitle"),
    eyebrow: t("publicWidgets.portal.formEyebrow"),
  };
}

const PORTAL_TEXT_CONTROL_KINDS = new Set(["title", "subtitle", "eyebrow"]);

/** Stamp login/register controls so owners can click + link them on canvas. */
function stampPortalAuthControl(node, container, kind, editorMode) {
  if (!editorMode || !node || !container) return;

  const shellId = String(
    container.getAttribute("data-visual-edit-id") ||
      container.id ||
      "portal",
  ).trim() || "portal";
  const controlId = `${shellId}__portal_${kind}`;
  const isText = PORTAL_TEXT_CONTROL_KINDS.has(kind);

  node.setAttribute("data-bizuply-portal-control", kind);
  node.setAttribute("data-bizuply-portal-shell-id", shellId);
  node.setAttribute("data-visual-edit-id", controlId);
  node.setAttribute("data-visual-editable", "true");
  node.setAttribute("data-visual-edit-type", isText ? "text" : "button");
  node.setAttribute("data-visual-type", isText ? "text" : "button");
  node.setAttribute(
    "data-visual-edit-label",
    portalAuthControlLabels()[kind] ||
      (isText ? t("publicWidgets.portal.text") : t("publicWidgets.portal.button")),
  );
  if (!isText) {
    node.setAttribute("data-visual-link-href", node.getAttribute("href") || "");
  }
}

function mountLogin(container, { siteId, host, siteName, paths, editorMode }) {
  prepareMountShell(container);
  const theme = readPortalTheme(container);
  const copy = {
    eyebrow: readPortalCopy(container, "eyebrow", t("publicWidgets.portal.area")),
    title: readPortalCopy(
      container,
      "title",
      siteName
        ? t("publicWidgets.portal.loginTo", { name: siteName })
        : t("publicWidgets.portal.login"),
    ),
    subtitle: readPortalCopy(
      container,
      "subtitle",
      t("publicWidgets.portal.loginSubtitle"),
    ),
    email: readPortalCopy(container, "email", t("publicWidgets.common.email")),
    password: readPortalCopy(container, "password", t("publicWidgets.common.password")),
    submit: readPortalCopy(container, "submit", t("publicWidgets.portal.login")),
    register: readPortalCopy(container, "switch", t("publicWidgets.portal.noAccountRegister")),
    forgot: readPortalCopy(container, "forgot", t("publicWidgets.portal.forgotPassword")),
  };

  const wrap = el("div", {
    padding: "28px",
    fontFamily: "inherit",
    color: theme.ink,
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  });

  const eyebrowNode = el(
    "div",
    {
      fontSize: "12px",
      fontWeight: "800",
      color: theme.accent,
      letterSpacing: "0.04em",
      marginBottom: "8px",
    },
    copy.eyebrow,
  );
  stampPortalAuthControl(eyebrowNode, container, "eyebrow", editorMode);
  wrap.appendChild(eyebrowNode);

  const titleNode = el(
    "h3",
    { fontSize: "26px", fontWeight: "900", margin: "0 0 8px", lineHeight: "1.15" },
    copy.title,
  );
  stampPortalAuthControl(titleNode, container, "title", editorMode);
  wrap.appendChild(titleNode);

  const subtitleNode = el(
    "p",
    {
      fontSize: "13px",
      fontWeight: "600",
      color: theme.muted,
      margin: "0 0 20px",
      lineHeight: "1.6",
    },
    copy.subtitle,
  );
  stampPortalAuthControl(subtitleNode, container, "subtitle", editorMode);
  wrap.appendChild(subtitleNode);

  const email = document.createElement("input");
  email.type = "email";
  email.name = "email";
  email.required = true;
  email.placeholder = copy.email;
  email.autocomplete = "username";
  email.setAttribute("data-bizuply-portal-auth-field", "email");
  styleInput(email, theme);

  const password = document.createElement("input");
  password.type = "password";
  password.name = "password";
  password.required = true;
  password.placeholder = copy.password;
  password.autocomplete = "current-password";
  password.setAttribute("data-bizuply-portal-auth-field", "password");
  styleInput(password, theme);

  const errorBox = el("div", {
    display: "none",
    marginBottom: "10px",
    borderRadius: "12px",
    background: "#fff1f2",
    color: "#e11d48",
    fontSize: "12px",
    fontWeight: "700",
    padding: "10px 12px",
  });

  const submit = el(
    "button",
    {
      width: "100%",
      border: "0",
      borderRadius: "16px",
      background: theme.ink,
      color: "#fff",
      padding: "14px 16px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
      boxShadow: "0 14px 28px -18px rgba(15,23,42,0.55)",
    },
    copy.submit,
  );
  submit.type = "submit";
  submit.setAttribute("data-bizuply-portal-login-submit", "");
  submit.setAttribute("data-bizuply-portal-auth-submit", "login");
  stampPortalAuthControl(submit, container, "submit", editorMode);

  const form = document.createElement("form");
  form.setAttribute("data-bizuply-portal-auth", "login");
  form.setAttribute("data-bizuply-portal-auth-form", "login");
  form.style.display = "flex";
  form.style.flexDirection = "column";

  let submitting = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBox.style.display = "none";

    if (editorMode) {
      // Selection handles the click in the studio — no fake login noise.
      return;
    }
    if (submitting) return;
    submitting = true;

    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    submit.textContent = t("publicWidgets.portal.signingIn");
    try {
      await sitePortalLogin({
        email: email.value,
        password: password.value,
        siteId: siteId || undefined,
        host: host || window.location.host,
      });
      navigateToSitePath(paths?.account || "/portal/account");
    } catch (err) {
      errorBox.textContent = err?.message || t("publicWidgets.portal.loginFailed");
      errorBox.setAttribute("data-bizuply-portal-auth-error", "login");
      errorBox.style.display = "block";
    } finally {
      submitting = false;
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
      submit.textContent = copy.submit;
    }
  });

  form.appendChild(email);
  form.appendChild(password);
  form.appendChild(errorBox);
  form.appendChild(submit);
  wrap.appendChild(form);

  const linksRow = el("div", {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    marginTop: "16px",
  });

  const registerLink = document.createElement("a");
  const registerHref = readPortalLink(
    container,
    "switch",
    paths?.register || "/register",
  );
  bindEditorSafeLink(registerLink, registerHref, editorMode);
  registerLink.textContent = copy.register;
  Object.assign(registerLink.style, {
    color: theme.accent,
    fontSize: "13px",
    fontWeight: "800",
    textDecoration: "none",
  });
  stampPortalAuthControl(registerLink, container, "switch", editorMode);
  registerLink.setAttribute("data-visual-link-href", registerHref || "");
  linksRow.appendChild(registerLink);

  const forgotLink = document.createElement("a");
  const forgotHref = readPortalLink(
    container,
    "forgot",
    paths?.forgotPassword || "/portal/forgot-password",
  );
  bindEditorSafeLink(forgotLink, forgotHref, editorMode);
  forgotLink.textContent = copy.forgot;
  Object.assign(forgotLink.style, {
    color: theme.muted,
    fontSize: "13px",
    fontWeight: "800",
    textDecoration: "none",
  });
  stampPortalAuthControl(forgotLink, container, "forgot", editorMode);
  forgotLink.setAttribute("data-visual-link-href", forgotHref || "");
  linksRow.appendChild(forgotLink);

  wrap.appendChild(linksRow);

  container.appendChild(wrap);
}

function mountRegister(container, { siteId, host, siteName, paths, editorMode }) {
  prepareMountShell(container);
  const theme = readPortalTheme(container);
  const copy = {
    eyebrow: readPortalCopy(container, "eyebrow", t("publicWidgets.portal.area")),
    title: readPortalCopy(
      container,
      "title",
      siteName
        ? t("publicWidgets.portal.registerTo", { name: siteName })
        : t("publicWidgets.portal.register"),
    ),
    subtitle: readPortalCopy(
      container,
      "subtitle",
      t("publicWidgets.portal.registerSubtitle"),
    ),
    name: readPortalCopy(container, "name", t("publicWidgets.common.fullName")),
    email: readPortalCopy(container, "email", t("publicWidgets.common.email")),
    phone: readPortalCopy(container, "phone", t("publicWidgets.portal.phoneOptional")),
    password: readPortalCopy(container, "password", t("publicWidgets.portal.passwordMin")),
    submit: readPortalCopy(container, "submit", t("publicWidgets.portal.createAccount")),
    login: readPortalCopy(container, "switch", t("publicWidgets.portal.alreadyLogin")),
  };

  const wrap = el("div", {
    padding: "28px",
    fontFamily: "inherit",
    color: theme.ink,
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  });

  const eyebrowNode = el(
    "div",
    {
      fontSize: "12px",
      fontWeight: "800",
      color: theme.accent,
      letterSpacing: "0.04em",
      marginBottom: "8px",
    },
    copy.eyebrow,
  );
  stampPortalAuthControl(eyebrowNode, container, "eyebrow", editorMode);
  wrap.appendChild(eyebrowNode);

  const titleNode = el(
    "h3",
    { fontSize: "26px", fontWeight: "900", margin: "0 0 8px", lineHeight: "1.15" },
    copy.title,
  );
  stampPortalAuthControl(titleNode, container, "title", editorMode);
  wrap.appendChild(titleNode);

  const subtitleNode = el(
    "p",
    {
      fontSize: "13px",
      fontWeight: "600",
      color: theme.muted,
      margin: "0 0 18px",
      lineHeight: "1.6",
    },
    copy.subtitle,
  );
  stampPortalAuthControl(subtitleNode, container, "subtitle", editorMode);
  wrap.appendChild(subtitleNode);

  const fullName = document.createElement("input");
  fullName.type = "text";
  fullName.name = "fullName";
  fullName.required = true;
  fullName.placeholder = copy.name;
  fullName.autocomplete = "name";
  fullName.setAttribute("data-bizuply-portal-auth-field", "fullName");
  styleInput(fullName, theme);

  const email = document.createElement("input");
  email.type = "email";
  email.name = "email";
  email.required = true;
  email.placeholder = copy.email;
  email.autocomplete = "username";
  email.setAttribute("data-bizuply-portal-auth-field", "email");
  styleInput(email, theme);

  const phone = document.createElement("input");
  phone.type = "tel";
  phone.name = "phone";
  phone.placeholder = copy.phone;
  phone.autocomplete = "tel";
  phone.setAttribute("data-bizuply-portal-auth-field", "phone");
  styleInput(phone, theme);

  const password = document.createElement("input");
  password.type = "password";
  password.name = "password";
  password.required = true;
  password.placeholder = copy.password;
  password.autocomplete = "new-password";
  password.setAttribute("data-bizuply-portal-auth-field", "password");
  styleInput(password, theme);

  const errorBox = el("div", {
    display: "none",
    marginBottom: "10px",
    borderRadius: "12px",
    background: "#fff1f2",
    color: "#e11d48",
    fontSize: "12px",
    fontWeight: "700",
    padding: "10px 12px",
  });

  const submit = el(
    "button",
    {
      width: "100%",
      border: "0",
      borderRadius: "16px",
      background: theme.ink,
      color: "#fff",
      padding: "14px 16px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
      boxShadow: "0 14px 28px -18px rgba(15,23,42,0.55)",
    },
    copy.submit,
  );
  submit.type = "submit";
  submit.setAttribute("data-bizuply-portal-auth-submit", "register");
  stampPortalAuthControl(submit, container, "submit", editorMode);

  const form = document.createElement("form");
  form.setAttribute("data-bizuply-portal-auth", "register");
  form.setAttribute("data-bizuply-portal-auth-form", "register");
  form.style.display = "flex";
  form.style.flexDirection = "column";

  let submitting = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBox.style.display = "none";

    if (editorMode) {
      return;
    }
    if (submitting) return;
    submitting = true;

    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    submit.textContent = t("publicWidgets.portal.registering");
    try {
      await sitePortalRegister({
        email: email.value,
        password: password.value,
        fullName: fullName.value,
        phone: phone.value,
        siteId: siteId || undefined,
        host: host || window.location.host,
      });
      navigateToSitePath(paths?.account || "/portal/account");
    } catch (err) {
      errorBox.textContent = err?.message || t("publicWidgets.portal.registerFailed");
      errorBox.style.display = "block";
    } finally {
      submitting = false;
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
      submit.textContent = copy.submit;
    }
  });

  form.appendChild(fullName);
  form.appendChild(email);
  form.appendChild(phone);
  form.appendChild(password);
  form.appendChild(errorBox);
  form.appendChild(submit);
  wrap.appendChild(form);

  const loginLink = document.createElement("a");
  const loginHref = readPortalLink(
    container,
    "switch",
    paths?.login || "/login",
  );
  bindEditorSafeLink(loginLink, loginHref, editorMode);
  loginLink.textContent = copy.login;
  Object.assign(loginLink.style, {
    display: "inline-block",
    marginTop: "16px",
    color: theme.accent,
    fontSize: "13px",
    fontWeight: "800",
    textDecoration: "none",
  });
  stampPortalAuthControl(loginLink, container, "switch", editorMode);
  loginLink.setAttribute("data-visual-link-href", loginHref || "");
  wrap.appendChild(loginLink);

  container.appendChild(wrap);
}

function portalHeading(wrap, theme, { eyebrow, title, subtitle }) {
  wrap.appendChild(
    el(
      "div",
      {
        fontSize: "12px",
        fontWeight: "800",
        color: theme.accent,
        letterSpacing: "0.04em",
        marginBottom: "8px",
      },
      eyebrow,
    ),
  );
  wrap.appendChild(
    el(
      "h3",
      {
        fontSize: "26px",
        fontWeight: "900",
        margin: "0 0 8px",
        lineHeight: "1.15",
      },
      title,
    ),
  );
  wrap.appendChild(
    el(
      "p",
      {
        fontSize: "13px",
        fontWeight: "600",
        color: theme.muted,
        margin: "0 0 20px",
        lineHeight: "1.6",
      },
      subtitle,
    ),
  );
}

function portalNoticeBox(theme, tone = "error") {
  const box = el("div", {
    display: "none",
    marginBottom: "12px",
    padding: "12px 14px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: "1.6",
    background: tone === "success" ? "#ecfdf5" : "#fef2f2",
    color: tone === "success" ? "#047857" : "#b91c1c",
    border: `1px solid ${tone === "success" ? "#a7f3d0" : "#fecaca"}`,
  });
  return box;
}

function portalPrimaryButton(theme, label) {
  const button = el(
    "button",
    {
      width: "100%",
      border: "0",
      borderRadius: "16px",
      background: theme.ink,
      color: "#fff",
      padding: "14px 16px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
      boxShadow: "0 14px 28px -18px rgba(15,23,42,0.55)",
    },
    label,
  );
  button.type = "button";
  return button;
}

/** "Forgot password" — asks for the email and sends the reset link by mail. */
function mountForgotPassword(container, { siteId, host, siteName, paths, editorMode }) {
  prepareMountShell(container);
  const theme = readPortalTheme(container);

  const wrap = el("div", {
    padding: "28px",
    fontFamily: "inherit",
    color: theme.ink,
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  });

  portalHeading(wrap, theme, {
    eyebrow: t("publicWidgets.portal.area"),
    title: t("publicWidgets.portal.forgotPassword"),
    subtitle: t("publicWidgets.portal.forgotSubtitle"),
  });

  const email = document.createElement("input");
  email.type = "email";
  email.required = true;
  email.placeholder = t("publicWidgets.common.email");
  email.autocomplete = "email";
  styleInput(email, theme);

  const errorBox = portalNoticeBox(theme, "error");
  const successBox = portalNoticeBox(theme, "success");
  const submit = portalPrimaryButton(theme, t("publicWidgets.portal.sendResetLink"));

  submit.addEventListener("click", async () => {
    errorBox.style.display = "none";
    successBox.style.display = "none";

    if (editorMode) {
      successBox.textContent = t("publicWidgets.portal.editorNoEmail");
      successBox.style.display = "block";
      return;
    }

    submit.disabled = true;
    submit.textContent = t("publicWidgets.portal.sending");

    try {
      const result = await sitePortalForgotPassword({
        email: email.value,
        siteId: siteId || undefined,
        host: host || window.location.host,
        resetPath: paths?.resetPassword || "/portal/reset-password",
      });

      successBox.textContent =
        result?.message || t("publicWidgets.portal.resetSent");
      successBox.style.display = "block";
    } catch (err) {
      errorBox.textContent = err?.message || t("publicWidgets.portal.resetSendFailed");
      errorBox.style.display = "block";
    } finally {
      submit.disabled = false;
      submit.textContent = t("publicWidgets.portal.sendResetLink");
    }
  });

  wrap.appendChild(email);
  wrap.appendChild(errorBox);
  wrap.appendChild(successBox);
  wrap.appendChild(submit);

  const backLink = document.createElement("a");
  backLink.href = paths?.login || "/portal/login";
  backLink.textContent = t("publicWidgets.portal.backToLogin");
  Object.assign(backLink.style, {
    display: "inline-block",
    marginTop: "16px",
    color: theme.accent,
    fontSize: "13px",
    fontWeight: "800",
    textDecoration: "none",
  });
  wrap.appendChild(backLink);

  container.appendChild(wrap);
}

/** "Choose a new password" — consumes the token from the emailed link. */
function mountResetPassword(container, { siteId, paths, editorMode }) {
  prepareMountShell(container);
  const theme = readPortalTheme(container);

  const token =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("token") || ""
      : "";

  const wrap = el("div", {
    padding: "28px",
    fontFamily: "inherit",
    color: theme.ink,
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  });

  portalHeading(wrap, theme, {
    eyebrow: t("publicWidgets.portal.area"),
    title: t("publicWidgets.portal.newPasswordTitle"),
    subtitle: t("publicWidgets.portal.newPasswordSubtitle"),
  });

  const password = document.createElement("input");
  password.type = "password";
  password.required = true;
  password.placeholder = t("publicWidgets.portal.newPassword");
  password.autocomplete = "new-password";
  styleInput(password, theme);

  const confirm = document.createElement("input");
  confirm.type = "password";
  confirm.required = true;
  confirm.placeholder = t("publicWidgets.portal.confirmPassword");
  confirm.autocomplete = "new-password";
  styleInput(confirm, theme);

  const errorBox = portalNoticeBox(theme, "error");
  const successBox = portalNoticeBox(theme, "success");
  const submit = portalPrimaryButton(theme, t("publicWidgets.portal.savePassword"));

  if (!token && !editorMode) {
    errorBox.textContent = t("publicWidgets.portal.missingToken");
    errorBox.style.display = "block";
  }

  submit.addEventListener("click", async () => {
    errorBox.style.display = "none";
    successBox.style.display = "none";

    if (editorMode) {
      successBox.textContent = t("publicWidgets.portal.editorNoReset");
      successBox.style.display = "block";
      return;
    }

    if (password.value.length < 6) {
      errorBox.textContent = t("publicWidgets.portal.passwordMinError");
      errorBox.style.display = "block";
      return;
    }

    if (password.value !== confirm.value) {
      errorBox.textContent = t("publicWidgets.portal.passwordsMismatch");
      errorBox.style.display = "block";
      return;
    }

    submit.disabled = true;
    submit.textContent = t("publicWidgets.portal.saving");

    try {
      await sitePortalResetPassword({ token, password: password.value });
      navigateToSitePath(paths?.account || "/portal/account");
    } catch (err) {
      errorBox.textContent = err?.message || t("publicWidgets.portal.resetFailed");
      errorBox.style.display = "block";
    } finally {
      submit.disabled = false;
      submit.textContent = t("publicWidgets.portal.savePassword");
    }
  });

  wrap.appendChild(password);
  wrap.appendChild(confirm);
  wrap.appendChild(errorBox);
  wrap.appendChild(successBox);
  wrap.appendChild(submit);

  const backLink = document.createElement("a");
  backLink.href = paths?.login || "/portal/login";
  backLink.textContent = t("publicWidgets.portal.backToLogin");
  Object.assign(backLink.style, {
    display: "inline-block",
    marginTop: "16px",
    color: theme.accent,
    fontSize: "13px",
    fontWeight: "800",
    textDecoration: "none",
  });
  wrap.appendChild(backLink);

  container.appendChild(wrap);
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function nowTrackingDateParts(date = new Date()) {
  return {
    date: `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`,
    time: `${pad2(date.getHours())}:${pad2(date.getMinutes())}`,
  };
}

function normalizeTrackingEntries(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const raw = value;
    if (Array.isArray(raw.entries)) {
      return raw.entries
        .filter((entry) => entry && typeof entry === "object")
        .map((entry, index) => ({
          id: String(entry.id || `track_${index}`),
          date: String(entry.date || ""),
          time: String(entry.time || ""),
          value: String(entry.value ?? ""),
        }))
        .sort((a, b) =>
          `${a.date}T${a.time || "00:00"}`.localeCompare(
            `${b.date}T${b.time || "00:00"}`,
          ),
        );
    }

    if (Array.isArray(raw.rows)) {
      const columns = Array.isArray(raw.columns)
        ? raw.columns.map((column) => String(column || "").toLowerCase())
        : [];
      const dateIndex = Math.max(
        0,
        columns.findIndex((column) => /תאריך|date/.test(column)),
      );
      const timeIndex = columns.findIndex((column) => /שעה|time/.test(column));
      const valueIndex = columns.findIndex((column) =>
        /ערך|value|משקל|weight|מדד/.test(column),
      );
      const resolvedValueIndex =
        valueIndex >= 0
          ? valueIndex
          : Math.max(
              0,
              ...[0, 1, 2].filter(
                (index) => index !== dateIndex && index !== timeIndex,
              ),
            );
      return raw.rows
        .filter((row) => Array.isArray(row))
        .map((row, index) => ({
          id: `track_${index}`,
          date: String(row[dateIndex] ?? ""),
          time:
            timeIndex >= 0
              ? String(row[timeIndex] ?? "")
              : nowTrackingDateParts().time,
          value: String(row[resolvedValueIndex] ?? ""),
        }))
        .filter(
          (entry) => entry.date.trim() || entry.time.trim() || entry.value.trim(),
        );
    }
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const now = nowTrackingDateParts();
    return [{ id: "track_0", date: now.date, time: now.time, value: String(value) }];
  }
  if (typeof value === "string" && value.trim()) {
    const now = nowTrackingDateParts();
    return [
      { id: "track_0", date: now.date, time: now.time, value: value.trim() },
    ];
  }
  return [];
}

function latestTrackingDisplay(value) {
  const entries = normalizeTrackingEntries(value);
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const item = String(entries[index]?.value || "").trim();
    if (item) return item;
  }
  return "";
}

function flattenCustomDataValue(field) {
  const type = String(field?.type || "text");
  const value = field?.value;
  if (type === "tracking") return latestTrackingDisplay(value) || "";
  if (type === "table") {
    if (!value || typeof value !== "object") return "";
    const rows = Array.isArray(value.rows) ? value.rows : [];
    return rows
      .map((row) =>
        Array.isArray(row)
          ? row.map((cell) => String(cell || "").trim()).filter(Boolean).join(" · ")
          : "",
      )
      .filter(Boolean)
      .join(" | ");
  }
  if (type === "checklist") {
    return Array.isArray(value) ? value.join(" · ") : "";
  }
  if (type === "checkbox" || type === "boolean") {
    return value ? t("publicWidgets.common.yes") : t("publicWidgets.common.no");
  }
  if (value == null) return "";
  return String(value);
}

function formatCustomDataDisplay(field) {
  const type = String(field?.type || "text");
  const value = field?.value;

  if (type === "checkbox" || type === "boolean") {
    return value ? t("publicWidgets.common.yes") : t("publicWidgets.common.no");
  }
  if (type === "checklist") {
    return Array.isArray(value) && value.length ? value.join(" · ") : "—";
  }
  if (type === "tracking") {
    return latestTrackingDisplay(value) || "—";
  }
  if (type === "table") {
    if (!value || typeof value !== "object") return "—";
    const rows = Array.isArray(value.rows) ? value.rows : [];
    const filled = rows
      .map((row) =>
        Array.isArray(row)
          ? row.map((cell) => String(cell || "").trim()).filter(Boolean).join(" · ")
          : "",
      )
      .filter(Boolean);
    return filled.length ? filled.join(" | ") : "—";
  }
  if (value == null || value === "") return "—";
  return String(value);
}

function renderTrackingHistoryTable(theme, field) {
  const entries = normalizeTrackingEntries(field?.value).filter(
    (entry) => entry.date.trim() || entry.time.trim() || entry.value.trim(),
  );
  const wrap = el("div", {
    marginTop: "10px",
    overflowX: "auto",
    borderRadius: "14px",
    border: `1px solid ${theme.line}`,
    background: theme.card || "#fff",
  });
  const table = document.createElement("table");
  Object.assign(table.style, {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  });

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  [t("publicWidgets.common.date"), t("publicWidgets.common.time"), field?.label || t("publicWidgets.common.value")].forEach((label) => {
    const th = document.createElement("th");
    th.textContent = label;
    Object.assign(th.style, {
      textAlign: "start",
      padding: "10px 12px",
      borderBottom: `1px solid ${theme.line}`,
      color: theme.muted,
      fontWeight: "800",
      background: theme.soft || "#f8fafc",
      whiteSpace: "nowrap",
    });
    headRow.appendChild(th);
  });
  head.appendChild(headRow);
  table.appendChild(head);

  const body = document.createElement("tbody");
  if (!entries.length) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 3;
    emptyCell.textContent = t("publicWidgets.portal.noMeasurements");
    Object.assign(emptyCell.style, {
      padding: "14px 12px",
      color: theme.muted,
      fontWeight: "700",
    });
    emptyRow.appendChild(emptyCell);
    body.appendChild(emptyRow);
  } else {
    entries.forEach((entry) => {
      const row = document.createElement("tr");
      [entry.date || "—", entry.time || "—", entry.value || "—"].forEach(
        (cellValue) => {
          const td = document.createElement("td");
          td.textContent = cellValue;
          Object.assign(td.style, {
            padding: "10px 12px",
            borderBottom: `1px solid ${theme.line}`,
            color: theme.ink,
            fontWeight: "800",
            whiteSpace: "nowrap",
          });
          row.appendChild(td);
        },
      );
      body.appendChild(row);
    });
  }
  table.appendChild(body);
  wrap.appendChild(table);
  return wrap;
}

function renderPlainTableHistory(theme, field) {
  const value = field?.value;
  if (!value || typeof value !== "object") return null;
  const columns = Array.isArray(value.columns) ? value.columns.map(String) : [];
  const rows = Array.isArray(value.rows) ? value.rows : [];
  if (!columns.length) return null;

  const wrap = el("div", {
    marginTop: "10px",
    overflowX: "auto",
    borderRadius: "14px",
    border: `1px solid ${theme.line}`,
    background: theme.card || "#fff",
  });
  const table = document.createElement("table");
  Object.assign(table.style, {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  });

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  columns.forEach((label) => {
    const th = document.createElement("th");
    th.textContent = label;
    Object.assign(th.style, {
      textAlign: "start",
      padding: "10px 12px",
      borderBottom: `1px solid ${theme.line}`,
      color: theme.muted,
      fontWeight: "800",
      background: theme.soft || "#f8fafc",
      whiteSpace: "nowrap",
    });
    headRow.appendChild(th);
  });
  head.appendChild(headRow);
  table.appendChild(head);

  const body = document.createElement("tbody");
  const visibleRows = rows.filter(
    (row) =>
      Array.isArray(row) &&
      row.some((cell) => String(cell || "").trim()),
  );
  if (!visibleRows.length) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = columns.length;
    emptyCell.textContent = t("publicWidgets.portal.noTableData");
    Object.assign(emptyCell.style, {
      padding: "14px 12px",
      color: theme.muted,
      fontWeight: "700",
    });
    emptyRow.appendChild(emptyCell);
    body.appendChild(emptyRow);
  } else {
    visibleRows.forEach((row) => {
      const tr = document.createElement("tr");
      columns.forEach((_, index) => {
        const td = document.createElement("td");
        td.textContent = String(row[index] ?? "—") || "—";
        Object.assign(td.style, {
          padding: "10px 12px",
          borderBottom: `1px solid ${theme.line}`,
          color: theme.ink,
          fontWeight: "800",
          whiteSpace: "nowrap",
        });
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }
  table.appendChild(body);
  wrap.appendChild(table);
  return wrap;
}

function renderCustomDataPanel(container, theme, fields, { editorMode = false } = {}) {
  prepareMountShell(container);
  const wrap = el("div", {
    padding: "22px",
    fontFamily: "inherit",
    color: theme.ink,
    boxSizing: "border-box",
    background: theme.soft,
    minHeight: "100%",
  });

  const title = el(
    "h3",
    {
      margin: "0 0 6px",
      fontSize: "22px",
      fontWeight: "900",
      color: theme.ink,
    },
    t("publicWidgets.portal.myData"),
  );
  stampPortalAuthControl(title, container, "title", editorMode);
  wrap.appendChild(title);

  const subtitle = el(
    "p",
    {
      margin: "0 0 18px",
      fontSize: "13px",
      fontWeight: "600",
      color: theme.muted,
      lineHeight: "1.6",
    },
    t("publicWidgets.portal.myDataSubtitle"),
  );
  stampPortalAuthControl(subtitle, container, "subtitle", editorMode);
  wrap.appendChild(subtitle);

  const list = Array.isArray(fields) && fields.length
    ? fields
    : editorMode
      ? [
          {
            key: "weight",
            label: t("publicWidgets.portal.weight"),
            type: "tracking",
            value: {
              entries: [
                { id: "w1", date: "2026-08-01", time: "09:00", value: "74" },
                { id: "w2", date: "2026-08-08", time: "09:15", value: "72" },
              ],
            },
          },
          {
            key: "treatments_left",
            label: t("publicWidgets.portal.treatments"),
            type: "number",
            value: 4,
          },
          { key: "balance", label: t("publicWidgets.portal.balance"), type: "number", value: 250 },
          {
            key: "sessions_done",
            label: t("publicWidgets.portal.sessionsDone"),
            type: "number",
            value: 8,
          },
        ]
      : [];

  if (!list.length) {
    wrap.appendChild(
      el(
        "div",
        {
          padding: "18px",
          borderRadius: "16px",
          border: `1px solid ${theme.line}`,
          background: theme.card || "#fff",
          fontWeight: "700",
          color: theme.muted,
          fontSize: "14px",
        },
        t("publicWidgets.portal.noCustomData"),
      ),
    );
    container.appendChild(wrap);
    return;
  }

  const simpleFields = list.filter(
    (field) =>
      String(field?.type || "") !== "tracking" &&
      String(field?.type || "") !== "table",
  );
  const historyFields = list.filter(
    (field) =>
      String(field?.type || "") === "tracking" ||
      String(field?.type || "") === "table",
  );

  if (simpleFields.length) {
    const grid = el("div", {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "10px",
    });

    simpleFields.forEach((field) => {
      const card = el("div", {
        padding: "14px 16px",
        borderRadius: "16px",
        border: `1px solid ${theme.line}`,
        background: theme.card || "#fff",
        boxShadow: "0 12px 28px -24px rgba(15,23,42,0.45)",
        minHeight: "92px",
      });
      card.appendChild(
        el(
          "div",
          {
            fontSize: "11px",
            fontWeight: "800",
            color: theme.muted,
            letterSpacing: "0.04em",
            marginBottom: "8px",
          },
          field.label || field.key || t("publicWidgets.portal.dataItem"),
        ),
      );
      card.appendChild(
        el(
          "div",
          {
            fontSize: "22px",
            fontWeight: "900",
            color: theme.ink,
            lineHeight: "1.2",
            wordBreak: "break-word",
          },
          formatCustomDataDisplay(field),
        ),
      );
      grid.appendChild(card);
    });

    wrap.appendChild(grid);
  }

  historyFields.forEach((field) => {
    const card = el("div", {
      marginTop: simpleFields.length || historyFields.indexOf(field) ? "14px" : "0",
      padding: "14px 16px",
      borderRadius: "16px",
      border: `1px solid ${theme.line}`,
      background: theme.card || "#fff",
      boxShadow: "0 12px 28px -24px rgba(15,23,42,0.45)",
    });
    card.appendChild(
      el(
        "div",
        {
          fontSize: "11px",
          fontWeight: "800",
          color: theme.muted,
          letterSpacing: "0.04em",
          marginBottom: "4px",
        },
        field.label || field.key || t("publicWidgets.portal.dataItem"),
      ),
    );

    if (String(field?.type || "") === "tracking") {
      const latest = latestTrackingDisplay(field?.value);
      card.appendChild(
        el(
          "div",
          {
            fontSize: "22px",
            fontWeight: "900",
            color: theme.ink,
            lineHeight: "1.2",
            marginBottom: "2px",
          },
          latest || "—",
        ),
      );
      card.appendChild(
        el(
          "div",
          {
            fontSize: "12px",
            fontWeight: "700",
            color: theme.muted,
          },
          t("publicWidgets.portal.trackingHistory"),
        ),
      );
      card.appendChild(renderTrackingHistoryTable(theme, field));
    } else {
      const tableNode = renderPlainTableHistory(theme, field);
      if (tableNode) card.appendChild(tableNode);
      else {
        card.appendChild(
          el(
            "div",
            {
              fontSize: "16px",
              fontWeight: "900",
              color: theme.ink,
              marginTop: "8px",
            },
            formatCustomDataDisplay(field),
          ),
        );
      }
    }

    wrap.appendChild(card);
  });

  container.appendChild(wrap);
}

function appendCustomDataSummary(wrap, theme, fields) {
  const list = Array.isArray(fields) ? fields.filter(Boolean) : [];
  if (!list.length) return;

  wrap.appendChild(
    el(
      "div",
      {
        fontSize: "12px",
        fontWeight: "800",
        color: theme.muted,
        letterSpacing: "0.04em",
        margin: "4px 0 8px",
      },
      t("publicWidgets.portal.fileData"),
    ),
  );

  const row = el("div", {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "8px",
    marginBottom: "14px",
  });

  list.slice(0, 4).forEach((field) => {
    const card = el("div", {
      padding: "12px",
      borderRadius: "14px",
      border: `1px solid ${theme.line}`,
      background: theme.card || "#fff",
    });
    card.appendChild(
      el(
        "div",
        {
          fontSize: "11px",
          fontWeight: "800",
          color: theme.muted,
          marginBottom: "4px",
        },
        field.label || field.key,
      ),
    );
    card.appendChild(
      el(
        "div",
        { fontSize: "16px", fontWeight: "900", color: theme.ink },
        formatCustomDataDisplay(field),
      ),
    );
    row.appendChild(card);
  });

  wrap.appendChild(row);
}

function renderAccountPanel(
  container,
  theme,
  member,
  pages,
  { onLogout, paths, editorMode = false, customData = [] } = {},
) {
  prepareMountShell(container);
  const wrap = el("div", {
    padding: "22px",
    fontFamily: "inherit",
    color: theme.ink,
    boxSizing: "border-box",
    background: theme.soft,
    minHeight: "100%",
  });
  wrap.setAttribute("data-bizuply-portal-auth", "account");

  const header = el("div", {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "18px",
  });
  const avatar = el("div", {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    background: theme.ink,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "16px",
    flex: "0 0 auto",
  }, String(member?.fullName || t("publicWidgets.portal.previewInitial")).trim().charAt(0) || t("publicWidgets.portal.previewInitial"));
  const identity = el("div", { flex: "1 1 auto", minWidth: "0" });
  const greeting = el(
    "h3",
    { margin: "0 0 4px", fontSize: "20px", fontWeight: "900", color: theme.ink },
    t("publicWidgets.portal.helloName", {
      name: member?.fullName || t("publicWidgets.portal.customer"),
    }),
  );
  stampPortalAuthControl(greeting, container, "title", editorMode);
  identity.appendChild(greeting);
  const emailLine = el(
    "p",
    {
      margin: "0",
      color: theme.muted,
      fontSize: "13px",
      fontWeight: "600",
    },
    member?.email || "client@example.com",
  );
  stampPortalAuthControl(emailLine, container, "subtitle", editorMode);
  identity.appendChild(emailLine);
  header.appendChild(avatar);
  header.appendChild(identity);
  wrap.appendChild(header);

  const statsValues = editorMode
    ? [
        [t("publicWidgets.portal.orders"), "3"],
        [t("publicWidgets.portal.courses"), "2"],
        [t("publicWidgets.portal.messages"), "0"],
      ]
    : [];
  if (statsValues.length) {
  const stats = el("div", {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "8px",
    marginBottom: "16px",
  });
  statsValues.forEach(([label, value]) => {
    const card = el("div", {
      padding: "12px 10px",
      borderRadius: "14px",
      border: `1px solid ${theme.line}`,
      background: theme.card || "#fff",
      textAlign: "center",
    });
    card.appendChild(
      el(
        "div",
        {
          fontSize: "11px",
          fontWeight: "800",
          color: theme.muted,
          marginBottom: "4px",
          letterSpacing: "0.04em",
        },
        label,
      ),
    );
    card.appendChild(
      el(
        "div",
        { fontSize: "20px", fontWeight: "900", color: theme.ink },
        value,
      ),
    );
    stats.appendChild(card);
  });
  wrap.appendChild(stats);
  }

  appendCustomDataSummary(
    wrap,
    theme,
    editorMode && (!customData || !customData.length)
      ? [
          { label: t("publicWidgets.portal.weight"), value: 72, type: "number" },
          { label: t("publicWidgets.portal.treatments"), value: 4, type: "number" },
          { label: t("publicWidgets.portal.balance"), value: 250, type: "number" },
          { label: t("publicWidgets.portal.sessions"), value: 8, type: "number" },
        ]
      : customData,
  );

  const quickLinks = editorMode
    ? [
        { href: paths?.orders || "/orders", label: t("publicWidgets.portal.myOrders") },
        { href: paths?.cart || "/cart", label: t("publicWidgets.portal.myCart") },
        { href: paths?.account || "/portal/account", label: t("publicWidgets.portal.accountDetails") },
      ]
    : [];
  const quickRow = el("div", {
    display: "grid",
    gap: "8px",
    marginBottom: "14px",
  });
  quickLinks.forEach((item) => {
    const link = document.createElement("a");
    bindEditorSafeLink(link, item.href, editorMode);
    link.textContent = item.label;
    Object.assign(link.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 14px",
      borderRadius: "14px",
      border: `1px solid ${theme.line}`,
      background: theme.card || "#fff",
      textDecoration: "none",
      color: theme.ink,
      fontWeight: "800",
      fontSize: "13px",
      boxShadow: "0 10px 24px -20px rgba(15,23,42,0.45)",
    });
    quickRow.appendChild(link);
  });
  wrap.appendChild(quickRow);

  const sectionTitle = el(
    "div",
    {
      fontSize: "12px",
      fontWeight: "800",
      color: theme.muted,
      letterSpacing: "0.04em",
      marginBottom: "8px",
    },
    t("publicWidgets.portal.quickAccess"),
  );
  const pageList = Array.isArray(pages) ? pages : [];
  const showPlaceholderPages = editorMode && !pageList.length;
  if (pageList.length || showPlaceholderPages || quickLinks.length) {
  wrap.appendChild(sectionTitle);
  }
  if (showPlaceholderPages) {
    [
      t("publicWidgets.portal.pastOrders"),
      t("publicWidgets.portal.protectedPage"),
      t("publicWidgets.portal.continuePurchase"),
    ].forEach((label) => {
      wrap.appendChild(
        el(
          "div",
          {
            marginBottom: "8px",
            padding: "12px 14px",
            borderRadius: "14px",
            border: `1px solid ${theme.line}`,
            background: theme.card || "#fff",
            fontWeight: "800",
            fontSize: "14px",
            color: theme.ink,
          },
          label,
        ),
      );
    });
  } else {
    pageList.forEach((page) => {
      const link = document.createElement("a");
      bindEditorSafeLink(
        link,
        page.path || `/${page.slug || page.id}`,
        editorMode,
      );
      link.textContent = page.title || t("publicWidgets.common.page");
      Object.assign(link.style, {
        display: "block",
        marginBottom: "8px",
        padding: "12px 14px",
        borderRadius: "14px",
        border: `1px solid ${theme.line}`,
        textDecoration: "none",
        color: theme.ink,
        fontWeight: "800",
        fontSize: "14px",
        background: theme.card || "#fff",
      });
      wrap.appendChild(link);
    });
  }

  if (typeof onLogout === "function") {
    const logout = el(
      "button",
      {
        marginTop: "14px",
        width: "100%",
        border: "0",
        borderRadius: "14px",
        background: theme.ink,
        color: "#fff",
        padding: "12px 14px",
        fontWeight: "800",
        cursor: "pointer",
      },
      t("publicWidgets.portal.logout"),
    );
    logout.type = "button";
    logout.setAttribute("data-bizuply-portal-logout", "");
    logout.addEventListener("click", onLogout);
    wrap.appendChild(logout);
  }

  container.appendChild(wrap);
}

function renderOrdersPanel(container, theme, orders) {
  prepareMountShell(container);
  const wrap = el("div", {
    padding: "18px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    background: theme.soft,
    minHeight: "100%",
  });
  wrap.appendChild(
    el(
      "div",
      {
        fontSize: "12px",
        fontWeight: "800",
        color: theme.muted,
        letterSpacing: "0.04em",
        marginBottom: "10px",
      },
      t("publicWidgets.portal.orderHistory"),
    ),
  );

  const list = Array.isArray(orders) && orders.length
    ? orders
    : [
        { orderNumber: "1042", status: t("publicWidgets.portal.paid"), total: 249 },
        { orderNumber: "1038", status: t("publicWidgets.portal.processing"), total: 128.5 },
        { orderNumber: "1021", status: t("publicWidgets.portal.shipped"), total: 89 },
      ];

  const table = el("div", {
    borderRadius: "16px",
    border: `1px solid ${theme.line}`,
    overflow: "hidden",
    background: theme.card || "#fff",
  });

  const head = el("div", {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 0.8fr",
    gap: "8px",
    padding: "12px 14px",
    background: theme.soft,
    borderBottom: `1px solid ${theme.line}`,
    fontSize: "11px",
    fontWeight: "800",
    color: theme.muted,
    letterSpacing: "0.04em",
  });
  [t("publicWidgets.portal.order"), t("publicWidgets.portal.status"), t("publicWidgets.portal.amount")].forEach((label) => {
    head.appendChild(el("div", {}, label));
  });
  table.appendChild(head);

  list.forEach((order, index) => {
    const row = el("div", {
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr 0.8fr",
      gap: "8px",
      padding: "14px",
      borderBottom:
        index === list.length - 1 ? "0" : `1px solid ${theme.line}`,
      alignItems: "center",
    });
    row.appendChild(
      el(
        "div",
        { fontWeight: "900", fontSize: "13px", color: theme.ink },
        `#${order.orderNumber || order.id || ""}`,
      ),
    );
    const status = el("div", {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "fit-content",
      padding: "4px 10px",
      borderRadius: "999px",
      background: theme.soft,
      border: `1px solid ${theme.line}`,
      fontSize: "11px",
      fontWeight: "800",
      color: theme.accent,
    }, order.status || "status");
    row.appendChild(status);
    row.appendChild(
      el(
        "div",
        { fontWeight: "800", fontSize: "13px", color: theme.ink },
        `₪${Number(order.total || 0).toFixed(2)}`,
      ),
    );
    table.appendChild(row);

    if (order.morningDocumentUrl) {
      const invoice = document.createElement("a");
      invoice.href = order.morningDocumentUrl;
      invoice.target = "_blank";
      invoice.rel = "noopener noreferrer";
      invoice.textContent = t("publicWidgets.portal.invoice");
      Object.assign(invoice.style, {
        display: "inline-block",
        margin: "0 14px 12px",
        fontSize: "12px",
        fontWeight: "800",
        color: theme.accent,
        textDecoration: "none",
      });
      table.appendChild(invoice);
    }
  });

  wrap.appendChild(table);
  container.appendChild(wrap);
}

async function mountCustomData(container, { siteId, editorMode = false }) {
  const theme = readPortalTheme(container);

  if (editorMode) {
    renderCustomDataPanel(container, theme, [], { editorMode: true });
    return;
  }

  prepareMountShell(container);
  container.appendChild(
    el(
      "div",
      { padding: "24px", fontWeight: "700", color: theme.muted },
      t("publicWidgets.portal.loadingData"),
    ),
  );

  const refresh = async () => {
    try {
      const data = await sitePortalMe(siteId);
      renderCustomDataPanel(container, theme, data.customData || [], {
        editorMode: false,
      });
    } catch {
      prepareMountShell(container);
      const wrap = el("div", { padding: "24px", textAlign: "center" });
      wrap.appendChild(
        el(
          "p",
          {
            fontWeight: "700",
            color: theme.muted,
            marginBottom: "12px",
            fontSize: "14px",
          },
          t("publicWidgets.portal.loginToSeeData"),
        ),
      );
      container.appendChild(wrap);
    }
  };

  await refresh();

  // Soft real-time: refresh when the tab becomes visible again.
  if (typeof document !== "undefined" && !container.__bizuplyCustomDataBound) {
    container.__bizuplyCustomDataBound = true;
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 20000);
    container.__bizuplyCustomDataCleanup = () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(intervalId);
    };
  }
}

function hideLibraryAccountShowcase(container) {
  if (!container || typeof document === "undefined") return;
  const root =
    container.closest("[data-visual-insert-host], [data-visual-runtime-host], [data-bizuply-public-render-root]") ||
    container.parentElement;
  if (!root) return;
  const demoRe =
    /לוח בקרה ללקוח|סיכום פעילות|הזמנות פעילות|יתרת נקודות|קורסים פתוחים|מועדון לקוחות|בלימודים|\+1 השבוע|#1042|#1038|#1021|#1014|#1008|12\.03\.2026|04\.03\.2026|18\.02\.2026|02\.02\.2026|15\.01\.2026|₪249|₪128|₪89|₪310|₪175|1,250|מספר הזמנה|המותג שלי|hello@example\.com|ניווט ראשי|יסודות השיווק הדיגיטלי|ניהול לקוחות בפורטל|לקוח\/ה לדוגמה|client@example\.com|דשבורד לקוח|סקירת פעילות/;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  const hide = [];
  const skip = (node) =>
    node === container ||
    container.contains(node) ||
    node.contains(container) ||
    node.getAttribute("data-bizuply-portal-kind") === "portal-account";
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!(node instanceof HTMLElement)) continue;
    if (skip(node)) continue;
    const text = String(node.textContent || "").replace(/\s+/g, " ").trim();
    if (text && demoRe.test(text) && text.length < 900) {
      hide.push(node);
    }
  }
  hide.forEach((node) => {
    node.setAttribute("data-portal-showcase-hidden", "true");
    node.style.display = "none";
  });
  const leftover = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  while (leftover.nextNode()) {
    const node = leftover.currentNode;
    if (!(node instanceof HTMLElement)) continue;
    if (skip(node) || node.getAttribute("data-portal-showcase-hidden") === "true") continue;
    const text = String(node.innerText || "")
      .replace(/\s+/g, " ")
      .trim();
    if (text && text.length < 40 && /^[\d₪+,.\s]+$/.test(text)) {
      node.setAttribute("data-portal-showcase-hidden", "true");
      node.style.display = "none";
    }
  }
}

async function mountAccount(container, { siteId, editorMode = false, paths }) {
  const theme = readPortalTheme(container);

  // Studio edit/preview: always show open design sample — never ask to login.
  if (editorMode) {
    renderAccountPanel(
      container,
      theme,
      { fullName: t("publicWidgets.portal.sampleCustomer"), email: "client@example.com" },
      [],
      { paths, editorMode: true },
    );
    return;
  }

  prepareMountShell(container);
  const loading = el(
    "div",
    { padding: "24px", fontWeight: "700", color: theme.muted },
    t("publicWidgets.portal.loadingAccount"),
  );
  container.appendChild(loading);

  try {
    const data = await sitePortalMe(siteId);
    const pages = Array.isArray(data.portalPages)
      ? data.portalPages.filter((page) => page.loginRequired !== false)
      : [];
    renderAccountPanel(container, theme, data.member, pages, {
      paths,
      customData: data.customData || [],
      onLogout: async () => {
        await sitePortalLogout(siteId);
        navigateToSitePath(paths?.login || "/portal/login");
      },
    });
  } catch (err) {
    prepareMountShell(container);
    const wrap = el("div", { padding: "24px", textAlign: "center" });
    wrap.appendChild(
      el(
        "p",
        {
          fontWeight: "700",
          color: theme.muted,
          marginBottom: "12px",
          fontSize: "14px",
        },
        t("publicWidgets.portal.loginToSeeAccount"),
      ),
    );
    const login = document.createElement("a");
    login.href = paths?.login || "/portal/login";
    login.textContent = t("publicWidgets.portal.goToLogin");
    Object.assign(login.style, {
      display: "inline-flex",
      background: theme.ink,
      color: "#fff",
      borderRadius: "12px",
      padding: "10px 14px",
      textDecoration: "none",
      fontWeight: "800",
    });
    wrap.appendChild(login);
    container.appendChild(wrap);
  }
}

function readPackagesConfig(container) {
  const paymentUrl = String(
    container?.getAttribute?.("data-bizuply-portal-payment-url") || "",
  ).trim();

  let packages = null;
  try {
    const raw = container?.getAttribute?.("data-bizuply-portal-packages") || "";
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length) packages = parsed;
  } catch {
    packages = null;
  }

  if (!packages) {
    packages = [
      {
        name: t("publicWidgets.portal.pkgBasic"),
        price: "₪290",
        period: t("publicWidgets.portal.perMonth"),
        features: [t("publicWidgets.portal.pkgBasicF1"), t("publicWidgets.portal.pkgBasicF2")],
        featured: false,
      },
      {
        name: t("publicWidgets.portal.pkgBusiness"),
        price: "₪590",
        period: t("publicWidgets.portal.perMonth"),
        features: [
          t("publicWidgets.portal.pkgBusinessF1"),
          t("publicWidgets.portal.pkgBusinessF2"),
          t("publicWidgets.portal.pkgBusinessF3"),
        ],
        featured: true,
      },
      {
        name: t("publicWidgets.portal.pkgPremium"),
        price: "₪990",
        period: t("publicWidgets.portal.perMonth"),
        features: [t("publicWidgets.portal.pkgPremiumF1"), t("publicWidgets.portal.pkgPremiumF2")],
        featured: false,
      },
    ];
  }

  return { paymentUrl, packages };
}

function renderPackagesPanel(container, theme, { editorMode = false } = {}) {
  prepareMountShell(container);
  const { paymentUrl, packages } = readPackagesConfig(container);
  const title =
    container.getAttribute("data-portal-copy-title") || t("publicWidgets.portal.choosePackage");
  const subtitle =
    container.getAttribute("data-portal-copy-subtitle") ||
    t("publicWidgets.portal.packagesSubtitle");
  const ctaLabel =
    container.getAttribute("data-portal-copy-submit") || t("publicWidgets.portal.payCheckout");

  const wrap = el("div", {
    padding: "22px",
    fontFamily: "inherit",
    color: theme.ink,
    boxSizing: "border-box",
    background: theme.soft,
    minHeight: "100%",
  });

  const heading = el(
    "h3",
    { margin: "0 0 6px", fontSize: "22px", fontWeight: "900", color: theme.ink },
    title,
  );
  stampPortalAuthControl(heading, container, "title", editorMode);
  wrap.appendChild(heading);

  const sub = el(
    "p",
    {
      margin: "0 0 16px",
      fontSize: "13px",
      fontWeight: "600",
      color: theme.muted,
      lineHeight: "1.6",
    },
    subtitle,
  );
  stampPortalAuthControl(sub, container, "subtitle", editorMode);
  wrap.appendChild(sub);

  if (!paymentUrl && editorMode) {
    wrap.appendChild(
      el(
        "div",
        {
          marginBottom: "14px",
          padding: "12px 14px",
          borderRadius: "14px",
          border: `1px dashed ${theme.line}`,
          background: "#fff",
          fontSize: "12px",
          fontWeight: "700",
          color: theme.muted,
        },
        t("publicWidgets.portal.editorPaymentHint"),
      ),
    );
  }

  packages.forEach((pkg) => {
    const featured = Boolean(pkg.featured);
    const card = el("div", {
      marginBottom: "10px",
      padding: "16px",
      borderRadius: "16px",
      border: featured ? "0" : `1px solid ${theme.line}`,
      background: featured ? theme.ink : theme.card || "#fff",
      color: featured ? "#f8fafc" : theme.ink,
      boxShadow: "0 12px 28px -22px rgba(15,23,42,0.45)",
    });

    card.appendChild(
      el(
        "div",
        {
          fontSize: "12px",
          fontWeight: "800",
          color: featured ? "rgba(248,250,252,0.7)" : theme.muted,
          marginBottom: "6px",
        },
        featured ? t("publicWidgets.portal.mostPopular") : t("publicWidgets.portal.package"),
      ),
    );
    card.appendChild(
      el(
        "div",
        { fontSize: "18px", fontWeight: "900", marginBottom: "4px" },
        pkg.name || t("publicWidgets.portal.package"),
      ),
    );
    card.appendChild(
      el(
        "div",
        { fontSize: "28px", fontWeight: "900", marginBottom: "4px" },
        pkg.price || "",
      ),
    );
    card.appendChild(
      el(
        "div",
        {
          fontSize: "12px",
          fontWeight: "600",
          color: featured ? "rgba(248,250,252,0.7)" : theme.muted,
          marginBottom: "10px",
        },
        pkg.period || "",
      ),
    );

    (Array.isArray(pkg.features) ? pkg.features : []).forEach((feature) => {
      card.appendChild(
        el(
          "div",
          {
            fontSize: "13px",
            fontWeight: "600",
            color: featured ? "rgba(248,250,252,0.8)" : theme.muted,
            marginBottom: "4px",
          },
          `✓  ${feature}`,
        ),
      );
    });

    const href = String(pkg.paymentUrl || paymentUrl || "#").trim() || "#";
    const cta = document.createElement("a");
    cta.href = href;
    if (href.startsWith("http")) {
      cta.target = "_blank";
      cta.rel = "noopener noreferrer";
    }
    cta.textContent = ctaLabel;
    if (editorMode && href === "#") {
      cta.addEventListener("click", (event) => event.preventDefault());
    }
    Object.assign(cta.style, {
      display: "flex",
      marginTop: "12px",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 14px",
      borderRadius: "12px",
      textDecoration: "none",
      fontWeight: "800",
      fontSize: "13px",
      background: featured ? "#fff" : theme.accent,
      color: featured ? theme.ink : "#fff",
    });
    stampPortalAuthControl(cta, container, "submit", editorMode);
    card.appendChild(cta);
    wrap.appendChild(card);
  });

  container.appendChild(wrap);
}

function mountPackages(container, { editorMode = false } = {}) {
  const theme = readPortalTheme(container);
  renderPackagesPanel(container, theme, { editorMode });
}

async function mountOrders(container, { siteId, editorMode = false, paths }) {
  const theme = readPortalTheme(container);

  if (editorMode) {
    renderOrdersPanel(container, theme, null);
    return;
  }

  prepareMountShell(container);
  container.appendChild(
    el(
      "div",
      { padding: "24px", fontWeight: "700", color: theme.muted },
      t("publicWidgets.portal.loadingOrders"),
    ),
  );

  try {
    const data = await sitePortalMyOrders(siteId);
    const orders = Array.isArray(data.orders) ? data.orders : [];
    if (!orders.length) {
      prepareMountShell(container);
      const wrap = el("div", { padding: "20px", fontFamily: "inherit" });
      wrap.appendChild(
        el(
          "div",
          {
            padding: "18px",
            borderRadius: "16px",
            background: theme.soft,
            border: `1px solid ${theme.line}`,
            fontWeight: "700",
            color: theme.muted,
          },
          t("publicWidgets.portal.noOrders"),
        ),
      );
      container.appendChild(wrap);
      return;
    }
    renderOrdersPanel(container, theme, orders);
  } catch (err) {
    prepareMountShell(container);
    const wrap = el("div", { padding: "24px", textAlign: "center" });
    wrap.appendChild(
      el(
        "p",
        {
          fontWeight: "700",
          color: theme.muted,
          marginBottom: "12px",
          fontSize: "14px",
        },
        t("publicWidgets.portal.loginToSeeOrders"),
      ),
    );
    const login = document.createElement("a");
    login.href = paths?.login || "/portal/login";
    login.textContent = t("publicWidgets.portal.goToLogin");
    Object.assign(login.style, {
      display: "inline-flex",
      background: theme.ink,
      color: "#fff",
      borderRadius: "12px",
      padding: "10px 14px",
      textDecoration: "none",
      fontWeight: "800",
    });
    wrap.appendChild(login);
    container.appendChild(wrap);
  }
}

function mountCart(container, { businessId }) {
  prepareMountShell(container);
  // The cart must follow the same design tokens as the other portal widgets.
  const theme = readPortalTheme(container);
  const wrap = el("div", {
    padding: "20px",
    fontFamily: "inherit",
    color: theme.ink,
    boxSizing: "border-box",
  });
  const items = readCart(businessId);

  if (!items.length) {
    wrap.appendChild(
      el(
        "div",
        {
          padding: "18px",
          borderRadius: "16px",
          background: theme.soft,
          border: `1px solid ${theme.line}`,
          fontWeight: "700",
          color: theme.muted,
        },
        t("publicWidgets.portal.cartEmpty"),
      ),
    );
    container.appendChild(wrap);
    return;
  }

  let total = 0;
  items.forEach((item) => {
    const qty = Number(item.quantity || 1);
    const price = Number(item.price || 0);
    total += qty * price;
    const row = el("div", {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      marginBottom: "10px",
      paddingBottom: "10px",
      borderBottom: `1px solid ${theme.line}`,
      fontWeight: "700",
      fontSize: "13px",
    });
    row.appendChild(el("span", {}, `${item.name || t("publicWidgets.portal.product")} × ${qty}`));
    row.appendChild(el("span", {}, `₪${(qty * price).toFixed(2)}`));
    wrap.appendChild(row);
  });

  wrap.appendChild(
    el(
      "div",
      {
        margin: "14px 0",
        fontWeight: "900",
        fontSize: "16px",
      },
      t("publicWidgets.portal.total", { amount: `₪${total.toFixed(2)}` }),
    ),
  );

  const checkout = el(
    "button",
    {
      border: "0",
      borderRadius: "14px",
      background: theme.accent,
      color: "#fff",
      padding: "12px 16px",
      fontWeight: "800",
      cursor: "pointer",
    },
    t("publicWidgets.portal.continueToPay"),
  );
  checkout.type = "button";
  checkout.addEventListener("click", () => {
    window.dispatchEvent(
      new CustomEvent("bizuply:open-checkout", {
        detail: { businessId },
      }),
    );
  });
  wrap.appendChild(checkout);
  container.appendChild(wrap);
}

/**
 * Mount interactive personal-area widgets inside published site HTML.
 * Only runs when the client-portal plugin is enabled.
 */
export function pageHasPortalWidget(root) {
  if (!root || typeof root.querySelector !== "function") return false;
  return Boolean(
    root.querySelector(
      '[data-bizuply-portal-mount="true"], [data-bizuply-widget^="portal-"]',
    ),
  );
}

function sampleCrmFields() {
  return [
    {
      key: "client_name",
      label: t("publicWidgets.portal.clientName"),
      type: "text",
      value: t("publicWidgets.portal.sampleClientName"),
    },
    {
      key: "fullName",
      label: t("publicWidgets.portal.clientName"),
      type: "text",
      value: t("publicWidgets.portal.sampleClientName"),
    },
    {
      key: "weight",
      label: t("publicWidgets.portal.weight"),
      type: "tracking",
      value: {
        entries: [
          {
            id: "sample_1",
            date: t("publicWidgets.portal.sampleDate"),
            time: t("publicWidgets.portal.sampleTime"),
            value: t("publicWidgets.portal.sampleWeight"),
          },
        ],
      },
    },
    {
      key: "treatments_left",
      label: t("publicWidgets.portal.treatments"),
      type: "number",
      value: t("publicWidgets.portal.sampleQty"),
    },
    {
      key: "balance",
      label: t("publicWidgets.portal.balance"),
      type: "number",
      value: t("publicWidgets.portal.sampleBalance"),
    },
    {
      key: "sessions_done",
      label: t("publicWidgets.portal.sessionsDone"),
      type: "number",
      value: t("publicWidgets.portal.sampleSessions"),
    },
    {
      key: "summary",
      label: t("publicWidgets.portal.summary"),
      type: "summary",
      value: t("publicWidgets.portal.sampleSummary"),
    },
    {
      key: "treatment_plan",
      label: t("publicWidgets.portal.treatmentPlan"),
      type: "textarea",
      value: t("publicWidgets.portal.samplePlan"),
    },
    {
      key: "continuation_plan",
      label: t("publicWidgets.portal.continuationPlan"),
      type: "textarea",
      value: t("publicWidgets.portal.sampleFollowOn"),
    },
    {
      key: "follow_up_plan",
      label: t("publicWidgets.portal.followUpPlan"),
      type: "table",
      value: {
        columns: [
          t("publicWidgets.common.date"),
          t("publicWidgets.portal.action"),
          t("publicWidgets.portal.status"),
        ],
        rows: [[
          t("publicWidgets.portal.sampleDate"),
          t("publicWidgets.portal.sampleAction"),
          t("publicWidgets.portal.sampleStatus"),
        ]],
      },
    },
  ];
}

function mergeMemberIntoCustomData(customData, member) {
  const list = Array.isArray(customData) ? [...customData] : [];
  const fullName = String(member?.fullName || "").trim();
  const email = String(member?.email || "").trim();
  const phone = String(member?.phone || "").trim();

  const upsert = (key, label, value, { force = false } = {}) => {
    if (!key || !value) return;
    const index = list.findIndex(
      (field) => String(field?.key || "").trim() === key,
    );
    if (index >= 0) {
      const current = list[index];
      const currentValue = current?.value;
      if (
        force ||
        currentValue == null ||
        currentValue === ""
      ) {
        list[index] = { ...current, key, label, value };
      }
      return;
    }
    list.push({ key, label, type: "text", value });
  };

  // Logged-in portal member identity wins for greeting / name widgets.
  upsert("client_name", t("publicWidgets.portal.clientName"), fullName, { force: true });
  upsert("fullName", t("publicWidgets.portal.clientName"), fullName, { force: true });
  upsert("client_email", t("publicWidgets.portal.clientEmail"), email);
  upsert("client_phone", t("publicWidgets.portal.clientPhone"), phone);
  return list;
}

function syncPortalDataToWindow(customData) {
  if (typeof window === "undefined") return;
  const flat = {};
  (Array.isArray(customData) ? customData : []).forEach((field) => {
    const key = String(field?.key || "").trim();
    if (!key) return;
    // Flatten structured types so {{weight}} / bindings show the latest value.
    flat[key] = flattenCustomDataValue(field);
  });
  window.__BIZUPLY_CLIENT_PORTAL_DATA__ = flat;
}

function buildCustomDataMap(fields) {
  const map = new Map();
  (Array.isArray(fields) ? fields : []).forEach((field) => {
    const key = String(field?.key || "").trim();
    if (key) map.set(key, field);
  });
  return map;
}

function resolveBoundFieldText(field, part, key, options = {}) {
  const format = String(options.format || "").trim().toLowerCase();
  const nodeLabel = String(options.nodeLabel || "").trim();

  if (format === "greeting") {
    if (!field) {
      return options.editorMode
        ? t("publicWidgets.portal.greetingSample")
        : t("publicWidgets.portal.greetingGuest");
    }
    const value = formatCustomDataDisplay(field);
    if (!value) return t("publicWidgets.portal.greetingGuest");
    return t("publicWidgets.portal.greetingNamed", { name: value });
  }

  const fallbackLabel = t("publicWidgets.portal.dataItem");
  const dash = t("publicWidgets.common.dash");
  if (!field) {
    if (part === "label") return nodeLabel || key || fallbackLabel;
    if (part === "both") {
      return t("publicWidgets.portal.labelValue", {
        label: nodeLabel || key || fallbackLabel,
        value: dash,
      });
    }
    return dash;
  }
  const label = nodeLabel || field.label || key || fallbackLabel;
  const value = formatCustomDataDisplay(field);
  if (part === "label") return label;
  if (part === "both") return t("publicWidgets.portal.labelValue", { label, value });
  return value;
}

/**
 * Fill any designer-placed node that is bound to a CRM custom field.
 * Supports:
 * - data-bizuply-crm-field="weight"
 * - data-bizuply-crm-field-part="value|label|both" (default: both = שם - ערך)
 * - data-bizuply-crm-field-format="greeting" → "שלום, {שם}"
 * - legacy data-client-variable-key
 */
export function applyPortalCrmFieldBindings(root, customData, options = {}) {
  if (!root || typeof root.querySelectorAll !== "function") return 0;

  const editorMode = Boolean(options.editorMode);
  const map = buildCustomDataMap(
    Array.isArray(customData) && customData.length
      ? customData
      : editorMode
        ? sampleCrmFields()
        : [],
  );

  const nodes = root.querySelectorAll(
    "[data-bizuply-crm-field], [data-client-variable-key]",
  );

  let count = 0;
  nodes.forEach((node) => {
    const key = String(
      node.getAttribute("data-bizuply-crm-field") ||
        node.getAttribute("data-client-variable-key") ||
        "",
    ).trim();
    if (!key) return;

    const part = String(
      node.getAttribute("data-bizuply-crm-field-part") || "both",
    )
      .trim()
      .toLowerCase();
    const format = String(
      node.getAttribute("data-bizuply-crm-field-format") ||
        node.getAttribute("data-client-variable-display") ||
        "",
    )
      .trim()
      .toLowerCase();
    const nodeLabel = String(
      node.getAttribute("data-bizuply-crm-field-label") ||
        node.getAttribute("data-client-variable-label") ||
        "",
    ).trim();

    const field = map.get(key);
    const nextText = resolveBoundFieldText(field, part, key, {
      format,
      nodeLabel,
      editorMode,
    });
    if (node.textContent !== nextText) {
      node.textContent = nextText;
    }
    node.setAttribute("data-bizuply-crm-field-bound", "1");
    count += 1;
  });

  return count;
}

async function refreshPortalCrmFieldBindings(root, { siteId, editorMode }) {
  if (!root) return;

  const hasBoundNodes = Boolean(
    root.querySelector(
      "[data-bizuply-crm-field], [data-client-variable-key]",
    ),
  );
  if (!hasBoundNodes) return;

  if (editorMode) {
    const sample = sampleCrmFields();
    syncPortalDataToWindow(sample);
    applyPortalCrmFieldBindings(root, sample, { editorMode: true });
    return;
  }

  if (!siteId) {
    syncPortalDataToWindow([]);
    applyPortalCrmFieldBindings(root, [], { editorMode: false });
    return;
  }

  try {
    const data = await sitePortalMe(siteId);
    const customData = mergeMemberIntoCustomData(
      data.customData || [],
      data.member,
    );
    syncPortalDataToWindow(customData);
    applyPortalCrmFieldBindings(root, customData, {
      editorMode: false,
    });
  } catch {
    syncPortalDataToWindow([]);
    applyPortalCrmFieldBindings(root, [], { editorMode: false });
  }
}

export function mountPublicPortalWidgets(root, options = {}) {
  if (!root || typeof document === "undefined") return;

  const site = options.site || {};
  const enabledPlugins = Array.isArray(site.enabledPlugins)
    ? site.enabledPlugins
    : [];
  const allowWithoutPlugin = Boolean(options.preview || options.editorMode);
  if (!allowWithoutPlugin && !enabledPlugins.includes("client-portal")) return;

  const siteId =
    resolveSiteId(site) ||
    findStoredPortalTokenHint()?.siteId ||
    "";
  const businessId = String(site.businessId || site.business?._id || "").trim();
  const host =
    options.host ||
    (typeof window !== "undefined" ? window.location.host : "");
  const siteName = String(site.name || site.brand?.name || "").trim();
  const editorMode = Boolean(options.preview || options.editorMode);

  // Ensure token for known site id is discoverable for subsequent API calls.
  if (siteId && !getSitePortalToken(siteId)) {
    /* no-op: login will set it */
  }

  const paths = resolvePortalPaths(site);

  const mounts = root.querySelectorAll(
    '[data-bizuply-portal-mount="true"], [data-bizuply-widget^="portal-"]',
  );

  mounts.forEach((node) => {
    /*
      A re-applied visual snapshot wipes the widget children while the
      "mounted" flag stays behind, which left an empty portal card.
      Also ignore "mounted" copies frozen into an old HTML snapshot — those
      look like forms but have no live submit handlers.
    */
    const alreadyMounted =
      node.dataset.bizuplyPortalMounted === "1" &&
      node.dataset.bizuplyPortalLive === "1" &&
      node.childElementCount > 0;

    if (alreadyMounted) {
      // Visual re-apply can restore legacy shell link attrs after first mount.
      [
        "data-bizuply-public-href",
        "data-bizuply-public-target",
        "data-bizuply-public-link",
        "data-visual-link-href",
        "data-visual-link-target",
        "data-href",
        "data-link-url",
        "href",
      ].forEach((attr) => node.removeAttribute(attr));
      if (node.getAttribute("role") === "link") {
        node.removeAttribute("role");
      }
      if (node.getAttribute("tabindex") === "0") {
        node.removeAttribute("tabindex");
      }
      return;
    }
    node.dataset.bizuplyPortalMounted = "1";
    node.dataset.bizuplyPortalLive = "1";

    const kind = String(
      node.getAttribute("data-bizuply-portal-kind") ||
        node.getAttribute("data-bizuply-widget") ||
        "",
    );

    if (kind === "portal-login") {
      mountLogin(node, { siteId, host, siteName, paths, editorMode });
      return;
    }
    if (kind === "portal-register") {
      mountRegister(node, { siteId, host, siteName, paths, editorMode });
      return;
    }
    if (kind === "portal-account") {
      if (editorMode) {
        void mountAccount(node, { siteId, editorMode: true, paths });
        return;
      }
      hideLibraryAccountShowcase(node);
      if (!siteId) {
        mountLogin(node, { siteId, host, siteName, paths, editorMode });
        return;
      }
      void mountAccount(node, { siteId, editorMode: false, paths });
      return;
    }
    if (kind === "portal-custom-data") {
      if (editorMode) {
        void mountCustomData(node, { siteId, editorMode: true });
        return;
      }
      if (!siteId) {
        mountLogin(node, { siteId, host, siteName, paths, editorMode });
        return;
      }
      void mountCustomData(node, { siteId, editorMode: false });
      return;
    }
    if (kind === "portal-packages") {
      mountPackages(node, { editorMode });
      return;
    }
    if (kind === "portal-orders") {
      if (editorMode) {
        void mountOrders(node, { siteId, editorMode: true, paths });
        return;
      }
      if (!siteId) {
        mountLogin(node, { siteId, host, siteName, paths, editorMode });
        return;
      }
      void mountOrders(node, { siteId, editorMode: false, paths });
      return;
    }
    if (kind === "portal-forgot-password") {
      mountForgotPassword(node, {
        siteId,
        host,
        siteName,
        paths,
        editorMode,
      });
      return;
    }
    if (kind === "portal-reset-password") {
      mountResetPassword(node, { siteId, paths, editorMode });
      return;
    }
    if (kind === "portal-cart") {
      mountCart(node, { businessId });
    }
  });

  // Bind individual CRM fields placed anywhere in the page design.
  void refreshPortalCrmFieldBindings(root, { siteId, editorMode });

  if (
    typeof document !== "undefined" &&
    !root.__bizuplyCrmFieldsBound &&
    !editorMode
  ) {
    root.__bizuplyCrmFieldsBound = true;
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void refreshPortalCrmFieldBindings(root, { siteId, editorMode: false });
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refreshPortalCrmFieldBindings(root, { siteId, editorMode: false });
      }
    }, 20000);
    root.__bizuplyCrmFieldsCleanup = () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(intervalId);
    };
  }
}

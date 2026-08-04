import {
  sitePortalLogin,
  sitePortalRegister,
  sitePortalForgotPassword,
  sitePortalResetPassword,
  sitePortalMe,
  sitePortalMyOrders,
  sitePortalLogout,
} from "../../../api/sitePortalApi";
import {
  findStoredPortalTokenHint,
  getSitePortalToken,
} from "../../../utils/sitePortalSession";
import { resolvePortalPaths } from "./portalSitePaths";

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
  container.dir = "rtl";
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

const PORTAL_AUTH_CONTROL_LABELS = {
  submit: "כפתור שליחה",
  switch: "קישור מעבר",
  forgot: "שכחתי סיסמה",
  title: "כותרת טופס",
  subtitle: "תיאור טופס",
  eyebrow: "כותרת עליונה",
};

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
    PORTAL_AUTH_CONTROL_LABELS[kind] || (isText ? "טקסט" : "כפתור"),
  );
  if (!isText) {
    node.setAttribute("data-visual-link-href", node.getAttribute("href") || "");
  }
}

function mountLogin(container, { siteId, host, siteName, paths, editorMode }) {
  prepareMountShell(container);
  const theme = readPortalTheme(container);
  const copy = {
    eyebrow: readPortalCopy(container, "eyebrow", "אזור אישי"),
    title: readPortalCopy(
      container,
      "title",
      siteName ? `התחברות ל${siteName}` : "התחברות",
    ),
    subtitle: readPortalCopy(
      container,
      "subtitle",
      "הזינו את הפרטים שלכם כדי להיכנס לחשבון באתר.",
    ),
    email: readPortalCopy(container, "email", "אימייל"),
    password: readPortalCopy(container, "password", "סיסמה"),
    submit: readPortalCopy(container, "submit", "התחברות"),
    register: readPortalCopy(container, "switch", "אין לכם חשבון? הרשמה"),
    forgot: readPortalCopy(container, "forgot", "שכחתי סיסמה"),
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
  email.required = true;
  email.placeholder = copy.email;
  email.autocomplete = "username";
  styleInput(email, theme);

  const password = document.createElement("input");
  password.type = "password";
  password.required = true;
  password.placeholder = copy.password;
  password.autocomplete = "current-password";
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
  submit.type = "button";
  stampPortalAuthControl(submit, container, "submit", editorMode);

  submit.addEventListener("click", async () => {
    errorBox.style.display = "none";

    if (editorMode) {
      // Selection handles the click in the studio — no fake login noise.
      return;
    }

    submit.disabled = true;
    submit.textContent = "מתחבר...";
    try {
      await sitePortalLogin({
        email: email.value,
        password: password.value,
        siteId: siteId || undefined,
        host: host || window.location.host,
      });
      navigateToSitePath(paths?.account || "/portal/account");
    } catch (err) {
      errorBox.textContent = err?.message || "ההתחברות נכשלה";
      errorBox.style.display = "block";
    } finally {
      submit.disabled = false;
      submit.textContent = copy.submit;
    }
  });

  wrap.appendChild(email);
  wrap.appendChild(password);
  wrap.appendChild(errorBox);
  wrap.appendChild(submit);

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
    eyebrow: readPortalCopy(container, "eyebrow", "אזור אישי"),
    title: readPortalCopy(
      container,
      "title",
      siteName ? `הרשמה ל${siteName}` : "הרשמה",
    ),
    subtitle: readPortalCopy(
      container,
      "subtitle",
      "מלאו את הפרטים כדי לפתוח חשבון ולהמשיך באתר.",
    ),
    name: readPortalCopy(container, "name", "שם מלא"),
    email: readPortalCopy(container, "email", "אימייל"),
    phone: readPortalCopy(container, "phone", "טלפון (אופציונלי)"),
    password: readPortalCopy(container, "password", "סיסמה (לפחות 6 תווים)"),
    submit: readPortalCopy(container, "submit", "יצירת חשבון"),
    login: readPortalCopy(container, "switch", "כבר רשומים? התחברות"),
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
  fullName.required = true;
  fullName.placeholder = copy.name;
  fullName.autocomplete = "name";
  styleInput(fullName, theme);

  const email = document.createElement("input");
  email.type = "email";
  email.required = true;
  email.placeholder = copy.email;
  email.autocomplete = "username";
  styleInput(email, theme);

  const phone = document.createElement("input");
  phone.type = "tel";
  phone.placeholder = copy.phone;
  phone.autocomplete = "tel";
  styleInput(phone, theme);

  const password = document.createElement("input");
  password.type = "password";
  password.required = true;
  password.placeholder = copy.password;
  password.autocomplete = "new-password";
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
  submit.type = "button";
  stampPortalAuthControl(submit, container, "submit", editorMode);

  submit.addEventListener("click", async () => {
    errorBox.style.display = "none";

    if (editorMode) {
      return;
    }

    submit.disabled = true;
    submit.textContent = "נרשם...";
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
      errorBox.textContent = err?.message || "ההרשמה נכשלה";
      errorBox.style.display = "block";
    } finally {
      submit.disabled = false;
      submit.textContent = copy.submit;
    }
  });

  wrap.appendChild(fullName);
  wrap.appendChild(email);
  wrap.appendChild(phone);
  wrap.appendChild(password);
  wrap.appendChild(errorBox);
  wrap.appendChild(submit);

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
    eyebrow: "אזור אישי",
    title: "שכחתי סיסמה",
    subtitle:
      "הזינו את האימייל שאיתו נרשמתם ונשלח אליכם קישור לבחירת סיסמה חדשה.",
  });

  const email = document.createElement("input");
  email.type = "email";
  email.required = true;
  email.placeholder = "אימייל";
  email.autocomplete = "email";
  styleInput(email, theme);

  const errorBox = portalNoticeBox(theme, "error");
  const successBox = portalNoticeBox(theme, "success");
  const submit = portalPrimaryButton(theme, "שליחת קישור לאיפוס");

  submit.addEventListener("click", async () => {
    errorBox.style.display = "none";
    successBox.style.display = "none";

    if (editorMode) {
      successBox.textContent =
        "בתצוגת עריכה לא נשלח מייל. באתר המפורסם הלקוח יקבל קישור לאיפוס.";
      successBox.style.display = "block";
      return;
    }

    submit.disabled = true;
    submit.textContent = "שולח...";

    try {
      const result = await sitePortalForgotPassword({
        email: email.value,
        siteId: siteId || undefined,
        host: host || window.location.host,
        resetPath: paths?.resetPassword || "/portal/reset-password",
      });

      successBox.textContent =
        result?.message ||
        "אם קיים חשבון עם האימייל הזה, נשלח אליו קישור לאיפוס סיסמה.";
      successBox.style.display = "block";
    } catch (err) {
      errorBox.textContent = err?.message || "שליחת הקישור נכשלה";
      errorBox.style.display = "block";
    } finally {
      submit.disabled = false;
      submit.textContent = "שליחת קישור לאיפוס";
    }
  });

  wrap.appendChild(email);
  wrap.appendChild(errorBox);
  wrap.appendChild(successBox);
  wrap.appendChild(submit);

  const backLink = document.createElement("a");
  backLink.href = paths?.login || "/portal/login";
  backLink.textContent = "חזרה להתחברות";
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
    eyebrow: "אזור אישי",
    title: "בחירת סיסמה חדשה",
    subtitle: "בחרו סיסמה חדשה באורך 6 תווים לפחות.",
  });

  const password = document.createElement("input");
  password.type = "password";
  password.required = true;
  password.placeholder = "סיסמה חדשה";
  password.autocomplete = "new-password";
  styleInput(password, theme);

  const confirm = document.createElement("input");
  confirm.type = "password";
  confirm.required = true;
  confirm.placeholder = "אימות סיסמה";
  confirm.autocomplete = "new-password";
  styleInput(confirm, theme);

  const errorBox = portalNoticeBox(theme, "error");
  const successBox = portalNoticeBox(theme, "success");
  const submit = portalPrimaryButton(theme, "שמירת הסיסמה");

  if (!token && !editorMode) {
    errorBox.textContent =
      "הקישור חסר או אינו תקין. בקשו קישור חדש בעמוד «שכחתי סיסמה».";
    errorBox.style.display = "block";
  }

  submit.addEventListener("click", async () => {
    errorBox.style.display = "none";
    successBox.style.display = "none";

    if (editorMode) {
      successBox.textContent =
        "בתצוגת עריכה לא מתבצע שינוי סיסמה. באתר המפורסם זה יעבוד מהקישור במייל.";
      successBox.style.display = "block";
      return;
    }

    if (password.value.length < 6) {
      errorBox.textContent = "הסיסמה חייבת להיות באורך 6 תווים לפחות";
      errorBox.style.display = "block";
      return;
    }

    if (password.value !== confirm.value) {
      errorBox.textContent = "הסיסמאות אינן זהות";
      errorBox.style.display = "block";
      return;
    }

    submit.disabled = true;
    submit.textContent = "שומר...";

    try {
      await sitePortalResetPassword({ token, password: password.value });
      navigateToSitePath(paths?.account || "/portal/account");
    } catch (err) {
      errorBox.textContent = err?.message || "איפוס הסיסמה נכשל";
      errorBox.style.display = "block";
    } finally {
      submit.disabled = false;
      submit.textContent = "שמירת הסיסמה";
    }
  });

  wrap.appendChild(password);
  wrap.appendChild(confirm);
  wrap.appendChild(errorBox);
  wrap.appendChild(successBox);
  wrap.appendChild(submit);

  const backLink = document.createElement("a");
  backLink.href = paths?.login || "/portal/login";
  backLink.textContent = "חזרה להתחברות";
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

function renderAccountPanel(
  container,
  theme,
  member,
  pages,
  { onLogout, paths, editorMode = false } = {},
) {
  prepareMountShell(container);
  const wrap = el("div", {
    padding: "24px",
    fontFamily: "inherit",
    color: theme.ink,
    boxSizing: "border-box",
  });
  const greeting = el(
    "h3",
    { margin: "0 0 6px", fontSize: "22px", fontWeight: "900", color: theme.ink },
    `שלום ${member?.fullName || "לקוח/ה"}`,
  );
  stampPortalAuthControl(greeting, container, "title", editorMode);
  wrap.appendChild(greeting);
  const emailLine = el(
    "p",
    {
      margin: "0 0 16px",
      color: theme.muted,
      fontSize: "13px",
      fontWeight: "600",
    },
    member?.email || "client@example.com",
  );
  stampPortalAuthControl(emailLine, container, "subtitle", editorMode);
  wrap.appendChild(emailLine);

  const quickLinks = [
    { href: paths?.orders || "/orders", label: "ההזמנות שלי" },
    { href: paths?.cart || "/cart", label: "העגלה שלי" },
    { href: paths?.account || "/portal/account", label: "פרטי החשבון" },
  ];
  const quickRow = el("div", {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  });
  quickLinks.forEach((item) => {
    const link = document.createElement("a");
    bindEditorSafeLink(link, item.href, editorMode);
    link.textContent = item.label;
    Object.assign(link.style, {
      display: "inline-flex",
      padding: "10px 14px",
      borderRadius: "12px",
      border: `1px solid ${theme.line}`,
      background: theme.soft,
      textDecoration: "none",
      color: theme.ink,
      fontWeight: "800",
      fontSize: "13px",
    });
    quickRow.appendChild(link);
  });
  wrap.appendChild(quickRow);

  const pageList = Array.isArray(pages) ? pages : [];
  if (!pageList.length) {
    ["הזמנות קודמות", "עמוד מוגן ללקוחות", "המשך רכישה"].forEach((label) => {
      wrap.appendChild(
        el(
          "div",
          {
            marginBottom: "8px",
            padding: "12px 14px",
            borderRadius: "14px",
            border: `1px solid ${theme.line}`,
            background: "#fff",
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
      link.textContent = page.title || "עמוד";
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
        background: "#fff",
      });
      wrap.appendChild(link);
    });
  }

  if (typeof onLogout === "function") {
    const logout = el(
      "button",
      {
        marginTop: "14px",
        border: "0",
        borderRadius: "12px",
        background: theme.ink,
        color: "#fff",
        padding: "10px 14px",
        fontWeight: "800",
        cursor: "pointer",
      },
      "התנתקות",
    );
    logout.type = "button";
    logout.addEventListener("click", onLogout);
    wrap.appendChild(logout);
  }

  container.appendChild(wrap);
}

function renderOrdersPanel(container, theme, orders) {
  prepareMountShell(container);
  const wrap = el("div", {
    padding: "20px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  });
  const list = Array.isArray(orders) && orders.length
    ? orders
    : [
        { orderNumber: "1042", status: "שולמה", total: 249 },
        { orderNumber: "1038", status: "בטיפול", total: 128.5 },
        { orderNumber: "1021", status: "נשלחה", total: 89 },
      ];

  list.forEach((order) => {
    const card = el("div", {
      marginBottom: "10px",
      padding: "14px 16px",
      borderRadius: "16px",
      border: `1px solid ${theme.line}`,
      background: "#fff",
    });
    card.appendChild(
      el(
        "div",
        {
          fontWeight: "900",
          fontSize: "14px",
          marginBottom: "4px",
          color: theme.ink,
        },
        `הזמנה ${order.orderNumber || order.id || ""}`,
      ),
    );
    card.appendChild(
      el(
        "div",
        { fontSize: "12px", color: theme.muted, fontWeight: "600" },
        `${order.status || "status"} · ₪${Number(order.total || 0).toFixed(2)}`,
      ),
    );
    if (order.morningDocumentUrl) {
      const invoice = document.createElement("a");
      invoice.href = order.morningDocumentUrl;
      invoice.target = "_blank";
      invoice.rel = "noopener noreferrer";
      invoice.textContent = "חשבונית";
      Object.assign(invoice.style, {
        display: "inline-block",
        marginTop: "8px",
        fontSize: "12px",
        fontWeight: "800",
        color: theme.accent,
      });
      card.appendChild(invoice);
    }
    wrap.appendChild(card);
  });
  container.appendChild(wrap);
}

async function mountAccount(container, { siteId, editorMode = false, paths }) {
  const theme = readPortalTheme(container);

  // Studio edit/preview: always show open design sample — never ask to login.
  if (editorMode) {
    renderAccountPanel(
      container,
      theme,
      { fullName: "לקוח/ה לדוגמה", email: "client@example.com" },
      [],
      { paths, editorMode: true },
    );
    return;
  }

  prepareMountShell(container);
  const loading = el(
    "div",
    { padding: "24px", fontWeight: "700", color: theme.muted },
    "טוען חשבון...",
  );
  container.appendChild(loading);

  try {
    const data = await sitePortalMe(siteId);
    const pages = Array.isArray(data.portalPages)
      ? data.portalPages.filter((page) => page.loginRequired !== false)
      : [];
    renderAccountPanel(container, theme, data.member, pages, {
      paths,
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
        "כדי לצפות בחשבון יש להתחבר.",
      ),
    );
    const login = document.createElement("a");
    login.href = paths?.login || "/portal/login";
    login.textContent = "להתחברות";
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
      "טוען הזמנות...",
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
          "אין עדיין הזמנות משויכות לחשבון זה.",
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
        "כדי לצפות בהזמנות יש להתחבר.",
      ),
    );
    const login = document.createElement("a");
    login.href = paths?.login || "/portal/login";
    login.textContent = "להתחברות";
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
        "העגלה ריקה כרגע.",
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
    row.appendChild(el("span", {}, `${item.name || "מוצר"} × ${qty}`));
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
      `סה״כ: ₪${total.toFixed(2)}`,
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
    "המשך לתשלום",
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
      if (!siteId) {
        mountLogin(node, { siteId, host, siteName, paths, editorMode });
        return;
      }
      void mountAccount(node, { siteId, editorMode: false, paths });
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
}

import {
  sitePortalLogin,
  sitePortalRegister,
  sitePortalMe,
  sitePortalMyOrders,
  sitePortalLogout,
} from "../../../api/sitePortalApi";
import {
  findStoredPortalTokenHint,
  getSitePortalToken,
} from "../../../utils/sitePortalSession";

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
  Object.assign(container.style, {
    overflow: "auto",
    boxSizing: "border-box",
  });
}

function mountLogin(container, { siteId, host, siteName }) {
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
      "אזור אישי",
    ),
  );
  wrap.appendChild(
    el(
      "h3",
      { fontSize: "26px", fontWeight: "900", margin: "0 0 8px", lineHeight: "1.15" },
      siteName ? `התחברות ל${siteName}` : "התחברות",
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
      "התחברות זו שייכת לאתר זה בלבד ואינה קשורה לחשבון BizUply.",
    ),
  );

  const email = document.createElement("input");
  email.type = "email";
  email.required = true;
  email.placeholder = "אימייל";
  email.autocomplete = "username";
  styleInput(email, theme);

  const password = document.createElement("input");
  password.type = "password";
  password.required = true;
  password.placeholder = "סיסמה";
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
    "התחברות",
  );
  submit.type = "button";

  submit.addEventListener("click", async () => {
    errorBox.style.display = "none";
    submit.disabled = true;
    submit.textContent = "מתחבר...";
    try {
      await sitePortalLogin({
        email: email.value,
        password: password.value,
        siteId: siteId || undefined,
        host: host || window.location.host,
      });
      window.history.pushState({}, "", "/account");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (err) {
      errorBox.textContent = err?.message || "ההתחברות נכשלה";
      errorBox.style.display = "block";
    } finally {
      submit.disabled = false;
      submit.textContent = "התחברות";
    }
  });

  wrap.appendChild(email);
  wrap.appendChild(password);
  wrap.appendChild(errorBox);
  wrap.appendChild(submit);

  const registerLink = document.createElement("a");
  registerLink.href = "/register";
  registerLink.textContent = "אין לכם חשבון? הרשמה";
  Object.assign(registerLink.style, {
    display: "inline-block",
    marginTop: "16px",
    color: theme.accent,
    fontSize: "13px",
    fontWeight: "800",
    textDecoration: "none",
  });
  wrap.appendChild(registerLink);

  container.appendChild(wrap);
}

function mountRegister(container, { siteId, host, siteName }) {
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
      "אזור אישי",
    ),
  );
  wrap.appendChild(
    el(
      "h3",
      { fontSize: "26px", fontWeight: "900", margin: "0 0 8px", lineHeight: "1.15" },
      siteName ? `הרשמה ל${siteName}` : "הרשמה",
    ),
  );
  wrap.appendChild(
    el(
      "p",
      {
        fontSize: "13px",
        fontWeight: "600",
        color: theme.muted,
        margin: "0 0 18px",
        lineHeight: "1.6",
      },
      "ההרשמה נשמרת לאתר ולעסק הזה בלבד — לא לחשבון BizUply.",
    ),
  );

  const fullName = document.createElement("input");
  fullName.type = "text";
  fullName.required = true;
  fullName.placeholder = "שם מלא";
  fullName.autocomplete = "name";
  styleInput(fullName, theme);

  const email = document.createElement("input");
  email.type = "email";
  email.required = true;
  email.placeholder = "אימייל";
  email.autocomplete = "username";
  styleInput(email, theme);

  const phone = document.createElement("input");
  phone.type = "tel";
  phone.placeholder = "טלפון (אופציונלי)";
  phone.autocomplete = "tel";
  styleInput(phone, theme);

  const password = document.createElement("input");
  password.type = "password";
  password.required = true;
  password.placeholder = "סיסמה (לפחות 6 תווים)";
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
    "יצירת חשבון",
  );
  submit.type = "button";

  submit.addEventListener("click", async () => {
    errorBox.style.display = "none";
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
      window.history.pushState({}, "", "/account");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (err) {
      errorBox.textContent = err?.message || "ההרשמה נכשלה";
      errorBox.style.display = "block";
    } finally {
      submit.disabled = false;
      submit.textContent = "יצירת חשבון";
    }
  });

  wrap.appendChild(fullName);
  wrap.appendChild(email);
  wrap.appendChild(phone);
  wrap.appendChild(password);
  wrap.appendChild(errorBox);
  wrap.appendChild(submit);

  const loginLink = document.createElement("a");
  loginLink.href = "/login";
  loginLink.textContent = "כבר רשומים? התחברות";
  Object.assign(loginLink.style, {
    display: "inline-block",
    marginTop: "16px",
    color: theme.accent,
    fontSize: "13px",
    fontWeight: "800",
    textDecoration: "none",
  });
  wrap.appendChild(loginLink);

  container.appendChild(wrap);
}

async function mountAccount(container, { siteId }) {
  prepareMountShell(container);
  const theme = readPortalTheme(container);
  const loading = el(
    "div",
    { padding: "24px", fontWeight: "700", color: theme.muted },
    "טוען חשבון...",
  );
  container.appendChild(loading);

  try {
    const data = await sitePortalMe(siteId);
    clearMount(container);
    const wrap = el("div", { padding: "24px", fontFamily: "inherit" });
    wrap.appendChild(
      el(
        "h3",
        { margin: "0 0 6px", fontSize: "22px", fontWeight: "900" },
        `שלום ${data.member?.fullName || ""}`,
      ),
    );
    wrap.appendChild(
      el(
        "p",
        { margin: "0 0 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" },
        data.member?.email || "",
      ),
    );

    const quickLinks = [
      { href: "/orders", label: "ההזמנות שלי" },
      { href: "/cart", label: "העגלה שלי" },
      { href: "/account", label: "פרטי החשבון" },
    ];
    const quickRow = el("div", {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "16px",
    });
    quickLinks.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;
      Object.assign(link.style, {
        display: "inline-flex",
        padding: "10px 14px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        background: "#f8fafc",
        textDecoration: "none",
        color: "#0f172a",
        fontWeight: "800",
        fontSize: "13px",
      });
      quickRow.appendChild(link);
    });
    wrap.appendChild(quickRow);

    const pages = Array.isArray(data.portalPages) ? data.portalPages : [];
    const gatedPages = pages.filter((page) => page.loginRequired !== false);
    if (!gatedPages.length) {
      wrap.appendChild(
        el(
          "div",
          {
            padding: "12px",
            borderRadius: "12px",
            background: "#f8fafc",
            color: "#64748b",
            fontSize: "12px",
            fontWeight: "700",
            border: "1px solid #e2e8f0",
          },
          "אפשר להוסיף עוד עמודים מוגנים מספריית «עמודים אחרי התחברות».",
        ),
      );
    } else {
      wrap.appendChild(
        el(
          "div",
          {
            marginBottom: "8px",
            fontSize: "12px",
            fontWeight: "800",
            color: "#64748b",
          },
          "עמודים זמינים",
        ),
      );
      gatedPages.forEach((page) => {
        const link = document.createElement("a");
        link.href = page.path || `/${page.slug || page.id}`;
        link.textContent = page.title || "עמוד";
        Object.assign(link.style, {
          display: "block",
          marginBottom: "8px",
          padding: "12px 14px",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          textDecoration: "none",
          color: "#0f172a",
          fontWeight: "800",
          fontSize: "14px",
        });
        wrap.appendChild(link);
      });
    }

    const logout = el(
      "button",
      {
        marginTop: "14px",
        border: "0",
        borderRadius: "12px",
        background: "#0f172a",
        color: "#fff",
        padding: "10px 14px",
        fontWeight: "800",
        cursor: "pointer",
      },
      "התנתקות",
    );
    logout.type = "button";
    logout.addEventListener("click", async () => {
      await sitePortalLogout(siteId);
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    wrap.appendChild(logout);
    container.appendChild(wrap);
  } catch (err) {
    clearMount(container);
    const wrap = el("div", { padding: "24px" });
    wrap.appendChild(
      el(
        "p",
        { fontWeight: "700", color: "#64748b", marginBottom: "12px" },
        err?.message || "נדרשת התחברות",
      ),
    );
    const login = document.createElement("a");
    login.href = "/login";
    login.textContent = "להתחברות";
    Object.assign(login.style, {
      display: "inline-flex",
      background: "#0f172a",
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

async function mountOrders(container, { siteId }) {
  clearMount(container);
  container.dir = "rtl";
  container.appendChild(
    el(
      "div",
      { padding: "24px", fontWeight: "700", color: "#64748b" },
      "טוען הזמנות...",
    ),
  );

  try {
    const data = await sitePortalMyOrders(siteId);
    clearMount(container);
    const wrap = el("div", { padding: "20px", fontFamily: "inherit" });
    const orders = Array.isArray(data.orders) ? data.orders : [];

    if (!orders.length) {
      wrap.appendChild(
        el(
          "div",
          {
            padding: "18px",
            borderRadius: "16px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            fontWeight: "700",
            color: "#64748b",
          },
          "אין עדיין הזמנות משויכות לחשבון זה.",
        ),
      );
      container.appendChild(wrap);
      return;
    }

    orders.forEach((order) => {
      const card = el("div", {
        marginBottom: "10px",
        padding: "14px 16px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        background: "#fff",
      });
      card.appendChild(
        el(
          "div",
          { fontWeight: "900", fontSize: "14px", marginBottom: "4px" },
          `הזמנה ${order.orderNumber || order.id || ""}`,
        ),
      );
      card.appendChild(
        el(
          "div",
          { fontSize: "12px", color: "#64748b", fontWeight: "600" },
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
          color: "#0284c7",
        });
        card.appendChild(invoice);
      }
      wrap.appendChild(card);
    });
    container.appendChild(wrap);
  } catch (err) {
    clearMount(container);
    const wrap = el("div", { padding: "24px" });
    wrap.appendChild(
      el(
        "p",
        { fontWeight: "700", color: "#e11d48", marginBottom: "12px" },
        err?.message || "לא ניתן לטעון הזמנות",
      ),
    );
    const login = document.createElement("a");
    login.href = "/login";
    login.textContent = "להתחברות";
    Object.assign(login.style, {
      display: "inline-flex",
      background: "#0f172a",
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
  clearMount(container);
  container.dir = "rtl";
  const wrap = el("div", { padding: "20px", fontFamily: "inherit" });
  const items = readCart(businessId);

  if (!items.length) {
    wrap.appendChild(
      el(
        "div",
        {
          padding: "18px",
          borderRadius: "16px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          fontWeight: "700",
          color: "#64748b",
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
      borderBottom: "1px solid #e2e8f0",
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
      background: "#0284c7",
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

  // Ensure token for known site id is discoverable for subsequent API calls.
  if (siteId && !getSitePortalToken(siteId)) {
    /* no-op: login will set it */
  }

  const mounts = root.querySelectorAll(
    '[data-bizuply-portal-mount="true"], [data-bizuply-widget^="portal-"]',
  );

  mounts.forEach((node) => {
    if (node.dataset.bizuplyPortalMounted === "1") return;
    node.dataset.bizuplyPortalMounted = "1";

    const kind = String(
      node.getAttribute("data-bizuply-portal-kind") ||
        node.getAttribute("data-bizuply-widget") ||
        "",
    );

    if (kind === "portal-login") {
      mountLogin(node, { siteId, host, siteName });
      return;
    }
    if (kind === "portal-register") {
      mountRegister(node, { siteId, host, siteName });
      return;
    }
    if (kind === "portal-account") {
      if (!siteId) {
        mountLogin(node, { siteId, host, siteName });
        return;
      }
      void mountAccount(node, { siteId });
      return;
    }
    if (kind === "portal-orders") {
      if (!siteId) {
        mountLogin(node, { siteId, host, siteName });
        return;
      }
      void mountOrders(node, { siteId });
      return;
    }
    if (kind === "portal-cart") {
      mountCart(node, { businessId });
    }
  });
}

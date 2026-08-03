import {
  sitePortalLogin,
  sitePortalMe,
  sitePortalMyOrders,
  sitePortalLogout,
} from "../../../api/sitePortalApi";
import {
  findStoredPortalTokenHint,
  getSitePortalToken,
} from "../../../utils/sitePortalSession";

function clearMount(el) {
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

function mountLogin(container, { siteId, host, siteName }) {
  clearMount(container);
  container.dir = "rtl";

  const wrap = el("div", {
    padding: "28px",
    fontFamily: "inherit",
    color: "#0f172a",
  });

  wrap.appendChild(
    el(
      "div",
      {
        fontSize: "12px",
        fontWeight: "800",
        color: "#0284c7",
        marginBottom: "8px",
      },
      "אזור אישי",
    ),
  );
  wrap.appendChild(
    el(
      "h3",
      { fontSize: "24px", fontWeight: "900", margin: "0 0 8px" },
      siteName ? `התחברות ל${siteName}` : "התחברות",
    ),
  );
  wrap.appendChild(
    el(
      "p",
      {
        fontSize: "13px",
        fontWeight: "600",
        color: "#64748b",
        margin: "0 0 18px",
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
  Object.assign(email.style, {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "10px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "12px 14px",
    fontSize: "14px",
    fontWeight: "600",
  });

  const password = document.createElement("input");
  password.type = "password";
  password.required = true;
  password.placeholder = "סיסמה";
  password.autocomplete = "current-password";
  Object.assign(password.style, {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "12px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "12px 14px",
    fontSize: "14px",
    fontWeight: "600",
  });

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
      borderRadius: "14px",
      background: "#0f172a",
      color: "#fff",
      padding: "13px 16px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
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
  container.appendChild(wrap);
}

async function mountAccount(container, { siteId }) {
  clearMount(container);
  container.dir = "rtl";
  const loading = el(
    "div",
    { padding: "24px", fontWeight: "700", color: "#64748b" },
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

    const pages = Array.isArray(data.portalPages) ? data.portalPages : [];
    if (!pages.length) {
      wrap.appendChild(
        el(
          "div",
          {
            padding: "12px",
            borderRadius: "12px",
            background: "#fffbeb",
            color: "#b45309",
            fontSize: "12px",
            fontWeight: "700",
          },
          "עדיין לא שויכו עמודים לחשבון.",
        ),
      );
    } else {
      pages.forEach((page) => {
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
      window.history.pushState({}, "", "/portal/login");
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
    login.href = "/portal/login";
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
    login.href = "/portal/login";
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
export function mountPublicPortalWidgets(root, options = {}) {
  if (!root || typeof document === "undefined") return;

  const site = options.site || {};
  const enabledPlugins = Array.isArray(site.enabledPlugins)
    ? site.enabledPlugins
    : [];
  if (!enabledPlugins.includes("client-portal")) return;

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

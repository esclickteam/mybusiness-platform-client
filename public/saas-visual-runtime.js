(function saasVisualRuntime() {
  const STYLE_KEYS = ["color", "backgroundColor", "fontFamily", "fontSize", "fontWeight", "padding", "margin", "borderRadius", "border", "textAlign", "boxShadow", "width", "maxWidth", "gap"];
  const EDITABLE = "h1,h2,h3,h4,h5,h6,p,span,a,button,label,img,section,header,footer,nav,main,article,aside,form,table,th,td,input,textarea,select,div,ul,ol,li";

  function allowedOrigin(origin) {
    return origin === "https://bizuply.com" || origin === "https://www.bizuply.com" || /^http:\/\/localhost:\d+$/.test(origin);
  }

  function cssName(key) {
    return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }

  function screenId(map, pathname) {
    const path = String(pathname || "/").split("?")[0].replace(/\/$/, "") || "/";
    const parts = path.split("/").filter(Boolean);
    let best = "";
    let id = "";
    Object.entries(map || {}).forEach(([pattern, screen]) => {
      const patternParts = String(pattern || "/").split("/").filter(Boolean);
      const exactHome = pattern === "/" && path === "/";
      const sameLength = patternParts.length === parts.length && patternParts.every((part, index) => part.startsWith(":") || part === parts[index]);
      if ((exactHome || sameLength) && String(pattern).length >= best.length) {
        best = String(pattern);
        id = String(screen || "");
      }
    });
    return id;
  }

  function nodePath(node, screen) {
    const parts = [];
    let current = node;
    while (current && current !== document.body) {
      const parent = current.parentElement;
      if (!parent) break;
      const same = Array.from(parent.children).filter((child) => child.tagName === current.tagName);
      parts.push(`${current.tagName.toLowerCase()}-${same.indexOf(current) + 1}`);
      current = parent;
    }
    return `${screen}.${parts.reverse().join(".")}`;
  }

  function locked(node) {
    const tag = node.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || tag === "form" || tag === "table" || node.getAttribute("type") === "submit";
  }

  function assign(screen) {
    document.body.querySelectorAll(EDITABLE).forEach((node) => {
      if (!(node instanceof HTMLElement) || node.closest("[data-saas-ignore]")) return;
      const id = nodePath(node, screen);
      if (node.getAttribute("data-saas-node") !== id) node.setAttribute("data-saas-node", id);
      if (locked(node)) node.setAttribute("data-saas-lock", "style");
    });
  }

  function apply(visual, screen) {
    assign(screen);
    const rules = [];
    Object.entries(visual.styles || {}).forEach(([id, devices]) => {
      if (!id.startsWith(`${screen}.`)) return;
      Object.entries(devices || {}).forEach(([device, patch]) => {
        const body = STYLE_KEYS.map((key) => (patch[key] ? `${cssName(key)}:${patch[key]}` : "")).filter(Boolean).join(";");
        if (!body) return;
        const query = device === "mobile"
          ? "@media (max-width:767px)"
          : device === "tablet"
            ? "@media (min-width:768px) and (max-width:1023px)"
            : "@media (min-width:1024px)";
        rules.push(`${query}{[data-saas-node="${id}"]{${body}}}`);
      });
    });
    Object.entries(visual.hidden || {}).forEach(([id, value]) => {
      const node = document.querySelector(`[data-saas-node="${CSS.escape(id)}"]`);
      if (value === true && node && node.getAttribute("data-saas-lock") !== "style") {
        rules.push(`[data-saas-node="${id}"]{display:none !important}`);
      }
    });
    let style = document.getElementById("saas-visual-css");
    if (!style) {
      style = document.createElement("style");
      style.id = "saas-visual-css";
      document.head.appendChild(style);
    }
    style.textContent = rules.join("\n");
    Object.entries(visual.text || {}).forEach(([id, value]) => {
      const node = document.querySelector(`[data-saas-node="${CSS.escape(id)}"]`);
      if (!(node instanceof HTMLElement) || node.getAttribute("data-saas-lock") === "style" || node.childElementCount) return;
      if (node.textContent !== value) node.textContent = value;
    });
    Object.entries(visual.order || {}).forEach(([id, value]) => {
      const node = document.querySelector(`[data-saas-node="${CSS.escape(id)}"]`);
      if (!(node instanceof HTMLElement) || node.getAttribute("data-saas-lock") === "style") return;
      const parent = node.parentElement;
      const display = parent ? getComputedStyle(parent).display : "";
      if (display === "flex" || display === "grid" || display === "inline-flex") node.style.order = String(value);
    });
  }

  function boot(options) {
    const map = options.map || {};
    const screens = options.screens || {};
    const design = Boolean(options.design);
    const screen = screenId(map, location.pathname);
    const visual = screens[screen]?.visual || { styles: {}, text: {}, hidden: {}, order: {} };
    document.body.dataset.saasScreen = screen;
    apply(visual, screen);
    if (!design || !window.parent || window.parent === window) return;
    let studioOrigin = "";
    const post = (message) => {
      if (!studioOrigin) return;
      window.parent.postMessage({ source: "saas-visual", screen, ...message }, studioOrigin);
    };
    document.addEventListener("click", (event) => {
      const node = event.target instanceof Element ? event.target.closest("[data-saas-node]") : null;
      if (!(node instanceof HTMLElement)) return;
      if (node.dataset.saasOpen === "1") {
        delete node.dataset.saasOpen;
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      document.querySelectorAll("[data-saas-selected]").forEach((item) => item.removeAttribute("data-saas-selected"));
      node.setAttribute("data-saas-selected", "true");
      node.style.outline = "2px solid #7c3aed";
      post({
        type: "select",
        id: node.getAttribute("data-saas-node"),
        label: (node.getAttribute("aria-label") || node.textContent || node.tagName || "").replace(/\s+/g, " ").trim().slice(0, 80),
        locked: node.getAttribute("data-saas-lock") === "style",
        text: node.childElementCount ? "" : (node.textContent || "").trim().slice(0, 400),
      });
    }, true);
    window.addEventListener("message", (event) => {
      if (!allowedOrigin(event.origin)) return;
      const data = event.data || {};
      if (data.source !== "saas-studio") return;
      if (data.type === "hello") {
        studioOrigin = event.origin;
        post({ type: "ready" });
        return;
      }
      if (data.type === "open" && data.id) {
        const node = document.querySelector(`[data-saas-node="${CSS.escape(String(data.id))}"]`);
        if (!(node instanceof HTMLElement)) return;
        if (node instanceof HTMLAnchorElement && node.href) {
          const target = new URL(node.href, location.href);
          target.searchParams.set("saasDesign", "1");
          location.assign(target.pathname + target.search);
          return;
        }
        node.dataset.saasOpen = "1";
        node.click();
        return;
      }
      if (data.type !== "apply" || data.screen !== screen || event.origin !== studioOrigin) return;
      apply(data.visual || visual, screen);
    });
  }

  window.SaasVisual = { boot };
})();

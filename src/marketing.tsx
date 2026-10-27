import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { marketingLocaleBasename } from "./lib/localePathCore.mjs";
import { marketingI18nReady } from "./marketing/marketingI18n";
import "./styles/rtl.css";
import "./styles/index.css";
import MarketingApp from "./marketing/MarketingApp";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element with id 'root' was not found");
}

const prerender = rootElement.querySelector("main");
if (prerender) {
  const hold = document.createElement("div");
  hold.id = "bizuply-first-paint";
  hold.appendChild(prerender);
  rootElement.insertAdjacentElement("beforebegin", hold);
  rootElement.setAttribute("hidden", "");
}

void marketingI18nReady.finally(() => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter
          basename={marketingLocaleBasename(window.location.pathname)}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MarketingApp />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>,
  );
});

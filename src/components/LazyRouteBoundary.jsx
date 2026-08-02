import React from "react";
import { RefreshCw } from "lucide-react";
import {
  clearChunkReloadFlag,
  isChunkLoadError,
} from "../utils/lazyWithRetry";

const RELOAD_KEY = "bizuply:chunk-reload";
const DOM_RELOAD_KEY = "bizuply:dom-reconcile-reload";

function isDomReconcileError(error) {
  const message = String(error?.message || error || "");
  return (
    error?.name === "NotFoundError" ||
    /removeChild/i.test(message) ||
    /The node to be removed is not a child of this node/i.test(message) ||
    /insertBefore/i.test(message)
  );
}

class LazyRouteBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("LazyRouteBoundary:", error, errorInfo);

    const shouldAutoReload =
      isChunkLoadError(error) || isDomReconcileError(error);
    if (!shouldAutoReload) return;

    const storageKey = isChunkLoadError(error) ? RELOAD_KEY : DOM_RELOAD_KEY;

    try {
      if (sessionStorage.getItem(storageKey) === "1") {
        sessionStorage.removeItem(storageKey);
        return;
      }
      sessionStorage.setItem(storageKey, "1");
      window.location.reload();
    } catch {
      // fall through to manual reload UI
    }
  }

  handleReload = () => {
    clearChunkReloadFlag();
    try {
      sessionStorage.removeItem(DOM_RELOAD_KEY);
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const chunkError = isChunkLoadError(this.state.error);
    const domError = isDomReconcileError(this.state.error);

    return (
      <div
        dir="rtl"
        className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-black text-slate-800">
            {chunkError
              ? "גרסה חדשה של האתר זמינה"
              : domError
                ? "צריך לרענן את העורך"
                : "שגיאה בטעינת העמוד"}
          </h2>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {chunkError
              ? "הדפדפן ניסה לטעון קובץ ישן. רענון אחד יפתור את זה."
              : domError
                ? "העורך התעדכן בזמן טעינת התבנית. רענון קצר יחזיר אותך לעריכה."
                : this.state.error?.message || "נסה שוב בעוד רגע."}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-5 text-slate-800"
          >
            <RefreshCw size={16} />
            רענון הדף
          </button>
        </div>
      </div>
    );
  }
}

export default LazyRouteBoundary;

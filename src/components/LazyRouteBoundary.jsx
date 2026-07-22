import React from "react";
import { RefreshCw } from "lucide-react";

function isChunkLoadError(error) {
  const message = String(error?.message || error || "");
  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /Loading chunk [\d]+ failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message)
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
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const chunkError = isChunkLoadError(this.state.error);

    return (
      <div
        dir="rtl"
        className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">
            {chunkError ? "גרסה חדשה של האתר זמינה" : "שגיאה בטעינת העמוד"}
          </h2>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {chunkError
              ? "הדפדפן ניסה לטעון קובץ ישן. רענון אחד יפתור את זה."
              : this.state.error?.message || "נסה שוב בעוד רגע."}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white"
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

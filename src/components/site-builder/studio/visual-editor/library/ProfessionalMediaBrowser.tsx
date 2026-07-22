import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  Check,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Search,
  Upload,
} from "lucide-react";

import BizuplyLoader from "../../../../../components/ui/BizuplyLoader";
import {
  PEXELS_MEDIA_CATEGORIES,
  searchPexelsMedia,
  type PexelsCategory,
  type PexelsMediaItem,
  type PexelsMediaType,
} from "./pexelsMediaService";

export type ProfessionalMediaBrowserMode = "add" | "select";

type ProfessionalMediaBrowserProps = {
  editor?: any;
  query: string;
  onQueryChange: (value: string) => void;
  mode?: ProfessionalMediaBrowserMode;
  onSelect?: (item: PexelsMediaItem) => void;
  selectedId?: string;
  onUpload?: () => void;
  showUploadButton?: boolean;
  className?: string;
};

export default function ProfessionalMediaBrowser({
  editor,
  query,
  onQueryChange,
  mode = "add",
  onSelect,
  selectedId = "",
  onUpload,
  showUploadButton = false,
  className = "",
}: ProfessionalMediaBrowserProps) {
  const [category, setCategory] =
    useState<PexelsCategory>("business");
  const [mediaType, setMediaType] =
    useState<PexelsMediaType>("photos");
  const [items, setItems] = useState<PexelsMediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState("");

  const requestRef = useRef<AbortController | null>(null);

  const categoryDefinition = useMemo(
    () =>
      PEXELS_MEDIA_CATEGORIES.find(
        (item) => item.id === category,
      ) || PEXELS_MEDIA_CATEGORIES[0],
    [category],
  );

  const effectiveQuery =
    String(query || "").trim() || categoryDefinition.query;

  const load = async ({
    nextPage = 1,
    append = false,
  }: {
    nextPage?: number;
    append?: boolean;
  } = {}) => {
    requestRef.current?.abort();

    const controller = new AbortController();
    requestRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const result = await searchPexelsMedia({
        query: effectiveQuery,
        type: mediaType,
        page: nextPage,
        pageSize: 24,
        category,
        signal: controller.signal,
      });

      setItems((current) =>
        append ? [...current, ...result.items] : result.items,
      );
      setPage(result.page);
      setHasNextPage(result.hasNextPage);
    } catch (loadError) {
      if (controller.signal.aborted) return;

      setError(
        loadError instanceof Error
          ? loadError.message
          : "לא ניתן לטעון את ספריית Pexels",
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load({ nextPage: 1, append: false });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      requestRef.current?.abort();
    };
  }, [effectiveQuery, mediaType, category]);

  const handleItemAction = async (item: PexelsMediaItem) => {
    if (mode === "select") {
      onSelect?.(item);
      setAddedId(item.id);
      window.setTimeout(() => setAddedId(""), 1200);
      return;
    }

    await editor?.addLibraryMedia?.(item);
    setAddedId(item.id);
    window.setTimeout(() => setAddedId(""), 1400);
  };

  const actionLabel =
    mode === "select" ? "בחירה" : "הוספה";

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${className}`}>
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setMediaType("photos");
              setPage(1);
            }}
            className={[
              "inline-flex h-11 items-center justify-center gap-2 rounded-2xl text-sm font-black transition",
              mediaType === "photos"
                ? "bg-slate-950 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            ].join(" ")}
          >
            <ImageIcon className="h-4 w-4" />
            תמונות
          </button>

          <button
            type="button"
            onClick={() => {
              setMediaType("videos");
              setPage(1);
            }}
            className={[
              "inline-flex h-11 items-center justify-center gap-2 rounded-2xl text-sm font-black transition",
              mediaType === "videos"
                ? "bg-slate-950 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            ].join(" ")}
          >
            <Film className="h-4 w-4" />
            סרטונים
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onQueryChange(event.target.value)
              }
              placeholder={
                mediaType === "videos"
                  ? "חיפוש סרטונים מקצועיים..."
                  : "חיפוש תמונות מקצועיות..."
              }
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          {showUploadButton && onUpload ? (
            <button
              type="button"
              onClick={onUpload}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-violet-700 transition hover:border-violet-300 hover:bg-violet-50"
            >
              <Upload className="h-4 w-4" />
              העלאה
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {PEXELS_MEDIA_CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCategory(item.id);
                onQueryChange("");
                setPage(1);
              }}
              className={[
                "whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition",
                category === item.id && !query.trim()
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#f7f8fb] p-6">
        {error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-center">
            <p className="text-sm font-black text-rose-700">
              טעינת המדיה נכשלה
            </p>
            <p className="mt-1 text-xs font-bold text-rose-500">{error}</p>
            <button
              type="button"
              onClick={() => void load({ nextPage: 1, append: false })}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-rose-700 shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              נסו שוב
            </button>
          </div>
        ) : null}

        {!items.length && loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="text-center">
              <BizuplyLoader size="lg" />
              <p className="mt-3 text-sm font-black text-slate-700">
                {mediaType === "videos"
                  ? "טוען סרטונים מקצועיים..."
                  : "טוען תמונות מקצועיות..."}
              </p>
            </div>
          </div>
        ) : null}

        {!loading && !error && !items.length ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="text-center">
              {mediaType === "videos" ? (
                <Film className="mx-auto h-9 w-9 text-slate-300" />
              ) : (
                <ImageIcon className="mx-auto h-9 w-9 text-slate-300" />
              )}
              <p className="mt-3 text-sm font-black text-slate-700">
                לא נמצאו תוצאות
              </p>
            </div>
          </div>
        ) : null}

        {items.length ? (
          <div className="columns-2 gap-4 xl:columns-3">
            {items.map((item) => {
              const isSelected =
                selectedId === item.id || selectedId === item.src;
              const isAdded = addedId === item.id;

              return (
                <article
                  key={item.id}
                  className={[
                    "group relative mb-4 break-inside-avoid overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(91,33,182,0.12)]",
                    isSelected
                      ? "ring-2 ring-violet-500"
                      : "ring-slate-200",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => void handleItemAction(item)}
                    className="block w-full text-right"
                  >
                    <div className="relative overflow-hidden bg-slate-200">
                      <img
                        src={item.thumbnail}
                        alt={item.alt}
                        loading="lazy"
                        className="block h-auto min-h-[160px] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />

                      {item.mediaType === "video" ? (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/10">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-slate-950 shadow-lg">
                            <Film className="h-5 w-5" />
                          </div>
                        </div>
                      ) : null}

                      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent p-4 pt-14 transition duration-200 group-hover:translate-y-0">
                        <p className="line-clamp-1 text-xs font-black text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 line-clamp-1 text-[10px] font-bold text-slate-300">
                          {item.creator || "Pexels"} · Pexels
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 p-3">
                    <button
                      type="button"
                      onClick={() => void handleItemAction(item)}
                      className={[
                        "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-xs font-black transition",
                        isAdded || isSelected
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-violet-600 text-white hover:bg-violet-700",
                      ].join(" ")}
                    >
                      {isAdded || isSelected ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : item.mediaType === "video" ? (
                        <Film className="h-3.5 w-3.5" />
                      ) : (
                        <ImageIcon className="h-3.5 w-3.5" />
                      )}
                      {isAdded || isSelected ? "נבחר" : actionLabel}
                    </button>

                    {item.sourceUrl ? (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="פתיחת המדיה ב־Pexels"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}

        {items.length && hasNextPage ? (
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              void load({ nextPage: page + 1, append: true })
            }
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 disabled:opacity-50"
          >
            {loading ? (
              <BizuplyLoader size="xs" compact />
            ) : mediaType === "videos" ? (
              <Film className="h-4 w-4" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
            טעינת תוצאות נוספות
          </button>
        ) : null}

        <p className="mt-5 px-2 text-center text-[10px] font-bold leading-5 text-slate-400">
          תמונות וסרטונים מסופקים על ידי{" "}
          <a
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-black text-violet-600 underline"
          >
            Pexels
          </a>
        </p>
      </div>
    </div>
  );
}
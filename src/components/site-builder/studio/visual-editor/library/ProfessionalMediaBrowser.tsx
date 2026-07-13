import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  PEXELS_MEDIA_CATEGORIES,
  searchPexelsMedia,
  type PexelsMediaType,
} from "./pexelsMediaService";
type PexelsCategory =
  (typeof PEXELS_MEDIA_CATEGORIES)[number]["id"];

type PexelsBrowserItem =
  Awaited<ReturnType<typeof searchPexelsMedia>>["items"][number] & {
    id: string;
    src: string;
    thumbnail?: string;
    mediaType?: "image" | "video" | string;
    alt?: string;
    title?: string;
    creator?: string;
    sourceUrl?: string;
    creatorUrl?: string;
    width?: number;
    height?: number;
  };

type ProfessionalMediaBrowserProps = {
  editor: any;
  query: string;
  onQueryChange: (value: string) => void;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message
    ? error.message
    : fallback;
}

export default function ProfessionalMediaBrowser({
  editor,
  query,
  onQueryChange,
}: ProfessionalMediaBrowserProps) {
  const [category, setCategory] =
    useState<PexelsCategory>(
      PEXELS_MEDIA_CATEGORIES[0].id,
    );
  const [mediaType, setMediaType] =
    useState<PexelsMediaType>("photos");
  const [items, setItems] =
    useState<PexelsBrowserItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState("");
  const [addedId, setAddedId] = useState("");
  const requestRef = useRef<AbortController | null>(null);
  const addedTimerRef = useRef<number | null>(null);

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

      const nextItems = result.items as PexelsBrowserItem[];

      setItems((current) =>
        append ? [...current, ...nextItems] : nextItems,
      );
      setPage(result.page);
      setHasNextPage(result.hasNextPage);
    } catch (loadError) {
      if (controller.signal.aborted) return;

      setError(
        getErrorMessage(
          loadError,
          "לא ניתן לטעון את ספריית Pexels",
        ),
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
    }, 350);

    return () => {
      window.clearTimeout(timer);
      requestRef.current?.abort();
    };
  }, [effectiveQuery, mediaType, category]);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) {
        window.clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

  const handleAdd = async (
    item: PexelsBrowserItem,
  ) => {
    const addLibraryMedia = editor?.addLibraryMedia;

    if (typeof addLibraryMedia !== "function") {
      setError("העורך לא מחובר לפעולת הוספת מדיה");
      return;
    }

    if (addingId) return;

    setAddingId(item.id);
    setError("");

    try {
      const elementId = await addLibraryMedia(item);
      const cleanElementId = String(elementId || "").trim();

      if (!cleanElementId) {
        throw new Error(
          item.mediaType === "video"
            ? "הסרטון לא נוסף לעורך"
            : "התמונה לא נוספה לעורך",
        );
      }

      editor?.applyDataToDom?.();

      window.requestAnimationFrame(() => {
        editor?.selectByElementId?.(cleanElementId, {
          keepPreviousOnMissing: true,
        });
        editor?.refreshSelectedElement?.();
      });

      setAddedId(item.id);

      if (addedTimerRef.current) {
        window.clearTimeout(addedTimerRef.current);
      }

      addedTimerRef.current = window.setTimeout(() => {
        setAddedId("");
        addedTimerRef.current = null;
      }, 1600);
    } catch (addError) {
      console.error("[BizUply Pexels] add media failed", {
        item,
        error: addError,
      });

      setError(
        getErrorMessage(
          addError,
          item.mediaType === "video"
            ? "הוספת הסרטון נכשלה"
            : "הוספת התמונה נכשלה",
        ),
      );
    } finally {
      setAddingId("");
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-slate-200 bg-white p-3">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setMediaType("photos");
              setPage(1);
            }}
            className={[
              "inline-flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-black transition",
              mediaType === "photos"
                ? "bg-slate-950 text-white"
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
              "inline-flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-black transition",
              mediaType === "videos"
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            ].join(" ")}
          >
            <Film className="h-4 w-4" />
            סרטונים
          </button>
        </div>

        <label className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />

          <input
            value={query}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement>,
            ) => onQueryChange(event.target.value)}
            placeholder={
              mediaType === "videos"
                ? "חיפוש סרטונים מקצועיים..."
                : "חיפוש תמונות מקצועיות..."
            }
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
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
                "whitespace-nowrap rounded-full px-3 py-2 text-xs font-black transition",
                category === item.id && !query.trim()
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-3">
        {error ? (
          <div className="mb-3 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-center">
            <p className="text-sm font-black text-rose-700">
              הפעולה נכשלה
            </p>
            <p className="mt-1 text-xs font-bold text-rose-500">
              {error}
            </p>
            <button
              type="button"
              onClick={() => {
                setError("");
                void load({ nextPage: 1, append: false });
              }}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-rose-700 shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              נסו שוב
            </button>
          </div>
        ) : null}

        {!items.length && loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-violet-600" />
              <p className="mt-3 text-sm font-black text-slate-700">
                טוען מדיה...
              </p>
            </div>
          </div>
        ) : null}

        {!items.length && !loading && !error ? (
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
          <div className="columns-2 gap-3 xl:columns-3">
            {items.map((item) => {
              const isAdding = addingId === item.id;
              const isAdded = addedId === item.id;

              return (
                <article
                  key={item.id}
                  className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <div className="relative overflow-hidden bg-slate-200">
                    <img
                      src={item.thumbnail || item.src}
                      alt={item.alt || item.title || "Pexels media"}
                      loading="lazy"
                      className="block h-auto min-h-[150px] w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                    />

                    {item.mediaType === "video" ? (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/15">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-lg">
                          <Film className="h-5 w-5" />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-slate-950/95 via-slate-950/78 to-transparent p-3 pt-12 transition duration-200 group-hover:translate-y-0">
                    <p className="line-clamp-1 text-xs font-black text-white">
                      {item.title || item.alt || "Pexels media"}
                    </p>

                    <p className="mt-1 line-clamp-1 text-[10px] font-bold text-slate-300">
                      {item.creator || "Pexels"} · Pexels
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={Boolean(addingId)}
                        onClick={() => void handleAdd(item)}
                        className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-xs font-black text-slate-950 disabled:cursor-wait disabled:opacity-70"
                      >
                        {isAdding ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-600" />
                        ) : isAdded ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : item.mediaType === "video" ? (
                          <Film className="h-3.5 w-3.5" />
                        ) : (
                          <ImageIcon className="h-3.5 w-3.5" />
                        )}

                        {isAdding
                          ? "מוסיף..."
                          : isAdded
                            ? "נוסף"
                            : "הוספה"}
                      </button>

                      {item.sourceUrl ? (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="פתיחת המדיה ב־Pexels"
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}

        {items.length && hasNextPage ? (
          <div className="mt-4 flex justify-center pb-4">
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                void load({ nextPage: page + 1, append: true })
              }
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-xs font-black text-white disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              טען עוד
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

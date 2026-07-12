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
} from "lucide-react";

import {
  PEXELS_MEDIA_CATEGORIES,
  searchPexelsMedia,
  type PexelsCategory,
  type PexelsMediaItem,
  type PexelsMediaType,
} from "./pexelsMediaService";

type ProfessionalMediaBrowserProps = {
  editor: any;
  query: string;
  onQueryChange: (value: string) => void;
};

export default function ProfessionalMediaBrowser({
  editor,
  query,
  onQueryChange,
}: ProfessionalMediaBrowserProps) {
  const [category, setCategory] =
    useState<PexelsCategory>("business");

  const [mediaType, setMediaType] =
    useState<PexelsMediaType>("photos");

  const [items, setItems] =
    useState<PexelsMediaItem[]>([]);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState("");

  const requestRef =
    useRef<AbortController | null>(null);

  const categoryDefinition = useMemo(
    () =>
      PEXELS_MEDIA_CATEGORIES.find(
        (item) => item.id === category,
      ) || PEXELS_MEDIA_CATEGORIES[0],
    [category],
  );

  const effectiveQuery =
    String(query || "").trim() ||
    categoryDefinition.query;

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
        append
          ? [...current, ...result.items]
          : result.items,
      );

      setPage(result.page);
      setHasNextPage(result.hasNextPage);
    } catch (loadError) {
      if (controller.signal.aborted) {
        return;
      }

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
      void load({
        nextPage: 1,
        append: false,
      });
    }, 350);

    return () => {
      window.clearTimeout(timer);
      requestRef.current?.abort();
    };
  }, [effectiveQuery, mediaType, category]);

  const handleAdd = async (
    item: PexelsMediaItem,
  ) => {
    await editor?.addLibraryMedia?.(item);

    setAddedId(item.id);

    window.setTimeout(() => {
      setAddedId("");
    }, 1400);
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
              event: ChangeEvent<HTMLInputElement>,
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
                category === item.id &&
                !query.trim()
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
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-center">
            <p className="text-sm font-black text-rose-700">
              טעינת המדיה נכשלה
            </p>

            <p className="mt-1 text-xs font-bold text-rose-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void load({
                  nextPage: 1,
                  append: false,
                })
              }
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-rose-700 shadow-sm"
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
                {mediaType === "videos"
                  ? "טוען סרטונים מקצועיים..."
                  : "טוען תמונות מקצועיות..."}
              </p>
            </div>
          </div>
        ) : null}

        {!loading &&
        !error &&
        !items.length ? (
          <div className="flex min-h-[280px] items-center justify-center">
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
            {items.map((item) => (
              <article
                key={item.id}
                className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
              >
                <div className="relative overflow-hidden bg-slate-200">
                  <img
                    src={item.thumbnail}
                    alt={item.alt}
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
                    {item.title}
                  </p>

                  <p className="mt-1 line-clamp-1 text-[10px] font-bold text-slate-300">
                    {item.creator || "Pexels"} ·
                    Pexels
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        void handleAdd(item)
                      }
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-xs font-black text-slate-950"
                    >
                      {addedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : item.mediaType ===
                        "video" ? (
                        <Film className="h-3.5 w-3.5" />
                      ) : (
                        <ImageIcon className="h-3.5 w-3.5" />
                      )}

                      {addedId === item.id
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
            ))}
          </div>
        ) : null}

        {items.length && hasNextPage ? (
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              void load({
                nextPage: page + 1,
                append: true,
              })
            }
            className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mediaType === "videos" ? (
              <Film className="h-4 w-4" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}

            טעינת תוצאות נוספות
          </button>
        ) : null}

        <p className="mt-4 px-2 text-center text-[10px] font-bold leading-5 text-slate-400">
          Photos and videos provided by{" "}
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

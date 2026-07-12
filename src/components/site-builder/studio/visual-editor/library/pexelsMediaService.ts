export type PexelsMediaType = "photos" | "videos";

export type PexelsCategory =
  | "business"
  | "beauty"
  | "restaurant"
  | "real-estate"
  | "technology"
  | "wellness"
  | "construction"
  | "travel"
  | "fashion"
  | "finance";

export type PexelsCategoryDefinition = {
  id: PexelsCategory;
  label: string;
  query: string;
};

export type PexelsLicenseInfo = {
  code: string;
  name: string;
  url: string;
};

export type PexelsMediaItem = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  src: string;
  thumbnail: string;
  mediaType: "image" | "video";
  alt: string;
  category: PexelsCategory;
  creator?: string;
  creatorUrl?: string;
  sourceUrl?: string;
  attribution?: string;
  license?: PexelsLicenseInfo;
  width?: number;
  height?: number;
};

export const PEXELS_MEDIA_CATEGORIES: PexelsCategoryDefinition[] = [
  {
    id: "business",
    label: "עסקים",
    query: "modern business office",
  },
  {
    id: "beauty",
    label: "יופי",
    query: "beauty salon skincare",
  },
  {
    id: "restaurant",
    label: "מסעדות",
    query: "restaurant food chef",
  },
  {
    id: "real-estate",
    label: "נדל״ן",
    query: "luxury real estate interior",
  },
  {
    id: "technology",
    label: "טכנולוגיה",
    query: "technology startup software",
  },
  {
    id: "wellness",
    label: "בריאות",
    query: "wellness fitness yoga",
  },
  {
    id: "construction",
    label: "בנייה",
    query: "construction architecture",
  },
  {
    id: "travel",
    label: "תיירות",
    query: "travel hotel vacation",
  },
  {
    id: "fashion",
    label: "אופנה",
    query: "fashion studio clothing",
  },
  {
    id: "finance",
    label: "פיננסים",
    query: "finance consulting meeting",
  },
];

export type SearchPexelsMediaInput = {
  query: string;
  type?: PexelsMediaType;
  page?: number;
  pageSize?: number;
  category?: PexelsCategory;
  signal?: AbortSignal;
};

export type SearchPexelsMediaResult = {
  items: PexelsMediaItem[];
  page: number;
  totalResults: number;
  hasNextPage: boolean;
};

const API_BASE_URL = String(
  import.meta.env.VITE_API_URL || "",
).replace(/\/+$/, "");

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_BASE_URL}${normalizedPath}`;
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function choosePhotoUrl(photo: any) {
  const source = photo?.src || {};

  return (
    toStringValue(photo?.sourceUrl) ||
    toStringValue(photo?.originalUrl) ||
    toStringValue(source.large2x) ||
    toStringValue(source.large) ||
    toStringValue(source.original) ||
    toStringValue(photo?.previewUrl) ||
    toStringValue(source.medium)
  );
}

function choosePhotoThumbnail(photo: any) {
  const source = photo?.src || {};

  return (
    toStringValue(photo?.previewUrl) ||
    toStringValue(source.medium) ||
    toStringValue(source.small) ||
    choosePhotoUrl(photo)
  );
}

function chooseVideoFile(video: any) {
  const normalizedSource =
    toStringValue(video?.sourceUrl) ||
    toStringValue(video?.originalUrl) ||
    toStringValue(video?.videoFile?.link);

  if (normalizedSource) {
    return normalizedSource;
  }

  const files = Array.isArray(video?.video_files)
    ? video.video_files
    : Array.isArray(video?.videoFiles)
      ? video.videoFiles
      : [];

  const mp4Files = files
    .filter((file: any) => {
      const fileType = toStringValue(
        file?.file_type || file?.fileType,
      ).toLowerCase();

      return (
        fileType.includes("mp4") &&
        Boolean(toStringValue(file?.link))
      );
    })
    .sort(
      (first: any, second: any) =>
        toNumber(second?.width) -
        toNumber(first?.width),
    );

  const preferred =
    mp4Files.find(
      (file: any) =>
        toNumber(file?.width) > 0 &&
        toNumber(file?.width) <= 1920,
    ) || mp4Files[0];

  return toStringValue(preferred?.link);
}

function normalizePhoto(
  photo: any,
  category: PexelsCategory,
): PexelsMediaItem | null {
  const src = choosePhotoUrl(photo);
  const thumbnail = choosePhotoThumbnail(photo);

  if (!src || !thumbnail) {
    return null;
  }

  const creator =
    toStringValue(photo?.photographer) ||
    toStringValue(photo?.creator) ||
    "Pexels";

  const sourceUrl =
    toStringValue(photo?.pexelsUrl) ||
    toStringValue(photo?.url) ||
    toStringValue(photo?.sourcePageUrl);

  const id = String(photo?.id || src);

  return {
    id: `pexels-photo-${id}`,
    title:
      toStringValue(photo?.alt) ||
      `תמונה מאת ${creator}`,
    description: "תמונה מקצועית מספריית Pexels",
    keywords: [
      "pexels",
      "photo",
      "image",
      category,
      creator,
    ],
    src,
    thumbnail,
    mediaType: "image",
    alt:
      toStringValue(photo?.alt) ||
      `Pexels photo by ${creator}`,
    category,
    creator,
    creatorUrl:
      toStringValue(photo?.photographerUrl) ||
      toStringValue(photo?.photographer_url) ||
      toStringValue(photo?.creatorUrl),
    sourceUrl,
    attribution:
      toStringValue(photo?.attribution) ||
      `Photo by ${creator} on Pexels`,
    license: {
      code: "pexels",
      name: "Pexels License",
      url: "https://www.pexels.com/license/",
    },
    width: toNumber(photo?.width),
    height: toNumber(photo?.height),
  };
}

function normalizeVideo(
  video: any,
  category: PexelsCategory,
): PexelsMediaItem | null {
  const src = chooseVideoFile(video);

  const thumbnail =
    toStringValue(video?.previewUrl) ||
    toStringValue(video?.posterUrl) ||
    toStringValue(video?.image);

  if (!src || !thumbnail) {
    return null;
  }

  const user = video?.user || {};

  const creator =
    toStringValue(video?.photographer) ||
    toStringValue(video?.creator) ||
    toStringValue(user?.name) ||
    "Pexels";

  const sourceUrl =
    toStringValue(video?.pexelsUrl) ||
    toStringValue(video?.url) ||
    toStringValue(video?.sourcePageUrl);

  const id = String(video?.id || src);

  return {
    id: `pexels-video-${id}`,
    title: `סרטון מאת ${creator}`,
    description: "סרטון מקצועי מספריית Pexels",
    keywords: [
      "pexels",
      "video",
      category,
      creator,
    ],
    src,
    thumbnail,
    mediaType: "video",
    alt: `Pexels video by ${creator}`,
    category,
    creator,
    creatorUrl:
      toStringValue(video?.photographerUrl) ||
      toStringValue(video?.creatorUrl) ||
      toStringValue(user?.url),
    sourceUrl,
    attribution:
      toStringValue(video?.attribution) ||
      `Video by ${creator} on Pexels`,
    license: {
      code: "pexels",
      name: "Pexels License",
      url: "https://www.pexels.com/license/",
    },
    width: toNumber(video?.width),
    height: toNumber(video?.height),
  };
}

function extractRawItems(
  body: any,
  type: PexelsMediaType,
) {
  if (Array.isArray(body?.items)) {
    return body.items;
  }

  if (type === "videos") {
    if (Array.isArray(body?.videos)) {
      return body.videos;
    }

    if (Array.isArray(body?.data?.videos)) {
      return body.data.videos;
    }
  }

  if (Array.isArray(body?.photos)) {
    return body.photos;
  }

  if (Array.isArray(body?.data?.photos)) {
    return body.data.photos;
  }

  return [];
}

export async function searchPexelsMedia({
  query,
  type = "photos",
  page = 1,
  pageSize = 24,
  category = "business",
  signal,
}: SearchPexelsMediaInput): Promise<SearchPexelsMediaResult> {
  const params = new URLSearchParams();

  params.set("query", query.trim() || "business");
  params.set("type", type);
  params.set("page", String(page));
  params.set("perPage", String(pageSize));

  const response = await fetch(
    buildApiUrl(
      `/api/pexels/search?${params.toString()}`,
    ),
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      signal,
    },
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.error ||
        body?.message ||
        `Pexels request failed: ${response.status}`,
    );
  }

  if (!body) {
    throw new Error(
      "השרת החזיר תשובה ריקה מ־Pexels",
    );
  }

  const rawItems = extractRawItems(body, type);

  const items = rawItems
    .map((item: any) =>
      type === "videos"
        ? normalizeVideo(item, category)
        : normalizePhoto(item, category),
    )
    .filter(
      (
        item: PexelsMediaItem | null,
      ): item is PexelsMediaItem => Boolean(item),
    );

  const currentPage = toNumber(body?.page, page);

  const totalResults = toNumber(
    body?.totalResults ??
      body?.total_results ??
      body?.data?.total_results,
    0,
  );

  const hasNextPage =
    typeof body?.hasNextPage === "boolean"
      ? body.hasNextPage
      : Boolean(
          body?.next_page ||
            body?.data?.next_page ||
            (items.length >= pageSize &&
              (totalResults === 0 ||
                currentPage * pageSize <
                  totalResults)),
        );

  return {
    items,
    page: currentPage,
    totalResults,
    hasNextPage,
  };
}

import API from "../api";

export type SocialPlatform = "facebook" | "instagram";
export type SocialContentType = "post" | "story";
export type SocialScheduleStatus =
  | "draft"
  | "scheduled"
  | "publishing"
  | "published"
  | "failed"
  | "cancelled";

export type SocialMediaItem = {
  url: string;
  type?: "image" | "video";
  mimeType?: string;
  fileName?: string;
};

export type SocialScheduledPost = {
  _id: string;
  businessId: string;
  platform: SocialPlatform;
  contentType: SocialContentType;
  caption: string;
  media: SocialMediaItem[];
  pageId: string;
  pageName: string;
  instagramBusinessAccountId?: string;
  scheduledAt: string;
  status: SocialScheduleStatus;
  bulkBatchId?: string;
  publishedAt?: string | null;
  metaPostId?: string;
  lastError?: string;
  attemptCount?: number;
  cancelledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SocialScheduleStatusResponse = {
  success: boolean;
  connected: boolean;
  isConnected: boolean;
  metaUserName?: string;
  selectedPage?: {
    pageId: string;
    pageName: string;
  } | null;
  pages?: Array<{
    id: string;
    name: string;
    instagramBusinessAccountId?: string;
  }>;
  instagram?: {
    connected: boolean;
    id: string;
    username: string;
  };
  counts?: {
    scheduled: number;
    published: number;
    failed: number;
  };
  settingsPath?: string;
};

function withBusiness(
  businessId: string | undefined,
  extra: Record<string, unknown> = {}
) {
  return businessId ? { businessId, ...extra } : { ...extra };
}

export async function getSocialScheduleStatus(businessId?: string) {
  const { data } = await API.get<SocialScheduleStatusResponse>(
    "/social-schedule/status",
    { params: withBusiness(businessId) }
  );
  return data;
}

export async function listSocialScheduledPosts(
  businessId?: string,
  params: {
    status?: string;
    platform?: SocialPlatform;
    contentType?: SocialContentType;
    limit?: number;
  } = {}
) {
  const { data } = await API.get<{
    success: boolean;
    posts: SocialScheduledPost[];
  }>("/social-schedule/posts", {
    params: withBusiness(businessId, params),
  });
  return data.posts || [];
}

export async function createSocialScheduledPost(
  businessId: string | undefined,
  payload: {
    platform: SocialPlatform;
    contentType: SocialContentType;
    caption?: string;
    media?: SocialMediaItem[];
    scheduledAt: string;
    pageId?: string;
    publishNow?: boolean;
  }
) {
  const { data } = await API.post<{
    success: boolean;
    post: SocialScheduledPost;
  }>(
    "/social-schedule/posts",
    { ...payload, businessId },
    { params: withBusiness(businessId) }
  );
  return data.post;
}

export async function createSocialBulkSchedule(
  businessId: string | undefined,
  payload: {
    platform: SocialPlatform;
    contentType: SocialContentType;
    pageId?: string;
    caption?: string;
    captions?: string[];
    media?: SocialMediaItem[];
    startAt?: string;
    scheduledAt?: string;
    count?: number;
    timesPerWeek?: number;
    weekdays?: number[];
    items?: Array<{
      caption?: string;
      media?: SocialMediaItem[];
      scheduledAt: string;
    }>;
  }
) {
  const { data } = await API.post<{
    success: boolean;
    bulkBatchId: string;
    count: number;
    posts: SocialScheduledPost[];
  }>(
    "/social-schedule/bulk",
    { ...payload, businessId },
    { params: withBusiness(businessId) }
  );
  return data;
}

export async function cancelSocialScheduledPost(
  businessId: string | undefined,
  postId: string
) {
  const { data } = await API.post<{
    success: boolean;
    post: SocialScheduledPost;
  }>(
    `/social-schedule/posts/${postId}/cancel`,
    { businessId },
    { params: withBusiness(businessId) }
  );
  return data.post;
}

export async function updateSocialScheduledPost(
  businessId: string | undefined,
  postId: string,
  payload: Partial<{
    caption: string;
    media: SocialMediaItem[];
    scheduledAt: string;
    platform: SocialPlatform;
    contentType: SocialContentType;
  }>
) {
  const { data } = await API.patch<{
    success: boolean;
    post: SocialScheduledPost;
  }>(
    `/social-schedule/posts/${postId}`,
    { ...payload, businessId },
    { params: withBusiness(businessId) }
  );
  return data.post;
}

export async function uploadSocialScheduleMedia(
  businessId: string | undefined,
  file: File,
  kind: "image" | "video" = "image"
) {
  const form = new FormData();
  form.append("file", file);
  form.append("kind", kind);
  if (businessId) form.append("businessId", businessId);

  const { data } = await API.post<{
    success: boolean;
    type: "image" | "video";
    imageHash?: string;
    url?: string;
    videoId?: string;
  }>("/meta-campaigns/media", form, {
    params: businessId ? { businessId } : undefined,
    headers: { "Content-Type": "multipart/form-data" },
  });

  return {
    url: data.url || "",
    type: (data.type || kind) as "image" | "video",
    fileName: file.name,
    mimeType: file.type,
  };
}

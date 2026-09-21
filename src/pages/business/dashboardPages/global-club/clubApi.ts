import API from "../../../../api";

export type ClubStatus = "not_member" | "pending" | "active" | "expired" | "suspended";

export type ClubAuthor = {
  userId: string;
  fullName: string;
  businessName: string;
  country: string;
  businessCategory?: string;
  industry?: string;
  photoUrl?: string;
  logoUrl?: string;
};

export type ClubProfile = ClubAuthor & {
  website?: string;
  description?: string;
  services?: string[];
  marketsOperate?: string[];
  marketsEnter?: string[];
  offer?: string;
  lookingFor?: string;
  interests?: string[];
  collaborationNeeds?: string[];
  socialProfile?: string;
  matchScore?: number;
  matchReasons?: string[];
};

export type ClubMe = {
  status: ClubStatus;
  membership: {
    status: ClubStatus;
    requestedAt?: string | null;
    activatedAt?: string | null;
    expiresAt?: string | null;
    planKey?: string | null;
    billingStatus?: string;
  } | null;
  profile: ClubProfile | null;
  pendingRequest: boolean;
  unreadNotifications: number;
  isAdmin: boolean;
};

export type ClubComment = {
  _id: string;
  text: string;
  createdAt: string;
  author: ClubAuthor;
};

export type ClubPost = {
  _id: string;
  postType: string;
  title?: string;
  text: string;
  imageUrl?: string;
  country?: string;
  industry?: string;
  lookingFor?: string;
  deadline?: string | null;
  category?: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  likedByMe: boolean;
  savedByMe: boolean;
  author: ClubAuthor;
  comments: ClubComment[];
};

export function clubError(error: unknown) {
  const err = error as { response?: { data?: { error?: string } } };
  return err?.response?.data?.error || "Something went wrong. Please try again.";
}

export async function clubGet<T>(path: string, params?: Record<string, string>) {
  const { data } = await API.get<T>(path, { params });
  return data;
}

export async function clubSend<T>(method: "post" | "put" | "delete", path: string, body?: unknown) {
  const { data } = await API.request<T>({ url: path, method, data: body });
  return data;
}

export async function uploadClubImage(file: File) {
  const body = new FormData();
  body.append("file", file);
  const { data } = await API.post("/media/upload", body);
  return String(data?.url || data?.secureUrl || "");
}

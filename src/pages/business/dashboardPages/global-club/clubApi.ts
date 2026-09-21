import API from "../../../../api";
import type { TFunction } from "i18next";

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

const ERROR_CODES: Record<string, string> = {
  "You already have a request waiting for review.": "JOIN_ALREADY_PENDING",
  "You are already a Club member.": "JOIN_ALREADY_MEMBER",
  "Your Club membership is suspended.": "JOIN_SUSPENDED",
  "Please complete the required application fields.": "JOIN_FIELDS_REQUIRED",
  "Login required.": "LOGIN_REQUIRED",
  "Club member not found.": "MEMBER_NOT_FOUND",
  "Post not found.": "POST_NOT_FOUND",
  "Club request failed.": "FAILED",
  "Active Global Business Club membership is required.": "CLUB_MEMBERSHIP_REQUIRED",
};

export function clubError(error: unknown, t?: TFunction) {
  const data = (error as { response?: { data?: { error?: string; code?: string } } })?.response?.data;
  const code = data?.code || (data?.error ? ERROR_CODES[data.error] : undefined);
  if (t && code) {
    const translated = t(`club.errors.${code}`);
    if (translated !== `club.errors.${code}`) return translated;
  }
  if (t) return t("club.errors.generic");
  return data?.error || "Something went wrong. Please try again.";
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

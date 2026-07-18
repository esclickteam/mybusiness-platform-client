import { useOutletContext } from "react-router-dom";
import type { Socket } from "socket.io-client";

export type CollabProfileData = {
  businessName: string;
  category: string;
  area: string;
  about: string;
  collabPref: string;
  contact: string;
  phone: string;
  email: string;
};

export type CollabOutletContext = {
  profileData: CollabProfileData | null;
  profileImage: string | null;
  loadingProfile: boolean;
  socket: Socket | null;
  userBusinessId: string | null;
};

export function useCollabOutletContext() {
  return useOutletContext<CollabOutletContext>();
}

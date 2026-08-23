import API from "../api";

export async function resolveAdminSupportChat(params: {
  sourceLeadId?: string;
  phone?: string;
}) {
  const { data } = await API.get("/support-chat/admin/by-lead", { params });
  return data as {
    success: boolean;
    conversationId: string | null;
    conversation?: Record<string, unknown> | null;
  };
}

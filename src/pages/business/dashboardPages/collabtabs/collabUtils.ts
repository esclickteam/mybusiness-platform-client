import API from "../../../../api";

export function resolveBusinessId(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value !== null && "_id" in value) {
    const id = (value as { _id?: unknown })._id;
    return id ? String(id) : null;
  }

  return String(value);
}

export async function fetchMyBusinessId(): Promise<string | null> {
  try {
    const [myRes, chatMeRes] = await Promise.all([
      API.get("/business/my"),
      API.get("/business-chat/me").catch(() => ({ data: {} })),
    ]);

    return (
      resolveBusinessId(myRes.data?.business?._id) ||
      resolveBusinessId(myRes.data?._id) ||
      resolveBusinessId(chatMeRes.data?.myBusinessId) ||
      null
    );
  } catch {
    return null;
  }
}

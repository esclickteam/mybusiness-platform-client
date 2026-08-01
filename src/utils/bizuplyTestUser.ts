/**
 * Internal BizUply test account — can see WhatsApp + Meta Campaigns nav
 * while those modules stay hidden for all other business users.
 */
export const BIZUPLY_TEST_USER_EMAIL = "test@bizuply.com";
export const BIZUPLY_TEST_USER_ID = "68a452720016d081ad1d6e325";

export function isBizuplyTestUser(user?: {
  email?: string | null;
  _id?: string | null;
  id?: string | null;
  userId?: string | null;
} | null): boolean {
  if (!user) return false;
  const email = String(user.email || "")
    .trim()
    .toLowerCase();
  if (email === BIZUPLY_TEST_USER_EMAIL) return true;

  const id = String(user._id || user.id || user.userId || "").trim();
  return id === BIZUPLY_TEST_USER_ID;
}

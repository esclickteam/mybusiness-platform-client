import { expect, test, type Page } from "playwright/test";

const previewUrl =
  "http://127.0.0.1:5173/meta-lead-ads-banner-preview?lang=he";

async function openPreview(page: Page) {
  await page.goto(previewUrl);
  const cookies = page.getByRole("button", { name: "אישור כל העוגיות" });
  if (await cookies.isVisible().catch(() => false)) {
    await cookies.click();
  }
}

test("Hebrew reconnect banner tells the user to reconnect Meta", async ({ page }) => {
  await openPreview(page);
  const banner = page.getByTestId("meta-lead-reconnect-banner").first();
  await expect(banner).toBeVisible();
  await expect(banner).toContainText("החיבור ל-Meta Lead Ads נותק");
  await expect(banner).toContainText("תחברו את Meta מחדש");
  await expect(banner).toContainText("5 לידים ממתינים");
  const root = page.locator("[dir='rtl']").first();
  await expect(root).toBeVisible();
  const box = await banner.boundingBox();
  expect(box && box.width).toBeGreaterThan(200);
});

test("a healthy connection with a waiting queue is not shown as finished", async ({ page }) => {
  await openPreview(page);
  const pending = page.getByTestId("meta-lead-recovery-pending");
  await expect(pending).toBeVisible();
  await expect(pending).toContainText("החיבור ל-Meta תקין");
  await expect(pending).toContainText("השחזור עדיין לא הסתיים");
  await expect(pending).toContainText("3 לידים עדיין בתור");
  await expect(page.getByText("החיבור הושלם")).toHaveCount(0);
});

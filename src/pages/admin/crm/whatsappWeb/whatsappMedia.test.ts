import { describe, expect, it } from "vitest";
import { validateWhatsAppFile, inferMessageTypeFromFile } from "./whatsappMedia";

describe("whatsappMedia validation", () => {
  it("accepts png image", () => {
    const file = new File([new Uint8Array([1, 2, 3])], "photo.png", {
      type: "image/png",
    });
    expect(inferMessageTypeFromFile(file)).toBe("image");
    expect(validateWhatsAppFile(file)).toBeNull();
  });

  it("rejects unsupported mime", () => {
    const file = new File([new Uint8Array([1])], "archive.zip", {
      type: "application/zip",
    });
    expect(validateWhatsAppFile(file)).toMatch(/נתמך/);
  });
});

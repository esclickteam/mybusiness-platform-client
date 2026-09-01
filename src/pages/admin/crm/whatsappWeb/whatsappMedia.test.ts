import { describe, expect, it } from "vitest";
import { validateWhatsAppFile, inferMessageTypeFromFile, isPdfDocument } from "./whatsappMedia";

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

  it("detects pdf documents by mime or filename", () => {
    expect(isPdfDocument("application/pdf", "x")).toBe(true);
    expect(isPdfDocument("application/octet-stream", "contract.pdf")).toBe(true);
    expect(isPdfDocument("text/plain", "notes.txt")).toBe(false);
  });
});

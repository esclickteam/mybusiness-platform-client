import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildTemplateSubmitPayload,
  contentChangeKeys,
  getTemplateEditPolicy,
  isResumableHeaderHandle,
  lifecycleBucket,
  validateTemplateSampleFile,
} from "./whatsappTemplateEditorModel";

const HANDLE = "4::aW1hZ2UvcG5n:ARbSampleHandle";

describe("whatsapp template editor model", () => {
  it("builds an image submission only when a resumable handle exists", () => {
    const payload = buildTemplateSubmitPayload({
      name: "event_invite",
      language: "he",
      metaCategory: "MARKETING",
      headerType: "image",
      headerMediaHandle: HANDLE,
      headerMediaUrl: "https://cdn.example.com/invite.jpg",
      headerMediaFileName: "invite.jpg",
      body: "שלום {{1}}",
      exampleValues: { "1": "דנה" },
      buttons: [{ type: "quick_reply", text: "אישור" }],
    });
    expect(payload.headerType).toBe("image");
    expect(payload.headerMediaHandle).toBe(HANDLE);
    expect(payload.headerMediaUrl).toBe("https://cdn.example.com/invite.jpg");
    expect(isResumableHeaderHandle("110718360123456")).toBe(false);
    expect(() =>
      buildTemplateSubmitPayload({
        name: "event_invite",
        language: "he",
        metaCategory: "MARKETING",
        headerType: "image",
        headerMediaHandle: "110718360123456",
        body: "שלום",
      })
    ).toThrow(/MEDIA_SAMPLE_REQUIRED/);
  });

  it("keeps a draft save possible before the upload finishes", () => {
    const draft = buildTemplateSubmitPayload(
      {
        name: "event_invite",
        language: "he",
        metaCategory: "MARKETING",
        headerType: "video",
        body: "סרטון",
        templateId: "local-1",
      },
      { requireMedia: false }
    );
    expect(draft.templateId).toBe("local-1");
    expect(draft.headerType).toBe("video");
  });

  it("validates image, video and document files", () => {
    expect(
      validateTemplateSampleFile(
        { name: "a.jpg", type: "image/jpeg", size: 1000 },
        "image"
      )
    ).toBeNull();
    expect(
      validateTemplateSampleFile(
        { name: "a.mp4", type: "video/mp4", size: 1000 },
        "video"
      )
    ).toBeNull();
    expect(
      validateTemplateSampleFile(
        { name: "a.pdf", type: "application/pdf", size: 1000 },
        "document"
      )
    ).toBeNull();
    expect(
      validateTemplateSampleFile(
        { name: "a.gif", type: "image/gif", size: 1000 },
        "image"
      )
    ).toBe("mime");
    expect(
      validateTemplateSampleFile(
        { name: "a.png", type: "image/png", size: 6 * 1024 * 1024 },
        "image"
      )
    ).toBe("too-large");
  });

  it("locks pending templates and allows approved content edits", () => {
    expect(
      getTemplateEditPolicy({ metaStatus: "PENDING", metaTemplateId: "1" }).canSubmitToMeta
    ).toBe(false);
    const approved = getTemplateEditPolicy({
      metaStatus: "APPROVED",
      metaTemplateId: "1",
    });
    expect(approved.canEditContent).toBe(true);
    expect(approved.canEditName).toBe(false);
    expect(approved.canSaveLocalDraft).toBe(false);
  });

  it("separates local, rejected, paused and sync-error states per business record", () => {
    expect(lifecycleBucket({ metaStatus: "LOCAL" })).toBe("local");
    expect(lifecycleBucket({ metaStatus: "REJECTED", metaTemplateId: "1" })).toBe(
      "rejected"
    );
    expect(lifecycleBucket({ metaStatus: "PAUSED", metaTemplateId: "1" })).toBe("paused");
    expect(
      lifecycleBucket({
        metaStatus: "APPROVED",
        metaTemplateId: "1",
        lastSyncError: "timeout",
      })
    ).toBe("sync_error");
  });

  it("lists content changes for the review preview", () => {
    const original = {
      name: "a",
      language: "he",
      metaCategory: "MARKETING",
      headerType: "image",
      headerText: "",
      headerMediaHandle: HANDLE,
      headerMediaUrl: "https://cdn.example.com/a.jpg",
      body: "שלום",
      footer: "",
      buttons: [],
      exampleValues: {},
    };
    expect(
      contentChangeKeys(
        { ...original, body: "שלום {{1}}", exampleValues: { "1": "דנה" } },
        original
      )
    ).toEqual(["body", "exampleValues"]);
  });

  it("stacks the template editor on a phone-width layout", () => {
    const css = readFileSync(
      resolve(__dirname, "whatsappMetaTemplateWizard.css"),
      "utf8"
    );
    expect(css).toMatch(/@media \(max-width: 720px\)/);
    expect(css).toMatch(/\.wa-meta-dropzone/);
    expect(css).toMatch(/flex-direction:\s*column/);
  });
});

import { readVisualInsertedSections } from "./visualData";

describe("readVisualInsertedSections", () => {
  it("fills missing id from the map key so stub portal pages can mount", () => {
    const sections = readVisualInsertedSections({
      __insertedSections: {
        "section-portal-login-01": {
          libraryId: "section-portal-login-01",
        },
      },
    });

    expect(sections["section-portal-login-01"].id).toBe("section-portal-login-01");
    expect(sections["section-portal-login-01"].libraryId).toBe("section-portal-login-01");
  });
});
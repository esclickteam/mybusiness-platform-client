import { describe, expect, it } from "vitest";
import { leadFormDuplicateSeedFromMeta } from "./leadFormDuplicateSeed";

describe("leadFormDuplicateSeedFromMeta", () => {
  it("copies a website thank-you form without calling Meta", () => {
    const seed = leadFormDuplicateSeedFromMeta({
      id: "1503689644979003",
      name: "טופס לידים",
      locale: "he_IL",
      privacyPolicyUrl: "https://evently360.com/privacy-policy",
      questions: [
        { type: "FULL_NAME", key: "full_name" },
        { type: "PHONE", key: "phone" },
        { type: "CUSTOM", key: "interest", label: "במה אתם מתעניינים?" },
        {
          type: "CUSTOM",
          key: "guests",
          label: "כמה מוזמנים?",
          options: [{ key: "small", value: "עד 100" }, { key: "large", value: "מעל 100" }],
          dependentConditionalQuestions: [{ name: "מעל 100", fieldKey: "interest" }],
        },
      ],
      contextCard: { title: "כותרת", content: "תיאור" },
      thankYouPage: {
        title: "תודה! 💍 הפרטים שלכם התקבלו",
        body: "נחזור אליכם",
        buttonText: "בואו להכיר את Evently360",
        buttonType: "VIEW_WEBSITE",
        websiteUrl: "https://evently360.com/",
      },
      followUpActionUrl: "",
    });

    expect(seed.sourceFormId).toBe("1503689644979003");
    expect(seed.name).toBe("טופס לידים - עותק");
    expect(seed.introTitle).toBe("כותרת");
    expect(seed.privacyUrl).toBe("https://evently360.com/privacy-policy");
    expect(seed.additionalAction).toBe("website");
    expect(seed.thankYouLink).toBe("https://evently360.com/");
    expect(seed.thankYouButton).toBe("בואו להכיר את Evently360");
    expect(seed.contactTypes).toEqual(["FULL_NAME", "PHONE"]);
    expect(seed.customQuestions.map((question) => question.label)).toEqual([
      "במה אתם מתעניינים?",
      "כמה מוזמנים?",
    ]);
    expect(seed.customQuestions[0].answerType).toBe("short_answer");
    expect(seed.customQuestions[0].options).toEqual([]);
    expect(seed.customQuestions[1].answerType).toBe("multiple_choice");
    expect(seed.customQuestions[1].options).toEqual(["עד 100", "מעל 100"]);
    expect(seed.customQuestions[0].dependentOnQuestionId).toBe("guests");
    expect(seed.customQuestions[0].dependentOnOption).toBe("מעל 100");
    expect(seed.locale).toBe("he_IL");
  });
});

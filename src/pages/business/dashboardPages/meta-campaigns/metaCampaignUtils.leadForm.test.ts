import { describe, expect, it } from "vitest";
import {
  buildMetaLeadFormQuestionsPayload,
  createLeadFormCustomQuestion,
} from "./metaCampaignUtils";

describe("buildMetaLeadFormQuestionsPayload conditionals", () => {
  it("attaches dependent_conditional_questions to the parent option", () => {
    const parent = createLeadFormCustomQuestion({
      id: "parent",
      label: "Service",
      key: "service",
      answerType: "multiple_choice",
      options: ["Hair", "Nails"],
    });
    const child = createLeadFormCustomQuestion({
      id: "child",
      label: "Which style",
      key: "style",
      answerType: "short_answer",
      dependentOnQuestionId: "parent",
      dependentOnOption: "Hair",
    });

    const payload = buildMetaLeadFormQuestionsPayload({
      contactTypes: ["EMAIL"],
      customQuestions: [parent, child],
    });

    const service = payload.find((row) => "key" in row && row.key === "service") as {
      dependentConditionalQuestions?: Array<{ name: string; fieldKey: string }>;
    };
    const style = payload.find((row) => "key" in row && row.key === "style") as {
      dependentConditionalQuestions?: unknown;
    };
    expect(service.dependentConditionalQuestions).toEqual([
      { name: "Hair", fieldKey: "style" },
    ]);
    expect(style.dependentConditionalQuestions).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";
import { homeButtonLabel } from "./homeCopy";

describe("homepage buttons outside Hebrew", () => {
  it("keeps Arabic, Spanish, and Portuguese buttons out of English", () => {
    expect(homeButtonLabel("ar", "See the system")).toBe("شاهدوا النظام");
    expect(homeButtonLabel("ar", "Start free")).toBe("ابدأوا مجانًا");
    expect(homeButtonLabel("es", "Skip to content")).toBe("Saltar al contenido");
    expect(homeButtonLabel("pt-BR", "Watch the demo")).toBe("Ver a demonstração");
  });

  it("leaves English and unknown sentences unchanged", () => {
    expect(homeButtonLabel("en", "See the system")).toBe("See the system");
    expect(homeButtonLabel("ar", "A sentence that is not a button.")).toBe("A sentence that is not a button.");
  });
});

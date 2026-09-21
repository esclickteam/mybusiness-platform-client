import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import i18n from "../../../../i18n/i18n";
import ClubHomePage from "./ClubHomePage";

vi.mock("./GlobalBusinessClubPage", () => ({
  useClub: () => ({
    me: { status: "not_member" },
    base: "/business/demo/dashboard/global-club",
    isMember: false,
  }),
}));

describe("Club Overview landing languages", () => {
  it.each([
    ["en", "Connect. Collaborate. Grow.", "Request to Join", "Business advice and feedback"],
    ["he", "התחברו. שתפו פעולה. צמחו.", "בקשה להצטרף", "ייעוץ עסקי ומשוב"],
    ["es", "Conecta. Colabora. Crece.", "Solicitar unirse", "Consejo y feedback de negocios"],
    ["pt-BR", "Conecte. Colabore. Cresça.", "Pedir para entrar", "Conselho e feedback de negócios"],
    ["ar", "تواصل. تعاون. انمُ.", "طلب الانضمام", "نصائح وملاحظات تجارية"],
  ])("renders %s chrome", async (lng, title, cta, advice) => {
    await i18n.changeLanguage(lng);
    render(
      <MemoryRouter>
        <ClubHomePage />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(screen.getByTestId("club-request-join")).toHaveTextContent(cta);
    expect(screen.getByText(advice)).toBeInTheDocument();
  });
});

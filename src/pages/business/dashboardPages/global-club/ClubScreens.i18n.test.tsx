import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import i18n from "../../../../i18n/i18n";
import ClubAskPage from "./ClubAskPage";
import ClubCollaborationsPage from "./ClubCollaborationsPage";
import ClubConnectionsPage from "./ClubConnectionsPage";
import ClubDirectoryPage from "./ClubDirectoryPage";
import ClubFeedPage from "./ClubFeedPage";
import ClubHotSeatPage from "./ClubHotSeatPage";
import ClubJoinPage from "./ClubJoinPage";
import ClubMessagesPage from "./ClubMessagesPage";
import ClubOpportunitiesPage from "./ClubOpportunitiesPage";
import ClubPollsPage from "./ClubPollsPage";

vi.mock("./GlobalBusinessClubPage", () => ({
  useClub: () => ({
    me: { status: "not_member" },
    base: "/business/demo/dashboard/global-club",
    isMember: false,
    refresh: async () => {},
  }),
}));

const GUEST_SCREENS = [
  ["feed", ClubFeedPage, "club.feed.membersOnlyTitle"],
  ["directory", ClubDirectoryPage, "club.directory.membersOnlyTitle"],
  ["collaborations", ClubCollaborationsPage, "club.collaborations.membersOnlyTitle"],
  ["ask", ClubAskPage, "club.ask.membersOnlyTitle"],
  ["polls", ClubPollsPage, "club.polls.membersOnlyTitle"],
  ["hot-seat", ClubHotSeatPage, "club.hotSeat.membersOnlyTitle"],
  ["opportunities", ClubOpportunitiesPage, "club.opportunities.membersOnlyTitle"],
  ["connections", ClubConnectionsPage, "club.connections.membersOnlyTitle"],
  ["messages", ClubMessagesPage, "club.messages.membersOnlyTitle"],
] as const;

describe("Club screens follow the active Bizuply language", () => {
  it.each(["en", "he", "es", "pt-BR", "ar"])("join form chrome is translated in %s", async (lng) => {
    await i18n.changeLanguage(lng);
    render(
      <MemoryRouter>
        <ClubJoinPage />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: i18n.t("club.join.title") })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: i18n.t("club.join.submit") })).toBeInTheDocument();
    if (lng !== "en") {
      expect(screen.queryByText("Request to Join")).not.toBeInTheDocument();
    }
  });

  it.each(
    GUEST_SCREENS.flatMap(([name, Page, key]) =>
      (["en", "he", "es", "pt-BR", "ar"] as const).map((lng) => ({ name, Page, key, lng }))
    )
  )("$name empty gate is translated in $lng", async ({ Page, key, lng }) => {
    await i18n.changeLanguage(lng);
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>
    );
    expect(screen.getByText(i18n.t(key))).toBeInTheDocument();
    if (lng !== "en") {
      expect(screen.queryByText("Members only")).not.toBeInTheDocument();
    }
  });
});

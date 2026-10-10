import React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import i18n from "../../../i18n/i18n";
import AdminShell from "./AdminShell";

vi.mock("../../../api", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { unread: 0 } }),
  },
}));

vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { name: "דנה כהן", email: "dana@bizuply.com" },
    logout: vi.fn(),
    socket: null,
  }),
}));

vi.mock("../../../components/AdminNotifications", () => ({
  default: () => <button type="button">התראות</button>,
}));

async function renderShell(path = "/admin/users") {
  let view: ReturnType<typeof render> | undefined;
  await act(async () => {
    view = render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/admin" element={<AdminShell />}>
            <Route path="users" element={<div>מסך משתמשים</div>} />
            <Route path="dashboard" element={<div>מסך דשבורד</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  });
  return view!;
}

describe("AdminShell", () => {
  it("shows one top bar and grouped sidebar instead of a logout button", async () => {
    await i18n.changeLanguage("he");
    await renderShell();

    expect(document.querySelector(".biz-admin")).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("searchbox", { name: "חיפוש במסכי הניהול" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "התראות" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Bizuply" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "התנתקות" })).not.toBeInTheDocument();
    expect(screen.getAllByText("משתמשים").length).toBeGreaterThan(0);
    expect(screen.getByText("מסך משתמשים")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "כל המשתמשים" })).toBeInTheDocument();
  });

  it("keeps logout inside the profile menu and toggles a nav group", async () => {
    await renderShell();

    fireEvent.click(screen.getByRole("button", { name: /דנה כהן/ }));
    expect(screen.getByRole("button", { name: "התנתקות" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "סופטפון" })).toBeInTheDocument();

    const usersGroup = screen.getByRole("button", { name: "משתמשים" });
    expect(usersGroup).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(usersGroup);
    expect(usersGroup).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "כל המשתמשים" })).not.toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BizuplyLoader, { BizuplyLoadingState } from "./BizuplyLoader";

describe("BizuplyLoader", () => {
  it("renders without crashing and shows a status role", () => {
    render(<BizuplyLoader />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders an optional label", () => {
    render(<BizuplyLoader label="טוען נתונים..." />);
    expect(screen.getByText("טוען נתונים...")).toBeInTheDocument();
  });
});

describe("BizuplyLoadingState", () => {
  it("renders the loader used across dashboard loading states", () => {
    render(<BizuplyLoadingState label="Loading" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

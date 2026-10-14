import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import AdminDataTable from "./AdminDataTable";
import { AdminEllipsis, AdminPhone } from "./adminCells";

vi.mock("../../../utils/adminSoftphoneStore", () => ({
  requestSoftphoneDial: vi.fn(),
}));

type Row = { id: string; name: string; email: string };

const rows: Row[] = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: `עסק ${index + 1}`,
  email: `owner-${index + 1}@example.com`,
}));

function table(extra: Partial<React.ComponentProps<typeof AdminDataTable<Row>>> = {}) {
  return render(
    <AdminDataTable
      rows={rows}
      rowKey={(row) => row.id}
      columns={[
        { key: "name", header: "שם", render: (row) => row.name },
        {
          key: "email",
          header: "אימייל",
          render: (row) => <AdminEllipsis dir="ltr">{row.email}</AdminEllipsis>,
        },
      ]}
      defaultPageSize={10}
      pageSizeOptions={[10, 20]}
      emptyTitle="אין נתונים"
      {...extra}
    />
  );
}

describe("AdminDataTable", () => {
  it("renders a compact page of rows and the total", () => {
    table();
    expect(screen.getAllByText("עסק 1").length).toBeGreaterThan(0);
    expect(screen.queryByText("עסק 12")).toBeNull();
    expect(screen.getByText("1–10 מתוך 12")).toBeTruthy();
  });

  it("paginates and changes page size", () => {
    table();
    fireEvent.click(screen.getByRole("button", { name: "הבא" }));
    expect(screen.getAllByText("עסק 12").length).toBeGreaterThan(0);
    expect(screen.queryByText("עסק 1")).toBeNull();
    fireEvent.change(screen.getByLabelText("מספר שורות בעמוד"), { target: { value: "20" } });
    expect(screen.getAllByText("עסק 1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("עסק 12").length).toBeGreaterThan(0);
  });

  it("keeps the shell when loading, empty, or failed", () => {
    const { rerender } = table({ rows: [], loading: true });
    expect(document.querySelector(".biz-table-skeleton")).toBeTruthy();

    rerender(
      <AdminDataTable
        rows={[]}
        rowKey={(row: Row) => row.id}
        columns={[{ key: "name", header: "שם", render: (row: Row) => row.name }]}
        error="לא ניתן לטעון"
        onRetry={() => undefined}
        emptyTitle="אין נתונים"
      />
    );
    expect(screen.getByRole("alert").textContent).toContain("לא ניתן לטעון");
    expect(screen.getByRole("button", { name: "נסו שוב" })).toBeTruthy();
  });

  it("opens the overflow menu without removing the primary action", () => {
    table({
      rowActions: () => (
        <>
          <button type="button">כניסה</button>
          <span>menu-slot</span>
        </>
      ),
    });
    expect(screen.getAllByRole("button", { name: "כניסה" }).length).toBeGreaterThan(0);
  });

  it("truncates long values and dials from the phone cell", async () => {
    const { requestSoftphoneDial } = await import("../../../utils/adminSoftphoneStore");
    render(<AdminPhone phone="050-1234567" name="דנה" source="business" refId="1" />);
    fireEvent.click(screen.getByRole("button", { name: "חייג אל דנה" }));
    expect(requestSoftphoneDial).toHaveBeenCalledWith({
      phone: "050-1234567",
      name: "דנה",
      source: "business",
      refId: "1",
    });
    render(<AdminEllipsis>very-long-email-address@example.com</AdminEllipsis>);
    expect(screen.getByTitle("very-long-email-address@example.com").className).toContain("biz-ellipsis");
  });
});

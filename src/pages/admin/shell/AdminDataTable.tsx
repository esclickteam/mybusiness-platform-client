import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import AdminPager, { paginateRows } from "./AdminPager";

export type AdminTableColumn<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  numeric?: boolean;
  secondary?: boolean;
  width?: string;
};

type AdminDataTableProps<T> = {
  tableId?: string;
  rows: T[];
  columns: AdminTableColumn<T>[];
  rowKey: (row: T) => string;
  dir?: "rtl" | "ltr";
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyAction?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  toolbar?: ReactNode;
  page?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  total?: number;
  clientPagination?: boolean;
  resetKey?: string | number;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
  onToggleAll?: (checked: boolean, visibleKeys: string[]) => void;
  bulkBar?: ReactNode;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => ReactNode;
  actionsHeader?: string;
  mobileTitle?: (row: T) => ReactNode;
  mobileMeta?: (row: T) => ReactNode;
  countLabel?: string;
};

const PAGE_SIZES = [10, 20, 50];

function storageKey(tableId: string) {
  return `biz-admin-table:${tableId}:pageSize`;
}

export function readStoredPageSize(tableId: string, options: number[], fallback: number) {
  try {
    const value = Number(window.localStorage.getItem(storageKey(tableId)));
    if (options.includes(value)) return value;
  } catch {
    /* display preference only */
  }
  return fallback;
}

function storePageSize(tableId: string, size: number) {
  try {
    window.localStorage.setItem(storageKey(tableId), String(size));
  } catch {
    /* display preference only */
  }
}

export default function AdminDataTable<T>({
  tableId,
  rows,
  columns,
  rowKey,
  dir = "rtl",
  loading = false,
  error,
  onRetry,
  emptyTitle = "אין נתונים להצגה",
  emptyAction,
  searchValue,
  onSearchChange,
  searchPlaceholder = "חיפוש",
  filters,
  toolbar,
  page,
  onPageChange,
  pageSize,
  defaultPageSize = 20,
  pageSizeOptions = PAGE_SIZES,
  onPageSizeChange,
  total,
  clientPagination = true,
  resetKey,
  sortKey,
  sortDir,
  onSort,
  selectable = false,
  selectedKeys = [],
  onSelectedKeysChange,
  onToggleAll,
  bulkBar,
  onRowClick,
  rowActions,
  actionsHeader = "פעולות",
  mobileTitle,
  mobileMeta,
  countLabel,
}: AdminDataTableProps<T>) {
  const [innerPage, setInnerPage] = useState(page || 1);
  const [innerPageSize, setInnerPageSize] = useState(() =>
    tableId ? readStoredPageSize(tableId, pageSizeOptions, defaultPageSize) : defaultPageSize
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const activePageSize = pageSize || innerPageSize;
  const serverMode = !clientPagination;
  const currentPage = serverMode ? page || 1 : innerPage;

  useEffect(() => {
    if (!serverMode) setInnerPage(1);
  }, [resetKey, serverMode]);

  const view = useMemo(() => {
    if (serverMode) {
      const count = total ?? rows.length;
      const pageCount = Math.max(1, Math.ceil(count / activePageSize));
      const start = count ? (currentPage - 1) * activePageSize : 0;
      return {
        rows,
        page: currentPage,
        pageCount,
        from: count ? start + 1 : 0,
        to: Math.min(start + rows.length, count),
        total: count,
      };
    }
    return paginateRows(rows, currentPage, activePageSize);
  }, [serverMode, total, rows, activePageSize, currentPage]);

  function changePage(next: number) {
    if (serverMode) onPageChange?.(next);
    else setInnerPage(next);
  }

  function changePageSize(next: number) {
    if (tableId) storePageSize(tableId, next);
    setInnerPageSize(next);
    onPageSizeChange?.(next);
    if (serverMode) onPageChange?.(1);
    else setInnerPage(1);
  }

  const visibleKeys = view.rows.map(rowKey);
  const allSelected = visibleKeys.length > 0 && visibleKeys.every((key) => selectedKeys.includes(key));

  function toggleAll(checked: boolean) {
    if (onToggleAll) {
      onToggleAll(checked, visibleKeys);
      return;
    }
    if (!onSelectedKeysChange) return;
    if (checked) {
      onSelectedKeysChange(Array.from(new Set([...selectedKeys, ...visibleKeys])));
    } else {
      onSelectedKeysChange(selectedKeys.filter((key) => !visibleKeys.includes(key)));
    }
  }

  function toggleOne(key: string, checked: boolean) {
    if (!onSelectedKeysChange) return;
    onSelectedKeysChange(
      checked ? Array.from(new Set([...selectedKeys, key])) : selectedKeys.filter((item) => item !== key)
    );
  }

  const showToolbar = Boolean(onSearchChange || filters || toolbar || countLabel);
  const showSkeleton = loading && rows.length === 0;
  const showEmpty = !loading && !error && rows.length === 0;
  const colSpan = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);

  return (
    <section className="biz-table-shell" dir={dir}>
      {showToolbar ? (
        <div className="biz-table-toolbar">
          {onSearchChange ? (
            <input
              type="search"
              className="biz-input biz-table-search"
              value={searchValue || ""}
              placeholder={searchPlaceholder}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          ) : null}
          {filters}
          {toolbar}
          {countLabel ? <span className="biz-table-count">{countLabel}</span> : null}
        </div>
      ) : null}

      {selectedKeys.length && bulkBar ? <div className="biz-table-bulk">{bulkBar}</div> : null}

      {error ? (
        <div className="biz-table-error" role="alert">
          <p>{error}</p>
          {onRetry ? (
            <button type="button" className="biz-btn biz-btn-secondary biz-btn-row" onClick={onRetry}>
              נסו שוב
            </button>
          ) : null}
        </div>
      ) : null}

      {showSkeleton ? (
        <div className="biz-table-skeleton" aria-busy="true" aria-live="polite">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="biz-table-skeleton-row" />
          ))}
        </div>
      ) : null}

      {showEmpty ? (
        <div className="biz-table-empty">
          <p>{emptyTitle}</p>
          {emptyAction}
        </div>
      ) : null}

      {!showSkeleton && !showEmpty ? (
        <>
          <div className="biz-mobile-list">
            {view.rows.map((row) => {
              const key = rowKey(row);
              const open = Boolean(expanded[key]);
              return (
                <article key={key} className="biz-mobile-row">
                  <div className="biz-mobile-row-head">
                    <button
                      type="button"
                      className="biz-mobile-row-main"
                      onClick={() => onRowClick?.(row)}
                    >
                      <div className="biz-mobile-row-title">
                        {mobileTitle ? mobileTitle(row) : columns[0]?.render(row)}
                      </div>
                      {mobileMeta ? <div className="biz-mobile-row-meta">{mobileMeta(row)}</div> : null}
                    </button>
                    {rowActions ? <div className="biz-mobile-row-actions">{rowActions(row)}</div> : null}
                  </div>
                  {open ? (
                    <dl className="biz-mobile-details">
                      {columns.slice(mobileTitle ? 0 : 1).map((column) => (
                        <div key={column.key}>
                          <dt>{column.header}</dt>
                          <dd>{column.render(row)}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  <button
                    type="button"
                    className="biz-mobile-more"
                    aria-expanded={open}
                    onClick={() => setExpanded((current) => ({ ...current, [key]: !current[key] }))}
                  >
                    {open ? "הסתר פרטים" : "הצג פרטים"}
                  </button>
                </article>
              );
            })}
          </div>

          <div className="biz-table-scroll">
            <table className="biz-data-table">
              <thead>
                <tr>
                  {selectable ? (
                    <th className="biz-check">
                      <input
                        type="checkbox"
                        aria-label="בחירת כל השורות בעמוד"
                        checked={allSelected}
                        onChange={(event) => toggleAll(event.target.checked)}
                      />
                    </th>
                  ) : null}
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={[
                        column.numeric ? "is-numeric" : "",
                        column.secondary ? "biz-col-secondary" : "",
                      ].join(" ")}
                      style={column.width ? { width: column.width } : undefined}
                    >
                      {column.sortable && onSort ? (
                        <button type="button" className="biz-sort" onClick={() => onSort(column.key)}>
                          {column.header}
                          {sortKey === column.key ? (
                            sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />
                          ) : null}
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  ))}
                  {rowActions ? <th className="biz-actions">{actionsHeader}</th> : null}
                </tr>
              </thead>
              <tbody>
                {view.rows.map((row) => {
                  const key = rowKey(row);
                  return (
                    <tr
                      key={key}
                      className={onRowClick ? "is-clickable" : undefined}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {selectable ? (
                        <td className="biz-check" onClick={(event) => event.stopPropagation()}>
                          <input
                            type="checkbox"
                            aria-label="בחירת שורה"
                            checked={selectedKeys.includes(key)}
                            onChange={(event) => toggleOne(key, event.target.checked)}
                          />
                        </td>
                      ) : null}
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={[
                            column.numeric ? "is-numeric" : "",
                            column.secondary ? "biz-col-secondary" : "",
                          ].join(" ")}
                        >
                          {column.render(row)}
                        </td>
                      ))}
                      {rowActions ? (
                        <td className="biz-actions" onClick={(event) => event.stopPropagation()}>
                          {rowActions(row)}
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
                {!view.rows.length ? (
                  <tr>
                    <td colSpan={colSpan} className="biz-table-empty">
                      {emptyTitle}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      {!showSkeleton && view.total > 0 ? (
        <AdminPager
          page={view.page}
          pageCount={view.pageCount}
          from={view.from}
          to={view.to}
          total={view.total}
          pageSize={pageSizeOptions.length ? activePageSize : undefined}
          pageSizeOptions={pageSizeOptions}
          onPage={changePage}
          onPageSize={pageSizeOptions.length ? changePageSize : undefined}
        />
      ) : null}
    </section>
  );
}

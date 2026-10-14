type AdminPagerProps = {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPage: (page: number) => void;
  onPageSize?: (size: number) => void;
};

export function paginateRows<T>(rows: T[], page: number, pageSize: number) {
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const start = (safePage - 1) * pageSize;

  return {
    page: safePage,
    pageCount,
    rows: rows.slice(start, start + pageSize),
    from: total ? start + 1 : 0,
    to: Math.min(start + pageSize, total),
    total,
  };
}

export default function AdminPager({
  page,
  pageCount,
  from,
  to,
  total,
  pageSize,
  pageSizeOptions,
  onPage,
  onPageSize,
}: AdminPagerProps) {
  if (total === 0) return null;

  return (
    <div className="biz-pager">
      <span>
        {from}–{to} מתוך {total}
      </span>
      <div className="biz-pager-controls">
        {onPageSize && pageSize && pageSizeOptions?.length ? (
          <label className="biz-page-size">
            <span>שורות</span>
            <select
              aria-label="מספר שורות בעמוד"
              value={pageSize}
              onChange={(event) => onPageSize(Number(event.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          הקודם
        </button>
        <span>
          {page} / {pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
        >
          הבא
        </button>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';

export function usePagination({ totalItems = 0, pageSize = 10, initialPage = 1 } = {}) {
  const [page, setPage] = useState(initialPage);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const safePage = Math.min(page, totalPages);
  const range = useMemo(() => ({
    start: (safePage - 1) * pageSize,
    end: safePage * pageSize,
  }), [safePage, pageSize]);

  return {
    page: safePage,
    totalPages,
    pageSize,
    range,
    nextPage: () => setPage((current) => Math.min(current + 1, totalPages)),
    prevPage: () => setPage((current) => Math.max(current - 1, 1)),
    goToPage: (target) => setPage(Math.min(Math.max(1, target), totalPages)),
  };
}

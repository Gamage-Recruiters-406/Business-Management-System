import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const buildPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    // Always show 2 pages on each side of current, plus first and last
    const left = Math.max(2, currentPage - 2);
    const right = Math.min(totalPages - 1, currentPage + 2);
    const middle = [];
    for (let i = left; i <= right; i++) middle.push(i);

    const result = [1];
    if (left > 2) result.push("…");
    result.push(...middle);
    if (right < totalPages - 1) result.push("…");
    result.push(totalPages);
    return result;
  };

  const pages = buildPages();

  return (
    <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-slate-500 order-2 sm:order-1">
        Showing{" "}
        <span className="font-semibold text-slate-800">
          {totalItems === 0 ? 0 : start}
        </span>{" "}
        to <span className="font-semibold text-slate-800">{end}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalItems}</span>{" "}
        results
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1 order-1 sm:order-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded-md text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pages.map((page, idx) =>
            page === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="h-8 w-8 flex items-center justify-center text-slate-400 text-sm select-none"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 flex items-center justify-center text-sm rounded-md border font-medium transition-colors ${
                  page === currentPage
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded-md text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

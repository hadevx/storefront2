import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, setPage, pages }) {
  if (pages <= 1) return null; // no pagination if only 1 page

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
      //   scrollToTop();
    }
  };

  const handleNext = () => {
    if (page < pages) {
      setPage(page + 1);
      //   scrollToTop();
    }
  };

  const handlePageClick = (p) => {
    setPage(p);
    // scrollToTop();
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      {/* Mobile */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={page === pages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Next
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center gap-5 mt-5">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{page}</span> of{" "}
          <span className="font-medium">{pages}</span>
        </p>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageClick(p)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                p === page
                  ? "z-10 bg-indigo-500 text-white"
                  : "text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              }`}>
              {p}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={page === pages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
}

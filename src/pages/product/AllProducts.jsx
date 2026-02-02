import Layout from "../../Layout";
import { motion } from "framer-motion";
import { useGetProductsQuery, useGetCategoriesTreeQuery } from "../../redux/queries/productApi";
import Product from "../../components/Product";
import Loader from "../../components/Loader";
import Pagination from "../../components/Paginations";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

function AllProducts() {
  /* ------------------------------ URL state ------------------------------ */
  const [params, setParams] = useSearchParams();

  const pageFromUrl = Number(params.get("page") || 1);
  const keywordFromUrl = params.get("keyword") || "";
  const sortFromUrl = params.get("sort") || "newest";
  const discountFromUrl = params.get("onlyDiscount") === "1";
  const stockFromUrl = params.get("onlyInStock") === "1";

  /* ------------------------------ UI state ------------------------------ */
  const [page, setPage] = useState(pageFromUrl);
  const [searchQuery, setSearchQuery] = useState(keywordFromUrl);
  const [searchDraft, setSearchDraft] = useState(keywordFromUrl);

  const [sort, setSort] = useState(sortFromUrl); // newest | priceAsc | priceDesc | nameAsc
  const [onlyDiscount, setOnlyDiscount] = useState(discountFromUrl);
  const [onlyInStock, setOnlyInStock] = useState(stockFromUrl);
  const [showFilters, setShowFilters] = useState(false);

  /* ------------------ Keep local state in sync with URL ------------------ */
  // This ensures browser back/forward always restores correct page/filters.
  useEffect(() => {
    const nextPage = Number(params.get("page") || 1);
    const nextKeyword = params.get("keyword") || "";
    const nextSort = params.get("sort") || "newest";
    const nextOnlyDiscount = params.get("onlyDiscount") === "1";
    const nextOnlyInStock = params.get("onlyInStock") === "1";

    setPage(nextPage);
    setSearchQuery(nextKeyword);
    setSearchDraft(nextKeyword);
    setSort(nextSort);
    setOnlyDiscount(nextOnlyDiscount);
    setOnlyInStock(nextOnlyInStock);
  }, [params]);

  /* ------------------------ Write state back to URL ------------------------ */
  useEffect(() => {
    // avoid unnecessary URL writes (prevents subtle loops/jitter)
    const current = {
      page: String(page),
      keyword: searchQuery || "",
      sort,
      onlyDiscount: onlyDiscount ? "1" : "0",
      onlyInStock: onlyInStock ? "1" : "0",
    };

    const existing = {
      page: String(Number(params.get("page") || 1)),
      keyword: params.get("keyword") || "",
      sort: params.get("sort") || "newest",
      onlyDiscount: params.get("onlyDiscount") === "1" ? "1" : "0",
      onlyInStock: params.get("onlyInStock") === "1" ? "1" : "0",
    };

    const changed =
      current.page !== existing.page ||
      current.keyword !== existing.keyword ||
      current.sort !== existing.sort ||
      current.onlyDiscount !== existing.onlyDiscount ||
      current.onlyInStock !== existing.onlyInStock;

    if (!changed) return;

    setParams(current, { replace: true });
  }, [page, searchQuery, sort, onlyDiscount, onlyInStock, setParams, params]);

  /* -------------------------- Debounced search -------------------------- */
  // ✅ IMPORTANT: only run when draft actually changes from committed query
  // Otherwise it will reset page to 1 on mount/back navigation.
  useEffect(() => {
    if (searchDraft === searchQuery) return;

    const t = setTimeout(() => {
      setSearchQuery(searchDraft);
      setPage(1);
    }, 350);

    return () => clearTimeout(t);
  }, [searchDraft, searchQuery]);

  /* ------------------------------ Fetch ------------------------------ */
  const { data: productsData, isLoading: loadingProducts } = useGetProductsQuery({
    pageNumber: page,
    keyword: searchQuery,
    // if your backend supports these, keep them; otherwise harmless
    sort,
    onlyDiscount,
    onlyInStock,
  });

  const products = productsData?.products || [];
  const pages = productsData?.pages || 1;

  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const containerVariants = {
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
  };

  /* --------------------- Scroll to top on page change --------------------- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleClear = () => {
    setSearchDraft("");
    setSearchQuery("");
    setSort("newest");
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setPage(1);
  };

  /* --------------------- Local fallback filtering/sort --------------------- */
  const viewProducts = useMemo(() => {
    let list = [...products];

    if (onlyDiscount) list = list.filter((p) => p?.hasDiscount);

    if (onlyInStock) {
      list = list.filter((p) => {
        if (p?.variants?.length) {
          // any variant has any size with stock > 0
          return p.variants.some((v) => (v?.sizes || []).some((s) => (s?.stock || 0) > 0));
        }
        return (p?.countInStock || 0) > 0;
      });
    }

    const getPrice = (p) => (p?.hasDiscount ? p?.discountedPrice : p?.price) ?? 0;

    switch (sort) {
      case "priceAsc":
        list.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case "priceDesc":
        list.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case "nameAsc":
        list.sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")));
        break;
      case "newest":
      default:
        // keep server order
        break;
    }

    return list;
  }, [products, onlyDiscount, onlyInStock, sort]);

  const activeFiltersCount =
    (onlyDiscount ? 1 : 0) + (onlyInStock ? 1 : 0) + (sort !== "newest" ? 1 : 0);

  return (
    <Layout>
      {loadingProducts ? (
        <Loader />
      ) : (
        <div className="container px-2 mx-auto py-24 lg:px-28 min-h-screen">
          {/* Top Toolbar (CTA style) */}
          <div className="-mx-2 px-2 sm:-mx-0 mb-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              {/* subtle glow + grid texture */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px] opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent" />
              </div>

              <div className="relative px-4 sm:px-6 py-5">
                {/* Row 1: Title + Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-white/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Browse the full collection
                    </p>

                    <h2 className="mt-2 text-3xl sm:text-3xl font-black text-white tracking-tight">
                      All Products
                    </h2>

                    <p className="mt-1 text-sm text-white/70">
                      <span className="font-semibold text-white">{viewProducts.length}</span>{" "}
                      results
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Filter Button */}
                    <button
                      type="button"
                      onClick={() => setShowFilters(true)}
                      className={clsx(
                        "inline-flex items-center gap-2 h-11 px-4 rounded-2xl border border-white/15",
                        "bg-white/10 text-white backdrop-blur hover:bg-white/15 transition active:scale-[0.99]",
                      )}>
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-zinc-950 text-xs px-2 font-black">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>

                    {/* Clear */}
                    {(activeFiltersCount > 0 || searchQuery) && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className={clsx(
                          "inline-flex items-center gap-2 h-11 px-4 rounded-2xl",
                          "bg-white text-zinc-950 font-black shadow-sm hover:bg-white/90 transition active:scale-[0.99]",
                        )}>
                        <X className="h-4 w-4" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 2: Search + Sort */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchDraft}
                      onChange={(e) => setSearchDraft(e.target.value)}
                      className={clsx(
                        "w-full h-12 pl-11 pr-11 rounded-2xl border border-white/15",
                        "bg-white/10 text-white placeholder:text-white/45 backdrop-blur",
                        "focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-white/25",
                      )}
                    />
                    {searchDraft?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSearchDraft("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition"
                        aria-label="Clear search">
                        <X className="h-4 w-4 text-white/70" />
                      </button>
                    )}
                  </div>

                  {/* Sort */}
                  <div className="relative sm:w-[280px]">
                    <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                    <select
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                      }}
                      className={clsx(
                        "w-full h-12 pl-11 pr-4 rounded-2xl border border-white/15",
                        "bg-white/10 text-white backdrop-blur",
                        "focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-white/25",
                      )}>
                      <option className="text-zinc-950" value="newest">
                        Newest
                      </option>
                      <option className="text-zinc-950" value="priceAsc">
                        Price: Low → High
                      </option>
                      <option className="text-zinc-950" value="priceDesc">
                        Price: High → Low
                      </option>
                      <option className="text-zinc-950" value="nameAsc">
                        Name: A → Z
                      </option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Active filter chips */}
                {(onlyDiscount || onlyInStock || sort !== "newest" || searchQuery) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {searchQuery && (
                      <span className="inline-flex items-center gap-2 px-3 h-10 rounded-2xl border border-white/15 bg-white/10 text-white/90 backdrop-blur text-sm">
                        <Search className="h-4 w-4 text-white/60" />“{searchQuery}”
                        <button
                          type="button"
                          onClick={() => setSearchDraft("")}
                          className="h-7 w-7 rounded-xl hover:bg-white/10 flex items-center justify-center transition">
                          <X className="h-4 w-4 text-white/70" />
                        </button>
                      </span>
                    )}

                    {onlyDiscount && (
                      <span className="inline-flex items-center gap-2 px-3 h-10 rounded-2xl border border-white/15 bg-white/10 text-white/90 backdrop-blur text-sm">
                        Discounts
                        <button
                          type="button"
                          onClick={() => {
                            setOnlyDiscount(false);
                            setPage(1);
                          }}
                          className="h-7 w-7 rounded-xl hover:bg-white/10 flex items-center justify-center transition">
                          <X className="h-4 w-4 text-white/70" />
                        </button>
                      </span>
                    )}

                    {onlyInStock && (
                      <span className="inline-flex items-center gap-2 px-3 h-10 rounded-2xl border border-white/15 bg-white/10 text-white/90 backdrop-blur text-sm">
                        In stock
                        <button
                          type="button"
                          onClick={() => {
                            setOnlyInStock(false);
                            setPage(1);
                          }}
                          className="h-7 w-7 rounded-xl hover:bg-white/10 flex items-center justify-center transition">
                          <X className="h-4 w-4 text-white/70" />
                        </button>
                      </span>
                    )}

                    {sort !== "newest" && (
                      <span className="inline-flex items-center gap-2 px-3 h-10 rounded-2xl border border-white/15 bg-white/10 text-white/90 backdrop-blur text-sm">
                        Sorted
                        <button
                          type="button"
                          onClick={() => {
                            setSort("newest");
                            setPage(1);
                          }}
                          className="h-7 w-7 rounded-xl hover:bg-white/10 flex items-center justify-center transition">
                          <X className="h-4 w-4 text-white/70" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Slide-over Filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50">
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />

              {/* Panel */}
              <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="px-5 py-4 border-b flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                      <p className="text-sm text-gray-500">Refine results</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="h-10 w-10 rounded-2xl hover:bg-gray-100 flex items-center justify-center"
                      aria-label="Close">
                      <X className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-auto px-5 py-5">
                    <div className="space-y-3">
                      <label className="flex items-center justify-between rounded-2xl border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Discounts only</p>
                          <p className="text-xs text-gray-500">Show products with offers</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={onlyDiscount}
                          onChange={(e) => {
                            setOnlyDiscount(e.target.checked);
                            setPage(1);
                          }}
                          className="h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between rounded-2xl border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">In-stock only</p>
                          <p className="text-xs text-gray-500">Hide out of stock items</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={onlyInStock}
                          onChange={(e) => {
                            setOnlyInStock(e.target.checked);
                            setPage(1);
                          }}
                          className="h-5 w-5"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 border-t flex gap-2">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="h-12 flex-1 rounded-2xl border border-gray-200 font-semibold hover:bg-gray-50">
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="h-12 flex-1 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-black">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {viewProducts.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-gray-900">No products found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try changing your search or clearing filters.
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-black text-white font-semibold hover:bg-neutral-900">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Grid */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-6">
                {viewProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    className="bg-white rounded-xl overflow-hidden">
                    <Product product={product} categoryTree={categoryTree} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              <Pagination page={page} setPage={setPage} pages={pages} />
            </>
          )}
        </div>
      )}
    </Layout>
  );
}

export default AllProducts;

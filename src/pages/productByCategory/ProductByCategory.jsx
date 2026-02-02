import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetProductsByCategoryQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import Layout from "../../Layout";
import Product from "../../components/Product";
import Loader from "../../components/Loader";
import clsx from "clsx";
import { Search, SlidersHorizontal, X, ChevronRight, ArrowUpDown } from "lucide-react";

function ProductByCategory() {
  const { id } = useParams();
  const { data: products, isLoading } = useGetProductsByCategoryQuery(id);
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  // filters/sort (match AllProducts)
  const [sort, setSort] = useState("newest");
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // ✅ debounce search (only updates term when draft changes)
  useEffect(() => {
    if (searchDraft === searchTerm) return;
    const t = setTimeout(() => setSearchTerm(searchDraft), 300);
    return () => clearTimeout(t);
  }, [searchDraft, searchTerm]);

  // ----------------------------
  // Helpers
  // ----------------------------
  const findCategoryById = (catId, nodes) => {
    if (!Array.isArray(nodes)) return null;
    for (const node of nodes) {
      if (String(node._id) === String(catId)) return node;
      if (node.children?.length) {
        const found = findCategoryById(catId, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const collectCategoryIds = (node) => {
    let ids = [String(node?._id)];
    if (node?.children?.length) {
      node.children.forEach((child) => {
        ids = ids.concat(collectCategoryIds(child));
      });
    }
    return ids;
  };

  const findCategoryPath = (catId, nodes, path = []) => {
    if (!Array.isArray(nodes)) return null;
    for (const node of nodes) {
      const newPath = [...path, node];
      if (String(node._id) === String(catId)) return newPath;
      if (node.children?.length) {
        const found = findCategoryPath(catId, node.children, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  const flattenCategories = (nodes, prefix = "") => {
    if (!Array.isArray(nodes)) return [];
    return nodes.flatMap((node) => {
      const displayName = prefix ? `${prefix} > ${node.name}` : node.name;
      return [
        { id: node._id, name: node.name, displayName },
        ...flattenCategories(node.children || [], displayName),
      ];
    });
  };

  // ----------------------------
  // Computed
  // ----------------------------
  const categoryNode = useMemo(() => findCategoryById(id, categoryTree), [id, categoryTree]);

  const breadcrumbPath = useMemo(
    () => findCategoryPath(id, categoryTree) || [],
    [id, categoryTree],
  );

  const allSubCategories = useMemo(
    () => (categoryNode ? flattenCategories(categoryNode.children || []) : []),
    [categoryNode],
  );

  const categoryIdsToInclude = useMemo(() => {
    if (!categoryNode) return [];
    if (selectedSubCategory === "all") return collectCategoryIds(categoryNode);
    const subCatNode = findCategoryById(selectedSubCategory, categoryNode.children || []);
    return subCatNode ? collectCategoryIds(subCatNode) : collectCategoryIds(categoryNode);
  }, [categoryNode, selectedSubCategory]);

  const filteredProducts = useMemo(() => {
    if (!products || !categoryNode) return [];

    let list = products
      .filter((p) => categoryIdsToInclude.includes(String(p.category)))
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((p) => {
        const price = p.hasDiscount ? p.discountedPrice : p.price;
        const minCheck = priceRange.min ? price >= parseFloat(priceRange.min) : true;
        const maxCheck = priceRange.max ? price <= parseFloat(priceRange.max) : true;
        return minCheck && maxCheck;
      });

    if (onlyDiscount) list = list.filter((p) => p.hasDiscount);

    if (onlyInStock) {
      list = list.filter((p) => {
        if (p?.variants?.length) {
          return p.variants.some((v) => (v?.sizes || []).some((s) => (s?.stock || 0) > 0));
        }
        return (p?.countInStock || 0) > 0;
      });
    }

    const getPrice = (p) => (p.hasDiscount ? p.discountedPrice : p.price) ?? 0;

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
        break;
    }

    return list;
  }, [
    products,
    categoryNode,
    categoryIdsToInclude,
    searchTerm,
    priceRange,
    onlyDiscount,
    onlyInStock,
    sort,
  ]);

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (selectedSubCategory !== "all" ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (onlyDiscount ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (sort !== "newest" ? 1 : 0);

  const handleClear = () => {
    setSearchDraft("");
    setSearchTerm("");
    setSelectedSubCategory("all");
    setPriceRange({ min: "", max: "" });
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setSort("newest");
  };

  /* ---------------------------------- RENDER ---------------------------------- */
  return (
    <Layout>
      <div className="container px-2 mx-auto py-24 lg:px-28 min-h-screen">
        {/* Breadcrumb */}
        <nav className="mb-5 text-sm text-neutral-600">
          <ol className="flex items-center flex-wrap gap-1">
            <li>
              <Link to="/" className="hover:text-neutral-900 transition">
                Home
              </Link>
            </li>
            {breadcrumbPath.map((node, idx) => (
              <li key={node._id} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-400" />
                {idx === breadcrumbPath.length - 1 ? (
                  <span className="capitalize text-neutral-900 font-medium">{node.name}</span>
                ) : (
                  <Link
                    to={`/category/${node._id}`}
                    className="hover:text-neutral-900 transition capitalize">
                    {node.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

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
                    Browse the collection
                  </p>

                  <h2 className="mt-2 text-3xl sm:text-3xl font-black text-white tracking-tight capitalize">
                    {categoryNode?.name || "Category"}
                  </h2>

                  <p className="mt-1 text-sm text-white/70">
                    <span className="font-semibold text-white">
                      {isLoading ? "…" : filteredProducts.length}
                    </span>{" "}
                    results
                  </p>
                </div>

                <div className="flex items-center gap-2">
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

                  {(activeFiltersCount > 0 || searchTerm) && (
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

                <div className="relative sm:w-[280px]">
                  <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
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

              {/* Row 3: Active chips (same as AllProducts but extended) */}
              {(searchTerm ||
                onlyDiscount ||
                onlyInStock ||
                sort !== "newest" ||
                selectedSubCategory !== "all" ||
                priceRange.min ||
                priceRange.max) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-2 px-3 h-10 rounded-2xl border border-white/15 bg-white/10 text-white/90 backdrop-blur text-sm">
                      <Search className="h-4 w-4 text-white/60" />“{searchTerm}”
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
                        onClick={() => setOnlyDiscount(false)}
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
                        onClick={() => setOnlyInStock(false)}
                        className="h-7 w-7 rounded-xl hover:bg-white/10 flex items-center justify-center transition">
                        <X className="h-4 w-4 text-white/70" />
                      </button>
                    </span>
                  )}

                  {(priceRange.min || priceRange.max) && (
                    <span className="inline-flex items-center gap-2 px-3 h-10 rounded-2xl border border-white/15 bg-white/10 text-white/90 backdrop-blur text-sm">
                      Price
                      <button
                        type="button"
                        onClick={() => setPriceRange({ min: "", max: "" })}
                        className="h-7 w-7 rounded-xl hover:bg-white/10 flex items-center justify-center transition">
                        <X className="h-4 w-4 text-white/70" />
                      </button>
                    </span>
                  )}

                  {selectedSubCategory !== "all" && (
                    <span className="inline-flex items-center gap-2 px-3 h-10 rounded-2xl border border-white/15 bg-white/10 text-white/90 backdrop-blur text-sm">
                      Subcategory
                      <button
                        type="button"
                        onClick={() => setSelectedSubCategory("all")}
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
                        onClick={() => setSort("newest")}
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

        {/* Content */}
        {isLoading ? (
          <Loader />
        ) : filteredProducts.length === 0 ? (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-6">
            {filteredProducts.map((p) => (
              <div key={p._id} className="bg-white rounded-xl overflow-hidden">
                <Product product={p} categoryTree={categoryTree || []} />
              </div>
            ))}
          </div>
        )}

        {/* Slide-over Filters (same pattern as AllProducts, but with extra controls) */}
        {showFilters && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />

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
                <div className="flex-1 overflow-auto px-5 py-5 space-y-5">
                  {/* Discount / stock */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-2xl border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Discounts only</p>
                        <p className="text-xs text-gray-500">Show products with offers</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={onlyDiscount}
                        onChange={(e) => setOnlyDiscount(e.target.checked)}
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
                        onChange={(e) => setOnlyInStock(e.target.checked)}
                        className="h-5 w-5"
                      />
                    </label>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Price (KD)</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                      />
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                  </div>

                  {/* Subcategories */}
                  {allSubCategories.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Subcategory</p>
                      <div className="grid gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSubCategory("all")}
                          className={clsx(
                            "w-full text-left rounded-2xl px-3 py-2 text-sm border transition",
                            selectedSubCategory === "all"
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50",
                          )}>
                          All
                        </button>

                        <div className="max-h-[320px] overflow-auto pr-1 grid gap-2">
                          {allSubCategories.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => setSelectedSubCategory(sub.id)}
                              title={sub.displayName}
                              className={clsx(
                                "w-full text-left rounded-2xl px-3 py-2 text-sm border transition",
                                selectedSubCategory === sub.id
                                  ? "border-neutral-900 bg-neutral-900 text-white"
                                  : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50",
                              )}>
                              {sub.displayName}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
      </div>
    </Layout>
  );
}

export default ProductByCategory;

import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetProductsByCategoryQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import Layout from "../../Layout";
import Product from "../../components/Product";
import Loader from "../../components/Loader";

function ProductByCategory() {
  const { category } = useParams();
  const { data: products, isLoading } = useGetProductsByCategoryQuery(category);
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Find category by name recursively
  const findCategoryByName = (name, nodes) => {
    if (!Array.isArray(nodes)) return null;
    for (const node of nodes) {
      if (node.name.toLowerCase() === name.toLowerCase()) return node;
      if (node.children?.length) {
        const found = findCategoryByName(name, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Collect all category IDs under a node recursively
  const collectCategoryIds = (node) => {
    let ids = [String(node?._id)];
    if (node?.children?.length) {
      node.children.forEach((child) => {
        ids = ids.concat(collectCategoryIds(child));
      });
    }
    return ids;
  };

  // Find breadcrumb path (array of categories from root to target)
  const findCategoryPath = (name, nodes, path = []) => {
    if (!Array.isArray(nodes)) return null;
    for (const node of nodes) {
      const newPath = [...path, node];
      if (node.name.toLowerCase() === name.toLowerCase()) {
        return newPath;
      }
      if (node.children?.length) {
        const found = findCategoryPath(name, node.children, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  // Flatten categories recursively with display name (for indentation)
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

  // Find the main category node
  const categoryNode = useMemo(
    () => findCategoryByName(category, categoryTree),
    [category, categoryTree]
  );

  // Breadcrumb path for navigation
  const breadcrumbPath = useMemo(
    () => findCategoryPath(category, categoryTree) || [],
    [category, categoryTree]
  );

  // Filter products based on selected subcategory, search, and price
  const filteredProducts = useMemo(() => {
    if (!products || !categoryNode) return [];

    let categoryIds = [];
    if (selectedSubCategory === "all") {
      categoryIds = collectCategoryIds(categoryNode);
    } else {
      const subCatNode = findCategoryByName(selectedSubCategory, categoryNode.children || []);
      if (subCatNode) {
        categoryIds = collectCategoryIds(subCatNode);
      }
    }

    return products
      .filter((p) => categoryIds.includes(String(p.category)))
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((p) => {
        const minCheck = priceRange.min ? p.price >= parseFloat(priceRange.min) : true;
        const maxCheck = priceRange.max ? p.price <= parseFloat(priceRange.max) : true;
        return minCheck && maxCheck;
      });
  }, [products, categoryNode, selectedSubCategory, searchTerm, priceRange]);

  // Flatten all descendants of the category for subcategory filter buttons
  const allSubCategories = useMemo(() => {
    if (!categoryNode) return [];
    return flattenCategories(categoryNode.children || []);
  }, [categoryNode]);

  return (
    <Layout>
      <div className="min-h-screen  py-5 lg:px-28">
        {/* Breadcrumb */}
        <nav className="mb-4 px-2 text-gray-600 text-sm">
          <ol className="flex items-center flex-wrap">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            {breadcrumbPath.map((node, idx) => (
              <li key={node._id} className="flex items-center">
                <span className="mx-2">{">"}</span>
                {idx === breadcrumbPath.length - 1 ? (
                  <span className="capitalize text-gray-800 font-medium">{node.name}</span>
                ) : (
                  <Link
                    to={`/category/${encodeURIComponent(node.name)}`}
                    className="hover:underline capitalize">
                    {node.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="text-4xl px-2 font-semibold mb-3 capitalize">{category}:</h1>

        {/* Filters */}
        <div className="flex px-2 flex-col md:flex-row gap-3 md:items-center mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border  border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full md:w-1/3"
          />

          {/* Price Range */}
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 w-20"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 w-20"
            />
          </div>

          {/* Subcategory Filter with multi-level */}
          {allSubCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 max-w-full overflow-auto">
              <button
                onClick={() => setSelectedSubCategory("all")}
                className={`px-3 py-1 rounded-full border whitespace-nowrap ${
                  selectedSubCategory === "all"
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}>
                All
              </button>
              {allSubCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCategory(sub.name)}
                  className={`px-3 py-1 rounded-full border whitespace-nowrap ${
                    selectedSubCategory === sub.name
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                  title={sub.displayName} // helpful for full path tooltip
                >
                  {sub.displayName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products */}
        {isLoading ? (
          <Loader />
        ) : filteredProducts.length > 0 ? (
          <>
            <p className="mb-10 text-gray-700 px-2">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            <div className="flex flex-wrap lg:items-center  lg:gap-7">
              {filteredProducts.map((product) => (
                <div key={product._id} className="w-[210px] md:min-w-[250px] rounded-lg">
                  <Product product={product} categoryTree={categoryTree || []} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No products found matching your criteria.</p>
        )}
      </div>
    </Layout>
  );
}

export default ProductByCategory;

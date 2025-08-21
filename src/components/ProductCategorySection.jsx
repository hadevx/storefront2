import { useGetAllProductsQuery, useGetCategoriesTreeQuery } from "../redux/queries/productApi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const findCategoryNameById = (id, nodes) => {
  if (!id || !Array.isArray(nodes)) return null;
  for (const node of nodes) {
    if (String(node._id) === String(id)) return node.name;
    if (node.children) {
      const result = findCategoryNameById(id, node.children);
      if (result) return result;
    }
  }
  return null;
};

export default function ProductCategorySection() {
  const { data: products, isLoading, error } = useGetAllProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const uniqueCategoryIds = [...new Set(products?.map((product) => product?.category))];
  const mainCategoryIds = uniqueCategoryIds?.filter((id) =>
    categoryTree?.some((cat) => String(cat._id) === String(id))
  );

  const cat = mainCategoryIds?.map((id) => {
    const name = findCategoryNameById(id, categoryTree || []) || "Unknown";
    const label = name.charAt(0).toUpperCase() + name.slice(1);

    const categoryProducts = products?.filter((p) => String(p.category) === String(id));
    const count = categoryProducts.length;

    // Use the first product image as category image
    const image = categoryProducts[0]?.image || "/images/default-category.jpg";

    return { id, label, count, image };
  });

  /*   if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;
  if (cat.length === 0) return null; */

  return (
    <motion.section className="bg-gray-50 py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={{ visible: { transition: { duration: 0.6, staggerChildren: 0.2 } } }}
        className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-12 text-center text-gray-800">
          Shop by Category
        </h2>
        {error && (
          <p className="text-red-500 text-sm mt-2">Something went wrong. Please try again later.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {cat?.map((category) => (
            <motion.div
              key={category.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <Link
                to={`/category/${category.label}`}
                className="relative flex flex-col items-center justify-end h-52 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Category Image */}
                <img
                  src={category.image}
                  alt={category.label}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Category Info */}
                <div className="relative z-10 mb-4 text-center">
                  <h3 className="text-lg font-semibold text-white">{category.label}</h3>
                  <span className="text-sm text-gray-200">
                    {category.count} {category.count === 1 ? "Product" : "Products"}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

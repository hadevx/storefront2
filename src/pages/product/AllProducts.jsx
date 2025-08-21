import Layout from "../../Layout";
import { motion } from "framer-motion";
import { useGetProductsQuery, useGetCategoriesTreeQuery } from "../../redux/queries/productApi";
import Product from "../../components/Product";
import Loader from "../../components/Loader";
import { useState, useEffect } from "react";
import Pagination from "../../components/Paginations";

function AllProducts() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // const { data: products, isLoading } = useGetProductsQuery();
  const { data: productsData, isLoading: loadingProducts } = useGetProductsQuery({
    pageNumber: page,
    keyword: searchQuery,
  });

  const products = productsData?.products || [];
  const pages = productsData?.pages || 1;

  console.log(products);

  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const containerVariants = { visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // reset to first page when searching
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]); // <-- whenever page changes, scroll up
  return (
    <Layout>
      <div className="container  px-1 mx-auto py-24 lg:px-28 min-h-screen">
        <h2 className="text-4xl font-semibold mb-10 text-gray-900">All Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full  mb-5 sm:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products?.map((product) => (
            <motion.div
              key={product._id}
              variants={itemVariants}
              className="bg-white rounded-xl overflow-hidden">
              <Product product={product} categoryTree={categoryTree} />
            </motion.div>
          ))}
        </motion.div>
        <Pagination page={page} setPage={setPage} pages={pages} />
      </div>
    </Layout>
  );
}

export default AllProducts;

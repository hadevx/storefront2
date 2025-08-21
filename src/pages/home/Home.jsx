import { useRef, useEffect } from "react";
import Layout from "../../Layout";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetLatestProductsQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import Product from "../../components/Product";
import ProductCategorySection from "../../components/ProductCategorySection";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import hero3 from "../../assets/images/hero3.webp";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import FeaturedProducts from "../../components/FeaturedProducts";
import { CollectionStrip } from "../../components/CollectionStripe";
import { MaterialsSection } from "../../components/MaterialSection";
import { HeroSection } from "../../components/HeroSection";

function Home() {
  const { data: products, isLoading, isError, refetch } = useGetLatestProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const prevStockRef = useRef([]);
  useEffect(() => {
    if (products) {
      const currentStock = products.map((p) => p.countInStock);
      const prevStock = prevStockRef.current;
      const stockChanged = currentStock.some((stock, index) => stock !== prevStock[index]);
      if (stockChanged) refetch();
      prevStockRef.current = currentStock;
    }
  }, [products, refetch]);

  const containerVariants = { visible: { transition: { staggerChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <Layout>
      <HeroSection />
      <FeaturedProducts products={products} />
      <CollectionStrip />
      <MaterialsSection />

      {/*    <div id="products" className="lg:px-28 py-12">
        <h2 className="text-4xl font-semibold mb-10 text-gray-900">Latest Products</h2>
        {isError && (
          <p className="text-red-500 text-sm mt-2">Something went wrong. Please try again later.</p>
        )}

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products?.slice(0, 8).map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  className="bg-white rounded-xl overflow-hidden px-1">
                  <Product product={product} categoryTree={categoryTree} />
                </motion.div>
              ))}
            </motion.div>

            <div className="flex justify-center mt-10">
              <Link
                to="/all-products"
                className="px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition">
                Show All
              </Link>
            </div>
          </>
        )}
      </div> */}

      {/* <ProductCategorySection /> */}
      {/* Promotional Banner Section */}
    </Layout>
  );
}

export default Home;

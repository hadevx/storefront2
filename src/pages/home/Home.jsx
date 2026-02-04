import { useRef, useEffect } from "react";
import Layout from "../../Layout";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetLatestProductsQuery,
  useGetCategoriesTreeQuery,
  useGetFeaturedProductsQuery,
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

import X from "../../components/X";
import Y from "../../components/Y";
import Z from "../../components/Z";
import Q from "../../components/Q";

import HeroSection2 from "../../components/HeroSection2";
import HeroSection3 from "../../components/HeroSection3";
import HeroSection5 from "../../components/HeroSection5";
import HeroSection6 from "../../components/HeroSection6";
import HeroSection7 from "../../components/HeroSection7";
import HeroSection8 from "../../components/HeroSection8";

function Home() {
  // const { data: products, isLoading, refetch } = useGetLatestProductsQuery();
  const { data: products, isLoading, refetch } = useGetFeaturedProductsQuery();

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

  return (
    <Layout>
      <HeroSection />
      {/* <HeroSection2 /> */}
      {/* <HeroSection3 /> */}
      {/* <HeroSection5 /> */}
      {/* <HeroSection6 /> */}
      {/* <HeroSection7 /> */}
      {/* <HeroSection8 /> */}
      <FeaturedProducts products={products} isLoading={isLoading} />
      <CollectionStrip />
      {/* <MaterialsSection /> */}
      {/* <Q /> */}
      <X />
      <Y />
      <Z />
    </Layout>
  );
}

export default Home;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import BlurPanel from "./BlurPanel";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useGetDiscountStatusQuery, useGetCategoriesTreeQuery } from "../redux/queries/productApi";

export default function ProductCard({ product, onQuickLook }) {
  console.log(new Date(product.createdAt));
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const isNew = () => {
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 3; // product is new if within 3 days
  };

  const isLimited = () => {
    return product.countInStock < 5;
  };
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
  const { data: discountStatus } = useGetDiscountStatusQuery();
  const oldPrice = product.price;
  let newPrice = oldPrice;

  if (discountStatus && discountStatus.length > 0) {
    const applicableDiscount = discountStatus.find((d) =>
      d.category.includes(findCategoryNameById(product.category, categoryTree || []))
    );
    if (applicableDiscount) {
      newPrice = oldPrice - oldPrice * applicableDiscount.discountBy;
    }
  }
  return (
    <Link to={`/products/${product._id}`}>
      <motion.div
        //   onClick={() => onQuickLook(product)} // 👈 trigger QuickLookModal
        className="group relative  bg-white overflow-hidden cursor-pointer"
        style={{
          borderRadius: "24px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px",
        }}
        layout>
        {/* Badge */}

        <div className="absolute top-4 left-4 z-20">
          {isLimited() && (
            <span className="px-3 py-1 text-xs mr-2 bg-amber-500/90 text-white font-medium rounded-full backdrop-blur-sm">
              Limited
            </span>
          )}
          {isNew() && (
            <span className="px-3 py-1 text-xs bg-green-500/90 text-white font-medium rounded-full backdrop-blur-sm">
              New
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "25/36" }}>
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <img
              src={product.image[0] || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/40 to-transparent" />
          <div className="relative z-10">
            <h3 className="text-sm lg:text-xl font-semibold text-white mb-1">{product.name}</h3>
            {/*    <span className="text-sm lg:text-2xl font-bold text-white">
              {product.price.toFixed(3)} KD
            </span> */}
            <div className="text-sm sm:text-lg">
              {newPrice < oldPrice ? (
                <div className="flex flex-col">
                  <span className="text-gray-300 line-through text-sm">
                    {oldPrice.toFixed(3)} KD
                  </span>
                  <span className="text-white font-bold">{newPrice.toFixed(3)} KD</span>
                </div>
              ) : (
                <span className="text-white font-bold">{oldPrice.toFixed(3)} KD</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

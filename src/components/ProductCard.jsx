import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import BlurPanel from "./BlurPanel";
import { Link } from "react-router-dom";
import clsx from "clsx";

export default function ProductCard({ product, onQuickLook }) {
  console.log(new Date(product.createdAt));

  const isNew = () => {
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 3; // product is new if within 3 days
  };

  const isLimited = () => {
    return product.countInStock < 5;
  };
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
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              maskImage: "linear-gradient(to top, black 0%, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 0%, black 60%, transparent 100%)",
            }}
          />
          <div className="relative z-10">
            <h3 className="text-sm lg:text-lg font-semibold text-black mb-1">{product.name}</h3>
            <span className="text-sm lg:text-xl font-bold text-black">
              {product.price.toFixed(3)} KD
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

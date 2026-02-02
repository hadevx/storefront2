import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import { addToCart } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import {
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import Loader from "../../components/Loader";
import ProductCard from "../../components/Product"; // ✅ alias (avoid component name conflict)
import { Check, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../../components/Reveal";

/** ✅ Success SVG animation (no toast) */
function AddedAnimation() {
  return (
    <motion.div
      className="absolute inset-0 grid place-items-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.18 }}>
      <div className="flex items-center gap-2">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="drop-shadow">
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
          <motion.path
            d="M7.5 12.5L10.5 15.2L16.8 9.2"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
          />
        </svg>

        <motion.span
          className="text-sm font-semibold text-white"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.12 }}>
          Added
        </motion.span>
      </div>
    </motion.div>
  );
}

/** ✅ Simple error hint */
function InlineHint({ show, text }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          className="mt-3 text-sm text-rose-600"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}>
          {text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Product() {
  const dispatch = useDispatch();
  const { productId } = useParams();

  const { data: product, isLoading, refetch } = useGetProductByIdQuery(productId);
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const [counter, setCounter] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [uiError, setUiError] = useState("");
  const [addedPulse, setAddedPulse] = useState(false);

  // ✅ Robust categoryId extraction (string OR populated object)
  const categoryId = useMemo(() => {
    if (!product?.category) return "";
    if (typeof product.category === "string") return String(product.category);
    return product.category?._id ? String(product.category._id) : "";
  }, [product]);

  // ✅ Same-category products
  const { data: sameCategoryProducts, isLoading: loadingRelated } = useGetProductsByCategoryQuery(
    categoryId,
    { skip: !categoryId },
  );

  const relatedProducts = useMemo(() => {
    const list = Array.isArray(sameCategoryProducts) ? sameCategoryProducts : [];
    return list
      .filter((p) => String(p?._id) !== String(product?._id))
      .filter((p) => {
        const pCat =
          typeof p?.category === "string"
            ? String(p.category)
            : p?.category?._id
              ? String(p.category._id)
              : "";
        return String(pCat) === String(categoryId);
      })
      .slice(0, 10);
  }, [sameCategoryProducts, product?._id, categoryId]);

  useEffect(() => {
    if (!product) return;

    refetch();

    if (product.variants?.length > 0) {
      const first = product.variants[0];
      setActiveVariant(first);
      setActiveImage(first.images?.[0]?.url || product.image?.[0]?.url || "/placeholder.svg");
      setSelectedSize(first.sizes?.[0] || null);
    } else {
      setActiveVariant(null);
      setActiveImage(product.image?.[0]?.url || "/placeholder.svg");
      setSelectedSize(null);
    }

    setCounter(1);
    setUiError("");
    setAddedPulse(false);
  }, [product, refetch]);

  const stock = activeVariant ? selectedSize?.stock || 0 : product?.countInStock || 0;

  const handleIncrement = () => {
    if (counter < stock) setCounter((c) => c + 1);
  };

  const handleDecrement = () => {
    if (counter > 1) setCounter((c) => c - 1);
  };

  const triggerAdded = () => {
    setAddedPulse(true);
    window.clearTimeout(triggerAdded._t);
    triggerAdded._t = window.setTimeout(() => setAddedPulse(false), 900);
  };
  // eslint-disable-next-line
  triggerAdded._t = triggerAdded._t || null;

  const handleAddToCart = () => {
    setUiError("");

    if (activeVariant && !selectedSize) {
      setUiError("Please select a size.");
      return;
    }

    if (stock === 0) {
      setUiError("Out of stock.");
      return;
    }

    const productInCart = cartItems.find(
      (p) =>
        p._id === product._id &&
        (activeVariant
          ? p.variantId === activeVariant._id && p.variantSize === selectedSize?.size
          : true),
    );

    if (productInCart && productInCart.qty >= stock) {
      setUiError("You can't add more than available stock.");
      return;
    }

    dispatch(
      addToCart({
        ...product,
        variantId: activeVariant?._id || null,
        variantColor: activeVariant?.color || null,
        variantSize: selectedSize?.size || null,
        variantImage: activeVariant?.images || null,
        stock,
        qty: counter,
      }),
    );

    triggerAdded();
  };

  const allImages = useMemo(() => {
    const vImgs = product?.variants?.flatMap((v) => v.images || []) || [];
    const pImgs = product?.image || [];
    const list = vImgs.length ? vImgs : pImgs;
    return list.filter(Boolean);
  }, [product]);

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="relative overflow-x-hidden">
          {/* Page background */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
            <div className="absolute left-1/2 top-24 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-neutral-200/45 blur-3xl" />
            <div className="absolute -right-24 top-80 h-64 w-64 rounded-full bg-neutral-200/30 blur-3xl" />
          </div>

          <div className="lg:container mt-[70px] lg:mt-[110px] lg:mx-auto px-3 pb-14">
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
              {/* LEFT: Gallery */}
              <div className="lg:sticky lg:top-[110px] h-fit">
                <div className="relative overflow-hidden rounded-3xl  bg-white shadow-sm">
                  {/* ✅ On big screens: thumbs LEFT. On small: thumbs BELOW */}
                  <div className="p-4">
                    <div className="flex flex-col lg:flex-row gap-1">
                      {/* Thumbnails (LEFT on lg) */}
                      <div
                        className={clsx(
                          "order-2 lg:order-1",
                          "flex flex-wrap lg:flex-col gap-3",
                          "lg:w-24",
                        )}>
                        {/* Mobile: wraps; Desktop: vertical scroll */}
                        <div className="flex flex-wrap lg:flex-col gap-3 lg:max-h-[520px] lg:overflow-auto lg:pr-1">
                          {allImages.map((img, idx) => {
                            const url = img?.url || img;
                            const isActive = url === activeImage;

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveImage(url)}
                                className={clsx(
                                  "relative overflow-hidden rounded-2xl border transition",
                                  // size: slightly smaller on desktop
                                  "h-20 w-20 lg:h-20 lg:w-20",
                                  isActive
                                    ? "border-neutral-900 ring-1 ring-neutral-900"
                                    : "border-neutral-200 hover:border-neutral-300",
                                )}>
                                <img
                                  src={url}
                                  alt={`Thumbnail ${idx + 1}`}
                                  className="h-full w-full object-cover"
                                  draggable="false"
                                />
                                {isActive && (
                                  <div
                                    className="absolute inset-0 bg-black/10"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Main image */}
                      <div className="order-1 lg:order-2 flex-1">
                        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white">
                          <div className="relative aspect-[4/5] sm:aspect-[16/15] lg:aspect-[4/5] bg-neutral-100">
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={activeImage}
                                src={activeImage}
                                alt={product?.name}
                                loading="lazy"
                                initial={{ opacity: 0, scale: 1.03 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                                className="absolute inset-0 w-full h-full object-cover"
                                draggable="false"
                              />
                            </AnimatePresence>

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent" />

                            <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                              {stock > 0 && stock < 5 ? (
                                <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                                  Only {stock} left
                                </span>
                              ) : stock === 0 ? (
                                <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                                  Out of stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                                  In stock
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* End main */}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Details */}
              <div className="pb-10">
                {/* Title + description */}
                <Reveal>
                  <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-5 md:p-7">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-950">
                      {product?.name}
                    </h1>
                    <p className="mt-3 text-neutral-600 leading-relaxed">{product?.description}</p>

                    {/* Price */}
                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div>
                        {product?.hasDiscount ? (
                          <div className="flex items-baseline gap-3">
                            <span className="text-sm text-neutral-500 line-through">
                              {product?.price?.toFixed(3)} KD
                            </span>
                            <span className="text-3xl font-semibold text-emerald-600">
                              {product?.discountedPrice?.toFixed(3)} KD
                            </span>
                          </div>
                        ) : (
                          <span className="text-3xl font-semibold text-neutral-950">
                            {product?.price?.toFixed(3)} KD
                          </span>
                        )}
                      </div>

                      <span className="hidden md:inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700">
                        {stock > 0 ? `${stock} available` : "Not available"}
                      </span>
                    </div>
                  </div>
                </Reveal>

                {/* Options */}
                <div className="mt-5 rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-5 md:p-7">
                  {/* Colors */}
                  {product?.variants?.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900">Color</span>
                        {activeVariant?.color && (
                          <span className="text-sm text-neutral-600">
                            {String(activeVariant.color)}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3">
                        {product.variants.map((variant) => {
                          const isActive = activeVariant?._id === variant._id;
                          return (
                            <button
                              key={variant._id}
                              type="button"
                              onClick={() => {
                                setActiveVariant(variant);
                                setActiveImage(variant.images?.[0]?.url || product.image?.[0]?.url);
                                setSelectedSize(variant.sizes?.[0] || null);
                                setCounter(1);
                                setUiError("");
                              }}
                              className={clsx(
                                "relative h-11 w-11 rounded-2xl border transition",
                                isActive
                                  ? "border-neutral-950 ring-2 ring-neutral-950/15"
                                  : "border-neutral-200 hover:border-neutral-300",
                              )}
                              style={{
                                backgroundColor: String(variant?.color || "").toLowerCase(),
                              }}
                              aria-label={`Select color ${variant.color}`}>
                              {isActive && (
                                <span className="absolute inset-0 grid place-items-center">
                                  <Check className="h-5 w-5 text-white drop-shadow" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {activeVariant?.sizes?.length > 0 && (
                    <div className="mt-7">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900">Size</span>
                        <span className="text-sm text-neutral-600">
                          {selectedSize?.size ? `Selected: ${selectedSize.size}` : "Select a size"}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-4 gap-3">
                        {activeVariant.sizes.map((s) => {
                          const isSelected = selectedSize?.size === s.size;
                          const disabled = (s?.stock || 0) === 0;

                          return (
                            <button
                              key={s.size}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                setSelectedSize(s);
                                setCounter(1);
                                setUiError("");
                              }}
                              className={clsx(
                                "h-11 rounded-2xl border text-sm font-medium transition",
                                disabled
                                  ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                                  : isSelected
                                    ? "border-neutral-950 bg-neutral-950 text-white"
                                    : "border-neutral-200 bg-white hover:border-neutral-300",
                              )}>
                              {s.size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="mt-7">
                    <div className="mt-3 inline-flex items-center rounded-2xl border border-neutral-200 bg-white p-1">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={counter === 1}
                        className={clsx(
                          "h-10 w-10 rounded-xl grid place-items-center transition",
                          counter === 1
                            ? "text-neutral-300 cursor-not-allowed"
                            : "text-neutral-900 hover:bg-neutral-100",
                        )}
                        aria-label="Decrease quantity">
                        <Minus className="h-4 w-4" />
                      </button>

                      <div className="w-12 text-center text-sm font-semibold text-neutral-950">
                        {counter}
                      </div>

                      <button
                        type="button"
                        onClick={handleIncrement}
                        disabled={counter >= stock}
                        className={clsx(
                          "h-10 w-10 rounded-xl grid place-items-center transition",
                          counter >= stock || stock === 0
                            ? "text-neutral-300 cursor-not-allowed"
                            : "text-neutral-900 hover:bg-neutral-100",
                        )}
                        aria-label="Increase quantity">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {stock > 0 && (
                      <p className="mt-2 text-xs text-neutral-500">Max available: {stock}</p>
                    )}
                  </div>

                  {/* Add to cart */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={stock === 0}
                      className={clsx(
                        "relative w-full overflow-hidden inline-flex items-center justify-center rounded-lg px-5 py-4 text-sm font-semibold transition shadow-sm",
                        stock === 0
                          ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                          : addedPulse
                            ? "bg-emerald-600 text-white"
                            : "bg-neutral-950 text-white hover:bg-neutral-900 active:scale-[0.99]",
                      )}>
                      <span
                        className={clsx(
                          "transition-opacity",
                          addedPulse ? "opacity-0" : "opacity-100",
                        )}>
                        {stock === 0 ? "Out of stock" : "ADD TO CART"}
                      </span>

                      <AnimatePresence>{addedPulse && <AddedAnimation />}</AnimatePresence>
                    </button>

                    <InlineHint show={!!uiError} text={uiError} />
                  </div>
                </div>
              </div>
              {/* END right */}
            </div>

            {/* ✅ RELATED PRODUCTS - SAME CATEGORY ONLY */}
            {categoryId ? (
              <div className="mt-10 lg:mt-14">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-neutral-950">
                      Related products
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600">More items in the same category</p>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-4 sm:p-6">
                  {loadingRelated ? (
                    <Loader />
                  ) : relatedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                      {relatedProducts.map((p) => (
                        <div key={p._id} className="rounded-3xl">
                          <ProductCard product={p} categoryTree={categoryTree || []} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                      <p className="text-sm font-medium text-neutral-800">
                        No related products found.
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Nothing else in this category yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Product;

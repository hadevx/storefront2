import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import { addToCart } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import clsx from "clsx";
import {
  useGetProductByIdQuery,
  useGetDiscountStatusQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import Loader from "../../components/Loader";

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

function Product() {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { data: discountStatus } = useGetDiscountStatusQuery();
  const { data: product, isLoading, refetch } = useGetProductByIdQuery(productId);
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  console.log(product);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [counter, setCounter] = useState(1);
  const [activeImage, setActiveImage] = useState(null);

  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    if (product) {
      refetch();
      if (product.variants?.length > 0) {
        setSelectedVariant(product.variants[0]);
        setActiveImage(product.variants[0].images?.[0]?.url || product.image?.[0]?.url);
      } else {
        setActiveImage(product.image?.[0]?.url);
      }
    }
  }, [product, refetch]);

  const handleIncrement = () => {
    if ((selectedVariant ? selectedVariant.stock : product?.countInStock) > counter)
      setCounter(counter + 1);
  };
  const handleDecrement = () => {
    if (counter > 1) setCounter(counter - 1);
  };

  const handleAddToCart = () => {
    const itemToAdd = selectedVariant ? { ...product, variant: selectedVariant } : product;
    const productInCart = cartItems.find(
      (p) => p._id === itemToAdd._id && (!selectedVariant || p.variant._id === selectedVariant._id)
    );

    if (productInCart && productInCart.qty === counter) {
      return toast.error("You can't add more", { position: "top-center" });
    }

    dispatch(
      addToCart({
        ...itemToAdd,
        variant: selectedVariant,
        price: selectedVariant?.price || product.price,
        qty: counter,
      })
    );
    toast.success(`${product.name} added to cart`, { position: "top-center" });
  };

  const oldPrice = selectedVariant?.price || product?.price;
  let newPrice = oldPrice;
  if (discountStatus?.length > 0) {
    const applicableDiscount = discountStatus.find((d) =>
      d.category.includes(findCategoryNameById(product?.category, categoryTree || []))
    );
    if (applicableDiscount) {
      newPrice = oldPrice - oldPrice * applicableDiscount.discountBy;
    }
  }

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container mt-[100px] px-4 mx-auto flex min-h-screen flex-col sm:flex-row justify-center gap-10">
          {/* Images Section */}
          <div className="w-full sm:w-2/3 md:w-1/2 lg:w-[500px] flex flex-col items-center">
            <div className="w-full h-[500px] overflow-hidden rounded-xl shadow-lg">
              <img
                src={activeImage}
                loading="lazy"
                alt={product.name}
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
              />
            </div>
            {selectedVariant?.images?.length > 1 && (
              <div className="flex gap-4 mt-5 justify-center flex-wrap">
                {selectedVariant.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt="variant"
                    className={clsx(
                      "w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-200 border-2",
                      img.url === activeImage
                        ? "border-blue-500 shadow-md opacity-70"
                        : "border-gray-300 hover:opacity-80"
                    )}
                    onClick={() => setActiveImage(img.url)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="relative flex flex-col rounded-2xl p-8 lg:p-12 w-full sm:w-1/2 md:w-1/2">
            {oldPrice !== newPrice && (
              <span className="absolute top-1 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                -{(((oldPrice - newPrice) / oldPrice) * 100).toFixed(0)}%
              </span>
            )}

            <h1 className="text-3xl font-extrabold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {/* Variants Selection */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <h2 className="font-bold mb-2">Choose Variant:</h2>
                <div className="flex gap-4 flex-wrap">
                  {product.variants.map((variant) => {
                    const color = variant.options.color || "";
                    const size = variant.options.size || "";
                    const label =
                      color && size ? `${color} / ${size}` : color || size || "No option";

                    return (
                      <button
                        key={variant._id}
                        className={clsx(
                          "px-4 py-2 rounded-md border font-semibold transition-all",
                          selectedVariant?._id === variant._id
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:bg-gray-100"
                        )}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setActiveImage(variant.images?.[0]?.url || product.image?.[0]?.url);
                          setCounter(1);
                        }}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity controls */}
            {selectedVariant?.stock > 0 && (
              <div className="flex items-center gap-6 mb-6">
                <button
                  onClick={handleDecrement}
                  className={clsx(
                    "px-4 py-2 border rounded-md font-bold text-2xl transition-all",
                    counter === 1
                      ? "border-gray-400 text-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  )}>
                  -
                </button>
                <span className="text-2xl font-semibold">{counter}</span>
                <button
                  onClick={handleIncrement}
                  className={clsx(
                    "px-4 py-2 border rounded-md font-bold text-2xl transition-all",
                    counter === (selectedVariant?.stock || product?.countInStock)
                      ? "border-gray-400 text-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  )}>
                  +
                </button>
              </div>
            )}

            <p className="font-semibold text-orange-600 mb-3">
              {selectedVariant?.stock <= 5 && `Only ${selectedVariant?.stock} left in stock`}
            </p>

            {/* Price */}
            <div className="mb-8">
              {newPrice < oldPrice ? (
                <div className="flex flex-col">
                  <span className="line-through text-gray-500 text-lg">
                    {oldPrice.toFixed(3)} KD
                  </span>
                  <span className="text-green-600 font-bold text-3xl">
                    {newPrice?.toFixed(3)} KD
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">{oldPrice?.toFixed(3)} KD</span>
              )}
            </div>

            {/* Add to Cart */}
            <button
              className={clsx(
                "px-6 py-4 rounded-xl font-bold uppercase transition-all shadow-md",
                (selectedVariant?.stock || product.countInStock) === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black"
              )}
              onClick={handleAddToCart}
              disabled={(selectedVariant?.stock || product.countInStock) === 0}>
              {(selectedVariant?.stock || product.countInStock) === 0
                ? "Out of stock"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Product;

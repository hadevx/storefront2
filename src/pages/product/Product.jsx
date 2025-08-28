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

  // Refetch when stock changes
  useEffect(() => {
    if (product) {
      refetch();
    }
  }, [product?.countInStock, refetch]);

  const cartItems = useSelector((state) => state.cart.cartItems);

  const [counter, setCounter] = useState(1);

  const handleIncrement = () => {
    product.countInStock > counter && setCounter(counter + 1);
  };
  const handleDecrement = () => {
    counter > 1 && setCounter(counter - 1);
  };

  const handleAddToCart = () => {
    const productInCart = cartItems.find((p) => p._id === product._id);

    if (productInCart && productInCart.qty === productInCart.countInStock) {
      return toast.error("You Can't add more", { position: "top-center" });
    }
    dispatch(addToCart({ ...product, price: newPrice, qty: Number(counter) }));
    toast.success(`${product.name} added to cart`, { position: "top-center" });
  };

  const oldPrice = product?.price;
  let newPrice = oldPrice;

  if (discountStatus && discountStatus.length > 0) {
    const applicableDiscount = discountStatus.find((d) =>
      d.category.includes(findCategoryNameById(product?.category, categoryTree || []))
    );
    if (applicableDiscount) {
      newPrice = oldPrice - oldPrice * applicableDiscount.discountBy;
    }
  }

  // Active image state
  const [activeImage, setActiveImage] = useState(product?.image?.[0]?.url);
  useEffect(() => {
    if (product?.image?.length > 0) {
      setActiveImage(product.image[0].url);
    }
  }, [product]);

  return (
    <Layout>
      <div className="container mt-[100px]  px-4 mx-auto flex min-h-screen  flex-col sm:flex-row justify-center gap-10">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Image Section */}
            <div className="w-full sm:w-2/3 md:w-1/2 lg:w-[500px] flex flex-col items-center">
              {/* Main Image */}
              <div className="w-full h-[500px] overflow-hidden rounded-xl shadow-lg">
                <img
                  src={activeImage}
                  loading="lazy"
                  alt={product?.name}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Thumbnails */}
              {product?.image?.length > 1 && (
                <div className="flex gap-4 mt-5 justify-center flex-wrap">
                  {product.image.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      loading="lazy"
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-200 border-2 ${
                        img.url === activeImage
                          ? "border-blue-500 shadow-md opacity-70"
                          : "border-gray-300 hover:opacity-80"
                      }`}
                      onClick={() => setActiveImage(img.url)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="relative  flex flex-col rounded-2xl p-8 lg:p-12 w-full sm:w-1/2 md:w-1/2">
              {/* Discount badge */}
              {oldPrice !== newPrice && (
                <span className="absolute  top-1 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  -{(((oldPrice - newPrice) / oldPrice) * 100).toFixed(0)}%
                </span>
              )}

              <h1 className="text-3xl font-extrabold mb-4">{product?.name}</h1>
              <p className="text-gray-600 mb-6 leading-relaxed">{product?.description}</p>

              {/* Quantity controls */}
              {product?.countInStock > 0 && (
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
                      counter === product.countInStock
                        ? "border-gray-400 text-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    )}>
                    +
                  </button>
                </div>
              )}

              {/* Stock info */}
              <p className="font-semibold text-orange-600 mb-3">
                {product?.countInStock > 0 &&
                  product?.countInStock <= 5 &&
                  `Only ${product.countInStock} left in stock`}
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
                  product?.countInStock === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black"
                )}
                onClick={handleAddToCart}
                disabled={product?.countInStock === 0}>
                {product?.countInStock === 0 ? "Out of stock" : "Add to Cart"}
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Product;

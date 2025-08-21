import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useGetDiscountStatusQuery } from "../redux/queries/productApi";
import { ShoppingCart } from "lucide-react";

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

function Product({ product, categoryTree }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
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

  const handleAddToCart = () => {
    if (product.countInStock === 0) {
      toast.error("Product is out of stock");
      return;
    }
    const productInCart = cartItems.find((p) => p._id === product._id);
    if (productInCart && productInCart.qty === productInCart.countInStock) {
      return toast.error("Cannot add more", { position: "top-center" });
    }
    dispatch(addToCart({ ...product, price: newPrice, qty: 1 }));
    toast.success(`${product.name} added to cart`, { position: "top-center" });
  };

  const categoryName = findCategoryNameById(product.category, categoryTree || []) || "";

  return (
    <div className="flex flex-col bg-white rounded-2xl   duration-300 overflow-hidden">
      <Link to={`/products/${product._id}`} className="relative group">
        {newPrice < oldPrice && (
          <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
            -{(((oldPrice - newPrice) / oldPrice) * 100).toFixed(0)}%
          </span>
        )}
        <img
          src={product?.image}
          alt={product.name}
          className="w-full h-60 sm:h-64 md:h-56 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <p className="text-gray-500 text-sm mb-1 truncate">{categoryName}</p>
          <h2 className="text-gray-900 font-semibold text-lg truncate">{product.name}</h2>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm sm:text-lg">
            {newPrice < oldPrice ? (
              <div className="flex flex-col">
                <span className="text-gray-400 line-through text-sm">{oldPrice.toFixed(3)} KD</span>
                <span className="text-green-600 font-bold">{newPrice.toFixed(3)} KD</span>
              </div>
            ) : (
              <span className="text-black font-bold">{oldPrice.toFixed(3)} KD</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={clsx(
              "ml-2 px-3 py-2 rounded-lg font-semibold text-white text-xs lg:text-sm transition-colors duration-300",
              product.countInStock === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-t from-zinc-900 to-zinc-700 hover:from-zinc-800 hover:to-zinc-600"
            )}>
            {product.countInStock === 0 ? (
              "Out of stock"
            ) : (
              <p className="">
                <p className="md:hidden ">
                  {" "}
                  <ShoppingCart />
                </p>
                <p className="hidden md:flex">Add to Cart</p>
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;

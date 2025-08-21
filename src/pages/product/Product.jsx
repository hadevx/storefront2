import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  // Extract productId from URL
  const { productId } = useParams();
  const { data: discountStatus } = useGetDiscountStatusQuery();
  const { data: product, isLoading, error, refetch } = useGetProductByIdQuery(productId);
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  console.log(product);
  // API to get product by id
  useEffect(() => {
    if (product) {
      refetch(); // Refetch data whenever the stock or any other dependency changes
    }
  }, [product?.countInStock, refetch]);
  // Get the items in the cart
  const cartItems = useSelector((state) => state.cart.cartItems);

  //Track the quantity of the product
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
    // Find a discount where category includes 'all' or the product category
    const applicableDiscount = discountStatus.find((d) =>
      d.category.includes(findCategoryNameById(product?.category, categoryTree || []))
    );
    console.log(applicableDiscount);
    if (applicableDiscount) {
      newPrice = oldPrice - oldPrice * applicableDiscount.discountBy;
    }
  }

  return (
    <Layout>
      {/*   <Link
        to="/"
        className="absolute bg-gradient-to-t from-zinc-200 to-zinc-50 drop-shadow-md left-5 mt-5 lg:left-10 text-black hover:bg-zinc-200/40 border z-20 bg-zinc-200/50 p-3 rounded-lg font-bold">
        Go Back
      </Link> */}

      <div className="md:container    sm:px-2 md:mx-auto flex  min-h-screen items-center flex-col  sm:flex-row justify-center   ">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className=" w-[400px] sm:w-2/3  md:max-w-1/2 md:w-[500px] lg:w-1/2">
              <img src={product?.image} className="w-full h-full  object-cover" />
            </div>
            <div className="relative flex flex-col    rounded-2xl  p-10 lg:p-20 w-full sm:w-1/2 md:w-1/2 ">
              {oldPrice !== newPrice && (
                <p className="absolute top-0 lg:top-5 bg-blue-500 text-white px-2 py-1 rounded-full">
                  -{(((oldPrice - newPrice) / oldPrice) * 100).toFixed(0)}%
                </p>
              )}

              <h1 className="text-3xl  font-extrabold lg:mb-5">{product?.name}</h1>
              <p className="text-gray-500 mb-5 lg:mb-10 text-base lg:text-xl">
                {product?.description}
              </p>
              {product?.countInStock > 0 && (
                <div className="flex justify-start items-center gap-5 mb-5">
                  <button
                    onClick={handleDecrement}
                    className={clsx(
                      "px-3 py-1 active:bg-gray-500 drop-shadow-xl bg-black border-[2px] rounded-md  font-bold text-3xl",
                      counter === 1
                        ? "bg-inherit border-[2px] border-black text-black"
                        : "text-white border-[2px]"
                    )}>
                    -
                  </button>
                  <p className="px-3 text-3xl ">{counter}</p>
                  <button
                    onClick={handleIncrement}
                    className={clsx(
                      "px-3 py-1 active:bg-gray-500 drop-shadow-xl bg-black border-[2px] rounded-md font-bold text-3xl",
                      counter === product.countInStock
                        ? "bg-inherit border-[2px] border-black text-black"
                        : "text-white border-[2px]"
                    )}>
                    +
                  </button>
                </div>
              )}
              <p className="font-bold text-orange-500 mb-2">
                {product?.countInStock > 0 &&
                  product?.countInStock <= 5 &&
                  `Only ${product.countInStock} left in stock`}
              </p>
              <p className="font-bold text-3xl mb-5 ">
                {newPrice < oldPrice ? (
                  <p className="flex flex-col">
                    <span style={{ textDecoration: "line-through", color: "gray" }}>
                      {oldPrice.toFixed(3)} KD
                    </span>{" "}
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {newPrice?.toFixed(3)} KD
                    </span>
                  </p>
                ) : (
                  <p>
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      {oldPrice?.toFixed(3)} KD
                    </span>
                  </p>
                )}
              </p>
              <button
                className={clsx(
                  " rounded-lg  text-white px-5 py-4 font-bold uppercase drop-shadow-lg",
                  product?.countInStock === 0
                    ? "bg-zinc-300 "
                    : "bg-gradient-to-t from-zinc-900 to-zinc-700 hover:bg-gradient-to-b "
                )}
                onClick={handleAddToCart}
                disabled={product?.countInStock === 0}>
                {product?.countInStock === 0 ? "Out of stock" : "Add to cart"}
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Product;

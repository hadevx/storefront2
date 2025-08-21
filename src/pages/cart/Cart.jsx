import { useState, useEffect } from "react";
import Layout from "../../Layout";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Truck } from "lucide-react";
import { removeFromCart, updateCart } from "../../redux/slices/cartSlice";
import Message from "../../components/Message";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { toast } from "react-toastify";
import { useGetAddressQuery } from "../../redux/queries/userApi";
import { useGetDeliveryStatusQuery, useGetAllProductsQuery } from "../../redux/queries/productApi";
import { Badge } from "@medusajs/ui";

function Cart() {
  // Local state for tracking quantity dropdown selection
  const [selectedValue, setSelectedValue] = useState(1);

  // Fetch delivery status (shipping fee, delivery time, etc.)
  const { data: deliveryStatus } = useGetDeliveryStatusQuery();

  // Fetch all products (used for validating cart items)
  const { data: products } = useGetAllProductsQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state selectors
  const cartItems = useSelector((state) => state?.cart.cartItems);
  const userInfo = useSelector((state) => state?.auth.userInfo);

  // Fetch user address if logged in
  const { data: userAddress } = useGetAddressQuery(userInfo?._id);

  /**
   * Remove an item from the cart
   * @param {string} id - Product ID to remove
   */
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  /**
   * Handle quantity change in the dropdown
   * @param {object} e - Event object
   * @param {object} item - Cart item
   */
  const handleChange = (e, item) => {
    setSelectedValue(e.target.value);
    const newQty = e.target.value;

    // Update the cart with new quantity
    dispatch(updateCart({ _id: item._id, qty: Number(newQty) }));
  };

  /**
   * Navigate to payment page
   * - If not logged in → redirect to login
   * - If no address → redirect to address page
   * - Otherwise → go to payment
   */
  const handleGoToPayment = () => {
    if (!userInfo) {
      navigate("/login");
      toast.info("You need to login first", { position: "top-center" });
      return;
    }
    if (!userAddress) {
      navigate("/profile");
      toast.info("Add your address", { position: "top-center" });
      return;
    }
    navigate("/payment");
  };

  /**
   * Calculate total cart cost including shipping fee
   */
  const totalCost = () => {
    const items = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const deliveryFee = Number(Number(deliveryStatus?.[0].shippingFee).toFixed(3));
    return items + deliveryFee;
  };

  /**
   * useEffect: Remove cart items that no longer exist in the product list
   */
  useEffect(() => {
    if (products && cartItems.length > 0) {
      // Build a set of valid product IDs from fetched products
      const validProductIds = new Set(products.map((p) => p._id));

      // Filter out cart items not found in product list
      const filteredCart = cartItems?.filter((item) => validProductIds.has(item._id));

      // Remove invalid cart items
      if (filteredCart.length !== cartItems.length) {
        const removedItems = cartItems.filter((item) => !validProductIds.has(item._id));
        removedItems.forEach((item) => {
          dispatch(removeFromCart(item._id));
        });
      }
    }
  }, [products, cartItems, dispatch]);

  return (
    <Layout>
      <div className="px-4 lg:px-52   mt-10 lg:mt-20 min-h-screen flex gap-5 lg:gap-10 flex-col lg:flex-row lg:justify-between">
        {/* Cart Table Section */}
        <div className="w-full lg:w-[1000px]">
          <h1 className="font-bold text-3xl mb-5">Cart</h1>

          {/* Show empty cart message if no items */}
          {cartItems?.length === 0 ? (
            <Message dismiss={false}>Your cart is empty</Message>
          ) : (
            <table className="min-w-full overflow-x-scroll">
              <thead>
                <tr>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Product
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Name
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Price
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Quantity
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Total
                  </th>
                  <th className="px-2 lg:px-4 py-2 lg:border-b lg:border-gray-300"></th>
                  {/* <th className="px-2 lg:px-4 py-2 border-b border-gray-300"></th> */}
                </tr>
              </thead>
              <tbody>
                {cartItems?.map((item) => (
                  <tr key={item._id} className="hover:bg-zinc-100/40">
                    {/* Product Image */}
                    <td className="px-0 lg:px-4 py-10 border-b border-gray-300">
                      <Link to={`/products/${item._id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 lg:w-24 lg:h-24 bg-zinc-100/50 border-2 object-cover rounded-xl"
                        />
                      </Link>
                    </td>

                    {/* Product Name */}
                    <td className="px-2 lg:px-4 py-2 w-[200px] border-b border-gray-300 text-sm text-gray-800">
                      {item.name}
                    </td>

                    {/* Price */}
                    <td className="px-2 lg:px-4 py-2 border-b border-gray-300 text-sm text-gray-800">
                      {item?.price.toFixed(3)} KD
                    </td>

                    {/* Quantity Selector */}
                    <td className=" lg:px-4 py-2 border-b border-gray-300">
                      <select
                        value={item.qty}
                        onChange={(e) => handleChange(e, item)}
                        className="border bg-zinc-100/50 lg:w-[100px] p-2 rounded focus:border-blue-500">
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Total per product */}
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-800">
                      {(item.price * item.qty).toFixed(3)} KD
                    </td>

                    {/* Remove Button */}
                    <td className="lg:px-4 py-2 lg:border-b lg:border-gray-300">
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-black transition-all duration-300 hover:bg-zinc-200 hover:text-red-500 p-2 rounded-lg">
                        <Trash2 strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Cart Summary Section */}
        <div className="rounded-3xl lg:w-[600px] px-2 lg:px-20">
          <h1 className="font-bold text-3xl mb-5">Summary</h1>
          <div className="w-full border border-gray-500/20 mb-5"></div>

          <div className="flex flex-col gap-5">
            {/* Subtotal */}
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>
                {cartItems?.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(3)} KD
              </p>
            </div>

            {/* Shipping */}
            <div className="flex justify-between">
              <p className="flex gap-2">
                Delivery: <Truck strokeWidth={1} />
              </p>
              {deliveryStatus?.[0].shippingFee ? (
                <p>{deliveryStatus?.[0].shippingFee?.toFixed(3)} KD</p>
              ) : (
                <p>Free</p>
              )}
            </div>

            {/* Delivery Time */}
            <div className="flex justify-between">
              <p className="flex gap-2">Expected delivery in:</p>
              <p className="uppercase">{deliveryStatus?.[0].timeToDeliver}</p>
            </div>

            <div className="w-full border border-gray-500/20 mb-5"></div>

            {/* Total */}
            <div className="flex justify-between">
              <p>Total:</p>
              <p>{totalCost().toFixed(3)} KD</p>
            </div>

            {cartItems.length > 0 && totalCost() < deliveryStatus?.[0].minDeliveryCost && (
              <div className="p-3 bg-rose-50 rounded-lg text-rose-500 font-bold">
                The minimum required cost should be {deliveryStatus?.[0].minDeliveryCost.toFixed(3)}{" "}
                KD
              </div>
            )}
            {/* Go to Payment Button */}
            <div>
              <button
                onClick={handleGoToPayment}
                disabled={
                  cartItems.length === 0 || totalCost() < deliveryStatus?.[0].minDeliveryCost
                }
                className={clsx(
                  "bg-gradient-to-t mt-5 mb-10 text-white p-3 rounded-lg w-full font-bold",
                  cartItems.length === 0 || totalCost() < deliveryStatus?.[0].minDeliveryCost
                    ? "from-zinc-300 to-zinc-200 border"
                    : "from-zinc-900 to-zinc-700 hover:bg-gradient-to-b"
                )}>
                Go to payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;

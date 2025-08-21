import { useState } from "react";
import Layout from "../../Layout";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { HandCoins, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAddressQuery } from "../../redux/queries/userApi";
import { useGetDeliveryStatusQuery } from "../../redux/queries/productApi";
/* import {
  useCreateOrderMutation,
  usePayOrderMutation,
  useCreateTapPaymentMutation,
} from "../../redux/queries/orderApi"; */
/* import {
  useUpdateStockMutation,
  useGetDeliveryStatusQuery,
  useFetchProductsByIdsMutation,
} from "../../redux/queries/productApi"; */

// import { clearCart } from "../../redux/slices/cartSlice";
import clsx from "clsx";
import { toast } from "react-toastify";
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { usePayment } from "../../hooks/usePayment";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  /*   const dispatch = useDispatch();
  const navigate = useNavigate(); */
  // Inside your component
  const userInfo = useSelector((state) => state.auth.userInfo);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const { data: userAddress, refetch, isLoading } = useGetAddressQuery(userInfo?._id);
  const { data: deliveryStatus } = useGetDeliveryStatusQuery();
  // const [payOrder] = usePayOrderMutation();

  // const [updateStock, { isLoading: loadingUpdateStock }] = useUpdateStockMutation();
  // const [fetchProductsByIds, { isLoading: loadingCheck }] = useFetchProductsByIdsMutation();

  // const [createOrder, { isLoading: loadingCreateOrder }] = useCreateOrderMutation();

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const {
    totalAmount,
    amountInUSD,
    loadingCreateOrder,
    loadingCheck,
    handleCashPayment,
    handlePayPalApprove,
    createPayPalOrder,
  } = usePayment(cartItems, userAddress, paymentMethod, deliveryStatus);

  /* const totalCost = () => {
    const items = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const deliveryFee = Number(Number(deliveryStatus?.[0].shippingFee).toFixed(3));
    return items + deliveryFee;
  };
  const totalAmount = totalCost();

  // Pay with cash
  const handleCashPayment = async () => {
    try {
      // 1️⃣ Get latest product data
      const productIds = cartItems.map((item) => item._id);
      const latestProducts = await fetchProductsByIds(productIds).unwrap();

      // 2️⃣ Check stock
      const outOfStockItems = cartItems.filter((item) => {
        const product = latestProducts.find((p) => p._id === item._id);
        return !product || item.qty > product.countInStock;
      });

      if (outOfStockItems.length > 0) {
        toast.error(
          `Some products are out of stock: ${outOfStockItems.map((i) => i.name).join(", ")}`
        );
        return;
      }

      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress: userAddress,
        paymentMethod: paymentMethod,
        itemsPrice: cartItems.map((item) => item.price)[0],
        shippingPrice: deliveryStatus?.[0].shippingFee,
        totalPrice: totalAmount,
      }).unwrap();

      // Call API to update stock
      await updateStock({
        orderItems: cartItems,
      }).unwrap();

      dispatch(clearCart());
      toast.success("Order created successfully");
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };
 */
  // Called when PayPal transaction is approved
  /* const handleApprove = async (data, actions) => {
    const details = await actions.order.capture();

    try {
      // Create your order in backend after successful payment
      const orderPayload = {
        orderItems: cartItems,
        shippingAddress: userAddress,
        paymentMethod: paymentMethod,
        itemsPrice: cartItems.map((item) => item.price)[0],
        shippingPrice: deliveryStatus?.[0].shippingFee,
        totalPrice: Number(cartItems.reduce((a, c) => a + c.price * c.qty, 0)),
      };

      const res = await createOrder(orderPayload).unwrap();
      await updateStock({ orderItems: cartItems }).unwrap();
      dispatch(clearCart());
      toast.success("Order created successfully");
      navigate(`/order/${res._id}`);
      // navigate to order page if you want
    } catch (error) {
      toast.error("Failed to create order after PayPal payment");
    }
  };
 */
  /* const handleApprove = async (data, actions) => {
    let pendingOrder;

    try {
      // 1️⃣ Create order in backend as PENDING (not paid yet)
      pendingOrder = await createOrder({
        orderItems: cartItems,
        shippingAddress: userAddress,
        paymentMethod: paymentMethod,
        itemsPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
        shippingPrice: deliveryStatus?.[0].shippingFee,
        totalPrice: Number(cartItems.reduce((a, c) => a + c.price * c.qty, 0)),
        isPaid: false,
      }).unwrap();

      // 2️⃣ Capture PayPal payment
      const details = await actions.order.capture();
      const transaction = details.purchase_units[0].payments.captures[0];

      // 3️⃣ Mark order as PAID in backend
      await payOrder({
        orderId: pendingOrder._id,
        paymentResult: {
          id: transaction.id,
          status: transaction.status,
          update_time: transaction.update_time,
          email_address: details.payer.email_address,
        },
      }).unwrap();

      // 4️⃣ Update stock
      await updateStock({ orderItems: cartItems }).unwrap();

      // 5️⃣ Clear cart & navigate
      dispatch(clearCart());
      toast.success("Order created successfully");
      navigate(`/order/${pendingOrder._id}`);
    } catch (error) {
      console.error("Payment/order/stock failed:", error);
      toast.error("Something went wrong. Please contact support. Payment may have been captured.");
    }
  }; */

  /*   const totalCost = () => {
    const items = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const deliveryFee = Number(Number(deliveryStatus?.[0].shippingFee).toFixed(3));
    return items + deliveryFee;
  };
  const totalAmount = totalCost(); // or calculated properly before using in handleApprove */
  // const [exchangeRate, setExchangeRate] = useState(3.25);

  /* useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("kwdToUsdRate"));
        const now = new Date().getTime();

        // Use cached rate if it exists and is <24h old
        if (storedData && now - storedData.timestamp < 24 * 60 * 60 * 1000) {
          setExchangeRate(storedData.rate);
          return;
        }

        // Otherwise fetch new rate
        const res = await fetch("https://open.er-api.com/v6/latest/KWD");
        const data = await res.json();

        if (data?.result === "success") {
          setExchangeRate(data.rates.USD);
          localStorage.setItem(
            "kwdToUsdRate",
            JSON.stringify({ rate: data.rates.USD, timestamp: now })
          );
        } else {
          toast.error("Failed to fetch exchange rate. Using cached/fallback rate.");
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        toast.error("Using cached/fallback exchange rate.");
      }
    };

    fetchExchangeRate();
  }, []);

  function convertKWDToUSD(amountInKWD, exchangeRate) {
    if (typeof amountInKWD !== "number" || amountInKWD < 0) {
      throw new Error("Invalid amount");
    }
    if (typeof exchangeRate !== "number" || exchangeRate <= 0) {
      throw new Error("Invalid exchange rate");
    }

    const amountInUSD = amountInKWD * exchangeRate;
    return amountInUSD;
  }

  const kwTous = convertKWDToUSD(totalAmount, exchangeRate); */

  return (
    <Layout className="bg-zinc-100">
      <div className="min-h-screen">
        <div className="flex  flex-col-reverse py-10 lg:flex-row gap-5 lg:gap-10 px-5 lg:px-60 lg:mt-5">
          <div className="flex lg:w-[50%] gap-5 flex-col">
            <Link
              to="/profile"
              className="flex bg-white hover:shadow transition-all duration-300 flex-col gap-5 border  p-7   rounded-lg">
              <h1 className="font-extrabold text-lg ">Shipping Address</h1>
              <hr />

              <div className="flex gap-10 ">
                <div className="flex   flex-col gap-2 ">
                  <h1 className="text-gray-700">Governorate:</h1>
                  <h1 className="text-gray-700">City:</h1>
                  <h1 className="text-gray-700">Block:</h1>
                  <h1 className="text-gray-700">Street:</h1>
                  <h1 className="text-gray-700">House:</h1>
                </div>
                {isLoading ? (
                  <Spinner className="border-t-black" />
                ) : (
                  <div className="flex flex-col   gap-2 ">
                    <h1 className="font-bold">{userAddress?.governorate}</h1>
                    <h1 className="font-bold">{userAddress?.city}</h1>
                    <h1 className="font-bold">{userAddress?.block}</h1>
                    <h1 className="font-bold">{userAddress?.street}</h1>
                    <h1 className="font-bold">{userAddress?.house}</h1>
                  </div>
                )}
              </div>
            </Link>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="font-bold text-xl mb-4">Payment Method</h2>
              <div className="space-y-4">
                {/* Cash Option */}
                <label
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    paymentMethod === "cash"
                      ? "border-indigo-600 bg-indigo-50 shadow"
                      : "border-gray-300 hover:border-gray-400"
                  )}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={handlePaymentChange}
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                  />
                  <HandCoins className="w-6 h-6 text-indigo-600" />
                  <span className="font-medium text-gray-800">Cash on Delivery</span>
                </label>

                {/* PayPal Option */}
                <label
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    paymentMethod === "paypal"
                      ? "border-indigo-600 bg-indigo-50 shadow"
                      : "border-gray-300 hover:border-gray-400"
                  )}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={handlePaymentChange}
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                  />
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <span className="font-medium text-gray-800">Credit Card</span>
                </label>

                {/* PayPal Button */}
                {paymentMethod === "paypal" && (
                  <div className="mt-5">
                    <PayPalButtons
                      disabled={loadingCheck || loadingCreateOrder}
                      fundingSource={FUNDING.CARD} // Show only card funding option
                      createOrder={createPayPalOrder(userInfo, amountInUSD)}
                      onApprove={handlePayPalApprove}
                      onError={(err) => {
                        toast.error("PayPal payment failed");
                        console.error(err);
                      }}
                    />
                  </div>
                )}
              </div>

              {paymentMethod === "cash" && (
                <button
                  disabled={loadingCreateOrder || loadingCheck}
                  onClick={handleCashPayment}
                  className={clsx(
                    "w-full mt-5 py-4 flex justify-center  font-bold transition-all duration-300 shadow",
                    loadingCreateOrder || loadingCheck
                      ? "bg-gray-300 text-black"
                      : "bg-zinc-900 hover:bg-zinc-700 text-white  transition-all duration-300"
                  )}>
                  {loadingCheck
                    ? "Checking stock..."
                    : loadingCreateOrder
                    ? "Placing order..."
                    : "Place Order"}
                </button>
              )}
            </div>
          </div>
          {/* ------ */}
          <Link
            to="/cart"
            className="flex hover:shadow transition-all duration-300  lg:w-[50%] flex-col  gap-5 border bg-white p-7  rounded-lg">
            <h1 className="font-extrabold text-lg  ">Your Cart</h1>
            <hr />
            <div className="flex gap-20 ">
              <div className="flex flex-col gap-2 ">
                <h1 className="text-gray-700">Subtotal:</h1>
                <h1 className="text-gray-700">Shipping:</h1>
                <hr />
                <h1 className="text-gray-700">Total:</h1>
              </div>
              <div className="flex flex-col gap-2 ">
                <h1 className="font-bold">
                  {cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(3)} KD
                </h1>
                <h1 className="font-bold">{deliveryStatus?.[0].shippingFee.toFixed(3)} KD</h1>
                <hr />
                <h1 className="font-bold">{totalAmount.toFixed(3)} KD</h1>
              </div>
            </div>
            {cartItems.map((item) => (
              <>
                <div key={item._id} className="flex items-center mt-5 justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt=""
                      className="w-20 h-20 bg-white rounded-lg  border-2 object-cover"
                    />
                    <p className="px-4 py-2 border-gray-300 text-sm text-gray-800">{item.name}</p>
                  </div>
                  <div>
                    <p className="px-4 py-2 border-gray-300 text-sm text-gray-800">
                      {item.qty} x {item.price.toFixed(3)} KD
                    </p>
                    <p className="px-4 py-2 border-gray-300 text-sm text-gray-800">
                      {(item.qty * item.price).toFixed(3)} KD
                    </p>
                  </div>
                </div>
                <hr />
              </>
            ))}
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default Payment;

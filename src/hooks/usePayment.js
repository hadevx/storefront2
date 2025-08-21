import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import { useCreateOrderMutation, usePayOrderMutation } from "../redux/queries/orderApi";
import { useUpdateStockMutation, useFetchProductsByIdsMutation } from "../redux/queries/productApi";

export function usePayment(cartItems, userAddress, paymentMethod, deliveryStatus) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // API hooks
  const [createOrder, { isLoading: loadingCreateOrder }] = useCreateOrderMutation();
  const [payOrder] = usePayOrderMutation();
  const [updateStock, { isLoading: loadingUpdateStock }] = useUpdateStockMutation();
  const [fetchProductsByIds, { isLoading: loadingCheck }] = useFetchProductsByIdsMutation();

  const [exchangeRate, setExchangeRate] = useState(3.25); // fallback rate

  // ✅ Calculate total cost
  const calculateTotalCost = () => {
    const items = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const deliveryFee = Number(Number(deliveryStatus?.[0]?.shippingFee || 0).toFixed(3));
    return items + deliveryFee;
  };

  const totalAmount = calculateTotalCost();

  // ✅ Stock check
  const checkStock = async () => {
    const productIds = cartItems.map((item) => item._id);
    const latestProducts = await fetchProductsByIds(productIds).unwrap();

    return cartItems.filter((item) => {
      const product = latestProducts.find((p) => p._id === item._id);
      return !product || item.qty > product.countInStock;
    });
  };

  // ✅ Cash payment
  const handleCashPayment = async () => {
    try {
      const outOfStock = await checkStock();
      if (outOfStock.length > 0) {
        toast.error(`Out of stock: ${outOfStock.map((i) => i.name).join(", ")}`);
        return;
      }

      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress: userAddress,
        paymentMethod,
        itemsPrice: cartItems.reduce((a, c) => a + c.price * c.qty, 0),
        shippingPrice: deliveryStatus?.[0]?.shippingFee,
        totalPrice: totalAmount,
      }).unwrap();

      await updateStock({ orderItems: cartItems }).unwrap();

      dispatch(clearCart());
      toast.success("Order created successfully");
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  // ✅ PayPal payment
  const handlePayPalApprove = async (data, actions) => {
    let pendingOrder;
    try {
      // Create pending order
      pendingOrder = await createOrder({
        orderItems: cartItems,
        shippingAddress: userAddress,
        paymentMethod,
        itemsPrice: cartItems.reduce((a, c) => a + c.price * c.qty, 0),
        shippingPrice: deliveryStatus?.[0]?.shippingFee,
        totalPrice: totalAmount,
        isPaid: false,
      }).unwrap();

      // Capture PayPal payment
      const details = await actions.order.capture();
      const transaction = details.purchase_units[0].payments.captures[0];

      // Mark order paid
      await payOrder({
        orderId: pendingOrder._id,
        paymentResult: {
          id: transaction.id,
          status: transaction.status,
          update_time: transaction.update_time,
          email_address: details.payer.email_address,
        },
      }).unwrap();

      // Update stock
      await updateStock({ orderItems: cartItems }).unwrap();

      dispatch(clearCart());
      toast.success("Order created successfully");
      navigate(`/order/${pendingOrder._id}`);
    } catch (error) {
      console.error("Payment/order/stock failed:", error);
      toast.error("Something went wrong. Please contact support.");
    }
  };

  // ✅ Fetch exchange rate (KWD → USD)
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("kwdToUsdRate"));
        const now = Date.now();

        if (storedData && now - storedData.timestamp < 24 * 60 * 60 * 1000) {
          setExchangeRate(storedData.rate);
          return;
        }

        const res = await fetch("https://open.er-api.com/v6/latest/KWD");
        const data = await res.json();

        if (data?.result === "success") {
          setExchangeRate(data.rates.USD);
          localStorage.setItem(
            "kwdToUsdRate",
            JSON.stringify({ rate: data.rates.USD, timestamp: now })
          );
        } else {
          toast.error("Failed to fetch exchange rate");
        }
      } catch {
        toast.error("Using fallback exchange rate");
      }
    };
    fetchRate();
  }, []);

  const amountInUSD = (totalAmount * exchangeRate).toFixed(2);

  const createPayPalOrder = (userInfo, amountInUSD) => (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amountInUSD,
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
      payer: {
        name: {
          given_name: userInfo?.name,
          surname: userInfo?.name,
        },
        phone: {
          phone_type: "MOBILE",
          phone_number: {
            national_number: userInfo?.phone,
          },
        },
        email_address: userInfo?.email,
        address: {
          country_code: "KW",
          postal_code: "00000",
        },
      },
    });
  };

  return {
    totalAmount,
    amountInUSD,
    loadingCreateOrder,
    loadingCheck,
    loadingUpdateStock,
    handleCashPayment,
    handlePayPalApprove,
    createPayPalOrder,
  };
}

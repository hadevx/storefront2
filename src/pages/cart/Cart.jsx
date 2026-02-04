import { useEffect, useMemo } from "react";
import Layout from "../../Layout";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { removeFromCart, updateCart } from "../../redux/slices/cartSlice";
import Message from "../../components/Message";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { toast } from "react-toastify";
import { useGetAddressQuery } from "../../redux/queries/userApi";
import { useGetDeliveryStatusQuery, useGetAllProductsQuery } from "../../redux/queries/productApi";
import Lottie from "lottie-react";
import empty from "./empty.json";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const language = useSelector((state) => state.language.lang);

  const t =
    language === "ar"
      ? {
          title: "سلة التسوق",
          subtitle: "راجع منتجاتك وأكمل عملية الدفع.",
          empty: "سلة التسوق فارغة",
          product: "المنتج",
          variant: "اللون/المقاس",
          price: "السعر",
          qty: "الكمية",
          total: "الإجمالي",
          remove: "حذف",
          sale: "خصم",
          summary: "ملخص الطلب",
          summaryHint: "الشحن والإجمالي يتم احتسابهما عند الدفع.",
          subtotal: "المجموع الفرعي",
          delivery: "التوصيل",
          expected: "وقت التوصيل",
          totalCost: "الإجمالي",
          minRequired: "الحد الأدنى للطلب",
          minOrder: "الحد الأدنى",
          goPay: "الذهاب للدفع",
          continue: "متابعة التسوق",
          tip: "نصيحة: أضف عنوانك في",
          profile: "الملف الشخصي",
          tip2: "لتسريع عملية الدفع.",
          loginFirst: "يجب تسجيل الدخول أولاً",
          addAddress: "أضف عنوانك",
          dash: "-",
          maxAvailable: "الحد الأقصى المتاح",
        }
      : {
          title: "Your Cart",
          subtitle: "Review your items and proceed to checkout.",
          empty: "Your cart is empty",
          product: "Product",
          variant: "Color/Size",
          price: "Price",
          qty: "Qty",
          total: "Total",
          remove: "Remove",
          sale: "Sale",
          summary: "Order summary",
          summaryHint: "Shipping & totals calculated at checkout.",
          subtotal: "Subtotal",
          delivery: "Delivery",
          expected: "Expected delivery",
          totalCost: "Total",
          minRequired: "Minimum order required",
          minOrder: "Minimum order",
          goPay: "Go to payment",
          continue: "Continue shopping",
          tip: "Tip: Add your address in",
          profile: "Profile",
          tip2: "to speed up checkout.",
          loginFirst: "You need to login first",
          addAddress: "Add your address",
          dash: "-",
          maxAvailable: "Max available",
        };

  const { data: deliveryStatus } = useGetDeliveryStatusQuery();
  const { data: products } = useGetAllProductsQuery();
  const { data: userAddress } = useGetAddressQuery(userInfo?._id);

  // Remove non-existing products from cart
  useEffect(() => {
    if (products && cartItems.length > 0) {
      const validKeys = new Set([
        // Variant products
        ...products.flatMap((p) =>
          (p.variants || []).flatMap((v) =>
            (v.sizes || []).map((s) => `${p._id}-${v._id}-${s.size}`),
          ),
        ),
        // Non-variant products
        ...products.filter((p) => !p.variants?.length).map((p) => `${p._id}-null-null`),
      ]);

      cartItems.forEach((item) => {
        const key = `${item._id}-${item.variantId ?? "null"}-${item.variantSize ?? "null"}`;
        if (!validKeys.has(key)) dispatch(removeFromCart(item));
      });
    }
  }, [products, cartItems, dispatch]);

  const handleRemove = (item) => dispatch(removeFromCart(item));

  const handleChange = (e, item) => {
    const newQty = Number(e.target.value);
    dispatch(updateCart({ ...item, qty: newQty }));
  };

  const shippingFee = Number(deliveryStatus?.[0]?.shippingFee ?? 0);
  const minOrder = Number(deliveryStatus?.[0]?.minDeliveryCost ?? 0);

  const subTotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + (item.hasDiscount ? item.discountedPrice : item.price) * item.qty,
      0,
    );
  }, [cartItems]);

  const totalCost = useMemo(() => subTotal + shippingFee, [subTotal, shippingFee]);

  const handleGoToPayment = () => {
    if (!userInfo) {
      navigate("/login");
      toast.info(t.loginFirst, { position: "top-center" });
      return;
    }
    if (!userAddress) {
      navigate("/profile");
      toast.info(t.addAddress, { position: "top-center" });
      return;
    }
    navigate("/payment");
  };

  const disabledCheckout = cartItems.length === 0 || (minOrder > 0 && totalCost < minOrder);

  return (
    <Layout>
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="mx-auto w-full max-w-[1200px] px-4 pt-24 md:pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900">
              {t.title}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          {/* LEFT: Items */}
          <div className="space-y-4 min-w-0">
            {cartItems?.length === 0 ? (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 ">
                <Message dismiss={false}>{t.empty}</Message>
                <div className="mx-auto mt-4 w-full max-w-[360px]">
                  <Lottie animationData={empty} loop={true} />
                </div>
              </div>
            ) : (
              <>
                {/* Desktop table header */}
                <div className="hidden md:grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.7fr)_minmax(0,0.45fr)_minmax(0,0.55fr)_minmax(0,0.5fr)_44px] gap-3 px-4 text-xs font-extrabold text-neutral-500">
                  <div>{t.product}</div>
                  <div>{t.variant}</div>
                  <div>{t.price}</div>
                  <div>{t.qty}</div>
                  <div>{t.total}</div>
                  <div />
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item, idx) => {
                    const stock = item.stock ?? 0;
                    const unitPrice = item.hasDiscount ? item.discountedPrice : item.price;
                    const rowTotal = unitPrice * item.qty;

                    return (
                      <div
                        key={`${item._id}-${item.variantId ?? "null"}-${item.variantSize ?? "null"}-${idx}`}
                        className="rounded-3xl border border-neutral-200 bg-white p-3 md:p-4 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
                        {/* Desktop row */}
                        <div className="hidden md:grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.7fr)_minmax(0,0.45fr)_minmax(0,0.55fr)_minmax(0,0.5fr)_44px] gap-3 items-center">
                          {/* Product */}
                          <Link
                            to={`/products/${item._id}`}
                            className="flex items-center gap-3 min-w-0">
                            <img
                              src={item?.variantImage?.[0]?.url || item.image?.[0]?.url}
                              alt={item.name}
                              className="h-20 w-20 shrink-0 rounded-2xl border bg-neutral-50 object-cover"
                            />
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-neutral-900">
                                {item.name}
                              </div>

                              {item.hasDiscount && (
                                <div className="mt-1 inline-flex rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600">
                                  {t.sale}
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Color/Size */}
                          <div className="text-sm text-neutral-700 truncate">
                            {item.variantColor ?? t.dash} / {item.variantSize ?? t.dash}
                          </div>

                          {/* Price */}
                          <div className="text-sm font-semibold text-neutral-900 whitespace-nowrap">
                            {unitPrice.toFixed(3)} KD
                          </div>

                          {/* Qty */}
                          <div className="min-w-0">
                            <select
                              value={item.qty}
                              onChange={(e) => handleChange(e, item)}
                              disabled={stock === 0}
                              className="w-[50px] rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-semibold text-neutral-900 outline-none focus:border-neutral-400">
                              {[...Array(stock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                            {stock > 0 && (
                              <div className="mt-1 text-[11px] text-neutral-500">
                                {t.maxAvailable}: {stock}
                              </div>
                            )}
                          </div>

                          {/* Total */}
                          <div className="text-sm font-extrabold text-neutral-900 whitespace-nowrap">
                            {rowTotal.toFixed(3)} KD
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemove(item)}
                            className="grid h-10 w-10 place-items-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 hover:bg-rose-50 hover:text-rose-600"
                            aria-label={t.remove}>
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Mobile row */}
                        <div className="md:hidden flex gap-3">
                          <img
                            src={item?.variantImage?.[0]?.url || item.image?.[0]?.url}
                            alt={item.name}
                            className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl border bg-neutral-50 object-cover"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <Link to={`/products/${item._id}`} className="min-w-0">
                                <div className="truncate text-sm font-semibold text-neutral-900">
                                  {item.name}
                                </div>
                                <div className="mt-1 text-xs text-neutral-500 truncate">
                                  {item.variantColor ?? t.dash} / {item.variantSize ?? t.dash}
                                </div>
                              </Link>

                              <button
                                onClick={() => handleRemove(item)}
                                className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 hover:bg-rose-50 hover:text-rose-600"
                                aria-label={t.remove}>
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <div className="text-sm font-semibold text-neutral-900 whitespace-nowrap">
                                {unitPrice.toFixed(3)} KD
                                {item.hasDiscount && (
                                  <span className="ml-2 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600">
                                    {t.sale}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-extrabold text-neutral-900 whitespace-nowrap">
                                {rowTotal.toFixed(3)} KD
                              </div>
                            </div>

                            <div className="mt-3">
                              <select
                                value={item.qty}
                                onChange={(e) => handleChange(e, item)}
                                disabled={stock === 0}
                                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-semibold text-neutral-900 outline-none focus:border-neutral-400">
                                {[...Array(stock).keys()].map((x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                ))}
                              </select>
                              {stock > 0 && (
                                <p className="mt-1 text-[11px] text-neutral-500">
                                  {t.maxAvailable}: {stock}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* RIGHT: Summary */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-extrabold text-neutral-900">{t.summary}</h2>
                  <p className="mt-1 text-sm text-neutral-500">{t.summaryHint}</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-white shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">{t.subtotal}</span>
                  <span className="font-semibold text-neutral-900">{subTotal.toFixed(3)} KD</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-neutral-600">
                    {t.delivery} <Truck className="h-4 w-4" />
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {shippingFee.toFixed(3)} KD
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">{t.expected}</span>
                  <span className="font-semibold text-neutral-900 uppercase">
                    {deliveryStatus?.[0]?.timeToDeliver ?? t.dash}
                  </span>
                </div>

                <div className="my-3 h-px w-full bg-neutral-200" />

                <div className="flex items-center justify-between">
                  <span className="text-neutral-700 font-semibold">{t.totalCost}</span>
                  <span className="text-lg font-extrabold text-neutral-900">
                    {totalCost.toFixed(3)} KD
                  </span>
                </div>

                {cartItems.length > 0 && minOrder > 0 && totalCost < minOrder && (
                  <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                    <div className="text-sm font-extrabold">{t.minRequired}</div>
                    <div className="mt-1 text-sm">
                      {t.minOrder}: <span className="font-extrabold">{minOrder.toFixed(3)} KD</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGoToPayment}
                  disabled={disabledCheckout}
                  className={clsx(
                    "mt-5 w-full rounded-2xl px-4 py-3 text-sm font-extrabold transition",
                    disabledCheckout
                      ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                      : "bg-neutral-950 text-white shadow-[0_16px_40px_rgba(0,0,0,0.25)] hover:opacity-95",
                  )}>
                  {t.goPay}
                </button>

                <Link
                  to="/all-products"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-extrabold text-neutral-900 hover:bg-neutral-50">
                  {t.continue} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Optional note */}
            <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
              {t.tip} <span className="font-semibold text-neutral-900">{t.profile}</span> {t.tip2}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;

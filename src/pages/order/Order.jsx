import Layout from "../../Layout";
import { useGetOrderQuery } from "../../redux/queries/orderApi";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  Truck,
  CreditCard,
  Mail,
  CheckCircle2,
  XCircle,
  MapPin,
  Receipt,
  User2,
} from "lucide-react";
import { usePDF } from "react-to-pdf";
import Invoice from "../../components/Invoise";
import { Copy } from "@medusajs/ui";
import { motion } from "framer-motion";
import clsx from "clsx";

// ------------------------
// Small helper UI
// ------------------------
const ShippingProgress = ({ order, t }) => {
  const isCanceled = !!order?.isCanceled;
  const isDelivered = !!order?.isDelivered;

  // 0 = placed, 1 = processing, 2 = shipped, 3 = delivered
  const step = isCanceled ? 0 : isDelivered ? 3 : 1;

  const label = isCanceled
    ? t.orderCanceled
    : isDelivered
      ? `${t.deliveredOn} ${order?.deliveredAt?.substring(0, 10)}`
      : t.onTheWay;

  const truckX = step === 0 ? "0%" : step === 1 ? "35%" : step === 2 ? "70%" : "100%";

  return (
    <div className="rounded-2xl border bg-white p-4 lg:p-6 shadow-sm mb-6 overflow-hidden">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-gray-500 mb-1">{t.shippingStatus}</p>
          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
        </div>

        {isCanceled ? (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
            <XCircle className="w-4 h-4" /> {t.canceled}
          </span>
        ) : isDelivered ? (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4" /> {t.delivered}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
            <Truck className="w-4 h-4" /> {t.inTransit}
          </span>
        )}
      </div>

      <div className="mt-5 relative">
        <div className="h-2 rounded-full bg-gray-100 border" />

        {!isCanceled && (
          <motion.div
            className="absolute left-0 top-0 h-2 rounded-full bg-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: step === 1 ? "35%" : step === 2 ? "70%" : "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        )}

        <motion.div
          className="absolute -top-4"
          initial={{ left: "0%" }}
          animate={{ left: truckX }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          style={{ transform: "translateX(-50%)" }}>
          <motion.div
            className={clsx(
              "w-10 h-10 rounded-xl border shadow-sm flex items-center justify-center",
              isCanceled ? "bg-red-50 border-red-100" : "bg-white",
            )}
            animate={isCanceled ? { rotate: 0 } : { y: [0, -2, 0] }}
            transition={
              isCanceled
                ? { duration: 0.2 }
                : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            }>
            <Truck className={clsx("w-5 h-5", isCanceled ? "text-red-500" : "text-blue-600")} />
          </motion.div>
        </motion.div>

        <div className="mt-6 grid grid-cols-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span className={step >= 0 && !isCanceled ? "text-gray-800 font-semibold" : ""}>
              {t.placed}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className={step >= 1 && !isCanceled ? "text-gray-800 font-semibold" : ""}>
              {t.processing}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" />
            <span className={step >= 2 && !isCanceled ? "text-gray-800 font-semibold" : ""}>
              {t.shipped}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className={step >= 3 && !isCanceled ? "text-gray-800 font-semibold" : ""}>
              {t.delivered}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------
// Small UI blocks
// ------------------------
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="h-9 w-9 rounded-xl border bg-white grid place-items-center">
      <Icon className="w-5 h-5 text-gray-800" />
    </span>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-900 text-right break-words">{value ?? "-"}</p>
  </div>
);

// ------------------------
// Page
// ------------------------
const Order = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const language = useSelector((state) => state.language.lang); // ✅ language from redux
  const { orderId } = useParams();
  const { data: order } = useGetOrderQuery(orderId);

  const t =
    language === "ar"
      ? {
          // Header
          thanksTitle: "تم تسجيل الطلب، شكرًا لك",
          wellUpdate: "سنبقيك على اطلاع مع تقدم طلبك في التوصيل.",

          // Progress
          shippingStatus: "حالة الشحن",
          orderCanceled: "تم إلغاء الطلب",
          deliveredOn: "تم التوصيل بتاريخ",
          onTheWay: "في الطريق إليك",
          canceled: "ملغي",
          delivered: "تم التوصيل",
          inTransit: "قيد التوصيل",
          placed: "تم الطلب",
          processing: "قيد المعالجة",
          shipped: "تم الشحن",

          // Order box
          orderId: "رقم الطلب",
          full: "كامل",
          created: "تاريخ الإنشاء",
          product: "المنتج",
          colorSize: "اللون/المقاس",
          qty: "الكمية",
          price: "السعر",
          total: "الإجمالي",

          // Totals
          subtotal: "المجموع الفرعي",
          shipping: "الشحن",
          grandTotal: "الإجمالي",

          // Right cards
          customer: "العميل",
          name: "الاسم",
          email: "البريد الإلكتروني",
          shippingAddress: "عنوان الشحن",
          governorate: "المحافظة",
          city: "المنطقة",
          block: "قطعة",
          street: "شارع",
          house: "منزل",

          // Buttons
          downloadInvoice: "تحميل الفاتورة",
          contactUs: "تواصل معنا",
        }
      : {
          // Header
          thanksTitle: "Order placed, Thank you",
          wellUpdate: "We’ll keep you updated as your order moves through delivery.",

          // Progress
          shippingStatus: "Shipping status",
          orderCanceled: "Order canceled",
          deliveredOn: "Delivered on",
          onTheWay: "On the way to you",
          canceled: "Canceled",
          delivered: "Delivered",
          inTransit: "In transit",
          placed: "Placed",
          processing: "Processing",
          shipped: "Shipped",

          // Order box
          orderId: "Order ID",
          full: "Full",
          created: "Created",
          product: "Product",
          colorSize: "Color/Size",
          qty: "Qty",
          price: "Price",
          total: "Total",

          // Totals
          subtotal: "Subtotal",
          shipping: "Shipping",
          grandTotal: "Total",

          // Right cards
          customer: "Customer",
          name: "Name",
          email: "Email",
          shippingAddress: "Shipping Address",
          governorate: "Governorate",
          city: "City",
          block: "Block",
          street: "Street",
          house: "House",

          // Buttons
          downloadInvoice: "Download Invoice",
          contactUs: "Contact us",
        };

  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${order?.createdAt?.substring(0, 10)}.pdf`,
  });

  const calculateSubtotal = () => {
    const subtotal =
      order?.orderItems?.reduce((total, item) => total + item.qty * item.price, 0) || 0;
    return subtotal.toFixed(3);
  };

  const calculateTotal = () => {
    const subtotal = Number(calculateSubtotal());
    const shipping = Number(order?.shippingPrice || 0);
    return (subtotal + shipping).toFixed(3);
  };

  const handlePdf = () => toPDF();

  return (
    <Layout>
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="mt-[70px] mx-auto py-10 min-h-screen px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center justify-center lg:flex-row lg:items-end lg:justify-between gap-3">
            <div>
              <h1 className="text-2xl text-center sm:text-left lg:text-3xl font-black text-gray-900">
                {t.thanksTitle} <span className="text-red-500">&hearts;</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">{t.wellUpdate}</p>
            </div>
          </div>

          {/* Shipping progress */}
          <ShippingProgress order={order} t={t} />

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Items + totals */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border p-4 lg:p-6">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t.orderId}</p>
                    <h2 className="text-base lg:text-xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-gray-100 px-3 py-1">
                        #{String(order?._id).slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold">
                        ({t.full}: {order?._id})
                      </span>
                      <Copy content={order?._id} />
                    </h2>
                  </div>

                  <div className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-800">{t.created}:</span>{" "}
                    {order?.createdAt?.substring(0, 10) || "-"}
                  </div>
                </div>

                {/* Items (Desktop table) */}
                <div className="hidden lg:block">
                  <div className="rounded-xl border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                            {t.product}
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                            {t.colorSize}
                          </th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600">
                            {t.qty}
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">
                            {t.price}
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">
                            {t.total}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {order?.orderItems?.map((item) => (
                          <tr key={item._id} className="border-b last:border-b-0 text-sm">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item?.variantImage?.[0]?.url || item?.image?.[0]?.url}
                                  alt={item.name}
                                  className="w-12 h-12 bg-zinc-100/50 border object-cover rounded-xl"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 truncate max-w-[280px]">
                                    {item.name}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-gray-700">
                              {item.variantColor || item.variantSize
                                ? `${item.variantColor || "-"} / ${item.variantSize || "-"}`
                                : "-"}
                            </td>

                            <td className="py-3 px-4 text-center font-semibold">{item.qty}</td>
                            <td className="py-3 px-4 text-right text-gray-700">
                              {item.price.toFixed(3)} KD
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-gray-900">
                              {(item.qty * item.price).toFixed(3)} KD
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Items (Mobile cards) */}
                <div className="lg:hidden space-y-3">
                  {order?.orderItems?.map((item) => (
                    <div key={item._id} className="rounded-xl border bg-white p-3">
                      <div className="flex gap-3">
                        <img
                          src={item?.variantImage?.[0]?.url || item?.image?.[0]?.url}
                          alt={item.name}
                          className="w-14 h-14 bg-zinc-100/50 border object-cover rounded-xl shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-black text-sm text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.variantColor || item.variantSize
                              ? `${item.variantColor || "-"} / ${item.variantSize || "-"}`
                              : "-"}
                          </p>

                          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                            <div className="rounded-lg bg-gray-50 border px-2 py-1.5">
                              <p className="text-gray-500">{t.qty}</p>
                              <p className="font-bold text-gray-900">{item.qty}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 border px-2 py-1.5">
                              <p className="text-gray-500">{t.price}</p>
                              <p className="font-bold text-gray-900">{item.price.toFixed(3)}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 border px-2 py-1.5">
                              <p className="text-gray-500">{t.total}</p>
                              <p className="font-bold text-gray-900">
                                {(item.qty * item.price).toFixed(3)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals (FULL WIDTH ✅) */}
                <div className="mt-5">
                  <div className="w-full rounded-2xl border bg-gray-50 p-4">
                    <InfoRow label={t.subtotal} value={`${calculateSubtotal()} KD`} />
                    <div className="h-px bg-gray-200" />
                    <InfoRow
                      label={t.shipping}
                      value={`${Number(order?.shippingPrice || 0).toFixed(3)} KD`}
                    />
                    <div className="h-px bg-gray-200" />
                    <div className="flex items-center justify-between pt-3">
                      <p className="text-sm font-semibold text-gray-700">{t.grandTotal}</p>
                      <p className="text-lg font-black text-gray-900">{calculateTotal()} KD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: customer + address */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border p-4 lg:p-6">
                <SectionTitle icon={User2} title={t.customer} />
                <div className="divide-y">
                  <InfoRow label={t.name} value={userInfo?.name} />
                  <InfoRow label={t.email} value={userInfo?.email} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-4 lg:p-6">
                <SectionTitle icon={MapPin} title={t.shippingAddress} />
                <div className="divide-y">
                  <InfoRow label={t.governorate} value={order?.shippingAddress?.governorate} />
                  <InfoRow label={t.city} value={order?.shippingAddress?.city} />
                  <InfoRow label={t.block} value={order?.shippingAddress?.block} />
                  <InfoRow label={t.street} value={order?.shippingAddress?.street} />
                  <InfoRow label={t.house} value={order?.shippingAddress?.house} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
            <button
              onClick={handlePdf}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold
                bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm">
              <Receipt className="w-4 h-4" />
              {t.downloadInvoice}
            </button>

            <Link
              to="mailto:hn98q8@hotmail.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold
                bg-white border text-gray-800 hover:bg-gray-50 transition shadow-sm">
              <Mail className="w-4 h-4" />
              {t.contactUs}
            </Link>
          </div>
        </div>

        {/* Hidden invoice template for PDF generation */}
        <div
          ref={targetRef}
          style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            height: "auto",
            width: "auto",
          }}>
          <Invoice order={order} />
        </div>
      </div>
    </Layout>
  );
};

export default Order;

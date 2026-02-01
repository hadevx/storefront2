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
const ShippingProgress = ({ order }) => {
  const isCanceled = !!order?.isCanceled;
  const isDelivered = !!order?.isDelivered;

  // 0 = placed, 1 = processing, 2 = shipped, 3 = delivered
  const step = isCanceled ? 0 : isDelivered ? 3 : 1;

  const label = isCanceled
    ? "Order canceled"
    : isDelivered
      ? `Delivered on ${order?.deliveredAt?.substring(0, 10)}`
      : "On the way to you";

  const truckX = step === 0 ? "0%" : step === 1 ? "35%" : step === 2 ? "70%" : "100%";

  return (
    <div className="rounded-2xl border bg-white p-4 lg:p-6 shadow-sm mb-6 overflow-hidden">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-gray-500 mb-1">Shipping status</p>
          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
        </div>

        {isCanceled ? (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
            <XCircle className="w-4 h-4" /> Canceled
          </span>
        ) : isDelivered ? (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4" /> Delivered
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
            <Truck className="w-4 h-4" /> In transit
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
              Placed
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className={step >= 1 && !isCanceled ? "text-gray-800 font-semibold" : ""}>
              Processing
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" />
            <span className={step >= 2 && !isCanceled ? "text-gray-800 font-semibold" : ""}>
              Shipped
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className={step >= 3 && !isCanceled ? "text-gray-800 font-semibold" : ""}>
              Delivered
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
  const { orderId } = useParams();
  const { data: order } = useGetOrderQuery(orderId);

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
      <div className="mt-[70px] mx-auto py-10 min-h-screen px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center justify-center  lg:flex-row lg:items-end lg:justify-between gap-3">
            <div className="">
              <h1 className="text-2xl  text-center sm:text-left lg:text-3xl font-black text-gray-900">
                Order placed, Thank you <span className="text-red-500">&hearts;</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                We’ll keep you updated as your order moves through delivery.
              </p>
            </div>
          </div>

          {/* Shipping progress */}
          <ShippingProgress order={order} />

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Items + totals */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border p-4 lg:p-6">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <h2 className="text-base lg:text-xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-gray-100 px-3 py-1">
                        #{String(order?._id).slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold">
                        (Full: {order?._id})
                      </span>
                      <Copy content={order?._id} />
                    </h2>
                  </div>

                  <div className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-800">Created:</span>{" "}
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
                            Product
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                            Color/Size
                          </th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600">
                            Qty
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">
                            Price
                          </th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">
                            Total
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
                              <p className="text-gray-500">Qty</p>
                              <p className="font-bold text-gray-900">{item.qty}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 border px-2 py-1.5">
                              <p className="text-gray-500">Price</p>
                              <p className="font-bold text-gray-900">{item.price.toFixed(3)}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 border px-2 py-1.5">
                              <p className="text-gray-500">Total</p>
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

                {/* Totals */}
                <div className="mt-5 flex justify-end">
                  <div className="w-full sm:w-[320px] rounded-2xl border bg-gray-50 p-4">
                    <InfoRow label="Subtotal" value={`${calculateSubtotal()} KD`} />
                    <div className="h-px bg-gray-200" />
                    <InfoRow
                      label="Shipping"
                      value={`${Number(order?.shippingPrice || 0).toFixed(3)} KD`}
                    />
                    <div className="h-px bg-gray-200" />
                    <div className="flex items-center justify-between pt-3">
                      <p className="text-sm font-semibold text-gray-700">Total</p>
                      <p className="text-lg font-black text-gray-900">{calculateTotal()} KD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: customer + address */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border p-4 lg:p-6">
                <SectionTitle icon={User2} title="Customer" />
                <div className="divide-y">
                  <InfoRow label="Name" value={userInfo?.name} />
                  <InfoRow label="Email" value={userInfo?.email} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-4 lg:p-6">
                <SectionTitle icon={MapPin} title="Shipping Address" />
                <div className="divide-y">
                  <InfoRow label="Governorate" value={order?.shippingAddress?.governorate} />
                  <InfoRow label="City" value={order?.shippingAddress?.city} />
                  <InfoRow label="Block" value={order?.shippingAddress?.block} />
                  <InfoRow label="Street" value={order?.shippingAddress?.street} />
                  <InfoRow label="House" value={order?.shippingAddress?.house} />
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
              Download Invoice
            </button>

            <Link
              to="mailto:hn98q8@hotmail.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold
                bg-white border text-gray-800 hover:bg-gray-50 transition shadow-sm">
              <Mail className="w-4 h-4" />
              Contact us
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

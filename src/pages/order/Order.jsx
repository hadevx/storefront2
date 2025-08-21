import Layout from "../../Layout";
import { useGetOrderQuery } from "../../redux/queries/orderApi";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Package, Truck, CreditCard, Mail } from "lucide-react";
import { usePDF } from "react-to-pdf";
import { useRef } from "react";
import Invoice from "../../components/Invoise";
import Badge from "../../components/Badge";
import { Copy } from "@medusajs/ui";

const Order = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const { orderId } = useParams();
  const { data: order } = useGetOrderQuery(orderId);

  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${order?.createdAt.substring(0, 10)}.pdf`,
  });

  const calculateSubtotal = () => {
    return order?.orderItems.reduce((total, item) => total + item.qty * item.price, 0).toFixed(3);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return (Number(subtotal) + Number(order?.shippingPrice)).toFixed(3);
  };
  const handlePdf = () => {
    toPDF();
  };
  return (
    <Layout>
      <div className="container mt-5 mx-auto p-4  min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Order placed, Thank you &hearts;
          </h1>
          <div className="bg-white rounded-lg shadow border p-6 mb-6">
            <div className="flex  justify-between items-center mb-4">
              <div>
                <h2 className="text-sm lg:text-xl lg:flex lg:items-center lg:gap-2 font-semibold text-gray-800">
                  Id #{order?._id} <Copy content={order?._id} />
                </h2>
                <p className="text-sm text-gray-600">
                  Placed on {order?.createdAt?.substring(0, 10)}
                </p>
              </div>
              <span className="px-3 py-1  rounded-full text-xs font-medium">
                {order?.isDelivered ? (
                  <Badge variant="success">
                    Delivered on {order?.deliveredAt?.substring(0, 10)}
                  </Badge>
                ) : order?.isCanceled ? (
                  <Badge variant="danger">Canceled</Badge>
                ) : (
                  <Badge variant="pending">Processing</Badge>
                )}
              </span>
            </div>
            <div className="mb-6">
              {/* <h3 className="text-lg font-semibold mb-2">Products</h3> */}
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-center py-2">Quantity</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.orderItems.map((item) => (
                    <tr key={item._id} className="border-b text-sm">
                      <td className="py-2">{item.name}</td>
                      <td className="text-center py-2">{item.qty}</td>
                      <td className="text-right py-2">{item.price.toFixed(3)} KD</td>
                      <td className="text-right py-2">{(item.qty * item.price).toFixed(3)} KD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-3">Subtotal: {calculateSubtotal()} KD</p>
                <p className="text-sm text-gray-600 mb-3">
                  Shipping: {order?.shippingPrice.toFixed(3)} KD
                </p>
                <p className="text-lg font-semibold text-gray-800 mt-2">
                  Total: {calculateTotal()} KD
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <p className="font-medium">{userInfo?.name}</p>
            <p className="text-sm text-gray-600">{userInfo?.email}</p>
            <p className="text-sm text-gray-600 mt-2">
              {order?.shippingAddress?.governorate},{order?.shippingAddress?.city},
              {order?.shippingAddress?.block},{order?.shippingAddress?.street},
              {order?.shippingAddress?.house}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={handlePdf}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Download Invoice
            </button>
            <Link
              to="mailto:hn98q8@hotmail.com"
              className="bg-gray-300 flex gap-3 hover:bg-gray-400 text-gray-600 font-bold py-2 px-4 rounded transition duration-300">
              Contact us <Mail />
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

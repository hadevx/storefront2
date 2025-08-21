import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { CheckCircle2, AlertTriangle } from "lucide-react";

function PaymentCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract the 'tap_id' param from URL
  const queryParams = new URLSearchParams(location.search);
  const tapId = queryParams.get("tap_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Call backend endpoint to verify payment by tap_id
        const res = await axios.get(`/api/payment/verify/${tapId}`);

        if (res.data.status === "success") {
          toast.success("Payment successful!");
          // Redirect to order page or homepage
          navigate(`/order/${res.data.orderId}`);
        } else {
          toast.error("Payment failed or canceled.");
          setError("Payment failed or canceled.");
        }
      } catch (err) {
        setError("Failed to verify payment.");
        toast.error("Failed to verify payment.");
      } finally {
        setLoading(false);
      }
    };

    if (tapId) {
      verifyPayment();
    } else {
      setError("No transaction ID provided.");
      setLoading(false);
    }
  }, [tapId, navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {error ? (
        <div className="max-w-md w-full bg-red-50 border border-red-300 rounded-lg p-8 text-center shadow-md">
          <AlertTriangle className="mx-auto mb-4 text-red-600" size={48} />
          <h2 className="text-2xl font-semibold text-red-700 mb-2">Oops!</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/cart")}
            className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
            Back to Cart
          </button>
        </div>
      ) : (
        <div className="max-w-md w-full bg-green-50 border border-green-300 rounded-lg p-8 text-center shadow-md">
          <CheckCircle2 className="mx-auto mb-4 text-green-600" size={48} />
          <h2 className="text-2xl font-semibold text-green-700 mb-2">Payment Verified!</h2>
          <p className="text-green-600 mb-4">Thank you for your purchase.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentCallback;

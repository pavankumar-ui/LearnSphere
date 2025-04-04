import { useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { AuthContext } from "../../context/auth-context";
import Loading from "../../components/Student/Loading";

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backend_url } = useContext(AppContext);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const sessionId = searchParams.get("session_id");

  const verifyPaymentSession = async () => {
    if (!sessionId || !token) {
      toast.error("Missing required verification parameters");
      return; // ❌ Do NOT navigate immediately
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backend_url}/student/verify-payment`,
        {
          params: { sessionId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Verification Response:", data);

      console.log("🔍 Payment Verification Initiated:", {
        sessionId: searchParams.get("session_id"),
        userExists: Boolean(user?._id),
        token: token ? "✅ Exists" : "❌ Missing",
      });

      if (data.success) {
        toast.success(data.message || "Enrollment successful!");
        navigate(`/course/${data.courseId}`); // ✅ Only navigate on success
      } else {
        toast.warning(data.message || "Payment verification pending");
        // ❌ Do NOT navigate, just show a message and allow retry
      }
    } catch (err) {
      console.error("🚨 Payment Verification Failed:", err);
      toast.error(err.response?.data?.message || "Payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🛠 useEffect Triggered:", { sessionId, token });

    if (!sessionId || !token) {
      console.warn("⚠️ Missing sessionId or token. Skipping verification.");
      return;
    }

    console.log("📡 Calling verifyPaymentSession...");
    verifyPaymentSession();
  }, [sessionId, token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2>🔍 Payment Verification</h2>
      <p>Click below to verify your payment status.</p>

      <button
        onClick={verifyPaymentSession}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Verify Payment
      </button>

      {loading && <Loading />}
    </div>
  );
};

export default VerifyPayment;

import { useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { AuthContext } from "../../context/auth-context";

const VerifyPayment = () => {

    console.log("✅ VerifyPayment component is mounted!");

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const {backend_url} = useContext(AppContext);
  const {token} = useContext(AuthContext);
  const navigate = useNavigate();


  const verifyPaymentSession = async () => {
    if (!sessionId && !token) {
      toast.error("Payment session ID and token is  missing.");
      navigate("/course-list");
      return;
    }

    try {

      console.log("📡 Sending request to verify session:", sessionId);
        console.log("🔵 Token:", token);
      const { data } = await axios.get(
        `${backend_url}/student/verify-payment?sessionId=${sessionId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
       
      console.log("🟢 Payment verification response:", data);



      if (data.success) {
        toast.success(data.message);
        navigate(`/course/${data.courseId}`);
      } else {
        toast.error(data.message);
        navigate("/course-list");
      }
    } catch (err) {
      console.error("🔴 Payment verification error:", err.response?.data || err.message);
      toast.error("Payment verification failed.");
      navigate("/course-list");
    }
  };

  useEffect(() => {
    verifyPaymentSession();
  }, [sessionId, navigate]);

  return <p>Verifying payment, please wait...</p>;
};

export default VerifyPayment;

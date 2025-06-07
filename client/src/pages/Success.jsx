import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect } from "react";
const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
    useEffect(() => {
      
    if (!location.state?.fromCheckout) {
      navigate("/", { replace: true }); // Redirect to home or cart if invalid access
    }
    sessionStorage.setItem("orderCompleted", "true");
  }, [location, navigate]);


  return (
    <div className="h-screen flex flex-col justify-center items-center">
        <DotLottieReact
          src="https://lottie.host/4abbbcd9-3d45-442f-91cd-46d38d9a2ae9/0bI74jnTqW.lottie"
          loop
          autoplay
          className="h-60 w-60"
        />
      <div className="m-2 w-full max-w-md   p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5 lg:mt-20">

        <p className="text-green-800 font-bold text-2xl text-center">
          {Boolean(location?.state?.text)
            ? location?.state?.text
            : "Your Order"}{" "}
          <br /> Placed Successfully
        </p>
        <Link
          to="/"
          className="border shadow-inner rounded-full  bg-green-600 text-white transition-all px-4 py-1"
        >
          Go To Home
        </Link>
      </div>
    </div>
  );
};

export default Success;

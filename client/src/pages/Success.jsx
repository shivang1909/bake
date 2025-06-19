import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect } from "react";
const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() =>{
    setTimeout(() => {
      navigate("/")
    }, 10000);
  },[]);
    useEffect(() => {
    if (!location.state?.fromCheckout) {
      navigate("/", { replace: true }); // Redirect to home or cart if invalid access
    }
    sessionStorage.setItem("orderCompleted", "true");
  }, [location, navigate]);




  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="w-64 h-64">
        <DotLottieReact
      src="https://lottie.host/03f7db08-b7a7-4a86-b50c-fed2b7d44f97/q124gabOQM.lottie"
      loop
      autoplay
      style={{ width: '100%', height: '100%' }}
    />
      </div>
        
      <div className="m-2 w-full max-w-md p-4 py-1 rounded mx-auto flex flex-col justify-center items-center gap-5 lg:mt-20">


        <p className="text-green-800 font-bold text-xl text-center">
          {Boolean(location?.state?.text)
            ? location?.state?.text
            : "Your Order"}{" "}
          <br /> Placed Successfully
        </p>
         
<Link to="/dashboard/myorders">
  <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300">
    View Your Order Details
  </button>
</Link>
        {/* <Link
          to="/"
          className="border shadow-inner rounded-full  bg-green-600 text-white transition-all px-4 py-1"
        >
          Go To Home
        </Link>  */}
        We Will redirect You soon...
      </div>
    </div>
  );
};


export default Success;
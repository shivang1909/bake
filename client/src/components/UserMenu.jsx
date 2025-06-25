import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { HiOutlineExternalLink } from "react-icons/hi";
import User from "../assets/BottomIcon/user.png";
import Address from "../assets/BottomIcon/location.png";
import Track from "../assets/BottomIcon/pending.png";
import Logout from "../assets/BottomIcon/switch.png";
import Tracking from "../assets/BottomIcon/order-tracking.png";
import { FaArrowRightLong } from "react-icons/fa6";
import { setIsCartOpen } from "../store/loadingSlice";

const UserMenu = ({ close, open }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


   const handleopencart = () => {
     // Close the user menu and open the cart
     dispatch(setIsCartOpen(true));
     close();
  }


  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [open]);


  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        if (close) close();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      AxiosToastError(error);
    }
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        close(); // auto-close when on large screens
      }
    };


    window.addEventListener('resize', handleResize);


    // Initial check too (just in case)
    if (window.innerWidth > 1024) {
      close();
    }


    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // Only render on small/medium devices
  if (window.innerWidth > 1024) return null;


  return (
    <>
      {/* Backdrop */}
      <div
        className={`
    fixed inset-0 bg-zinc-800/60 backdrop-blur-[3px] z-40
    transition-opacity duration-300 ease-out
    ${
      open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }
  `}
        onClick={close}
      />
      {/* Bottom Drawer */}
      <div
        className={`
    fixed min-h-[50%] md:min-h-[48%] bg-gray-50 bottom-0 left-0 right-0 z-50 rounded-t-3xl p-4 max-[375px]:px-10 px-16 pb-8
        ${
          open
            ? "pointer-events-auto  translate-y-0 "
            : "pointer-events-none  translate-y-full"
        }
   duration-300 ease-out
  `}
      >
        {/* Drag Handle & Close Button */}
        <div className="flex justify-center relative mb-2" onClick={close}>
          {/* Drag Handle Line */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mt-2"></div>
        </div>


        {/* Drawer Title */}
        <div className="font-bold text-lg md:text-2xl text-center py-3 md:py-5">
          My Account
        </div>
        <div className="my-2 border-gray-200" />
        <div className="md:flex md:gap-5">
          {/* Grid Menu */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-x-7 gap-y-5 text-sm mt-2 md:w-2/5">
            <Link
              to="/Dashboard/Myprofile" onClick={close}
              className="hover:bg-orange-200 bg-white p-5 md:hidden rounded-2xl text-center text-xs font-medium md:text-lg shadow-md  flex flex-col md:flex-row justify-left items-center gap-4  transition duration-300 active:scale-90"
            >
              <img src={User} alt="" className="h-8 md:h-10 w-8 md:w-10" />
              My Profile
            </Link>


            <Link
              to="/Dashboard/myorders"
              onClick={close}
              className="hover:bg-blue-200 bg-white p-5 rounded-2xl text-center text-xs font-medium md:text-lg shadow-md  flex flex-col md:flex-row justify-left items-center gap-4  transition duration-300 active:scale-90"
            >
              <img src={Track} alt="" className="h-8 md:h-10 w-8 md:w-10" />
              My Order
            </Link>


            <Link
              to="/Dashboard/address"
              onClick={close}
              className="hover:bg-green-200 bg-white p-5 rounded-2xl text-center text-xs font-medium md:text-lg shadow-md  flex flex-col md:flex-row justify-left items-center gap-4  transition duration-300 active:scale-90"
            >
              <img src={Address} alt="" className="h-8 md:h-10 w-8 md:w-10" />
              Address
            </Link>


            <div
              className="hover:bg-green-200 bg-white p-5 rounded-2xl text-center text-xs font-medium md:text-lg shadow-md  flex flex-col md:flex-row justify-left items-center gap-4  transition duration-300 active:scale-90"
              onClick={handleopencart}
           >
              <img src={Tracking} alt="" className="h-8 md:h-10 w-8 md:w-10" />
              Your Cart
            </div>
            <button
              onClick={handleLogout}
             
              className="hover:bg-green-200 bg-white p-5 rounded-2xl text-center text-xs font-medium md:text-lg shadow-md  flex flex-col md:flex-row justify-left items-center gap-4 hidden md:block md:flex transition duration-300 active:scale-90"
            >
              <img src={Logout} alt="" className="h-8 md:h-10 w-8 md:w-10" />
              Log Out
            </button>
          </div>


          <div className="hidden md:flex md:flex-col md:w-3/5 justify-start items-center  gap-5 md:mx-6 md:py-6 rounded-3xl shadow-md bg-white">
            <div className="relative">
              <img
                src={user.profile || User}
                alt="Profile"
                className="rounded-full w-44 h-44 object-cover border-4 border-gray-300"
              />
            </div>
            <div className="sm:hidden md:block">
              <h2 className="text-2xl font-bold text-center">
                {user.name || "Guest"}
              </h2>
              <p className="text-black text-md text-center">+91 6353157921</p>
            </div>
            <Link
              to=""
              className="hover:bg-orange-200 bg-white py-3 px-20 sm:hidden md:block rounded-full text-center text-xs font-medium md:text-lg border border-gray-400 flex flex-col md:flex-row justify-left items-center transition duration-300 active:scale-90"
            >
              <span className="flex items-center gap-2">
                 My Profile <FaArrowRightLong />


              </span>
             


            </Link>
          </div>
        </div>


        {/* Logout Button */}
        <div className="grid grid-cols-1 text-sm mt-8 md:hidden">
          <button
            onClick={handleLogout}
            className="hover:bg-red-200 bg-white p-5 rounded-2xl text-center text-xs font-medium md:text-lg shadow-md flex flex-col md:flex-row justify-center items-center gap-2  w-full transition duration-300 active:scale-90"
          >
            <img src={Logout} alt="" className="h-8 md:h-10 w-8 md:w-10" />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};


export default UserMenu;

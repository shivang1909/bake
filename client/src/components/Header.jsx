import React, { useEffect, useMemo, useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import {setIsCartOpen} from "../store/loadingSlice"
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { IoNotificationsOutline } from "react-icons/io5";
import useSSE from "../hooks/useSSE";
import { useCallback } from "react";


const Header = () => {
  const dispatch = useDispatch();
  const {fetchCartDetails,totalQty} = useGlobalContext()
  const [isMobile] = useMobile();
  const location = useLocation();
  const isCheckOut = location.pathname === "/dashboard/checkout";
  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([  ]);
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const isCartOpen = useSelector((state) => state?.loading.isCartOpen);
  
  
const handleAdminEvent = useCallback((data) => {
  console.log('🛠️ Admin got update:', data);
  setNotifications((prev) => [...prev, data]);
}, []);

const CodUpdate = useCallback((data) => {
  console.log('🛠️ COD change :', data);
  setNotifications((prev) => [...prev, data]);
}, []);

 const Delivery_notification = useCallback((data) => {
  console.log('🛠️ Delivery notification:', data);
  setNotifications((prev) => [...prev, data.message]);
}, []); 
const eventHandlers = useMemo(() => ({
  'admin-event': handleAdminEvent,
  'cod-status-update': CodUpdate,
  'Delivery-notification': Delivery_notification
}), [handleAdminEvent, CodUpdate,Delivery_notification]);

useSSE(eventHandlers);
   
  
  // Fetch Cart Details
  useEffect(() => {
   

    fetchCartDetails();
  }, [isCartOpen]);
 
  const redirectToLoginPage = () => {
    navigate("/login");
  };
  const redirectToAdminLoginPage = () => {
    navigate("/admin/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }

    navigate("/user");
  };
  const handleOpenCart = () => {
    if (isCheckOut) {
      const confirmLeave = confirm("You have to leave this page to open your cart");
      if (confirmLeave) {
        dispatch(setIsCartOpen(true));
        navigate("/");
      }
      else{
        return
      }
  }
  else{
    dispatch(setIsCartOpen(true));
  }
}

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/**logo */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          {/**Search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/**login and my cart */}
          <div className="">
            {/**user icons display in only mobile version**/}
            <button
              className="text-neutral-600 lg:hidden"
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={26} />
            </button>
            <div className="relative">
              <button onClick={toggleNotification} className="relative text-neutral-600">
                <IoNotificationsOutline size={26} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{notifications.length}</span>
                )}
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 top-10 w-64 bg-white shadow-lg rounded-md p-3 max-h-48 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif, index) => (
                      <p key={index} className="text-sm p-2 border-b last:border-none">{notif}</p>
                    ))
                  ) : (
                    <p className="text-sm p-2">No new notifications</p>
                  )}
                </div>
              )}
            </div>

            {/**Desktop**/}
            <div className="hidden lg:flex  items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((preve) => !preve)}
                    className="flex select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={redirectToAdminLoginPage}
                    className="text-lg px-2"
                  >
                    Admin Login
                  </button>
                  <button
                    onClick={redirectToLoginPage}
                    className="text-lg px-2"
                  >
                    Login
                  </button>
                </>
              )}
              {
              /** Show "My Cart" only if the logged-in user has the role "User" */
              user?._id && user.role === "USER" && (
                <button
                  onClick={handleOpenCart}
                  className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white"
                >
                  {/** Add to cart icon */}
                  <div className="animate-bounce">
                    <BsCart4 size={26} />
                  </div>
                  <div className="font-semibold text-sm">
                    {totalQty ? (
                      <div>
                        <p>{totalQty} Items</p>
                      </div>
                    ) : (
                      <p>My Cart</p>
                    )}
                  </div>
                </button>
              )
            }

            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {isCartOpen && (
        <DisplayCartItem close={() => dispatch(setIsCartOpen(false))} />
      )}
    </header>
  );
};

export default Header;

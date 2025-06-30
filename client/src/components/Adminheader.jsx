import React, { useEffect, useMemo, useState } from "react";
import Logo from "../../assets/images/Custom/BakeFlavors.png";import Search from "./Search";
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
import NotificationBell from "./NotificationToggle";


const AdminHeader = () => {
  const dispatch = useDispatch();
  
  const [isMobile] = useMobile();
  const location = useLocation();
  const [notificationcount, setNotificationCount] = useState(0);
  const isCheckOut = location.pathname === "/dashboard/checkout";
  const toggleNotification = async () => {
    setIsNotificationOpen((prev) => !prev);
    if(notificationcount > 0){
      const response = await Axios(SummaryApi.updatenotification);
      setNotificationCount(0); // Reset the notification count when opened
    }

  };
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([  ]);
  const [newnotificationsid, setNewNotificationsId] = useState([]);
  
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const isCartOpen = useSelector((state) => state?.loading.isCartOpen);
  
  
const handleAdminEvent = useCallback((data) => {
  console.log('🛠️ Admin got update:', data);
  setNotifications((prev) => [...prev, data]);
  setNotificationCount((prev) => prev + 1); // Increment the notification count
}, []);

const CodUpdate = useCallback((data) => {
  console.log('🛠️ COD change :', data);
  setNotifications((prev) => [...prev, data]);
  setNotificationCount((prev) => prev + 1); // Increment the notification count
}, []);

 const Delivery_notification = useCallback((data) => {
  console.log('🛠️ Delivery notification:', data);
  setNotifications((prev) => [...prev, data]);
  setNotificationCount((prev) => prev + 1); // Increment the notification count 
}, []); 
const eventHandlers = useMemo(() => ({
  'admin-event': handleAdminEvent,
  'cod-status-update': CodUpdate,
  'Delivery-notification': Delivery_notification
}), [handleAdminEvent, CodUpdate,Delivery_notification]);

useSSE(eventHandlers);
    const getallnotification = async () => {
          const response = await Axios(SummaryApi.getnotification);
          console.log("Notification response",response)
              if (response.data) {
                const data = response.data;
                console.log("notification data",data)
                setNotificationCount(data.count);
                setNewNotificationsId(data.newnotificationsid);
                const notifications = data.notifications.map((item) => ({
                  message: item.message,
                  link: item.link,
                }));
                console.log("Notification data", notifications);
                setNotifications(notifications);
              }
    }
  
  useEffect(() => {
    try {
      console.log("Fetching notifications...");
      getallnotification();
    } catch (error) {
      console.log("eError fetching notifications:", error);  
    }
  }, []); 
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
                src={Logo}
                width={170}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={Logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

        
          {/**login and my cart */}
          <div className="">
            {/**user icons display in only mobile version**/}



            {/**Desktop**/}
            <div className="hidden lg:flex  items-center gap-10">
              {user?._id ? (
                  <span></span>
              ) : (
                <>
                  <button
                    onClick={redirectToAdminLoginPage}
                    className="text-lg px-2"
                  >
                    Admin Login
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
            {user?._id && (
              <NotificationBell></NotificationBell>
            )}
              
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

export default AdminHeader;

// import React from 'react'
// import UserMenu from '../components/UserMenu'
// import { Outlet } from 'react-router-dom'
// import { useSelector } from 'react-redux'

// const Dashboard = () => {
//   const user = useSelector(state => state.user)

//   console.log("user dashboard",user)
//   return (
//     <section className='bg-white'>
//         <div className='container '>
//                 {/**left for menu */}
//                 <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden  border-r'>
//                     {/* <UserMenu/> */}
//                 </div>

//                 {/**right for content */}
//                 <div className='bg-white min-h-[75vh] '>
//                     <Outlet/>
//                 </div>
//         </div>
//     </section>
//   )
// }

// export default Dashboard


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";
import MyOrders from "../pages/MyOrders";
import { BsChevronRight } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { TbTruckDelivery } from "react-icons/tb";
import { LuBox } from "react-icons/lu";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
// import "./Profile.css";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaPencilAlt } from "react-icons/fa";
import AddAddress from "../pages/Address";
import { Link, useNavigate } from "react-router-dom";
import { RiPencilFill } from "react-icons/ri";


const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const role = user.role;
  const dispatch = useDispatch();

    const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Listen to resize
    window.addEventListener("resize", handleResize);

    // Initial check
    if (window.innerWidth > 1024) {
      navigate("/dashboard/MyProfile"); // or home
    }

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Also check after resize
  useEffect(() => {
    if (screenWidth > 1024) {
      navigate("/dashboard/MyProfile");
    }
  }, [screenWidth]);

  const [activeSection, setActiveSection] = useState("profile");

  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
  const [openProfileAvatarEditMobile, setProfileAvatarEditMobile] =
    useState(false);
  //

  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    avatar: user.avatar,
    alt_Mobile: user.alt_Mobile || "",
  });
  const [loading, setLoading] = useState(false);
  const [showMobileSection, setShowMobileSection] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState("left"); // "left" or "right"

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      avatar: user.avatar,
      altMobile: user.altMobile || "",
    });
  }, [user]);

  const handleOnChange = (e) => {
    console.log("handleOnChange called", e.target.name, e.target.value);
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const apiCall =
        role === "USER"
          ? SummaryApi.updateUserDetails
          : SummaryApi.UpdateAdminDetails;
      const response = await Axios({ ...apiCall, data: userData });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        const updatedUser = await fetchUserDetails();
        dispatch(setUserDetails(updatedUser.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 md:mt-20 lg:mt-20 lg:h-[100vh] flex flex-col md:flex-row gap-3 max-w-7xl mx-auto font-medium  overflow-hidden">
      <div className="mobilemenusection md:hidden my-6 flex flex-col min-h-screen relative overflow-hidden">
        
        <div
          className={`flex transition-transform duration-500 ease-in-out w-[100%] h-full`}
        >
          {/* === LEFT PANEL: MENU === */}
          <div className="w-full h-full bg-white rounded-xl flex flex-col min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-xl flex items-center gap-4 px-4 py-4">
              <div className="rounded-full bg-gray-100 overflow-hidden flex items-center justify-center w-12 h-12">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaRegUserCircle size={50} className="text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-lg">{userData.name}</p>
                <p className="text-gray-500 text-sm">{userData.email}</p>
              </div>
            </div>

            {/* Sidebar Menu */}
            <div className="verflow-y-auto">
              <ul className="space-y-2 p-4">
                <li>
                  <button
                    className="flex justify-between w-full py-3 text-left"
                  >
                    <Link to="/dashboard/Myprofile">
                    <div className="flex gap-1 items-center">
                      <CgProfile size={20} className="text-gray-500" />
                      <span className="ml-2">Profile</span>
                    </div>
                    </Link>
                    <BsChevronRight />
                  </button>
                </li>
                <li>
                  <button
                    className="flex justify-between w-full py-3 text-left"
                  >
                    <Link to="/dashboard/myorders">
                      <div className="flex gap-1 items-center">
                      <LuBox size={20} className="text-gray-500" />
                      <span className="ml-2">My Orders</span>
                    </div>
                    </Link>
                  
                    <BsChevronRight />
                  </button>
                </li>
                <li>
                  <button
                   
                    className="flex justify-between w-full py-3 text-left"
                  >
                    <Link to="/dashboard/address">
                      <div className="flex gap-1 items-center">
                      <TbTruckDelivery size={20} className="text-gray-500" />
                      <span className="ml-2">Shipping Addresses</span>
                    </div>
                    </Link>
                  

                    <BsChevronRight />
                  </button>
                </li>
                <li>
                  <button
                   
                    className="flex justify-between w-full py-3 text-left"
                  >
                    <Link to="/AD">
                      <div className="flex gap-1 items-center">
                      <AiOutlineLogout size={20} className="text-red-500" />
                      <span className="ml-2 text-red-500">Logout</span>
                    </div>
                    </Link>
                  

                    <BsChevronRight className="text-red-500"/>
                  </button>
                </li>
                
              </ul>
            </div>

          
          </div>

          {/* === RIGHT PANEL: SECTION === */}
          {/* <div className="w-full h-full bg-white rounded-xl p-4 overflow-y-auto">
           
            <button
              onClick={() => setShowMobileSection(false)}
              className="text-3xl text-blue-600 underline mb-4"
            >
              <IoArrowBackOutline />
            </button>

            {activeSection === "profile" && (
              <div>
                <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-gray-100 shadow-md overflow-hidden flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaRegUserCircle size={80} className="text-gray-500" />
                    )}
                  </div>
                  <button
                    onClick={() => setProfileAvatarEditMobile(true)}
                    className="mt-3 text-sm px-5 py-1.5 border border-orange-400 text-orange-500 hover:bg-orange-100 rounded-full transition"
                  >
                    Edit Profile Photo
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 gap-5"
                >
                  <div className="grid my-3">
                    <div className="w-full relative flex rounded-xl">
                      <input
                        type="text"
                        name="name"
                        id="email"
                        value={userData.name}
                        onChange={handleOnChange}
                        className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white border border-gray-200 border-2 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                        required
                      />
                      <label
                        htmlFor="name"
                        className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                      >
                        Name
                      </label>
                    </div>
                  </div>

                  <div className="grid my-3">
                    <div className="w-full relative flex rounded-xl">
                      <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        value={userData.email}
                        onChange={handleOnChange}
                        className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                      />
                      <label
                        htmlFor="email"
                        className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                      >
                        Email
                      </label>
                    </div>
                  </div>

                  <div className="grid my-3">
                    <div className="w-full relative flex rounded-xl">
                      <input
                        required
                        type="text"
                        name="mobile"
                        value={userData.mobile}
                        onChange={handleOnChange}
                        id="mobile"
                        className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                      />
                      <label
                        htmlFor="mobile"
                        className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                      >
                        Mobile No
                      </label>
                    </div>
                  </div>

                  <div className="grid my-3">
                    <div className="w-full relative flex rounded-xl">
                      <input
                        name="altMobile"
                        onChange={handleOnChange}
                        value={userData.alt_Mobile}
                        type="text"
                        id="AltMobile"
                        className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                      />
                      <label
                        htmlFor="mobile"
                        className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                      >
                        Alternative Mobile No
                      </label>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
                    >
                      {loading ? "Loading..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {openProfileAvatarEditMobile && (
              
                  <UserProfileAvatarEdit
                    close={() => setProfileAvatarEditMobile(false)}
                  />
               
            )}

            {activeSection === "MyOrders" && (
              <div>
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => setShowMobileSection(false)}
                    className="text-3xl text-blue-600 underline mb-4"
                  >
                    <IoArrowBackOutline />
                  </button>
                  <span className="flex-grow text-lg font-semibold mb-2 text-center">
                    My Orders
                  </span>
                </div>

                <div className="overflow-y-auto h-[75vh] bg-gray-50 rounded-lg">
                  <MyOrders />
                </div>
              </div>
            )}

            {activeSection === "address" && (
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Shipping Addresses here
                </h2>
                <AddAddress />
              </div>
            )}

            {activeSection === "reviews" && (
              <div>
                <h2 className="text-lg font-semibold mb-2">My Reviews</h2>
              
              </div>
            )}
          </div> */}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:block md:w-1/4 lg:1/4 w-full bg-white  rounded-xl border  sticky ">
        <h2 className="text-lg lg:text-xl font-semibold mb-4 border-b pb-5 pt-5">Hello, {userData.name}</h2>
        <ul className="space-y-2 p-4">
          <li>
            <button
              onClick={() => setActiveSection("profile")}
              className={`w-full text-left text-md lg:text-lg  px-4 py-5 rounded-lg md:rounded-full md:w-fit md:p-5 ${
                activeSection === "profile"
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex gap-1 items-center justify-start">
                <CgProfile size={20} className="" />
                <span className="ml-2">Profile</span>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("MyOrders")}
              className={`w-full text-left text-md lg:text-lg  px-4 py-5 rounded-lg md:rounded-full md:w-fit md:p-5 ${
                activeSection === "MyOrders"
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex gap-1 items-center justify-start">
                <LuBox size={20} className="" />
                <span className="ml-2">My Orders</span>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("address")}
              className={`w-full text-left text-md lg:text-lg  px-4 py-5 rounded-lg md:rounded-full md:w-fit md:p-5 ${
                activeSection === "address"
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex gap-1 items-center justify-start">
                <TbTruckDelivery size={20} className="" />
                <span className="ml-2">Shipping Addresses</span>
              </div>
            </button>
          </li>
         
        </ul>
      </aside>

    </div>
  );
};

export default Dashboard;


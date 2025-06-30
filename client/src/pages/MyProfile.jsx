import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowUp, FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";
import MyOrders from "./MyOrders";
import { BsChevronRight } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { TbTruckDelivery } from "react-icons/tb";
import { LuBox } from "react-icons/lu";
import { IoCaretBackOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
// import "./Profile.css";
import { IoArrowBackOutline } from "react-icons/io5";

import AddAddress from "./Address";
import { Link, useNavigate } from "react-router-dom";
import ProfileSideBar from "../components/ProfileSideBar";
import { FaPencilAlt } from "react-icons/fa";
import Breadcrumbs from "../components/Breadcrumbs";

const MyProfile = () => {
  const user = useSelector((state) => state.user);
  const role = user.role;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
  const [openProfileAvatarEditMobile, setProfileAvatarEditMobile] =useState(false);
   const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
        const handleScroll = () => {
          setShowScrollTop(document.body.scrollTop > 200); // show button after 200px scroll
        };
    
        document.body.addEventListener("scroll", handleScroll);
        return () => document.body.removeEventListener("scroll", handleScroll);
      }, []);
      const scrollToTop = () => {
      document.body.scrollTo({ top: 0, behavior: "smooth" });
    };
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    avatar: user.avatar,
    alt_Mobile: user.alt_Mobile || "",
  });
  const [loading, setLoading] = useState(false);

 
 useEffect(() => {
  

    if(user.email === undefined)
    {
      navigate('/')    
    }
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      avatar: user.avatar,
      alt_Mobile: user.alt_Mobile || "",
    });
  }, [user]);

  

  const handleOnChange = (e) => {
  
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const response = await Axios({ ...SummaryApi.updateUserDetails, data: userData });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        const updatedUser = await fetchUserDetails();
        dispatch(setUserDetails(updatedUser.data));
      }
    } catch (error) {
        toast.error('Unable to Update Details ')
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="mt-10 md:mt-20 lg:mt-20 mb-10 flex flex-col md:flex-row md:gap-3 max-w-7xl mx-auto font-medium  overflow-hidden">

        
        <div>
          <ProfileSideBar activesection={"Myprofile"} />
        </div>

        <div className="md:w-3/4 w-full bg-white  rounded-xl p-6 h-full md:min-h-[100vh] mt-5 relative">
          <div className="flex flex-col items-center mb-8 relative">
            <div className="relative w-24 h-24">
              <div className="w-full h-full rounded-full bg-gray-100 shadow-md overflow-hidden flex items-center justify-center">
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

              {/* Pencil icon button */}
              <button
                onClick={() => setProfileAvatarEditMobile(true)}
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 border border-gray-300 shadow hover:bg-orange-100 transition"
              >
                <FaPencilAlt className="text-orange-500 text-sm" />
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
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
                  type="text"
                  name="alt_Mobile"
                  value={userData.alt_Mobile}
                  onChange={handleOnChange}
                  id="alt_Mobile"
                  className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
                />
                <label
                  htmlFor="alt_Mobile"
                  className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                >
                  Alternative Mobile No
                </label>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full md:w-fit bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
              >
                {loading ? "Loading..." : "Save Changes"}
              </button>
            </div>
          </form>
          {openProfileAvatarEditMobile && (
            <UserProfileAvatarEdit
              open={openProfileAvatarEditMobile}
              close={() => setProfileAvatarEditMobile(false)}
            />
          )}
        <button
                                onClick={scrollToTop}
                                className={`fixed bottom-5 right-5 z-40 w-[55px] h-[55px] rounded-full bg-gray-50/80 border border-gray-200 backdrop-blur-sm text-white p-3 shadow-inner transition-all duration-300 hover:bg-gray-100 hover:scale-110 active:scale-90 ${
                                  showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
                                }`}
                              >
                                <FaArrowUp className="w-full h-full text-orange-500" />
                              </button>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CgProfile } from "react-icons/cg";
import { TbTruckDelivery } from "react-icons/tb";
import { LuBox } from "react-icons/lu";

// import "./Profile.css";

import { Link } from "react-router-dom";

const ProfileSideBar =({activesection})=> {
   
    const user = useSelector((state) => state.user);
   

  return (
    <>
     <aside className="hidden md:block w-full bg-white  rounded-xl border h-full sticky mt-5">
            <h2 className="text-lg lg:text-xl font-semibold mb-4 border-b pb-5 pt-5">Hello, {user.name}</h2>
            <ul className="space-y-2 p-4">
              <li>
                <Link
                  to="/dashboard/Myprofile"
                 
                  className={`w-full text-left text-md lg:text-lg  px-4 py-5 rounded-lg md:rounded-full  md:p-5 ${
                    activesection === "Myprofile"
                      ? "bg-orange-100 text-orange-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex gap-1 items-center justify-start">
                    <CgProfile size={20} className="" />
                    <span className="ml-2">Profile</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/myorders"
                  
                  className={`w-full text-left text-md lg:text-lg  px-4 py-5 rounded-lg md:rounded-full  md:p-5 ${
                    activesection === "myorders"
                      ? "bg-orange-100 text-orange-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex gap-1 items-center justify-start">
                    <LuBox size={20} className="" />
                    <span className="ml-2">My Orders</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                 to="/dashboard/address"
                 
                 className={`w-full text-left text-md lg:text-lg  px-4 py-5 rounded-lg md:rounded-full  md:p-5 ${
                  activesection === "address"
                    ? "bg-orange-100 text-orange-600 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                  <div className="flex gap-1 items-center justify-start">
                    <TbTruckDelivery size={20} className="" />
                    <span className="ml-2">Shipping Addresses</span>
                  </div>
                </Link>
              </li>
             
            </ul>
          </aside>
    </>
  )
}

export default ProfileSideBar
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete, MdEdit } from "react-icons/md";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useGlobalContext } from "../provider/GlobalProvider";

import AddAddressDesktop from "../components/AddAddressDesktop";
import { Link, useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import ProfileSideBar from "../components/ProfileSideBar";
import { FaArrowUp } from "react-icons/fa";

const Address = () => {
  const [deleteconfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200); // show button after 200px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // const navigate = useNavigate();
  //     const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  //     useEffect(() => {
  //       const handleResize = () => {
  //         setScreenWidth(window.innerWidth);
  //       };

  //       // Listen to resize
  //       window.addEventListener("resize", handleResize);

  //       // Initial check
  //       if (window.innerWidth > 1024) {
  //         navigate("/dashboard"); // or home
  //       }

  //       // Cleanup
  //       return () => window.removeEventListener("resize", handleResize);
  //     }, []);

  //     // Also check after resize
  //     useEffect(() => {
  //       if (screenWidth > 1024) {
  //         navigate("/dashboard");
  //       }
  //     }, [screenWidth]);

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success("Address Removed");
        fetchAddress && fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOpenAddForm = () => {
    setFormMode("add");
    setEditData({});
    setOpenForm(true);
    setOpenAddress(true);
  };

  const handleOpenEditForm = (address) => {
    setFormMode("edit");
    setEditData(address);
    setOpenForm(true);
    setOpenAddress(true);
  };
  return (
    <>
      <div className="mt-10 md:mt-20 lg:mt-20 h-screen lg:h-[100vh] flex flex-col md:flex-row gap-3 max-w-7xl mx-auto font-medium  overflow-hidden">
        <div>
          <ProfileSideBar activesection={"address"} />
        </div>
        <div className="md:w-3/4 mt-5 ">
          {/* Header */}
          <div className="bg-white rounded-lg px-4 py-3 flex flex-col sm:flex-row justify-between items-center lg:items-start sm:items-center gap-2">
            <span className="font-semibold text-lg text-gray-800">
              Your Saved Addresses
            </span>
            <button
              onClick={handleOpenAddForm}
              className="w-full md:w-fit  border border-orange-400  px-4 py-1.5 rounded-full bg-orange-400 text-white transition"
            >
              + Add Address
            </button>
          </div>

          {/* Address List */}
          <div className="bg-white p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3  overflow-y-auto">
            {addressList
              .filter((address) => address.status)
              .map((address, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-300 rounded-2xl shadow-sm p-4 flex flex-col justify-between "
                >
                  <div className="space-y-1  text-gray-700">
                    <p className="font-medium text-lg text-gray-900 border-b py-1 flex gap-2 items-center">
                      <CiUser className="text-lg" />
                      {address.name}
                    </p>
                    <div className="content pl-2 py-2">
                      <p>{address.address_line1}</p>
                      {address.address_line2 && <p>{address.address_line2}</p>}
                      <p>
                        {address.city}, {address.state}
                      </p>
                      <p>
                        {address.country} - {address.pincode}
                      </p>
                    </div>

                    <p className="text-gray-600 mt-1 flex gap-2 items-center">
                      <IoCallOutline className="text-lg" /> {address.mobile}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleOpenEditForm(address)}
                      className="flex-1 text-sm text-green-600 border border-green-300 rounded-md py-1 hover:bg-green-600 hover:text-white transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm(true) & setDeleteId(address._id)
                      }
                      className="flex-1 text-sm text-red-600 border border-red-300 rounded-md py-1 hover:bg-red-600 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

            {/* Conditional Add Box */}

            {addressList.filter((address) => address.status).length == 0 && (
              <>
                <div
                  onClick={handleOpenAddForm}
                  className="w-full flex border-2 border-dashed border-gray-300 bg-white rounded-2xl cursor-pointer items-center justify-center hover:border-orange-200 transition h-full min-h-[200px] md:min-h-[120px]"
                >
                  <p className="text-gray-500 text-center px-5">
                    You don't have any address yet. <br /> Add Address now!
                  </p>
                </div>
              </>
            )}
            {addressList.filter((address) => address.status).length == 1 && (
              <>
                <div
                  onClick={handleOpenAddForm}
                  className="flex border-2 border-dashed border-gray-300 bg-white rounded-2xl cursor-pointer items-center justify-center hover:border-orange-200 transition h-full min-h-[200px] md:min-h-[120px]"
                >
                  <p className="text-gray-500 text-center px-5">
                    Add Your Work Address
                  </p>
                </div>
              </>
            )}
            {addressList.filter((address) => address.status).length == 2 && (
              <>
                <div
                  onClick={handleOpenAddForm}
                  className="flex border-2 border-dashed border-gray-300 bg-white rounded-2xl cursor-pointer items-center justify-center hover:border-orange-200 transition h-full min-h-[100px] md:min-h-[120px]"
                >
                  <p className="text-gray-500 text-center px-5">
                    Add Your Friend's Address
                  </p>
                </div>
              </>
            )}
          </div>
          {deleteconfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this address?</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={async () => {
                      await handleDisableAddress(deleteId);
                      setDeleteConfirm(false);
                      setDeleteId("");
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirm(false);
                      setDeleteId("");
                    }}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition ml-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Address Form Modal */}
          {openForm && (
            <AddAddressDesktop
              open={openAddress}
              mode={formMode}
              data={editData}
              close={() => setOpenForm(false)}
            />
          )}
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 z-40 w-[55px] h-[55px] rounded-full bg-gray-50/80 border border-gray-200 backdrop-blur-sm text-white p-3 shadow-inner transition-all duration-300 hover:bg-gray-100 hover:scale-110 active:scale-90 ${
          showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <FaArrowUp className="w-full h-full text-orange-500" />
      </button>
    </>
  );
};

export default Address;

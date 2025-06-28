import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete, MdEdit } from "react-icons/md";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useGlobalContext } from "../provider/GlobalProvider";

import AddAddressDesktop from "../components/AddAddressDesktop";
import { CiUser } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import ProfileSideBar from "../components/ProfileSideBar";
import { FaArrowUp } from "react-icons/fa";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteMobileModal, setShowDeleteMobileModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(document.body.scrollTop > 200);
    };
    document.body.addEventListener("scroll", handleScroll);
    return () => document.body.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showDeleteMobileModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteMobileModal]);

  const scrollToTop = () => {
    document.body.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteAddress = async (id) => {
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

  const openModal = (id) => {
    setSelectedAddressId(id);
    setShowDeleteModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  const openMobileModal = (id) => {
    setSelectedAddressId(id);
    setShowDeleteMobileModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => setShowDeleteModal(false), 300);
  };

  const closeMobileModel = () => {
    setAnimateModal(false);
    setTimeout(() => setShowDeleteMobileModal(false), 300);
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
      <div className="mt-10 md:mt-20 lg:mt-20 h-screen lg:h-[100vh] flex flex-col md:flex-row gap-3 max-w-7xl mx-auto font-medium overflow-hidden">
        <div>
          <ProfileSideBar activesection={"address"} />
        </div>
        <div className="md:w-3/4 mt-5">
          <div className="bg-white rounded-lg px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="font-semibold text-lg text-gray-800">
              Your Saved Addresses
            </span>
            <button
              onClick={handleOpenAddForm}
              className="w-full md:w-fit border border-orange-400 px-4 py-1.5 rounded-full bg-orange-400 text-white transition"
            >
              + Add Address
            </button>
          </div>

          <div className="bg-white p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
            {addressList.filter((a) => a.status).map((address, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded-2xl shadow-sm p-4 flex flex-col justify-between"
              >
                <div className="space-y-1 text-gray-700">
                  <p className="font-medium text-lg text-gray-900 border-b py-1 flex gap-2 items-center">
                    <CiUser className="text-lg" />
                    {address.name}
                  </p>
                  <div className="content pl-2 py-2">
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>{address.city}, {address.state}</p>
                    <p>{address.country} - {address.pincode}</p>
                  </div>
                  <p className="text-gray-600 mt-1 flex gap-2 items-center">
                    <IoCallOutline className="text-lg" /> {address.mobile}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleOpenEditForm(address)}
                    className="flex-1 text-sm text-green-600 border border-green-300 rounded-md py-1 hover:bg-green-600 hover:text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => window.innerWidth < 768 ? openMobileModal(address._id) : openModal(address._id)}
                    className="flex-1 text-sm text-red-600 border border-red-300 rounded-md py-1 hover:bg-red-600 hover:text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {openForm && (
            <AddAddressDesktop
              open={openAddress}
              mode={formMode}
              data={editData}
              close={() => setOpenForm(false)}
            />
          )}

          {/* Delete Address Modal for Desktop */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 transition-opacity duration-300">
              <div className={`bg-white w-full max-w-md sm:rounded-2xl rounded-xl p-5 sm:p-6 shadow-xl text-center transform transition-all duration-300 ${animateModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete this address?</h2>
                <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this address? This action can't be undone.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                  >
                    No
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteAddress(selectedAddressId);
                      closeModal();
                    }}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Address Modal for Mobile */}
          {showDeleteMobileModal && (
            <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-500 ease-in-out ${showDeleteMobileModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className={`absolute inset-0 bg-black transition-all duration-500 ease-in-out ${showDeleteMobileModal ? 'bg-opacity-15' : 'bg-opacity-0 backdrop-blur-0'}`} onClick={closeMobileModel}></div>
              <div className={`fixed bottom-0 left-0 right-0 bg-white w-full max-w-md mx-auto rounded-t-2xl p-5 shadow-xl text-center transform transition-all duration-500 ease-in-out ${animateModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete this address?</h2>
                <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this address? This action can't be undone.</p>
                <div className="flex flex-row gap-3">
                  <button
                    onClick={closeMobileModel}
                    className="py-2 w-full rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                  >
                    No
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteAddress(selectedAddressId);
                      closeMobileModel();
                    }}
                    className="py-2 w-full rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 z-40 w-[55px] h-[55px] rounded-full bg-gray-50/80 border border-gray-200 backdrop-blur-sm text-white p-3 shadow-inner transition-all duration-300 hover:bg-gray-100 hover:scale-110 active:scale-90 ${showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <FaArrowUp className="w-full h-full text-orange-500" />
      </button>
    </>
  );
};

export default Address;
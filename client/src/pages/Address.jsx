import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MdDelete, MdEdit } from "react-icons/md";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

import AddAddressDesktop from '../components/AddAddressDesktop';
import { Link, useNavigate } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";


const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

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
          navigate("/dashboard"); // or home
        }
    
        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    
      // Also check after resize
      useEffect(() => {
        if (screenWidth > 1024) {
          navigate("/dashboard");
        }
      }, [screenWidth]);

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        data: { _id: id }
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
    setOpenAddress(true)
  };

  const handleOpenEditForm = (address) => {
    setFormMode("edit");
    setEditData(address);
    setOpenForm(true);
    setOpenAddress(true)
  };
  return (
    <div className='mt-20 md:mt-0'>
      {/* Header */}
      <div className="bg-white rounded-lg px-4 py-3 flex flex-col sm:flex-row justify-between items-center lg:items-start sm:items-center gap-2">
        <span className="font-semibold text-lg text-gray-800">Your Saved Addresses</span>
        <button
          onClick={handleOpenAddForm}
          className="w-full  border border-orange-400 text-orange-500 px-4 py-1.5 rounded-full hover:bg-orange-400 hover:text-white transition"
        >
          + Add Address
        </button>
       
      </div>
  
      {/* Address List */}
      <div className="bg-gray-50 p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 h-full  max-h-[100vh] lg:min-h-[50vh] overflow-y-auto">
        {addressList
          .filter((address) => address.status)
          .map((address, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-2xl shadow-sm p-4 flex flex-col justify-between h-full"
            >
              <div className="space-y-1  text-gray-700">
                <p className="font-medium text-lg text-gray-900 border-b py-1 flex gap-2 items-center"><CiUser className='text-lg'/>{address.name}</p>
                <div className="content pl-2 py-2">
                   <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>{address.city}, {address.state}</p>
                <p>{address.country} - {address.pincode}</p>
                </div>
               
                <p className="text-gray-600 mt-1 flex gap-2 items-center"><IoCallOutline className='text-lg'/> {address.mobile}</p>
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
                  onClick={() => handleDisableAddress(address._id)}
                  className="flex-1 text-sm text-red-600 border border-red-300 rounded-md py-1 hover:bg-red-600 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
  
        {/* Conditional Add Box */}
        {addressList.filter((address) => address.status).length <= 2 && (
          <>
           <div
            onClick={handleOpenAddForm}
            className="hidden lg:block border-2 border-dashed border-gray-300 bg-white rounded-lg cursor-pointer md:flex items-center justify-center hover:border-orange-200 transition h-full min-h-[120px]"
          >
            <p className="text-gray-500">+ Add new address</p>
          </div>

           <div
            
            className="bloack lg:hidden border-2 border-dashed border-gray-300 bg-white rounded-lg cursor-pointer flex items-center justify-center hover:border-orange-200 transition h-full min-h-[120px]"
          >
          <Link to="/SaperateAddress">
          
            <p className="text-gray-500">+ Add new address</p></Link>
          </div>
          
          </>
         
        )}
      </div>
  
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
  );
  
};

export default Address;

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { MdDelete, MdEdit } from "react-icons/md";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

import AddAddressDesktop from '../components/AddAddressDesktop';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

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
    <div className=''>
      {/* Header */}
      <div className="bg-white rounded-lg px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span className="font-semibold text-lg text-gray-800">Saved Addresses</span>
        <button
          onClick={handleOpenAddForm}
          className="border border-primary-200 text-primary-200 px-4 py-1.5 rounded-full hover:bg-primary-200 hover:text-white transition"
        >
          + Add Address
        </button>
      </div>
  
      {/* Address List */}
      <div className="bg-gray-50 p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {addressList
          .filter((address) => address.status)
          .map((address, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between h-full"
            >
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-medium text-base text-gray-900">{address.name}</p>
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>{address.city}, {address.state}</p>
                <p>{address.country} - {address.pincode}</p>
                <p className="text-gray-600 mt-1">📞 {address.mobile}</p>
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
          <div
            onClick={handleOpenAddForm}
            className="border-2 border-dashed border-gray-300 bg-white rounded-lg cursor-pointer flex items-center justify-center hover:border-primary-200 transition h-full min-h-[120px]"
          >
            <p className="text-gray-500">+ Add new address</p>
          </div>
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

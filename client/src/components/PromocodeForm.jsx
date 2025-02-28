import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const PromocodeForm = ({ close, isEdit = false, updatedata, onSuccess }) => {
  const discountTypes = [
    { id: "fixed", name: "Fixed" },
    { id: "percentage", name: "Percentage" }
  ];

  const [data, setData] = useState({
    _id: isEdit ? updatedata?._id : "",
    code: isEdit ? updatedata?.code : "",
    minOrderValue: isEdit ? updatedata?.minOrderValue : "",
    usageLimit: isEdit ? updatedata?.usageLimit : "",
    discountType: isEdit ? updatedata?.discountType : "fixed",
    discountValue: isEdit ? updatedata?.discountValue : "",
    maxDiscount: isEdit ? updatedata?.maxDiscount : "",
    expiryDate: isEdit ? (updatedata?.expiryDate ? new Date(updatedata.expiryDate).toISOString().split('T')[0] : "") : "",
    isActive: isEdit ? updatedata?.isActive : true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      handleEditPromocode();
    } else {
      handleAddPromocode();
    }
  };

  const handleAddPromocode = async () => {
    const requestData = {
        code: data.code,
        minOrderValue: data.minOrderValue,
        usageLimit: data.usageLimit,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxDiscount: data.maxDiscount,
        expiryDate: data.expiryDate,
        isActive: data.isActive,
    };

    try {
        const response = await Axios({
            ...SummaryApi.createPromocode,
            headers: {
                "Content-Type": "application/json",
            },
            data: requestData, // Send as JSON
        });

        const { data: responseData } = response;

        if (responseData.success) {
            successAlert(responseData.message);
            if (onSuccess) onSuccess();
            close();
        }
    } catch (error) {
        console.log(error);
        AxiosToastError(error);
    }
};


const handleEditPromocode = async () => {
  const payload = {
    _id: data._id,
    code: data.code,
    minOrderValue: data.minOrderValue,
    usageLimit: data.usageLimit,
    discountType: data.discountType,
    discountValue: data.discountValue,
    maxDiscount: data.maxDiscount,
    expiryDate: data.expiryDate,
    isActive: data.isActive,
  };

  try {
    const response = await Axios.put(SummaryApi.updatePromocode.url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      successAlert(response.data.message);
      if (onSuccess) onSuccess();
      close();
    }
  } catch (error) {
    console.log(error);
    AxiosToastError(error);
  }
};


  return (
    <section className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 w-full max-w-4xl h-auto max-h-[80vh] overflow-y-auto rounded-lg shadow-lg'>
        <div className='flex items-center justify-between p-2 bg-white shadow-md'>
          <h2 className='font-semibold text-lg'>
            {isEdit ? "Update Promo Code" : "Add Promo Code"}
          </h2>
          <button onClick={close} className='text-gray-600 hover:text-gray-900'>
            <IoClose size={25} />
          </button>
        </div>
  
        <div className='grid p-3'>
          <form className='grid gap-4' onSubmit={handleSubmit}>
            
            {/* Promo Code */}
            <div className='grid gap-1'>
              <label htmlFor='code' className='font-medium'>Promo Code</label>
              <input
                id='code'
                type='text'
                placeholder='Enter promo code'
                name='code'
                value={data.code}
                onChange={handleChange}
                required
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
            </div>
  
            {/* Min Order Value */}
            <div className='grid gap-1'>
              <label htmlFor='minOrderValue' className='font-medium'>Minimum Order Value</label>
              <input
                id='minOrderValue'
                type='number'
                placeholder='Enter minimum order value'
                name='minOrderValue'
                value={data.minOrderValue}
                onChange={handleChange}
                required
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
            </div>
  
            {/* Usage Limit */}
            <div className='grid gap-1'>
              <label htmlFor='usageLimit' className='font-medium'>Usage Limit</label>
              <input
                id='usageLimit'
                type='number'
                placeholder='Enter usage limit'
                name='usageLimit'
                value={data.usageLimit}
                onChange={handleChange}
                required
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
            </div>
            
            {/* Discount Type */}
            <div className='grid gap-1'>
              <label className='font-medium'>Discount Type</label>
              <div>
                <select
                  className='bg-blue-50 border w-full p-2 rounded'
                  value={data.discountType}
                  name='discountType'
                  onChange={handleChange}
                >
                  {discountTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Discount Value */}
            <div className='grid gap-1'>
              <label htmlFor='discountValue' className='font-medium'>Discount Value</label>
              <input
                id='discountValue'
                type='number'
                placeholder='Enter discount value'
                name='discountValue'
                value={data.discountValue}
                onChange={handleChange}
                required
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
              <small className="text-gray-500">
                {data.discountType === "percentage" ? "Enter percentage (0-100)" : "Enter amount in currency"}
              </small>
            </div>
  
            {/* Max Discount */}
            <div className='grid gap-1'>
              <label htmlFor='maxDiscount' className='font-medium'>Maximum Discount</label>
              <input
                id='maxDiscount'
                type='number'
                placeholder='Enter maximum discount'
                name='maxDiscount'
                value={data.maxDiscount}
                onChange={handleChange}
                required
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
              <small className="text-gray-500">Maximum discount amount in currency</small>
            </div>
  
            {/* Expiry Date */}
            <div className='grid gap-1'>
              <label htmlFor='expiryDate' className='font-medium'>Expiry Date</label>
              <input
                id='expiryDate'
                type='date'
                name='expiryDate'
                value={data.expiryDate}
                onChange={handleChange}
                required
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
            </div>

            {/* Is Active */}
            <div className='grid gap-1'>
              <label className='font-medium'>Status</label>
              <div className='flex gap-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='isActive'
                    checked={data.isActive === true}
                    onChange={() => setData(prev => ({ ...prev, isActive: true }))}
                  />
                  Active
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='isActive'
                    checked={data.isActive === false}
                    onChange={() => setData(prev => ({ ...prev, isActive: false }))}
                  />
                  Inactive
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'>
              {isEdit ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PromocodeForm;
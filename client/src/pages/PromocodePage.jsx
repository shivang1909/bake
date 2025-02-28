import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import PromocodeForm from '../components/PromocodeForm';
import Loading from '../components/Loading';

const PromocodePage = () => {
  const [promocodes, setPromocodes] = useState([]);
  const [filteredPromocodes, setFilteredPromocodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "inactive"

  useEffect(() => {
    fetchPromocodes();
  }, []);

  useEffect(() => {
    filterPromocodes();
  }, [filterStatus, promocodes]);

  const fetchPromocodes = async () => {
    setLoading(true);
    try {
      const response = await Axios(SummaryApi.getAllPromocodes);
      const { data } = response;
      if (data.success) {
        setPromocodes(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      AxiosToastError(error);
      setLoading(false);
    }
  };

  const filterPromocodes = () => {
    if (filterStatus === "all") {
      setFilteredPromocodes(promocodes);
    } else {
      setFilteredPromocodes(
        promocodes.filter((promo) =>
          filterStatus === "active" ? promo.isActive : !promo.isActive
        )
      );
    }
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setEditData(null);
    setShowForm(true);
  };

  const handleEditClick = (promocode) => {
    setIsEdit(true);
    setEditData(promocode);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      try {
        const response = await Axios({
          ...SummaryApi.deletePromocode,
          url: `${SummaryApi.deletePromocode.url}/${id}`,
        });
        
        const { data } = response;
        if (data.success) {
          successAlert(data.message);
          setPromocodes(prevPromocodes => prevPromocodes.filter(promo => promo._id !== id));
        }
      } catch (error) {
        console.log(error);
        AxiosToastError(error);
      }
    }
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getDiscountText = (promocode) => {
    if (promocode.discountType === 'percentage') {
      return `${promocode.discountValue}%`;
    } else {
      return `₹${promocode.discountValue}`;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        <div className="flex gap-4">
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-primary-100 hover:bg-primary-200 py-2 px-4 rounded font-semibold text-white"
          >
            <FaPlus /> Add Promo Code
          </button>
        </div>
      </div>

      {filteredPromocodes.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No promo codes found. Click the "Add Promo Code" button to create one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromocodes.map((promocode) => (
                <tr key={promocode._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{promocode.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getDiscountText(promocode)}
                    {promocode.maxDiscount && promocode.discountType === 'percentage' && (
                      <span className="text-xs text-gray-500 ml-1">(Max: ₹{promocode.maxDiscount})</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{promocode.minOrderValue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{promocode.usageLimit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(promocode.expiryDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      promocode.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {promocode.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditClick(promocode)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(promocode._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <PromocodeForm close={closeForm} isEdit={isEdit} updatedata={editData} onSuccess={fetchPromocodes} />
      )}
    </div>
  );
};

export default PromocodePage;

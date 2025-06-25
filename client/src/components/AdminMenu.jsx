import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { HiOutlineExternalLink } from "react-icons/hi";
import {
  isAdmin,
  isInventoryManager,
  isFinanceManager,
  isDeliveryPartner,
} from "../utils/isAdmin";

const AdminMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        if (close) close();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) close();
  };



  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile}{" "}
          <span className="text-medium text-red-600">({user.role})</span>
        </span>
        <Link
          onClick={handleClose}
          to={"/admin/dashboard/profile"}
          className="hover:text-primary-200"
        >
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      <div className="text-sm grid gap-1">

        {/* ============================== Admin Role Dashboard Menu ============================== */}
        {isAdmin(user.role) && (
          <>
          <Link
              onClick={handleClose}
              to="/admin/dashboard/test"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Dashboard
            </Link>
          <Link
              onClick={handleClose}
              to="/admin/dashboard/HeroSection"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Hero section
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/category"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Category
            </Link>
         
            <Link
              onClick={handleClose}
              to="/admin/dashboard/product"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Product
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/HomePageSection"
              className="px-2 hover:bg-orange-200 py-1">
                Home Pagee section
              </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/add-admin"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Add Admin
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/admin-list"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Admin List
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/order-list"
              className="px-2 hover:bg-orange-200 py-1"
            >
              New Order
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/order-history"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Order History
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/admin-cod-status"
              className="px-2 hover:bg-orange-200 py-1"
            >
              COD Status
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/admin-promo"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Promo Code
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/weightvariant"
              className="px-2 hover:bg-orange-200 py-1">
              Weight Variants / Gift wrap
              </Link>
          </>
        )}


        {/* ============================== Inventory Role Dashboard Menu ============================== */}
        {isInventoryManager(user.role) && (
          <>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/product"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Product List
            </Link>
           
           
          </>
        )}

        {/* ============================== Finance Role Dashboard Menu ============================== */}
        {isFinanceManager(user.role) && (
          <>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/sales-records"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Sales Records
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/profit-analysis"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Profit Analysis
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/expense-records"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Expense Records
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/invoices"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Invoices
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/financial-reports"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Reports
            </Link>
          </>
        )}


        {/* ============================== Delivery Partner Role Dashboard Menu ============================== */}
        {isDeliveryPartner(user.role) && (
          <>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/my-deliveries"
              className="px-2 hover:bg-orange-200 py-1"
            >
              My Deliveries(Order)
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/delivery-history"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Delivery History
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/delivery-cod-status"
              className="px-2 hover:bg-orange-200 py-1"
            >
              COD STATUS
            </Link>
           
            
          
          </>
        )}
        <button
          onClick={handleLogout}
          className="text-left px-2 hover:bg-orange-200 py-1"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AdminMenu;

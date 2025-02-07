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
  isUser
} from "../utils/isAdmin";

const UserMenu = ({ close }) => {
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

  const profileUrl = !isUser(user.role)
    ? "/admin/dashboard/profile"
    : "/dashboard/profile";


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
          to={profileUrl}
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
              All Order
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
            <Link
              onClick={handleClose}
              to="/admin/dashboard/stock-management"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Stock Management
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/supplier-management"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Supplier Management
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/inventory-reports"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Reports
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
              My Deliveries
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
              to="/admin/dashboard/map-view"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Map View
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/notifications"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Notifications
            </Link>
            <Link
              onClick={handleClose}
              to="/admin/dashboard/support"
              className="px-2 hover:bg-orange-200 py-1"
            >
              Support
            </Link>
          </>
        )}


        {/* ============================== End User Role Dashboard Menu ============================== */}
        <Link
          onClick={handleClose}
          to={profileUrl}
          className="px-2 hover:bg-orange-200 py-1"
        >
          My Profile 
        </Link>
        {isUser(user.role) && (
        <Link
          onClick={handleClose}
          to="/dashboard/address"
          className="px-2 hover:bg-orange-200 py-1"
        >
          Address
        </Link> 
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

export default UserMenu;

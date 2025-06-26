import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import Logo from "../../assets/images/Custom/BakeFlavors.png";

const AdminLogin = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = Object.values(data).every((val) => val.trim() !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.adminLogin,
        data
      });

      if (response.data.error) return toast.error(response.data.message);

      toast.success(response.data.message);

      localStorage.setItem('accesstoken', response.data.data.accesstoken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);

      const userDetails = await fetchUserDetails();
      dispatch(setUserDetails(userDetails.data));

      setData({ email: '', password: '' });
      navigate('/admin/dashboard/profile');
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white shadow-md my-8 w-full max-w-lg mx-auto rounded p-8">
        <div className="flex items-center justify-center mb-6">
          <Link to="/">
            <img src={Logo} alt="logo" className="w-44" />
          </Link>
        </div>

        <h2 className="text-xl text-center font-semibold mb-2">Admin Login</h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Sign in to access your dashboard
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Email */}
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="grid gap-1">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <div className="flex items-center bg-blue-50 p-2 border rounded focus-within:border-primary-200">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent"
                value={data.password}
                onChange={handleChange}
              />
              <div onClick={() => setShowPassword((prev) => !prev)} className="cursor-pointer">
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            <Link to="/admin/forgot-password" className="block text-right text-sm hover:text-primary-200">
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-2 rounded font-semibold tracking-wide text-white ${isValid ? 'bg-green-800 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;

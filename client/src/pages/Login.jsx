import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import Logo from "../../assets/images/Custom/BakeFlavors.png";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accesstoken", response.data.data.accesstoken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));

        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="w-full container mt-16 mx-auto px-2 font-normal">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <div className="flex items-center justify-center lg:mt-10">
          <img src={Logo} alt="logo" className="w-44" />
        </div>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid my-3">
            <div className="w-full relative flex rounded-xl">
              <input
                required
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                
                className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
               
              />
              <label
                htmlFor="email"
                className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
              >
                Email
              </label>
            </div>
          </div>

     
          <div className="grid gap-1">


          <div className="flex items-center my-3">
            <div className="w-full relative flex rounded-xl">
              <input
                required
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-l-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300"
               
              />
              <div
                onClick={() => setShowPassword((preve) => !preve)}
                className=" flex items-center border border-2 border-gray-200 px-2 rounded-r-lg cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
              <label
                htmlFor="password"
                className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
              >
                password
              </label>
            </div>
          </div>


            {/* <label htmlFor="password">Password :</label>
            <div className="bg-white p-2 border-2 border-gray-200 rounded-xl flex items-center focus-within:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full rounded-xl outline-none"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <div
                onClick={() => setShowPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div> */}
            <Link
              to={"/forgot-password"}
              className="block ml-auto hover:text-primary-200"
            >
              Forgot password ?
            </Link>
          </div>

          <button
            disabled={!valideValue}
            className={` ${
              valideValue
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-500 disabled opacity-50"
            }    text-white py-3 rounded-lg font-semibold  tracking-wide`}
          >
            Login
          </button>
        </form>

        <p>
          Don't have account?{" "}
          <Link
            to={"/register"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;

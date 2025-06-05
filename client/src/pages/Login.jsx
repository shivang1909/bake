import React, { useEffect, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get("msg");

    if (msg === "verified") {
      console.log("inside ifff");

      toast.success("✅ Email Verified Successfully!");
    } else if (msg === "already_verified") {
      console.log("inside else");
      toast("⚠️ Email Already Verified!");
    }
  }, [location]);

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
        <div className="py-3 flex justify-center items-center">
          <hr className="border-dashed border-gray-500 w-28" />
        </div>
        <div className="text-center">
          <p>Login To Your Account</p>
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
          <div class="flex items-center justify-center ">
            <button
              type="button"
              onClick={() => {
                window.location.href = `${
                  import.meta.env.VITE_API_URL
                }/api/user/google`;
              }}
              class="px-4 py-2 w-full justify-center border flex gap-2 border-slate-200  rounded-lg text-slate-700  hover:border-slate-400  hover:text-slate-900  hover:shadow transition duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <defs>
                  <radialGradient
                    id="prefix__b"
                    cx="1.479"
                    cy="12.788"
                    fx="1.479"
                    fy="12.788"
                    r="9.655"
                    gradientTransform="matrix(.8032 0 0 1.0842 2.459 -.293)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset=".368" stop-color="#ffcf09" />
                    <stop
                      offset=".718"
                      stop-color="#ffcf09"
                      stop-opacity=".7"
                    />
                    <stop offset="1" stop-color="#ffcf09" stop-opacity="0" />
                  </radialGradient>
                  <radialGradient
                    id="prefix__c"
                    cx="14.295"
                    cy="23.291"
                    fx="14.295"
                    fy="23.291"
                    r="11.878"
                    gradientTransform="matrix(1.3272 0 0 1.0073 -3.434 -.672)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset=".383" stop-color="#34a853" />
                    <stop
                      offset=".706"
                      stop-color="#34a853"
                      stop-opacity=".7"
                    />
                    <stop offset="1" stop-color="#34a853" stop-opacity="0" />
                  </radialGradient>
                  <linearGradient
                    id="prefix__d"
                    x1="23.558"
                    y1="6.286"
                    x2="12.148"
                    y2="20.299"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset=".671" stop-color="#4285f4" />
                    <stop offset=".885" stop-color="#4285f4" stop-opacity="0" />
                  </linearGradient>
                  <clipPath id="prefix__a">
                    <path
                      d="M22.36 10H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53h-.013l.013-.01c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09c.87-2.6 3.3-4.53 6.16-4.53 1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07 1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93v.01C3.99 20.53 7.7 23 12 23c2.97 0 5.46-.98 7.28-2.66 2.08-1.92 3.28-4.74 3.28-8.09 0-.78-.07-1.53-.2-2.25z"
                      fill="none"
                    />
                  </clipPath>
                </defs>
                <path
                  d="M22.36 10H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53h-.013l.013-.01c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09c.87-2.6 3.3-4.53 6.16-4.53 1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07 1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93v.01C3.99 20.53 7.7 23 12 23c2.97 0 5.46-.98 7.28-2.66 2.08-1.92 3.28-4.74 3.28-8.09 0-.78-.07-1.53-.2-2.25z"
                  fill="#fc4c53"
                />
                <g clip-path="url(#prefix__a)">
                  <ellipse
                    cx="3.646"
                    cy="13.572"
                    rx="7.755"
                    ry="10.469"
                    fill="url(#prefix__b)"
                  />
                  <ellipse
                    cx="15.538"
                    cy="22.789"
                    rx="15.765"
                    ry="11.965"
                    transform="rotate(-7.12 15.539 22.789)"
                    fill="url(#prefix__c)"
                  />
                  <path
                    fill="url(#prefix__d)"
                    d="M11.105 8.28l.491 5.596.623 3.747 7.362 6.848 8.607-15.897-17.083-.294z"
                  />
                </g>
              </svg>
              <span>Login with Google</span>
            </button>
          </div>
        
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

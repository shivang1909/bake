import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Custom/BakeFlavors.png";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

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
        ...SummaryApi.forgot_password,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp", {
          state: data,
        });
        setData({
          email: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className=" w-full container mx-auto px-2 flex justify-center items-center h-screen md:bg-gray-100">
      <div className="bg-white  my-4 w-full md:w-xl max-w-xl mx-auto rounded-[20px] md:border p-7">
        <div className="flex items-center justify-center">
          <Link to="/">
            <img src={Logo} alt="logo" className="w-44" />
          </Link>
        </div>
        <div className="border border-gray-50 my-3" />
        <p className="font-semibold text-lg text-center">Forgot Password </p>
        <form className="grid  py-3" onSubmit={handleSubmit}>
          <div className="grid my-3">
            <div className="w-full relative flex rounded-xl">
              <input
                required
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-[24px] leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:border-none focus:ring-orange-300"
              />
              <label
                htmlFor="email"
                className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
              >
                Email
              </label>
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={` rounded-[20px] ${
              valideValue
                ? "bg-orange-500/90 hover:bg-orange-600"
                : "bg-gray-500 cursor-not-allowed"
            }    text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Send Otp
          </button>
        </form>

        <p className="flex gap-2">
          Already have account?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-orange-500 hover:text-orange-500"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;

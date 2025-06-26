import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from "../../assets/images/Custom/BakeFlavors.png";

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.includes("/admin");

  useEffect(() => {
    if (!location?.state?.email) {
      navigate(isAdmin ? "/admin/forgot-password" : "/forgot-password");
    }
  }, []);

  const valideValue = data.every(el => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...(isAdmin ? SummaryApi.admin_forgot_password_otp_verification : SummaryApi.forgot_password_otp_verification),
        data: {
          otp: data.join(""),
          email: location?.state?.email
        }
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      toast.success(response.data.message);
      setData(["", "", "", "", "", ""]);
      navigate(isAdmin ? "/admin/reset-password" : "/reset-password", {
        replace: true,
        state: {
          data: response.data,
          email: location?.state?.email
        }
      });

    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2 flex justify-center items-center h-screen">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded-[20px] p-7">
        <div className="flex items-center justify-center">
          <span
            className="hover:cursor-pointer"
            onClick={() => navigate("/", { replace: true })}
          >
            <img src={Logo} alt="logo" className="w-44" />
          </span>
        </div>
        <div className="border border-gray-50 my-3" />
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="otp" className="font-semibold text-center">
              Enter Your OTP
            </label>

            <div className="flex items-center gap-2 justify-between mt-1">
              {data.map((element, index) => (
                <input
                  key={`otp-${index}`}
                  type="text"
                  id={`otp-${index}`}
                  ref={(ref) => (inputRef.current[index] = ref)}
                  value={data[index]}
                  onChange={(e) => {
                    const value = e.target.value;
                    const newData = [...data];
                    newData[index] = value;
                    setData(newData);

                    if (value && index < data.length - 1) {
                      inputRef.current[index + 1].focus();
                    }
                  }}
                  maxLength={1}
                  className="bg-gray-50 md:w-16 w-10 md:h-16 h-10 border border-gray-300 rounded-xl text-xl outline-none focus:border-orange-200 text-center font-semibold"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!valideValue}
            className={`text-white py-2 rounded-[20px] font-semibold my-3 tracking-wide duration-500 transition-transform ${
              valideValue
                ? "bg-orange-400 hover:bg-orange-400 active:scale-95"
                : "bg-gray-500 cursor-not-allowed active:scale-105"
            }`}
          >
            Verify OTP
          </button>
        </form>

        <p className="flex items-center justify-center gap-2">
          Already have an account?{" "}
          <Link
            to={isAdmin ? "/admin/login" : "/login"}
            className="font-semibold text-orange-500 hover:text-orange-500"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification;

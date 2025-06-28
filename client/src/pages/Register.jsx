import React, { useRef, useEffect, useState } from "react";
import { IoIosGlobe } from "react-icons/io";
import S1 from "../../assets/images/Custom/s1.png";
import S2 from "../../assets/images/Custom/s2.png";
import S3 from "../../assets/images/Custom/s3.png";
import Logo from "../../assets/images/Custom/BakeFlavors.png";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const Register = () => {
  const images = [
    { src: S1, alt: "Slide 1" },
    { src: S2, alt: "Slide 2" },
    { src: S3, alt: "Slide 3" },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // change every 4 sec

    return () => clearInterval(interval);
  }, []);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({ errormessage: "" });
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const confirmPasswordRef = useRef(null);
  const checkboxRef = useRef(null);

  useEffect(() => {
    console.log("errors", errors);
    if (errors.errormessage !== "") {
      AxiosToastError({
        response: {
          data: {
            message: errors.errormessage,
          },
        },
      });
    }
  }, [errors]);

  const navigate = useNavigate();
  //   const valideValue = Object.values(data).every((el) => el);

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    noSpaces: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const isPasswordValid = Object.values(passwordRules).every(
    (rule) => rule === true
  );
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      const rules = {
        length: value.length >= 8 && value.length <= 16,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[@$!%*?#&_]/.test(value),
        noSpaces: !/\s/.test(value),
      };
      setPasswordRules(rules);
    }

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { errormessage: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      newErrors.errormessage = "Please enter a valid email address.";
      setErrors(newErrors);
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      newErrors.errormessage =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
      +setErrors(newErrors);
      return;
    }

    if (data.password !== data.confirmPassword) {
      newErrors.errormessage = "Passwords do not match.";
      +setErrors(newErrors);
      return;
    }
    // Terms & Conditions
    if (!isTermsChecked) {
      newErrors.errormessage = "Please agree to the Terms & Conditions.";
      setErrors(newErrors);
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setIsTermsChecked(false);
        navigate("/login",{replace:true});
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <div className="bg-white min-h-screen  flex items-center justify-center p-4">
      <div className="w-full h-fit lg:max-h-[90vh] max-w-[1200px] lg:border lg:border-gray-200 lg:shadow-inner bg-white rounded-3xl   flex flex-col lg:flex-row ">
        <div className="hidden lg:block w-1/2 relative ">
          <a
            href="/"
            className="absolute top-6 right-6 bg-orange-100 text-orange-600 px-2 py-2 rounded-full text-sm hover:bg-orange-200 transition-colors z-10"
          >
            <IoIosGlobe className="text-lg" />
          </a>

          <div className="relative h-full">
            {images.map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={`Slide ${index}`}
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  currentIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 "></div>
            <div className="absolute bottom-12 left-12 text-white z-10">
              <div className="flex gap-2 mt-6">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-1 rounded transition-all duration-300 ${
                      currentIndex === idx ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 w-full    overflow-y-scroll">
          <div className="w-full flex flex-col items-center   px-6 md:px-0 py-4 md:py-2 md:p-12">
            <div className="sm:block lg:hidden flex items-center justify-center ">
              <Link to="/">
                <img src={Logo} alt="logo" className="w-44" />
              </Link>
            </div>

            <div className="max-w-md mx-auto mt-2">
              <h1 className="text-black text-2xl text-center md:text-3xl font-semibold mt-2">
                Create an account
              </h1>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* NAME */}
                <div className="grid my-3">
                  <div className="w-full relative flex rounded-xl">
                    <input
                      required
                      type="name"
                      id="name"
                      name="name"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      value={data.name}
                      onChange={handleChange}
                      className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-[24px] leading-tight bg-white  border border-2  focus:shadow-md focus:outline-none focus:ring-1 focus:border-none  focus:ring-orange-300"
                    />
                    <label
                      htmlFor="name"
                      className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                    >
                      Name
                    </label>
                  </div>
                </div>
                {/* Email */}
                <div className="grid my-3">
                  <div className="w-full relative flex rounded-xl">
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      value={data.email}
                      onChange={handleChange}
                      className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-[24px] leading-tight bg-white border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:border-none focus:ring-orange-300"
                    />
                    <label
                      htmlFor="email"
                      className="absolute mt-3 bg-white text-black/70 -translate-y-1/2 rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                    >
                      Email
                    </label>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col my-3">
                  <div className="w-full relative flex rounded-xl">
                    <input
                      ref={passwordRef}
                      required
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      autoComplete="off"
                      spellCheck="false"
                      value={data.password}
                      onChange={handleChange}
                      onFocus={() => {
                        setIsPasswordFocused(true);
                      }}
                      onBlur={() => setIsPasswordFocused(false)}
                      className={`peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-l-[24px] leading-tight bg-white border border-2 ${
                        !isPasswordValid && data.password.length > 0
                          ? "border-red-500"
                          : "border-gray-200"
                      } focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-none`}
                    />

                    <label
                      htmlFor="password"
                      className="absolute mt-3 bg-white text-black/70 -translate-y-1/2 rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                    >
                      Password
                    </label>

                    <div
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                        setTimeout(() => passwordRef.current?.focus(), 0);
                      }}
                      className="flex items-center border-r-2 border-t-2 border-b-2 border-l-0 border-gray-200 px-2 rounded-r-[24px] cursor-pointer"
                    >
                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </div>
                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 text-sm mt-3  px-3">
                    <div
                      className={`flex items-center ${
                        !isPasswordFocused
                          ? "text-gray-400 font-semibold text-xs"
                          : passwordRules.length
                          ? "text-green-600/80 font-semibold text-xs"
                          : "text-red-600/80 font-semibold text-xs"
                      }`}
                    >
                      {passwordRules.length ? (
                        "✔"
                      ) : (
                        <IoClose className="text-xs" />
                      )}{" "}
                      8–16 characters only
                    </div>
                    <div
                      className={`flex items-center ${
                        !isPasswordFocused
                          ? "text-gray-400 font-semibold text-xs"
                          : passwordRules.number
                          ? "text-green-600/80 font-semibold text-xs"
                          : "text-red-600/80 font-semibold text-xs"
                      }`}
                    >
                      {passwordRules.number ? (
                        "✔"
                      ) : (
                        <IoClose className="text-xs" />
                      )}{" "}
                      1 number
                    </div>
                    <div
                      className={`flex items-center ${
                        !isPasswordFocused
                          ? "text-gray-400 font-semibold text-xs"
                          : passwordRules.uppercase
                          ? "text-green-600/80 font-semibold text-xs"
                          : "text-red-600/80 font-semibold text-xs"
                      }`}
                    >
                      {passwordRules.uppercase ? (
                        "✔"
                      ) : (
                        <IoClose className="text-xs" />
                      )}{" "}
                      1 uppercase
                    </div>
                    <div
                      className={`flex items-center ${
                        !isPasswordFocused
                          ? "text-gray-400 font-semibold text-xs"
                          : passwordRules.lowercase
                          ? "text-green-600/80 font-semibold text-xs"
                          : "text-red-600/80 font-semibold text-xs"
                      }`}
                    >
                      {passwordRules.lowercase ? (
                        "✔"
                      ) : (
                        <IoClose className="text-xs" />
                      )}{" "}
                      1 lowercase
                    </div>
                    <div
                      className={`flex items-center ${
                        !isPasswordFocused
                          ? "text-gray-400 font-semibold text-xs"
                          : passwordRules.specialChar
                          ? "text-green-600/80 font-semibold text-xs"
                          : "text-red-600/80 font-semibold text-xs"
                      }`}
                    >
                      {passwordRules.specialChar ? (
                        "✔"
                      ) : (
                        <IoClose className="text-xs" />
                      )}{" "}
                      1 special character
                    </div>
                    <div
                      className={`flex items-center ${
                        !isPasswordFocused
                          ? "text-gray-400 font-semibold text-xs"
                          : passwordRules.noSpaces
                          ? "text-green-600/80 font-semibold text-xs"
                          : "text-red-600/80 font-semibold text-xs"
                      }`}
                    >
                      {passwordRules.noSpaces ? (
                        "✔"
                      ) : (
                        <IoClose className=" font-semibold text-xs" />
                      )}{" "}
                      No spaces
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col my-3">
                  <div className="w-full relative flex rounded-xl">
                    <input
                      ref={confirmPasswordRef}
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      id="Confirmpassword"
                      name="confirmPassword"
                      value={data.confirmPassword}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Tab" && !e.shiftKey) {
                          e.preventDefault();
                          checkboxRef.current?.focus();
                        }
                      }}
                      className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-l-[24px] leading-tight bg-white border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-none"
                    />
                    <div
                      onClick={() => {
                        setShowConfirmPassword((prev) => !prev);
                        setTimeout(
                          () => confirmPasswordRef.current?.focus(),
                          0
                        );
                      }}
                      className="flex items-center  border-r-2 border-t-2 border-b-2 border-l-0 border-gray-200 px-2 rounded-r-[24px] cursor-pointer"
                    >
                      {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </div>
                    <label
                      htmlFor="Confirmpassword"
                      className="absolute mt-3 bg-white text-black/70 -translate-y-1/2 rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                    >
                      Confirm Password
                    </label>
                  </div>
                  {/* {errors.confirmPassword && (
               
              )} */}
                </div>

                {/* Terms & Conditions */}
                <label className="flex items-center cursor-pointer">
                  <div className="-mb-4">
                    <article className="checkbox-container flex items-center space-x-1">
                      <label className="checkbox">
                        <input
                          id="termsCheck"
                          ref={checkboxRef}
                          type="checkbox"
                          checked={isTermsChecked}
                          onChange={(e) => setIsTermsChecked(e.target.checked)}
                          className="w-4 h-4 border border-gray-300 rounded-sm checked:bg-orange-500 checked:border-transparent focus:outline-none"
                        />
                      </label>
                    </article>
                  </div>
                  <div>
                    <span className="text-gray-600 flex gap-1 text-xs">
                      I agree to the{" "}
                      <a href="#" className="text-orange-600 hover:underline">
                        Terms & Conditions
                      </a>
                    </span>
                  </div>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
                )}

                {/* Submit Button */}
                <button
                  // disabled={!valideValue}
                  type="submit"
                  className={`w-full bg-orange-500 text-white font-semibold rounded-[24px] p-3 transition-colors `}
                >
                  Create account
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-600">Or</span>
                  </div>
                </div>

                <div className="flex flex-col  gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `${
                        import.meta.env.VITE_API_URL
                      }/api/user/google`;
                    }}
                    class="px-4 py-2 w-full justify-center border flex gap-2 border-slate-200  rounded-[24px] text-slate-700  hover:border-slate-400  hover:text-slate-900  hover:shadow transition duration-150"
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
                          <stop
                            offset="1"
                            stop-color="#ffcf09"
                            stop-opacity="0"
                          />
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
                          <stop
                            offset="1"
                            stop-color="#34a853"
                            stop-opacity="0"
                          />
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
                          <stop
                            offset=".885"
                            stop-color="#4285f4"
                            stop-opacity="0"
                          />
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
                    <span>register with Google</span>
                  </button>
                  <p className="text-gray-600 mb-8 flex gap-1 justify-center items-center">
                    Already have an account ?{" "}
                    <span className="text-orange-500 hover:underline">
                      <Link to="/login" className="font-semibold">
                        Log in
                      </Link>
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

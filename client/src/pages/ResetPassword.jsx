import React, { useState, useRef, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useNavigate ,useLocation} from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import Logo from "../../assets/images/Custom/BakeFlavors.png";

const ResetPassword = () => {
  const [data, setData] = useState({
    email : "",
    password: "",
    confirmPassword: "",
  });
  const location = useLocation()
  const [errors, setErrors] = useState({ errormessage: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const checkboxRef = useRef(null);
  const navigate = useNavigate();

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    noSpaces: false,
  });

  const isPasswordValid = Object.values(passwordRules).every(rule => rule === true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const valideValue = Object.values(data).every((el) => el);

    useEffect(()=>{
    if(!(location?.state?.data?.success)){
        navigate("/")
    }
    console.log("this is email",location.state.email);
    
    if(location?.state?.email){
        setData((preve)=>{
            return{
                ...preve,
                email : location?.state?.email
            }
        })
    }
  },[])
  useEffect(() => {
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

    setData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { errormessage: "" };
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

    if (!passwordRegex.test(data.password)) {
      newErrors.errormessage =
        "Password must include uppercase, lowercase, number, and special character.";
      setErrors(newErrors);
      return;
    }

    if (data.password !== data.confirmPassword) {
      newErrors.errormessage = "Passwords do not match.";
      setErrors(newErrors);
      return;
    }

    // Proceed to call API
    console.log("Resetting password...");

     try {
        console.log("this is datqa",data);
        
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
        setData({
          email: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {        
      AxiosToastError(error);
    }
  };

  return (

    <section className=" w-full container mx-auto px-2 flex justify-center items-center h-screen ">
          <div className="bg-white  my-4 w-full md:w-xl max-w-md mx-auto rounded-[20px]  p-7">
            <div className="flex items-center justify-center">
              <span className='hover:cursor-pointer' onClick={
                () => {navigate("/", { replace: true });}}>
                <img src={Logo} alt="logo" className="w-44" />
              </span>
            </div>
            <div className="border border-gray-50 my-3" />
            <p className="font-semibold text-lg text-center">Reset Password </p>
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6">
      {/* Password Field */}
      <div className="flex flex-col mb-3">
        <div className="w-full relative flex rounded-xl">
          <input
            ref={passwordRef}
            required
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={data.password}
            autoComplete="off"
            spellCheck="false"
            onChange={handleChange}
            onFocus={() => setIsPasswordFocused(true)}
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
            New Password
          </label>

          <div
            onClick={() => {
              setShowPassword(prev => !prev);
              setTimeout(() => passwordRef.current?.focus(), 0);
            }}
            className="flex items-center border-r-2 border-t-2 border-b-2 border-l-0 border-gray-200 px-2 rounded-r-[24px] cursor-pointer"
          >
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </div>
        </div>

        {/* Password Validation Checklist */}
        <div className="flex flex-wrap gap-2 text-sm mt-3 px-3">
          {[
            { label: "8–16 characters only", rule: "length" },
            { label: "1 number", rule: "number" },
            { label: "1 uppercase", rule: "uppercase" },
            { label: "1 lowercase", rule: "lowercase" },
            { label: "1 special character", rule: "specialChar" },
            { label: "No spaces", rule: "noSpaces" },
          ].map(({ label, rule }, idx) => (
            <div
              key={idx}
              className={`flex items-center ${
                !isPasswordFocused
                  ? "text-gray-400 font-semibold text-xs"
                  : passwordRules[rule]
                  ? "text-green-600/80 font-semibold text-xs"
                  : "text-red-600/80 font-semibold text-xs"
              }`}
            >
              {passwordRules[rule] ? "✔" : <IoClose className="text-xs" />}{" "}
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col my-3">
        <div className="w-full relative flex rounded-xl">
          <input
            ref={confirmPasswordRef}
            required
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={data.confirmPassword}
            autoComplete="off"
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
              setTimeout(() => confirmPasswordRef.current?.focus(), 0);
            }}
            className="flex items-center border-r-2 border-t-2 border-b-2 border-l-0 border-gray-200 px-2 rounded-r-[24px] cursor-pointer"
          >
            {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </div>
          <label
            htmlFor="confirmPassword"
            className="absolute mt-3 bg-white text-black/70 -translate-y-1/2 rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
          >
            Confirm Password
          </label>
        </div>
      </div>

      <button
            disabled={!valideValue}
            className={`w-full mt-5 rounded-[20px] ${
              valideValue
                ? "bg-orange-500/90 hover:bg-orange-600"
                : "bg-gray-500 cursor-not-allowed"
            }    text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
        Reset Password
      </button>
    </form>
      </div>
        </section>
  );
};

export default ResetPassword;

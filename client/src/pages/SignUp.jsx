import React, { useEffect, useState } from "react";
import "../components/ProductsLeftBar.css";
import { IoIosGlobe } from "react-icons/io";
import S1 from "../../assets/images/Custom/s1.png";
import S2 from "../../assets/images/Custom/s2.png";
import S3 from "../../assets/images/Custom/s3.png";
import Logo from "../../assets/images/Custom/BakeFlavors.png";
import { Link } from "react-router-dom";

const SignUp = () => {
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

  return (
    <div className="bg-white md:min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[1200px] bg-white rounded-3xl overflow-hidden  flex flex-col md:flex-row">
        {/* Left Section with Image Slider */}
        <div className="w-full md:w-1/2 relative overflow-hidden">
          {/* <a
            href="#"
            className="absolute top-6 left-6 text-[#008E97] text-2xl font-bold z-10"
          >
            Bake Flavours
          </a> */}
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
                src={img}
                alt={`Slide ${index}`}
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  currentIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 "></div>
            <div className="absolute bottom-12 left-12 text-white z-10">
              {/* <h2 className="text-2xl md:text-4xl font-semibold mb-2">
                Capturing Moments,
              </h2>
              <h2 className="text-2xl md:text-4xl font-semibold">
                Creating Memories
              </h2> */}
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
        <div className="w-full md:w-1/2 px-6 py-4 md:p-12">
          <div className="flex items-center justify-center ">
            <Link to="/">
              <img src={Logo} alt="logo" className="w-44" />
            </Link>
          </div>
          <div className="border border-gray-50 my-3" />
          <div className="max-w-md mx-auto">
            <h1 className="text-black text-2xl text-center md:text-4xl font-semibold pyy-3">
              Create an account
            </h1>

            <form className="space-y-4">
              {/* <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full md:w-1/2 bg-gray-100 text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div> */}
              <div className="grid my-3">
                <div className="w-full relative flex rounded-xl">
                  <input
                    required
                    type="name"
                    id="name"
                    name="name"
                    // value={data.name}
                    // onChange={handleChange}
                    className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2  focus:shadow-md focus:outline-none focus:ring-1 focus:border-none  focus:ring-orange-300"
                  />
                  <label
                    htmlFor="name"
                    className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                  >
                    Name
                  </label>
                </div>
              </div>
              <div className="grid my-3">
                <div className="w-full relative flex rounded-xl">
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    // value={data.email}
                    // onChange={handleChange}
                    className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-lg leading-tight bg-white  border border-2  focus:shadow-md focus:outline-none focus:ring-1 focus:border-none  focus:ring-orange-300"
                  />
                  <label
                    htmlFor="email"
                    className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                  >
                    Email
                  </label>
                </div>
              </div>
              <div className="flex items-center my-3">
                <div className="w-full relative flex rounded-xl">
                  <input
                    required
                    //    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    //    value={data.password}
                    //    onChange={handleChange}
                    className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-l-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-none"
                  />
                  <div
                    //    onClick={() => setShowPassword((preve) => !preve)}
                    className=" flex items-center border border-2 border-gray-200 px-2 rounded-r-lg cursor-pointer"
                  >
                    {/* {showPassword ? <FaRegEye /> : <FaRegEyeSlash />} */}
                  </div>
                  <label
                    htmlFor="password"
                    className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                  >
                    password
                  </label>
                </div>
              </div>
              <div className="flex items-center my-3">
                <div className="w-full relative flex rounded-xl">
                  <input
                    required
                    //    type={showPassword ? "text" : "password"}
                    id="Confirmpassword"
                    name="Confirmpassword"
                    //    value={data.password}
                    //    onChange={handleChange}
                    className="peer w-full bg-transparent outline-none px-3 py-6 text-md rounded-l-lg leading-tight bg-white  border border-2 border-gray-200 focus:shadow-md focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-none"
                  />
                  <div
                    //    onClick={() => setShowPassword((preve) => !preve)}
                    className=" flex items-center border border-2 border-gray-200 px-2 rounded-r-lg cursor-pointer"
                  >
                    {/* {showPassword ? <FaRegEye /> : <FaRegEyeSlash />} */}
                  </div>
                  <label
                    htmlFor="Confirmpassword"
                    className="absolute mt-3 bg-white text-black/70 -translate-y-1/2  rounded-full left-4 px-2 font-normal text-sm duration-150 peer-focus:mt-0 peer-valid:mt-0 peer-focus:text-xs peer-focus:top-0 peer-focus:left-3 peer-focus:text-orange-500 top-1/4 peer-valid:top-0 peer-valid:text-xs peer-valid:left-3"
                  >
                    Confirm Password
                  </label>
                </div>
              </div>
             

              <label className="flex items-center  cursor-pointer">
                <div className="-mb-4">
                  <article className="checkbox-container flex items-center space-x-1">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        className="appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-orange-500 checked:border-transparent focus:outline-none"
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

              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-semibold rounded-[24px] p-3 hover:bg-orange-600 transition-colors"
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

              <div className="flex flex-col md:flex-row gap-4">
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
                <p className="text-gray-600 mb-8 flex justify-center items-center">
                  Already have an account?{" "}
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
  );
};

export default SignUp;

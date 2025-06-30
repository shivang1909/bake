import { useState, useRef, useEffect } from "react";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import { setIsCartOpen } from "../store/loadingSlice";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import Logo from "../../assets/images/Custom/BakeFlavors.png";
import { IoLogInOutline } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { RiCustomerServiceLine } from "react-icons/ri";
import { logout } from "../store/userSlice";
import { valideURLConvert } from "../utils/valideURLConvert.js";
import UserDefault from "../../assets/images/Custom/user.png";
import toast from "react-hot-toast";

const Header = () => {
  const dispatch = useDispatch();
  const { fetchCartDetails, totalQty } = useGlobalContext() || {};
  const location = useLocation();
  const isCheckOut = location.pathname === "/dashboard/checkout";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(true);
  const [isCatOpen, setIsCatOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [Featured, setFeatured] = useState([
    { sectionName: "", sectionId: null },
  ]);
  const [showHeader, setShowHeader] = useState(true);
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const lastScrollYRef = useRef(0);
  const featuredRef = useRef(null);
  const catRef = useRef(null);

  useEffect(() => {
    const route = location.pathname.split("/")[1];
    if (route === "Featured") {
      setIsFeaturedOpen(false); // Close submenu on route change
      const handleFeatured = () => {
        setIsFeaturedOpen(true);
        featuredRef.current.removeEventListener("mouseenter", handleFeatured);
      };
      featuredRef.current.addEventListener("mouseenter", handleFeatured);
    } else if (route === "Category") {
      setIsCatOpen(false); // Close submenu on route change
      const handleCat = () => {
        setIsCatOpen(true);
        catRef.current.removeEventListener("mouseenter", handleCat);
      };
      catRef.current.addEventListener("mouseenter", handleCat);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleScroll = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const currentScrollY = document.body.scrollTop;

    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollYRef.current) {
        // Scrolling down
        setShowHeader(false);
        setShowMobileHeader(false);
      } else {
        // Scrolling up
        setShowHeader(true);
        setShowMobileHeader(true);

        // Auto-hide after 2 seconds
        timeoutRef.current = setTimeout(() => {
          setShowHeader(false);
          setShowMobileHeader(false);
        }, 2000);
      }
    } else {
      setShowHeader(true);
      setShowMobileHeader(true);
    }

    // Update the last scroll position
    lastScrollYRef.current = currentScrollY;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false); // close menu on large devices
      }
    };

    // Initial check
    handleResize();

    document.body.addEventListener("scroll", handleScroll);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchAllFeatured = async () => {
    try {
      const response = await Axios(SummaryApi.getallHomepageSection);
      const simplified = response.data.map((item) => ({
        sectionName: item.sectionName,
        sectionId: item._id,
      }));
      setFeatured(simplified);
    } catch (err) {
    
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const fetchcategories = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getCategory });
      
      setCategories(response.data.data);
      
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchAllFeatured();
    fetchcategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSubmenu = (menu) => {
    setSubmenuOpen(submenuOpen === menu ? null : menu);
  };
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

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
                  
       toast.error("Something Went Wrong")
    }
  };

  const isCartOpen = useSelector((state) => state?.loading.isCartOpen);

  // Fetch Cart Details
  useEffect(() => {
    if(isCartOpen)
    fetchCartDetails();
  }, [isCartOpen]);

  const redirectToLoginPage = () => {
    navigate("/login");
  };
  

  const handleCloseUserMenu = () => {
    
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }

    navigate("/user");
  };
  const handleOpenCart = () => {
    

    if (isCheckOut) {
      const confirmLeave = confirm(
        "You have to leave this page to open your cart"
      );
      if (confirmLeave) {
        dispatch(setIsCartOpen(true));
        navigate("/");
      } else {
        return;
      }
    } else {
      
      dispatch(setIsCartOpen(true));
    }
  };
  return (
    <>
      <DisplayCartItem close={() => dispatch(setIsCartOpen(false))} />

      <header
        className={`fixed top-0 w-full z-40 ${
          showHeader || showMobileHeader
            ? "pointer-events-auto"
            : "pointer-events-none"
        } transition-transform duration-1000`}
      >
        <div
          className={`block lg:hidden text-center items-center py-3 fixed bg-white/60 backdrop-blur-xl z-40 transition-transform duration-300 w-full shadow-sm top-0 ${
            showMobileHeader ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex flex-row gap-4 items-center justify-between">
              {/* Menu Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(true);
                }}
                className="text-xl h-6 block lg:hidden"
              >
                <i className="fi-rr-menu-burger"></i>
              </button>

              {/* Logo */}
              <Link to="/">
                <img src={Logo} alt="Site Logo" className="w-20 h-auto" />
              </Link>

              {/* Right Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Search */}
                <Link to="/search">
                  <span className="text-3xl -mb-1 flex justify-center items-center transition-all duration-300 active:scale-95 cursor-pointer">
                    <IoIosSearch />
                  </span>
                </Link>

                {/* Auth Buttons */}
                {user?._id ? (
                  <>
                    {/* Cart Button */}
                    <button
                      className="relative -mb-1"
                      onClick={handleOpenCart}
                      aria-label="Open Cart"
                    >
                      <i className="fi-rr-shopping-basket text-2xl" />
                      {totalQty > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {totalQty}
                        </span>
                      )}
                    </button>

                    {/* User Avatar */}
                    <div
                      className="cursor-pointer"
                      onClick={() => setOpenUserMenu((prev) => !prev)}
                    >
                      <img
                        src={user.avatar || UserDefault}
                        alt="User"
                        className="h-8 w-8 object-cover border border-gray-300 rounded-full mx-2"
                      />
                    </div>
                  </>
                ) : (
                  <button
                    onClick={redirectToLoginPage}
                    className="text-xs px-3 py-1.5 font-bold rounded-full border border-[#ff7e22] hover:bg-[#ff7e22] hover:text-white text-[#ff7e22] flex gap-1 justify-center items-center"
                  >
                    Login <IoLogInOutline className="text-lg" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`bg-white/60 backdrop-blur-xl hidden lg:block shadow-sm py-4 transition-transform duration-1000 ${
            showHeader ? "translate-y-0" : "-translate-y-full"
          } hover:translate-y-0`}
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/">
                  <img src={Logo} alt="Site Logo" className="h-12" />
                </Link>
              </div>

              {/* Main Menu */}
              <nav className="hidden lg:block ml-8">
                <ul className="flex gap-8 text-[16px] font-medium">
                  <li
                    className={`py-2 border-b-2 ${
                      location.pathname === "/"
                        ? "border-b-orange-500 text-orange-500"
                        : "border-b-transparent hover:border-b-orange-500 hover:text-orange-500"
                    }`}
                  >
                    <Link to="/">Home</Link>
                  </li>

                  <li
                    className={`py-2 border-b-2 ${
                      location.pathname === "/ShopAll"
                        ? "border-b-orange-500 text-orange-500"
                        : "border-b-transparent hover:border-b-orange-500 hover:text-orange-500"
                    }`}
                  >
                    <Link to="/ShopAll">Shop All</Link>
                  </li>

                  <li className="relative group" ref={catRef}>

                      <span
                      className={`py-2 border-b-2 ${
                        location.pathname.startsWith('/Category/')
                          ? "border-b-orange-500 text-orange-500"
                          : "border-b-transparent group-hover:border-b-orange-500 group-hover:text-orange-500"
                      }`}
                    >
                      Category
                    </span>
                    {isCatOpen && (
                      <ul className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 z-50 text-[14px]">
                        {categories.map((cat, index) => (
                          <li key={index}
                          className={` block   ${
                          location.pathname === `/Category/${valideURLConvert(cat.name)}-${
                                cat._id
                              }`
                            ? " text-orange-500"
                            : "  hover:text-orange-500"
                        }`} 
                          >
                            <Link

                              to={`/Category/${valideURLConvert(cat.name)}-${
                                cat._id
                              }`}
                              className="block px-4 py-2 hover:text-orange-500"
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>

                  <li className="relative group" ref={featuredRef}>
                     <span
                      className={`py-2 border-b-2 ${
                        location.pathname.startsWith('/Featured/')
                          ? "border-b-orange-500 text-orange-500"
                          : "border-b-transparent group-hover:border-b-orange-500 group-hover:text-orange-500"
                      }`}
                    >
                      Featured
                    </span>
                    {isFeaturedOpen && (
                      <ul className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 z-50 text-[14px] ">
                        {Featured.map((item, index) => (
                         <li
  key={index}
  className={`block ${
    location.pathname === `/Featured/${valideURLConvert(item.sectionName)}-${item.sectionId}`
      ? "text-orange-500"
      : "hover:text-orange-500"
  }`}
>

                            <Link
                              to={`/Featured/${valideURLConvert(
                                item.sectionName
                              )}-${item.sectionId}`}
                              className="block px-4 py-2 hover:text-orange-500"
                            >
                              {item.sectionName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>

                  <li className="relative group">
                    

                    <span
                      className={`py-2 border-b-2 ${
                        ["/about-us", "/Contact-Us", "/Terms-conditions", "/Privacy-Policy"].includes(location.pathname)
                          ? "border-b-orange-500 text-orange-500"
                          : "border-b-transparent group-hover:border-b-orange-500 group-hover:text-orange-500"
                      }`}
                    >
                      About Us
                    </span>

                    <ul className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 z-50 text-[14px]">
                      <li
                        className={` block   ${
                          location.pathname === "/about-us"
                            ? " text-orange-500"
                            : "  hover:text-orange-500"
                        }`}
                      >
                        <Link
                          to="/about-us"
                          className="block px-4 py-2 hover:text-orange-500"
                        >
                          About Us
                        </Link>
                      </li>
                      <li
                        className={` block   ${
                          location.pathname === "/Contact-Us"
                            ? " text-orange-500"
                            : "  hover:text-orange-500"
                        }`}
                      >
                        <Link
                          to="/Contact-Us"
                          className="block px-4 py-2 hover:text-orange-500"
                        >
                          Contact Us
                        </Link>
                      </li>
                      <li
                       className={` block   ${
                          location.pathname === "/Terms-conditions"
                            ? " text-orange-500"
                            : "  hover:text-orange-500"
                        }`}
                      >
                        <Link
                          to="/Terms-conditions"
                          className="block px-4 py-2 hover:text-orange-500"
                        >
                          Terms Condition
                        </Link>
                      </li>
                      <li
                       className={` block   ${
                          location.pathname === "/Privacy-Policy"
                            ? " text-orange-500"
                            : "  hover:text-orange-500"
                        }`}
                      >
                        <Link
                          to="/Privacy-Policy"
                          className="block px-4 py-2 hover:text-orange-500"
                        >
                          Privacy Policy
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>

              {/* Right side buttons */}
              <div className="flex items-center gap-3">
                <div className="hidden xl:block">
                  <Search />
                </div>

                <Link to="/search" className="block xl:hidden">
                  <IoIosSearch size={24} />
                </Link>

                <button
                  onClick={handleMobileUser}
                  className="text-neutral-600 lg:hidden"
                >
                  <FaRegCircleUser size={26} />
                </button>

                {user?._id && user.role === "USER" && (
                  <button
                    onClick={handleOpenCart}
                    className="flex items-center gap-2 bg-orange-500 text-white px-3 py-2 rounded-full hover:bg-orange-600 active:scale-95"
                  >
                    <BsCart4 size={24} className="animate-bounce" />
                    <span className="text-sm font-semibold">
                      {totalQty ? `${totalQty} Items` : "Cart"}
                    </span>
                  </button>
                )}

                {user?._id ? (
                  <div className="relative hidden lg:block" ref={dropdownRef}>
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center gap-1"
                    >
                      <img
                        src={
                          user.avatar || "../../assets/images/Custom/user.png"
                        }
                        alt="user"
                        className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                      />
                    </button>

                    {isDropdownOpen && (
                      <ul className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md p-2 z-50">
                        <li>
                          <Link
                            to="/dashboard/Myprofile"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-full"
                            onClick={closeDropdown}
                          >
                            <IoPerson /> Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/dashboard/myorders"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-full"
                            onClick={closeDropdown}
                          >
                            <FaCartShopping /> My Orders
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/dashboard/address"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-full"
                            onClick={closeDropdown}
                          >
                            <FaMapMarkerAlt /> Address
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              handleLogout();
                              closeDropdown();
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-full w-full text-left"
                          >
                            <HiOutlineLogout /> Logout
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={redirectToLoginPage}
                    className="text-lg px-4 py-2 font-bold rounded-full border border-orange-500 text-orange-500 hover:bg-orange-50 active:scale-95 flex items-center gap-1"
                  >
                    Login <IoLogInOutline className="text-3xl" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar  Start*/}

        {isMenuOpen && (
          <div
            className={`fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
              isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => {
              setIsMenuOpen(false);
              setSubmenuOpen(false);
            }}
          ></div>
        )}

        <div
          className={`fixed top-0 bottom-0 left-0 w-72 max-w-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Menu Title */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <span className="text-lg font-semibold text-orange-500">
              Explore Flavours
            </span>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setSubmenuOpen(false);
              }}
              className="text-2xl font-light"
            >
              ×
            </button>
          </div>

          {/* Menu Content */}

          <div className="overflow-y-auto h-[calc(100%-160px)] px-4 py-4">
                <ul className="flex flex-col space-y-3 font-semibold text-[16px]">
      {/* Home */}
      <li>
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className={location.pathname === "/" ? "text-orange-500" : ""}
        >
          Home
        </Link>
      </li>

      {/* Shop Now */}
      <li>
        <Link
          to="/ShopAll"
          onClick={() => setIsMenuOpen(false)}
          className={location.pathname === "/ShopAll" ? "text-orange-500" : ""}
        >
          Shop Now
        </Link>
      </li>

      {/* Categories */}
      <li>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSubmenu("categories")}
        >
          <span
  className={`${
    submenuOpen === "categories" || location.pathname.startsWith("/Category")
      ? "text-orange-500"
      : ""
  }`}
>
            Categories
          </span>
          <span>{submenuOpen === "categories" ? "−" : "+"}</span>
        </div>
        <ul
          className={`space-y-2 pl-3 transition-all duration-300 overflow-hidden ${
            submenuOpen === "categories"
              ? "max-h-[200px] overflow-y-auto mt-3"
              : "max-h-0"
          }`}
        >
          {categories.map((cat, index) => {
            const catUrl = `/Category/${valideURLConvert(cat.name)}-${cat._id}`;
            return (
              <li key={index} className="mb-3 text-[15px]">
                <Link
                  to={catUrl}
                  className={location.pathname === catUrl ? "text-orange-500" : ""}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setSubmenuOpen(false);
                  }}
                >
                  {cat.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </li>

      {/* Featured */}
      <li>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSubmenu("featured")}
        >
          <span
  className={`${
    submenuOpen === "featured" || location.pathname.startsWith("/Featured")
      ? "text-orange-500"
      : ""
  }`}
>
            Featured New
          </span>
          <span>{submenuOpen === "featured" ? "−" : "+"}</span>
        </div>
        <ul
          className={`pl-3 transition-all duration-300 overflow-hidden ${
            submenuOpen === "featured"
              ? "max-h-[200px] overflow-y-auto mt-3"
              : "max-h-0"
          }`}
        >
          {Featured.map((item, index) => {
            const featuredUrl = `/Featured/${valideURLConvert(item.sectionName)}-${item.sectionId}`;
            return (
              <li key={index} className="mb-3 text-[15px]">
                <Link
                  to={featuredUrl}
                  className={location.pathname === featuredUrl ? "text-orange-500" : ""}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setSubmenuOpen(false);
                  }}
                >
                  {item.sectionName}
                </Link>
              </li>
            );
          })}
        </ul>
      </li>

      {/* About */}
      <li>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSubmenu("About")}
        >
          <span
  className={`${
    submenuOpen === "About" ||
    location.pathname === "/about-us" ||
    location.pathname === "/Privacy-Policy" ||
    location.pathname === "/Terms-conditions"
      ? "text-orange-500"
      : ""
  }`}
>

            About
          </span>
          <span>{submenuOpen === "About" ? "−" : "+"}</span>
        </div>
        <ul
          className={`pl-3 space-y-2 transition-all duration-300 overflow-hidden ${
            submenuOpen === "About" ? "max-h-[500px] mt-3" : "max-h-0"
          }`}
        >
          {[
            { name: "About Us", path: "/about-us" },
            { name: "Privacy Policy", path: "/Privacy-Policy" },
            { name: "Terms & Conditions", path: "/Terms-conditions" },
          ].map((link, index) => (
            <li key={index} className="mb-3 text-[15px]">
              <Link
                to={link.path}
                className={location.pathname === link.path ? "text-orange-500" : ""}
                onClick={() => {
                  setIsMenuOpen(false);
                  setSubmenuOpen(false);
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>

      {/* Contact */}
      <li className="absolute bottom-0 w-full border-t-2 left-0 px-2 py-3">
        <Link
          to="/Contact-Us"
          onClick={() => {
            setIsMenuOpen(false);
            setSubmenuOpen(false);
          }}
          className={`flex items-center gap-2 hover:text-blue-600 ${
            location.pathname === "/Contact-Us" ? "text-orange-500" : ""
          }`}
        >
          <RiCustomerServiceLine className="text-lg" /> Contact Us
        </Link>
      </li>
    </ul>
          </div>
        </div>

        {/* Mobile Sidebar  End*/}
      </header>

      <UserMenu close={handleCloseUserMenu} open={openUserMenu} />
    </>
  );
};

export default Header;

import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import { setIsCartOpen } from "../store/loadingSlice";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import Logo from "../../assets/images/Custom/BakeFlavors.png";
import SampleOffer from "../../assets/images/Custom/bnnerNew.png";
import "./Header.css"; // Import your custom CSS file
import "./Header.js";
import { IoLogInOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoPerson } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import SideMenu from "./SideMenu";
import { BsInstagram } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaAmazon } from "react-icons/fa";
import { SiZomato } from "react-icons/si";
import { RiCustomerServiceLine } from "react-icons/ri";
import { logout } from "../store/userSlice";
import { valideURLConvert } from "../utils/valideURLConvert.js";

const Header = () => {
  const dispatch = useDispatch();
  const { fetchCartDetails, totalQty, isSearchOpen, setIsSearchOpen } = useGlobalContext();
  const [isMobile] = useMobile();
  // const isCartOpen = useSelector((state) => state.loading.isCartOpen);
  const location = useLocation();
  const isCheckOut = location.pathname === "/dashboard/checkout";
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuState, setMenuState] = useState({
    categories: false,
    classic: false,
    banner: false,
    account: false,
    about: false,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const [nestedOpen, setNestedOpen] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [Featured, setFeatured] = useState([
    { sectionName: "", sectionId: null }
  ]);
  const [showHeader, setShowHeader] = useState(true);
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false); // close menu on large devices
      }
    };
  
    // Initial check
    handleResize();
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // scrolling down
        setShowHeader(false);
        setShowMobileHeader(false);
      } else {
        // scrolling up
        setShowHeader(true);
        setShowMobileHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const fetchAllFeatured = async () => {
    try {
      const response = await Axios(SummaryApi.getallHomepageSection);
      const simplified = response.data.map(item => ({
        sectionName: item.sectionName,
        sectionId: item._id
      }));
      setFeatured(simplified);
    } catch (err) {
      console.log("Error fetching featured sections:", err);
    }
  };

  const handleOpenSearch = () => {
    setIsSearchOpen((prev) => !prev);
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
      console.log("Categories response:", response);
      setCategories(response.data.data);
      console.log("categoris test 2", categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
    setNestedOpen(null); // reset nested on switch
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
      console.error(error);
      AxiosToastError(error);
    }
  };

  const toggleNested = (submenu) => {
    setNestedOpen(nestedOpen === submenu ? null : submenu);
  };

  const toggleMenu = (key) => {
    setMenuState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isCartOpen = useSelector((state) => state?.loading.isCartOpen);

  // Fetch Cart Details
  useEffect(() => {
    fetchCartDetails();
  }, [isCartOpen]);

  const redirectToLoginPage = () => {
    navigate("/login");
  };
  const redirectToAdminLoginPage = () => {
    navigate("/admin/login");
  };

  const handleCloseUserMenu = () => {
    console.log("close");
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
    console.log("clicked");

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
      console.log("elsee");
      dispatch(setIsCartOpen(true));
    }
  };
  return (
    <>
      <DisplayCartItem close={() => dispatch(setIsCartOpen(false))} />

      <header className="ec-header">
        <div className={`header-top d-md-block d-lg-none text-center items-center py-3 fixed bg-white/60 backdrop-blur-xl z-40 transition-transform duration-300 w-full shadow-sm ${
          showMobileHeader ? "translate-y-0" : "-translate-y-full"}`}> 
          <div className="container">
            <div className="row align-items-center">
              <div className="col text-left header-top-left d-none d-lg-block">
                <div className="header-top-social">
                  <span className="social-text text-upper">Follow us on:</span>
                  <ul className="mb-0">
                    <li className="list-inline-item">
                      <a className="hdr-facebook" href="#">
                        <i className="ecicon eci-facebook"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a className="hdr-twitter" href="#">
                        <i className="ecicon eci-twitter"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a className="hdr-instagram" href="#">
                        <i className="ecicon eci-instagram"></i>
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a className="hdr-linkedin" href="#">
                        <i className="ecicon eci-linkedin"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* <a
                href="#ec-mobile-sidebar"
                className="ec-header-btn ec-sidebar-toggle d-lg-none"
              >
                <i className="fi fi-rr-apps"></i>
              </a> */}
              <p></p>
              <div className="col text-center header-top-center">
                {/* <img src={Logo} alt="Site Logo" className="mx-auto w-20 h-auto" /> */}
              </div>
              <div className="col header-top-right d-none d-lg-block">
                <div className="header-top-lan-curr d-flex justify-content-end">
                  <div className="header-top-lan dropdown">
                    <button
                      className="dropdown-toggle text-upper"
                      data-bs-toggle="dropdown"
                    >
                      Order{" "}
                      <i
                        className="ecicon eci-caret-down"
                        aria-hidden="true"
                      ></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li className="active">
                        <a className="dropdown-item" href="#">
                          Track Order
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Order History
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center ">
                <a
                  href="#ec-mobile-menu"
                  className="ec-header-btn ec-side-toggle d-lg-none text-xl h-6"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(true);
                  }}
                >
                  <i className="fi-rr-menu-burger"></i>
                </a>
                <Link to="/">
                <img
                  src={Logo}
                  alt="Site Logo"
                  className="mx-auto w-20 h-auto"
                />
                  </Link>
                <div className="col d-lg-none ">
                  <div className="ec-header-bottons">
                    {user._id ? (
                      <>
                        <div
                          className="ec-header-user dropdown"
                          onClick={() => setOpenUserMenu((prev) => !prev)}
                        >
                          {user.avatar ? (
                                <div className="h-10 w-10">
                                  <img
                                    src={user.avatar}
                                    className="h-full w-full object-cover border border-gray-300 rounded-full"
                                    alt="user"
                                  />
                                </div>
                              ) : (
                                <img
                                  src="../../assets/images/Custom/user.png"
                                  className="h-10 w-10 border border-gray-300 rounded-full"
                                  alt="user"
                                />
                              )}
                        </div>
                        <a
                         
                          className="ec-header-btn ec-side-toggle"
                          onClick={handleOpenCart}
                        >
                          <div className="header-icon">
                            <i className="fi-rr-shopping-basket"></i>
                          </div>
                          {totalQty ? (
                            <span className="ec-header-count ec-cart-count cart-count-lable">
                              {totalQty}
                            </span>
                          ) : (
                            ``
                          )}
                        </a>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={redirectToLoginPage}
                          className="text-xs px-3 py-1.5 font-bold  rounded-full border border-[#ff7e22]  hover:text-white text-[#ff7e22] flex gap-1 justify-center items-center"
                        >
                          Login <IoLogInOutline className="text-lg" />
                        </button>
                      </>
                    )}
                    <span
                      className="text-3xl ml-2 flex justify-center items-center mb-1 transition-all duration-300 active:scale-95 cursor-pointer"
                      onClick={handleOpenSearch}
                    >
                      {isSearchOpen ? (
                        <RxCross2 className="text-red-400" />
                      ) : (
                        <IoIosSearch />
                      )}
                    </span>

                    {/* <a href="wishlist.html" className="ec-header-btn ec-header-wishlist">
                                <div className="header-icon"><i className="fi-rr-heart"></i></div>
                                <span className="ec-header-count">4</span>
                            </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
        className={`ec-header-bottom d-none d-lg-block bg-white/60 backdrop-blur-xl py-3 shadow-sm z-40 fixed w-full transition-transform duration-1000 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
          <div className="container position-relative">
            <div className="row">
              <div className="ec-flex">
                <div className="align-self-center flex">
                  <div className="header-logo">
                    <a href="/">
                    <Link to="/">
                    
                      <img src={Logo} alt="Site Logo" />
                      <img
                        className="dark-logo"
                        src={Logo}
                        alt={Logo}
                        style={{ display: "none" }}
                      />
                      </Link>
                    </a>
                  </div>
                </div>
                <div className="align-self-center -mr-44">
                  {/* for desktop */}

                  <div
                    id="ec-main-menu-desk"
                    className="d-none d-lg-block sticky-nav"
                  >
                    <div className="container position-relative">
                      <div className="row">
                        <div className="align-self-center">
                          <div className="ec-main-menu">
                            <ul>
                              <li>
                                <Link to="/">
                                  <a>Home</a>
                                </Link>
                              </li>
                              <li className="dropdown position-static">
                                <Link to="/ShopAll">
                                  <a href="javascript:void(0)">Shop All</a>
                                </Link>
                              </li>
                              <li className="dropdown">
                                <a href="javascript:void(0)">Categories</a>
                                <ul className="sub-menu">
                                  {categories.map((cat) => (
                                    <li key={cat._id}>
                                      
                                      <Link
                                        to={`/Category/${valideURLConvert(
                                          cat.name
                                        )}-${cat._id}`}
                                      >
                                        <a>{cat.name}</a>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                              <li className="dropdown">
                                <a href="javascript:void(0)">Featured</a>
                                <ul className="sub-menu">
                                {Featured.map((featured) => (
                                    <li key={featured.sectionId}>
                                     
                                      <Link
                                      
                                        to={`/Featured/${valideURLConvert(
                                          featured.sectionName
                                        )}-${featured.sectionId}`}
                                      >
                                        <a>{featured.sectionName}</a>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                              <li className="dropdown">
                                <a href="javascript:void(0)">About us</a>
                                <ul className="sub-menu">
                                  <li>
                                    <a href="about-us.html">About Us</a>
                                  </li>
                                  <li>
                                    <a href="contact-us.html">Contact Us</a>
                                  </li>
                                  <li>
                                    <a href="cart.html">Cart</a>
                                  </li>
                                  <li>
                                    <a href="checkout.html">Checkout</a>
                                  </li>
                                  <li>
                                    <a href="compare.html">Compare</a>
                                  </li>
                                  <li>
                                    <a href="faq.html">FAQ</a>
                                  </li>
                                  <li>
                                    <a href="login.html">Login</a>
                                  </li>
                                  <li>
                                    <a href="register.html">Register</a>
                                  </li>
                                  <li>
                                    <a href="track-order.html">Track Order</a>
                                  </li>
                                  <li>
                                    <a href="terms-condition.html">
                                      Terms Condition
                                    </a>
                                  </li>
                                  <li>
                                    <a href="privacy-policy.html">
                                      Privacy Policy
                                    </a>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="ec-header-bottons">
                    <div className="mt-1 overflow-hidden">
                      <Search />
                    </div>
                    <div className="ec-header-user dropdown">
                      {/* Mobile User Icon */}
                      <button
                        className="text-neutral-600 lg:hidden"
                        onClick={handleMobileUser}
                      >
                        <FaRegCircleUser size={26} />
                      </button>

                      {/* Desktop View */}
                      <div className="hidden lg:flex z-20 items-center gap-2">
                        {user?._id && user.role === "USER" && (
                          <button
                            onClick={handleOpenCart}
                            className="flex items-center gap-2 bg-orange-500  px-3 py-2 rounded-full text-white transition-all duration-300 active:scale-95 cursor-pointer hover:bg-orange-600"
                          >
                            <div className="animate-bounce">
                              <BsCart4 size={26} />
                            </div>
                            <div className="font-semibold text-sm ">
                              {totalQty ? (
                                <p>{totalQty} Items</p>
                              ) : (
                                // <p></p>
                                <>
                                  <span>Cart</span>
                                </>
                              )}
                            </div>
                          </button>
                        )}

                        {/* <span className="bg-[#ff6a00d9] p-2 rounded-full transition-all duration-300 active:scale-95 cursor-pointer ">
                          <Link to="/search">
                            <IoIosSearch className="text-2xl text-white" />
                          </Link>
                        </span> */}

                        {user?._id ? (
                          <div className="relative" ref={dropdownRef}>
                            <button
                              onClick={toggleDropdown}
                              className="flex items-center gap-1 text-black hover:bg-gray-200  rounded-full"
                            >
                              {user.avatar ? (
                                <div className="h-10 w-10">
                                  <img
                                    src={user.avatar}
                                    className="h-full w-full object-cover border border-gray-300 rounded-full"
                                    alt="user"
                                  />
                                </div>
                              ) : (
                                <img
                                  src="../../assets/images/Custom/user.png"
                                  className="h-10 w-10 border border-gray-300 rounded-full"
                                  alt="user"
                                />
                              )}
                            </button>

                            {isDropdownOpen && (
                              <ul className="absolute right-0 mt-2 font-semibold bg-white border rounded-md shadow-md w-48 z-50 p-2">
                                <li>
                                  <Link to="/dashboard/Myprofile">
                                    <a
                                      className=" px-4 py-2 hover:bg-gray-100 flex gap-2 items-center rounded-full"
                                      onClick={closeDropdown}
                                    >
                                      <IoPerson /> Profile
                                    </a>
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/dashboard/myorders">
                                    <a
                                      className="px-4 py-2 hover:bg-gray-100 flex gap-2 items-center rounded-full"
                                      onClick={closeDropdown}
                                    >
                                      <FaCartShopping />
                                      My Orders
                                    </a>
                                  </Link>
                                </li>
                                <li>
                                  <a
                                    href="/settings"
                                    className="px-4 py-2 hover:bg-gray-100 flex gap-2 items-center rounded-full"
                                    onClick={closeDropdown}
                                  >
                                    <FaMapMarkerAlt /> Track Orders
                                  </a>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      handleLogout();
                                      closeDropdown();
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex gap-2 items-center rounded-full"
                                  >
                                    <HiOutlineLogout />
                                    Logout
                                  </button>
                                </li>
                              </ul>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={redirectToLoginPage}
                            className="text-lg px-4 py-2 font-bold rounded-full border border-orange-500  hover:bg-orange-50 text-orange-500 active:scale-95 flex gap-1 justify-center items-center"
                          >
                            Login <IoLogInOutline className="text-3xl" />
                          </button>
                        )}
                      </div>

                      {/* Dropdown Menu */}
                      <ul className="dropdown-menu dropdown-menu-right">
                        {user?._id ? (
                          <li className="relative">
                            <div
                              onClick={() => setOpenUserMenu((prev) => !prev)}
                              className="flex select-none items-center gap-1 cursor-pointer"
                            >
                              <p>Account</p>
                              {openUserMenu ? (
                                <GoTriangleUp size={25} />
                              ) : (
                                <GoTriangleDown size={25} />
                              )}
                            </div>
                            {openUserMenu && (
                              <div className="absolute right-0 top-12">
                                <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                                  <UserMenu close={handleCloseUserMenu} />
                                </div>
                              </div>
                            )}
                          </li>
                        ) : (
                          <>
                            <li>
                              <a className="dropdown-item" href="/login">
                                Login
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="/admin-login">
                                Admin Login
                              </a>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Cart icon (static example) */}
                    {/* <a href="#ec-side-cart" className="ec-header-btn ec-side-toggle">
      <div className="header-icon">
        <i className="fi-rr-shopping-basket"></i>
      </div>
      <span className="ec-header-count ec-cart-count cart-count-lable">
        3
      </span>
    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" ">
          <div className="container position-relative">
            <div
              className={`overflow-hidden  transition-all duration-500 ease-in-out ${
                isSearchOpen ? "mt-4 max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <Search />
            </div>
          </div>
        </div>

        <div class="ec-menu-overlay"></div>

        <div
          id="ec-mobile-menu"
          className={`ec-side-cart ec-mobile-menu ${
            isMenuOpen ? "ec-open" : ""
          }`}
        >
          <div className="ec-menu-title">
            <span className="menu_title">Explore Flavours</span>
            <button className="ec-close" onClick={() => setIsMenuOpen(false)}>
              ×
            </button>
          </div>
          <div class="ec-menu-inner">
            <div class="ec-menu-content">
              <ul className="flex flex-col space-y-2 text-[15px] tracking-wider gap-2 font-bold ">
                {/* offers */}
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <li>
                    <div className="flex justify-between items-center cursor-pointer">
                      <span>Home</span>
                    </div>
                  </li>
                </Link>
                <Link to="/ShopAll" onClick={() => setIsMenuOpen(false)}>
                  <li>
                    <div className="flex justify-between items-center cursor-pointer">
                      <span>Shop Now</span>
                    </div>
                  </li>
                </Link>
                {/* Categories */}
                <li>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSubmenu("categories")}
                  >
                    <span>Categories</span>
                    <span>{submenuOpen === "categories" ? "−" : "+"}</span>
                  </div>

                  {/* Submenu under Categories */}
                  <ul
                    className={`pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                      submenuOpen === "categories"
                        ? "max-h-[300px] overflow-y-auto"
                        : "max-h-0"
                    }`}
                  >
                    <div className="flex flex-col gap-2 mt-2 justify-center">
                      {categories.map((cat) => (
                        <li key={cat._id} className="rounded-2xl">
                          <Link
                            to={`/Category/${valideURLConvert(cat.name)}-${
                              cat._id
                            }`}
                          >
                            <a>{cat.name}</a>
                          </Link>
                        </li>
                      ))}
                    </div>
                  </ul>
                  <ul class="sub-menu">
                    <li>
                      <a class="p-0" href="shop-left-sidebar-col-3.html">
                        <img
                          class="img-responsive"
                          src="assets/images/menu-banner/1.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                  </ul>
                </li>

                <li>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSubmenu("Offers")}
                  >
                    <span>Offers</span>
                    <span>{submenuOpen === "Offers" ? "−" : "+"}</span>
                  </div>

                  {/* Submenu under Categories */}
                  <ul
                    className={`pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                      submenuOpen === "Offers" ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    <div className="mt-2 gap-2 flex flex-wrap">
                      <li>
                        <a class="p-0" href="shop-left-sidebar-col-3.html">
                          <img
                            class="img-responsive rounded-lg"
                            src={SampleOffer}
                            alt=""
                          />
                        </a>
                      </li>
                      <li>
                        <a class="p-0" href="shop-left-sidebar-col-3.html">
                          <img
                            class="img-responsive rounded-lg"
                            src={SampleOffer}
                            alt=""
                          />
                        </a>
                      </li>
                    </div>
                  </ul>
                  <ul class="sub-menu">
                    <li>
                      <a class="p-0" href="shop-left-sidebar-col-3.html">
                        <img class="img-responsive" src={SampleOffer} alt="" />
                      </a>
                    </li>
                  </ul>
                </li>
                {/* Account */}
                <li>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSubmenu("Account")}
                  >
                    <span>Account</span>
                    <span>{submenuOpen === "Account" ? "−" : "+"}</span>
                  </div>

                  {/* Submenu under Account */}
                  <ul
                    className={`pl-3 mt-1  overflow-hidden transition-all duration-300 ease-in-out ${
                      submenuOpen === "Account" ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    <div className="mt-2 gap-2 flex flex-col">
                      <li className="p-1 rounded-2xl">
                        <a href="">My Account</a>
                      </li>
                      <li className=" p-1  rounded-2xl">
                        <a href="">Track Your Order</a>
                      </li>
                      <li className=" p-1  rounded-2xl">
                        <a href="">Chat With Us</a>
                      </li>
                      <li className=" p-1  rounded-2xl">
                        <a href="">Write a Review</a>
                      </li>
                    </div>
                  </ul>
                  <ul class="sub-menu">
                    <li>
                      <a class="p-0" href="shop-left-sidebar-col-3.html">
                        <img class="img-responsive" src={SampleOffer} alt="" />
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSubmenu("About")}
                  >
                    <span>About</span>
                    <span>{submenuOpen === "About" ? "−" : "+"}</span>
                  </div>

                  {/* Submenu under About */}
                  <ul
                    className={`pl-3 mt-1  overflow-hidden transition-all duration-300 ease-in-out ${
                      submenuOpen === "About" ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    <div className="mt-2 gap-2 flex flex-col">
                      <li className="p-1 rounded-2xl">
                        <a href="">About</a>
                      </li>
                      <li className=" p-1  rounded-2xl">
                        <a href="">Our Vision & Mission</a>
                      </li>
                      <li className=" p-1  rounded-2xl">
                        <a href="">Privacy Policy</a>
                      </li>
                      <li className=" p-1  rounded-2xl">
                        <a href="">Certificates</a>
                      </li>
                    </div>
                  </ul>
                  <ul class="sub-menu">
                    <li>
                      <a class="p-0" href="shop-left-sidebar-col-3.html">
                        <img class="img-responsive" src={SampleOffer} alt="" />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom Section: Help Center + Social Icons */}
          <div className="flex flex-col mt-auto px-4 space-y-4">
            {/* Help Center */}
            <div className="border-b pb-3 pt-4 ">
              <ul className="text-[15px] font-bold">
                <li className="cursor-pointer hover:text-blue-500 flex items-center gap-2">
                  <RiCustomerServiceLine className="text-xl" /> Help Center
                </li>
              </ul>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center gap-6">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 p-3 rounded-full hover:bg-pink-500 text-pink-600 hover:text-white transition-colors"
              >
                <BsInstagram size={20} />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 p-3 rounded-full hover:bg-blue-600 text-blue-600 hover:text-white transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 p-3 rounded-full hover:bg-yellow-500 text-yellow-700 hover:text-white transition-colors"
              >
                <FaAmazon size={20} />
              </a>
              <a
                href="https://www.zomato.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 p-3 rounded-full hover:bg-red-500 text-red-600 hover:text-white transition-colors"
              >
                <SiZomato size={20} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
        {!(isSearchPage && isMobile) && (
          <div className="container mx-auto flex items-center px-2 justify-between">
            {/**logo */}
      {/* <div className="h-full">
              <Link
                to={"/"}
                className="h-full flex justify-center items-center"
              >
                <img
                  src={logo}
                  width={170}
                  height={60}
                  alt="logo"
                  className="hidden lg:block"
                />
                <img
                  src={logo}
                  width={120}
                  height={60}
                  alt="logo"
                  className="lg:hidden"
                />
              </Link>
            </div> */}

      {/**Search */}
      {/* <div className="hidden lg:block">
              <Search />
            </div> */}

      {/**login and my cart */}
      {/* <div className=""> */}
      {/**user icons display in only mobile version**/}
      {/* <button
                className="text-neutral-600 lg:hidden"
                onClick={handleMobileUser}
              >
                <FaRegCircleUser size={26} />
              </button> */}

      {/**Desktop**/}
      {/* <div className="hidden lg:flex  items-center gap-10">
                {user?._id ? (
                  <div className="relative">
                    <div
                      onClick={() => setOpenUserMenu((preve) => !preve)}
                      className="flex select-none items-center gap-1 cursor-pointer"
                    >
                      <p>Account</p>
                      {openUserMenu ? (
                        <GoTriangleUp size={25} />
                      ) : (
                        <GoTriangleDown size={25} />
                      )}
                    </div>
                    {openUserMenu && (
                      <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                      <UserMenu close={handleCloseUserMenu} />
                      </div>
                      </div>
                      )}
                  </div> */}
      {/* ) : (
                  <>
                    <button
                      onClick={redirectToAdminLoginPage}
                      className="text-lg px-2"
                    >
                      Admin Login
                    </button>
                    <button
                      onClick={redirectToLoginPage}
                      className="text-lg px-2"
                    >
                      Login
                    </button>
                  </>
                )}
                {
                  
                  user?._id && user.role === "USER" && (
                    <button
                      onClick={handleOpenCart}
                      className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white"
                    > */}
      {/** Add to cart icon */}
      {/* <div className="animate-bounce">
                        <BsCart4 size={26} />
                      </div>
                      <div className="font-semibold text-sm">
                      {totalQty ? (
                        <div>
                            <p>{totalQty} Items</p>
                          </div>
                        ) : (
                          <p>My Cart</p>
                        )}
                      </div>
                    </button> */}
      {/* )
                }
              </div>
            </div> 
          </div>
        )} */}

      {/* <div className="container mx-auto px-2 lg:hidden">
          <Search />
        </div> */}
      {/* 
        {isCartOpen && (
          <DisplayCartItem close={() => dispatch(setIsCartOpen(false))} />
        )}
      </header> */}

      <UserMenu close={handleCloseUserMenu} open={openUserMenu} />
    </>
  );
};

export default Header;

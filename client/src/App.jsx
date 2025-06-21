  import { useEffect, useState } from 'react'
  import { Outlet, useLocation,useNavigate } from 'react-router-dom'
  import './App.css'
  // import Header from './components/Header'
  import Header from  './components/Header.jsx'
  import Footer from './components/Footer'
  import toast, { Toaster } from 'react-hot-toast';
  import fetchUserDetails from './utils/fetchUserDetails';
  import { setUserDetails } from './store/userSlice';
  import { setAllCategory,setLoadingCategory } from './store/productSlice';
  import { useDispatch, useSelector } from 'react-redux';
  import Axios from './utils/Axios';
  import { setDataLoading } from './store/loadingSlice';
  import { AnimatePresence, motion } from 'framer-motion'
  import Loader from './pages/Loader.jsx'
  import SummaryApi from './common/SummaryApi';
  import GlobalProvider from './provider/GlobalProvider';
  import { FaCartShopping } from "react-icons/fa6";
  import CartMobileLink from './components/CartMobile';
  import ProductPage from './pages/ProductPage';
  import BottomToolBar from './components/BottomToolBar.jsx'
  import SignUp from './pages/SignUp.jsx';
  import Login from './pages/Login.jsx';
  import checkout from './pages/CheckoutPage.jsx';




  function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();


    const [isLoading, setIsLoading] = useState();
    const excludedRoutesForLoader = [
    "/login", "/register", "/checkout", "/dashboard/checkout", "/forgot-password", "/success"
    ,"/search","/about-us", "/Privacy-Policy","/dashboard/myorders", "/dashboard/Myprofile",
    "/dashboard/address","/verification-otp","/reset-password"




  ];
    const hideLayoutRoutes = [
      "/register", "/login", "/dashboard/checkout", "/forgot-password",
      "/verification-otp", "/success",
    ];
    const hideLayout = hideLayoutRoutes.includes(location.pathname);


    const fetchUser = async () => {
      try {
        dispatch(setDataLoading(false));
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
        dispatch(setDataLoading(true));
        if (userData === "Provide  token") {
          const pathParts = location.pathname.split("/").filter(Boolean);
          if (pathParts[1] === "dashboard") {
            navigate("/admin/login");
          } else if (pathParts[0] === "dashboard") {
            navigate("/login");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };


    useEffect(() => {
      fetchUser();
    }, []);


    // ⚡ Trigger loader every time the route changes
    useEffect(() => {
        if (excludedRoutesForLoader.includes(location.pathname)) {
      setIsLoading(false);
      return;
    }
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }, 2000); // ⏳ minimum 2 seconds loader


      return () => clearTimeout(timer);
    }, [location.pathname]);


    return (
      <GlobalProvider>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {!hideLayout && <Header />}
            <main className="bg-white">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </main>
            {!hideLayout && <Footer />}
            <Toaster />
            {location.pathname !== "/checkout" && <CartMobileLink />}
          </>
        )}
      </GlobalProvider>
    );
  }


  export default App;

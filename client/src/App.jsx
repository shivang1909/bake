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
import AdminHeader from './components/AdminHeader.jsx'

  function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    

const pathname = window.location.pathname;
    const [isLoading, setIsLoading] = useState();
    const excludedRoutesForLoader = [
    "/login", "/register", "/checkout", "/dashboard/checkout", "/forgot-password", "/success"
    ,"/search","/about-us", "/Privacy-Policy", "/Terms-conditions", "/Contact-Us","/dashboard/myorders", "/dashboard/Myprofile",
    "/dashboard/address","/verification-otp","/reset-password",
  ];
    const hideLayoutRoutes = [
      "/register", "/login", "/dashboard/checkout", "/forgot-password",
      "/verification-otp", "/success" ,"/admin/login","/admin/forgot-password"  ,"/admin/reset-password","/admin/verification-otp"
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

    const fetchCategory = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.getCategory
        })   
        const { data : responseData } = response;
        console.log(`this is response of category ${JSON.stringify(responseData.data)}`);
        
        if(responseData.success){
           dispatch(setAllCategory(responseData.data)) 
        }
        console.log(`this is category `,responseData.data);
        
    } catch (error) {
      console.log("Error fetching categories:", error);
      
    }finally{
      dispatch(setLoadingCategory(false))
    }
  }


    useEffect(() => {
      fetchUser();
      fetchCategory();
    }, []);

    useEffect(()=>{
      console.log(user)
    },[user])


    // ⚡ Trigger loader every time the route changes
     useEffect(() => {
        if (excludedRoutesForLoader.includes(location.pathname) || pathname.startsWith("/product/")
        || pathname.startsWith("/admin/")
        ) {
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
        {/* {isLoading ? (
          <Loader />
        ) : ( */}
          <>
            <main className="bg-white w-[100vw]">
            {!hideLayout && ((user.role && user.role !== "USER") ? <AdminHeader /> : <Header />)}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            {!hideLayout && (!user.role || user.role === "USER") && <Footer />}
            </main>

            <Toaster />
            {location.pathname !== "/checkout" && <CartMobileLink />}
          </>
        {/* )} */}
      </GlobalProvider>
    );
  }


  export default App;

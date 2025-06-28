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
  import SummaryApi from './common/SummaryApi';
  import GlobalProvider from './provider/GlobalProvider';
  import CartMobileLink from './components/CartMobile';;
import AdminHeader from './components/AdminHeader.jsx'

  function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

useEffect(() => {
  const handleScroll = () => {
    console.trace("Body scrolled");
  };

  document.body.addEventListener("scroll", handleScroll);

  return () => {
    document.body.removeEventListener("scroll", handleScroll);
  };
}, []);

    

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




    return (
      <GlobalProvider>
        {/* {isLoading ? (
          <Loader />
        ) : ( */}
          <>
            {!hideLayout && ((user.role && user.role !== "USER") ? <AdminHeader /> : <Header />)}
            <main className="bg-white w-[100vw]">
                <Outlet />
            </main>
            {!hideLayout && (!user.role || user.role === "USER") && <Footer />}

            <Toaster />
            {location.pathname !== "/checkout" && <CartMobileLink />}
          </>
        {/* )} */}
      </GlobalProvider>
    );
  }


  export default App;

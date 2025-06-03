import { Outlet, useLocation,useNavigate } from 'react-router-dom'
import './App.css'
// import Header from './components/Header'
import Header from  './components/Header.jsx'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory,setLoadingCategory } from './store/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import Axios from './utils/Axios';
import { setDataLoading } from './store/loadingSlice';

import SummaryApi from './common/SummaryApi';
import GlobalProvider from './provider/GlobalProvider';
import { FaCartShopping } from "react-icons/fa6";
import CartMobileLink from './components/CartMobile';
import ProductPage from './pages/ProductPage';
import BottomToolBar from './components/BottomToolBar.jsx'


function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()  

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

  // 👇 ADD THIS to fix scroll issue
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh] bg-white">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {location.pathname !== '/checkout' && <CartMobileLink />}
    </GlobalProvider>
  );
}


export default App

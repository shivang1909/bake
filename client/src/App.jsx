import { Outlet, useLocation,useNavigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory,setLoadingCategory } from './store/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import Axios from './utils/Axios';

import SummaryApi from './common/SummaryApi';
import { handleAddItemCart } from './store/cartProduct'
import GlobalProvider from './provider/GlobalProvider';
import { FaCartShopping } from "react-icons/fa6";
import CartMobileLink from './components/CartMobile';
function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()  

 
// const fetchUser = async () => {
//    const userData = await fetchUserDetails();
//    console.log(userData);
//    if (!userData) {
//      navigate("/login");
//    } else {
//      dispatch(setUserDetails(userData.data));  // Update Redux state
//      if (userData.data.role === 'admin') {
//        navigate("/admin/dashboard");  // Redirect to admin dashboard
//      } else {
//        navigate("/");  // Redirect to home or other route for non-admins
//      }
//    }
// };

const fetchUser = async () => {
  try{
    const userData = await fetchUserDetails();
    dispatch(setUserDetails(userData.data));

    if (userData === "Provide  token") {
        console.log(location.pathname);
  
        const pathParts = location.pathname.split("/").filter(Boolean); // Remove empty strings
  
        if (pathParts[1] === "dashboard") {
            navigate("/admin/login");
        } else if(pathParts[0] === "dashboard"){
            navigate("/login");
        } 
    }
  }
  catch(error)
  {
    console.log(error);
  }
};
  const fetchCategory = async()=>{
    try {
        dispatch(setLoadingCategory(true))
        const response = await Axios({
            ...SummaryApi.getCategory
        })   
        const { data : responseData } = response;
        console.log(`this is response of category ${JSON.stringify(responseData.data)}`);
        
        if(responseData.success){
           dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {

    }finally{
      dispatch(setLoadingCategory(false))
    }
  }


  

  useEffect(()=>{
    fetchUser()
    fetchCategory()
    // fetchCartItem()
  },[])

  return (
    <GlobalProvider> 
      <Header/>
      <main className='min-h-[78vh]'>
          <Outlet/>
      </main>
      <Footer/>
      <Toaster/>
      {
        location.pathname !== '/checkout' && (
          <CartMobileLink/>
        )
      }
    </GlobalProvider>
  ) 
}

export default App

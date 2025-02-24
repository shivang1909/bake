import { createContext,useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null)

export const useGlobalContext = ()=> useContext(GlobalContext)

const GlobalProvider = ({children}) => {
    const dispatch = useDispatch()
    const [totalPrice,setTotalPrice] = useState(0)
    const [notDiscountTotalPrice,setNotDiscountTotalPrice] = useState(0)
    const [totalQty,setTotalQty] = useState(0)
    const [cartItems, setCartItem] = useState([]);

    const user = useSelector(state => state?.user)
    const fetchCartDetails = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.usercartdetails,
        });
        const { data: responseData } = response;
        if (responseData.success) {
          console.log(responseData.data);
    
          setCartItem(responseData.data);
          
          calculateTotalPriceandQty(responseData);
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };
    const calculateTotalPriceandQty= (responseData) =>{
      let finalTotal = 0;
      let quantity = 0;
      let discountedPrice=0;
      for (let i = 0; i < responseData.data.length; i++) {
        let eachDiscount =0;
        for (let j = 0;j < responseData.data[i].variantPrices.length;j++) {
          finalTotal = finalTotal + (responseData.data[i].variantPrices[j].price * responseData.data[i].variantPrices[j].quantity);
          quantity = quantity + responseData.data[i].variantPrices[j].quantity;
          eachDiscount= (responseData.data[i].variantPrices[j].price * responseData.data[i].variantPrices[j].quantity) * (responseData.data[i].variantPrices[j].discount / 100)
          discountedPrice = discountedPrice + eachDiscount        
        }
      }
      setNotDiscountTotalPrice(finalTotal);
      setTotalQty(quantity);  
      setTotalPrice(finalTotal- discountedPrice);
    } 


    const handleLogoutOut = ()=>{
        localStorage.clear()
        dispatch(handleAddItemCart([]))
    }

    const fetchAddress = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getAddress
        })
        const { data : responseData } = response

        if(responseData.success){
          dispatch(handleAddAddress(responseData.data))
        }
      } catch (error) {
          // AxiosToastError(error)
      }
    }
    const fetchOrder = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getOrderItems,
        })
        const { data : responseData } = response

        if(responseData.success){
            dispatch(setOrder(responseData.data))
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
      handleLogoutOut()
      fetchAddress()
      fetchOrder()
    },[user])
    
    return(
        <GlobalContext.Provider value={{
          fetchCartDetails,
            setCartItem,
            cartItems,
            setTotalPrice,
            setTotalQty,
            setNotDiscountTotalPrice,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchAddress,
            fetchOrder
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
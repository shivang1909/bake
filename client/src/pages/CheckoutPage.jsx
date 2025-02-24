import React, { useEffect, useMemo, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useDispatch, useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import {updatedShoppingCart} from '../store/userSlice'

const CheckoutPage = () => {
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const dispatch =useDispatch()
  const [selectAddress, setSelectAddress] = useState(0)
  // const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()
  const {setTotalQty,setCartItem} = useGlobalContext()
  const [checkoutItems, setcheckoutItems] = useState([]);

  const handleCashOnDelivery = async() => {
      try {

          const response = await Axios({
            ...SummaryApi.CashOnDeliveryOrder,
            data : {
              list_items : checkoutItems,
              addressId : addressList[selectAddress]?._id,
              total: finalTotal-discountedPrice
            }
          })
          const { data : responseData } = response

          if(responseData.success){
              toast.success(responseData.message)
              setCartItem([])
              dispatch (updatedShoppingCart([]))
              setTotalQty(0)
              navigate('/success',{
                state : {
                  text : "Order"
                }
              })
          }
      } catch (error) {
        console.log(error);
        AxiosToastError(error)
      }
  }

  const handleOnlinePayment = async()=>{
    try {
        toast.loading("Loading...")
        const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
        const stripePromise = await loadStripe(stripePublicKey)
       
        const response = await Axios({
            ...SummaryApi.payment_url,
            data : {
              list_items : cartItemsList,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : finalTotal-discountedPrice,
              totalAmt :  finalTotal-discountedPrice,
            }
        })

        const { data : responseData } = response

        stripePromise.redirectToCheckout({ sessionId : responseData.id })
        
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
    } catch (error) {
        AxiosToastError(error)
    }
  }

  
const { finalTotal, quantity, discountedPrice } = useMemo(() => {
    let finalTotal = 0;
    let quantity = 0;
    let discountedPrice = 0;

        for (let i = 0; i < checkoutItems.length; i++) {
          let eachDiscount =0;
          for (let j = 0;j < checkoutItems[i].variantPrices.length;j++) {
            finalTotal = finalTotal + (checkoutItems[i].variantPrices[j].price * checkoutItems[i].variantPrices[j].quantity);
            quantity = quantity + checkoutItems[i].variantPrices[j].quantity;
            eachDiscount= (checkoutItems[i].variantPrices[j].price * checkoutItems[i].variantPrices[j].quantity) * (checkoutItems[i].variantPrices[j].discount / 100)
            console.log(eachDiscount);
            
            discountedPrice = discountedPrice + eachDiscount        
          }
        }

    return { finalTotal, quantity, discountedPrice };
  }, [checkoutItems]);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.usercartdetails,
        });
        const { data: responseData } = response;
        if (responseData.success) {
          setcheckoutItems(responseData.data);
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };
    fetchCartDetails();

  }, []);

  return (
    <section className='bg-blue-50'>
      {console.log(checkoutItems)}
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/***address***/}
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className='bg-white p-2 grid gap-4'>
            {
              addressList.map((address, index) => {
                return (
                  <label htmlFor={"address" + index} className={!address.status && "hidden"}>
                    <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                      <div>
                        <input id={"address" + index} type='radio' value={index} onChange={(e) => setSelectAddress(e.target.value)} name='address' />
                      </div>
                      <div>
                        <p>{address.address_line}</p>
                        <p>{address.city}</p>
                        <p>{address.state}</p>
                        <p>{address.country} - {address.pincode}</p>
                        <p>{address.mobile}</p>
                      </div>
                    </div>
                  </label>
                )
              })
            }
            <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
              Add address
            </div>
          </div>
        </div>
        {/* =================================================== */}
            {/* <div className="min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4">
                      {cartItems.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
                            <p>Your total savings</p>
                            <p>
                              {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                            {cartItems.map((item, productIndex) =>
                              item.variantPrices.map((variant, index) => (
                                <div
                                key={`${item.productId}_product_${index}`}
                                  className="flex flex-col w-full gap-4 border-b pb-4"
                                >
                                  <div className="flex gap-4 items-start">
                                    <div className="w-16 h-16 bg-red-500 border rounded">
                                      <img
                                        src={item.coverimage}
                                        alt={item.name}
                                        className="w-full h-full object-scale-down"
                                      />
                                    </div>
                                    <div className="w-full">
                                      <p className="text-sm font-semibold">
                                        {item.itemname}
                                      </p>
                                      <div
                                        key={`${item.productId}_variant_${index}`}
                                        className="flex justify-between items-center mt-2"
                                      >
                                        <div>
                                          <p className="text-xs text-neutral-400">
                                            Weight: {variant.weight}
                                          </p>
                                          <p className="font-semibold">
                                            {DisplayPriceInRupees(
                                              pricewithDiscount(
                                                variant.price,
                                                variant.discount 
                                              )*variant.quantity
                                            )}
                                          </p>
                                        </div>
                                        <div className="w-full max-w-[150px]">
                                          <div className="flex w-full h-full">
                                            <button
                                              onClick={() =>
                                                decreaseQty(
                                                  variant.quantity,
                                                  productIndex,
                                                  index
                                                )
                                              }
                                              className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
                                            >
                                              <FaMinus />
                                            </button>
            
                                            <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
                                              {variant.quantity}
                                            </p>
            
                                            <button
                                              onClick={()=> 
                                                increaseQty(
                                                variant.quantity,
                                                  productIndex,
                                                  index
                                              )}
                                              className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
                                            >
                                              <FaPlus />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div> */}
        {/* =================================================== */}

        <div className='w-full max-w-md bg-white py-4 px-2'>
          {/**summary**/}
          {checkoutItems.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
                          <p>Your total savings</p>
                          <p>
                            {DisplayPriceInRupees( discountedPrice)}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                          {checkoutItems.map((item, productIndex) =>
                            item.variantPrices.map((variant, index) => (
                              <div
                              key={`${item.productId}_product_${index}`}
                                className="flex flex-col w-full gap-4 border-b pb-4"
                              >
                                <div className="flex gap-4 items-start">
                                  <div className="w-16 h-16 bg-red-500 border rounded">
                                    <img
                                      src={item.coverimage}
                                      alt={item.name}
                                      className="w-full h-full object-scale-down"
                                    />
                                  </div>
                                  <div className="w-full">
                                    <p className="text-sm font-semibold">
                                      {item.itemname}
                                    </p>
                                    <div
                                      key={`${item.productId}_variant_${index}`}
                                      className="flex justify-between items-center mt-2"
                                    >
                                      <div>
                                        <p className="text-xs text-neutral-400">
                                          Weight: {variant.weight}
                                        </p>
                                        <p className="font-semibold">
                                          {DisplayPriceInRupees(
                                            pricewithDiscount(
                                              variant.price,
                                              variant.discount 
                                            )*variant.quantity
                                          )}
                                        </p>
                                      </div>
                                      <div className="w-full max-w-[150px]">
                                        <div className="flex w-full h-full">
                                
                                          <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
                                          Quantity: {variant.quantity}
                                          </p>
          
                                         
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="bg-white p-4">
                          <h3 className="font-semibold">Bill details</h3>
                          <div className="flex gap-4 justify-between ml-1">
                            <p>Items total</p>
                            <p className="flex items-center gap-2">
                              <span className="line-through text-neutral-400">
                              {DisplayPriceInRupees(finalTotal)}
                                
                              </span>
                              <span>{DisplayPriceInRupees(finalTotal-discountedPrice)}</span>
                            </p>
                          </div>
                          <div className="flex gap-4 justify-between ml-1">
                            <p>Quantity total</p>
                            <p className="flex items-center gap-2">{quantity} items</p>
                          </div>
                          <div className="flex gap-4 justify-between ml-1">
                            <p>Delivery Charge</p>
                            <p className="flex items-center gap-2">Free</p>
                          </div>
                          <div className="font-semibold flex items-center justify-between gap-4">
                            <p>Grand total</p>
                            <p>{DisplayPriceInRupees(finalTotal-discountedPrice)}</p>
                          </div>
                        </div>
                        <div className='w-full flex flex-col gap-4'>
                          <button className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold' onClick={handleOnlinePayment}>Online Payment</button>

                          <button className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' onClick={handleCashOnDelivery}>Cash on Delivery</button>
                        </div>
                      </>
         ) : (
          "Helo"
         )}
          {/* <h3 className='text-lg font-semibold'>Summary</h3>
          <div className='bg-white p-4'>
            <h3 className='font-semibold'>Bill details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Items total</p>
              <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Quntity total</p>
              <p className='flex items-center gap-2'>{totalQty} item</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Delivery Charge</p>
              <p className='flex items-center gap-2'>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4'>
              <p >Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <button className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold' onClick={handleOnlinePayment}>Online Payment</button>

            <button className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' onClick={handleCashOnDelivery}>Cash on Delivery</button>
          </div>
        </div> */}
      </div>
      </div>


      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}

export default CheckoutPage

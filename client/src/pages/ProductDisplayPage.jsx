import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { useDispatch, useSelector } from 'react-redux'
import {updatedShoppingCart} from '../store/userSlice'
import { setDataLoading } from '../store/loadingSlice'
import DisplayCartItem from '../components/DisplayCartItem'

import {setIsCartOpen} from "../store/loadingSlice"


const ProductDisplayPage = () => {
  const params = useParams()
   const cartdata = useSelector(state => state.user.shopping_cart)
   const loadingValue = useSelector(state => state.loading.loadingValue)
  // const [cartdata, setCartdata] = useState([]);  // Define the state
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const dispatch= useDispatch()
  console.log(cartdata);
  const user = useSelector((state) => state.user);
  const [data,setData] = useState({
    name : "",  
    image : [],
    weightVariants: [],
  })
  const [image,setImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [loading,setLoading] = useState(false)
  const imageContainer = useRef()
  const [isAdded , setCart] = useState(false); 
  const [categoryName, setCategoryName] = useState("");
  
  const fetchProductDetails = async()=>{
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data : {
          productId : productId 
        }
      })
      const { data: responseData } = response;
      if (responseData.success) {
          console.log(responseData)
          setData(responseData.data);
 
        }
    } catch (error) {
      console.log(error)
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  const compareCart = (index) =>{
    console.log("this is data",cartdata)
    const productIndex = cartdata.findIndex(item => item.productId === productId);
    if(productIndex >= 0)
    {
      console.log(productIndex);
      cartdata[productIndex].variants.map(
        (variant) => {
          console.log(selectedVariant)
          if(variant.weight === index)
            {
            console.log(isAdded)
            setCart(true)
            return
          }
        }
      );
    }
  }
useEffect(()=>{
  fetchProductDetails(); 
  if (data.category) {
    fetchCategoryName(data.category); // Fetch category name only if category ID exists
  }
},[data.category])

useEffect(()=>{
  if (user._id != undefined) {
    setCart(false)
    compareCart(selectedVariant);
  }
},[loadingValue,selectedVariant])



const fetchCategoryName = async (categoryId) => {
  try {
    const response = await Axios(
      SummaryApi.getCategoryById.url.replace(":id", categoryId)
    ); // Adjust API endpoint as needed
    console.log("Category name response:", response.data.data);
    if (response.data.success) {
      setCategoryName(response.data.data); // Assuming API returns `{ success: true, data: { name: "Category Name" } }`
    }
  } catch (error) {
    console.error("Error fetching category name:", error);
  }
};

const addCartItem = async () => {
  if (user._id === undefined) {
    AxiosToastError({
      response: {
        data: {
          message: "Please Login To Add Item in Cart" // Custom error message
        }
      }
    });
    return;
    // AxiosToastError(error)
  }
  let newVariant = {
    weight: selectedVariant, // The selected weight or variant
    cartQty: 1,
  };

  console.log(cartdata)
  // Find the product in the cart
  const productIndex = cartdata.findIndex(item => item.productId === productId);
  console.log(productIndex)
  let updatedCartData;

  if (productIndex === -1) {
    // Product does not exist, add it as a new entry with the selected variant
    const newProduct = {
      productId: data?._id,
      variants: [newVariant],
    };
    updatedCartData = [...cartdata, newProduct];
    setCart(true)
    console.log("new product",updatedCartData);
  } else {
    let existingProduct = {...cartdata[productIndex]};
    
      existingProduct.variants= [...existingProduct.variants, newVariant];
      setCart(true)
    updatedCartData = [...cartdata];
    updatedCartData[productIndex] = existingProduct;
  }
    dispatch(
      updatedShoppingCart(updatedCartData)
    );
  try {
    // Make API call to update the cart in the database
    const response = await Axios({
      ...SummaryApi.updateCartDetails,
      data: { cart: updatedCartData }, // Send the entire updated cart
    });
    console.log("Cart updated in the database:", response.data);
  } catch (error) {
    console.error("Error updating cart in the database:", error);
  }
};


  const handleVariantChange = (index) => {
    console.log(index);
    
    setSelectedVariant(index);
  };
  
  const handleScrollRight = ()=>{
    imageContainer.current.scrollLeft += 100
  }
  const handleScrollLeft = ()=>{
    imageContainer.current.scrollLeft -= 100
  }
  const  handleCartOpen =()=>{
    dispatch(setIsCartOpen(true))
  }
  console.log("product data",data)
  return (
    {loadingValue} &&
    <section className='container mx-auto p-4 grid lg:grid-cols-2 '>
        <div className=''>
            <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
                <img
                    src={data.image[image]}
                    className='w-full h-full object-scale-down'
                /> 
            </div>
            <div className='flex items-center justify-center gap-3 my-2'>
              {
                data.image.map((img,index)=>{
                  return(
                    <div key={img+index+"point"} className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}></div>
                  )
                })
              }
            </div>
            <div className='grid relative'>
                <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
                      {
                        data.image.map((img,index)=>{
                          return(
                            <div className='w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md' key={img+index}>
                              <img
                                  src={img}
                                  alt='min-product'
                                  onClick={()=>setImage(index)}
                                  className='w-full h-full object-scale-down' 
                              />
                            </div>
                          )
                        })
                      }
                </div>
                <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute  items-center'>
                    <button onClick={handleScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
                        <FaAngleLeft/>
                    </button>
                    <button onClick={handleScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
                        <FaAngleRight/>
                    </button>
                </div>
            </div>
            <div>
            </div>
        </div>
        <div className='p-4 lg:pl-7 text-base lg:text-lg'>
            <p className='bg-green-300 w-fit px-2 rounded-full'>10 Min</p>
            <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>  
            {/* <p className=''>{data.unit}</p>  */}
            <Divider/>
        {/* Product Pricing */}
        <div>
          <p>Price</p>
          {console.log(data)}
          
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
              <p className="font-semibold text-lg lg:text-xl">
                {DisplayPriceInRupees(pricewithDiscount(data.weightVariants[selectedVariant]?.price || 0, data.weightVariants[selectedVariant]?.discount))}
              </p>
            </div>
            {data.weightVariants[selectedVariant]?.discount > 0 && (
              <>
                <p className="line-through">{DisplayPriceInRupees(data.weightVariants[selectedVariant]?.price || 0)}</p>
                <p className="font-bold text-green-600 lg:text-2xl">
                  {data.weightVariants[selectedVariant]?.discount}% <span className="text-base text-neutral-500">Discount</span>
                </p>
              </>
            )}
          </div>
        </div>

         {/* Available Weight Variants */}
      <div className="my-4">
        <p className="font-semibold">Available Variants</p>
        <div className="flex gap-2">
          {data.weightVariants?.map((variant,index) => (
            <button
              key={variant._id}
              className={`px-4 py-2 border rounded ${
                selectedVariant === index ? "bg-green-500 text-white" : "bg-white"
              }`}
              onClick={() => handleVariantChange(index)}
            >
              {variant.weight}
            </button>
          ))}
        </div>
      </div>
      {/* Add to Cart Button */}
      {data.weightVariants[selectedVariant]&&data.weightVariants[selectedVariant].qty> 0 ? (
        <div className="my-4">
          {isAdded?(
              // <DisplayCartItem  />
            <button  className='bg-orange-500' onClick={handleCartOpen} >Go To Cart</button>
          ):(
            <button onClick={addCartItem}  className='bg-green-500'>Add </button>
          )}
        </div>
      ) : (
        <p className="text-lg text-red-500 my-2">Out of Stock</p>
      )}



            {/****only mobile */}
            <div className='my-4 grid gap-3 '>
                <div>
                    <p className='font-semibold'>Description</p>
                    <p className='text-base'>{data.description}</p>
                </div>
                <div>
                    <p className='font-semibold'>Category</p>
                    <p className='text-base'>{categoryName  || "Loading..."}</p>
                </div>
                {
                  data?.more_details && Object.keys(data?.more_details).map((element,index)=>{
                    return(
                      <div>
                          <p className='font-semibold'>{element}</p>
                          <p className='text-base'>{data?.more_details[element]}</p>
                      </div>
                    )
                  })
                }
            </div>
        </div>
    </section>
  )
}

export default ProductDisplayPage

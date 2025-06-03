// import React from 'react'
// import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
// import { Link } from 'react-router-dom'
// import { valideURLConvert } from '../utils/valideURLConvert'
// import { pricewithDiscount } from '../utils/PriceWithDiscount'
// import SummaryApi from '../common/SummaryApi'
// import AxiosToastError from '../utils/AxiosToastError'
// import Axios from '../utils/Axios'
// import toast from 'react-hot-toast'
// import { useState } from 'react'
// import { useGlobalContext } from '../provider/GlobalProvider'
// import AddToCartButton from './AddToCartButton'


// const CardProduct = ({data}) => {
//     const url = `/product/${valideURLConvert(data.name)}-${data._id}`
//     const [loading,setLoading] = useState(false)
//     const firstVariant = data.weightVariants[0];
//     // Function to apply discount
//   const priceWithDiscount = (price, discount) => {
//     return price - (price * discount) / 100;
//   };

//   return (
//     <Link to={url} className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white' >
//       <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
//             <img 
//                 src={data.image[0]}
//                 className='w-full h-full object-scale-down lg:scale-125'
//             />
//       </div>
//       <div className='flex items-center gap-1'>
//         <div className='rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50'>
//               10 min 
//         </div>
//         <div>
//             {
//               Boolean(data.discount) && (
//                 <p className='text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full'>{data.discount}% discount</p>
//               )
//             }
//         </div>
//       </div>
//       {/* <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
//         {data.name}
//       </div>
//       <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
//         {data.unit} 
        
//       </div>

//       <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
//       <div className="font-semibold">
//       <div>
//         <label>Select Weight:</label>
//         <select
//           value={selectedVariant._id}
//           onChange={(e) => {
//             const variant = data.weightVariants.find(
//               (v) => v._id === e.target.value
//             );
//             setSelectedVariant(variant);
//           }}
//         >
//           {console.log(data.weightVariants)}
//           {data.weightVariants.map((variant) => (
//             <option key={variant._id} value={variant._id}>
//               {variant.weight}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         Price:{" "}
//         {priceWithDiscount(selectedVariant.price, data.discount)} ₹
//       </div>
//     </div> */}
//      <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
//         {data.name}
//       </div>

//       {/* Display the first variant's weight
//       <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
//         Weight:{firstVariant.weight} 
//       </div> */}

//       {/* Display the first variant's price with discount */}
//       <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
//         <div className="font-semibold">
//           <div>From: {priceWithDiscount(firstVariant.price, data.discount)} ₹</div>
//         </div>

//         {/* Add to Cart Button */}
//         <div>
//           {firstVariant.qty === 0 ? (
//             <p className="text-red-500 text-sm text-center">Out of stock</p>
//           ) : (
//             <AddToCartButton data={{ ...data, selectedVariant: firstVariant }} />
//           )}
//         </div>
//       </div>

//     </Link>
//   )
// }

// export default CardProduct


import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { TbShoppingBagPlus } from "react-icons/tb";



const CardProduct = ({ data }) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading, setLoading] = useState(false)
   
    // Getting the first variant details
    const firstVariant = data?.weightVariants?.[0];
    const Productprice = firstVariant?.price;
    const ProductQty = firstVariant?.qty;
    const discount = firstVariant?.discount;

    // Function to apply discount to the price
    const priceWithDiscount = (price, discount) => {
        return price - (price * discount) / 100;
    };
    
    // Calculate the price with discount if discount exists
    const discountedPrice = discount ? priceWithDiscount(Productprice, discount) : null;

    return (
        <Link to={url} className="bg-white rounded-3xl border hover:shadow-sm shadow-md transition p-3 lg:p-4 w-full min-w-36 lg:min-w-52 grid gap-2">
        {/* Image Container */}
        <div className="h-24 lg:h-32 w-full rounded overflow-hidden flex items-center justify-center">
          <img
            src={data.image[0]}
            alt={data.name}
            className="object-scale-down w-full h-full"
          />
        </div>
      
        {/* Badges */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-1 px-1">
        {Boolean(discount) && (
            <span className="inline-block lg:hidden text-green-600 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded-full w-fit">

              {discount}% off
            </span>
          )}
             {/* Product Name */}
        <h3 className="text-sm lg:text-base font-medium text-ellipsis line-clamp-2 px-1">
          {data.name}
        </h3>
          {/* <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full">
            10 min
          </span> */}
          {Boolean(discount) && (
            <span className="hidden lg:block text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">
              {discount}% off
            </span>
          )}
        </div>
      
       
      
        {/* Price & Button */}
        <div className="px-1 flex flex-row gap-1 justify-between items-center">
          {discount === 0 ? (
            Productprice && (
              <p className="text-sm">Price: <strong>{Productprice} ₹</strong></p>
            )
          ) : (
            <>
            <div className='flex flex-row gap-1'>
              {Productprice && (
                  <p className="text-xs text-gray-500 line-through">
                   ₹{Productprice}
                </p>
              )} 
              {discountedPrice && (
              <p className="text-xs text-green-700">
                 <strong>{discountedPrice} ₹</strong>
              </p>
            )}
            </div>
             
            </>
          )}
      
          {ProductQty === 0 ? (
            <p className="text-red-500 text-md">Out of stock</p>
          ) : (
            <button className=" text-orange-500 transition-all duration-300 active:scale-95 bg-gray-50 text-[25px] shadow-inner py-1 px-1 rounded-full self-start">
              <TbShoppingBagPlus/>
            </button>
          )}
        </div>
      </Link>
      
    )
}

export default CardProduct

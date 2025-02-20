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
        <Link to={url} className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white'>
            <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
                <img 
                    src={data.image[0]} 
                    className='w-full h-full object-scale-down lg:scale-125'
                    alt={data.name}  // Added alt for accessibility
                />
            </div>

            {/* Product details */}
            <div className='flex items-center gap-1'>
                <div className='rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50'>
                    10 min 
                </div>
                <div>
                    {Boolean(discount) && (
                        <p className='text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full'>
                            {discount}% discount
                        </p>
                    )}
                </div>
            </div>

            {/* Product name */}
            <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
                {data.name}
            </div>

            {/* Product price with and without discount */}
            <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
            {discount === 0 ? (
                    <>
                    {Productprice && (
                        <div >Price: {Productprice} ₹</div>
                        )}
                    </>
                    ) : (
                    <>
                        {discountedPrice && (
                        <div>Discounted: {discountedPrice} ₹</div>
                        )}
                        {Productprice && (
                        <div className="text-gray-500 line-through">Original: {Productprice} ₹</div>
                        )}
                    </>
                    )}
                {/* Add to Cart Button */}
                <div>
                    {ProductQty === 0 ? (
                        <p className="text-red-500 text-sm text-center">Out of stock</p>
                    ) : (
                      <button className='bg-green-500 rounded-xl p-1' >More Details</button>
                        // <AddToCartButton data={{ ...data, selectedVariant: firstVariant }} />
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CardProduct

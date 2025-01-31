import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'


const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading] = useState(false)
    const [selectedVariant, setSelectedVariant] = useState(data.weightVariants[0]); // Default to first variant
  // Function to apply discount
  const priceWithDiscount = (price, discount) => {
    return price - (price * discount) / 100;
  };

  return (
    <Link to={url} className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white' >
      <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
            <img 
                src={data.image[0]}
                className='w-full h-full object-scale-down lg:scale-125'
            />
      </div>
      <div className='flex items-center gap-1'>
        <div className='rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50'>
              10 min 
        </div>
        <div>
            {
              Boolean(data.discount) && (
                <p className='text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full'>{data.discount}% discount</p>
              )
            }
        </div>
      </div>
      <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
        {data.name}
      </div>
      <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
        {data.unit} 
        
      </div>

      <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
      <div className="font-semibold">
      <div>
        <label>Select Weight:</label>
        <select
          value={selectedVariant._id}
          onChange={(e) => {
            const variant = data.weightVariants.find(
              (v) => v._id === e.target.value
            );
            setSelectedVariant(variant);
          }}
        >
          {console.log(data.weightVariants)}
          {data.weightVariants.map((variant) => (
            <option key={variant._id} value={variant._id}>
              {variant.weight}
            </option>
          ))}
        </select>
      </div>

      <div>
        Price:{" "}
        {priceWithDiscount(selectedVariant.price, data.discount)} ₹
      </div>
    </div>
        {/* Add to Cart Button with Selected Variant */}
        <div>
          {selectedVariant.qty === 0 ? (
            <p className="text-red-500 text-sm text-center">Out of stock</p>
          ) : (
            <AddToCartButton data={{ ...data, selectedVariant }} />
          )}
        </div>
      </div>

    </Link>
  )
}

export default CardProduct

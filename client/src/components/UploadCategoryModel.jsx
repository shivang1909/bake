import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';
import { useDispatch, useSelector } from 'react-redux';
import { setAllCategory } from '../store/productSlice';


const UploadCategoryModel = ({close, fetchData}) => {

    const [data,setData] = useState({name: "", image: null});
    const [loading,setLoading] = useState(false)

    const handleOnChange = (e)=>{
            setData((prev)=>({
                ...prev,
                name: e.target.value
            }))
         
    }
    
        const allCategory = useSelector(state => state.product.allCategory)
       const usedispatch = useDispatch();
    const handleSubmit = async(e)=>{
        e.preventDefault()
    
   
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append('name',data.name)
            formData.append('image', data.image);
            const response = await Axios({
                ...SummaryApi.addCategory,
                data : formData 
            })
            const { data : responseData } = response
          
            usedispatch(setAllCategory([...allCategory, responseData.data]));

            if(responseData.success){
                // setAllCategory(usedispatch([...allCategory,responseData.data]))
                // console.log(allCategory)
                toast.success(responseData.message)
                close()
                fetchData()
              
            }
        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }
    // for the image preview on on change 
    const [imagePreview, setImagePreview] = useState(null);
    const handleUploadCategoryImage = async(e)=>{

         

        const file = e.target.files[0]
        
        if (file) {
            
            setData((prev)=>({
                ...prev,
                image : file
            })) 
            const url = URL.createObjectURL(file);
           setImagePreview(url)
       
        }
        if(!file){
            
            return
        }
      

        
    }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center'>
        <div className='bg-white max-w-4xl w-full p-4 rounded'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold'>Category</h1>
                <button onClick={close} className='w-fit block ml-auto'>
                    <IoClose size={25}/>
                </button>
            </div>
            <form className='my-3 grid gap-2' onSubmit={handleSubmit} encType='multipart/form-data' >
                <div className='grid gap-1'>
                    <label id='categoryName'>Name</label>
                    <input
                        type='text'
                        id='categoryName'
                        placeholder='Enter category name'
                        value={data.name}
                        name='name'
                        onChange={handleOnChange}
                        className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
                    />
                </div>
                <div className='grid gap-1'>
                    <p>Image</p>
                    <div className='flex gap-4 flex-col lg:flex-row items-center'>
                        <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
                            {
                                imagePreview ? (
                                    <img
                                        alt='category'
                                        src={imagePreview}
                                        className='w-full h-full object-scale-down'
                                    />
                                ) : (
                                    <p className='text-sm text-neutral-500'>No Image</p>
                                )
                            }
                            
                        </div>
                        <label htmlFor='uploadCategoryImage'>
                            <div  className={`
                            ${!data ? "bg-gray-300" : "border-primary-200 hover:bg-primary-100" }  
                                px-4 py-2 rounded cursor-pointer border font-medium
                            `}>Upload Image</div>

                            <input disabled={!data} onChange={handleUploadCategoryImage} type='file' id='uploadCategoryImage' className='hidden'/>
                        </label>
                        
                    </div>
                </div>

                <button
                    className={`
                    ${data  ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-300 "}
                    py-2    
                    font-semibold 
                    `}
                >Add Category</button>
            </form>
        </div>
    </section>
  )
}

export default UploadCategoryModel
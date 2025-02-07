import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useDispatch, useSelector } from 'react-redux'
import { json } from 'react-router-dom'
import { setAllCategory } from '../store/productSlice'
import CategoryForm from '../components/CategoryForm'
const serverurl = import.meta.env.VITE_API_URL;

const CategoryPage = () => {
    const [openUploadCategory,setOpenUploadCategory] = useState(false)
    const [loading,setLoading] = useState(false)
    const [categoryData,setCategoryData] = useState([])
    const [openEdit,setOpenEdit] = useState(false)
    const [editData,setEditData] = useState({
        name : "",
        image : "",
    })
    const allCategory = useSelector(state => state.product.allCategory)
    
    const [openConfimBoxDelete,setOpenConfirmBoxDelete] = useState(false)
    const usedispatch = useDispatch();
    const [deleteCategory,setDeleteCategory] = useState({
        _id : "",
        image: "",
    })
    useEffect(()=>{
           setCategoryData(allCategory)
    },[])

    const handleDeleteCategory = async()=>{
        try {
           
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCategory
            })

            const { data : responseData } = response
                        // usedispatch(setAllCategory([...allCategory, responseData.data]));
            if(responseData.success){
                toast.success(responseData.message)
                usedispatch(
                    setAllCategory(
                      allCategory.filter((category) => category._id !== deleteCategory._id)
                    )
                  );
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

  return (
    <section className=''>
        <div className='p-2   bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Category</h2>
            <button onClick={()=>setOpenUploadCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'>Add Category</button>
        </div>
        {
            !allCategory[0] && !loading && (
                <NoData/>
            )
        }

        <div className='p-4 grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
            {
                allCategory.map((category,index)=>{
                    
                    return(
                        <div className='w-32 h-56 rounded shadow-md' key={category._id}>
                        
                            
                            <img 
                                alt={category.name}
                                src={serverurl+'/'+category.image} // Adjust the URL based on your backend setup
                                className='w-full object-scale-down'
                            />
                            <div className='text-center font-semibold text-sm pt-3 pb-2'>
                                {category.name}
                            </div>
                            <div className='items-center h-9 flex gap-2'>
                                <button onClick={()=>{
                                    setOpenEdit(true)
                                    setEditData(category)
                                }} className='flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded'>
                                    Edit
                                </button>
                                <button onClick={()=>{
                                    setOpenConfirmBoxDelete(true)
                                    setDeleteCategory(category)
                                }} className='flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounded'>
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        {
            loading && (
                <Loading/>
            )
        }

        {
            openUploadCategory && (
                <CategoryForm close={() => setOpenUploadCategory(false)} />
            )
        }

        {
            openEdit && (
                <CategoryForm close={() => setOpenEdit(false)} isEdit={true} categoryData={editData} />

                // <EditCategory data={editData} close={()=>setOpenEdit(false)} />
            )
        }

        {
           openConfimBoxDelete && (
            <CofirmBox close={()=>setOpenConfirmBoxDelete(false)} cancel={()=>setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
           ) 
        }
    </section>
  )
}

export default CategoryPage
import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { updatedAvatar } from '../store/userSlice'
import { IoClose } from "react-icons/io5";
import { useEffect } from 'react'

const UserProfileAvatarEdit = ({close}) => {
    const user = useSelector(state => state.user)
    console.log(user.avatar);
    const [profile,setprofile] = useState(null);
    const [avatar,setavatar]= useState();
    const dispatch = useDispatch()
        useEffect(() => {
          
            setprofile(user.avatar)
            setavatar(null)

        }, [user])
        
    const handleSubmit = async (e) => {
        e.preventDefault();
            console.log("handle submit ");

        if(!avatar) {
            alert("Please select an image first");
            return;
        }
    
        const formData = new FormData();
        formData.append('avatar', avatar);
        formData.append('role',user.role);
    
        try {
            
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if(response.data.success) {
                // Update Redux store with new avatar
                dispatch(updatedAvatar(response.data.data.avatar));
                // Close the modal
                close();
                // Reset local state
                setprofile(null);
                setavatar(null);
            }
    
        } catch (error) {
            AxiosToastError(error);
        } 
    }
  
  
    const handleUploadAvatarImage =  async (e)=>{
     setprofile(URL.createObjectURL(e.target.files[0]));
     setavatar(e.target.files[0]);

   }

    // const handleUploadAvatarImage = async(e)=>{
    //     const file = e.target.files[0]

    //     if(!file){
    //         return
    //     }

    //     const formData = new FormData()
    //     formData.append('avatar',file)

    //     try {
    //         setLoading(true)
    //         const response = await Axios({
    //             ...SummaryApi.uploadAvatar,
    //             data : formData
    //         })
    //         const { data : responseData}  = response

    //         dispatch(updatedAvatar(responseData.data.avatar))

    //     } catch (error) {
    //         AxiosToastError(error)
    //     } finally{
    //         setLoading(false)
    //     }

    // }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center'>
        <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
            <button onClick={close} className='text-neutral-800 w-fit block ml-auto'>
                <IoClose size={20}/>
            </button>
            <div className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                {
                    profile ? (
                        <img 
                        alt={user.name}
                        src={profile}
                        className='w-full h-full'
                        />
                    ) : (
                        <FaRegUserCircle size={65}/>
                    )
                }
            </div>
            <form onSubmit={handleSubmit} >
    {/* File Selection Section */}
    <div className='mb-4'>
        <label htmlFor='uploadProfile' className='cursor-pointer'>
            <div className='border border-primary-200 hover:bg-primary-200 px-4 py-1 rounded text-sm text-center'>
                Choose Avatar
            </div>
            <input 
                onChange={handleUploadAvatarImage} 
                type='file' 
                id='uploadProfile' 
                className='hidden'
                accept='image/*'
            />
        </label>
    </div>

    {/* Preview and Submit Section */}
    {profile ? (
        <div className='text-center'>
             {avatar && (
                                <div className="mb-2 text-sm">Selected File: {avatar.name}</div>
                            )}
            
            <button type="submit" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">
                Submit


            </button>

            
            
        </div>
    ) : (
        <div className='text-center text-sm text-gray-500'>
            No file selected
        </div>
    )}
</form>
        </div>
    </section>
  )
}

export default UserProfileAvatarEdit

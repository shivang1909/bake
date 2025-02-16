import toast from "react-hot-toast"

const AxiosToastError = (error)=>{
    console.log('i am error',error)
    toast.error(
        error?.response?.data?.message
    )
}

export default AxiosToastError
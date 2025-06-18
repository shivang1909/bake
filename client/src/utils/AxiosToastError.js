import toast from "react-hot-toast";

const AxiosToastError = (error) => {
    toast.error(
        
        error?.response?.data?.message || "An unexpected error occurred",
        {
            style: {
                background: "rgba(255, 255, 255, 0.75)",
                border: "1px solid #f87171",
                borderRadius: "8px",
                backdropFilter: "blur(10px)",       
                fontWeight: '500',
                color: "#333",
                fontSize: "0.8rem",
            }
        }
    );
};

export default AxiosToastError;

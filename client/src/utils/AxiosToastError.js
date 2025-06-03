import toast from "react-hot-toast";

const AxiosToastError = (error) => {
    toast.error(
        error?.response?.data?.message || "An unexpected error occurred",
        {
            style: {
                background: "#333",
                fontWeight: '500',
                color: "#fff",
                fontSize: "0.8rem",
            }
        }
    );
};

export default AxiosToastError;

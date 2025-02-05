import Axios from "./Axios"
import SummaryApi from "../common/SummaryApi"

const fetchUserDetails = async()=>{

    try {
        const pathParts = location.pathname.split("/").filter(Boolean); // Remove empty strings
        console.log(pathParts)
        if(pathParts[0] === "admin"){
            const response = await Axios({
                ...SummaryApi.adminDetails
            })
            console.log(response.data)
            return response.data
        }
       
        const response = await Axios({
            ...SummaryApi.userDetails
        })
        
        return response.data
    } catch (error) {
        // console.log(error.response.data.message);
        return error.response.data.message;

    }
}

export default fetchUserDetails
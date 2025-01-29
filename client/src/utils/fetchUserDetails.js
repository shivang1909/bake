import Axios from "./Axios"
import SummaryApi from "../common/SummaryApi"

const fetchUserDetails = async()=>{
    try {
        const pathParts = location.pathname.split("/").filter(Boolean); // Remove empty strings


        if(pathParts[0] === "admin"){
            console.log("Hell")
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
        
        return "i am called";
        
        
    }
}

export default fetchUserDetails
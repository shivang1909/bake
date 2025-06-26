

import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import NotFoundPage from "./NotFound";


const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const isLoading = useSelector((state) => state.loading.loadingValue); // 👈 loading from Redux
   
    const user = useSelector(state => state.user);
    console.log("this is is loading value",isLoading)
  console.log("this is logged in ADMIN",user);
 
  const location = useLocation();


    if(isLoading === false)
    {
        return <div>this is loading</div>
    }
    console.log("after")


  if (!user || !user.role) {
    console.log("this is first iff",user.role);


    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (!allowedRoles.includes(user.role)) {
    console.log("this is inside ifff",user.role);
   
   
    return <NotFoundPage/>;
  }


  return children;
};


export default ProtectedRoute;

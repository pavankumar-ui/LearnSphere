import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import {Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";


const ProtectedRoutes = ({allowedRoutes}) =>{
    
    const{isLoggedIn,user} = useContext(AuthContext);
        if(!isLoggedIn)    {
            toast.error("Please Signin to view or Enroll a Course");
        return <Navigate to="/auth" replace />
        
    }


    if(!allowedRoutes.includes(user && user?.role)){
        return  <Navigate to={user?.role === "student" ? "/course-list" : "/instructor"} replace />
    }

   return <Outlet/>
}

export default ProtectedRoutes;


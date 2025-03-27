import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import {Navigate, Outlet } from "react-router-dom";


const ProtectedRoutes = ({allowedRoutes}) =>{
    
    const{isLoggedIn,user} = useContext(AuthContext);

    console.log("Protected Route Check - isLoggedIn:", isLoggedIn, "User:", user);


    if(!isLoggedIn)   return <Navigate to="/auth" replace />


    if(!allowedRoutes.includes(user && user?.role)){
        return  <Navigate to={user?.role === "student" ? "/course-list" : "/instructor"} replace />
    }

   return <Outlet/>
}

export default ProtectedRoutes;


import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/auth-context';
import { Navigate } from 'react-router-dom';

const Logout = () => {

    const {LogoutUser} = useContext(AuthContext);

  useEffect(()=>{
    LogoutUser();
  },[]);

  return <Navigate to="/auth" replace />;
}

export default Logout
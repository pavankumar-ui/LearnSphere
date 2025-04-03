import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../Components/Instructor/Navbar'
import SideMenu from '../../Components/Instructor/SideMenu'
const Instructor = () => {
  return (
    <div className="text-default min-h-screen bg-white">
            <Navbar />
            <div className='flex'>
                <SideMenu />
                <div className='flex-1'>
                    {<Outlet />}
                </div>
            </div>
        </div>

  )
}

export default Instructor
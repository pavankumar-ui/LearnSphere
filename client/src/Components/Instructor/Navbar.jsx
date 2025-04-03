import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets/assets";
import { AppContext } from "../../context/AppContext.jsx";
import { AuthContext } from "../../context/auth-context/index.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);
  const { user } = useContext(AuthContext);

  const { navigate } = useContext(AppContext);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 bg-gray-100 md:px-8 border-b border-gray-300 py-3">
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center gap-1">
          <img
            src={assets.logo}
            alt="logo_icon"
            className="w-9.5 lg:w-15 h-10"
          />
          <p className="text-lg font-bold text-gray-600">LearnSphere</p>
        </div>
      </Link>

      {/* User Profile Dropdown */}
      <div
        className="relative flex items-center gap-5 text-gray-500"
        ref={dropDownRef}
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {user && user?.profileImage ? (
            <img
              src={user?.profileImage}
              alt="user_icon"
              className="w-12 h-12 rounded-full border border-gray-300"
            />
          ) : (
            <img
              src={assets.user_profile_icon}
              alt="user_icon"
              className="w-12 h-12 rounded-full border border-gray-300"
            />
          )}
        </div>

        {/* Dropdown Menu (Inside Profile Container) */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg transition-all duration-200">
            <ul className="py-2 text-gray-800">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate("/instructor/instructor-profile")}
              >
                <img
                  src={assets.user_icon}
                  alt="user_icon"
                  className="w-6 h-6 mr-2 inline-block"
                />
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate("/logout")}
              >
                <img
                  src={assets.logout_icon}
                  alt="logout_icon"
                  className="w-6 h-6 mr-2 inline-block"
                />
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

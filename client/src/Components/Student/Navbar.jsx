import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets/assets";
import { AppContext } from "../../context/AppContext.jsx";
import { AuthContext } from "../../context/auth-context";

const Navbar = () => {
  const { navigate, isInstructor } = useContext(AppContext);
  const isCourseListPage = location.pathname.includes("/course-list");
  const { isLoggedIn, LogoutUser } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);


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
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-16 
     border-b border-gray-500 py-3 md:py-4 h-16 md:h-20 ${
       isCourseListPage ? "bg-white" : "bg-cyan-100/70"
     }`}
    >
      <Link to="/">
        <div className="flex items-center justify-between gap-1">
          <img
            src={assets.logo}
            alt="logo_icon"
            className="w-9.5 lg:w-15 h-10"
          />
          <p className="text-lg font-bold text-gray-800">LearnSphere</p>
        </div>
      </Link>

      {isLoggedIn ? (
        <div className="flex flex-wrap items-center gap-5 text-gray-800 p-4">
          {/* Conditional Rendering for Instructor/Student */}
          {isInstructor  ? (
            <button
              onClick={() => navigate("/instructor")}
              className="text-sm sm:text-base hover:text-blue-600 transition"
            >
              Instructor Dashboard
            </button>
          ) : (
            <Link
              to="/my-enrollments"
              className="text-sm sm:text-base hover:text-blue-600 transition"
              onClick={() => navigate("/my-enrollments")}
            >
              My Enrollments
            </Link>
          )}

          {/* Profile & Logout Dropdown */}
          <div
            className="relative flex items-center gap-5 text-gray-500 md:ml-2"
            ref={dropDownRef}
          >
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <img
                src={assets.user_profile_icon}
                alt="user_icon"
                className="w-12 h-12 rounded-full border border-gray-300"
              />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg transition-all duration-200">
                <ul className="py-2 text-gray-800">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <img
                      src={assets.user_icon}
                      alt="user_icon"
                      className="w-6 h-6 mr-2 inline-block"
                    />
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => navigate("/logout")}
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
      ) : (
        <button
          onClick={() => navigate("/auth")}
          className="rounded-full text-gray-800 hover:bg-blue-600 hover:text-white transition p-2.5 md:pl-1 sm:p-1.5 md:mr-2"
        >
          <div className="flex items-center gap-2">
            <img
              src={assets.user_icon}
              className="w-8 h-8 mr-2"
              alt="login-icon"
            />
            Create Account
          </div>
        </button>
      )}
    </div>
  );
};

export default Navbar;

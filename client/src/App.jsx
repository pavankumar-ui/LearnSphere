import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./Pages/Student/Home";
import CourseList from "./Pages/Student/CourseList";
import CourseDetails from "./Pages/Student/CourseDetails";
import Loading  from "./Components/Student/Loading";
import MyEnrollments from "./Pages/Student/MyEnrollments";
import Player from "./Pages/Student/Player";
import Instructor from "./Pages/Instructor/Instructor";
import Dashboard from "./Pages/Instructor/Dashboard";
import AddCourse from "./Pages/Instructor/AddCourse";
import Navbar from "./Components/Student/Navbar";
import "quill/dist/quill.snow.css";
import AuthPage from "./Pages/Auth";
import Logout from "./Pages/Auth/Logout";
import InstructorProfile from "./Pages/Instructor/InstructorProfile";
import ProtectedComponent from "./Pages/ProtectedComponent";
import { ToastContainer } from "react-toastify";
import VerifyPayment from "./Pages/Student/VerifyPayment";

const App = () => {
  const isInstructorRoute = useMatch("/instructor/*");
  const isAuthRoute = useMatch("/auth/*");

  return (
    <div className="text-white min-h-screen bg-stone-950">
      <ToastContainer />
      {/* Only show Navbar when not on instructor routes AND not on auth routes */}
      {!isInstructorRoute && !isAuthRoute && <Navbar />}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Home />} />
        {/* guest page for normal users  public routes */}
        <Route element={<ProtectedComponent allowedRoutes={["student"]} />}>
          <Route path="/course-list" element={<CourseList />} />
          {/* protected route for student */}
          <Route path="/course-list/:input" element={<CourseList />} />
          {/* protected route for student browsing searchTitle */}
          <Route path="/course-list/:cat" element={<CourseList />} />          
          {/* protected route for student browsing searchTitle */}
          <Route path="/course/:id" element={<CourseDetails />} />
          {/* protected route for enrollment */}
          <Route path="/verify-payment" element={<VerifyPayment />} />
          {/* protected route for enrollment */}
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          {/* protected route for enrollment */}
          <Route
            path="/player/:id/modules/:moduleId/lessons/:lessonId"
            element={<Player />}
          />
          {/* protected route for enrollment */}
        </Route>
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/logout" element={<Logout />} />
        {/* Instructor Routes */}
        <Route element={<ProtectedComponent allowedRoutes={["instructor"]} />}>
          <Route path="/instructor" element={<Instructor />}>
            <Route path="/instructor" element={<Dashboard />} />
            <Route path="instructor-profile" element={<InstructorProfile />} />
            <Route path="add-course" element={<AddCourse />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;

import React, { useState, useContext, useEffect } from 'react'
import Loading from '../../components/Student/Loading'
import { AppContext } from '../../context/AppContext.jsx'
import { AuthContext } from '../../context/auth-context'
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { navigate,backend_url } = useContext(AppContext);
  const { isLoggedIn, user, token } = useContext(AuthContext);

  const [courses, setCourses] = useState(null);
  const [instructorName, setInstructorName] = useState({ name: "" });

  const fetchInstructorCourses = async () => {
    
    if(!token ||  !user){
      navigate('/auth');
    }

    try{
      const {data} = await axios.get(`${backend_url}/instructor/courses`,{
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
         },
      });

      console.log("Instructor Courses:", data);
      if(data.success){
        setCourses(data.courses);
      }
      else{
        toast.error( "No courses found, please add a course");
      }
    }  
      catch(err){
      console.error("Error fetching instructor courses:", err);
      toast.error(err.message || data?.message || "Failed to fetch courses");
    }


  }

  const courseList = courses;

  //console.log("User Name:", user.name);

  useEffect(() => {
    fetchInstructorCourses();
  }, []); // Fetch courses once on mount


  // Update instructor name whenever token or isLoggedIn changes
  useEffect(() => {
    // If not logged in or no token, reset the name
    if (!isLoggedIn || !token) {
      setInstructorName({ name: "" });
      return;
    }
    
    // If logged in and user exists, set the name
    if (user) {
      setInstructorName({
        name: user.name,
      });
    }
  }, [isLoggedIn, token, user]); // Dependencies include token to detect login/logout


 // Prevents rendering until user is available
 if (!user || Object.keys(user).length === 0) {
  return <Loading />; // Prevents accessing undefined properties
}



  return courseList ? (
    <div className='text-stone-950 min-h-screen bg-white'>
      
        {/* display loggedin Instructor name */}
           
           <div className='text-3xl font-bold mt-5 py-4 px-3 md:px-10'>
           <h1>Welcome Back, {user?.name || "Instructor"}</h1>
      </div>
         
      
      <div className='text-2xl font-bold mt-5 py-2 px-3 ml-15 md:px-10 py-3'>
        <h1>Your Courses</h1>
      </div>

      <div className="flex flex-wrap justify-evenly gap-6 mt-3">
        {courseList.map((course, index) => (

          <div key={index} className="w-96 bg-white rounded-xl shadow-lg overflow-hidden flex">
            {/* Course Thumbnail */}
            <img
              src={course.courseThumbnail}
              alt={course.courseTitle}
              className="w-full h-32 rounded object-cover"
            />

            {/* Course Details */}
            <div className="p-4 flex flex-col justify-center">
              <h2 className="text-lg font-semibold">{course.courseTitle}</h2>
              <p className="text-gray-500 text-md">{course.courseContent.length} Modules</p>

              {/* Learners */}
              <div className="flex items-center mt-3">
                <div className="flex -space-x-2">
                  {course.students?.slice(0, 3).map((student, i) => (
                    <img
                      key={i}
                      src={student.imageUrl}
                      alt={`Student ${i + 1}`}
                      className="w-35 h-30 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-500 text-sm">+ {course.enrolledStudents.length} learners</span>
              </div>
            </div>
          </div>
        ))}

        <div className="w-96 h-36 border-2 border-dashed border-blue-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50">
          <div className="text-blue-500 text-2xl" onClick={()=>navigate('/instructor/add-course')}>➕</div>
          <p className="text-blue-600 font-medium mt-2">Launch your next course</p>
        </div>
      </div>

    </div>
  ): (
    <Loading/>
  )
}

export default Dashboard
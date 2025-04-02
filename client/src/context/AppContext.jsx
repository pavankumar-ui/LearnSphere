import React,{useState,useEffect,useContext} from 'react'
import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration'
import { AuthContext } from './auth-context';
import axios from 'axios';
import { toast } from 'react-toastify';


export const AppContext = createContext();

export const AppContextProvider = (props) =>{

const currency = import.meta.env.VITE_CURRENCY
const navigate = useNavigate();
const { user,token} = useContext(AuthContext); 
const [allCourses,setAllCourses] = useState([])
const [isInstructor,setIsInstructor] = useState(false)
const [loadingEnrolledCourses, setLoadingEnrolledCourses] = useState(true);
const [enrolledCourses,setEnrolledCourses] = useState([])
const [progress,setProgress] = useState(0);
const backend_url = import.meta.env.VITE_BACKEND_URL;




//to fetch all courses //
const fetchAllCourses = async () => {
    try {
        const token = sessionStorage.getItem("token");  // Fetch from sessionStorage
        const { data } = await axios.get(`${backend_url}/courses/`,{
            headers: {
                "Authorization": `Bearer ${token}`,   // Include token in headers
                "Content-Type": "application/json"
            }
        });

        if (data.success) {
            setAllCourses(data.courses);
        } else {
            toast.error(data.message);
        }
    } catch (err) {
        //console.error("Error:", err);
        toast.error(err.response?.data?.message || err.message);
    }
};


//function to calculate avg rating of the course//

const calculateRating = (course)=>{
    if(course.courseRatings.length === 0) return 0;
    let totalRating = 0;

    course.courseRatings.forEach((rating)=>{
        totalRating += rating.rating;
    })
    return Math.floor(totalRating / course.courseRatings.length)
}

//function to calculate  duration time //
const calculateLessonTime = (module)=>{
    let time =0;
    module.moduleContent.map((lesson)=> time+= lesson.lessonDuration)
    return humanizeDuration(time * 60 * 1000, {units:["h","m"]})
}


//fn to calculate totalCourse duration minutes//

const calculateCourseDuration = (course)=>{
    let time =0;
    course.courseContent.map(
        (module)=> module.moduleContent.map(
        (lesson)=> time += lesson.lessonDuration
    ))
    return humanizeDuration(time * 60 * 1000, {units:["h","m"]})
}

//fn to calculate total no of modules in the course //

const calculateNoOfLecture = (course) => {
  return course?.courseContent?.reduce((total, module) => 
      total + (Array.isArray(module.moduleContent) ? module.moduleContent.length : 0)
  , 0) || 0;
};





//fetch user enrolled courses//
const fetchUserEnrolledCourses = async ()=>{

    console.log("fetchUserEnrolledCourses() called!");
    
    setLoadingEnrolledCourses(true);
    try{       
        const {data} = await axios.get(`${backend_url}/student/enrolled`,{
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Fetched data:", data);

        if(data.success){
            setEnrolledCourses(data.enrolledCourses);
            console.log("Enrolled courses:", data.enrolledCourses);
        }
        else{
            toast.error(data.message);
        }
    }catch(err){
    toast.error(err.message);
    console.error("Error fetching enrolled courses:", err);
}finally{
    setLoadingEnrolledCourses(false);
 }
}



//update the mark as Completed button to completed //
  const markLessonAsCompleted = async (lessonId) => {
    console.log("marking lesson as completed", lessonId);
    try {

      if (!token) {
        toast.error("please login to continue");
        navigate("/auth");
      }

      const { data } = await axios.post(`${backend_url}/student/progress`, {
        courseId: id,
        lessonId,
        moduleId,
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      console.log("Response from server:", data);

      if (data.success) {
        toast.success(data.message);
        await getCourseProgress();
      } else {
        toast.error(data.message);
        console.error(data.message);
      }
    } catch (err) {
      console.error("API error:", err.message);
      toast.error(err.message);
    }

  }


  const updateUserProgress = (courseId, updatedProgress) => {
    setEnrolledCourses(prevCourses =>
        prevCourses.map(course =>
            course._id === courseId ? { ...course, progress: updatedProgress } : course
        )
    );
};






useEffect(()=>{
    fetchAllCourses()
},[])

useEffect(()=>{
    if(user){
        fetchUserEnrolledCourses();
    }
},[user]);



const value= {
          currency,
          allCourses,
          navigate,
          calculateRating,
          isInstructor,
          setIsInstructor,
          calculateCourseDuration,
          calculateLessonTime,
          calculateNoOfLecture,
          progress,
          setProgress,
          markLessonAsCompleted,
          fetchUserEnrolledCourses,
          enrolledCourses,
          backend_url,
          loadingEnrolledCourses,
          updateUserProgress,

};

    return (
        <AppContext.Provider value={value}>
                {props.children}
        </AppContext.Provider>
    )

}
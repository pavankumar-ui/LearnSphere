import React,{useState,useEffect,useContext} from 'react'
import { createContext } from 'react'
import { dummyCourses } from '../assets/assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration'
import { AuthContext } from './auth-context';
import {loadStripe} from '@stripe/stripe-js';


export const AppContext = createContext();

export const AppContextProvider = (props) =>{

const currency = import.meta.env.VITE_CURRENCY
const navigate = useNavigate();

const { user } = useContext(AuthContext); 

const [allCourses,setAllCourses] = useState([])
const [isInstructor,setIsInstructor] = useState(false)
const [enrolledCourses,setEnrolledCourses] = useState([])
const [progress,setProgress] = useState(0);
const backend_url = import.meta.env.VITE_BACKEND_URL;

//to fetch all courses //

const fetchAllCourses = async()=>{
    setAllCourses(dummyCourses)
}

//function to calculate avg rating of the course//

const calculateRating = (course)=>{
    if(course.courseRatings.length === 0) return 0;
    let totalRating = 0;

    course.courseRatings.forEach((rating)=>{
        totalRating += rating.rating;
    })
    return totalRating / course.courseRatings.length
}

//function to calculate lesson duration time //
const calculateLessonTime = (chapter)=>{
    let time =0;
    chapter.chapterContent.map((lecture)=> time+= lecture.lectureDuration)
    return humanizeDuration(time * 60 * 1000, {units:["h","m"]})
}


//fn to calculate totalCourse duration minutes//

const calculateCourseDuration = (course)=>{
    let time =0;
    course.courseContent.map((chapter)=> chapter.chapterContent.map(
        (lecture)=>time+= lecture.lectureDuration
    ))
    return humanizeDuration(time * 60 * 1000, {units:["h","m"]})
}

//fn to calculate total no of modules in the course //

const calculateNoOfLecture = (course)=>{
    let totalLectures = 0;
    course.courseContent.foreach(chapter =>{
        if(Array.isArray(chapter.chapterContent)){
            totalLectures += chapter.chapterContent.length
        }
    });
    return totalLectures;
}



//fetch user enrolled courses//
const fetchUserEnrolledCourses = async ()=>{
    setEnrolledCourses(dummyCourses)
}


const makePayment = async (course)=>{
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const body ={
                amount: course.coursePrice,
            currency: "inr",
            payment_method_types: ["card","upi","netbanking"],
            metadata:{
                userId: user._id,
                courseId: course._id,
            },
      }
      const headers = {
        "Content-Type":"application/json",
      }
      const response = await fetch(`${backend_url}/create-checkout-session`,{
        method:"POST",
        headers,
        body:JSON.stringify(body)
      });

      const session = await response.json();
      const result = session.redirectToCheckout({
        sessionId: session.id,
      });

      if(result.error){
        console.log(result.error.message);
      }
    }



// Update `isInstructor` when user logs in
useEffect(() => {
    if (user) {
      setIsInstructor(user.role === "instructor"); // Set based on user role
    }
  }, [user]);


useEffect(()=>{
    fetchAllCourses()
    fetchUserEnrolledCourses()
},[])

// Add this to your AppContext provider component
console.log("AppContext enrolledCourses:", enrolledCourses);


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
          enrolledCourses,
          makePayment,
};

    return (
        <AppContext.Provider value={value}>
                {props.children}
        </AppContext.Provider>
    )

}
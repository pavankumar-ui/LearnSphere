import React,{useEffect, useState} from 'react'
import { useContext } from 'react'
import { AppContext } from '../../context/appContext'
import { AuthContext } from '../../context/auth-context'
import SearchBar from '../../Components/Student/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../Components/Student/CourseCard'
import { assets } from '../../assets/assets/assets'
import Footer from '../../Components/Student/Footer'
import Loading from '../../components/Student/Loading'


const CourseList = () => {

    const {navigate,allCourses} = useContext(AppContext)
    const {input}  = useParams()
    const [filteredCourse,setFilteredCourse] = useState([])
   const {user} = useContext(AuthContext);
   const [userData,setUserData] = useState(true);
   const [name,setName] = useState({
                                    name:"",
                                  });


   if(userData && user){
     setName({
      name:user.name,
     });
     setUserData(false);
   }


        useEffect(()=>{
          //searchTheCourse()
            console.log("all courses",allCourses);
          if(allCourses && allCourses.length > 0){

            const tempCourses = allCourses.slice()

            input ? 
            setFilteredCourse(
              tempCourses.filter(
                item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
              )
            ): setFilteredCourse(tempCourses)

            console.log("search input",input);
          }
        },[input,allCourses])

        if (!user || Object.keys(user).length === 0) {
          return <Loading />; // Prevents accessing undefined properties
        }

  return (
   <>
   
   <div className='relative md:px-36 px-8 pt-20 text-left'>
   
   <h1 className='text-3xl font-semibold text-gray-300'>Welcome Back, {user?.name}!</h1>


    <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full mt-4'>
        <div>
        <h1 className='text-4xl font-semibold text-gray-300'>Course List</h1>
      <p className='text-gray-500'>
        <span className='text-blue-600 cursor-pointer' onClick={()=>navigate('/')}>Home</span> / <span>Course List</span> </p>
        </div>
       <SearchBar data={input}/> 
    </div>

     {input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 mb-8 text-white'>
             <p>{input}</p>
             <img src={assets.cross_icon} alt="arrow" className='cursor-pointer' onClick={()=>navigate('/course-list')} />
      </div>}

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0'>
                 { filteredCourse.map((course,index)=>(
                  <CourseCard  key={index} course={course} />
                  ))}
            </div>
   </div>
   <Footer/>
   </>
  )
}

export default CourseList
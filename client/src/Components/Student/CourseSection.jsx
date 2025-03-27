import React from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/appContext'
import CourseCard from './CourseCard'
import { useContext } from 'react'

const CourseSection = () => {

    const {allCourses} = useContext(AppContext)

  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-white'>Learn from the Best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3'>Discover our best top notch courses across
         various categories.From Coding till Designing to<br/> Business and wellness, our Courses are crafted  
         to deliver results.</p>

        <div className='grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4'>

            {allCourses.slice(0,4).map((course,index)=>
              <CourseCard key={index} course={course}/>
            )}

        </div>

        <Link to={'/course-list'} onClick={()=>scrollTo(0,0)}
           className="text-white hover:bg-blue-500 mt-4 border border-gray-500/30 px-10 py-3 rounded">Explore More</Link>
      </div>
  )
}

export default CourseSection
import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/Student/Loading";
import { assets } from "../../assets/assets/assets";
import humanizeDuration from "humanize-duration";
import ProgressBar from "../../Components/Student/ProgressBar";
import Footer from "../../Components/Student/Footer";
import { Link, useParams } from "react-router-dom";
import Rating from "../../Components/Student/Rating";

const CourseDetails = () => {
  
  const { id, chapterId, lectureId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openContents, setOpenContents] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  const [showRatingModal, setShowRatingModal] = useState(false);

  // fx to handle  rating(feedback) popup modal//
  const handleRatingSubmission = (rating, thought) => {
    // Handle the submission logic here
    console.log("Rating:", rating, "Thought:", thought);
    // You might want to send this data to your backend
    setShowRatingModal(true);
  };

  const {
    allCourses,
    calculateRating,
    calculateCourseDuration,
    calculateLessonTime,
    calculateNoOfLecture,
    currency,
    navigate,
    makePayment,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseData();
  }, [allCourses]);

  const toggleContent = (index) => {
    setOpenContents((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };





  //bg-gradient-to-b from-blue-950/30//

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-t from-blue-950/30 "></div>

        {/** left side */}
        <div className="max-w-xl z-10 text-gray-300">
          <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-white">
            {courseData.courseTitle}
          </h1>
          <p
            className="pt-4 md:text-base text-sm rich-text"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 260)
            }}
          ></p>

          {/* Review and rating */}

          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="star-rating"
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <p className="text-amber-300">
              {courseData.courseRatings.length}{" "}
              {courseData.courseRatings.length > 1 ? "ratings" : "rating"}{" "}
            </p>
            <p>
              ({courseData.enrolledStudents.length}{" "}
              {courseData.enrolledStudents.length > 1 ? "learners" : "learner"})
            </p>

            {/* Rate the course by popup rating modal */}
            {isAlreadyEnrolled ? (
              <>
                <div className="flex items-center space-x-2">
                  <p>|</p>
                  <button className="text-sky-500 text-md font-semibold md:text-sm px-1"
                    onClick={() => setShowRatingModal(true)
                    }>
                    Rate This Course
                  </button>

                  {showRatingModal && (
                    <Rating
                      initialRating={0}
                      onRate={handleRatingSubmission}
                      onClose={() => setShowRatingModal(false)} />
                  )}
                </div>
              </>) 
              : null}
          </div>
          {/* end of rating popup modal */}


          {/* Instructor name and designation */}
          <div className="flex items-center space-x-3 pt-3 pb-1">
            <img
              src={assets.profile_img2}
              alt="instructor-image"
              className="w-12 h-12 rounded-full"
            />
            <h3>
              <span className="text-lg font-semibold text-white">Ronaldo</span>
            </h3>
            <p className="text-gray-400 text-sm">SDE-3,Uber Cab</p>
          </div>

          {/* Display the progress bar  of overall course
         if user is enrolled and authenticated, else display the enroll button  */}

          {isAlreadyEnrolled ? (<ProgressBar />) : (
            <>
              <div className="flex flex-row items-center justify-between px-1 mt-5 mb-6 md:mt-1 mt-10">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                   py-3 px-6 rounded-md text-md"
                   
                   onClick={makePayment}
                   
                   >
                  Enroll now for
                  &nbsp; {currency} {Math.floor(courseData.coursePrice).toFixed(2)}
                </button>
              </div>
            </>
          )}

          <div className="pt-8 text-white">
            <h2 className="text-xl font-semibold">Course Content</h2>
            {/* Module Wise Content*/}
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 mb-2 rounded"
                >
                  <div
                    className="flex flex-center justify-between px-4 py-3 
                       cursor-pointer select-none"
                    onClick={() => {
                      toggleContent(index);
                    }}
                  >
                    {/* Lock the content if user is not loggedin or enrolled,
                     if he's enrolled and loggedin then display 
                     the content */}

                    {isAlreadyEnrolled ? null: (
                      <>
                        <div className="flex items-center gap-2">
                          <img
                            src={assets.lock_icon}
                            alt="lock-icon"
                            className="w-8 h-8" />
                        </div>
                      </>

                    )}


                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow-icon"
                        className={`transform transform-transition 
                                ${openContents[index] ? "rotate-180" : ""} `}
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lessons-
                      {calculateLessonTime(chapter)}
                    </p>
                  </div>

                  {/*Lesson Content*/}
                  <div
                    className={`overflow-hidden transtition-all duration-300  bg-white
                  ${openContents[index] ? "max-h-96" : "max-h-0"}`}
                  >
                    <ul className="list-disc md:pl-10 pr-4 py-2 text-gray-950 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 py-1 "
                        >

                          {/* lock the lesson content as well for unauthenticated and not enrolled user */ }
                          {isAlreadyEnrolled ? 
                          (
                            <img
                            src={assets.play_icon}
                            alt="play-icon"
                            className="w-4 h-4 mt-1 cursor-pointer"/>
                          ):
                          (
                            <img
                            src={assets.lock_icon}
                            alt="lock-icon"
                            className="w-2 h-2 mt-1"/>
                          )
                          }
                       

                          <div className="flex items-center justify-between w-full 
                      text-gray-950 text-xs md:text-default">
                            {isAlreadyEnrolled ? (
                              <>
                                <Link
                                  to={`/player/${courseData._id}/modules/${chapter.chapterId}/lessons/${lecture.lectureId}`}>
                                  {lecture.lectureTitle}
                                </Link>
                              </>

                            ) : (<p>
                              {lecture.lectureTitle}
                            </p>)}


                            <div className="flex gap-2">
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*right side*/}
        <div className="flex items-center space-x-4 p-4 rounded-2xl w-fit">
          <img
            src={courseData.courseThumbnail}
            alt="thumbnail"
            className="w-full h-auto rounded-lg  object-cover"
          />
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;

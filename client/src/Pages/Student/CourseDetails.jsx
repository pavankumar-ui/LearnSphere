import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/Student/Loading";
import { assets } from "../../assets/assets/assets";
import humanizeDuration from "humanize-duration";
import { Link, useParams, useNavigate } from "react-router-dom";
import Rating from "../../Components/Student/Rating";
import { AuthContext } from "../../context/auth-context";
import { toast } from "react-toastify";
import axios from "axios";
import Footer from "../../Components/Student/Footer";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const {
    calculateRating,
    calculateLessonTime,
    currency,
    backend_url,
    fetchUserEnrolledCourses,
    enrolledCourses,
    progress,
    updateUserProgress,
    setProgress,
  } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [openContents, setOpenContents] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);

  //display the cours details//
  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(
        `${backend_url}/courses/students/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setCourseData(data.courseDetail);
        const isEnrolled = data.courseDetail.enrolledStudents.includes(
          user?._id
        );
        setIsAlreadyEnrolled(isEnrolled);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load course");
    } finally {
      setLoadingEnrollment(false);
    }
  };

  //to handle payment and enrollment//
  const handleEnrollment = async () => {
    try {
      if (!user) {
        navigate("/login");
        return toast.error("Please login to continue");
      }

      if (courseData.coursePrice === 0) {
        const { data } = await axios.put(
          `${backend_url}/student/free-enrollment`,
          { courseId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          await fetchCourseData();
          toast.success("Enrolled successfully!");
          await fetchUserEnrolledCourses();
          navigate("/my-enrollments");
        }
      } else {
        if (!token) {
          navigate("/login");
          return toast.error("Please login to continue");
        }

        // Set the Content-Security-Policy header to avoid blockage while performing a payment session//
        /* document.head.querySelector("meta[http-equiv='Content-Security-Policy']").setAttribute(
            "content",
            "default-src 'self' https:; script-src 'self' https://js.stripe.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.stripe.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com;"
          ); */

        const { data } = await axios.post(
          `${backend_url}/student/payment`,
          { courseId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.session_url) {
          const paymentWindow = window.open(data.session_url, "_blank");
          const checkInterval = setInterval(async () => {
            try {
              const { data: course } = await axios.get(
                `${backend_url}/courses/${id}`
              );
              if (course.courseDetail.enrolledStudents.includes(user._id)) {
                clearInterval(checkInterval);
                paymentWindow.close();
                await fetchCourseData();
                toast.success("Payment confirmed! Enrollment successful");
              }
            } catch (error) {
              console.error("Payment verification failed:", error);
            }
          }, 3000);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    }
  };

  //optional rating modal only when user is enrolled //
  const handleRatingSubmit = async (rating, thoughts) => {
    try {
      if (!user || !token) {
        navigate("/auth");
        toast.error("please login to continue");
      }
      const { data } = await axios.post(
        `${backend_url}/student/rating`,
        { courseId: id, rating, thoughts },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        await fetchCourseData();
        setShowRatingModal(false);
        toast.success("Rating submitted successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Rating submission failed");
    }
  };

  const fetchProgress = async () => {
    try {
      if (!token || !user) {
        toast.error("Please login to continue");
        navigate("/auth");
        return;
      }

      const { data } = await axios.post(
        `${backend_url}/student/get-progress`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.progressData) {
        setProgress(data.progressData);
      } else {
        setProgress(null);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load progress");
      setProgress(null);
    } finally {
      Loading(false);
    }
  };

  const fetchCalled = useRef(false);
  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchUserEnrolledCourses(); // ✅ Fetch only once
      console.log("fetchUserEnrolledCourses called");
      //console.log(fetchUserEnrolledCourses());
    }
    if (enrolledCourses) {
      const isEnrolled = enrolledCourses.some(
        (course) => String(course._id) === String(id)
      );
      setIsAlreadyEnrolled(isEnrolled);
    }
  }, [id, loadingEnrollment]);
  //enrolledCourses?.enrolledCourses,

  const toggleContent = (index) => {
    setOpenContents((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (token) {
      fetchProgress();
    }
  }, [token]);

  {
    !loadingEnrollment && <Loading />;
  }
  return (
    <div className="max-w-820 px-4 py-8 mx-auto md:px-8 md:py-12">
      {courseData && (
        <>
          {/* Course Header */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-200 mb-4">
                {courseData.courseTitle}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-lg font-semibold">
                  {calculateRating(courseData)}/5
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < Math.floor(calculateRating(courseData))
                          ? assets.star
                          : assets.star_blank
                      }
                      className="w-5 h-5"
                      alt="rating"
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  ({courseData.courseRatings.length} ratings)
                </span>

                {/* Instructor name and designation */}
                <div className="flex flex-col items-center space-x-3 pt-3 pb-1">
                  {courseData && courseData.instructor?.profileImage ? (
                    <img
                      src={courseData.instructor.profileImage}
                      alt="instructor-image"
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <img
                      src={assets.profile_img2}
                      alt="instructor-image"
                      className="w-12 h-12 rounded-full"
                    />
                  )}

                  <h3>
                    <span className="text-lg font-semibold text-amber-500">
                      {courseData.instructor.name}
                    </span>
                  </h3>
                  <p className="text-sky-400 text-sm">
                    {courseData.instructor.designation},Uber Cab
                  </p>
                </div>

                {/* Rating Section */}
                {isAlreadyEnrolled && (
                  <div className="text-center mb-12">
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      | Rate This Course
                    </button>
                  </div>
                )}
              </div>

              {/* Enrollment Button */}
              {!loadingEnrollment && !isAlreadyEnrolled && (
                <button
                  onClick={handleEnrollment}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  {courseData.coursePrice === 0
                    ? "Enroll For Free"
                    : `Enroll Now - ${currency}${courseData.coursePrice}`}
                </button>
              )}

              {/* Course Description */}
              <div
                className="pt-4 md:text-base text-sm text-overwrite"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription.slice(0, 2500),
                }}
              />
            </div>

            {/* Course Thumbnail */}
            <div className="relative">
              <img
                src={courseData.courseThumbnail}
                alt="Course thumbnail"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>

          {/* Course Content */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>

            {courseData.courseContent.map((module, index) => (
              <div key={index} className="mb-4 border rounded-lg">
                <div
                  className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setOpenContents((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                >
                  <div className="flex items-center gap-4">
                    {!isAlreadyEnrolled && (
                      <img
                        src={assets.lock_icon}
                        className="w-6 h-6"
                        alt="locked"
                      />
                    )}
                    <img
                      src={assets.down_arrow_icon}
                      alt="arrow-icon"
                      className={`transform transform-transition 
                                ${openContents[index] ? "rotate-180" : ""} `}
                    />
                    <h3 className="text-lg text-gray-800 font-semibold">
                      {module.moduleTitle}
                    </h3>
                  </div>
                  <span className="text-gray-600">
                    {module.moduleContent.length} lessons •{" "}
                    {humanizeDuration(
                      module.moduleContent.reduce(
                        (acc, lesson) => acc + lesson.lessonDuration,
                        0
                      ) * 60000,
                      { units: ["h", "m"] }
                    )}
                  </span>
                </div>

                {/* Lessons List */}
                <div
                  className={`${
                    openContents[index] ? "max-h-[500px]" : "max-h-0"
                  } overflow-hidden transition-all`}
                >
                  <div className="p-4 bg-white">
                    {module.moduleContent.map((lesson, lessonId) => (
                      <div
                        key={lessonId}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-4">
                          {isAlreadyEnrolled ? (
                            <Link
                              to={`/player/${id}/modules/${module.moduleId}/lessons/${lesson.lessonId}`}
                              className="flex items-center gap-2 text-blue-600 hover:underline"
                            >
                              {/* Fix includes() by ensuring type match */}
                              {(progress?.progressData?.lessonCompleted ?? [])
                                .map(String)
                                .includes(String(lesson.lessonId)) ? (
                                <img
                                  src={assets.blue_tick_icon}
                                  className="w-5 h-5"
                                  alt="tick"
                                />
                              ) : (
                                <img
                                  src={assets.play_icon}
                                  className="w-5 h-5"
                                  alt="play"
                                />
                              )}

                              {lesson.lessonTitle}
                            </Link>
                          ) : (
                            <>
                              <img
                                src={assets.lock_icon}
                                className="w-5 h-5"
                                alt="locked"
                              />
                              <span className="text-gray-600">
                                {lesson.lessonTitle}
                              </span>
                            </>
                          )}
                        </div>
                        <span className="text-gray-500">
                          {humanizeDuration(lesson.lessonDuration * 60000, {
                            units: ["m"],
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rating Modal */}
          {showRatingModal && (
            <Rating
              initialRating={0}
              courseTitle={courseData.courseTitle}
              InstructorName={courseData.instructor.name}
              onRate={handleRatingSubmit}
              onClose={() => setShowRatingModal(false)}
            />
          )}

          <Footer />
        </>
      )}
    </div>
  );
};

export default CourseDetails;

import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import Footer from "../../Components/Student/Footer";
import { AuthContext } from "../../context/auth-context/index.jsx";
import { Link } from "react-router-dom";
import { Line } from "rc-progress";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../Components/Student/Loading.jsx";
import { assets } from "../../assets/assets/assets.js";

const MyEnrollments = () => {
  const { token, user, isLoggedIn } = useContext(AuthContext);
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    backend_url,
    fetchUserEnrolledCourses,
    calculateNoOfLecture,
  } = useContext(AppContext);
  const [progressArray, setProgressArray] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (isLoggedIn && user) {
      fetchUserEnrolledCourses();
    }
  }, [user]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (!token) {
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
          setProgressArray(data.progressData); // Set fetched progress
        } else {
          setProgressArray([]);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
        toast.error("Failed to load progress");
        setProgressArray([]);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    if (token) {
      fetchProgress();
    }
  }, [token]); // Runs only when enrolledCourses updates


  {
    loading ? <Loading /> : null;
  }
  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>
        {/* Show "No courses enrolled" if enrolledCourses is empty */}
        {!isLoggedIn && enrolledCourses.length === 0 ? (
          <div className="text-center mt-10 text-gray-300">
            <p className="text-lg">You haven't enrolled in any courses yet.</p>
            <Link
              to="/course-list"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md text-md"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
            <thead className="text-gray-300 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Course</th>
                <th className="px-4 py-3 font-semibold truncate">Duration</th>
                <th className="px-4 py-3 font-semibold truncate">Completed</th>
                <th className="px-4 py-3 font-semibold truncate">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {enrolledCourses?.map((course, index) => (
                <tr key={index} className="border-b border-gray-400/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                    
                    <img
                      src={course.courseThumbnail}
                      alt="course-thumbnail"
                      className="w-14 sm:w-24 md:w-28"
                    />
                    <div className="flex-1">
                      <p className="mb-1 max-sm:text-sm">
                        {course.courseTitle}
                      </p>

                      <Line
                        className="bg-gray-300 rounded-full"
                        strokeWidth={2}
                        percent={
                          progressArray[index]?.progress?.totalLessons > 0
                            ? (progressArray[index]?.progress?.lessonCompleted *
                                100) /
                              progressArray[index]?.progress?.totalLessons
                            : 0
                        }
                      />
                      <p className="text-gray-300 text-md md:text-md pt-2">
                        {progressArray[index]?.progress?.totalLessons > 0
                          ? (
                              (progressArray[index]?.progress.lessonCompleted *
                                100) /
                              progressArray[index]?.progress?.totalLessons
                            ).toFixed(0)
                          : 0}
                        % Completed
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {calculateCourseDuration(course)}
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {progressArray[index] &&
                      `${progressArray[index]?.progress.lessonCompleted} /
                   ${progressArray[index]?.progress.totalLessons}`}
                    &nbsp;<span>Lessons</span>
                  </td>
                  <td className="px-4 py-3 max-sm:text-right">
                    {(() => {
                      // Access the progress data for the current course
                      const progress = progressArray[index]?.progress;
                      // Check if progress exists and if all lessons are completed
                      const isCompleted =
                        progress &&
                        progress.lessonCompleted / progress.totalLessons === 1;
                      return (
                        <Link to={`/course/${course._id}`}>
                          <span
                            className={`px-3 sm:px-5 py-1.5 sm:py-2 ${
                              isCompleted ? "text-green-500" : "text-red-500"
                            } max-sm:text-xs`}
                          >
                            {isCompleted ? "Completed" : "OnGoing"}<img src={assets.arrow_icon} alt="arrow" className="inline-block ml-1 w-4 h-4 text-gray-500" />
                          </span>
                        </Link>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;

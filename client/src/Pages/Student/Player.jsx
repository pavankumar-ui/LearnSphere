import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { useParams } from "react-router-dom";
import Loading from "../../components/Student/Loading";
import humanizeDuration from "humanize-duration";
import Footer from "../../Components/Student/Footer";
import { AuthContext } from "../../context/auth-context/index.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import ReactPlayer from "react-player";

const Player = () => {
  const { id, moduleId, lessonId } = useParams();
  const {
    enrolledCourses,
    loadingEnrolledCourses,
    calculateLessonTime,
    backend_url,
    updateUserProgress,
  } = useContext(AppContext);
  const { user, token, isLoggedIn } = useContext(AuthContext);
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressdata] = useState(null);
  const [videoURL, setVideoURL] = useState(null);

  const markLessonAsCompleted = async (lessonId) => {
    try {
      if (!token || !user) {
        toast.error("please login to continue");
        navigate("/auth");
      }
      const { data } = await axios.post(
        `${backend_url}/student/updated-progress`,
        {
          courseId: id,
          lessonId,
          moduleId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

    

      if (data.success) {
        toast.success(data.message);
        await getCourseProgress();
      } else {
        toast.error(data.message);
        
      }
    } catch (err) {
      
      toast.error(err.message);
    }
  };

  /*const getCourseProgress = async () => {

    try {

      if(!token){
        toast.error("please login to continue");
        navigate("/auth");
      }
      const { data } = await axios.post(`${backend_url}/student/get-progress`,
        {courseId: id},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setProgressdata(data.progressData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  } */

  const getCourseProgress = async () => {
    try {
      const { data } = await axios.post(
        `${backend_url}/student/get-progress`,
        { courseId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success) {
       
        setProgressdata((prev) => {
          if (!prev) return { lessonCompleted: [lessonId] }; // If prev is null, initialize

          //update the progress data globally in AppContext//
          updateUserProgress(id, data.updatedProgress);

          return {
            ...prev,
            lessonCompleted: prev.lessonCompleted
              ? [...new Set([...prev.lessonCompleted, lessonId])] // Avoid duplicates
              : [lessonId],
          };
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    try {
      if (loadingEnrolledCourses) {
        <Loading />
        return;
      }

      // 2. Find the enrolled course
      const course = enrolledCourses?.find((course) => course._id === id);
      if (!course) {
        setLoading(false);
        return;
      }
     

      // 3. Find the module
      const module = course.courseContent?.find(
        (module) => module.moduleId === moduleId
      );
      if (!module) {
        setLoading(false);
        return;
      }

      // 4. Find the lesson
      const lesson = module.moduleContent?.find(
        (lesson) => lesson.lessonId === lessonId
      );
      if (!lesson) {
        setLoading(false);
        return;
      }

      // 5. Set lesson data
      setLessonData({
        ...lesson,
        moduleTitle: module.moduleTitle,
        courseTitle: course.courseTitle,
        lessonUrl: lesson.lessonContent,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [enrolledCourses, id, loadingEnrolledCourses, moduleId, lessonId]);
  // Updated dependencies

  useEffect(() => {
    if (progressData && lessonData) {
      setProgressdata((prev) => {
        const updatedProgress = {
          ...prev,
          lessonCompleted: prev?.lessonCompleted
            ? [...new Set([...prev.lessonCompleted, lessonData.lessonId])]
            : [lessonData.lessonId],
        };
        
        return updatedProgress;
      });
    }
  }, [lessonData?.lessonId]); // Runs when progressData or lessonData changes

  //stream video effect//

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const { data } = await axios.get(`${backend_url}/student/video-url`, {
          params: { courseId: id, moduleId, lessonId },
          headers: { Authorization: `Bearer ${token}` },
        });

        

        if (data.success) {
          setVideoURL(data.videoURL);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, [id, moduleId, lessonId, backend_url, token]);

  useEffect(() => {
    getCourseProgress();
  }, []);

  if (loadingEnrolledCourses) return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="flex-1 md:flex-row gap-10 px-5 mt-12">
          <p className="text-gray-300 text-xl">
            Module: {lessonData && lessonData?.moduleTitle}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-white text-xl">
              {lessonData && lessonData?.lessonTitle}
            </p>
            <span className="text-gray-300 ml-auto px-4 text-xl">
              {humanizeDuration(
                lessonData && lessonData?.lessonDuration * 60 * 1000,
                {
                  units: ["h", "m"],
                }
              )}
            </span>
          </div>
        </div>

        <div className="flex-2 justify-center gap-2 py-4 px-3 rounded-md md:px-10 md:py-8 bg-gray-700">
          {/* if uploading content is   pdf then display pdf view r else video  */}
          {videoURL && videoURL?.contentType === "application/pdf" ? (
            <iframe
              src={videoURL.signedUrl}
              width="1300px"
              height="600px"
              title="PDF Viewer"
              controls
              allowFullScreen
            ></iframe>
          ) : videoURL && videoURL?.contentType === "video/mp4" ? (
            <ReactPlayer
              url={videoURL.signedUrl}
              controls
              width="100%"
              height="100%"
              playing
              config={{ file: { attributes: { crossOrigin: "anonymous" } } }}
            />
          ) : (
            <div className="bg-gray-800 w-full aspect-video flex items-center justify-center">
              <p className="text-gray-400">Video or PDF not available</p>
            </div>
          )}
          <div className="flex flex-col  justify-evenly gap-3 mt-4 px-4 md:px-10 md:mt-8">
            <button
              onClick={() => {
                markLessonAsCompleted(lessonData && lessonData?.lessonId);
              }}
              className="font-semibold text-teal-400"
            >
              {!progressData?.lessonCompleted?.includes(lessonData?.lessonId)
                  ? "Mark As Complete"
                    : "Completed"
                    }
            </button>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Player;

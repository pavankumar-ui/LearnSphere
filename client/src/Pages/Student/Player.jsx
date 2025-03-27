import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/appContext";
import { useParams } from "react-router-dom";
import Loading from "../../components/Student/Loading";
import humanizeDuration from "humanize-duration";
import Footer from "../../Components/Student/Footer";

const Player = () => {
  const { id, chapterId, lectureId } = useParams();
  const { enrolledCourses } = useContext(AppContext);
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const findCourse = enrolledCourses.find((course) => course._id === id);

      if (!findCourse) {
        setLoading(false);
        return;
      }

      const findChapter = findCourse.courseContent.find(
        (chapter) =>
          chapter.chapterId === chapterId || chapter._id === chapterId
      );

      if (!findChapter) {
        setLoading(false);
        return;
      }

      const findLesson = findChapter.chapterContent.find(
        (lecture) =>
          lecture.lectureId === lectureId || lecture._id === lectureId
      );

      if (!findLesson) {
        setLoading(false);
        return;
      }

      setLessonData({
        ...findLesson,
        chapterTitle:
          findChapter.chapterTitle,
        courseTitle:
          findCourse.courseTitle,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading lesson data:", error);
      setLoading(false);
    }
  }, [enrolledCourses, id, chapterId, lectureId]);



  if (!lessonData) 
     return <Loading/>
  

  return (
    <>
      <div className="flex flex-col gap-10">

        <div className="flex-1 md:flex-row gap-10 px-5 mt-12">
          <p className="text-gray-300 text-xl">
            Module: {lessonData.chapterTitle || "Unknown Module"}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-white text-xl">
              {lessonData.lectureTitle || "Unknown Lesson"}
            </p>
            <span className="text-gray-300 ml-auto px-4 text-xl">
              {humanizeDuration(lessonData.lectureDuration * 60 * 1000, {
                units: ["h", "m"],
              })}
            </span>
          </div>
        </div>

        <div className="flex-2 justify-center gap-2 py-4 px-3 rounded-md md:px-10 md:py-8 bg-gray-700">
          {lessonData && lessonData.lectureUrl ? (
            <div>

              <div className="flex justify-between items-center text-white mt-1 mx-3">
                <p>
                  {lessonData.chapterId}.{lessonData.lectureId}.
                  {lessonData.lectureTitle}
                </p>
                <button className="text-teal-300">
                  {false ? "Completed" : "Mark As Complete"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 w-full aspect-video flex items-center justify-center">
              <p className="text-gray-400">Video URL not available</p>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Player;
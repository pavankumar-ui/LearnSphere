import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { AuthContext } from '../../context/auth-context/index.jsx';
import { Line } from 'rc-progress';


const ProgressBar = ({ courseId,getCourseProgress }) => {
  const { backend_url,calculateNoOfLecture,  
    markLessonAsCompleted,
    progressData,
    setProgressdata } = useContext(AppContext);
  const { token, user, isLoggedIn } = useContext(AuthContext);
  const [progress, setProgress] = useState({ totalLessons: 0, lessonCompleted: 0 });

  // Fetch progress for the given courseId

  useEffect(() => {
    if (courseId && progressData) {
      getCourseProgress();
    }
  }, [courseId]);

  return (
    <div className="bg-black flex flex-col items-start p-4 space-y-2">
      <Line
        strokeWidth={2}
        percent={progress.totalLessons > 0 ? (progress.lessonCompleted * 100) / progress.totalLessons : 0}
        className="bg-gray-300 rounded-full"
      />
      <p className="text-gray-300 text-md md:text-md pt-2">
        {progress.totalLessons > 0 ? ((progress.lessonCompleted * 100) / progress.totalLessons).toFixed(2) : 0} % Completed
      </p>
    </div>
  );
};

export default ProgressBar;

import React, { useContext } from 'react'
import { AppContext } from '../../context/appContext';

const ProgressBar = () => {

const {progress} = useContext(AppContext);



    return (
        <div className="bg-black flex flex-col items-start p-4 space-y-2">
          <span className="text-gray-300 text-sm">{progress}% completed</span>
          <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
            <div className={`bg-blue-500 h-full`} style={{width: `${progress}%`}}></div>
          </div>
        </div>
      );
}

export default ProgressBar
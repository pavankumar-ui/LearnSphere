import React, { useState, useRef, useEffect } from 'react'
import uniqid from 'uniqid';
import Quill from 'quill';
//import ContentIcon from '../../Components/Instructor/ContentIcon';
import { assets } from '../../assets/assets/assets';

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [image, setImage] = useState(null);
  const [coursePrice, setCoursePrice] = useState('');
  const [modules, setModules] = useState([]);
  const [category, setCategory] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  const [lessonDetails, setLessonDetails] = useState({
    lessonTitle: '',
    lessonFile: null,
    lessonQuiz: '',
    lessonDuration: '',
  });

  const handleFileDrop = (e) =>{
    e.preventDefault();
    if(e.dataTransfer.files && e.dataTransfer.files[0]){
         setLessonDetails({
          ...lessonDetails,
            lessonFile:e.dataTransfer.files[0]
         });
    }
  }


  const handleModule = (action, moduleId) => {
    
          if (action === 'add') {
           const title = prompt('Enter Module title:');
           if(title){
            const newModule = {
              moduleId:uniqid(),
              moduleTitle:title,
              moduleContent:[],
              collapsed:false,
              moduleOrder:modules.length >0 ? modules[modules.length-1].moduleOrder + 1:1,
            };
            setModules([...modules,newModule])
           }
          }else if(action === 'delete'){
              setModules(modules.filter(module =>module.moduleId !== moduleId))
           }
           else if(action === 'toggle'){
                setModules(modules.map(module => 
                  module.moduleId === moduleId ? {...module,collapsed:!module.collapsed}
                  :module))};
    }



    const handleLesson = (action,moduleId,lessonIndex)=>
      {
         if(action == "add")
         {
          setCurrentModuleId(moduleId);
          setShowPopup(true);
          return;
         }
         else if(action === 'delete'){
             
          setModules(modules.map(module =>{
            if(module.moduleId === moduleId){
              return {
                ...module,
                moduleContent:module.moduleContent.filter((_,index)=>
                index !== lessonIndex)
              };
            }
            return module;
          }));
          return;
         }

         const newLesson = {
          lessonId: uniqid(),
          lessonTitle: lessonDetails.lessonTitle,
          lessonDuration: lessonDetails.lessonDuration,
          lessonFile: lessonDetails.lessonFile || null,
          lessonQuiz: lessonDetails.lessonQuiz || ''
        };


        //updates the module with new lesson//
        setModules(modules.map(module =>{
           
          if(module.moduleId === currentModuleId){
            return {
              ...module,
              moduleContent: [...module.moduleContent,newLesson]
            };
          }
             return module; 
        }));

        // Reset lesson details and close popup
  setLessonDetails({
    lessonTitle: '',
    lessonFile: null,
    lessonQuiz: '',
    lessonDuration: ''
  });
  setShowPopup(false);
    }


    const addLesson = () => {
      setModules(prevModules => {
        return prevModules.map(module => {
          if (module.moduleId === currentModuleId) {
            const newLesson = {
              lessonId: uniqid(),
              lessonTitle: lessonDetails.lessonTitle,
              lessonDuration: lessonDetails.lessonDuration,
              lessonFile: lessonDetails.lessonFile || null,
              lessonQuiz: lessonDetails.lessonQuiz || '',
              lessonOrder: module.moduleContent.length > 0 ?
                module.moduleContent[module.moduleContent.length - 1].lessonOrder + 1 : 1
            };
            
            return {
              ...module,
              moduleContent: [...module.moduleContent, newLesson]
            };
          }
          return module;
        });
      });
      
      setShowPopup(false);
      setLessonDetails({
        lessonTitle: '',
        lessonDuration: '',
        lessonFile: null,
        lessonQuiz: '',
      });
    };

     //form handler for overall course details //

     const handleSubmit = async  (e)=>{

      e.preventDefault();

     }





  useEffect(() => {
    //quill should iniate only once//
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      })
    }
  }, [])

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start 
      justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>

      <form  onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-md w-full text-gray-500'>
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input type='text'
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            placeholder='enter course Title'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required />
        </div>

        <div className='flex flex-col gap-1'>
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>

        <div className='flex items-center justify-between flex-wrap'>

          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input placeholder='0'
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              type="number"
              className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' />
          </div>

          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Course Thumbnail</p>
            <label htmlFor='thumbnailImage' className='flex items-center gap-3' />
            <img src={assets.file_upload_icon} alt="file_upload_icon" className='p-3 bg-blue-500 rounded cursor-pointer' />
            <input type='file' id='thumbnailImage' accept="image/*" hidden
              onChange={(e) => setImage(e.target.files[0])} />
            {image && <img className='max-h-10' src={URL.createObjectURL(image)} alt="Course thumbnail" />}
          </div>

        </div>


        <div className='flex flex-col gap-1'>
          <p>Course Category</p>
          <input placeholder='Enter Category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            type="text"
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' />
        </div>

        {/*adding modules and lessons popup */}
        <div>
          {modules.map((module, moduleIndex) => (

            <div key={moduleIndex} className="bg-white border rounded-lg mb-4">

              <div className="flex justify-between items-center p-4 border-b">
                <div className='flex items-center'>
                  
                  <img 
                  src={assets.dropdown_icon}
                   width={14}
                    onClick={()=>handleModule('toggle',module.moduleId)}
                    className={`mr-2 cursor-pointer transition-all ${module.collapsed &&
                      "-rotate-90"}`} />



                  <span className='font-semibold'>{moduleIndex + 1}{module.moduleTitle}</span>
                </div>
                <span className='text-gray-500'>{module.moduleContent.length} Lessons</span>
                  

                <img
                onClick={()=>handleModule('delete',module.moduleId)} 
                src={assets.cross_icon}
                 alt="cross-icon"
                  className='cursor-pointer' />
              </div>
              
              {!module.collapsed && (
                <div className='p-4'>

                  {module.moduleContent.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className='flex items-center justify-between p-2 border-b'>
                      <div className='flex items-center gap-2'>
                         

                         {/*call the content icon component to detect which file is uploaded for lesson */}
                       { lesson.lessonFile.type && lesson.lessonFile.type === 'application/pdf' ?
                                                    (<img src={assets.pdf_icon} alt="file_icon" className='w-6' />) :
                                                     ( <img src={assets.play_icon} alt="video_icon" className='w-6' />)}
                       
                        <span className='font-semibold'>
                          {lessonIndex + 1}. {lesson.lessonTitle} -
                          {lesson.lessonDuration} mins </span>
                      </div>
                  
                      {/*{lesson.lessonFile && lesson.lessonFile.type === 'application/pdf' ?
                        
                        (<p className='text-gray-400 text-sm'> # {console.log(lesson.lessonFile.type.length)} Article</p>)
                        :(<p className='text-gray-400 text-sm'># {console.log(lesson.lessonFile.type.length)} Videos </p>)
                       
                      }*/}
          

                      <div className='flex items-center gap-2'>
                        <img src={assets.cross_icon} alt="delete-icon" className='w-4 cursor-pointer'
                        onClick={()=> handleLesson('delete',module.moduleId,lessonIndex)} />
                      </div>
                    </div>

                  ))}
                  <div className='inline-flex bg-sky-400  text-white p-2 rounded cursor-pointer mt-2'
                  onClick={()=>handleLesson('add', module.moduleId)}>
                  Add Lesson
                  </div>
                </div>
              )}

            </div>
          ))}
          <div className='flex justify-center items-center 
                        bg-blue-100 p-2 rounded-lg cursor-pointer'
                         onClick={()=>handleModule('add')}
                        >Add Module</div>

{showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 z-50">
    <div className="bg-white text-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <h2 className="text-lg font-semibold mb-4">Add Lesson</h2>

      {/* Lesson Title */}
      <div className="mb-4">
        <label className="block text-sm">Lesson Title</label>
        <input
          type="text"
          className="w-full mt-1 px-3 py-2 border rounded"
          value={lessonDetails.lessonTitle}
          onChange={(e) => setLessonDetails({
            ...lessonDetails,
            lessonTitle: e.target.value
          })}
        />
      </div>

      {/* Duration */}
      <div className="mb-4">
        <label className="block text-sm">Duration (in mins)</label>
        <input
          type="text"
          className="w-full mt-1 px-3 py-2 border rounded"
          value={lessonDetails.lessonDuration}
          onChange={(e) => setLessonDetails({
            ...lessonDetails,
            lessonDuration: e.target.value
          })}
        />
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <p className="block text-sm mb-2">Upload a Video or PDF</p>

        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
          onDrop={(e) => handleFileDrop(e)}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept=".mp4, .pdf"
            onChange={(e) => setLessonDetails({
              ...lessonDetails,
              lessonFile: e.target.files[0] || null
            })}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center">
              <img src={assets.file_upload_icon} alt="file_upload_icon" className="w-20 h-10 mb-2" />
              <p className="text-gray-500">Drag and drop a file here</p>
              <p className="text-blue-500 underline mt-1">or browse files</p>
            </div>
          </label>
        </div>

        {/* Display uploaded file info */}
        {lessonDetails.lessonFile && (
          <div className="mt-4 p-3 bg-gray-100 rounded flex items-center justify-between">
            <div className="flex items-center">

            { lessonDetails.lessonFile.type && lessonDetails.lessonFile.type === 'application/pdf' ?
                                         (<img src={assets.pdf_icon} alt="file_icon" className='w-6' />) :
                                          ( <img src={assets.play_icon} alt="video_icon" className='w-6' />)}
              

              <span className="text-sm ml-3">{lessonDetails.lessonFile.name}</span>
            </div>
            <button
            type="button"
              className="text-red-500 hover:text-red-700 transition"
              onClick={() => setLessonDetails({ ...lessonDetails, lessonFile: null })}>
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Add Button */}
      <button
        type="button"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
         onClick={addLesson}
        >
        Add Lesson
      </button>

      {/* Close Button */}
      <img
        src={assets.cross_icon}
        onClick={() => setShowPopup(false)}
        className="absolute top-4 right-4 w-5 cursor-pointer"
        alt="Close"
      />
    </div>
  </div>
)}

    <button type="submit" className='bg-blue-600 text-white w-max py-2.5 px-8 rounded my-4'>
      ADD
    </button>




        </div>
      </form>
    </div>
  )
}

export default AddCourse
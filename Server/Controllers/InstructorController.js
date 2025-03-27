const cloudinary = require("../Config/cloudinary");
const path = require("path");
const Course = require("../Models/Course");
const { uploadToS3 } = require("../Config/Multer");



//Adds the new Course and modify the course dependencies/properties without backend loading or overhead//
const addNewCourse = async (req, res, next) => {
    try {
        const { courseData } = req.body;
        const InstructorId = req.user._id;

 // ✅ Access uploaded files (Buffer-based handling)
 const imageFile = req.files['image'] ? req.files['image'][0] : null;
 const lessonFile = req.files['file'] ? req.files['file'][0] : null;

 if (!imageFile || !lessonFile) {
   return res.status(400).json({ message: "Image and lesson file are required", success: false });
 }

 // ✅ Upload Image to Cloudinary from Buffer (use stream)
 const uploadToCloudinary = async (buffer) => {
   return new Promise((resolve, reject) => {
     const stream = cloudinary.uploader.upload_stream(
       { resource_type: "image" },
       (error, result) => {
         if (error) return reject(error);
         resolve(result);
       }
     );
     stream.end(buffer);
   });
 };

 const imageUpload = await uploadToCloudinary(imageFile.buffer);  // Stream the buffer

        // ✅ Upload PDF/Video to S3 (AWS SDK v3)
        const lessonUrl = await uploadToS3(lessonFile);

        //console.log("Lesson URL:", lessonUrl);

        // ✅ Parse Course Data
        let parsedCourseData;
        try {
            parsedCourseData = JSON.parse(courseData);
        } catch (error) {
            return res.status(400).json({ message: "Invalid courseData format", success: false });
        }

        parsedCourseData.instructor = InstructorId;

        // ✅ Inject URLs into Course Data
        parsedCourseData.courseContent.forEach((module) => {
            module.moduleContent.forEach((lesson) => {
                lesson.lessonContent = lessonUrl;  // Attach S3 URL
            });
        });

        // ✅ Create Course in Database
        const newCourse = await Course.create(parsedCourseData);

        // ✅ Attach Thumbnail URL from Cloudinary
        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();

        return res.status(201).json({
            message: "Course Added Successfully",
            success: true,
        });

    } catch (err) {
        console.error("Upload Error:", err);
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};


// ✅ Get Instructor's Courses in Dashboard //
const getInstructorCourses = async(req,res,next)=>{
try{
      const instructor = req.user._id;
      console.log(instructor);
       const courses = await Course.find({instructor});
                                  

       
       return res.status(200).json({
        message:"Courses fetched successfully",
        success:true,
        courses,
       });
                                
}catch(err){
 return res.status(500).json({
        message:err.message,
        success:false,
    });
   }
}





module.exports ={addNewCourse,
                 getInstructorCourses};

const cloudinary = require("../Config/Cloudinary");
const path = require("path");
const Course = require("../Models/Course");
const { uploadToS3 } = require("../Config/Multer");
const CommonServerError = require("../Utils/CommonServerError");

//Adds the new Course and modify the course dependencies/properties without backend loading or overhead//
const addNewCourse = async (req, res, next) => {
  try {
    const { courseData } = req.body;
    const InstructorId = req.user._id;

    // ✅ Access uploaded files (Buffer-based handling)
    const imageFile = req.files["courseThumbnail"]
      ? req.files["courseThumbnail"][0]
      : null;
    const lessonFile = req.files["lessonFile"]
      ? req.files["lessonFile"][0]
      : null;

    if (!imageFile || !lessonFile) {
      return res
        .status(400)
        .json({
          message: "Image and lesson file are required",
          success: false,
        });
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

    const imageUpload = await uploadToCloudinary(imageFile.buffer); // Stream the buffer

    // ✅ Upload PDF/Video to S3 (AWS SDK v3)
    const lessonUrl = await uploadToS3(lessonFile);


    // ✅ Parse Course Data
    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(courseData);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid courseData format", success: false });
    }

    parsedCourseData.instructor = InstructorId;

    // ✅ Inject URLs into Course Data
    parsedCourseData.courseContent.forEach((module) => {
      module.moduleContent.forEach((lesson) => {
        lesson.lessonContent = lessonUrl; // Attach S3 URL
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
    CommonServerError(err, req, res, next);
  }
};

// ✅ Get Instructor's Courses in Dashboard //
const getInstructorCourses = async (req, res, next) => {
  try {
    const instructor = req.user._id;
    const courses = await Course.find({ instructor });

    if (courses.length === 0) {
      return res.status(404).json({
        message: "No courses found, please add a course",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Courses fetched successfully",
      success: true,
      courses,
    });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

module.exports = { addNewCourse, getInstructorCourses };

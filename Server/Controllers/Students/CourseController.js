const Course = require("../../Models/Course");
const Payment = require("../../Models/Payment");
const CommonServerError = require("../../Utils/CommonServerError");

//to display in course list student dashboard//
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-moduleContent"])
      .sort({ createdAt: -1 })
      .populate({ path: "instructor" });

      if(!courses || courses.length === 0) {
        return res.status(200).json({
          message: "No Courses Available",
          success: true,
          courses: [],
        });
      }

    return res.status(200).json({
      message: "Courses fetched Successfully",
      success: true,
      courses,
    });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

//to display in the course detail with lesson links for student access//
const getCourseDetailById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const courseDetail = await Course.findById(id).populate({
      path: "instructor",
    });

    courseDetail.courseContent.map((module) => {
      module.moduleContent.map((lesson) => {
        if (lesson.lessonLocked === true) {
          lesson.lessonContent = "Locked";
        } else {
          lesson.lessonContent = lesson.lessonContent;
        }
      });
    });

    return res.status(200).json({
      message: "Course Detail Fetched Successfully",
      success: true,
      courseDetail,
    });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

module.exports = { getAllCourses, getCourseDetailById };

const express = require("express");
const studentRoutes = express.Router();
const StudentAccess = require("../Middlewares/StudentAccess");
const validateToken = require("../Middlewares/validateToken");
const {
  userEnrolledCourses,
  coursePaymentService,
  updateStudentCourseProgress,
  getStudentCourseProgress,
  studentRatingandThoughts,
  enrollFreeCourse,
  streamVideoURL,
} = require("../Controllers/Students/StudentController");

//commonMiddlware for authentication//
studentRoutes.use(validateToken);

studentRoutes.get("/enrolled", StudentAccess, userEnrolledCourses);
studentRoutes.post("/payment", StudentAccess, coursePaymentService);
//studentRoutes.get("/verify-payment", StudentAccess, verifyPaymentStatus);
studentRoutes.put("/free-enrollment", StudentAccess, enrollFreeCourse);
//course progress routes//
studentRoutes.post(
  "/updated-progress",
  StudentAccess,
  updateStudentCourseProgress
);
studentRoutes.post("/get-progress", StudentAccess, getStudentCourseProgress);

//rating and thought routes//
studentRoutes.post("/rating", StudentAccess, studentRatingandThoughts);

//signed url for mux//
studentRoutes.get("/video-url", StudentAccess, streamVideoURL);

module.exports = studentRoutes;

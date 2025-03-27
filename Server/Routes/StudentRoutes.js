const express = require("express");
const studentRoutes = express.Router();
const {Studentaccess} = require("../Middlewares/roleMiddleware");
const validateToken = require("../Middlewares/validateToken");
const {userEnrolledCourses,
       coursePaymentService,
       verifyPaymentStatus,
        updateStudentCourseProgress,
        getStudentCourseProgress,
        studentRatingandThoughts} = require("../Controllers/Students/StudentController");



//commonMiddlware for authentication//
studentRoutes.use(validateToken);

studentRoutes.get("/enrolled-courses",Studentaccess,userEnrolledCourses);
studentRoutes.post("/payment",Studentaccess,coursePaymentService);
studentRoutes.get('/verify-payment',Studentaccess,verifyPaymentStatus);
//course progress routes//
studentRoutes.post("/progress",Studentaccess,updateStudentCourseProgress);
studentRoutes.get("/progress",Studentaccess,getStudentCourseProgress);

//rating and thought routes//
studentRoutes.post("/rating",Studentaccess,studentRatingandThoughts)



module.exports = studentRoutes;
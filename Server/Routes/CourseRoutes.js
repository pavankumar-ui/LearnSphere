const express = require('express');
const courseRoutes = express.Router();
const validateToken = require("../Middlewares/validateToken");
const StudentAccess = require("../Middlewares/StudentAccess");
const { getAllCourses, getCourseDetailById } = require('../Controllers/Students/CourseController');


//visible to all users in home page//
courseRoutes.get("/",getAllCourses);

//to enroll or buy the course, only for students//
courseRoutes.get("/students/:id",validateToken,StudentAccess,getCourseDetailById);


module.exports = courseRoutes;
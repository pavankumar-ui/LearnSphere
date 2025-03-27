const express = require('express');
const courseRoutes = express.Router();
const validateToken = require("../Middlewares/validateToken");
const {Studentaccess} = require("../Middlewares/roleMiddleware");
const { getAllCourses, getCourseDetailById } = require('../Controllers/Students/CourseController');

courseRoutes.use(validateToken);

courseRoutes.get("/all",Studentaccess,getAllCourses);
courseRoutes.get("/:id",Studentaccess,getCourseDetailById);


module.exports = courseRoutes;
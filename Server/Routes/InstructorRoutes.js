const express = require('express');
const instructorRoutes = express.Router();
const validateToken = require("../Middlewares/validateToken");
const {Instructoraccess} = require("../Middlewares/roleMiddleware"); 
const { uploadFields } = require("../Config/Multer");
const { addNewCourse,getInstructorCourses } = require('../Controllers/InstructorController');

instructorRoutes.use(validateToken);
instructorRoutes.post("/courses",uploadFields,Instructoraccess,addNewCourse);
instructorRoutes.get("/courses",Instructoraccess,getInstructorCourses);






module.exports = instructorRoutes;



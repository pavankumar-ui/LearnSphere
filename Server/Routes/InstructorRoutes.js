const express = require('express');
const instructorRoutes = express.Router();
const validateToken = require("../Middlewares/validateToken");
const InstructorAccess = require("../Middlewares/InstructorAccess");
const { uploadFields } = require("../Config/Multer");
const { addNewCourse,getInstructorCourses } = require('../Controllers/InstructorController');

instructorRoutes.use(validateToken);
instructorRoutes.post("/courses",uploadFields,InstructorAccess,addNewCourse);
instructorRoutes.get("/courses",InstructorAccess,getInstructorCourses);

module.exports = instructorRoutes;



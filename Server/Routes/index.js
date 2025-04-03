const express = require("express");
const indexRoutes = express.Router();
const authRoutes = require("./authRoutes");
const instructorRoutes = require("./InstructorRoutes");
const courseRoutes = require("./CourseRoutes");
const studentRoutes = require("./StudentRoutes");

indexRoutes.use("/auth", authRoutes);
indexRoutes.use("/Instructor", instructorRoutes);
indexRoutes.use("/courses", courseRoutes);
indexRoutes.use("/student", studentRoutes);

module.exports = indexRoutes;

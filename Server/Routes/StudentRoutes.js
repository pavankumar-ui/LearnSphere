const express = require("express");
const studentRoutes = express.Router();
const {Studentaccess} = require("../Middlewares/roleMiddleware");
const validateToken = require("../Middlewares/validateToken");
const {userEnrolledCourses,coursePaymentService} = require("../Controllers/Students/StudentController");
const stripeWebhooks = require("../Controllers/webhooks");


//commonMiddlware for authentication//
studentRoutes.use(validateToken);

studentRoutes.get("/enrolled-courses",Studentaccess,userEnrolledCourses);
studentRoutes.post("/payment",Studentaccess,coursePaymentService);
studentRoutes.post("/stripe",Studentaccess,express.raw({type:"application/json"}),stripeWebhooks);




module.exports = studentRoutes;
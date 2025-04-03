const Joi = require("joi");
const {validate} = require('../Models/User.js');
                
                     


  const registrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
                .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{9,10}$"))
                .required(),
  role: Joi.string().valid("instructor", "student").required(),
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const lessonJoiSchema = Joi.object({
    lessonId: Joi.string().required(),
    lessonTitle: Joi.string().required(),
    lessonDuration: Joi.number().required(),
    lessonContent: Joi.string().required(),
    lessonOrder: Joi.number().required(),
    lessonLocked: Joi.boolean().default(true)
  });
  
  // Joi schema for a module
  const moduleJoiSchema = Joi.object({
    moduleId: Joi.string().required(),
    moduleOrder: Joi.number().required(),
    moduleTitle: Joi.string().required(),
    moduleContent: Joi.array().items(lessonJoiSchema)
  });
  
  // Joi schema for a course rating
  const courseRatingJoiSchema = Joi.object({
    userId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    thoughts: Joi.string().default("")
  });
  
  // Joi schema for a course
  const courseJoiSchema = Joi.object({
    courseTitle: Joi.string().required(),
    courseDescription: Joi.string().required(),
    courseThumbnail: Joi.string().optional(),
    courseCategory: Joi.string().required(),
    isPublished: Joi.boolean().default(true),
    coursePrice: Joi.number().optional(),
    courseContent: Joi.array().items(moduleJoiSchema),
    courseRatings: Joi.array().items(courseRatingJoiSchema),
    instructor: Joi.string().required(),
    enrolledStudents: Joi.array().items(Joi.string())
  });



  const validateRegistration = (req, res, next) => {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  const validateCourse = (req, res, next) => {
    const { error } = courseJoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  module.exports = {
    validateRegistration,
    validateLogin,
    validateCourse
  };
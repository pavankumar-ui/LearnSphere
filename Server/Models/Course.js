const { required } = require("joi");
const mongoose = require("mongoose");



const lessonSchema = new mongoose.Schema({
    lessonId:{type:String,required:true},
    lessonTitle:{type:String,required:true},
    lessonDuration:{type:Number,required:true},
    lessonContent:{type:String,required:true},
    lessonOrder:{type:Number,required:true},
    lessonLocked:{type:Boolean,default:true},
},{_id:false});


const moduleSchema = new mongoose.Schema({
    moduleId:{type:String,required:true},
    moduleOrder:{type:Number,required:true},
    moduleTitle:{type:String,required:true},
    moduleContent:[lessonSchema],
},{_id:false});



const courseSchema = new mongoose.Schema({
         
    courseTitle :{ type:String, required:true},
    courseDescription: {type:String, required:true},
    courseThumbnail: {type:String},
    courseCategory:{type:String,required:true},
    isPublished:{type:Boolean,default:true},
    coursePrice:{type:Number},
    courseContent:[moduleSchema],  
   courseRatings:[
      {
        userId:{type:String,ref:"User"},
        rating:{type:Number,min:1,max:5},
      }
    ],
    instructor:{type:String,ref:"User",required:true},
    enrolledStudents:[
                     {
                      type:String,
                      ref:"User"
                    }],

},{timestamps:true,minimize:false});


const Course = mongoose.model("Course",courseSchema);

module.exports = Course;
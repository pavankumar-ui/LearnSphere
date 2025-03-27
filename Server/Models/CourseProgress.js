const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    courseId:{type:String,required:true},
    moduleId:{type:String,required:true},
    completed:{type:Boolean,default:false},
    lessonCompleted:[]},
    {timestamps:true});


    const CourseProgress = mongoose.model("CourseProgress",courseProgressSchema);

    module.exports = CourseProgress;

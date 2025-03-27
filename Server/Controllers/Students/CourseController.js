const Course = require('../../Models/Course');
const Payment = require('../../Models/Payment');


//to display in course list student dashboard//
const getAllCourses = async(req,res,next)=>{
try{
      
    const courses = await Course.find({isPublished:true})
                                .select(['-courseContent','-moduleContent'])
                                .populate({path:"instructor"});

                                return res.status(200).json({
                                    message:"Courses fetched Successfully",
                                    success:true,
                                    courses,
                                });

}catch(err){
    return res.status(500).json({
        message:err.message,
        success:false,
    });
}
}

//to display in the course detail with lesson links for student access//
const getCourseDetailById = async (req,res,next)=>{

    try{
              const {id} = req.params;

              const courseDetail = await Course.findById(id)
              .populate({path:"instructor"});
           
        courseDetail.courseContent.forEach((module)=>{
            module.moduleContent.forEach(lesson =>{
                  if(lesson.lessonLocked === true){
                    lesson.lessonContent = "Locked" 
                  }else
                  {
                    lesson.lessonContent = lesson.lessonContent
                  }
            })
        });

        return res.status(200).json({
            message:"Course Detail Fetched Successfully",
            success:true,
            courseDetail,
        })
              
    }
    catch(err){
        return res.status(500).json({
            message:err.message,
            success:false
        });
    }
}





module.exports = {getAllCourses,
                  getCourseDetailById};
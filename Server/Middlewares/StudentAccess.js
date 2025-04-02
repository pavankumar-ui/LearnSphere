const User = require("../Models/User");


const StudentAccess = async (req,res,next)=>{

    try{
        const userId = req.user._id;
       const roleResponse = await User.findOne({_id:userId});
       if(roleResponse.role !== "student"){
        return res.status(401).json({
            message:"Only students can access this routes",
            success:false,
        })
       }
       next();

    }catch(err){
        return res.status(500).json({
            message:err.message,
            success:false
        });
    }
}

module.exports = StudentAccess
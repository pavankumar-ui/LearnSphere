const  mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password:{type:String, required:true},
    role: { type: String, enum: ['student', 'instructor'], default: 'student' },
    profileImage: { type: String},
    companyName: { type: String},
    college: { type: String},
    designation:{type:String},
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
});

const User = mongoose.model('User',userSchema);

 module.exports = User;
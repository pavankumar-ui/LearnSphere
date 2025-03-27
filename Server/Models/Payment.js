const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    courseId : {type:mongoose.Schema.Types.ObjectId, 
                 ref:"course",
                required:true},
       userId:{type:String,
                ref:"User",
               required:true},
        totalAmount:{type:Number,required:true},
        paymentDate:{type:Date,default:Date.now},
        paymentStatus:{type:String,enum:['pending','completed','failed'],default:'pending'},           
},{timestamps:true});


const Payment = mongoose.model("Payment",paymentSchema);

module.exports = Payment;
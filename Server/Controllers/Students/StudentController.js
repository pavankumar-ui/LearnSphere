 require("dotenv").config();
  const User = require("../../Models/User");
  const Course = require("../../Models/Course");
  const Payment = require("../../Models/Payment");
  const Stripe = require("stripe");


  
const userEnrolledCourses = async (req,res,next)=>{

  const studentId = req.user._id;

  try{

    const enrolledCourses = await User.findById(studentId)
                                      .populate("enrolledCourses");
                                      
                                      

           return res.status(200).json({
            message:"Enrolled Courses Fetched Successfully",
            success:true,
            enrolledCourses,
           });           


  }catch(err){
    return res.status(500).json({
      message:err.message,
      success:false,
    });
  }

}

const coursePaymentService = async (req,res,next)=>{

  try{
  
        const {courseId} = req.body;

        const origin = req.headers.origin || process.env.ORIGIN;

        const studentId =req.user._id;

        const userData = await User.findById(studentId);
        const courseData = await Course.findById(courseId);
        const gstAmount = parseFloat(process.env.STRIPE_GST_AMOUNT) || 0;
    const totalAmount = Math.round(courseData.coursePrice * (1 + gstAmount));



        if(!userData || !courseData){
          return res.status(404).json({
            message:"User or Course Data not found",
            success:false,
          });
        }

        const paymentData = {
          courseId : courseData._id,
          userId:studentId,
          totalAmount,
        }

        console.log("origin headers",origin);
        console.log("STRIPE_GST_AMOUNT:", process.env.STRIPE_GST_AMOUNT);
console.log("coursePrice:", courseData.coursePrice);
console.log("TotalAmount:", totalAmount);


        const newCoursePayment = await Payment.create(paymentData);

        //Stripe payment Service Initialize//
  
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLowerCase();
        //creating line items for stripe checkout//
        const line_items =[
                           {
                              price_data:{
                                currency,
                                product_data:{
                                  name: courseData.courseTitle, 
                                },
                                unit_amount: totalAmount *100,
                              },
                              quantity:1,
                           }  
                         ];

          const session = await stripe.checkout.sessions.create({

            success_url:`${origin}/loading/my-enrollments`,
            cancel_url:`${origin}`,
            line_items,
            mode:"payment",
            customer_email: userData.email, // Include email
              billing_address_collection: "required", // Ensure address collection
            metadata:{
              paymentId:newCoursePayment._id.toString()
            }  
          }) 
          
          return res.status(200).json({success:true,session_url:session.url});
  }
  catch(err)
  {
    return res.status(500).json({
      message:err.message,
      success:false,
    });
  }
}

module.exports = {userEnrolledCourses,
                  coursePaymentService};
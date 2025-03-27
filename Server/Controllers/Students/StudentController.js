require("dotenv").config();
const User = require("../../Models/User");
const Course = require("../../Models/Course");
const Payment = require("../../Models/Payment");
const CourseProgress = require("../../Models/CourseProgress");

const userEnrolledCourses = async (req, res, next) => {
  const studentId = req.user._id;

  try {
    const enrolledCourses = await User.findById(studentId).populate(
      "enrolledCourses"
    );

    return res.status(200).json({
      message: "Enrolled Courses Fetched Successfully",
      success: true,
      enrolledCourses,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const coursePaymentService = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const origin = req.headers.origin || process.env.ORIGIN;

    const studentId = req.user._id;

    const userData = await User.findById(studentId);
    const courseData = await Course.findById(courseId);
    const gstAmount = parseFloat(process.env.STRIPE_GST_AMOUNT) || 0;
    const totalAmount = Math.round(courseData.coursePrice * (1 + gstAmount));

    if (!userData || !courseData) {
      return res.status(404).json({
        message: "User or Course Data not found",
        success: false,
      });
    }

    const paymentData = {
      courseId: courseData._id,
      userId: studentId,
      totalAmount,
    };

    console.log("origin headers", origin);
    console.log("STRIPE_GST_AMOUNT:", process.env.STRIPE_GST_AMOUNT);
    console.log("coursePrice:", courseData.coursePrice);
    console.log("TotalAmount:", totalAmount);

    const newCoursePayment = await Payment.create(paymentData);

    //Stripe payment Service Initialize//

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();
    //creating line items for stripe checkout//
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: totalAmount * 100,
        },
        quantity: 1,
      },
    ];

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}`,
      line_items,
      mode: "payment",
      customer_email: userData.email,
      billing_address_collection: "required",
      metadata: { paymentId: newCoursePayment._id.toString() },
    });

    return res.status(200).json({ success: true, session_url: session.url });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const verifyPaymentStatus = async (req, res, next) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Retrieve session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Payment session not found" });
    }

    console.log("Stripe Payment Status:", session.payment_status); // Should be 'paid'

    // Check if payment is successful
    if (session.payment_status === "paid") {
      const payment = await Payment.findOneAndUpdate(
        { _id: session.metadata.paymentId },
        { paymentStatus: "completed" },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({ message: "Payment record not found" });
      }

      // Update User's enrolledCourses
      const user = await User.findByIdAndUpdate(
        payment.userId,
        { $addToSet: { enrolledCourses: payment.courseId } },
        { new: true }
      );

      //  Update Course's enrolledStudents
      const course = await Course.findByIdAndUpdate(
        payment.courseId,
        { $addToSet: { enrolledStudents: payment.userId } },
        { new: true }
      );

      return res.status(200).json({
        message: "Payment verified and enrollment done successfully",
        success: true,
        payment,
        user,
        course,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Payment not completed", success: false });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

const updateStudentCourseProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId, lessonId,moduleId } = req.body;

    const courseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (courseProgress) {
      if (courseProgress.lessonCompleted.includes(lessonId) && courseProgress.lessonCompleted.length >-1) {
        courseProgress.lessonCompleted.push(lessonId);





        await courseProgress.save();

        return res.status(200).json({
          success: true,
          message: "Lesson Already Completed",
        });
      } else {
        await courseProgress.create({
          userId,
          courseId,
          lessonCompleted: [lessonId],
        });

        return res.status(200).json({
          success: true,
          message: "progress Updated",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const getStudentCourseProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    const progressData = await CourseProgress.findOne({
      userId,
      courseId,
    });
    return res.status(200).json({
      success: true,
      progressData,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};



//optional functionality//
const studentRatingandThoughts = async (req,res,next)=>{

   try{

    const {courseId,rating,thoughts} = req.body;
    const studentId = req.user._id;  

       if(!courseId || !rating || !thoughts || rating < 1 || rating > 5){
        return res.status(400).json({
          success:false,
          message:"invalid Data"
        });
       }
    

const UserExists = await User.findById(studentId);

 if(!UserExists || !UserExists.enrolledCourses.includes(courseId)){
   return res.status(400).json({
    success:false,
    message:"Student has not enrolled in this course"
   });
 }

              const RatingandThought = await Course.findByIdAndUpdate(courseId,{
                $push:{
                      courseRatings:{
                       userId:studentId,
                       rating:rating,
                       thoughts:thoughts,
                      }
                    }
                  },{new:true,runValidators: true});

            
                  return res.status(200).json({
                    success:true,
                    message:"Rating and thoughts added",
                    RatingandThought,
                  });
   }
    catch(err){
      return res.status(500).json({
        message:err.message,
        success:false,
      });

    }

}




module.exports = {
  userEnrolledCourses,
  coursePaymentService,
  verifyPaymentStatus,
  updateStudentCourseProgress,
  getStudentCourseProgress,
  studentRatingandThoughts,
};

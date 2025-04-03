require("dotenv").config();
const User = require("../../Models/User");
const Course = require("../../Models/Course");
const Payment = require("../../Models/Payment");
const CourseProgress = require("../../Models/CourseProgress");
const CommonServerError = require("../../Utils/CommonServerError");
const { generateSignedUrl } = require("../../Services/SignedURL");

const userEnrolledCourses = async (req, res, next) => {
  const studentId = req.user._id;

  try {
    const user = await User.findById(studentId).populate("enrolledCourses");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("Enrolled courses from DB:", user.enrolledCourses);

    return res.status(200).json({
      message: "Enrolled Courses Fetched Successfully",
      success: true,
      enrolledCourses: user.enrolledCourses,
    });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

//debug issues//

const coursePaymentService = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const origin = req.headers.origin || process.env.CLIENT_URL;
    const studentId = req.user._id;
    const userData = await User.findById(studentId);
    const courseData = await Course.findById(courseId);
    if (!courseData || !userData) {
      return res.status(404).json({
        message: "User or Course Data not found",
        success: false,
      });
    }

    const gstAmount = parseFloat(process.env.STRIPE_GST_AMOUNT);
    const totalAmount = Math.round(courseData.coursePrice * (1 + gstAmount));

    const paymentData = {
      courseId: courseData._id,
      userId: studentId,
      totalAmount,
    };

    /*  console.log("origin headers", origin);
    console.log("STRIPE_GST_AMOUNT:", process.env.STRIPE_GST_AMOUNT);
    console.log("coursePrice:", courseData.coursePrice);
    console.log("TotalAmount:", totalAmount); */

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

    if (!courseData._id || !studentId || !newCoursePayment._id) {
      return res.status(400).json({
        message: "Missing critical IDs for payment processing",
        success: false,
      });
    }

    // Create Stripe Checkout session

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify-payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/course-list`,
      line_items,
      mode: "payment",
      customer_email: userData.email,
      billing_address_collection: "required",
      metadata: {
        paymentId: newCoursePayment._id.toString(),
        courseId: courseData._id.toString(),
        userId: studentId.toString(),
      },
      phone_number_collection: { enabled: true },
    });

    return res.status(200).json({ success: true, session_url: session.url });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

//verify the stripr payment successful//
const verifyPaymentStatus = async (req, res, next) => {
  try {
    console.log("🔥 Verification started. Session ID:", req.query.sessionId);

    // Initialize Stripe with error handling
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    if (!stripe) throw new Error("Stripe initialization failed");

    const sessionId = req.query.sessionId;
    if (!sessionId) {
      console.error("❌ Missing session ID in request");
      return res.status(400).json({
        message: "Session ID is required",
        success: false,
      });
    }

    // Retrieve Stripe session with error handling
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(
      "🎯 Stripe Session Metadata:",
      JSON.stringify(session.metadata, null, 2)
    );
    console.log("💳 Payment Status:", session.payment_status);

    // Validate critical metadata
    if (
      !session.metadata?.paymentId ||
      !session.metadata?.userId ||
      !session.metadata?.courseId
    ) {
      console.error("❌ Missing metadata in Stripe session");
      return res.status(400).json({
        message: "Invalid payment session metadata",
        success: false,
      });
    }

    // Convert metadata to ObjectIds with validation
    const mongoose = require("mongoose");
    const convertId = (id, fieldName) => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (err) {
        console.error(`❌ Invalid ${fieldName} format:`, id);
        throw new Error(`Invalid ${fieldName} format`);
      }
    };

    const paymentId = new mongoose.Types.ObjectId(session.metadata.paymentId);
    const userId = new mongoose.Types.ObjectId(session.metadata.userId);
    const courseId = new mongoose.Types.ObjectId(session.metadata.courseId);

    if (session.payment_status === "paid") {
      // Check existing payment status first
      const existingPayment = await Payment.findById(paymentId);
      if (existingPayment?.paymentStatus === "completed") {
        console.log("⚠️ Payment already marked as completed");
        return res.status(200).json({
          message: "Payment already verified",
          success: true,
          courseId,
        });
      }

      // Update payment record using converted ID
      const payment = await Payment.findOneAndUpdate(
        { _id: paymentId },
        { paymentStatus: "completed", updatedAt: new Date() },
        { new: true, upsert: false }
      );

      if (!payment) {
        console.error("❌ Payment record not found for ID:", paymentId);
        return res.status(404).json({
          message: "Payment record not found",
          success: false,
        });
      }

      // Check existing enrollment using converted IDs
      const user = await User.findById(userId);
      if (user.enrolledCourses.some((id) => id.equals(courseId))) {
        console.log("⚠️ User already enrolled in course:", courseId);
        return res.status(200).json({
          message: "User already enrolled in this course",
          success: true,
          courseId,
        });
      }

      // Update user enrollment
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { enrolledCourses: courseId } },
        { new: true, runValidators: true }
      );

      // Update course enrollment
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          $addToSet: { enrolledStudents: userId },
          $set: {
            "courseContent.$[].moduleContent.$[].lessonLocked": false,
            updatedAt: new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      console.log("✅ Successfully updated records:", {
        payment: payment._id,
        user: updatedUser._id,
        course: updatedCourse._id,
      });

      return res.status(200).json({
        message:
          "Payment verified and enrollment successful! Lessons unlocked.",
        success: true,
        courseId,
        paymentId: payment._id,
      });
    } else {
      console.log("⚠️ Payment not completed for session:", sessionId);
      return res.status(400).json({
        message: "Payment not completed. Status: " + session.payment_status,
        success: false,
        paymentStatus: session.payment_status,
      });
    }
  } catch (err) {
    console.error("💥 Critical Error:", {
      message: err.message,
      stack: err.stack,
      query: req.query,
      metadata: req.metadata,
    });

    // Return structured error response
    res.status(500).json({
      success: false,
      message: err.message || "Payment verification failed",
      errorType: err.type || "internal_error",
      code: err.code || "UNKNOWN_ERROR",
    });
  }
};

const updateStudentCourseProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId, lessonId, moduleId } = req.body;

    if (!courseId || !lessonId || !moduleId) {
      return res.status(400).json({
        success: false,
        message: "Missing courseId, lessonId, or moduleId",
      });
    }

    let courseProgress = await CourseProgress.findOne({ userId, courseId });

    if (courseProgress) {
      if (!courseProgress.lessonCompleted.includes(lessonId)) {
        courseProgress.lessonCompleted.push(lessonId);

        await courseProgress.save();

        return res.status(200).json({
          success: true,
          message: "Progress Updated",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Lesson Already Completed",
        });
      }
    } else {
      courseProgress = await CourseProgress.create({
        userId,
        courseId,
        moduleId,
        lessonCompleted: [lessonId],
      });

      return res.status(200).json({
        success: true,
        message: "Progress Created",
      });
    }
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

const getStudentCourseProgress = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    // Fetch the enrolled courses
    const enrolledCourses = await User.findById(studentId).populate(
      "enrolledCourses"
    );
    if (!enrolledCourses) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Fetch progress for all enrolled courses
    const progressData = await CourseProgress.find({ userId: studentId });
    // Attach progress & determine completion
    const enrichedCourses = enrolledCourses.enrolledCourses.map((course) => {
      const courseProgress = progressData.find(
        (p) => p.courseId.toString() === course._id.toString()
      );
      // Calculate total lessons
      const totalLessons = course.courseContent.reduce(
        (sum, module) => sum + module.moduleContent.length,
        0
      );
      // Count completed lessons
      const completedLessons = courseProgress
        ? courseProgress.lessonCompleted.length
        : 0;
      // Mark course as completed if all lessons are done
      const isCourseCompleted =
        totalLessons > 0 && completedLessons === totalLessons;
      return {
        ...course.toObject(),
        progress: courseProgress
          ? {
              ...courseProgress.toObject(),
              completed: isCourseCompleted, // ✅ Update the completed field dynamically
            }
          : { lessonCompleted: [], completed: false }, // Default if no progress found
      };
    });
    return res.status(200).json({
      message: "Enrolled Courses Progress Fetched Successfully",
      success: true,
      progressData: enrichedCourses.map((course) => ({
        courseId: course._id,
        courseTitle: course.courseTitle,
        courseThumbnail: course.courseThumbnail,
        progress: course.progress
          ? {
              completed: course.progress.completed,
              lessonCompleted: course.progress.lessonCompleted.length,
              totalLessons: course.courseContent.reduce(
                (acc, module) => acc + module.moduleContent.length,
                0
              ),
            }
          : { completed: false, lessonCompleted: 0, totalLessons: 0 },
      })),
    });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

// to enroll the course if the course is free//
const enrollFreeCourse = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.body;

    // Check if student exists
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({
        message: "Student Not Found",
        success: false,
      });
    }

    // Run both updates concurrently using Promise.all
    const [userUpdate, courseUpdate] = await Promise.all([
      User.findByIdAndUpdate(
        studentId,
        {
          $addToSet: { enrolledCourses: courseId },
        },
        { new: true }
      ),

      Course.findByIdAndUpdate(
        courseId,
        {
          $addToSet: { enrolledStudents: studentId },
          $set: { "courseContent.lessonLocked": false },
        },
        { new: true }
      ),
    ]);

    return res.status(200).json({
      message: "Free course Enrolled Successfully",
      success: true,
      user: userUpdate,
      course: courseUpdate,
    });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

//optional functionality//
const studentRatingandThoughts = async (req, res, next) => {
  try {
    const { courseId, rating, thoughts } = req.body;
    const studentId = req.user._id;

    if (!courseId || !rating || !thoughts || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "invalid Data",
      });
    }

    const UserExists = await User.findById(studentId);

    if (!UserExists || !UserExists.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Student has not enrolled in this course",
      });
    }

    const RatingandThought = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseRatings: {
            userId: studentId,
            rating: rating,
            thoughts: thoughts,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Rating and thoughts added",
      RatingandThought,
    });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

const streamVideoURL = async (req, res, next) => {
  const { courseId, moduleId, lessonId } = req.query;

  if (!courseId || !moduleId || !lessonId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing parameters" });
  }

  try {
    console.log(
      `Fetching lesson: Course: ${courseId}, Module: ${moduleId}, Lesson: ${lessonId}`
    );

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const module = course.courseContent.find((m) => m.moduleId === moduleId);
    if (!module)
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });

    const lesson = module.moduleContent.find((l) => l.lessonId === lessonId);
    if (!lesson)
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });

    const lessonUrl = lesson.lessonContent;
    const fileKey = lessonUrl.split(".com/")[1]; // Extract fileKey
    if (!fileKey)
      return res
        .status(400)
        .json({ success: false, message: "Invalid S3 URL format" });

    // ✅ 5. Generate pre-signed URL
    const signedUrl = await generateSignedUrl(fileKey);

    res.json({
      success: true,
      videoURL: signedUrl,
      contentType: fileKey.ContentType,
    });
  } catch (error) {
    CommonServerError(error, req, res, next);
  }
};

module.exports = {
  userEnrolledCourses,
  coursePaymentService,
  verifyPaymentStatus,
  updateStudentCourseProgress,
  getStudentCourseProgress,
  studentRatingandThoughts,
  enrollFreeCourse,
  streamVideoURL,
};

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../Models/Payment');
const User = require('../Models/User');
const Course = require('../Models/Course');
const CourseProgress = require('../Models/CourseProgress');

exports.stripeWebhooks = async (req, res) => {
  console.log('Webhook received');
  
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    console.error('No Stripe signature found in headers');
    return res.status(400).send('No Stripe signature found');
  }
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).send('Webhook secret not configured');
  }
  
  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('Event verified:', event.type);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':

        const session = event.data.object;
        console.log('Checkout session completed');
      
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
          const { paymentId, userId, courseId } = paymentIntent.metadata;
      
          if (!paymentId || !userId || !courseId) {
            console.error('Missing metadata: ', { paymentId, userId, courseId });
            return res.status(400).json({ received: true });
          }
      
          // ✅ Update Payment Status
          const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            {
              paymentStatus: 'completed',
              transactionId: session.payment_intent,
            },
            { new: true }
          );
      
          // ✅ Enroll Student into Course
          const course = await Course.findById(courseId);
          const firstModuleId = course.courseContent?.[0]?.moduleId;

          if (!course) {
            console.error("Course not found:", courseId);
            return res.status(404).json({ received: true });
          }
    

          // ✅ Update User's Enrolled Courses
          if (!course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId);
            await course.save();
            console.log(`Student ${userId} enrolled in course ${courseId}`);
          
            // ✅ Update user.enrolledCourses too!
            await User.findByIdAndUpdate(userId, {
              $addToSet: { enrolledCourses: courseId },
            });
          }
          
      
          // ✅ Create CourseProgress (optional but good practice)
          const progressExists = await CourseProgress.findOne({ courseId, userId });
          if (!progressExists) {
            await CourseProgress.create({ courseId,
                                         userId,
                                         completedLectures: [],
                                         moduleId: firstModuleId,
                                        });
          }
      
          return res.status(200).json({ received: true, payment: updatedPayment ,
                                        message:"Payment and enrollment done successfully "
          });
      
        } catch (error) {
          console.error('Error in checkout.session.completed:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
          break;      
        
      case 'payment_intent.payment_failed':
        try {
          const failedPaymentIntent = event.data.object;
          console.log('Payment failed event received');
          console.log('Failed Payment Intent ID:', failedPaymentIntent.id);
          console.log('Failed Payment Intent metadata:', failedPaymentIntent.metadata);
          
          const { paymentId } = failedPaymentIntent.metadata;
          
          if (!paymentId) {
            console.error('No paymentId found in failed payment intent metadata');
            return res.status(400).json({ received: true });
          }
          
          // Update payment status to 'failed'
          const updatedFailedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            { paymentStatus: 'failed' },
            { new: true }
          );
            return res.status(500).json({error: updatedFailedPayment});        
          
        } catch (error) {
          console.error('Error processing failed payment intent:', error);
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error(`Error processing webhook event ${event.type}:`, error);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
}
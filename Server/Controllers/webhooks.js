require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Course = require('../Models/Course');
const Payment = require("../Models/Payment");
const User = require("../Models/User");

const stripeWebhooks = async (req,res,next)=>{

    const sig = req.headers['stripe-signature'];

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

     // Handle the event

     try{
  switch (event.type) {


    case "checkout.session.completed": {
        const session = event.data.object;
        const paymentId = session.metadata?.paymentId;

        if (!paymentId) {
            console.error("Missing paymentId in metadata.");
            return res.status(400).json({ error: "Invalid metadata" });
        }

        // Fetch payment data from DB
        const paymentData = await Payment.findById(paymentId);
        if (!paymentData) {
            console.error("Payment record not found.");
            return res.status(404).json({ error: "Payment record not found" });
        }

        // Update status
        paymentData.paymentStatus = "completed";
        await paymentData.save();

        break;
    }


    case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
    
        // Fetch the session details from Stripe (Handles metadata retrieval safely)
        const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId });
    
        if (!sessions.data.length) {
            console.error("No checkout session found for paymentIntent:", paymentIntentId);
            return res.status(400).json({ error: "No session found" });
        }
    
        const session = sessions.data[0]; // Take the first session if multiple
        console.log("✅ Checkout Session Fetched:", session.id);
        const paymentId = session.metadata?.paymentId;
    
        if (!paymentId) {
            console.error("Missing paymentId in metadata.");
            return res.status(400).json({ error: "Invalid metadata" });
        }
    
        // Retrieve Payment, User, and Course documents from the database
        const paymentData = await Payment.findById(paymentId);
        if (!paymentData) {
            console.error("Payment record not found.");
            return res.status(404).json({ error: "Payment record not found" });
        }
    
        const userData = await User.findById(paymentData.userId);
        const courseData = await Course.findById(paymentData.courseId.toString());
    
        if (!userData || !courseData) {
            console.error("User or Course not found.");
            return res.status(404).json({ error: "User or Course not found" });
        }
    
        // Add User to Course and Course to User only if not already enrolled
        if (!courseData.enrolledStudents.includes(userData._id)) {
            courseData.enrolledStudents.push(userData._id);
            await courseData.save();
        }
    
        if (!userData.enrolledCourses.includes(courseData._id)) {
            userData.enrolledCourses.push(courseData._id);
            await userData.save();
        }
    
        // Mark payment as completed
        paymentData.paymentStatus = "completed";
        await paymentData.save();
    
        console.log(`Payment completed for user ${userData._id} in course ${courseData._id}`);
        break;
    }
    

    case 'payment_intent.payment_failed':{
      
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
  
        const session = await stripe.checkout.sessions.list({
          payment_intent:paymentIntentId,
        })
        const {paymentId} = session.data[0].metadata;
        const paymentData = await Payment.findById(paymentId);

        paymentData.paymentStatus = "failed";
        await paymentData.save();
  
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
       
   }

   // Return a response to acknowledge receipt of the event
  res.json({received: true});
    }
  catch(err){
    console.log("Error in stripe webhooks",err);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false,
    });
   }
}
module.exports = stripeWebhooks;
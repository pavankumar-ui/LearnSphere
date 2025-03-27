require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Course = require('../Models/Course');
const Payment = require("../Models/Payment");
const User = require("../Models/User");

const stripeWebhooks = async (req,res,next)=>{

    const sig = request.headers['stripe-signature'];

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }

     // Handle the event

     try{
  switch (event.type) {
    case 'payment_intent.succeeded':
        {
                const paymentIntent = event.data.object;
                  const paymentIntentId = paymentIntent.id;


                  //to get session MetaData//
                    const session = await stripe.checkout.sessions.list({
                     payment_intent:paymentIntentId,
               })
               const { paymentId } = session.data[0].metadata;

      const paymentData = await Payment.findById(paymentId);
      const userData = await User.findById(paymentData.userId);
      const courseData = await Course.findById(paymentData.courseId.toString());

           courseData.enrolledStudents.push(userData._id);
           await courseData.save();

           userData.enrolledCourses.push(courseData._id);
            await userData.save();
        
            paymentData.paymentStatus = "completed";
            await paymentData.save();

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
  response.json({received: true});
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
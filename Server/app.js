require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/DbConfig.js");
const indexRoutes = require("./Routes/index");
const helmet = require("helmet");
const app = express();
const port = process.env.PORT || 5001;
const webhookController = require('./Controllers/webhooks');
//const stripeWebhooks = require('./Controllers/webhooks');

const corsOptions = {
  origin: process.env.CLIENT_URL,
  method: "GET,POST,PUT,DELETE",
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
};



connectDB();


// Webhook route - MUST be before any body parsers
app.post('/stripe', 
  express.raw({ type: 'application/json' }), 
  webhookController.stripeWebhooks
);


app.use(cors(corsOptions));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; connect-src 'self' https://api.stripe.com https://hooks.stripe.com; 'self' https://learnsphere-content-uploads.s3.ap-south-1.amazonaws.com; img-src 'self' data: https:; object-src 'none';"
  );
  next();
});


app.use("/api/v1/WebSphere/", indexRoutes);


app.get("/api/v1/WebSphere/working",(req,res)=>res.json({message:"i am working in vercel"}));




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

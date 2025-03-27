require("dotenv").config();
const express = require("express");
const cors  = require("cors");
const  connectDB = require("./Config/DbConfig.js");
const indexRoutes = require("./Routes/index");
const cloudinary = require("./Config/cloudinary.js");
const app = express();
const port = process.env.PORT || 5001;


const corsOptions={
       origin: process.env.CLIENT_URL || "http://localhost:5173",
       method: "GET,POST,PUT,DELETE",
       credentials:true,
}

 connectDB();
 

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/v1/WebSphere/",indexRoutes);


app.listen(port,()=>{
       console.log(`Server is running on port ${port}`);
});



require('dotenv').config();
const mongoose = require("mongoose");

const connectDB = async () => {

   await  mongoose
    .connect(`${process.env.MONGO_URI}/learnsphere`)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => console.log(err.message));
}

module.exports = connectDB;
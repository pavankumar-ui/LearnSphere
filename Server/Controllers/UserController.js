const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackList = require("../Models/Blacklist.js");
const cloudinary = require("../Config/Cloudinary");
const crypto = require("crypto");
const CommonServerError = require("../Utils/CommonServerError.js");
const { date } = require("joi");

const Register = async (req, res, next) => {
  console.log("Received request body:", req.body);

  const { name, email, password, role } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
  try {
    //to check if the user exists in the database//
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(400)
        .json({ message: "User already exists", success: false });

    let registerData = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await registerData.save();

    return res.status(201).json({
      message: "User Registered Successfully",
      success: true,
      user: registerData,
    });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

const Login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });

    //to check if email is valid//
    if (!user)
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });

    const checkPassword = user.password;

    //to check if password is valid//
    const isPasswordValid = await bcrypt.compare(password, checkPassword);

    if (!isPasswordValid)
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });

    //to process login if user is valid//

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successfully",
      success: true,
      userId: user._id,
      role: user.role,
      token: token,
    });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

const getProfileData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    console.log(user);

    if (!user)
      return res.status(404).json({
        message: "user not found",
        success: false,
      });

    return res.status(200).json({
      message: "user profile data",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        profileImage: user.profileImage,
        college: user.college,
        company: user.company,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    CommonServerError(err, req, res, next);
  }
};

const updateProfileData = async (req, res, next) => {
  try {
    const updatedData = {};

    // ✅ Fetch the user by ID
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // ✅ Append only the fields that have data
    if (req.body.name) updatedData.name = req.body.name;
    if (req.body.email) updatedData.email = req.body.email;
    if (req.body.college) updatedData.college = req.body.college;
    if (req.body.companyName) updatedData.companyName = req.body.companyName;
    if (req.body.designation) updatedData.designation = req.body.designation;

    const uploadToCloudinary = async (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    // ✅ Handle image upload
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer); // ✅ Upload to Cloudinary
      console.log("Cloudinary upload result:", imageUrl);

      // ✅ Assign the uploaded image URL to profileImage
      if (imageUrl && imageUrl.secure_url) {
        updatedData.profileImage = imageUrl.secure_url;
      } else {
        console.error("Image upload failed. No URL returned.");
      }
    }

    // ✅ Use `findOneAndUpdate` with proper options
    const changedData = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    // ✅ Send the updated profile data as response
    return res.status(200).json({
      message: "User profile updated successfully",
      success: true,
      user: changedData,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({
      message: "Failed to update profile",
      success: false,
      error: err.message,
    });
  }
};

const Logout = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || token === "") {
    return res.status(400).json({ message: "Token not found", success: false });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const expiryTime = new Date(decode.exp * 1000);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Add the token to blacklist
    const blackListedToken = new blackList({ token: hashedToken, expiryTime });
    await blackListedToken.save();

    return res
      .status(200)
      .json({ message: "Logout Successfully", success: true });
  } catch (err) {
    next(err);
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

module.exports = {
  Register,
  Login,
  getProfileData,
  updateProfileData,
  Logout,
};

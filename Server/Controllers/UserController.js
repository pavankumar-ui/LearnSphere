const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackList = require("../Models/Blacklist.js");
const crypto = require("crypto");
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
      role
    });
    await registerData.save();

    return res.status(201).json({
      message: "User Registered Successfully",
      success: true,
      user: registerData,
    });
  } catch (error) {
    console.log(error);
    next(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
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
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
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
    console.log(err);
    next(err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const updateProfileData = async (req, res, next) => {
  try {
    const updatedData = {};

    const user = await User.findOne({ _id: req.user._id });

    if (!user)
      return res.status(404).json({
        message: "user not found",
        success: false,
      });

    if (req.body.name) updatedData.name = req.body.name;
    if (req.body.email) updatedData.email = req.body.email;
    if (req.body.college) updatedData.college = req.body.college;
    if (req.body.company) updatedData.company = req.body.company;
    if (req.body.profileImage) updatedData.profileImage = req.body.profileImage;
    if (req.body.designation) updatedData.designation = req.body.designation;
    updatedData.updatedAt = Date.now();

    const changedData = await User.findOneAndUpdate(
      { _id: req.user._id },
      updatedData
    );
    await changedData.save();

    return res.status(200).json({
      message: "User profile Updated Successfully",
      success: true,
      UpdatedData: changedData,
    });
  } catch (err) {
    console.log(err);
    next(err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
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

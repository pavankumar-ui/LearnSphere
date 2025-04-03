const User = require("../Models/User");
const Instructoraccess = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const roleResponse = await User.findOne({ _id: userId });

    if (roleResponse.role !== "instructor") {
      return res.status(401).json({
        message: "You are not authorized to access this route",
        success: false,
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

module.exports = Instructoraccess;

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../Models/User.js");
const blackList = require("../Models/Blacklist");
const TokenExpire = require("./tokenExpire.js");

const ValidateToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ message: "Token not found", success: false });
  }
  // Remove "Bearer " prefix and trim
  token = token.replace("Bearer ", "").trim();
  try {
    // Hash the token correctly
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // Check if the token is blacklisted
    const isBlacklisted = await blackList.findOne({ token: hashedToken });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted, please login again",
        success: false,
      });
    }
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by _id
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      TokenExpire(error, req, res, next);
    } else {
      return res.status(401).json({ error: "Invalid token", success: false });
    }
  }
};

module.exports = ValidateToken;

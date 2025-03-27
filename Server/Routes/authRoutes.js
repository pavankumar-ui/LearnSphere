const express = require('express');
const authRoutes = express.Router();
const { Register,
    Login,
    getProfileData,
    Logout,
    updateProfileData } = require("../Controllers/UserController");
const validateToken = require("../Middlewares/validateToken");

authRoutes.post("/register", Register);
authRoutes.post("/login", Login);
authRoutes.get("/profile", validateToken, getProfileData);
authRoutes.put("/profile", validateToken, updateProfileData);
authRoutes.post("/logout", Logout);


module.exports = authRoutes;
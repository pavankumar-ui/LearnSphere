const express = require('express');
const authRoutes = express.Router();
const { Register,
    Login,
    getProfileData,
    Logout,
    updateProfileData } = require("../Controllers/UserController");
const validateToken = require("../Middlewares/validateToken");
const { ProfileField } = require("../Config/Multer"); //multer setup

authRoutes.post("/register", Register);
authRoutes.post("/login", Login);
authRoutes.get("/profile", validateToken, getProfileData);
authRoutes.put("/profile", validateToken,ProfileField,updateProfileData);
authRoutes.post("/logout",validateToken, Logout);


module.exports = authRoutes;
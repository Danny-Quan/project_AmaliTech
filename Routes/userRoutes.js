const express = require("express");
const { protect } = require("../Middlewares/AuthMiddleware");
const router = express.Router();
const {
  loginUser,
  signupUser,
  logoutUser,
  forgotPassword,
  verifyUser,
  resetPassword,
  sendVerificationEmail,
  getLoginStatus,
} = require("../Controllers/userController");


router.post("/login", loginUser);
router.get("/loginStatus", getLoginStatus);
router.post("/register", signupUser);
router.post("/logout", logoutUser);
router.post("/send-verification-email", protect, sendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/verify-user/:email/:token", verifyUser);
router.post("/reset-password/:email/:token", resetPassword);

module.exports = router;

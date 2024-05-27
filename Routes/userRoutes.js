const express = require("express");
const {
  loginUser,
  signupUser,
  logoutUser,
  forgotPassword,
  verifyEmail,
  resetPassword,
} = require("../Controllers/userController");
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", signupUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-email/:email/:token", verifyEmail);
router.post("/reset-password/:email/:token", resetPassword);

module.exports = router;

const createCookie = require("../Utils/cookieHandler");
const { createJWTtoken, HashToken } = require("../Utils/createTokens");
const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const User = require("./../Models/userModel");

exports.signupUser = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, confirmPassword } = req.body;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }
    if (password.length < 6) {
      throw new Error("password cannot be less than 6 character");
    }
    if (password !== confirmPassword) {
      throw new Error("passwords do not match");
    }
    const userData = {
      firstname,
      lastname,
      email,
      password,
    };

    //checking if user email already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("user with this email already exist");
    }

    //create user if not exist
    const user = await User.create(userData);
    if (!user) {
      throw new Error("An error occured while creating user");
    }

    //create JWT token and set cookies after creating user
    const Token = createJWTtoken(user._id);
    createCookie(res, Token);

    const emailVerificationToken =
      crypto.randomBytes(32).toString("hex") + user._id;

    //hash emailVerificationToken and save to the database
    const hashedVerificationToken = HashToken(emailVerificationToken);
    user.verificationToken = hashedVerificationToken;
    user.tokenExpiresAt = Date.now() + 60 * 60 * 1000; //token expires in 1 hr
    await user.save();

    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    //finding user with email and including the password field since it was set to a select of false in the user schema 
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Enter a valid email or password");
    }
    //checking for correctness of password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new Error("Invalid credentials");

    if (user && isPasswordCorrect) {
      const token = createJWTtoken(user._id);
      createCookie(res, token);
      res.status(200).json({
        status: "success",
        user,
        token,
      });
    }
  } catch (error) {
    res.status(402);
    next(error);
  }
};

exports.logoutUser = async () => {
  try {
  } catch (error) {}
};

exports.forgotPassword = async () => {
  try {
  } catch (error) {}
};
exports.resetPassword = async () => {
  try {
  } catch (error) {}
};

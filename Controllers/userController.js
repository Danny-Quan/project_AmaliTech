const createCookie = require("../Utils/cookieHandler");
const { createJWTtoken, HashToken } = require("../Utils/createTokens");
const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const User = require("./../Models/userModel");
const sendMail = require("../Utils/sendMail");

exports.signupUser = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }
    if (password.length < 6) {
      throw new Error("password cannot be less than 6 character");
    }
    if (password !== confirmPassword) {
      throw new Error("passwords do not match");
    }
    const userData = {
      username,
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

    const emailVerificationToken =
      crypto.randomBytes(32).toString("hex") + user._id;

    //hash emailVerificationToken and save to the database
    const hashedVerificationToken = HashToken(emailVerificationToken);
    user.verificationToken = hashedVerificationToken;
    user.tokenExpiresAt = Date.now() + 60 * 60 * 1000; //token expires in 1 hr
    await user.save();

    //send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/${user.email}/${emailVerificationToken}`;
    await sendMail(
      "Welcome to Lizzy's Files",
      user.email,
      "welcomeUser",
      user.username.split(" ")[0],
      verificationUrl
    );

    res.status(201).json({
      status: "success",
      user,
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

exports.verifyUser = async (req, res, next) => {
  try {
    const { token, email } = req.params;
    const hashedVerificationToken = HashToken(token);
    const user = await User.findOne({ email });
    if (!user) throw new Error("user not found");
    if (user.isVerified) throw new Error("user already verified");
    if (
      user.verificationToken === hashedVerificationToken &&
      user.tokenExpiresAt < Date.now()
    ) {
      user.isVerified = true;
      await user.save();
    } else {
      throw new Error("Invalid Verification token or has expired");
    }
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.sendVerificationEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error("user not found");

    //create verification token
    const verificationToken =
      crypto.randomBytes(32).toString("hex") + req.user._id;

    //hash token and save
    const hashedToken = HashToken(verificationToken);
    user.verificationToken = hashedToken;
    user.tokenExpiresAt = Date.now() + 60 * 60 * 1000;
    await user.save();

    // verification URL
    const verificationURL = `${process.env.FRONTEND_URL}/verify/${req.user.email}/${verificationToken}`;
    //send Email
    await sendMail(
      "Verify Your Email",
      user.email,
      "verifyEmail",
      user.username.split(" ")[0],
      verificationURL
    );
    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    await res.clearCookie("userInfo");
    return res.status(200).json({
      message: "logout successfull",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("email is required");
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new Error("User does not exist");
    }

    const passwordResetToken =
      crypto.randomBytes(32).toString("hex") + existingUser._id;
    const hashedToken = HashToken(passwordResetToken);

    existingUser.resetToken = hashedToken;
    existingUser.tokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1hr
    await existingUser.save();

    //reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset/${existingUser.email}/${passwordResetToken}`;

    //send password reset email
    sendMail(
      "Reset Password",
      existingUser.email,
      "resetPassword",
      existingUser.username.split(" ")[0],
      resetUrl
    );

    res.status(200).json({
      status: "success",
      existingUser,
      passwordResetToken,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // console.log(req.params)
    const { token, email } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      throw new Error("All fields are required");
    }
    if (password !== confirmPassword) {
      throw new Error("passwords do not match");
    }

    const hashedResetToken = HashToken(token);
    const user = await User.findOne({ email });
    if (!user) throw new Error("user not found");

    if (
      user.resetToken === hashedResetToken &&
      Number(user.tokenExpiresAt) > Date.now()
    ) {
      user.password = password;
      user.resetToken = undefined;
      user.tokenExpiresAt = undefined;
      await user.save();
    } else {
      throw new Error("reset token is invalid or has expired");
    }

    res.status(200).json({
      status: "success",
      message: "password reset successfull",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

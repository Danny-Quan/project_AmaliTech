const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "User must enter username"],
    },
    email: {
      type: String,
      required: [true, "User must enter an email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "password field is required"],
      minLength: [6, "user password must not be less than 6 characters"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
    },
    verificationToken: {
      type: String,
    },
    tokenExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

//creating a 'pre' document middleware for mongoose
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;

  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;

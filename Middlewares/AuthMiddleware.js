const JWT = require("jsonwebtoken");
const User = require("./../Models/userModel");

const protect = async (req, res, next) => {
  let token;
  try {
    //check for existance of cookie
    if (req.cookies && req.cookies.userInfo) {
      token = req.cookies.userInfo;
    }
    //prompt user to login if cookie not found
    if (!token) {
      throw new Error("please login to continue");
    }
    //verify JWT token if token is available on cookie
    const decode = JWT.verify(token, process.env.JWT_SECRET_KEY);
    //throw error if cookie is invalid or has expired
    if (!decode) {
      throw new Error("Token expired, please login to continue");
    }
    console.log(decode);
    //find user in database if token is valid and
    //exclude password field in the query
    const currentUser = await User.findById(decode.id).select("-password");
    //throw error if user not found
    if (!currentUser) throw new Error("user not found");
    //assign currentUser to any request that will be made and call it user
    req.user = currentUser;
    console.log(req.user)
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const adminRoleAuth = async (req, res, next) => {
  try {
    //check if user's role is admin. if not throw an error
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      throw new Error("Not authorized as an admin");
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const verifiedUsersAuth = async (req, res, next) => {
  try {
    //check if user is verified. if not throw an error
    if (req.user && req.user.isVerified) {
      next();
    } else {
      throw new Error("please verify your account to continue");
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};

module.exports = {
  protect,
  adminRoleAuth,
  verifiedUsersAuth,
};

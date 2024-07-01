const JWT = require("jsonwebtoken");
const crypto = require("node:crypto");

//create jwt
const createJWTtoken = (id) => {
  const Token = JWT.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return Token;
};

//hash  tokens
const HashToken = (token) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token.toString())
    .digest("hex");
  return hashedToken;
};

module.exports = {
  createJWTtoken,
  HashToken,
};

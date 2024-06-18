const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ErrorHandlingMiddleware = require("./Middlewares/ErrorHandlingMiddleware");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimiter = require("express-rate-limit");

const app = express();
const userRoutes = require("./Routes/userRoutes");
const fileRoutes = require("./Routes/FileRoutes");

//rate limiter configuration here
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, please try again in 15 minues time",
  statusCode: 429,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(mongoSanitize()); // prevention agains noSql injection
app.use(helmet()); // Setting HTTP response headers
app.use(xss()); // prevention agains cross site scripting
app.use(limiter); // for preventing repeated requests to API

//imported routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("hello to backend");
});

//using global error handler. It receives and process all errors passed to next()
app.use(ErrorHandlingMiddleware);

module.exports = app;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ErrorHandlingMiddleware = require("./Middlewares/ErrorHandlingMiddleware");
const mongoSanitize= require('express-mongo-sanitize')
const helmet= require('helmet')

const app = express();
const userRoutes = require("./Routes/userRoutes");
const fileRoutes = require("./Routes/FileRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(mongoSanitize()) // prevention agains noSql injection
app.use(helmet()) // Setting HTTP response headers


//imported routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("hello to backend");
});

//using global error handler. It receives and process all errors passed to next()
app.use(ErrorHandlingMiddleware);

module.exports = app;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./Routes/userRoutes");
const ErrorHandlingMiddleware = require("./Middlewares/ErrorHandlingMiddleware");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//imported routes
app.use("/api/v1/users", userRoutes);

//using global error handler. It receive and parse all errors passed to next
app.use(ErrorHandlingMiddleware);

module.exports = app;

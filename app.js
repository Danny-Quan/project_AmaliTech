const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ErrorHandlingMiddleware = require("./Middlewares/ErrorHandlingMiddleware");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const path= require('path')

const app = express();
const userRoutes = require("./Routes/userRoutes");
const fileRoutes = require("./Routes/FileRoutes");

//rendering frontend
const staticPath = path.join(__dirname, 'public/build');
console.log(staticPath)
app.use(express.static(path.join(__dirname,'public/build')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(
//   cors({
//     // origin: "https://amalitech-lizzy-file-hub.netlify.app",
//     origin:"http://localhost:3000",
//     credentials: true,
//   })
// );
app.use(mongoSanitize()); // prevention agains noSql injection
app.use(helmet()); // Setting HTTP response headers
app.use(xss()); // prevention agains cross site scripting

//imported routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/files", fileRoutes);

// Catch-all route to handle all other requests (serve your frontend application)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
});
// app.get("/", (req, res) => {
//   res.json({
//     message:"Welcome to Lizzy's file Hub api"
//   });
// });

//using global error handler. It receives and process all errors passed to next()
app.use(ErrorHandlingMiddleware);

module.exports = app;

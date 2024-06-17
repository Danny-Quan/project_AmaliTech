const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const DB = process.env.CLOUD_DATABASE.replace(
  "<password>",
  process.env.DB_PASSWORD
);
mongoose
  .connect(DB)
  .then((data) => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
    console.log("Error connecting to database");
  });

//creating server
const server = app.listen(process.env.PORT ?? 8080, () => {
  console.log(`server running on port ${process.env.PORT ?? 8080}`);
});

//handing uncaught Exceptions from synchronous requests
process.on("uncaughtException", (err) => {
  server.close(process.exit(1));
  console.log(err.message);
});

//handing unhandled Rejections from asynchronous requests
process.on("unhandledRejection", (err) => {
  server.close(process.exit(1));
  console.log(err.message);
});

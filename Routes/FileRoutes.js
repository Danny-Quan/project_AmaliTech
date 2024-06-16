const express = require("express");
const { protect, adminRoleAuth, verifiedUsersAuth } = require("../Middlewares/AuthMiddleware");
const router = express.Router();
const loadFile = require("../Utils/fileUpload");
const {
  uploadFile,
  getAllFiles,
  getSingleFile,
  updateFile,
  deleteFile,
  searchFile,
  downloadFile,
  sendFileToEmail
} = require("../Controllers/FileController");


router.get("/all-files", getAllFiles);
router.get("/single-file/:fileId", getSingleFile);
router.get("/search/:key", searchFile);
router.get("/download/:fileId/:filename", protect,verifiedUsersAuth, downloadFile);
router.post('/send-file',protect,verifiedUsersAuth,sendFileToEmail)

//protected routes
router.use(protect, adminRoleAuth); //these middlewares will be used for all the routes below
router.post("/upload-file",loadFile, uploadFile);
router.patch("/update-file/:fileId", loadFile, updateFile);
router.delete("/delete-file/:fileId", deleteFile);

module.exports = router;

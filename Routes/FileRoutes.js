const express = require("express");
const {
  uploadFile,
  getAllFiles,
  getSingleFile,
  updateFile,
  deleteFile,
  searchFile,
} = require("../Controllers/FileController");
const loadFile = require("../Utils/fileUpload");
const { protect, adminRoleAuth } = require("../Middlewares/AuthMiddleware");
const router = express.Router();

//protect middleware here
router.post("/upload-file", protect, adminRoleAuth, loadFile, uploadFile);
router.get("/all-files", getAllFiles);
router.get("/single-file/:fileId", getSingleFile);
router.patch("/update-file/:fileId", loadFile, updateFile);
router.delete("/delete-file/:fileId", deleteFile);

module.exports = router;

const express = require("express");
const {
  uploadFile,
  getAllFiles,
  getSingleFile,
  updateFile,
  deleteFile,
  searchFile,
} = require("../Controllers/FileController");
const router = express.Router();

//protect middleware here
router.post("/upload-file", uploadFile);
router.get("/all-files", getAllFiles);
router.get("/single-file", getSingleFile);
router.patch("/update-file", updateFile);
router.delete("/delete-file", deleteFile);

module.exports = router;

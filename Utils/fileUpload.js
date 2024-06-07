const multer = require("multer");

//configuring multer storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `files_${Date.now()}_${file.originalname}`
    );
  },
});

const upload = multer({
  storage: multerStorage,
});

const loadFile = upload.single("filePath");

module.exports = loadFile;

const multer = require("multer");

//configuring multer storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `files-${Date.now()}-${Math.random() * 10000}-${file.originalname}`
    );
  },
});

const upload = multer({
  storage: multerStorage,
});

const loadFile = upload.single("filePath");

module.exports = loadFile;

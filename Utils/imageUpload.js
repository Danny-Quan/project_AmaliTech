const multer = require("multer");

//configuring multer storage
const FileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `files-${Date.now()}-${Math.random() * 10000}-${file.originalname}`
    );
  },
});

const upload = multer({
  storage: FileStorage,
});

module.exports = upload;

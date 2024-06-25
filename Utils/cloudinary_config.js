const cloudinary = require("cloudinary").v2;

//configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dwrm74dkp",
  api_key: process.env.CLOUDINARY_API_KEY || 183872227145174,
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "kkWPcVam0PbJOrxgW0gSTzvHsJY",
});

module.exports = cloudinary;
